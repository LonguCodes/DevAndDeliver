module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    './src/mocks/workers/setup.ts',
    './src/mocks/database.ts'
  ],
};