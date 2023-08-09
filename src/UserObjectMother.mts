import { User } from '@prisma/client';

import { UserBuilder } from './UserBuilder.mjs';
import { CreateUserDto, GetUserDto } from './userDto.mjs';

export class UserObjectMother {
  public static defaultUser(): User {
    return new UserBuilder().build();
  }

  public static toCreateUserDto(user: User): CreateUserDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  public static toGetUserDto(user: User): GetUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
