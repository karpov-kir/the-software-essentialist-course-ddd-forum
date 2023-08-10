import { FastifyRequest } from 'fastify';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { toUserDto } from '../../shared/models/User.mjs';
import { UserRepositoryPort } from '../../shared/repositories/UserRepositoryPort.mjs';

export class ProfileController implements Controller {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle(request: FastifyRequest) {
    return toUserDto(await this.userRepository.getUserByEmail(request.currentUserEmail));
  }
}
