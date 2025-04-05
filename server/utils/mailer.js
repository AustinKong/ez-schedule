import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetEmail(to, token) {
//   const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const resetLink = `http://localhost:${process.env.PORT}/reset-password?token=${token}`;


//   console.log("1 SENDING EMAIL TO:", to); //debug
  const mailOptions = {
    from: `"EZ Schedule" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}">Click here</a> to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  };

//   console.log("2 SENDING EMAIL TO:", to); //debug

  await transporter.sendMail(mailOptions);
//   console.log("3 SENDING EMAIL TO:", to); //debug
}
