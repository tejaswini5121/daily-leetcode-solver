// Test script to verify Gemini API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log('🔑 Testing Gemini API key...\n');

        if (!process.env.GEMINI_API_KEY) {
            console.log('❌ GEMINI_API_KEY not found in .env file');
            return;
        }

        console.log('✅ API key found');
        console.log('📝 API key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...\n');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log('🤖 Sending test prompt to Gemini...');

        const result = await model.generateContent("Say hello in one sentence.");
        const response = await result.response;
        const text = response.text();

        console.log('✅ Success! Gemini responded:\n');
        console.log(text);
        console.log('\n🎉 Your API key is working correctly!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('API key')) {
            console.log('\n💡 Tip: Make sure your API key is correct');
            console.log('   Get a new one at: https://aistudio.google.com/app/apikey');
        }
    }
}

testGemini();
