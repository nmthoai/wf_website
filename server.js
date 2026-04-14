import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();

// Nodemailer transporter — created once at startup, reused for every request
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* --- OWASP SECURITY MIDDLEWARE --- */
// 1. Helmet: Sets secure HTTP headers (CSP enabled in production)
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// 2. CORS: Restrict to own domain in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://workfactory.ai', 'https://www.workfactory.ai']
  : true; // allow all in dev

app.use(cors({ origin: allowedOrigins }));

// 3. Trust proxy headers from Nginx (needed for correct rate-limit IP)
app.set('trust proxy', 1);

// 4. API Rate Limiting: Lock down spam/DDoS on contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(cookieParser());

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

// Admin JWT Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 
    });
    return res.status(200).json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Admin API: Auto-Translate JSON Flat-Files via Gemini
app.post('/api/admin/translate', async (req, res) => {
  // 1. Basic JWT Auth check
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { masterContent } = req.body;
  if (!masterContent) return res.status(400).json({ error: 'Missing master content.' });

  try {
    // 2. Overwrite English Master
    fs.writeFileSync(path.join(process.cwd(), 'data', 'content_en.json'), JSON.stringify(masterContent, null, 2));

    // 3. Prompt Gemini AI for structured JSON array
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const promptText = `
You are a language engine. I will provide a JSON object in English.
Translate ALL string values into Vietnamese, German, and Simplified Chinese without changing any JSON keys!
Respond ONLY with a valid JSON array containing exactly three translated objects in this exact order: [Vietnamese Object, German Object, Chinese Object]. No markdown codeblocks allowed.

Source Payload:
${JSON.stringify(masterContent, null, 2)}
`;

    const aiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error("Gemini Error:", errorText);
      return res.status(502).json({ error: 'AI Translation API failed' });
    }

    const aiData = await aiRes.json();
    const rawAiText = aiData.candidates[0].content.parts[0].text;
    
    // Clean potential markdown blocks
    const cleanedJson = rawAiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const translatedArray = JSON.parse(cleanedJson);

    if (Array.isArray(translatedArray) && translatedArray.length === 3) {
      // 4. Save generated Flat-Files
      fs.writeFileSync(path.join(process.cwd(), 'data', 'content_vn.json'), JSON.stringify(translatedArray[0], null, 2));
      fs.writeFileSync(path.join(process.cwd(), 'data', 'content_de.json'), JSON.stringify(translatedArray[1], null, 2));
      fs.writeFileSync(path.join(process.cwd(), 'data', 'content_cn.json'), JSON.stringify(translatedArray[2], null, 2));
      
      return res.status(200).json({ success: true, message: 'All languages successfully translated and saved.' });
    } else {
      return res.status(500).json({ error: 'AI returned malformed JSON structure.' });
    }

  } catch (error) {
    console.error("Server API build error:", error);
    res.status(500).json({ error: 'Internal build failure.' });
  }
});

// Content API Endpoint for Flat-File CMS

app.get('/api/content', (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const safeLangs = ['en', 'vn', 'de', 'cn'];
    const targetLang = safeLangs.includes(lang) ? lang : 'en';
    
    const rawData = fs.readFileSync(path.join(process.cwd(), 'data', `content_${targetLang}.json`));
    res.json(JSON.parse(rawData));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load content data.' });
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
