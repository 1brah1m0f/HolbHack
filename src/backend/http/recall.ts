import { NextRequest, NextResponse } from 'next/server';
import { buildRecallPrompt } from '@/backend/services/llm/prompts';
import { createLLMClient } from '@/backend/services/llm/clients';
import { getGameById } from '@/backend/services/games/games';
import {
  validateLLMResponse,
  validateRecallRequest,
} from '@/backend/validation/recall';
import { ErrorResponse, RecallRequest, RecallResponse } from '@/shared/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecallRequest = await request.json();

    const validation = validateRecallRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: validation.error ?? 'INVALID_INPUT',
            message: validation.message ?? 'Invalid request',
          },
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const game = getGameById(body.gameId);
    if (!game) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNKNOWN_GAME',
            message: `Game '${body.gameId}' not found`,
          },
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const messages = buildRecallPrompt(body.gameId, body.userText);
    const llmClient = createLLMClient();

    const timeoutMs = 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let llmResponse;
    try {
      llmResponse = await llmClient.generateContent({
        messages,
        temperature: 0.7,
        maxTokens: 1000,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'LLM_TIMEOUT',
              message: 'The AI analysis took too long. Please try again.',
              retryable: true,
            },
          } satisfies ErrorResponse,
          { status: 408 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LLM_ERROR',
            message: 'Failed to process with AI',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }

    let parsedResponse;
    try {
      const content = llmResponse.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      parsedResponse = JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse LLM response:', llmResponse.content);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LLM_ERROR',
            message: 'Invalid response format from LLM',
          },
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }

    if (!validateLLMResponse(parsedResponse)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LLM_ERROR',
            message: 'Invalid response structure from LLM',
          },
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }

    const response: RecallResponse = {
      success: true,
      data: {
        gameId: body.gameId,
        gameName: game.name,
        summary: parsedResponse.summary,
        nextSteps: parsedResponse.nextSteps,
        confidence: parsedResponse.confidence,
        requiresClarification: parsedResponse.requiresClarification,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/recall:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
