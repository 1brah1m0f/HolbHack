import type { GameInfo, RecallResponse } from '@/shared/types';
import { reconstructSeed } from '@/frontend/data/archiveConsole';

interface ReconstructWorkspaceProps {
  games: GameInfo[];
  selectedGame: string;
  userText: string;
  loading: boolean;
  validationErrors: {
    game?: string;
    text?: string;
  };
  gamesError: string | null;
  recallError: string | null;
  result: RecallResponse['data'] | null;
  onSelectedGameChange: (value: string) => void;
  onUserTextChange: (value: string) => void;
  onReconstruct: () => void;
  onClear: () => void;
}

export function ReconstructWorkspace({
  games,
  selectedGame,
  userText,
  loading,
  validationErrors,
  gamesError,
  recallError,
  result,
  onSelectedGameChange,
  onUserTextChange,
  onReconstruct,
  onClear,
}: ReconstructWorkspaceProps) {
  const certainty = result ? Math.round(result.confidence * 100) : reconstructSeed.certainty;
  const summaryTitle = result?.summary.title ?? reconstructSeed.summaryTitle;
  const summaryText = result
    ? `${result.summary.currentQuest}. Last known location: ${result.summary.lastKnownLocation}.`
    : reconstructSeed.summaryText;
  const events = result
    ? result.summary.pastEvents.map((event, index) => ({
        ago: `${index + 1} STEP`,
        type: index === 0 ? 'PRIMARY' : 'TRACE',
        text: event,
      }))
    : reconstructSeed.events;
  const nextSteps = result
    ? [result.nextSteps.immediateAction, ...result.nextSteps.shortTermGoals]
    : reconstructSeed.nextSteps;
  const tags = result
    ? [...result.summary.keyNPCsMet.slice(0, 2), result.summary.lastKnownLocation].filter(Boolean)
    : reconstructSeed.tags;
  const warning = recallError ?? result?.requiresClarification ?? reconstructSeed.warning;

  return (
    <section className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:p-8">
      <aside className="rounded-[24px] border border-cyan-500/15 bg-[linear-gradient(180deg,rgba(7,13,31,0.95),rgba(4,9,22,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Memory Shard Editor</p>
        <label className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Game System
          <select
            value={selectedGame}
            onChange={(event) => onSelectedGameChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-cyan-400/15 bg-[#091224] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50"
          >
            <option value="">Select a game shard</option>
            {games.map((game) => (
              <option key={game.id} value={game.id} disabled={!game.supported}>
                {game.name}
                {!game.supported ? ' (coming soon)' : ''}
              </option>
            ))}
          </select>
        </label>
        {validationErrors.game ? <p className="mt-2 text-xs text-rose-300">{validationErrors.game}</p> : null}

        <label className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Shard Narrative
          <textarea
            value={userText}
            onChange={(event) => onUserTextChange(event.target.value)}
            placeholder="Input raw narrative data for core reconstruction. Mention places, NPCs, quests, and anything half-remembered."
            className="mt-2 min-h-[190px] w-full resize-none rounded-2xl border border-cyan-400/15 bg-[#061025] px-4 py-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/45"
          />
        </label>
        {validationErrors.text ? <p className="mt-2 text-xs text-rose-300">{validationErrors.text}</p> : null}

        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            <span>Certainty Level</span>
            <span className="text-cyan-300">{certainty}%</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#22d3ee)] shadow-[0_0_18px_rgba(139,92,246,0.4)]"
              style={{ width: `${certainty}%` }}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Lower certainty increases the probability of fragmented or hallucinated lore synthesis.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Lore Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-400/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onReconstruct}
            disabled={loading}
            className="flex-1 rounded-2xl bg-[linear-gradient(90deg,#7c3aed,#8b5cf6)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(124,58,237,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Reconstructing...' : 'Reconstruct'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-cyan-400/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-300/35"
          >
            Clear
          </button>
        </div>

        {gamesError ? <p className="mt-4 text-xs text-amber-200">{gamesError}</p> : null}
      </aside>

      <div className="grid gap-6">
        <section className="rounded-[26px] border border-cyan-500/15 bg-[linear-gradient(180deg,rgba(11,19,44,0.92),rgba(6,11,28,0.96))] p-6 shadow-[0_16px_40px_rgba(2,8,23,0.45)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">High Priority Sync</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">{summaryTitle}</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">{summaryText}</p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[24px] border border-cyan-500/12 bg-[#091224]/95 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">Last Known Events</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">Archive trace</span>
            </div>
            <div className="mt-5 space-y-3">
              {events.map((event) => (
                <article
                  key={`${event.ago}-${event.text}`}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    {event.ago} - {event.type}
                  </p>
                  <p className="mt-2 text-sm text-slate-100">{event.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-cyan-500/12 bg-[#081121]/95 p-5 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">Suggested Next Step</h3>
            <div className="mt-5 space-y-3">
              {nextSteps.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/4 px-4 py-4 text-left text-sm text-slate-100 transition hover:border-violet-400/30 hover:bg-violet-500/10"
                >
                  <span>{step}</span>
                  <span className="text-cyan-300">&gt;</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-rose-500/18 bg-[linear-gradient(180deg,rgba(39,10,23,0.45),rgba(18,6,18,0.7))] px-5 py-5 text-sm text-rose-100 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-300">Uncertainty Note: Core Instability</p>
          <p className="mt-3 max-w-5xl leading-7 text-rose-50/90">{warning}</p>
        </section>
      </div>
    </section>
  );
}
