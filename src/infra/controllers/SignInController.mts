import { FastifyRequest } from 'fastify';
import z from 'zod';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { Validation } from '../../shared/Validation.mjs';
import { SignInUseCase } from '../../useCases/SignInUseCase.mjs';

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
