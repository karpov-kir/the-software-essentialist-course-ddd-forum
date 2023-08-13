import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Must go before all other imports
dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

import { CompositionRoot } from './CompositionRoot.mjs';

const compositionRoot = new CompositionRoot();

await compositionRoot.getWebServer().start();
