// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // set in .env file
    pass: process.env.EMAIL_PASS, // set in .env file (App Password)
  },
});

// verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transport error:", error);
  } else {
    console.log("Email server is ready to take messages");
  }
});

app.post("/send-result", (req, res) => {
  const { name, email, score, total } = req.body;

  if (
    !name ||
    !email ||
    typeof score !== "number" ||
    typeof total !== "number"
  ) {
    return res.status(400).json({ message: "Invalid request body." });
  }

  const mailOptions = {
    from: `"Quiz Results" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Quiz Score",
    html: `<h2>Hi ${name},</h2>
           <p>Thank you for taking the quiz!</p>
           <p><strong>Your score:</strong> ${score}/${total}</p>
           <p>Keep learning! 🚀</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email", error });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
