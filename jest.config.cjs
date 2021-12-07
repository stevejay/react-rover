module.exports = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  moduleNameMapper: {
    '.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+.svg$': 'jest-svg-transformer',
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  haste: {
    forceNodeFilesystemAPI: true
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transform: {
    '.tsx?$': ['babel-jest', { configFile: './babel.jestConfig.cjs' }]
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
