import { GlobalTestsSetup } from './GlobalTestsSetup';

export default () => {
  const globalTestsSetup = new GlobalTestsSetup();

  globalTestsSetup.setUp();
};
