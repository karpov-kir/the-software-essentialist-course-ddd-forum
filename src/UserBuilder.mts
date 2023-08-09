import { User } from '@prisma/client';

export class UserBuilder {
  private static DEFAULT_FIRST_NAME = 'John';
  private static DEFAULT_LAST_NAME = 'Doe';
  private static DEFAULT_EMAIL = 'john.doe@fake-email.com';
  private static DEFAULT_CREATED_AT = new Date('2023-08-28 14:00:00');
  private static DEFAULT_UPDATED_AT = new Date('2023-08-28 18:00:00');

  private static lastId = 1;

  private firstName = UserBuilder.DEFAULT_FIRST_NAME;
  private lastName = UserBuilder.DEFAULT_LAST_NAME;
  private email = UserBuilder.DEFAULT_EMAIL;
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
    };
  }
}
