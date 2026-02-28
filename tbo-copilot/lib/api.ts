// API service for connecting frontend to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ParsedQuery {
  location: string | null;
  rooms: number;
  star_rating: number | null;
  price_category: 'cheap' | 'moderate' | 'luxury' | null;
  check_in: string | null;
  check_out: string | null;
  adults: number;
  children: number;
}

export interface HotelResult {
  hotel_id: number;
  hotel_name: string;
  city: string;
  address: string;
  country: string;
  star_rating: number;
  room_type_id: number;
  room_description: string;
  max_adults: number;
  max_children: number;
  min_price: number;
  max_price: number;
  available_rooms: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  ai_recommendations?: AIRecommendation[];
  price_predictions?: any[];
  error?: string;
  message?: string;
}

export interface AIRecommendation {
  hotel_id: number;
  hotel_name: string;
  confidence: number;
  reason: string;
  highlight: string;
}

// Parse natural language query
export async function parseQuery(query: string): Promise<ApiResponse<ParsedQuery>> {
  console.log('parseQuery called with:', query);
  console.log('API_BASE_URL:', API_BASE_URL);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/parse-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const text = await response.text();
    console.log('Backend response status:', response.status);
    console.log('Backend response:', text);
    
    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        throw new Error(`Backend error: ${text.substring(0, 200)}`);
      }
      throw new Error(error.message || 'Failed to parse query');
    }

    return JSON.parse(text);
  } catch (err) {
    console.error('Error in parseQuery:', err);
    throw err;
  }
}

// Search hotels with parsed parameters
export async function searchHotels(params: Partial<ParsedQuery>): Promise<ApiResponse<HotelResult[]>> {
  const response = await fetch(`${API_BASE_URL}/api/search-hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error('Backend connection failed');
    }
    throw new Error(error.message || 'Failed to search hotels');
  }

  return response.json();
}

// Combined: Parse query and search hotels
export async function parseAndSearch(query: string): Promise<ApiResponse<HotelResult[]>> {
  const parseResult = await parseQuery(query);
  
  if (!parseResult.success || !parseResult.data) {
    throw new Error('Failed to parse query');
  }

  return searchHotels(parseResult.data);
}

// Get place information from Grok API
export async function getPlaceInfo(place: string): Promise<{ success: boolean; place: string; content: string; error?: string; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/place-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch place info');
    }

    return response.json();
  } catch (err: any) {
    console.error('Error fetching place info:', err);
    throw err;
  }
}
