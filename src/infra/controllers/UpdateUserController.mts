import { FastifyRequest } from 'fastify';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { UpdateUserDto } from '../../shared/dto/UserDto.mjs';
import { toUserDto } from '../../shared/models/User.mjs';
import { UserRepositoryPort } from '../../shared/repositories/UserRepositoryPort.mjs';

export class UpdateUserController implements Controller {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle(
    request: FastifyRequest<{
      Body: UpdateUserDto;
      Params: {
        id: number;
      };
    }>,
  ) {
    const { id } = request.params;
    const { firstName, lastName, email, password } = request.body;

    return toUserDto(
      await this.userRepository.updateUser(id, {
        firstName,
        lastName,
        email,
        password,
      }),
    );
  }
}
