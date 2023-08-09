import Fastify, {
  preHandlerAsyncHookHandler,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RouteGenericInterface,
  RouteHandlerMethod,
} from 'fastify';

import { AccessTokenUtils } from './utils/AccessTokenUtils.mjs';

declare module 'fastify' {
  interface FastifyRequest {
    userEmail: string;
  }
}

interface AnyRoute<Handler extends RouteHandlerMethod<any, any, any, any, any, any, any, any> = any> {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isProtected: boolean;
  handler: Handler;
}

export type Route<RouteGeneric extends RouteGenericInterface> = AnyRoute<
  RouteHandlerMethod<RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGeneric>
>;

const authenticationMiddleware: preHandlerAsyncHookHandler = async function authenticationMiddleware(request) {
  const { authorization } = request.headers;
  const parts = authorization?.split(' ');

  if (!parts || parts.length !== 2) {
    throw new Error('Missing authorization header or invalid format');
  }

  const [scheme, accessToken] = parts;

  if (scheme !== 'Bearer') {
    throw new Error('Invalid authorization header schema');
  }

  try {
    const { email } = await AccessTokenUtils.verifyAndDecodeAccessToken(accessToken);
    request.userEmail = email;
  } catch (error) {
    throw new Error(`Invalid access token`);
  }
};

export class WebServer {
  #isListening = false;

  public isListening() {
    return this.#isListening;
  }

  private routes: AnyRoute[] = [];

  private fastify = Fastify({
    logger: true,
  });

  private registerRoutes() {
    const protectedRoutes = this.routes.filter((route) => route.isProtected);
    const publicRoutes = this.routes.filter((route) => !route.isProtected);

    this.fastify.register(async function authenticatedContext(childServer) {
      childServer.decorateRequest('userEmail', '');
      childServer.addHook('preHandler', authenticationMiddleware);

      protectedRoutes.forEach((route) => {
        childServer.route({
          method: route.method,
          url: route.path,
          handler: route.handler,
        });
      });
    });

    this.fastify.register(async function publicContext(childServer) {
      publicRoutes.forEach((route) => {
        childServer.route({
          method: route.method,
          url: route.path,
          handler: route.handler,
        });
      });
    });
  }

  public async start() {
    this.registerRoutes();
    const address = await this.fastify.listen({ port: 3000 });
    this.#isListening = true;
    console.log(`Server is listening on ${address}`);
  }

  public async stop(): Promise<void> {
    await this.fastify.close();
    this.#isListening = false;
  }

  public addRoute<RouteGeneric extends RouteGenericInterface = RouteGenericInterface>(route: Route<RouteGeneric>) {
    if (this.#isListening) {
      throw new Error('Cannot add route while server is listening');
    }

    this.routes.push(route);
  }
}
