# RPG Recall - Architectural Design Document

## Executive Summary

RPG Recall is a web application that helps gamers remember their progress in RPG games after extended breaks. The architecture is designed for hackathon speed while maintaining clean, modular principles for scalability.

---

## 1. High-Level System Architecture

### System Overview
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │────────▶│   Backend API   │────────▶│   LLM API       │
│   (Next.js)     │  HTTP   │   (Next.js API) │  HTTP   │ (Gemini/OpenAI) │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                           │                           │
       │                           │                           │
       ▼                           ▼                           ▼
  Browser Client              Server Logic              AI Processing
```

### Data Flow Diagram

**Step 1: User Interaction**
```
User → Browser → Frontend UI
  - Selects game from dropdown/grid
  - Types fragmented memories in textarea
  - Clicks "Recall My Journey" button
```

**Step 2: Frontend Processing**
```
Frontend → Frontend Validation → API Request
  - Validates input (non-empty, reasonable length)
  - Shows loading state
  - Sends POST request to /api/recall
```

**Step 3: Backend Processing**
```
Backend API → Game Context Loader → LLM Service → LLM API
  - Receives { gameId, userText }
  - Loads game-specific system prompt
  - Constructs LLM request with context
  - Calls external LLM API
```

**Step 4: AI Processing**
```
LLM API → LLM Processing → JSON Response
  - Analyzes user text with game context
  - Determines quest progress/state
  - Returns structured JSON with summary and next steps
```

**Step 5: Response Flow**
```
LLM API → Backend → Frontend → User Display
  - Backend parses LLM response
  - Validates JSON structure
  - Returns to frontend
  - Frontend displays in two cards
```

### Architecture Principles

- **Single Responsibility**: Each layer handles one concern (UI, API logic, AI processing)
- **Stateless Backend**: No session storage, all context in requests
- **Fail-Fast**: Validate early, fail gracefully
- **Separation of Concerns**: Game data, prompts, and logic are modular
- **API First**: Clear contract between frontend and backend

---

## 2. Recommended Tech Stack for Hackathon MVP

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
  - Built-in API routes for backend
  - Server and client components
  - Excellent DX and TypeScript support
  - Zero-config deployment (Vercel)
  
- **Styling**: Tailwind CSS
  - Utility-first, rapid development
  - Built-in responsive design
  - Dark mode support (gamer aesthetic)

- **UI Components**: shadcn/ui (optional) or custom components
  - Pre-built, accessible components
  - Highly customizable
  - TypeScript-native

### Backend Stack
- **Framework**: Next.js API Routes (same as frontend)
  - No separate backend setup needed
  - TypeScript throughout
  - Edge runtime support for faster cold starts

- **LLM Client**: AI SDK (Vercel AI SDK) or direct API calls
  - Unified interface for multiple providers
  - Streaming support (future enhancement)
  - Type-safe responses

- **Environment Variables**: Next.js built-in support
  - `.env.local` for local development
  - Secure API key management

### Why This Stack?
- **Speed**: Single repo, no context switching
- **Simplicity**: Learn one framework thoroughly
- **Deployment**: One command deploys both frontend and backend
- **TypeScript**: End-to-end type safety
- **Hackathon-Ready**: Get started in minutes, not hours

### Alternative (If Team Prefers Separation)
- **Frontend**: React + Vite + Tailwind
- **Backend**: Node.js + Express
- **Trade-off**: More setup, better separation for larger teams

---

## 3. API Contract / Endpoint Design

### Base URL
```
Production: https://rpg-recall.vercel.app/api
Local: http://localhost:3000/api
```

### Endpoints

#### POST /api/recall
**Purpose**: Analyze user's game memories and return structured recap

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
interface RecallRequest {
  gameId: string;           // Game identifier (e.g., "elden-ring", "witcher-3")
  userText: string;         // User's fragmented memories (10-2000 chars)
  locale?: string;          // Optional: "en" | "es" | "fr" (default: "en")
}
```

