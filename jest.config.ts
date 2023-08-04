import { Config } from 'jest';

export default async (): Promise<Config> => ({
  verbose: true,
  testMatch: ['**/*.@(spec|ispec|steps|e2e).*'],
  transform: {
    '^.+\\.m?(t|j)s$': ['ts-jest', {}],
  },
});
