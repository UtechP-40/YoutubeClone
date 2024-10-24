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

//api for sending mails
//class for generating otp
class OTPGenerator {
  constructor() {
    this.queue = [];
    this.otpSet = new Set(); 
    this.expiryTime = 6000; 
  }

//  <-[123456,]<-
  generateRandomOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  }

     generateOTP() {
    let otp;

    do {
      otp = this.generateRandomOTP();
    } while (this.otpSet.has(otp));

    this.otpSet.add(otp);
    this.queue.push({ otp, createdAt: Date.now() });

    setTimeout(() => this.removeOTP(otp), this.expiryTime);

    return otp;
  }
 
   removeOTP(otp) {
    this.otpSet.delete(otp);
    this.queue = this.queue.filter(item => item.otp !== otp);
    console.log(`OTP ${otp} expired and removed`);
  }

  displayQueue() {
    console.log('Current OTP Queue:', this.queue);
  }
}
app.get("/send-otp",(req,res)=>{
  const otpGenerator = new OTPGenerator();
    const otp1 = otpGenerator.generateOTP();
    otpGenerator.displayQueue();
    res.send(otp1)
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
