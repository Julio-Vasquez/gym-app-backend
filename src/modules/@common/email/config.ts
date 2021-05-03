import { createTransport } from 'nodemailer';

export class ConfigMail {
  public GetConfig() {
    const MAIL = 'Apologym4@gmail.com',
      PWD = 'apologym1995';

    return createTransport({
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: MAIL,
        pass: PWD,
      },
    });
  }
}
