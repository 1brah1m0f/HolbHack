import { NextResponse } from 'next/server';
import { GamesResponse, GameInfo } from '@/types';

// Mock game data - in production, this would come from a database
const SUPPORTED_GAMES: GameInfo[] = [
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    coverImage: '/games/elden-ring.jpg',
    supported: true,
  },
  {
    id: 'witcher-3',
    name: 'The Witcher 3: Wild Hunt',
    coverImage: '/games/witcher-3.jpg',
    supported: true,
  },
  {
    id: 'skyrim',
    name: 'The Elder Scrolls V: Skyrim',
    coverImage: '/games/skyrim.jpg',
    supported: true,
  },
  {
    id: 'mass-effect-3',
    name: 'Mass Effect 3',
    coverImage: '/games/mass-effect-3.jpg',
    supported: false, // Coming soon
  },
];

export async function GET() {
  try {
    const response: GamesResponse = {
      success: true,
      data: {
        games: SUPPORTED_GAMES,
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
      },
      { status: 500 }
    );
  }
}
