import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { ServiceError } from "../../utils/errors/service.error";
import { HttpStatusCode } from "../../router/RouterTypes";

export class Email {

    static Verify = (email: string, email_code: number) => {
        return new Promise(async (res, rej) => {
            try {
                // Get html body
                const filePath = path.join(__dirname, "../../../public/email/VerifyEmail.html");
                const html_base = fs.readFileSync(filePath, "utf8");

                // Replace code in html body
                const html = html_base.replace("{{email_code}}", email_code.toString());

                // Connect gmail
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    }
                });

                // Send email
                await transporter.sendMail({
                    from: process.env.EMAIL_CORREO,
                    to: email,
                    subject: "Verificar email",
                    html: html,
                });

                res(true);
            } catch (err) {
                console.log(err);
                rej(new ServiceError("No se pudo enviar el correo de verificacion", HttpStatusCode.INTERNAL_SERVER_ERROR));
            }
        });
    }

    static ResetPassword = (email: string, fullname: string, code: number) => {
        return new Promise(async (res, rej) => {
            try {
                // Get html body
                const filePath = path.join(__dirname, "../../../public/ResetPassword.html");
                const html_base = fs.readFileSync(filePath, "utf8");

                // Replace code in html body
                const html = html_base
                                .replace("{{fullname}}", fullname)
                                .replace("{{email_reset_code}}", code.toString());

                // Connect gmail
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    }
                });

                // Send email
                await transporter.sendMail({
                    from: process.env.EMAIL_CORREO,
                    to: email,
                    subject: "Restablecer contaseña",
                    html: html,
                });

                res(true);
            } catch (err) {
                rej(new ServiceError("No se pudo enviar el correo de verificacion", HttpStatusCode.INTERNAL_SERVER_ERROR));
            }
        });
    }

}

