import { LLMMessage } from './types';
import { getGameById } from '../games/games';

export function buildRecallPrompt(gameId: string, userText: string): LLMMessage[] {
  const game = getGameById(gameId);
  
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }

  return [
    {
      role: 'system',
      content: game.systemPrompt,
    },
    {
      role: 'user',
      content: `Here are my fragmented memories from playing ${game.name}:

${userText}

Please analyze this and tell me where I am in the game and what I should do next.`,
    },
  ];
}
