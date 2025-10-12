import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.GOOGLE_AI_API_KEY;

console.log('Fetching available models from Google AI...\n');
console.log('API Key:', API_KEY?.substring(0, 10) + '...\n');

async function listModels() {
  try {
    // Try v1beta API
    console.log('Trying v1beta API...');
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    console.log('✅ Success! Available models:\n');
    response.data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('');
    });
  } catch (error) {
    console.log('❌ v1beta API failed:', error.response?.data || error.message);
    
    // Try v1 API
    try {
      console.log('\nTrying v1 API...');
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
      );
      
      console.log('✅ Success! Available models:\n');
      response.data.models.forEach(model => {
        console.log(`- ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
    } catch (error2) {
      console.log('❌ v1 API also failed:', error2.response?.data || error2.message);
      console.log('\n⚠️  Your API key might be invalid or restricted.');
      console.log('Please verify:');
      console.log('1. Go to https://aistudio.google.com/app/apikey');
      console.log('2. Check if your API key is active');
      console.log('3. Try creating a new API key');
    }
  }
}

listModels();
