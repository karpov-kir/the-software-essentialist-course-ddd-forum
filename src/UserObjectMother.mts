import { User } from '@prisma/client';

import { UserBuilder } from './UserBuilder.mjs';
import { SignUpDto } from './UserDto.mjs';

export class UserObjectMother {
  public static defaultUser(): User {
    return new UserBuilder().build();
  }

  public static toSignUpDto({
    user,
    password = UserBuilder.DEFAULT_PASSWORD,
  }: {
    user: User;
    password?: string;
  }): SignUpDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password,
    };
  }
}
