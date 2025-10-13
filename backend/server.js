import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.js';
import landRoutes from './routes/land.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - allow frontend origin
app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
      'https://soilguard-info.vercel.app',
      'https://soilguard-info-git-main-pauls-projects-5b81e1a2.vercel.app'
    ],
    credentials: true
  })
);

// For standard JSON APIs
app.use(express.json());

// Webhook needs raw body; mounted route handles its own raw parser
app.use('/api/ai', aiRoutes);
app.use('/api/land', landRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export for Vercel serverless
export default app;
