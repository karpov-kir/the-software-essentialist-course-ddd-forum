import Fastify, { preHandlerAsyncHookHandler } from 'fastify';

import { Controller } from '../infra/controllers/Controller.mjs';
import { AccessTokenUtils } from '../utils/AccessTokenUtils.mjs';
import { LifeCheckController } from './controllers/LifeCheckController.mjs';
import { ProfileController } from './controllers/ProfileController.mjs';
import { SignInController } from './controllers/SignInController.mjs';
import { SignUpController } from './controllers/SignUpController.mjs';
import { UpdateUserController } from './controllers/UpdateUserController.mjs';
import { UsersController } from './controllers/UsersController.mjs';

declare module 'fastify' {
  interface FastifyRequest {
    currentUserEmail: string;
  }
}

interface Route {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isProtected: boolean;
  controller: Controller;
}

const authenticationMiddleware: preHandlerAsyncHookHandler = async (request) => {
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
    request.currentUserEmail = email;
  } catch (error) {
    throw new Error(`Invalid access token`);
  }
};

export class WebServer {
  #isListening = false;
  private readonly routes: Route[] = [];

  constructor({
    lifeCheckController,
    signInController,
    signUpController,
    profileController,
    updateUserController,
    usersController,
  }: {
    lifeCheckController: LifeCheckController;
    signInController: SignInController;
    signUpController: SignUpController;
    profileController: ProfileController;
    updateUserController: UpdateUserController;
    usersController: UsersController;
  }) {
    this.routes.push(
      {
        path: '/',
        method: 'GET',
        isProtected: false,
        controller: lifeCheckController,
      },
      {
        path: '/signIn',
        method: 'POST',
        isProtected: false,
        controller: signInController,
      },
      {
        path: '/signUp',
        method: 'POST',
        isProtected: false,
        controller: signUpController,
      },
      {
        path: '/profile',
        method: 'GET',
        isProtected: true,
        controller: profileController,
      },
      {
        path: '/users/:id',
        method: 'PUT',
        isProtected: true,
        controller: updateUserController,
      },
      {
        path: '/users',
        method: 'GET',
        isProtected: true,
        controller: usersController,
      },
    );
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

  private registerRoutes() {
    const protectedRoutes = this.routes.filter((route) => route.isProtected);
    const publicRoutes = this.routes.filter((route) => !route.isProtected);

    this.fastify.register(async function authenticatedContext(childServer) {
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
    this.registerRoutes();
    const address = await this.fastify.listen({ port: 3000 });
    this.#isListening = true;
    console.log(`Server is listening on ${address}`);
  }

  public async stop(): Promise<void> {
    await this.fastify.close();
    this.#isListening = false;
  }
}
