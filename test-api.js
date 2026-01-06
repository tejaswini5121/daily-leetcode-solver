// Simple test to diagnose Gemini API issues
require('dotenv').config();
const axios = require('axios');

async function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('Testing Gemini API...\n');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

    if (!apiKey) {
        console.log('❌ No API key found in .env file');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        console.log('\nSending request to:', url.replace(apiKey, 'API_KEY'));

        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: "Say 'Hello World' in one sentence."
                }]
            }]
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);

    } catch (error) {
        console.log('\n❌ ERROR:', error.message);
        if (error.response) {
            console.log('\nStatus:', error.response.status);
            console.log('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testGeminiAPI();
