import { SignUpDto, UserDto } from '../shared/dto/UserDto.mjs';
import { toUserDto } from '../shared/models/User.mjs';
import { UserRepositoryPort } from '../shared/repositories/UserRepositoryPort.mjs';
import { PasswordUtils } from '../utils/PasswordUtils.mjs';
import { UseCase } from './UseCase.mjs';

export class SignUpUseCase implements UseCase<SignUpDto, UserDto> {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(signUpDto: SignUpDto): Promise<UserDto> {
    return toUserDto(
      await this.userRepository.createUser({
        ...signUpDto,
        password: await PasswordUtils.hashPassword(signUpDto.password),
      }),
    );
  }
}
