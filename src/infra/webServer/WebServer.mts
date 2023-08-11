import Fastify from 'fastify';

import { authenticationMiddleware } from './authenticationMiddleware.mjs';
import { errorHandler } from './errorHandler.mjs';
import { Controllers, createRoutes, Route } from './routes.mjs';

export class WebServer {
  #isListening = false;

  constructor(controllers: Controllers) {
    // Global error handler
    this.fastify.setErrorHandler(errorHandler);
    this.registerRoutes(createRoutes(controllers));
  }

  public isListening() {
    return this.#isListening;
  }

  private fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  private registerRoutes(routes: Route[]) {
    const protectedRoutes = routes.filter((route) => route.isProtected);
    const publicRoutes = routes.filter((route) => !route.isProtected);

    this.fastify.register(async function authenticatedContext(childServer) {
      childServer.decorateRequest('currentUserId', 0);
      childServer.decorateRequest('currentUserEmail', '');
      childServer.addHook('preHandler', authenticationMiddleware);

      protectedRoutes.forEach((route) => {
        childServer.route({
          method: route.method,
          url: route.path,
          handler: (request, reply) => route.controller.handle(request, reply),
        });
      });
    });

    this.fastify.register(async function publicContext(childServer) {
      publicRoutes.forEach((route) => {
        childServer.route({
          method: route.method,
          url: route.path,
          handler: (request, reply) => route.controller.handle(request, reply),
        });
      });
    });
  }

  public async start() {
    const address = await this.fastify.listen({ port: 3000 });
    this.#isListening = true;
    console.log(`Server is listening on ${address}`);
  }

  public async stop(): Promise<void> {
    await this.fastify.close();
    this.#isListening = false;
  }
}