**Request Example**:
```json
{
  "gameId": "elden-ring",
  "userText": "I remember fighting a big dragon at a castle, and I met a witch who gave me a potion. I think I was in Caelid but I'm not sure.",
  "locale": "en"
}
```

**Success Response (200)**:
```typescript
interface RecallResponse {
  success: true;
  data: {
    gameId: string;
    gameName: string;
    summary: {
      title: string;              // e.g., "You're in the middle of the 'Dragonlord' quest"
      pastEvents: string[];       // 3-5 bullet points of what happened
      currentQuest: string;       // Current main quest
      keyNPCsMet: string[];      // Important NPCs encountered
      lastKnownLocation: string;  // Last area player was in
    };
    nextSteps: {
      immediateAction: string;    // First thing to do
      shortTermGoals: string[];   // 2-3 next objectives
      tips: string[];            // 2-3 helpful tips (no spoilers)
      warnings?: string[];        // Optional: missable content warnings
    };
    confidence: number;           // 0-1 score of analysis confidence
    requiresClarification?: string; // Optional: if input too vague
  };
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "gameId": "elden-ring",
    "gameName": "Elden Ring",
    "summary": {
      "title": "You're progressing through the Caelid region",
      "pastEvents": [
        "You defeated the flying dragon Greyoll at the Caelid Dragonbarrow",
        "You met the witch Ranni at the Three Sisters area and received a potion",
        "You activated the Site of Grace at the Caelid Highway North"
      ],
      "currentQuest": "Ranni's Dark Quest - First Step",
      "keyNPCsMet": ["Ranni the Witch", "Iji, the Blacksmith", "Blaidd"],
      "lastKnownLocation": "Caelid - Dragonbarrow"
    },
    "nextSteps": {
      "immediateAction": "Speak to Blaidd at the Mistwood Ruins to continue Ranni's quest",
      "shortTermGoals": [
        "Find the Nights Creed in the Siofra River well",
        "Retrieve the Fingerslayer Blade from Nokron",
        "Return to Ranni to deliver the item"
      ],
      "tips": [
        "The Siofra River well is located in the Mistwood Ruins",
        "Make sure you have the lantern item for the underground areas"
      ],
      "warnings": [
        "Some of Ranni's questline can be missed if you progress too far in other storylines"
      ]
    },
    "confidence": 0.87
  }
}
```

**Error Responses**:

**400 Bad Request**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: "INVALID_INPUT" | "MISSING_FIELD" | "TEXT_TOO_SHORT" | "TEXT_TOO_LONG" | "UNKNOWN_GAME";
    message: string;
    details?: Record<string, any>;
  };
}
```

**408 Request Timeout**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: "LLM_TIMEOUT";
    message: "The AI analysis took too long. Please try again.";
    retryable: true;
  };
}
```

