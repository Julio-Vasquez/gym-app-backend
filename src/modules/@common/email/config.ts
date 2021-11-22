import { createTransport } from 'nodemailer'

export class ConfigMail {
  public GetConfig() {
    return createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: 'Apologym4@gmail.com',
        pass: 'apologym1995'
      }
    })
  }
}
