import { RecallRequest, ErrorCode } from '@/types';
import { isValidGame } from './games/games';

export function validateRecallRequest(request: RecallRequest): { valid: boolean; error?: ErrorCode; message?: string } {
  // Check for missing fields
  if (!request.gameId) {
    return { valid: false, error: 'MISSING_FIELD', message: 'Game ID is required' };
  }

  if (!request.userText) {
    return { valid: false, error: 'MISSING_FIELD', message: 'User text is required' };
  }

  // Check text length
  if (request.userText.length < 10) {
    return { valid: false, error: 'TEXT_TOO_SHORT', message: 'User text must be at least 10 characters' };
  }

  if (request.userText.length > 2000) {
    return { valid: false, error: 'TEXT_TOO_LONG', message: 'User text must be under 2000 characters' };
  }

  // Check if game is supported
  if (!isValidGame(request.gameId)) {
    return { valid: false, error: 'UNKNOWN_GAME', message: `Game '${request.gameId}' is not supported` };
  }

  return { valid: true };
}

export function validateLLMResponse(response: any): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }

  // Check for required fields
  if (!response.summary || !response.nextSteps) {
    return false;
  }

  // Check summary structure
  const summary = response.summary;
  if (!summary.title || !Array.isArray(summary.pastEvents) || 
      !summary.currentQuest || !Array.isArray(summary.keyNPCsMet) || 
      !summary.lastKnownLocation) {
    return false;
  }

  // Check nextSteps structure
  const nextSteps = response.nextSteps;
  if (!nextSteps.immediateAction || !Array.isArray(nextSteps.shortTermGoals) || 
      !Array.isArray(nextSteps.tips)) {
    return false;
  }

  // Check confidence
  if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
    return false;
  }

  return true;
}
