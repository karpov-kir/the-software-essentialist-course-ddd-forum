import { Prisma, PrismaClient } from '@prisma/client';

import { CreateUserDto, GetUserDto, UpdateUserDto } from './userDto.mjs';
import { WebServer } from './WebServer.mjs';

const webServer = new WebServer();

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(user: Prisma.UserCreateInput): Promise<GetUserDto> {
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

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<GetUserDto> {
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

  async getUsers({ email }: { email?: string } = {}): Promise<GetUserDto[]> {
    return await this.prisma.user.findMany({
      where: { email },
    });
  }
}

const userService = new UserService();

webServer.addPostRoute<{
  Body: CreateUserDto;
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
  Body: UpdateUserDto;
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
    email?: string;
  };
}>('/users', async (request, reply) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    reply.log.error(error);
    throw new Error('Internal server error');
  }
});

webServer.start();
