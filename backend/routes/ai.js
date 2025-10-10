import express from 'express';

const router = express.Router();

// POST /api/ai/insights
// Body example: { ph: 6.5, moisture: 30, crop: 'maize' }
router.post('/insights', (req, res) => {
  const { ph, moisture, crop } = req.body || {};
  const phNum = Number(ph);
  const moistureNum = Number(moisture);
  const cropStr = String(crop || '').toLowerCase();
  const advice = `For crop ${cropStr || 'unknown'}, pH ${isNaN(phNum) ? 'n/a' : phNum}, moisture ${isNaN(moistureNum) ? 'n/a' : moistureNum}%. Recommendation: maintain pH between 6.0-7.0, apply compost, and ensure consistent irrigation.`;
  res.json({ result: advice });
});

// POST /api/ai/chat
// Body example: { message: 'How to improve soil health?' }
router.post('/chat', (req, res) => {
  const { message } = req.body || {};
  const reply = `AI: For your query: "${(message || '').slice(0, 140)}" - Consider crop rotation, add organic matter, and test soil regularly.`;
  res.json({ reply });
});

export default router;
