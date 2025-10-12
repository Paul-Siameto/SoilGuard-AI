import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Helper function to get model
function getModel() {
  // Use Gemini 2.5 Flash - fast, efficient, and supports generateContent
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

// POST /api/ai/insights
// Body example: { ph: 6.5, moisture: 30, crop: 'maize' }
router.post('/insights', async (req, res) => {
  try {
    const { ph, moisture, crop } = req.body || {};
    
    const prompt = `You are an agricultural expert. Analyze the following soil conditions and provide detailed recommendations:
    
Soil pH: ${ph}
Moisture Level: ${moisture}%
Crop Type: ${crop}

Please provide:
1. Analysis of the current soil conditions
2. Specific recommendations for improving soil health
3. Best practices for growing ${crop} in these conditions
4. Fertilizer and amendment suggestions
5. Irrigation recommendations

Keep the response practical and actionable for farmers.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ result: text });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Check if it's an API key issue
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      return res.status(500).json({ 
        result: 'Invalid API key. Please check your GOOGLE_AI_API_KEY in the .env file.' 
      });
    }
    
    res.status(500).json({ 
      result: `Error: ${error.message || 'Failed to generate insights. Please try again.'}` 
    });
  }
});

// POST /api/ai/chat
// Body example: { message: 'How to improve soil health?' }
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ reply: 'Please provide a message.' });
    }

    const prompt = `You are an AI assistant specialized in agriculture, soil health, and farming. 
A farmer is asking: "${message}"

Provide a helpful, practical, and friendly response. Keep it concise but informative.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Check if it's an API key issue
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      return res.status(500).json({ 
        reply: 'Invalid API key. Please check your GOOGLE_AI_API_KEY in the .env file.' 
      });
    }
    
    res.status(500).json({ 
      reply: `Error: ${error.message || 'Failed to get response. Please try again.'}` 
    });
  }
});

export default router;
