// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host:"smtp.gmail.com",
//   port: 465,  
//   secure: true,  
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log("SMTP Connection Error:", error);
//   } else {
//     console.log("SMTP Server is ready to take our messages");
//   }
// });

// const sendEmail = async ({ to, subject, html }) => {
//   return await transporter.sendMail({
//     from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html
//   });
// };

// module.exports = sendEmail;
