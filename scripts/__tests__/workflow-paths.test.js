/* eslint-env jest */
'use strict';

/**
 * Guards the workflows' `paths` filters against silent drift.
 *
 * The expensive workflows spell their filter twice — once per trigger — because GitHub Actions
 * supports no YAML anchors, and nothing enforces that the copies agree. Every failure mode here
 * is silent: a filter that drifts, that is too narrow, or that this file misreads leaves the job
 * never running, so a broken release ships with a green PR. Hence a parser that throws instead
 * of guessing, and a matcher that refuses pattern shapes it cannot model faithfully.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const WORKFLOWS = path.join(ROOT, '.github', 'workflows');

/** Tracked files, so the fixtures stay an inventory of real paths rather than guesses. */
const TRACKED = new Set(
  execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n'),
);

/** Workflows carrying a trigger-level `paths:` block, so a new one is guarded on arrival. */
function filteredWorkflows() {
  return fs
    .readdirSync(WORKFLOWS)
    .filter((file) => file.endsWith('.yml'))
    .filter((file) => /^ {4}paths:/m.test(fs.readFileSync(path.join(WORKFLOWS, file), 'utf8')))
    .sort();
}

/** Triggers that accept a paths filter at all — the count each file must supply a block for. */
function filterableTriggers(file) {
  const lines = fs.readFileSync(path.join(WORKFLOWS, file), 'utf8').split('\n');
  return lines.filter((line) => /^ {2}(pull_request|pull_request_target|push):/.test(line)).length;
}

/**
 * The `paths:` blocks of a workflow's triggers, in file order.
 *
 * Deliberately not a YAML parse: no YAML library is a declared dependency of this package.
 * Any entry it cannot read is a hard error rather than an end-of-block, because a parser that
 * quietly returns a short list makes every assertion below vacuously true — which is how the
 * first version of this file missed a pattern written in double quotes.
 */
