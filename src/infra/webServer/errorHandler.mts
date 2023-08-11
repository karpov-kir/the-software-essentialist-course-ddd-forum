import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { NotFoundError } from '../../shared/errors/NotFoundError.mjs';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.mjs';
import { UnprocessableInputError } from '../../shared/errors/UnprocessableInputError.mjs';
import { ValidationError } from '../../shared/errors/ValidationError.mjs';

const errorToStatusCode = new Map<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function,
  number
>([
  [UnauthorizedError, 401],
  [NotFoundError, 404],
  [UnprocessableInputError, 400],
  [ValidationError, 400],
]);

export function errorHandler(
  this: FastifyInstance,
  rawError: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  let error: Error = rawError;

  if (rawError instanceof ZodError) {
    error = ValidationError.fromZodError(rawError);
  }

  const statusCode = errorToStatusCode.get(error.constructor) ?? 500;

  reply.status(statusCode);

  if (statusCode === 500) {
    this.log.error(error);
    reply.send(new Error('Internal server error'));
    return;
  }

  return reply.send(formatErrorMessage(error));
}

function formatErrorMessage(error: Error) {
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      details: error.details,
    };
  }

  return {
    message: error.message,
  };
}
