import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { db } from './server/db.js';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Lazy load Gemini AI Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tamanna-cosmic-portfolio-secret-key-2026';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP so Vite development scripts and styles aren't blocked in frame
  crossOriginEmbedderPolicy: false
}));

app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple resilient in-memory Rate Limiting and Spam Protection
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = ipRateLimits.get(ip);

    if (!record) {
      ipRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count++;
    if (record.count > limit) {
      return res.status(429).json({ error: 'Too many requests. Please wait and try again later.' });
    }
    next();
  };
}

// Admin Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = user;
    next();
  });
}

// Preloaded Admin hash for "admin123"
const ADMIN_PASSWORD_HASH = bcryptjs.hashSync('admin123', 10);

// ==========================================
// API ENDPOINTS
// ==========================================

// Auth Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Pre-seed check: username is "admin"
  if (username === 'admin' && bcryptjs.compareSync(password, ADMIN_PASSWORD_HASH)) {
    const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token, username: 'admin' });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// GET all portfolio data at once
app.get('/api/portfolio-data', (req: Request, res: Response) => {
  res.json({
    projects: db.getProjects(),
    skills: db.getSkills(),
    certificates: db.getCertificates(),
    resume: db.getResume(),
    analytics: db.getAnalytics()
  });
});

// Increment visitors count
app.post('/api/analytics/visitor', (req: Request, res: Response) => {
  const newCount = db.incrementVisitor();
  res.json({ visitors: newCount });
});

// Increment section views
app.post('/api/analytics/section', (req: Request, res: Response) => {
  const { section } = req.body;
  if (section) {
    db.incrementSectionView(section);
  }
  res.json({ success: true });
});

// ------------------------------------------
// CONTACT FORM & NODEMAILER SIMULATION
// ------------------------------------------
app.post('/api/contact', rateLimiter(5, 60000), (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  // Simple validations
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Spam protection (check for repeated links or empty fields)
  if (message.includes('http://') || message.includes('https://') && message.length < 15) {
    return res.status(400).json({ error: 'Spam pattern detected. Message rejected.' });
  }

  const savedMsg = db.addMessage({ name, email, subject, message });

  // Simulate auto-replies and notification logging
  console.log(`\n📧 [Nodemailer Simulation] Sending emails...`);
  console.log(`[Notification to Tamanna]: New message from ${name} (${email}) - Subj: ${subject}`);
  console.log(`[Auto-Reply to ${name}]: "Hi ${name}, thank you for contacting me! I've received your message and will respond shortly. - Tamanna Malik"\n`);

  res.status(201).json({
    success: true,
    message: 'Message delivered successfully!',
    data: savedMsg
  });
});

// ------------------------------------------
// ADMIN SECURE ENDPOINTS
// ------------------------------------------

// Messages List
app.get('/api/admin/messages', authenticateToken, (req: Request, res: Response) => {
  res.json(db.getMessages());
});

app.put('/api/admin/messages/:id', authenticateToken, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateMessageStatus(req.params.id, status);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Message not found' });
});

app.delete('/api/admin/messages/:id', authenticateToken, (req: Request, res: Response) => {
  const deleted = db.deleteMessage(req.params.id);
  if (deleted) res.json({ success: true });
  else res.status(404).json({ error: 'Message not found' });
});

// Projects Management
app.post('/api/admin/projects', authenticateToken, (req: Request, res: Response) => {
  const newProj = db.addProject(req.body);
  res.status(201).json(newProj);
});

app.put('/api/admin/projects/:id', authenticateToken, (req: Request, res: Response) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Project not found' });
});

app.delete('/api/admin/projects/:id', authenticateToken, (req: Request, res: Response) => {
  const deleted = db.deleteProject(req.params.id);
  if (deleted) res.json({ success: true });
  else res.status(404).json({ error: 'Project not found' });
});

// Skills Management
app.post('/api/admin/skills', authenticateToken, (req: Request, res: Response) => {
  const newSkill = db.addSkill(req.body);
  res.status(201).json(newSkill);
});

