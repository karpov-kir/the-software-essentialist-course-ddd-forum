import { Prisma, PrismaClient } from '@prisma/client';

import { toUserDto, User } from './User.mjs';
import { SignedInDto, SignInDto, SignUpDto, UpdateUserDto, UserDto } from './UserDto.mjs';
import { AccessTokenUtils } from './utils/AccessTokenUtils.mjs';
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

      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{
    user: User;
    accessToken: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user) {
      throw new Error('Invalid email address or password');
    }

    if (
      !(await PasswordUtils.comparePassword({
        plainPassword: signInDto.password,
        hashedPassword: user.password,
      }))
    ) {
      throw new Error('Invalid email address or password');
    }

    return {
      user,
      accessToken: await AccessTokenUtils.createAccessToken({ email: user.email }),
    };
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

      throw error;
    }
  }

  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: { email },
    });
  }
}

const userService = new UserService();

webServer.addRoute<{
  Body: SignUpDto;
}>({
  path: '/sign-up',
  method: 'POST',
  isProtected: false,
  handler: async (request, reply): Promise<UserDto | ApiError> => {
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
  },
});

webServer.addRoute<{
  Body: SignInDto;
}>({
  path: '/sign-in',
  method: 'POST',
  isProtected: false,
  handler: async (request, reply): Promise<SignedInDto | ApiError> => {
    try {
      const { email, password } = request.body;

      // Validate request body
      if (!email || !password) {
        reply.status(400);
        return { message: 'Email and password are required' };
      }

      const { accessToken, user } = await userService.signIn({ email, password });

      return {
        user: toUserDto(user),
        accessToken,
      };
    } catch (error) {
      reply.log.error(error);
      throw new Error('Internal server error');
    }
  },
});

webServer.addRoute<{
  Params: {
    id: string;
  };
  Body: UpdateUserDto;
}>({
  path: '/users/:id',
  method: 'PUT',
  isProtected: true,
  handler: async (request, reply): Promise<UserDto | ApiError> => {
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
  },
});

webServer.addRoute({
  path: '/users',
  method: 'GET',
  isProtected: true,
  handler: async (request, reply): Promise<UserDto[]> => {
    try {
      return (await userService.getUsers()).map(toUserDto);
    } catch (error) {
      reply.log.error(error);
      throw new Error('Internal server error');
    }
  },
});

webServer.addRoute({
  path: '/profile',
  method: 'GET',
  isProtected: true,
  handler: async (request, reply): Promise<UserDto> => {
    try {
      return toUserDto(await userService.getUserByEmail(request.userEmail));
    } catch (error) {
      reply.log.error(error);
      throw new Error('Internal server error');
    }
  },
});

webServer.start();
