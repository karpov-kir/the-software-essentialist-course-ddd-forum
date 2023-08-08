import queryString from 'query-string';

import { CreateUserDto, GetUserDto, UpdateUserDto } from './userDto.mjs';

class HttpClient {
  constructor(protected readonly baseUrl: string) {}

  protected async get<T>(
    path: string,
    { queryParams }: { queryParams?: Record<string, string | undefined> } = {},
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${path}`);

    if (queryParams) {
      url.search = queryString.stringify(queryParams);
    }

    const response = await fetch(url);

    return (await response.json()) as T;
  }

  protected async post<T>(url: string, { body }: { body?: object } = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

    return (await response.json()) as T;
  }

  protected async put<T>(url: string, { body }: { body?: object } = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });

    return (await response.json()) as T;
  }
}

export class ApiClient extends HttpClient {
  public createUser(createUserDto: CreateUserDto): Promise<GetUserDto> {
    return this.post<GetUserDto>('users/new', { body: createUserDto });
  }

  public updateUser(id: string, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    return this.put<GetUserDto>(`users/${id}`, { body: updateUserDto });
  }

  public getUsers(): Promise<GetUserDto[]> {
    return this.get<GetUserDto[]>('users');
  }
}
