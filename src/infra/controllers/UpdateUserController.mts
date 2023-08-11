import { FastifyRequest } from 'fastify';
import z from 'zod';

import { Controller } from '../../infra/controllers/Controller.mjs';
import { toUserDto } from '../../shared/models/User.mjs';
import { UserRepositoryPort } from '../../shared/repositories/UserRepositoryPort.mjs';
import { Validation } from '../../shared/Validation.mjs';

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

    // TODO validate that it's current user
    return toUserDto(await this.userRepository.updateUser(id, updateUserDtoSchema.parse(request.body)));
  }
}
