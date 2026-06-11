import { NextResponse } from 'next/server';
import { getAllGameInfo } from '@/backend/services/games/games';
import { ErrorResponse, GamesResponse } from '@/shared/types';

export async function GET() {
  try {
    const response: GamesResponse = {
      success: true,
      data: {
        games: getAllGameInfo(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching games:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch games list',
        },
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
