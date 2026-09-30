import { ConfigPlugin, withPodfile } from 'expo/config-plugins';

// Expo's `@generated` marker format, minus the ` sync-<hash>` suffix of its begin line. Not
// CodeGenerator.mergeContents/removeContents: the block is indented like its anchor, a CRLF
// Podfile is handled, and repeated blocks are all removed, not only the first well-formed one.
const PODFILE_TAG = 'react-native-adapty-cocoapods';
const PODFILE_BLOCK_BEGIN = `# @generated begin ${PODFILE_TAG} - expo prebuild (DO NOT MODIFY)`;
const PODFILE_BLOCK_END = `# @generated end ${PODFILE_TAG}`;
// ios/adapty_podfile.rb holds the pod list and the spec repo. Required in the React Native CLI
// template's form for react_native_pods.rb: Pod::Executable running node's require.resolve.
const PODFILE_BLOCK_BODY = [
  "require Pod::Executable.execute_command('node', ['-p',",
  "  'require.resolve(",
  '    "react-native-adapty/ios/adapty_podfile.rb",',
  '    {paths: [process.argv[1]]},',
  "  )', __dir__]).strip",
  'adapty_disable_spm!',
];

const isBlockBegin = (line: string) =>
  line.trim().startsWith(`# @generated begin ${PODFILE_TAG} `);
const isBlockEnd = (line: string) => line.trim() === PODFILE_BLOCK_END;

// Removes BEGIN..END blocks (END pairs with the nearest open BEGIN); unpaired markers stay.
function removeCocoaPodsBlocks(lines: string[]): string[] {
  const kept: string[] = [];
  let begin = -1;
  for (const line of lines) {
    if (begin >= 0 && isBlockEnd(line)) {
      kept.length = begin;
      begin = -1;
    } else {
      if (isBlockBegin(line)) begin = kept.length;
      kept.push(line);
    }
  }
  return kept;
}

const podfileEol = (podfile: string) =>
  podfile.includes('\r\n') ? '\r\n' : '\n';

// Prebuild without --clean reuses ios/Podfile, so turning the option off must drop the block.
// An unclosed BEGIN is left as is: the Podfile is not changed beyond the complete blocks.
function stripCocoaPodsBlock(podfile: string): string {
  const lines = podfile.split(/\r?\n/);
  const stripped = removeCocoaPodsBlocks(lines);
  return stripped.length === lines.length
    ? podfile
    : stripped.join(podfileEol(podfile));
}

// Re-inserts the tagged block right before the first `use_native_modules!` call, in any target:
// it declares the RN pod and evaluates the podspec that reads `$AdaptyDisableSPM`, so a later
// adapty_disable_spm! raises at pod install. Not `use_expo_modules!`: an extension target with
// only that call, placed before the app target, would get the Adapty pods the helper declares.
function addCocoaPodsBlock(podfile: string): string {
  const eol = podfileEol(podfile);
  // Drop every BEGIN still left, only its line: an unclosed one (its block's extent is unknown)
  // or the outer one of nested markers, whose body and END stay. Nothing then pairs it with the
  // END of the block inserted below.
  const lines = removeCocoaPodsBlocks(podfile.split(/\r?\n/)).filter(
    line => !isBlockBegin(line),
  );
  // Expo templates assign the result: `config = use_native_modules!(config_command)`.
  const anchorIndex = lines.findIndex(line =>
    /^\s*(?:\w+\s*=\s*)?use_native_modules!/.test(line),
  );
  if (anchorIndex < 0) {
    throw new Error(
      '[react-native-adapty] `iosDisableSPM`: no `use_native_modules!` call found in ios/Podfile',
    );
  }

  const indent = lines[anchorIndex]?.match(/^\s*/)?.[0] ?? '';
  const block = [
    PODFILE_BLOCK_BEGIN,
    ...PODFILE_BLOCK_BODY,
    PODFILE_BLOCK_END,
  ].map(line => indent + line);

  lines.splice(anchorIndex, 0, ...block);
  return lines.join(eol);
}

// adapty_disable_spm! sets the podspec's internal `$AdaptyDisableSPM` and pins the Adapty pods.
export const withCocoaPodsIos: ConfigPlugin<boolean> = (config, enabled) => {
  return withPodfile(config, config => {
    const { contents } = config.modResults;
    if (enabled) {
      config.modResults.contents = addCocoaPodsBlock(contents);
      console.log(
        '[react-native-adapty] Switched iOS to the legacy CocoaPods pods',
      );
    } else {
      config.modResults.contents = stripCocoaPodsBlock(contents);
      if (config.modResults.contents !== contents) {
        console.log(
          '[react-native-adapty] Removed the legacy CocoaPods block from ios/Podfile',
        );
      }
    }
    return config;
  });
};
