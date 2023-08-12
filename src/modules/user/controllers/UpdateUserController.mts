import { FastifyRequest } from 'fastify';
import z from 'zod';

import { Controller } from '../../../infra/Controller.mjs';
import { PermissionsDeniedError } from '../../../shared/errors/PermissionsDeniedError.mjs';
import { Validation } from '../../../shared/Validation.mjs';
import { toUserDto } from '../models/User.mjs';
import { UserRepositoryPort } from '../repositories/UserRepositoryPort.mjs';

const updateUserDtoSchema = z.object({
  email: z.string().email(),
  firstName: Validation.FirstNameSchema,
  lastName: Validation.LastNameSchema,
  password: Validation.PasswordSchema,
});

export class UpdateUserController implements Controller {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle(request: FastifyRequest<{ Params: { id: number } }>) {
    const { id } = request.params;

    if (id !== request.currentUserId) {
      throw new PermissionsDeniedError();
    }

    return toUserDto(await this.userRepository.updateUser(id, updateUserDtoSchema.parse(request.body)));
  }
}
