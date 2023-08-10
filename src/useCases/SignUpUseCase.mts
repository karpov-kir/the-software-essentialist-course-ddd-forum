import { EmailServicePort } from 'src/shared/services/EmailServicePort.mjs';

import { SignUpDto, UserDto } from '../shared/dto/UserDto.mjs';
import { toUserDto } from '../shared/models/User.mjs';
import { UserRepositoryPort } from '../shared/repositories/UserRepositoryPort.mjs';
import { PasswordUtils } from '../utils/PasswordUtils.mjs';
import { UseCase } from './UseCase.mjs';

export class SignUpUseCase implements UseCase<SignUpDto, UserDto> {
  constructor(
    private userRepository: UserRepositoryPort,
    private emailService: EmailServicePort,
  ) {}

  async execute(signUpDto: SignUpDto): Promise<UserDto> {
    const userDto = toUserDto(
      await this.userRepository.createUser({
        ...signUpDto,
        password: await PasswordUtils.hashPassword(signUpDto.password),
      }),
    );

    this.emailService.sendEmail(userDto.email, `${userDto.firstName}, welcome to the app!`).catch((error) => {
      console.error('Could not send email', error);
    });

    return userDto;
  }
}
