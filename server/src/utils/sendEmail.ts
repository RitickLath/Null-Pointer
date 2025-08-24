import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL || "ritick",
    pass: process.env.PASS || "ritik",
  },
});

export const sendMail = async (
  email: string,
  subject: string,
  html: string
) => {
  const info = await transporter.sendMail({
    from: '"nullPointer" <maddison53@ethereal.email>',
    to: email,
    subject: subject,
    html: html,
  });

  console.log("Message sent:", info.messageId);
};
