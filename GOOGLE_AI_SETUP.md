# Google AI Studio Setup Guide

## ✅ Migration Complete: OpenAI → Google AI Studio (Gemini)

The backend has been updated to use **Google's Gemini AI** instead of OpenAI.

---

## 🔑 How to Get Your Google AI Studio API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**

3. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Copy the generated API key

4. **Add to your `.env` file**
   ```env
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

---

## 📦 Installation Steps

1. **Install the new dependency**
   ```bash
   cd backend
   npm install
   ```

2. **Update your `.env` file**
   - Open `backend/.env`
   - Replace `OPENAI_API_KEY` with `GOOGLE_AI_API_KEY`
   - Paste your Google AI Studio API key

3. **Restart the backend server**
   ```bash
   npm run dev
   ```

---

## 🎯 What Changed

### Backend Changes:
- ✅ Added `@google/generative-ai` package
- ✅ Updated `routes/ai.js` to use Gemini API
- ✅ Enhanced prompts for better agricultural insights
- ✅ Added error handling for API failures

### Features:
- 🌱 **Soil Insights**: AI-powered soil analysis with detailed recommendations
- 🤖 **AI Assistant**: Chat with an agricultural expert AI
- 📊 **Better Responses**: More detailed and practical farming advice

---

## 🧪 Testing

1. **Test Soil Insights**
   - Go to Dashboard → Insights
   - Enter pH (e.g., 6.5), Moisture (e.g., 30), Crop (e.g., Maize)
   - Click "Generate Insights"

2. **Test AI Assistant**
   - Go to Dashboard → Assistant
   - Ask: "How can I improve my soil health?"
   - Get AI-powered responses

---

## 💡 API Usage & Limits

- **Free Tier**: 15 requests per minute
- **Model**: gemini-1.5-flash (fast and efficient)
- **No credit card required** for basic usage

---

## 🐛 Troubleshooting

### Error: "API key not valid"
- Check that your API key is correctly copied in `.env`
- Make sure there are no extra spaces
- Verify the key is active in Google AI Studio

### Error: "Module not found"
- Run `npm install` in the backend directory
- Restart the server

### No AI responses
- Check backend console for errors
- Verify `GOOGLE_AI_API_KEY` is set in `.env`
- Check your internet connection

---

## 📚 Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Node.js SDK](https://github.com/google/generative-ai-js)
