import bcrypt from 'bcrypt';

const ROUNDS = 10;

export class PasswordUtils {
  public static hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, ROUNDS);
  }

  public static hashPasswordSync(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, ROUNDS);
  }

  public static comparePassword({
    plainPassword,
    hashedPassword,
  }: {
    plainPassword: string;
    hashedPassword: string;
  }): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
