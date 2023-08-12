import { CommonExecOptions, execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export class GlobalTestsSetup {
  private readonly execOptions: CommonExecOptions;

  constructor() {
    this.execOptions = this.createExecOptions();
  }

  public setUp() {
    this.loadEnvFile();
    this.generatePrismaClient();
    this.setUpDatabase();
  }

  public getExecOptions() {
    return this.execOptions;
  }

  private createExecOptions() {
    const execOptions: CommonExecOptions = {
      cwd: this.getRootDirectoryAbsolutePath(),
      stdio: 'inherit',
    };

    return execOptions;
  }

  private getRootDirectoryAbsolutePath() {
    return path.resolve(__dirname, '../../');
  }

  private loadEnvFile() {
    dotenv.config({ path: path.join(this.getRootDirectoryAbsolutePath(), `.env.${process.env.NODE_ENV}`) });
  }

  private generatePrismaClient() {
    execSync('npm run prisma:generate', this.getExecOptions());
  }

  private setUpDatabase() {
    execSync('npm run start:docker:db', this.getExecOptions());
    // Reset the whole database
    execSync('npx prisma migrate reset --force --schema=./src/infra/prisma/schema.prisma', this.getExecOptions());
    execSync('npm run migrate', this.getExecOptions());
  }
}
