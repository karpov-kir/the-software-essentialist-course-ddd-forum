import queryString from 'query-string';

import { SignUpDto, UpdateUserDto, UserDto } from './UserDto.mjs';

export type HttpClientResponse<T> = {
  status: number;
  data: T;
};

class HttpClient {
  public bearerToken?: string;

  constructor(protected readonly baseUrl: string) {}

  private createHeaders() {
    const headers: RequestInit['headers'] = {};

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }

  protected async get<T>(
    path: string,
    { queryParams }: { queryParams?: Record<string, string | undefined> } = {},
  ): Promise<HttpClientResponse<T>> {
    const url = new URL(`${this.baseUrl}/${path}`);

    if (queryParams) {
      url.search = queryString.stringify(queryParams);
    }

    const response = await fetch(url, {
      headers: this.createHeaders(),
    });

    return {
      status: response.status,
      data: (await response.json()) as T,
    };
  }

  protected async post<T>(url: string, { body }: { body?: object } = {}): Promise<HttpClientResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: this.createHeaders(),
    });

    return {
      status: response.status,
      data: (await response.json()) as T,
    };
  }

  protected async put<T>(url: string, { body }: { body?: object } = {}): Promise<HttpClientResponse<T>> {
    const response = await fetch(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: this.createHeaders(),
    });

    return {
      status: response.status,
      data: (await response.json()) as T,
    };
  }
}

export class ApiClient extends HttpClient {
  public signUp(signUpDto: SignUpDto): Promise<HttpClientResponse<UserDto>> {
    return this.post<UserDto>('users/new', { body: signUpDto });
  }

  public updateUser(id: string, updateUserDto: UpdateUserDto): Promise<HttpClientResponse<UserDto>> {
    return this.put<UserDto>(`users/${id}`, { body: updateUserDto });
  }

  public getUsers(): Promise<HttpClientResponse<UserDto[]>> {
    return this.get<UserDto[]>('users');
  }
}
