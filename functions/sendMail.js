import { SendMailOptions, createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.Email,
        pass: process.env.EMAIL_PASS,
    }
});