**500 Server Error**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: "INTERNAL_ERROR" | "LLM_ERROR" | "RATE_LIMIT";
    message: string;
    details?: string;
  };
}
```

#### GET /api/games
**Purpose**: List all supported games

**Response (200)**:
```typescript
interface GamesResponse {
  success: true;
  data: {
    games: Array<{
      id: string;
      name: string;
      coverImage?: string;
      supported: boolean;
    }>;
  };
}
```

---

## 4. Folder/Directory Structure

### Monorepo Structure (Next.js App Router)

```
rpg-recall/
├── .env.local                    # Environment variables (gitignored)
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── ARCHITECTURE.md              # This document
│
├── public/                      # Static assets
│   ├── games/                   # Game cover images
│   │   ├── elden-ring.jpg
│   │   ├── witcher-3.jpg
│   │   └── ...
│   └── favicon.ico
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   │   ├── recall/
│   │   │   │   └── route.ts    # POST /api/recall
│   │   │   └── games/
│   │   │       └── route.ts    # GET /api/games
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css         # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Select.tsx
│   │   │   └── TextArea.tsx
│   │   ├── GameSelector.tsx     # Game dropdown/grid
│   │   ├── MemoryInput.tsx      # Text input for memories
│   │   ├── ResultCards.tsx      # Display results
│   │   ├── LoadingState.tsx     # Loading animation
│   │   └── ErrorState.tsx       # Error display
│   │
│   ├── lib/                     # Utility functions
│   │   ├── llm/
│   │   │   ├── clients.ts       # LLM API clients
│   │   │   ├── prompts.ts       # System prompt management
│   │   │   └── types.ts         # LLM-related types
│   │   ├── games/
│   │   │   ├── games.ts         # Game metadata
│   │   │   └── prompts.ts       # Game-specific system prompts
│   │   ├── validation.ts        # Input validation
│   │   └── utils.ts             # General utilities
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── api.ts               # API request/response types
│   │   ├── game.ts              # Game-related types
│   │   └── index.ts             # Type exports
│   │
│   └── hooks/                   # Custom React hooks
│       ├── useRecall.ts         # Main recall logic
│       └── useGames.ts          # Games data fetching
│
├── .devin/                      # Devin configuration (if using)
│   └── skills/
│
└── README.md                    # Project documentation
```

### Key Design Decisions

**Why `src/` directory?**
- Clean separation from Next.js boilerplate
- Easier to navigate in larger projects
- Standard pattern in modern React apps

**Why `components/ui/` vs `components/`?**
- `ui/` contains generic, reusable components (buttons, cards, inputs)
- Root `components/` contains feature-specific components (GameSelector, ResultCards)
- Makes finding components faster

**Why `lib/llm/` separate from `lib/games/`?**
- LLM logic is provider-agnostic (swap Gemini for OpenAI easily)
- Game data is independent of AI logic
- Easy to test each module separately

**Why `types/` directory?**
- Single source of truth for TypeScript types
- Shared between frontend and backend
- Easy to generate API docs from types

### Team Collaboration Strategy

**Frontend Team Works On:**
- `src/app/page.tsx` (main UI)
- `src/components/` (all React components)
- `src/hooks/` (custom hooks)
- `public/games/` (images)

**Backend Team Works On:**
- `src/app/api/` (API routes)
- `src/lib/llm/` (LLM integration)
- `src/lib/games/` (game data and prompts)
- `src/types/` (type definitions)

**Shared:**
- `src/lib/validation.ts` (both teams may need this)
- `src/types/` (backend defines, frontend consumes)

**Git Conflict Prevention:**
- Different file paths = fewer conflicts
- API contract in `src/types/api.ts` is the contract
- Frontend and backend can work independently

---

## 5. Error Handling & UX States

### Frontend Error Handling

**Input Validation (Client-Side)**
```typescript
// Before API call
const errors = {
  gameId: !selectedGame ? "Please select a game" : null,
  userText: userText.length < 10 ? "Please provide more details (min 10 chars)" : null,
  userTextTooLong: userText.length > 2000 ? "Keep it under 2000 characters" : null,
};

if (Object.values(errors).some(e => e !== null)) {
  // Show inline errors
  return;
}
```

**API Error States**
```typescript
switch (error.code) {
  case "INVALID_INPUT":
    showInlineError("Please check your input and try again");
    break;
  case "LLM_TIMEOUT":
    showError("The AI is thinking too hard. Try again?");
    break;
  case "RATE_LIMIT":
    showError("Too many requests. Wait a moment and try again.");
    break;
  case "UNKNOWN_GAME":
    showError("This game isn't supported yet.");
    break;
  default:
    showError("Something went wrong. We're on it!");
}
```

### Backend Error Handling

**Request Validation**
```typescript
// In /api/recall/route.ts
if (!gameId || !userText) {
  return NextResponse.json(
    { success: false, error: { code: "MISSING_FIELD", message: "Game ID and user text are required" } },
    { status: 400 }
  );
}

