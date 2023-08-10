import { EmailServicePort } from './EmailServicePort.mjs';

class JustLogEmailService implements EmailServicePort {
  public async sendEmail(to: string, emailBody: string) {
    console.log('##SENDING EMAIL START##');
    console.log('Sending email to: ', to);
    console.log('##BODY START##');
    console.log(emailBody);
    console.log('##BODY END##');
    console.log('##SENDING EMAIL END##');
  }
}
