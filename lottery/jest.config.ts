module.exports = {
  globals: {
    // eslint-disable-next-line id-length
    td: true,
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./helper.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', 'build'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: ['**/*.ts', '!**/*.spec.ts', '!**/*.test.ts'],
}
