import nodemailer from "nodemailer"

import { env } from "../../config/env"

type SendBookingConfirmationEmailParams = {
    to: string
    clientName: string
    serviceName: string
    appointmentType: string
    startsAt: Date
    endsAt: Date
}

/**
 * Email service.
 *
 * This module centralizes all email sending.
 * Later we can add:
 * - reusable HTML templates;
 * - Redis/BullMQ queues;
 * - retry logic;
 * - reminder emails.
 */
export class EmailsService {
    private transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth:
            env.SMTP_USER && env.SMTP_PASS
                ? {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                }
                : undefined,
    })

    async sendBookingConfirmationEmail({
        to,
        clientName,
        serviceName,
        appointmentType,
        startsAt,
        endsAt,
    }: SendBookingConfirmationEmailParams) {
        const startDate = startsAt.toLocaleString("pt-PT")
        const endTime = endsAt.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
        })

        await this.transporter.sendMail({
            from: env.SMTP_FROM,
            to,
            subject: "A sua marcação está confirmada",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Marcação confirmada</h2>

          <p>Olá ${clientName},</p>

          <p>A sua marcação foi confirmada com sucesso após pagamento.</p>

          <p><strong>Serviço:</strong> ${serviceName}</p>
          <p><strong>Tipo de marcação:</strong> ${appointmentType}</p>
          <p><strong>Data e hora:</strong> ${startDate} até ${endTime}</p>

          <p>Obrigada,<br/>Laura Feiteira Estética</p>
        </div>
      `,
        })
    }
}