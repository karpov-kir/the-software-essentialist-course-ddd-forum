import { Database } from './infra/Database.mjs';
import { LifeCheckController } from './infra/LifeCheckController.mjs';
import { WebServer } from './infra/webServer/WebServer.mjs';
import { ProfileController } from './modules/user/controllers/ProfileController.mjs';
import { SignInController } from './modules/user/controllers/SignInController.mjs';
import { SignUpController } from './modules/user/controllers/SignUpController.mjs';
import { UpdateUserController } from './modules/user/controllers/UpdateUserController.mjs';
import { UsersController } from './modules/user/controllers/UsersController.mjs';
import { PrismaUserRepository } from './modules/user/repositories/PrismaUserRepository.mjs';
import { UserRepositoryPort } from './modules/user/repositories/UserRepositoryPort.mjs';
import { SignInUseCase } from './modules/user/useCases/SignInUseCase.mjs';
import { SignUpUseCase } from './modules/user/useCases/SignUpUseCase.mjs';
import { EmailServicePort } from './shared/services/EmailServicePort.mjs';
import { JustLogEmailService } from './shared/services/JustLogEmailService.mjs';

interface Dependencies {
  userRepository: UserRepositoryPort;
  emailService: EmailServicePort;
}

export class CompositionRoot {
  private readonly userRepository: UserRepositoryPort;
  private readonly emailService: EmailServicePort;
  private readonly webServer: WebServer;
  private readonly database = new Database();

  constructor({
    userRepository = new PrismaUserRepository(),
    emailService = new JustLogEmailService(),
  }: Partial<Dependencies> = {}) {
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.webServer = this.createWebServer();
  }

  private createWebServer() {
    const webServer = new WebServer({
      lifeCheckController: new LifeCheckController(),
      signInController: new SignInController(new SignInUseCase(this.userRepository)),
      signUpController: new SignUpController(new SignUpUseCase(this.userRepository, this.emailService)),
      profileController: new ProfileController(this.userRepository),
      updateUserController: new UpdateUserController(this.userRepository),
      usersController: new UsersController(this.userRepository),
    });

    return webServer;
  }

  public getWebServer() {
    return this.webServer;
  }

  public getDatabase() {
    return this.database;
  }
}
