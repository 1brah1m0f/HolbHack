import { NextRequest, NextResponse } from 'next/server';
import { RecallRequest, RecallResponse, ErrorResponse } from '@/types';
import { validateRecallRequest, validateLLMResponse } from '@/lib/validation';
import { createLLMClient } from '@/lib/llm/clients';
import { buildRecallPrompt } from '@/lib/llm/prompts';
import { getGameById } from '@/lib/games/games';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RecallRequest = await request.json();

    // Validate request
    const validation = validateRecallRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: validation.error,
            message: validation.message,
          },
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get game information
    const game = getGameById(body.gameId);
    if (!game) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNKNOWN_GAME',
            message: `Game '${body.gameId}' not found`,
          },
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Build LLM prompt
    const messages = buildRecallPrompt(body.gameId, body.userText);

    // Create LLM client and generate content
    const llmClient = createLLMClient();
    
    // Set timeout for LLM request
    const timeoutMs = 30000; // 30 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let llmResponse;
    try {
      llmResponse = await llmClient.generateContent({
        messages,
        temperature: 0.7,
        maxTokens: 1000,
      });
      clearTimeout(timeoutId);
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'LLM_TIMEOUT',
              message: 'The AI analysis took too long. Please try again.',
              retryable: true,
            },
          } as ErrorResponse,
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LLM_ERROR',
            message: 'Failed to process with AI',
            details: error.message,
          },
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Parse LLM response
    let parsedResponse;
    try {
      // Extract JSON from the response (LLMs sometimes include markdown code blocks)
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
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Validate response structure
    if (!validateLLMResponse(parsedResponse)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LLM_ERROR',
            message: 'Invalid response structure from LLM',
          },
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Build success response
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
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
