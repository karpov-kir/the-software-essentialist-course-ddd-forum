import { UnprocessableInputError } from '../../../shared/errors/UnprocessableInputError.mjs';
import { UseCase } from '../../../shared/UseCase.mjs';
import { AccessTokenUtils } from '../../../utils/AccessTokenUtils.mjs';
import { PasswordUtils } from '../../../utils/PasswordUtils.mjs';
import { SignedInDto, SignInDto } from '../dto/UserDto.mjs';
import { UserRepositoryPort } from '../repositories/UserRepositoryPort.mjs';

export class SignInUseCase implements UseCase<SignInDto, SignedInDto> {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(signInDto: SignInDto): Promise<SignedInDto> {
    const user = await this.userRepository.getUserByEmail(signInDto.email);

    if (!user) {
      throw new UnprocessableInputError('Invalid email address or password');
    }

    if (
      !(await PasswordUtils.comparePassword({
        plainPassword: signInDto.password,
        hashedPassword: user.password,
      }))
    ) {
      throw new UnprocessableInputError('Invalid email address or password');
    }

    return {
      user,
      accessToken: await AccessTokenUtils.createAccessToken(user),
    };
  }
}
