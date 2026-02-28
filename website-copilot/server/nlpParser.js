// Simple NLP parser for hotel search queries
function parseNaturalLanguageQuery(query) {
    const parsed = {
        location: null,
        rooms: 1,
        star_rating: null,
        price_category: null,
        check_in: null,
        check_out: null,
        adults: 2,
        children: 0
    };

    const lowerQuery = query.toLowerCase();

    // Extract location (cities/places)
    const locationMatch = lowerQuery.match(/(?:at|in|near)\s+([a-z\s]+?)(?:\s+which|\s+that|\s+with|\s+for|\s*,|\s+ready|$)/i);
    if (locationMatch) {
        parsed.location = locationMatch[1].trim();
    }

    // Extract number of rooms
    const roomsMatch = lowerQuery.match(/(\d+)\s*rooms?/);
    if (roomsMatch) {
        parsed.rooms = parseInt(roomsMatch[1]);
    }

    // Extract star rating
    const starMatch = lowerQuery.match(/(\d+)[\s-]*star/);
    if (starMatch) {
        parsed.star_rating = parseInt(starMatch[1]);
    }

    // Extract price category
    if (lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
        parsed.price_category = 'cheap';
    } else if (lowerQuery.includes('luxury') || lowerQuery.includes('expensive')) {
        parsed.price_category = 'luxury';
    } else if (lowerQuery.includes('moderate') || lowerQuery.includes('mid-range')) {
        parsed.price_category = 'moderate';
    }

    // Extract dates
    const datePatterns = [
        /(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/gi,
        /(\d{4})-(\d{2})-(\d{2})/g
    ];

    const dates = [];
    datePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(query)) !== null) {
            dates.push(match[0]);
        }
    });

    if (dates.length >= 1) {
        parsed.check_in = convertToDate(dates[0]);
    }
    if (dates.length >= 2) {
        parsed.check_out = convertToDate(dates[1]);
    }

    // Extract adults/children
    const adultsMatch = lowerQuery.match(/(\d+)\s*adults?/);
    if (adultsMatch) {
        parsed.adults = parseInt(adultsMatch[1]);
    }

    const childrenMatch = lowerQuery.match(/(\d+)\s*child(?:ren)?/);
    if (childrenMatch) {
        parsed.children = parseInt(childrenMatch[1]);
    }

    return parsed;
}

function convertToDate(dateStr) {
    const monthMap = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    // Handle "23rd Feb" format
    const match = dateStr.toLowerCase().match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
    if (match) {
        const day = parseInt(match[1]);
        const month = monthMap[match[2].substring(0, 3)];
        const year = 2026; // Use 2026 to match database data
        
        // Create date string directly in YYYY-MM-DD format
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        
        return dateStr;
    }

    // Handle "YYYY-MM-DD" format
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return dateStr;
    }

    return null;
}

module.exports = { parseNaturalLanguageQuery };
