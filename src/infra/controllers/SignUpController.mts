import { FastifyReply, FastifyRequest } from 'fastify';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { SignUpDto } from '../../shared/dto/UserDto.mjs';
import { SignUpUseCase } from '../../useCases/SignUpUseCase.mjs';

export class SignUpController implements Controller {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  async handle(
    request: FastifyRequest<{
      Body: SignUpDto;
    }>,
    reply: FastifyReply,
  ) {
    const { firstName, lastName, email, password } = request.body;

    // Validate request body
    if (!firstName || !lastName || !email || !password) {
      reply.status(400);
      return { message: 'First name, last name, email, and password are required' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address');
    }

    return this.signUpUseCase.execute(request.body);
  }
}
