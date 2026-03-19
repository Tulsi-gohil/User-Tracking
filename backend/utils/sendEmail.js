const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",  
  host:"smtp.gmail.com",
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
     console.error("Nodemailer Error:", error);
    throw error; 
  }
};

module.exports = sendEmail;
