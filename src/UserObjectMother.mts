import { User } from './User.mjs';
import { UserBuilder } from './UserBuilder.mjs';
import { SignInDto, SignUpDto } from './UserDto.mjs';

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

  public static toSignInDto({
    user,
    password = UserBuilder.DEFAULT_PASSWORD,
  }: {
    user: User;
    password?: string;
  }): SignInDto {
    return {
      email: user.email,
      password,
    };
  }
}
