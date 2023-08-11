import { LifeCheckController } from './infra/controllers/LifeCheckController.mjs';
import { ProfileController } from './infra/controllers/ProfileController.mjs';
import { SignInController } from './infra/controllers/SignInController.mjs';
import { SignUpController } from './infra/controllers/SignUpController.mjs';
import { UpdateUserController } from './infra/controllers/UpdateUserController.mjs';
import { UsersController } from './infra/controllers/UsersController.mjs';
import { WebServer } from './infra/webServer/WebServer.mjs';
import { PrismaUserRepository } from './shared/repositories/PrismaUserRepository.mjs';
import { UserRepositoryPort } from './shared/repositories/UserRepositoryPort.mjs';
import { EmailServicePort } from './shared/services/EmailServicePort.mjs';
import { JustLogEmailService } from './shared/services/JustLogEmailService.mjs';
import { SignInUseCase } from './useCases/SignInUseCase.mjs';
import { SignUpUseCase } from './useCases/SignUpUseCase.mjs';

interface Dependencies {
  userRepository: UserRepositoryPort;
  emailService: EmailServicePort;
}

export class CompositionRoot {
  private readonly userRepository: UserRepositoryPort;
  private readonly emailService: EmailServicePort;
  private readonly webServer: WebServer;

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
}
