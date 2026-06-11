'use client';

import { useState } from 'react';
import { EmptyState } from '@/frontend/components/EmptyState';
import { ErrorState } from '@/frontend/components/ErrorState';
import { GameSelector } from '@/frontend/components/GameSelector';
import { LoadingState } from '@/frontend/components/LoadingState';
import { MemoryInput } from '@/frontend/components/MemoryInput';
import { ResultCards } from '@/frontend/components/ResultCards';
import { Button } from '@/frontend/components/ui/Button';
import { useGames } from '@/frontend/hooks/useGames';
import { useRecall } from '@/frontend/hooks/useRecall';
import { RecallRequest } from '@/shared/types';

export function RecallPage() {
  const { games, loading: gamesLoading } = useGames();
  const { recall, data, loading, error, startTime } = useRecall();

  const [selectedGame, setSelectedGame] = useState('');
  const [userText, setUserText] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    game?: string;
    text?: string;
  }>({});

  const handleRecall = async () => {
    const errors: { game?: string; text?: string } = {};

    if (!selectedGame) {
      errors.game = 'Please select a game';
    }

    if (userText.length < 10) {
      errors.text = 'Please provide more details (min 10 characters)';
    } else if (userText.length > 2000) {
      errors.text = 'Keep it under 2000 characters';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await recall({
      gameId: selectedGame,
      userText,
    } satisfies RecallRequest);
  };

  const handleRetry = () => {
    setValidationErrors({});
    handleRecall();
  };

  const handleReset = () => {
    setSelectedGame('');
    setUserText('');
    setValidationErrors({});
  };

  if (gamesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            RPG Recall
          </h1>
          <p className="text-blue-200 text-lg">
            Never forget where you left off in your favorite RPG games
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {!data && !loading && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <GameSelector
                games={games}
                selectedGame={selectedGame}
                onGameChange={setSelectedGame}
                error={validationErrors.game}
              />

              <div className="mt-6">
                <MemoryInput
                  value={userText}
                  onChange={setUserText}
                  error={validationErrors.text}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleRecall}
                  variant="primary"
                  size="lg"
                  disabled={!selectedGame || userText.length < 10}
                >
                  Recall My Journey
                </Button>
              </div>
            </div>
          )}

          {loading && <LoadingState startTime={startTime || undefined} />}

          {error && !loading && (
            <ErrorState error={error} onRetry={handleRetry} retryable={true} />
          )}

          {data && !loading && (
            <div>
              <ResultCards data={data} />

              <div className="mt-6 flex justify-center gap-4">
                <Button onClick={handleReset} variant="outline">
                  Start Over
                </Button>
                <Button onClick={handleRetry} variant="primary">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!data &&
            !loading &&
            !error &&
            selectedGame === '' &&
            userText === '' && <EmptyState />}
        </div>

        <footer className="text-center mt-12 text-blue-200 text-sm">
          <p>Powered by AI - Built for Hackathon</p>
        </footer>
      </div>
    </div>
  );
}
