const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER_1,
            pass: process.env.EMAIL_PASS_1,
        },
    });

    await transporter.sendMail({
        from: `"Caribbean Wheels" <${process.env.EMAIL_USER_1}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;