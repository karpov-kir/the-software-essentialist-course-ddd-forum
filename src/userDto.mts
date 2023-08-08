export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export type UpdateUserDto = CreateUserDto;

export interface GetUserDto extends CreateUserDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
