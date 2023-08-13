import { CreateUserDto, UpdateUserDto } from '../dto/UserDto.mjs';
import { User } from '../models/User.mjs';

export interface UserRepositoryPort {
  createUser(user: CreateUserDto): Promise<User>;

  updateUser(id: number, user: UpdateUserDto): Promise<User>;

  getUsers(): Promise<User[]>;

  getUserByEmail(email: string): Promise<User>;
}
