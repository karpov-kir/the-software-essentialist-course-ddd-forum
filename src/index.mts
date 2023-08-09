import { Prisma, PrismaClient } from '@prisma/client';

import { toUserDto, User } from './User.mjs';
import { SignUpDto, UpdateUserDto, UserDto } from './UserDto.mjs';
import { PasswordUtils } from './utils/PasswordUtils.mjs';
import { WebServer } from './WebServer.mjs';

interface ApiError {
  message: string;
}

const webServer = new WebServer();

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpDto.email)) {
      throw new Error('Invalid email address');
    }

    try {
      return await this.prisma.user.create({
        data: {
          ...signUpDto,
          password: await PasswordUtils.hashPassword(signUpDto.password),
        },
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

  async getUsers({ email }: { email?: string } = {}): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { email },
    });
  }
}

const userService = new UserService();

webServer.addPostRoute<{
  Body: SignUpDto;
}>('/sign-up', async (request, reply): Promise<UserDto | ApiError> => {
  try {
    const { firstName, lastName, email, password } = request.body;

    // Validate request body
    if (!firstName || !lastName || !email || !password) {
      reply.status(400);
      return { message: 'First name, last name, email, and password are required' };
    }

    return toUserDto(await userService.signUp(request.body));
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
}>('/users/:id', async (request, reply): Promise<UserDto | ApiError> => {
  const { id } = request.params;
  const { firstName, lastName, email } = request.body;

  try {
    return toUserDto(
      await userService.updateUser(Number(id), {
        firstName,
        lastName,
        email,
        updatedAt: new Date(),
      }),
    );
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
}>('/users', async (request, reply): Promise<UserDto[]> => {
  try {
    return (await userService.getUsers()).map(toUserDto);
  } catch (error) {
    reply.log.error(error);
    throw new Error('Internal server error');
  }
});

webServer.start();
