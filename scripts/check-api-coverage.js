#!/usr/bin/env node

/**
 * API Coverage Checker
 *
 * Analyzes bridge integration test coverage by comparing:
 * - Methods defined in src/types/api.d.ts (generated from cross_platform.yaml)
 * - Methods covered by bridge samples in src/__tests__/integration/shared/bridge-samples/
 *
 * Exit codes:
 * - 0: All public API methods are covered
 * - 1: Some public API methods are missing tests
 */

const fs = require('fs');
const path = require('path');

const API_TYPES_PATH = path.join(__dirname, '../src/types/api.d.ts');
const BRIDGE_SAMPLES_DIR = path.join(__dirname, '../src/__tests__/integration/shared/bridge-samples');
const ADAPTY_HANDLER_PATH = path.join(__dirname, '../src/adapty-handler.ts');

/**
 * Extract all method names from api.d.ts Request types
 */
function extractApiMethods() {
  const apiContent = fs.readFileSync(API_TYPES_PATH, 'utf8');
  const requestMatches = apiContent.matchAll(/'([^']+)\.Request':\s*\{[^}]*method:\s*'([^']+)'/gs);

  const methods = new Set();
  for (const match of requestMatches) {
    const methodName = match[2];
    methods.add(methodName);
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
 * Check if method is a public API method (exists in Adapty class)
 */
function isPublicApiMethod(method) {
  const adapterContent = fs.readFileSync(ADAPTY_HANDLER_PATH, 'utf8');

  // Convert snake_case to camelCase for method name search
  const camelCaseMethod = method.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  // Check if method exists as public async method in Adapty class
  const publicMethodRegex = new RegExp(`public\\s+async\\s+${camelCaseMethod}\\s*\\(`);
  return publicMethodRegex.test(adapterContent);
}

/**
 * Main analysis
 */
function analyzeCoverage() {
  const allMethods = extractApiMethods();
  const testedMethods = new Set(extractTestedMethods());

  const covered = allMethods.filter(m => testedMethods.has(m));
  const missing = allMethods.filter(m => !testedMethods.has(m));

  // Separate missing methods into public API and internal
  const missingPublicApi = missing.filter(isPublicApiMethod);
  const missingInternal = missing.filter(m => !isPublicApiMethod(m));

  // Print results
  console.log('╔════════════════════════════════════════╗');
  console.log('║   API Bridge Coverage Report          ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`Total methods in api.d.ts: ${allMethods.length}`);
  console.log(`Covered by tests:          ${covered.length} (${((covered.length / allMethods.length) * 100).toFixed(1)}%)`);
  console.log(`Missing:                   ${missing.length} (${((missing.length / allMethods.length) * 100).toFixed(1)}%)\n`);

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