if (userText.length < 10) {
  return NextResponse.json(
    { success: false, error: { code: "TEXT_TOO_SHORT", message: "User text must be at least 10 characters" } },
    { status: 400 }
  );
}

if (userText.length > 2000) {
  return NextResponse.json(
    { success: false, error: { code: "TEXT_TOO_LONG", message: "User text must be under 2000 characters" } },
    { status: 400 }
  );
}

if (!isValidGame(gameId)) {
  return NextResponse.json(
    { success: false, error: { code: "UNKNOWN_GAME", message: `Game '${gameId}' is not supported` } },
    { status: 400 }
  );
}
```

**LLM Timeout Handling**
```typescript
const timeoutMs = 30000; // 30 seconds
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await llmClient.generateContent(request, { signal: controller.signal });
  clearTimeout(timeoutId);
  // Process response...
} catch (error) {
  if (error.name === 'AbortError') {
    return NextResponse.json(
      { success: false, error: { code: "LLM_TIMEOUT", message: "LLM request timed out", retryable: true } },
      { status: 408 }
    );
  }
  // Handle other errors...
}
```

**LLM Error Handling**
```typescript
try {
  const llmResponse = await callLLM(request);
  const parsed = JSON.parse(llmResponse);
  
  // Validate response structure
  if (!validateRecallResponse(parsed)) {
    return NextResponse.json(
      { success: false, error: { code: "LLM_ERROR", message: "Invalid response format from LLM" } },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ success: true, data: parsed });
} catch (error) {
  console.error('LLM Error:', error);
  return NextResponse.json(
    { success: false, error: { code: "LLM_ERROR", message: "Failed to process with AI", details: error.message } },
    { status: 500 }
  );
}
```

### Loading States (Frontend)

**Loading States Timeline**
```
User clicks button
    ↓
Show spinner + "Analyzing your memories..."
    ↓ (after 2 seconds)
Show spinner + "The AI is reading your game lore..."
    ↓ (after 5 seconds)
Show spinner + "Almost there, piecing together your journey..."
    ↓ (after 10 seconds)
Show spinner + "Taking longer than expected... bear with us!"
    ↓
Success or Error
```

**Loading Component**
```typescript
// components/LoadingState.tsx
export function LoadingState({ elapsed }: { elapsed: number }) {
  const messages = [
    "Analyzing your memories...",
    "The AI is reading your game lore...",
    "Almost there, piecing together your journey...",
  ];
  
  const messageIndex = Math.min(Math.floor(elapsed / 2000), messages.length - 1);
  const message = elapsed > 10000 ? "Taking longer than expected... bear with us!" : messages[messageIndex];
  
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
```

**Empty State (Initial Load)**
```typescript
// components/EmptyState.tsx
export function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">
        Select a game and describe what you remember to get a recap
      </p>
    </div>
  );
}
```

**Low Confidence State**
```typescript
// When confidence < 0.5
if (response.data.confidence < 0.5) {
  return (
    <WarningCard>
      <p>The AI isn't very sure about this analysis.</p>
      <p>Try adding more details about:</p>
      <ul>
        <li>Specific locations or area names</li>
        <li>NPC names you remember</li>
        <li>Key items or weapons you have</li>
      </ul>
    </WarningCard>
  );
}
```

**Requires Clarification State**
```typescript
if (response.data.requiresClarification) {
  return (
    <ClarificationCard>
      <p>{response.data.requiresClarification}</p>
      <Button onClick={handleRetry}>Try Again with More Details</Button>
    </ClarificationCard>
  );
}
```

### Edge Cases

**1. Gibberish User Input**
- **Detection**: Backend checks for meaningful keywords/structure
- **Response**: 
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_INPUT",
      "message": "Could not understand your input. Please describe specific game events, locations, or characters."
    }
  }
  ```
- **Frontend**: Show helpful error with examples

