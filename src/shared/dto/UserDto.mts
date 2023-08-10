export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignedInDto {
  user: UserDto;
  accessToken: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AccessTokenPayloadDto {
  email: string;
}
