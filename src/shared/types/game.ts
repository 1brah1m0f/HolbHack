// Game-related types for RPG Recall

export interface Game {
  id: string;
  name: string;
  coverImage?: string;
  supported: boolean;
  systemPrompt: string;  // Game-specific system prompt for LLM
}

export interface GameContext {
  gameId: string;
  gameName: string;
  systemPrompt: string;
}

export interface QuestProgress {
  title: string;
  currentQuest: string;
  pastEvents: string[];
  keyNPCsMet: string[];
  lastKnownLocation: string;
}

export interface NextSteps {
  immediateAction: string;
  shortTermGoals: string[];
  tips: string[];
  warnings?: string[];
}
