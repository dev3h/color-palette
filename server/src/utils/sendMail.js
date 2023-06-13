import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

const sendMail = asyncHandler(async ({ email, html }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"dev3h" <no-relply@dev3h.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line
    html, // html body
  });

  return info;
});

export default sendMail;
