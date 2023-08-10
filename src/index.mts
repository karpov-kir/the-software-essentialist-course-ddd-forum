import { CompositionRoot } from './CompositionRoot.mjs';

const compositionRoot = new CompositionRoot();

await compositionRoot.getWebServer().start();
