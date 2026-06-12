import { gameCatalogEntries, gameIndexStats, systemGuidance } from '@/frontend/data/archiveConsole';

export function GameIndexWorkspace() {
  return (
    <section className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:p-8">
      <section className="rounded-[24px] border border-cyan-500/12 bg-[#061021]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Game Index</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">Centralized repository for all active and archived systems</h2>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#38bdf8)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(34,211,238,0.25)]"
          >
            + New Archive
          </button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {gameIndexStats.map((stat) => (
            <div key={stat.label} className="rounded-[22px] border border-white/6 bg-white/4 p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-50">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gameCatalogEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[24px] border border-white/6 bg-[linear-gradient(180deg,rgba(12,18,38,0.96),rgba(7,12,27,0.98))] p-4"
            >
              <div className="h-40 rounded-[18px] border border-white/6" style={{ background: entry.coverStyle }} />
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
                <span>{entry.system}</span>
                <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1 text-slate-300">{entry.status}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-slate-50">{entry.title}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400">
                <Meta label="Sessions" value={String(entry.sessions)} />
                <Meta label="Players" value={String(entry.players)} />
                <Meta label="Last Archive Sync" value={entry.lastSync} />
                <Meta label="Status" value={entry.status} />
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-2xl bg-[linear-gradient(90deg,#7c3aed,#8b5cf6)] px-4 py-3 text-sm font-semibold text-white"
              >
                View Game Logs
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-[24px] border border-cyan-500/12 bg-[#071021]/95 p-5 sm:p-6">
        <div className="rounded-2xl border border-violet-400/15 bg-violet-500/10 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-100">System Guidance</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{systemGuidance.tip}</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">{systemGuidance.note}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/6 bg-white/4 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">External Core Sync</p>
          <div className="mt-4 space-y-3">
            {systemGuidance.syncActions.map((action) => (
              <button
                key={action}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-white/6 bg-white/4 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/30"
              >
                <span>{action}</span>
                <span>&gt;</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/6 bg-white/4 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">System Maintenance</p>
          <div className="mt-4 space-y-4 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span>Index Integrity</span>
              <span className="font-semibold text-slate-100">{systemGuidance.integrity}</span>
            </div>
            <p>{systemGuidance.lastRecovery}</p>
          </div>
          <button
            type="button"
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
          >
            Run Full Diagnostic
          </button>
        </div>
      </aside>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/4 p-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}
