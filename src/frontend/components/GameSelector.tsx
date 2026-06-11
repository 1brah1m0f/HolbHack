'use client';

import { GameInfo } from '@/shared/types';
import { Select } from './ui/Select';

interface GameSelectorProps {
  games: GameInfo[];
  selectedGame: string;
  onGameChange: (gameId: string) => void;
  error?: string;
}

export function GameSelector({ games, selectedGame, onGameChange, error }: GameSelectorProps) {
  const options = [
    { value: '', label: 'Select a game...', disabled: true },
    ...games.map((game) => ({
      value: game.id,
      label: game.supported ? game.name : `${game.name} (Coming Soon)`,
      disabled: !game.supported,
    })),
  ];

  return (
    <Select
      label="Choose Your Game"
      options={options}
      value={selectedGame}
      onChange={(e) => onGameChange(e.target.value)}
      error={error}
    />
  );
}
