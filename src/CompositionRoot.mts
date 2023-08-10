import { LifeCheckController } from './infra/controllers/LifeCheckController.mjs';
import { ProfileController } from './infra/controllers/ProfileController.mjs';
import { SignInController } from './infra/controllers/SignInController.mjs';
import { SignUpController } from './infra/controllers/SignUpController.mjs';
import { UpdateUserController } from './infra/controllers/UpdateUserController.mjs';
import { UsersController } from './infra/controllers/UsersController.mjs';
import { WebServer } from './infra/WebServer.mjs';
import { PrismaUserRepository } from './shared/repositories/PrismaUserRepository.mjs';
import { SignInUseCase } from './useCases/SignInUseCase.mjs';
import { SignUpUseCase } from './useCases/SignUpUseCase.mjs';

export class CompositionRoot {
  private readonly userRepository = new PrismaUserRepository();

  private readonly webServer: WebServer;

  constructor() {
    this.webServer = this.createWebServer();
  }

  private createWebServer() {
    const webServer = new WebServer({
      lifeCheckController: new LifeCheckController(),
      signInController: new SignInController(new SignInUseCase(this.userRepository)),
      signUpController: new SignUpController(new SignUpUseCase(this.userRepository)),
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
