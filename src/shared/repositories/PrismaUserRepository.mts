import { Prisma, PrismaClient } from '@prisma/client';

import { User } from '../models/User.mjs';
import { UserRepositoryPort } from './UserRepositoryPort.mjs';

export class PrismaUserRepository implements UserRepositoryPort {
  private readonly prisma = new PrismaClient();

  public async createUser(user: User): Promise<User> {
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

      throw error;
    }
  }

  public async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<User> {
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

  public getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: { email },
    });
  }
}
