require('dotenv').config(); 

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
// let pass = 
app.post('/send-email', (req, res) => {
  const { to, subject, text, html } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
