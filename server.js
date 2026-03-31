import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();

/* --- OWASP SECURITY MIDDLEWARE --- */
// 1. Helmet: Sets strict DNS, XSS, and Clickjacking HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled locally to allow React/Vite dev server scripts to run undisturbed
}));

// 2. API Rate Limiting: Lock down spam/DDoS on contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());

// Endpoint to handle the contact form submission securely
app.post('/api/contact', contactLimiter, async (req, res) => {
  let { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, Email, and Phone Number are required.' });
  }

  // 3. Basic Input Sanitization (XSS Defense)
  // Stripping strict HTML brackets to prevent email injection attacks
  name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  email = String(email).trim();
  phone = phone.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Create reusable transporter object using the default SMTP transport
  // Usually, "gmail" is adequate. If Gmail blocks it, use Google App Passwords!
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Setup email data
  const mailOptions = {
    from: `WorkFactory Website <${process.env.EMAIL_USER}>`, // Sender address
    to: 'nguyenminhthoai@gmail.com', // List of receivers (your secure email)
    subject: `New Contact Lead: ${name}`, // Subject line
    text: `You have received a new contact submission from your WIP website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nPlease reply shortly!`, // plain text body
  };

  try {
    // Send email securely through backend server
    await transporter.sendMail(mailOptions);
    console.log(`Contact request successfully sent to nguyenminhthoai@gmail.com from ${email}`);
    res.status(200).json({ success: 'Your message has been securely sent!' });
  } catch (error) {
    console.error('Error sending email. Ensure you have properly stored an App Password in your .env file:', error);
    res.status(500).json({ error: 'Failed to send message securely. Check server logs.' });
  }
});

// Production: serve statically compiled Vite SPA from /dist
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, 'dist')));

  // Catch-all React router fallback for Express 5 compatibility
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend securely running on port ${PORT}`);
});
