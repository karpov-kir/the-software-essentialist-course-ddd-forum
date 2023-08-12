import { Controller } from '../../../infra/Controller.mjs';
import { toUserDto } from '../models/User.mjs';
import { UserRepositoryPort } from '../repositories/UserRepositoryPort.mjs';

export class UsersController implements Controller {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle() {
    return (await this.userRepository.getUsers()).map(toUserDto);
  }
}