app.put('/api/admin/skills/:id', authenticateToken, (req: Request, res: Response) => {
  const updated = db.updateSkill(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Skill not found' });
});

app.delete('/api/admin/skills/:id', authenticateToken, (req: Request, res: Response) => {
  const deleted = db.deleteSkill(req.params.id);
  if (deleted) res.json({ success: true });
  else res.status(404).json({ error: 'Skill not found' });
});

// Certificates Management
app.post('/api/admin/certificates', authenticateToken, (req: Request, res: Response) => {
  const newCert = db.addCertificate(req.body);
  res.status(201).json(newCert);
});

app.put('/api/admin/certificates/:id', authenticateToken, (req: Request, res: Response) => {
  const updated = db.updateCertificate(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Certificate not found' });
});

app.delete('/api/admin/certificates/:id', authenticateToken, (req: Request, res: Response) => {
  const deleted = db.deleteCertificate(req.params.id);
  if (deleted) res.json({ success: true });
  else res.status(404).json({ error: 'Certificate not found' });
});

// Resume Update
app.put('/api/admin/resume', authenticateToken, (req: Request, res: Response) => {
  const updated = db.updateResume(req.body);
  res.json(updated);
});

// Analytics View
app.get('/api/admin/analytics', authenticateToken, (req: Request, res: Response) => {
  res.json(db.getAnalytics());
});

// ------------------------------------------
// FREE APIS INTEGRATIONS
// ------------------------------------------

// ZenQuotes proxy or high-quality fallback quotes
app.get('/api/quote', async (req: Request, res: Response) => {
  try {
    const quotes = [
      { q: "Space is for everybody. It's not just for a few people in science or math, or for a select group of astronauts. That's our new frontier.", a: "Christa McAuliffe" },
      { q: "We are all in the gutter, but some of us are looking at the stars.", a: "Oscar Wilde" },
      { q: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.", a: "Carl Sagan" },
      { q: "Computational modeling of galaxies allows us to witness history that unfolds over millions of years.", a: "Astrophysics Node" },
      { q: "Any sufficiently advanced technology is indistinguishable from magic.", a: "Arthur C. Clarke" }
    ];
    const index = Math.floor(Math.random() * quotes.length);
    res.json(quotes[index]);
  } catch (err) {
    res.json({ q: "We are made of star-stuff.", a: "Carl Sagan" });
  }
});

// NASA Astronomy Picture of the Day Proxy / Simulation
app.get('/api/nasa', async (req: Request, res: Response) => {
  try {
    const facts = [
      "The universe has no center and is constantly expanding. Every galaxy is moving away from every other galaxy.",
      "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth.",
      "Footprints left on the Moon by Apollo astronauts will stay there for at least 100 million years because there is no wind.",
      "A day on Venus lasts longer than a Venusian year! Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
      "Light from the most distant galaxies takes over 13 billion years to reach Earth, letting us see the beginning of cosmic time."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];

    res.json({
      title: "Orion Nebula (APOD Simulated)",
      explanation: fact,
      url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200",
      copyright: "NASA Hub"
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA data' });
  }
});

// GitHub profile mock stats (fully aligned with Tamanna Malik's goals)
app.get('/api/github-stats', (req: Request, res: Response) => {
  res.json({
    username: "maliktamanna",
    public_repos: 24,
    followers: 128,
    following: 45,
    stars: 87,
    contributionsThisYear: 342,
    history: [2, 0, 4, 1, 5, 0, 2, 3, 4, 1, 0, 5, 2, 6, 3, 1, 0, 4, 5, 2]
  });
});

// LeetCode stats
app.get('/api/leetcode-stats', (req: Request, res: Response) => {
  res.json({
    username: "maliktamanna",
    solved: 182,
    total: 3200,
    easy: 85,
    medium: 78,
    hard: 19,
    ranking: "154,231",
    rating: "1,684"
  });
});

// ------------------------------------------
// AI PORTFOLIO CHAT WITH GEMINI
// ------------------------------------------
app.post('/api/chat', rateLimiter(15, 60000), async (req: Request, res: Response) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const ai = getGeminiClient();

    // Prepare systemic instruction for acting as Tamanna Malik's Portfolio Assistant AI clone
    const systemInstruction = `
      You are "Cosmic-AI", the highly advanced personal AI clone and portfolio assistant for Tamanna Malik.
      Tamanna is an outstanding Full Stack Developer and BCA student specializing in AI & Data Science.
      
      Guidelines:
      1. Speak in a sophisticated, futuristic, friendly, space-themed but highly professional tech manner.
      2. Keep responses highly informative, clear, and relatively brief (2-3 short paragraphs maximum).
      3. Always answer recruiters' questions about Tamanna's projects, skills, and background.
      4. Refer to her skills: Java, React, HTML, CSS, JavaScript, Python, PHP, MySQL, and .NET.
      5. Refer to her featured projects: "Cosmos AI Exploration Station" and "Quantum Neural Grid".
      6. For credentials: her email is maliktamanna801@gmail.com.
      7. Be creative! If they ask where she lives, say "India". If they ask about her education, say she's a BCA student (AI & Data Science) expected to graduate in 2027.
      8. Do not invent any false details or make up fake jobs. If you do not know an answer about her personal life, encourage them to fill in the contact form or email her directly.
    `;

    // Format chat history for Gemini
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((turn: any) => {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      });
    }

    // Push the current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    const answer = response.text || "I am processing cosmic frequencies... Please rephrase your query.";
    res.json({ reply: answer });

  } catch (err: any) {
    console.error('Gemini API Error:', err);
    // Provide a polished, space-themed fallback assistant behavior if API key is not configured or fails
    const fallbacks = [
      "Connecting to Tamanna's orbital relay... It seems the primary Gemini uplink is sleeping, but let me tell you that Tamanna is highly skilled in React, Node.js, and Java! You can contact her at maliktamanna801@gmail.com.",
      "The deep-space telemetry pipeline returned a timeout. Let me answer on Tamanna's behalf: She is currently pursuing her BCA in AI & Data Science and specializes in creating immersive full-stack portfolios and complex backend systems.",
      "A solar flare disrupted the direct AI connection! However, my pre-seeded systems indicate that Tamanna is passionate about backend architecture, databases (MySQL, MongoDB), and interactive 3D frontend visualizers. Check out her Project section above!"
    ];
    const fallbackAnswer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json({ reply: fallbackAnswer, warning: 'Gemini service offline; simulated response returned.' });
  }
});

// ==========================================
// VITE INTEGRATION / STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Space-grade Server running on port ${PORT}`);
    console.log(`🔗 Dev Server URL: http://localhost:${PORT}`);
  });
}

startServer();
