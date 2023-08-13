import z from 'zod';

export class Validation {
  public static readonly PasswordSchema = z.string().min(4).max(30);
  public static readonly FirstNameSchema = z.string().min(1).max(30);
  public static readonly LastNameSchema = z.string().min(1).max(30);
}
