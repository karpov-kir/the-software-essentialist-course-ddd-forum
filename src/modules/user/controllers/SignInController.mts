import { FastifyRequest } from 'fastify';
import z from 'zod';

import { Controller } from '../../../infra/Controller.mjs';
import { SignInUseCase } from '../useCases/SignInUseCase.mjs';
import { Validation } from '../Validation.mjs';

const signInDtoSchema = z.object({
  email: z.string().email(),
  password: Validation.PasswordSchema,
});

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(request: FastifyRequest) {
    return this.signInUseCase.execute(signInDtoSchema.parse(request.body));
  }
}
