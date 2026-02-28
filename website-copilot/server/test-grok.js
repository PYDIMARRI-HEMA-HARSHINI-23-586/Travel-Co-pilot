#!/usr/bin/env node

// Quick test script for Grok API integration
require('dotenv').config();

const GROK_API_KEY = process.env.GROK_API_KEY;

console.log('\n🧪 Testing Grok API Setup...\n');

// Check if API key is configured
if (!GROK_API_KEY) {
    console.error('❌ GROK_API_KEY not found in .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Get your API key from https://x.ai');
    console.log('2. Add to website-copilot/server/.env:');
    console.log('   GROK_API_KEY=xai-your-key-here\n');
    process.exit(1);
}

if (GROK_API_KEY === 'your_grok_api_key_here') {
    console.error('❌ Please replace placeholder with your actual Grok API key');
    console.log('\n📝 Edit website-copilot/server/.env and add your real key\n');
    process.exit(1);
}

console.log('✅ GROK_API_KEY found');
console.log(`   Key: ${GROK_API_KEY.substring(0, 10)}...`);

// Test API call
console.log('\n🌐 Testing API connection...');

const testPlace = 'Goa';

fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
        messages: [
            {
                role: 'user',
                content: `Tell me one interesting fact about ${testPlace} in 20 words or less.`
            }
        ],
        model: 'grok-2-1212',
        max_tokens: 50
    })
})
.then(async response => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error ${response.status}: ${error}`);
    }
    return response.json();
})
.then(data => {
    console.log('✅ API connection successful!');
    console.log(`\n💬 Test response about ${testPlace}:`);
    console.log(`   "${data.choices[0].message.content}"\n`);
    console.log('🎉 Setup complete! Your Grok API integration is working.\n');
})
.catch(error => {
    console.error('❌ API test failed:', error.message);
    console.log('\n📝 Common issues:');
    console.log('- Invalid API key (check x.ai console)');
    console.log('- Network connectivity issues');
    console.log('- Rate limit exceeded (wait a few minutes)\n');
    process.exit(1);
});
