import { User } from '../src/shared/models/User.mjs';
import { PasswordUtils } from '../src/utils/PasswordUtils.mjs';

export class UserBuilder {
  public static readonly DEFAULT_FIRST_NAME = 'John';
  public static readonly DEFAULT_LAST_NAME = 'Doe';
  public static readonly DEFAULT_EMAIL = 'john.doe@fake-email.com';
  public static readonly DEFAULT_CREATED_AT = new Date('2023-08-28 14:00:00');
  public static readonly DEFAULT_UPDATED_AT = new Date('2023-08-28 18:00:00');
  public static readonly DEFAULT_PASSWORD = 'Test';
  public static readonly DEFAULT_HASHED_PASSWORD = PasswordUtils.hashPasswordSync(this.DEFAULT_PASSWORD);

  private static lastId = 1;

  private firstName = UserBuilder.DEFAULT_FIRST_NAME;
  private lastName = UserBuilder.DEFAULT_LAST_NAME;
  private email = UserBuilder.DEFAULT_EMAIL;
  private password = UserBuilder.DEFAULT_HASHED_PASSWORD;
  private createdAt = UserBuilder.DEFAULT_CREATED_AT;
  private updatedAt = UserBuilder.DEFAULT_UPDATED_AT;

  public withFirstName(firstName: string): this {
    this.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): this {
    this.lastName = lastName;
    return this;
  }

  public withEmail(email: string): this {
    this.email = email;
    return this;
  }

  public build(): User {
    const id = UserBuilder.lastId++;

    return {
      id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      password: this.password,
    };
  }
}