**2. Very Vague Input**
- **LLM Handling**: System prompt instructs LLM to ask for clarification
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "confidence": 0.3,
      "requiresClarification": "I need more details. Did you remember any specific quests, NPCs, or locations?"
    }
  }
  ```
- **Frontend**: Show clarification prompt with retry button

**3. Game Not in Database**
- **Backend**: Return 400 with `UNKNOWN_GAME` error
- **Frontend**: Show friendly message, suggest supported games

**4. LLM Returns Invalid JSON**
- **Backend**: Try to parse, catch error, return 500
- **Frontend**: Show generic error, offer retry
- **Logging**: Log the raw response for debugging

**5. Network Errors**
- **Frontend**: Catch fetch errors, show "Network error" message
- **Retry**: Auto-retry once for network errors
- **Offline Mode**: Show "You appear to be offline" message

**6. Rate Limiting**
- **Backend**: Implement simple rate limit (e.g., 10 requests/minute per IP)
- **Response**: 429 with `retry-after` header
- **Frontend**: Show "Too many requests" with countdown timer

### Accessibility Considerations

- **Loading States**: Include `aria-live="polite"` for screen readers
- **Error Messages**: Use `role="alert"` for immediate attention
- **Form Validation**: Show inline errors with `aria-invalid` and `aria-describedby`
- **Keyboard Navigation**: Ensure all interactive elements are focusable
- **Color Contrast**: Ensure error states are visible for color-blind users

---

## Implementation Priority for Hackathon

### Phase 1: Core MVP (Must Have)
1. Basic Next.js setup with Tailwind
2. Single API endpoint (`/api/recall`)
3. One game supported (e.g., Elden Ring)
4. Simple frontend with game dropdown + text input
5. Basic loading state
6. Error handling for common cases

### Phase 2: Polish (Should Have)
1. Multiple games support
2. Better UI with cards and animations
3. Progressive loading messages
4. Input validation and inline errors
5. `/api/games` endpoint

### Phase 3: Nice-to-Have
1. Game grid with cover images
2. Confidence indicators
3. Clarification flow
4. Rate limiting
5. Multiple language support

---

## Deployment Strategy

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production (Vercel - Recommended for Next.js)
```bash
vercel
# Zero-config deployment
# Automatic HTTPS
# Environment variables in Vercel dashboard
```

### Environment Variables Required
```
OPENAI_API_KEY=sk-...          # or GEMINI_API_KEY
NEXT_PUBLIC_APP_URL=https://...
```

---

## Security Considerations

1. **API Keys**: Never expose LLM API keys in frontend code (use Next.js API routes)
2. **Rate Limiting**: Prevent abuse and control costs
3. **Input Sanitization**: Validate and sanitize all user inputs
4. **CORS**: Configure CORS if using separate frontend/backend
5. **Content Security Policy**: Add CSP headers in production

---

## Future Scalability Considerations

1. **Database**: Add PostgreSQL/Supabase for:
   - User accounts and save game recaps
   - Analytics on popular games
   - Cached LLM responses

2. **Caching**: Implement Redis for:
   - Frequently requested game data
   - Cached LLM responses for similar inputs

3. **Queue System**: For high load:
   - Use a job queue (BullMQ) for LLM requests
   - Implement WebSocket for real-time updates

4. **Microservices**: If scaling beyond hackathon:
   - Separate frontend, API, and LLM service
   - Use message queues for communication

---

## Summary

This architecture prioritizes:
- **Speed**: Single Next.js app, zero separate backend setup
- **Simplicity**: TypeScript throughout, clear separation of concerns
- **Scalability**: Modular structure allows easy expansion
- **Team Collaboration**: Clear file boundaries prevent git conflicts
- **User Experience**: Robust error handling and loading states
- **Hackathon-Ready**: MVP can be built in 4-6 hours

The design is intentionally simple for a hackathon but follows production best practices that will serve the team well if they continue development post-hackathon.
