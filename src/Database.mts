import { PrismaClient } from '@prisma/client';

class DatabaseConnection {
  private readonly prisma = new PrismaClient();

  public query<T = unknown>(sql: TemplateStringsArray): Promise<T> {
    return this.prisma.$queryRaw<T>(sql);
  }
}

export class Database {
  #isConnected = false;

  private readonly prisma = new PrismaClient();

  private readonly connection = new DatabaseConnection();

  public isConnected() {
    return this.#isConnected;
  }

  public async connect() {
    await this.prisma.$connect();
    this.#isConnected = true;
  }

  public async disconnect() {
    await this.prisma.$disconnect();
    this.#isConnected = false;
  }

  public getConnection() {
    return this.connection;
  }
}
