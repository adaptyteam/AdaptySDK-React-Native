const { pathsToModuleNameMapper } = require('ts-jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['./src'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      { '@/*': ['*'] },
      { prefix: '<rootDir>/src/' },
    ),
    '^@adapty/core$': '<rootDir>/node_modules/@adapty/core/dist/index.cjs',
    '^react-native-adapty/package\\.json$': '<rootDir>/package.json',
  },
  setupFiles: ['./jest/jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native)'],
  testPathIgnorePatterns: ['/dist', '/node_modules/'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.test.tsx',
    '**/*.spec.tsx',
    '**/*.test.js',
    '**/*.spec.js',
  ],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
};
