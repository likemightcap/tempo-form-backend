const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    });

    //send autoresponse to sender
    await transporter.sendMail({
      from: `"Mike at TempoPrints" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out to Tempo Print & Design",
      text: `Thanks for getting in touch — I appreciate you reaching out!
    
    I just wanted to let you know I received your message and I’ll be getting back to you as soon as possible (usually within 1 business day).
    
    If it’s urgent or you’d like to chat sooner, feel free to reply to this email or give me a call.
    
    Looking forward to connecting!
    
    
    --
    Thank You!
    Mike Lightcap
    Tempo Print & Design
    tempoprints.com
    856.252.0414`
    });
    
    
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

app.get('/', (req, res) => {
  res.send('TempoPrints form backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
