import { Controller } from '../../../infra/Controller.mjs';

export class LifeCheckController implements Controller {
  async handle() {
    return 'OK';
  }
}
