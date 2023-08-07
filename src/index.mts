import { Prisma, PrismaClient, User } from '@prisma/client';

import { WebServer } from './WebServer.mjs';

const webServer = new WebServer();

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error('Invalid email address');
    }

    try {
      return await this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new Error('Email address already exists');
      }

      throw new Error('Internal server error');
    }
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<User> {
    // Validate email
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email as string)) {
      throw new Error('Invalid email address');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new Error('Email address already exists');
      }

      throw new Error('Internal server error');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}

const userService = new UserService();

webServer.addPostRoute<{
  Body: {
    firstName: string;
    lastName: string;
    email: string;
  };
}>('/users', async (request, reply) => {
  try {
    const { firstName, lastName, email } = request.body;

    // Validate request body
    if (!firstName || !lastName || !email) {
      reply.status(400);
      return { message: 'First name, last name, and email are required' };
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Invalid email address') {
      reply.status(400);
      return { message: 'Invalid email address' };
    }

    if (message === 'Email address already exists') {
      reply.status(400);
      return { message: 'Email address already exists' };
    }

    reply.log.error(error);
    throw new Error('Internal server error');
  }
});

webServer.addPutRoute<{
  Params: {
    id: string;
  };
  Body: {
    firstName: string;
    lastName: string;
    email: string;
  };
}>('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const { firstName, lastName, email } = request.body;

  try {
    const user = await userService.updateUser(Number(id), {
      firstName,
      lastName,
      email,
      updatedAt: new Date(),
    });

    return user;
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Invalid email address') {
      reply.status(400);
      return { message: 'Invalid email address' };
    }

    if (message === 'Email address already exists') {
      reply.status(400);
      return { message: 'Email address already exists' };
    }

    reply.log.error(error);
    throw new Error('Internal server error');
  }
});

webServer.addGetRoute<{
  Querystring: {
    email: string;
  };
}>('/users', async (request, reply) => {
  try {
    const { email } = request.query;

    if (!email) {
      reply.status(400);
      return { message: 'Email is required' };
    }

    const user = await userService.getUserByEmail(email.toString());

    if (!user) {
      reply.status(404);
      return { message: 'User not found' };
    }

    return user;
  } catch (error) {
    reply.log.error(error);
    throw new Error('Internal server error');
  }
});

webServer.start();
