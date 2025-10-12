import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

console.log('Testing Google AI API Key...\n');

// Test different model names
const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'models/gemini-pro',
  'models/gemini-1.5-flash'
];

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ SUCCESS: ${modelName}`);
    console.log(`Response: ${text.substring(0, 50)}...\n`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${modelName}`);
    console.log(`Error: ${error.message}\n`);
    return false;
  }
}

async function runTests() {
  console.log('API Key:', process.env.GOOGLE_AI_API_KEY?.substring(0, 10) + '...\n');
  
  for (const modelName of modelsToTest) {
    const success = await testModel(modelName);
    if (success) {
      console.log(`\n🎉 Found working model: ${modelName}`);
      console.log('Update your routes/ai.js to use this model name.\n');
      break;
    }
  }
}

runTests();
