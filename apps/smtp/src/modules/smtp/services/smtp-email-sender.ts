import nodemailer from "nodemailer";

import { BaseError } from "../../../errors";
import { racePromise } from "../../../lib/race-promise";
import { createLogger } from "../../../logger";
import { SmtpEncryptionType } from "../configuration/smtp-config-schema";

export interface SendMailArgs {
  smtpSettings: {
    host: string;
    port: number;
    auth?: {
      user: string;
      pass: string | undefined;
    };
    encryption: SmtpEncryptionType;
  };
  mailData: {
    from: string;
    to: string;
    text: string;
    html: string;
    subject: string;
  };
}

export interface ISMTPEmailSender {
  sendEmailWithSmtp({ smtpSettings, mailData }: SendMailArgs): Promise<{ response: unknown }>;
}

/**
 * TODO: Implement errors mapping and neverthrow
 */
export class SmtpEmailSender implements ISMTPEmailSender {
  private TIMEOUT = 10000;

  private logger = createLogger("SmtpEmailSender");

  static SmtpEmailSenderError = BaseError.subclass("SmtpEmailSenderError");
  static SmtpEmailSenderTimeoutError = this.SmtpEmailSenderError.subclass(
    "SmtpEmailSenderTimeoutError",
  );

  async sendEmailWithSmtp({ smtpSettings, mailData }: SendMailArgs) {
    this.logger.debug("Sending an email with SMTP", {
      host: smtpSettings.host,
      port: smtpSettings.port,
      encryption: smtpSettings.encryption,
      user: smtpSettings.auth?.user,
    });

    /**
     * Railway blocks all outgoing SMTP ports (25, 465, 587) on lower tier plans.
     * If the user is using Resend, we can bypass this by using their HTTP API (port 443).
     * Resend SMTP credentials (resend/re_...) are actually the same as the HTTP API Key.
     */
    const forceSmtp = process.env.FORCE_SMTP === "true";

    if (smtpSettings.host === "smtp.resend.com" && !forceSmtp) {
      this.logger.info("Detected Resend SMTP. Using HTTP API bridge to bypass Railway port block.");

      const apiKey = smtpSettings.auth?.pass;

      if (!apiKey) {
        throw new SmtpEmailSender.SmtpEmailSenderError("Missing Resend API Key (SMTP Password)");
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: mailData.from,
          to: [mailData.to],
          subject: mailData.subject,
          html: mailData.html,
          text: mailData.text,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        this.logger.error("Resend HTTP API failed", { responseData });

        throw new SmtpEmailSender.SmtpEmailSenderError(
          `Resend HTTP API error: ${res.status} ${JSON.stringify(responseData)}`,
        );
      }

      this.logger.info("Email sent via Resend HTTP Bridge successfully", { id: responseData.id });

      return { response: responseData };
    }

    let transporter: nodemailer.Transporter;

    /*
     * https://github.com/nodemailer/nodemailer/issues/1461#issuecomment-1263131029
     * [secure argument] it’s not about security but if the server starts tcp connections over TLS mode or not.
     * If it starts connections in cleartext mode, the client can not use TLS until START TLS can be established later.
     */

    switch (smtpSettings.encryption) {
      case "TLS":
        transporter = nodemailer.createTransport({
          tls: {
            minVersion: "TLSv1.1",
          },
          secure: false,
          host: smtpSettings.host,
          port: smtpSettings.port,
          auth: {
            user: smtpSettings.auth?.user,
            pass: smtpSettings.auth?.pass,
          },
        });
        break;

      case "SSL":
        transporter = nodemailer.createTransport({
          secure: true,
          host: smtpSettings.host,
          port: smtpSettings.port,
          auth: {
            user: smtpSettings.auth?.user,
            pass: smtpSettings.auth?.pass,
          },
        });
        break;

      case "NONE":
        transporter = nodemailer.createTransport({
          host: smtpSettings.host,
          port: smtpSettings.port,
          secure: false,
          auth: {
            user: smtpSettings.auth?.user,
            pass: smtpSettings.auth?.pass,
          },
        });
        break;

      default:
        throw new Error("Unknown encryption type");
    }

    // We don't wrap this in a try-catch because it will be handled in use-case via neverthrow
    const response = await racePromise({
      promise: transporter.sendMail({
        ...mailData,
      }),
      error: new SmtpEmailSender.SmtpEmailSenderTimeoutError("Sending email timeout"),
      timeout: this.TIMEOUT,
    });

    this.logger.debug("An email has been sent", { response });

    return { response };
  }
}
