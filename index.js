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
      from: `"Mike at Tempo Print & Design" <${process.env.EMAIL_USER}>`,
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

app.post('/newsletter', async (req, res) => {
  const { name, email } = req.body;

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
    // Email to you (the business)
    await transporter.sendMail({
      from: `"Newsletter Signup" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: 'New Newsletter Signup',
      text: `Name: ${name}\nEmail: ${email}`
    });

    // Autoresponder to user
    await transporter.sendMail({
      from: `"Mike at Tempo Print & Design" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Here's Your 6-Step Local Growth Blueprint!",
      text: `Thanks for signing up!

Attached is your free copy of The 6-Step Local Growth Blueprint — a short, practical guide to help you get more customers, stay organized, and grow your local service business with smart marketing strategies that actually work.

Inside the guide, you’ll learn how to:
• Show up on Google
• Build a lead-generating website
• Stay organized with a CRM
• Advertise locally (like EDDM mailers!)
• Keep customers coming back 
• Build a brand your community remembers 

Going forward, you’ll receive my once-a-month Tempo Print & Design newsletter, where I share helpful tips, design insights, and exclusive promos just for local businesses like yours.

No spam. No fluff. Just real value.

If you ever have questions or need help putting this stuff into action, just hit reply — I’d love to help.

--
Thank You!
Mike Lightcap
Tempo Print & Design
tempoprints.com
856.252.0414`
    });

    res.status(200).json({ message: 'Newsletter signup successful!' });
  } catch (err) {
    console.error('Error handling newsletter signup:', err);
    res.status(500).json({ message: 'Failed to sign up.' });
  }
});


app.get('/', (req, res) => {
  res.send('TempoPrints form backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
