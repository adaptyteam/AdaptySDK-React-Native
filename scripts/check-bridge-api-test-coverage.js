#!/usr/bin/env node

/**
 * API Coverage Checker
 *
 * Analyzes bridge integration test coverage by comparing:
 * - Methods defined in @adapty/core's declarations (generated from cross_platform.yaml)
 * - Methods covered by bridge samples in src/__tests__/integration/shared/bridge-samples/
 *
 * Exit codes:
 * - 0: All public API methods are covered
 * - 1: Some public API methods are missing tests
 */

const fs = require('fs');
const path = require('path');

// src/types/api.d.ts is only a re-export of @adapty/core, so the schema has to be
// read from the built core declarations. Keep this pointed at core: the method list
// is generated from cross_platform.yaml and lives there, not in this repo.
const API_TYPES_PATH = path.join(
  __dirname,
  '../node_modules/@adapty/core/dist/index.d.mts',
);
const BRIDGE_SAMPLES_DIR = path.join(__dirname, '../src/__tests__/integration/shared/bridge-samples');
// Methods that are internal and don't require test coverage
const INTERNAL_METHODS = new Set([
  'get_log_level',
  'get_sdk_version',
]);

// Pre-existing coverage gaps, inherited from the 4.0 flow round-trip work.
// These are JS->native calls issued from inside flow event handling and were
// never given bridge samples. Reported as warnings so this gate still fails on
// NEW gaps. Remove entries as samples are added; do not add entries without
// agreeing the debt first.
const KNOWN_UNCOVERED = new Set([
  'adapty_ui_open_url',
  'adapty_ui_request_app_review',
  'flow_view_did_answer_permission',
  'observer_purchase_did_start',
  'observer_purchase_did_finish',
  'observer_restore_did_start',
  'observer_restore_did_finish',
]);

/**
 * Extract all method names from api.d.ts Request types
 */
function extractApiMethods() {
  if (!fs.existsSync(API_TYPES_PATH)) {
    console.error(`❌ Cannot find @adapty/core declarations at ${API_TYPES_PATH}`);
    console.error('   Run `yarn install`, or build core into node_modules:');
    console.error('   BUILD_OUT_DIR=../AdaptySDK-React-Native/node_modules/@adapty/core/dist yarn build');
    process.exit(1);
  }

  const apiContent = fs.readFileSync(API_TYPES_PATH, 'utf8');
  const requestMatches = apiContent.matchAll(/'([^']+)\.Request':\s*\{[^}]*method:\s*'([^']+)'/gs);

  const methods = new Set();
  for (const match of requestMatches) {
    const methodName = match[2];
    methods.add(methodName);
  }

  if (methods.size === 0) {
    console.error(`❌ Extracted 0 methods from ${API_TYPES_PATH}.`);
    console.error('   The declaration format changed — fix the regex in extractApiMethods().');
    process.exit(1);
  }

  return Array.from(methods).sort();
}

/**
 * Extract all methods covered by bridge samples
 */
function extractTestedMethods() {
  const sampleFiles = fs.readdirSync(BRIDGE_SAMPLES_DIR)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts');

  const methods = new Set();
  for (const file of sampleFiles) {
    const content = fs.readFileSync(path.join(BRIDGE_SAMPLES_DIR, file), 'utf8');
    const methodMatches = content.matchAll(/method:\s*'([^']+)'/g);
    for (const match of methodMatches) {
      methods.add(match[1]);
    }
  }

  return Array.from(methods).sort();
}

/**
 * Main analysis
 */
function analyzeCoverage() {
  const allMethods = extractApiMethods();
  const testedMethods = new Set(extractTestedMethods());

  const covered = allMethods.filter(m => testedMethods.has(m));
  const missing = allMethods.filter(m => !testedMethods.has(m));

  // Separate missing methods into public API, internal, and known debt
  const missingInternal = missing.filter(m => INTERNAL_METHODS.has(m));
  const missingKnown = missing.filter(
    m => !INTERNAL_METHODS.has(m) && KNOWN_UNCOVERED.has(m),
  );
  const missingPublicApi = missing.filter(
    m => !INTERNAL_METHODS.has(m) && !KNOWN_UNCOVERED.has(m),
  );

  // Print results
  console.log('╔════════════════════════════════════════╗');
  console.log('║   API Bridge Coverage Report          ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`Total methods in api.d.ts: ${allMethods.length}`);
  console.log(`Covered by tests:          ${covered.length} (${((covered.length / allMethods.length) * 100).toFixed(1)}%)`);
  console.log(`Missing:                   ${missing.length} (${((missing.length / allMethods.length) * 100).toFixed(1)}%)\n`);

  if (missingKnown.length > 0) {
    console.log('⚠️  Known pre-existing gaps (tracked in KNOWN_UNCOVERED):');
    missingKnown.forEach(m => {
      console.log(`   • ${m}`);
    });
    console.log('');
  }

  if (missingPublicApi.length > 0) {
    console.log('❌ MISSING PUBLIC API METHODS:');
    missingPublicApi.forEach(m => {
      console.log(`   • ${m}`);
    });
    console.log('');
  }

  if (missingInternal.length > 0) {
    console.log('⚠️  Missing internal/unused methods (not critical):');
    missingInternal.forEach(m => {
      console.log(`   • ${m}`);
    });
    console.log('');
  }

  // Summary of covered methods
  const uiMethods = covered.filter(m => m.startsWith('adapty_ui_'));
  const coreMethods = covered.filter(m => !m.startsWith('adapty_ui_'));

  console.log('✅ COVERED:');
  console.log(`   Core SDK:    ${coreMethods.length} methods`);
  console.log(`   UI Methods:  ${uiMethods.length} methods`);

  // Detailed list (optional, can be enabled with --verbose flag)
  if (process.argv.includes('--verbose')) {
    console.log('\n   Core SDK methods:');
    coreMethods.forEach(m => console.log(`   • ${m}`));
    console.log('\n   UI methods:');
    uiMethods.forEach(m => console.log(`   • ${m}`));
  }

  console.log('\n' + '─'.repeat(50));

  if (missingPublicApi.length === 0) {
    console.log('✅ All public API methods are covered!');
    return 0;
  } else {
    console.log(`❌ ${missingPublicApi.length} public API method(s) need tests`);
    return 1;
  }
}

const exitCode = analyzeCoverage();
process.exit(exitCode);
