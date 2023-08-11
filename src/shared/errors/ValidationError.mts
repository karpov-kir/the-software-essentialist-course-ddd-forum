import { ZodError } from 'zod';

interface ErrorDetails {
  path: Array<string | number>;
  message: string;
  type: string;
}

export class ValidationError extends Error {
  public readonly details;

  public static fromZodError(error: ZodError, message?: string): ValidationError {
    const details: ErrorDetails[] = [];

    error.issues.forEach((issue) => {
      details.push({
        path: issue.path,
        message: issue.message,
        type: issue.code,
      });
    });

    return new ValidationError(details, message);
  }

  constructor(details: ErrorDetails[], message = 'Validation error') {
    super(message);
    this.details = details;
  }
}
