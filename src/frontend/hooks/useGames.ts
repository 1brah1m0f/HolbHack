'use client';

import { useState, useEffect } from 'react';
import { ErrorResponse, GameInfo, GamesResponse } from '@/shared/types';

export function useGames() {
  const [games, setGames] = useState<GameInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/games');
        const data: GamesResponse | ErrorResponse = await response.json();

        if (data.success) {
          setGames(data.data.games);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to fetch games');
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  return { games, loading, error };
}
