import { SignedInDto, SignInDto } from '../shared/dto/UserDto.mjs';
import { UserRepositoryPort } from '../shared/repositories/UserRepositoryPort.mjs';
import { AccessTokenUtils } from '../utils/AccessTokenUtils.mjs';
import { PasswordUtils } from '../utils/PasswordUtils.mjs';
import { UseCase } from './UseCase.mjs';

export class SignInUseCase implements UseCase<SignInDto, SignedInDto> {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(signInDto: SignInDto): Promise<SignedInDto> {
    const user = await this.userRepository.getUserByEmail(signInDto.email);

    if (!user) {
      throw new Error('Invalid email address or password');
    }

    if (
      !(await PasswordUtils.comparePassword({
        plainPassword: signInDto.password,
        hashedPassword: user.password,
      }))
    ) {
      throw new Error('Invalid email address or password');
    }

    return {
      user,
      accessToken: await AccessTokenUtils.createAccessToken({ email: user.email }),
    };
  }
}
