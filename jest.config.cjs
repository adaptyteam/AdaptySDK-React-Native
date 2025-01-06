const { pathsToModuleNameMapper } = require('ts-jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['./src'],
  moduleNameMapper: pathsToModuleNameMapper(
    { '@/*': ['*'] },
    { prefix: '<rootDir>/src/' },
  ),
  setupFiles: ['./jest/jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native)'],
  testPathIgnorePatterns: ['/dist'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
};
