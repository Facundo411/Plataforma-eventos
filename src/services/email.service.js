import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

class EmailService {
    async sendEmail(to, subject, html) {
        return await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            html
        });
    }
}

export default EmailService;