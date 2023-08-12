import type { JestConfigWithTsJest } from 'ts-jest';

// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
export default async (): Promise<JestConfigWithTsJest> => ({
  verbose: true,
  testMatch: ['**/*.@(steps|e2espec).*'],
  resolver: '<rootDir>/jest.mjsResolver.cjs',
  extensionsToTreatAsEsm: ['.mts'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  // TODO: remove it once Jest is migrated to ESM: https://jestjs.io/docs/ecmascript-modules
  transformIgnorePatterns: ['node_modules/(?!(query-string|decode-uri-component|split-on-first|filter-obj)/)'],
  globalSetup: './tests/setups/e2eTestsSetup.ts',
});
