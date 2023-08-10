import { FastifyReply, FastifyRequest } from 'fastify';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { SignInDto } from '../../shared/dto/UserDto.mjs';
import { SignInUseCase } from '../../useCases/SignInUseCase.mjs';

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(
    request: FastifyRequest<{
      Body: SignInDto;
    }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;

    // Validate request body
    if (!email || !password) {
      reply.status(400);
      return { message: 'Email and password are required' };
    }

    return this.signInUseCase.execute(request.body);
  }
}
