# AI Travel Info - Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3002                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Search "hotels in Goa"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                           │
│                    tbo-copilot/app/page.tsx                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tab Interface                                           │  │
│  │  ┌──────────────┐  ┌──────────────────┐                │  │
│  │  │ 🏨 Hotels    │  │ 📍 About Goa     │ ← User clicks  │  │
│  │  └──────────────┘  └──────────────────┘                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ 2. getPlaceInfo("Goa")          │
│                              ▼                                  │
│                    lib/api.ts                                   │
│                    POST /api/place-info                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│                    website-copilot/server/                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  index.js                                                │  │
│  │  app.post('/api/place-info', ...)                       │  │
│  │                                                          │  │
│  │  3. Receives { place: "Goa" }                           │  │
│  │  4. Calls grokService.getPlaceInfo("Goa")               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  grokService.js                                          │  │
│  │                                                          │  │
│  │  5. Builds structured prompt:                           │  │
│  │     "Provide travel info about Goa..."                  │  │
│  │                                                          │  │
│  │  6. Reads GROK_API_KEY from .env                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GROK API (x.ai)                            │
│                  https://api.x.ai/v1/chat/completions           │
│                                                                 │
│  7. Receives prompt + API key                                  │
│  8. Generates travel guide content                             │
│  9. Returns structured response                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│                                                                 │
│  10. grokService formats response:                             │
│      {                                                          │
│        success: true,                                           │
│        place: "Goa",                                            │
│        content: "🏛️ TOURIST PLACES\n..."                       │
│      }                                                          │
│                                                                 │
│  11. Returns to frontend                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JSON Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                           │
│                                                                 │
│  12. Receives content                                           │
│  13. Updates state: setPlaceInfo(content)                      │
│  14. Renders in "About Goa" tab                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📍 About Goa                                            │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │                                                          │  │
│  │  🏛️ TOURIST PLACES                                      │  │
│  │  • Baga Beach - Popular beach destination...            │  │
│  │  • Fort Aguada - Historic Portuguese fort...            │  │
│  │                                                          │  │
│  │  🍜 FAMOUS FOOD                                          │  │
│  │  • Fish Curry Rice - Traditional Goan dish...           │  │
│  │  • Bebinca - Layered dessert...                         │  │
│  │                                                          │  │
│  │  ... (more sections)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
User Action → Frontend State → API Call → Backend → Grok API
                                                        ↓
User Sees Content ← Frontend Render ← State Update ← Response
```

## 📦 Component Breakdown

### Frontend Components

```
page.tsx
├── State Management
│   ├── activeTab: 'hotels' | 'place'
│   ├── placeInfo: string | null
│   ├── placeLoading: boolean
│   └── placeName: string | null
│
├── Tab Interface
│   ├── Hotels Tab (existing)
│   └── About Place Tab (new)
│       ├── Loading State (spinner)
│       ├── Content Display
│       └── Error State
│
└── Effects
    └── useEffect: Fetch place info when tab clicked
```

### Backend Components

```
server/
├── index.js
│   └── POST /api/place-info
│       ├── Validate request
│       ├── Call grokService
│       └── Return response
│
└── grokService.js
    └── getPlaceInfo(placeName)
        ├── Check API key
        ├── Build prompt
        ├── Call Grok API
        └── Format response
```

## 🔐 Security Flow

```
.env file (not in git)
    ↓
process.env.GROK_API_KEY
    ↓
Backend only (never exposed to frontend)
    ↓
Sent to Grok API via HTTPS
```

## ⚡ Performance Optimizations

### 1. Lazy Loading
```
Tab clicked → API call triggered
(Not loaded on initial search)
```

### 2. State Caching
```
First click → API call → Cache in state
Second click → Use cached data (no API call)
```

### 3. Single Request
```
One API call per city per session
No repeated calls on tab switching
```

## 🎯 Error Handling Flow

```
API Call
    ↓
Try/Catch
    ↓
Success? → Display content
    ↓
Error? → Show error message
    ↓
User sees: "Error: [message]"
(App continues working)
```

## 📊 State Management

```javascript
// Initial State
activeTab: 'hotels'
placeInfo: null
placeLoading: false
placeName: null

// After Search
activeTab: 'hotels'
placeInfo: null
placeLoading: false
placeName: 'Goa'  ← Extracted from results

// User Clicks "About Goa"
activeTab: 'place'  ← Tab switched
placeInfo: null
placeLoading: true  ← Loading started
placeName: 'Goa'

// API Response Received
activeTab: 'place'
placeInfo: '🏛️ TOURIST PLACES...'  ← Content loaded
placeLoading: false  ← Loading complete
placeName: 'Goa'
```

## 🌐 API Contract

### Request
```http
POST /api/place-info HTTP/1.1
Content-Type: application/json

{
  "place": "Goa"
}
```

### Success Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "place": "Goa",
  "content": "🏛️ TOURIST PLACES\n...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Failed to fetch place information",
  "message": "GROK_API_KEY not configured"
}
```

## 🔧 Configuration

```
Environment Variables (.env)
    ↓
GROK_API_KEY=xai-...
    ↓
Loaded by dotenv
    ↓
Used in grokService.js
```

---

This architecture ensures:
✅ Clean separation of concerns  
✅ Secure API key handling  
✅ Optimized performance  
✅ Graceful error handling  
✅ Scalable design  