function pathsBlocks(file) {
  const lines = fs.readFileSync(path.join(WORKFLOWS, file), 'utf8').split('\n');
  const blocks = [];
  lines.forEach((line, index) => {
    if (!/^ {4}paths:\s*(#.*)?$/.test(line)) return;
    const patterns = [];
    for (let i = index + 1; i < lines.length; i++) {
      const current = lines[i];
      if (/^\s*$/.test(current)) continue; // a blank line does not end a YAML sequence
      if (/^ {0,5}\S/.test(current)) break; // a dedent does
      if (/^ {6}#/.test(current)) continue;
      const entry = current.match(/^ {6}- (?:'([^']*)'|"([^"]*)"|([^'"#\s][^#]*?))\s*(?:#.*)?$/);
      if (!entry) {
        throw new Error(`${file}:${i + 1}: cannot read paths entry ${JSON.stringify(current)}`);
      }
      patterns.push(entry[1] ?? entry[2] ?? entry[3]);
    }
    blocks.push(patterns);
  });
  return blocks;
}

/**
 * Refuse the shapes this matcher would model differently from GitHub.
 *
 * GitHub documents `?`, `+` and `[]` for branch and tag filters but only `*` and `**` for path
 * filters, and a mid-pattern `**` is where a hand-rolled regex quietly disagrees with the real
 * implementation (`src/**\/*.ts` should match `src/a.ts`; a naive translation makes the slash
 * mandatory). Throwing keeps a future pattern from being silently mis-modelled.
 */
function assertModellable(pattern) {
  if (/[?+[\]]/.test(pattern)) {
    throw new Error(`${pattern}: ? + [] are branch-filter syntax, not path-filter syntax`);
  }
  if (pattern.replace(/(^|\/)\*\*$/, '').includes('**')) {
    throw new Error(`${pattern}: this matcher models only a trailing /**`);
  }
}

/** GitHub's filter-pattern semantics: `**` spans separators, `*` stops at one. */
function patternToRegExp(pattern) {
  assertModellable(pattern);
  const source = pattern
    .split('**')
    .map((part) =>
      part
        .split('*')
        .map((literal) => literal.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[^/]*'),
    )
    .join('.*');
  return new RegExp(`^${source}$`);
}

/** Whether a workflow with these patterns runs for a commit touching exactly `file`. */
function runsFor(patterns, file) {
  let included = false;
  for (const pattern of patterns) {
    const negated = pattern.startsWith('!');
    if (patternToRegExp(negated ? pattern.slice(1) : pattern).test(file)) included = !negated;
  }
  return included;
}

// Every input the two build jobs consume, and the noise they must ignore. `update-sdk-full`
// packs the SDK into the example app, so the pack's own inputs — including the config plugin
// and tsconfig, which `yarn build` compiles — reach both platforms. AdaptyDevtools is built by
// both workflows, and its android/ half reaches the iOS jobs too: RN autolinking runs the CLI's
// `config` unscoped, so it is not separable by platform.
const SHARED_INPUTS = [
  'src/adapty-handler.ts',
  'plugin/src/with-adapty.ts',
  'tsconfig.json',
  'tsconfig.build.json',
  'package.json',
  'yarn.lock',
  'scripts/build_and_install_pack.zsh',
  'examples/AdaptyDevtools/src/screens/Home.tsx',
  'examples/AdaptyDevtools/package.json',
  'examples/AdaptyDevtools/android/app/build.gradle',
  'examples/AdaptyDevtools/android/app/proguard-rules.pro',
];

// Neither job lints, type-checks the root, or runs jest — pr-validation owns all three, and it
// carries no paths filter of its own, so this guard runs on every PR regardless.
const SHARED_NOISE = [
  'README.md',
  'CONTRIBUTING.md',
  '.agents/skills/bump-native-sdk/SKILL.md',
  '.github/workflows/pr-validation.yml',
  '.github/workflows/publish-docs.yml',
  '.github/workflows/kids-mode-ios.yml',
  'scripts/__tests__/package-manifest.test.js',
  'jest.config.cjs',
  '.eslintrc.js',
  'examples/BasicExample/App.tsx',
  'examples/FocusJournalExpo/package.json',
];

// SwiftPM is iOS-only and no Android job builds the SwiftPM app, so all of it — android/
// included — belongs to the iOS workflow alone.
const IOS_ONLY = [
  'ios/RNAdapty.swift',
  'ios/AdaptyFlowViewManager.m',
  'Package.swift',
  'react-native-adapty-sdk.podspec',
  'examples/AdaptyDevtools/ios/Podfile',
  'examples/AdaptyDevtoolsSpm/package.json',
  'examples/AdaptyDevtoolsSpm/ios/AdaptyDevtoolsSpm.xcodeproj/project.pbxproj',
  'examples/AdaptyDevtoolsSpm/android/app/build.gradle',
];

// The SDK's own Android library: nothing on the iOS path compiles it.
const ANDROID_ONLY = [
  'android/build.gradle',
  'android/src/main/kotlin/com/adapty/react/AdaptyReactModule.kt',
];

describe.each(filteredWorkflows())('%s', (file) => {
  const blocks = pathsBlocks(file);

  it('filters every trigger that accepts a paths filter', () => {
    expect(blocks).toHaveLength(filterableTriggers(file));
  });

  it('spells every copy identically', () => {
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) expect(block).toEqual(blocks[0]);
  });

  it('lists every `!` pattern where it actually subtracts', () => {
    blocks[0].forEach((pattern, index) => {
      if (!pattern.startsWith('!')) return;
      const probe = pattern.slice(1).replace(/\*+$/, 'probe');
      const positivesMatching = (list) =>
        list.filter((p) => !p.startsWith('!') && patternToRegExp(p).test(probe));
      // Something before it must match, or the exclusion subtracts from nothing...
      expect(positivesMatching(blocks[0].slice(0, index)).length).toBeGreaterThan(0);
      // ...and nothing after it may, or GitHub's last-match-wins puts the path back.
      expect(positivesMatching(blocks[0].slice(index + 1))).toEqual([]);
    });
  });

  it('runs when the workflow itself changes', () => {
    expect(runsFor(blocks[0], `.github/workflows/${file}`)).toBe(true);
  });
});

describe('ios-builds.yml selects', () => {
  const [patterns] = pathsBlocks('ios-builds.yml');

  it.each([...SHARED_INPUTS, ...IOS_ONLY])('runs for %s', (file) => {
    expect(runsFor(patterns, file)).toBe(true);
  });

  it.each([...SHARED_NOISE, ...ANDROID_ONLY, '.github/workflows/android-builds.yml'])(
    'skips %s',
    (file) => {
      expect(runsFor(patterns, file)).toBe(false);
    },
  );
});

describe('android-builds.yml selects', () => {
  const [patterns] = pathsBlocks('android-builds.yml');

  it.each([...SHARED_INPUTS, ...ANDROID_ONLY])('runs for %s', (file) => {
    expect(runsFor(patterns, file)).toBe(true);
  });

  it.each([...SHARED_NOISE, ...IOS_ONLY, '.github/workflows/ios-builds.yml'])(
    'skips %s',
    (file) => {
      expect(runsFor(patterns, file)).toBe(false);
    },
  );
});

/**
 * Everything tracked that neither build filter selects, classified once so that new files
 * cannot join the list quietly.
 *
 * The filters are allowlists, and an allowlist fails open: a build input nobody thinks to add
 * makes the release-only jobs skip in silence, which is the one failure this whole file exists
 * to prevent. The fixtures above cannot see it — they are a hand-written list, so they only
 * ever check what someone already thought of. This closes the loop from the other side: every
 * tracked path must be either selected by a filter or named here as something the builds cannot
 * consume. A new one is a failing test until somebody decides which it is.
 */
const NOT_A_BUILD_INPUT = {
  // Unbuilt example apps (the workflows build AdaptyDevtools and AdaptyDevtoolsSpm only),
  // agent skills, issue templates, and the jest-only trees.
  prefixes: [
    'examples/BasicExample/',
    'examples/ExpoGoWebMock/',
    'examples/FocusJournalExpo/',
    '.agents/',
    '.claude/',
    '.github/ISSUE_TEMPLATE/',
    'jest/',
    'scripts/__tests__/',
  ],
  // Lint, format, jest and Expo-plugin entry points: no step in either workflow runs them.
  files: [
    '.eslintrc.js',
    '.gitignore',
    '.prettierignore',
    '.prettierrc',
    '.watchmanconfig',
    'LICENSE',
    'app.plugin.js',
    'babel.config.js',
    'jest.config.cjs',
    'tsconfig.spec.json',
    '.github/CODEOWNERS',
    '.github/workflows/pr-validation.yml',
    '.github/workflows/publish.yml',
    '.github/workflows/publish-docs.yml',
    '.github/workflows/kids-mode-ios.yml',
  ],
  suffixes: ['.md'], // documentation, wherever it lives
};

function classifiedAsNoise(file) {
  return (
    NOT_A_BUILD_INPUT.prefixes.some((prefix) => file.startsWith(prefix)) ||
    NOT_A_BUILD_INPUT.files.includes(file) ||
    NOT_A_BUILD_INPUT.suffixes.some((suffix) => file.endsWith(suffix))
  );
}

describe('every tracked file is either a build input or classified as noise', () => {
  const filters = ['ios-builds.yml', 'android-builds.yml'].map((file) => pathsBlocks(file)[0]);

  it('has no unclassified tracked path', () => {
    const orphans = [...TRACKED].filter(
      (file) => !filters.some((patterns) => runsFor(patterns, file)) && !classifiedAsNoise(file),
    );
    expect(orphans).toEqual([]);
  });

  // A stale entry is the mirror image: it makes the check above weaker than it reads.
  it.each(NOT_A_BUILD_INPUT.files)('%s still exists', (file) => {
    expect(TRACKED.has(file)).toBe(true);
  });

  it.each(NOT_A_BUILD_INPUT.prefixes)('%s still has tracked files', (prefix) => {
    expect([...TRACKED].some((file) => file.startsWith(prefix))).toBe(true);
  });
});

// The fixtures above are only evidence if they name files that exist; a rename would otherwise
// leave them asserting glob behaviour against paths the repo no longer has.
describe('fixtures', () => {
  it.each([...SHARED_INPUTS, ...SHARED_NOISE, ...IOS_ONLY, ...ANDROID_ONLY])(
    '%s is tracked',
    (file) => {
      expect(TRACKED.has(file)).toBe(true);
    },
  );
});
