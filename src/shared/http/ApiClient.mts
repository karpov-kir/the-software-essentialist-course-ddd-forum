import { SignedInDto, SignInDto, SignUpDto, UpdateUserDto, UserDto } from '../../modules/user/dto/UserDto.mjs';
import { HttpDriver, HttpDriverResponse } from './HttpDriver.mjs';

export class ApiClient extends HttpDriver {
  public async signIn(
    signInDto: SignInDto,
    { useAccessTokenForFutureRequests }: { useAccessTokenForFutureRequests: boolean },
  ): Promise<HttpDriverResponse<SignedInDto>> {
    const response = await this.post<SignedInDto>('signIn', { body: signInDto });

    if (useAccessTokenForFutureRequests) {
      this.setAccessToken(response.data.accessToken);
    }

    return response;
  }

  public signUp(signUpDto: SignUpDto): Promise<HttpDriverResponse<UserDto>> {
    return this.post<UserDto>('signUp', { body: signUpDto });
  }

  public updateUser(id: string, updateUserDto: UpdateUserDto): Promise<HttpDriverResponse<UserDto>> {
    return this.put<UserDto>(`users/${id}`, { body: updateUserDto });
  }

  public getUsers(): Promise<HttpDriverResponse<UserDto[]>> {
    return this.get<UserDto[]>('users');
  }

  public getProfile(): Promise<HttpDriverResponse<UserDto>> {
    return this.get<UserDto>('profile');
  }
}
