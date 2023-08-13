import { EmailServicePort } from '../../src/shared/services/EmailServicePort.mjs';

export class FakeEmailService implements EmailServicePort {
  sendEmail = jest.fn().mockResolvedValue(undefined);
}
