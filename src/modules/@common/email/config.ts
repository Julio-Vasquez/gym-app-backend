import { createTransport } from 'nodemailer';

export class ConfigMail {
  public GetConfig() {
    const MAIL = 'fernandopulido473@gmail.com',
      PWD = 'pulido1995.';

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
