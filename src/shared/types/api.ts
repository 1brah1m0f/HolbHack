// API Request and Response Types for RPG Recall

// Recall API Request
export interface RecallRequest {
  gameId: string;           // Game identifier (e.g., "elden-ring", "witcher-3")
  userText: string;         // User's fragmented memories (10-2000 chars)
  locale?: string;          // Optional: "en" | "es" | "fr" (default: "en")
}

// Recall API Response - Success
export interface RecallResponse {
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

// Error Response Types
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown> | string;
    retryable?: boolean;
  };
}

export type ErrorCode =
  | "INVALID_INPUT"
  | "MISSING_FIELD"
  | "TEXT_TOO_SHORT"
  | "TEXT_TOO_LONG"
  | "UNKNOWN_GAME"
  | "LLM_TIMEOUT"
  | "INTERNAL_ERROR"
  | "LLM_ERROR"
  | "RATE_LIMIT";

// Games API Response
export interface GamesResponse {
  success: true;
  data: {
    games: GameInfo[];
  };
}

export interface GameInfo {
  id: string;
  name: string;
  coverImage?: string;
  supported: boolean;
}

export interface ArchiveItem {
  id: string;
  gameId: string;
  gameName: string;
  userText: string;
  summary: string;
  createdAt: string;
}

export interface ArchivesResponse {
  success: true;
  data: {
    archives: ArchiveItem[];
  };
}

// Union type for all possible API responses
export type ApiResponse = RecallResponse | ErrorResponse;
export type GamesApiResponse = GamesResponse | ErrorResponse;
