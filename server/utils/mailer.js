import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetPasswordEmail(to, token) {
  // const resetLink = `http://localhost:5173/reset-password?token=${token}`; // for localhost
  // const resetLink = `https://ez-schedule.onrender.com/reset-password?token=${token}`; //for deployed website on render
  const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;




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


export async function sendQueueEmail(to, position) {
  let subject, html;

  if (position === "next") {
    subject = "You're up for consultation!";
    html = `<p>Hi there, it's your turn now for the consultation.</p>`;
  } else if (position === "next-next") {
    subject = "Get ready - you're next!";
    html = `<p>Your consultation session is coming up. You're next in line. Make your way to the consultation room or be ready to join the link provided by your host.</p>`;
  }

  const mailOptions = {
    from: `"EZ Schedule" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}