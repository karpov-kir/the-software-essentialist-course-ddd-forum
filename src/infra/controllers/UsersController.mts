import { Controller } from '../../infra/controllers/Controller.mjs';
import { toUserDto } from '../../shared/models/User.mjs';
import { UserRepositoryPort } from '../../shared/repositories/UserRepositoryPort.mjs';

export class UsersController implements Controller {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle() {
    return (await this.userRepository.getUsers()).map(toUserDto);
  }
}
