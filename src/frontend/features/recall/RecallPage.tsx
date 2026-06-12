'use client';

import { useMemo, useState } from 'react';
import { ArchivesWorkspace } from '@/frontend/components/archives/ArchivesWorkspace';
import { GameIndexWorkspace } from '@/frontend/components/index/GameIndexWorkspace';
import { ConsoleShell } from '@/frontend/components/layout/ConsoleShell';
import { ReconstructWorkspace } from '@/frontend/components/reconstruct/ReconstructWorkspace';
import { SettingsWorkspace } from '@/frontend/components/settings/SettingsWorkspace';
import { fallbackGames, type WorkspaceTab } from '@/frontend/data/archiveConsole';
import { useGames } from '@/frontend/hooks/useGames';
import { useRecall } from '@/frontend/hooks/useRecall';
import type { RecallRequest } from '@/shared/types';

export function RecallPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('reconstruct');
  const [selectedGame, setSelectedGame] = useState('');
  const [userText, setUserText] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    game?: string;
    text?: string;
  }>({});

  const { games, error: gamesError } = useGames();
  const { recall, data, loading, error } = useRecall();

  const availableGames = useMemo(() => (games.length > 0 ? games : fallbackGames), [games]);

  const handleRecall = async () => {
    const errors: { game?: string; text?: string } = {};

    if (!selectedGame) {
      errors.game = 'Bir oyun secin.';
    }

    if (userText.trim().length < 10) {
      errors.text = 'En az 10 simvol xatire metni daxil edin.';
    } else if (userText.trim().length > 2000) {
      errors.text = 'Metn 2000 simvoldan uzun olmamalidir.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await recall({
      gameId: selectedGame,
      userText: userText.trim(),
    } satisfies RecallRequest);
  };

  const handleClear = () => {
    setUserText('');
    setValidationErrors({});
  };

  return (
    <ConsoleShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'reconstruct' ? (
        <ReconstructWorkspace
          games={availableGames}
          selectedGame={selectedGame}
          userText={userText}
          loading={loading}
          validationErrors={validationErrors}
          gamesError={gamesError}
          recallError={error}
          result={data}
          onSelectedGameChange={(value) => {
            setSelectedGame(value);
            setValidationErrors((current) => ({ ...current, game: undefined }));
          }}
          onUserTextChange={(value) => {
            setUserText(value);
            setValidationErrors((current) => ({ ...current, text: undefined }));
          }}
          onReconstruct={handleRecall}
          onClear={handleClear}
        />
      ) : null}
      {activeTab === 'archives' ? <ArchivesWorkspace /> : null}
      {activeTab === 'game-index' ? <GameIndexWorkspace /> : null}
      {activeTab === 'settings' ? <SettingsWorkspace /> : null}
    </ConsoleShell>
  );
}
