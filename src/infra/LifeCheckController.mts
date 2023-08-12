import { Controller } from './Controller.mjs';

export class LifeCheckController implements Controller {
  async handle() {
    return 'OK';
  }
}
