module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: [ '../../src/setupJest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  };