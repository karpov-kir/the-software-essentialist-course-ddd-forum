/**
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1563621855
 * Node.js 18+ has native support for fetch, but the types are not yet in DefinitelyTyped (`@types/node`).
 * This file adds the types to the global scope so that `fetch` can be used in TypeScript context.
 * TODO: remove it once `fetch` types are added to DefinitelyTyped (`@types/node`).
 */
import {
  type FormData as UndiciFormDataType,
  type Headers as UndiciHeadersType,
  type Request as UndiciRequestType,
  type Response as UndiciResponseType,
} from 'undici';

/**
 * Re-export `undici` various types to global scope.
 * These types are expected to be at the global scope according to Node.js v18 API documentation.
 * See: https://nodejs.org/dist/latest-v18.x/docs/api/globals.html.
 */
declare global {
  export const { fetch }: typeof import('undici');

  type FormData = UndiciFormDataType;
  type Headers = UndiciHeadersType;
  type Request = UndiciRequestType;
  type Response = UndiciResponseType;
}
