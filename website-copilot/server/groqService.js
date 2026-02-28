// Groq API Integration for Travel Information
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function getPlaceInfo(placeName) {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not configured');
    }

    const prompt = `You are a travel guide expert. Provide comprehensive travel information about ${placeName}.

Structure your response in the following sections:

🏛️ TOURIST PLACES
List 5-7 must-visit attractions with brief descriptions.

🍜 FAMOUS FOOD
Describe 4-5 local dishes and where to find them.

🌤️ BEST TIME TO VISIT
Explain the ideal months and weather conditions.

🎯 ACTIVITIES
List 5-6 popular activities and experiences.

💡 TRAVEL TIPS
Provide 5-6 practical tips for travelers.

Keep it concise, informative, and well-organized.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a knowledgeable travel guide providing accurate, helpful information about destinations worldwide.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            throw new Error(`Groq API failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response from Groq API');
        }

        return {
            success: true,
            place: placeName,
            content: data.choices[0].message.content,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Error calling Groq API:', error);
        throw error;
    }
}

async function getNearbyPlaces(hotelName, city, address) {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not configured');
    }

    const prompt = `You are a local travel expert. For the hotel "${hotelName}" located at ${address}, ${city}, provide nearby places and location insights.

Provide ONLY a JSON response with this exact structure:
{
  "airports": [{"name": "Airport Name", "distance": "5 km", "travel_time": "15 mins"}],
  "attractions": [{"name": "Attraction Name", "distance": "2 km", "type": "Historical/Shopping/etc"}],
  "restaurants": [{"name": "Restaurant Name", "distance": "0.5 km", "cuisine": "Indian/Chinese/etc"}],
  "shopping": [{"name": "Mall/Market Name", "distance": "1 km"}],
  "hospitals": [{"name": "Hospital Name", "distance": "3 km"}],
  "insights": ["Location insight 1", "Location insight 2", "Location insight 3"]
}

Provide realistic data for ${city}. Include 1-2 airports, 3-4 attractions, 2-3 restaurants, 1-2 shopping areas, 1 hospital, and 3 location insights.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a local expert providing accurate location data. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.5,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            throw new Error(`Groq API failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response from Groq API');
        }

        const content = data.choices[0].message.content;
        
        // Extract JSON from response (in case Groq adds extra text)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }
        
        const nearbyData = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            hotel: hotelName,
            city: city,
            nearby: nearbyData,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Error calling Groq API for nearby places:', error);
        // Return fallback data
        return {
            success: false,
            error: error.message,
            nearby: {
                airports: [],
                attractions: [],
                restaurants: [],
                shopping: [],
                hospitals: [],
                insights: ["Location data temporarily unavailable"]
            }
        };
    }
}

module.exports = { getPlaceInfo, getNearbyPlaces };
