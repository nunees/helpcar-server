import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailVariables, IMailProvider } from "../IMailProvider";


@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    // nodemailer
    //   .createTestAccount()
    //   .then((account) => {
    //     const transporter = nodemailer.createTransport({
    //       host: account.smtp.host,
    //       port: account.smtp.port,
    //       secure: account.smtp.secure,
    //       auth: {
    //         user: account.user,
    //         pass: account.pass,
    //       },
    //     });
    //     this.client = transporter;
    //   })
    //   .catch((err) => console.error(err));
    nodemailer.createTestAccount().then((account) => {

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
                   user: account.user,
                   pass: account.pass,
                 },
      });
      this.client = transporter;
    }).catch((err) => console.error(err));


  }

  async send(
    {to, path,subject,variables} : IEmailVariables
  ): Promise<void> {

    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      from: "SOS Auto <noreplay@sosauto.com.br>",
      to,
      subject: subject,
      html: templateHTML,
    });

  }
}