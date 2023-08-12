import queryString from 'query-string';

export type HttpDriverResponse<T> = {
  status: number;
  data: T;
};

export class HttpDriver {
  private accessToken?: string;

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  constructor(protected readonly baseUrl: string) {}

  private createHeaders() {
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  protected async get<T>(
    path: string,
    { queryParams }: { queryParams?: Record<string, string | undefined> } = {},
  ): Promise<HttpDriverResponse<T>> {
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

  protected async post<T>(path: string, { body }: { body?: object } = {}): Promise<HttpDriverResponse<T>> {
    const url = new URL(`${this.baseUrl}/${path}`);
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

  protected async put<T>(path: string, { body }: { body?: object } = {}): Promise<HttpDriverResponse<T>> {
    const url = new URL(`${this.baseUrl}/${path}`);
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
