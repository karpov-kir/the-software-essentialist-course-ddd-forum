import { Prisma, PrismaClient } from '@prisma/client';

import { NotFoundError } from '../../../shared/errors/NotFoundError.mjs';
import { UnprocessableInputError } from '../../../shared/errors/UnprocessableInputError.mjs';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto.mjs';
import { User } from '../models/User.mjs';
import { UserRepositoryPort } from './UserRepositoryPort.mjs';

export class PrismaUserRepository implements UserRepositoryPort {
  private readonly prisma = new PrismaClient();

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new UnprocessableInputError('Email address already exists');
      }

      throw error;
    }
  }

  public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new UnprocessableInputError('Email address already exists');
      }

      throw error;
    }
  }

  public getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
