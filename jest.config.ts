import type { JestConfigWithTsJest } from 'ts-jest';

// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
export default async (): Promise<JestConfigWithTsJest> => ({
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testMatch: ['**/*.@(spec|ispec|steps|e2e).*'],
  resolver: '<rootDir>/jest.mjsResolver.cjs',
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
});
