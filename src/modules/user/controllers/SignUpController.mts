import { FastifyRequest } from 'fastify';
import z from 'zod';

import { Controller } from '../../../infra/Controller.mjs';
import { Validation } from '../../../shared/Validation.mjs';
import { SignUpUseCase } from '../useCases/SignUpUseCase.mjs';

const signUpDtoSchema = z.object({
  email: z.string().email(),
  firstName: Validation.FirstNameSchema,
  lastName: Validation.LastNameSchema,
  password: Validation.PasswordSchema,
});

export class SignUpController implements Controller {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  async handle(request: FastifyRequest) {
    return this.signUpUseCase.execute(signUpDtoSchema.parse(request.body));
  }
}
