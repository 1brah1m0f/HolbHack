import { useState, useEffect } from 'react';
import { archiveDetail, archiveFilters } from '@/frontend/data/archiveConsole';
import { ErrorResponse, ArchivesResponse } from '@/shared/types';

export function ArchivesWorkspace() {
  const [archives, setArchives] = useState<ArchivesResponse['data']['archives']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchives() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/archives');
        const data: ArchivesResponse | ErrorResponse = await response.json();

        if (data.success) {
          setArchives(data.data.archives);
        } else {
          setError(data.error.message);
        }
      } catch {
        setError('Failed to fetch archives');
      } finally {
        setLoading(false);
      }
    }

    fetchArchives();
  }, []);

  return (
    <section className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[260px_minmax(0,1fr)_320px] xl:p-8">
      <aside className="rounded-[24px] border border-cyan-500/12 bg-[#071021]/95 p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">Reconstruction Filters</p>
        <FilterGroup title="Game System" items={archiveFilters.systems} />
        <FilterGroup title="Archive State" items={archiveFilters.states} />
        <FilterGroup title="Memory Type" items={archiveFilters.memoryTypes} />
        <button
          type="button"
          className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-300/35"
        >
          Reset Parameters
        </button>
      </aside>

      <section className="rounded-[24px] border border-cyan-500/12 bg-[#061021]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Rune Catalog</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">Accessing secure chronological memory partitions</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 lg:min-w-[320px]">
            Search by keyword, game, or rune-tag...
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archives.map((archive) => (
            <article
              key={archive.id}
              className="rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(13,19,38,0.96),rgba(7,12,27,0.98))] p-3 shadow-[0_16px_30px_rgba(2,8,23,0.35)]"
            >
              <div className="h-32 rounded-[18px] border border-white/6 bg-cyan-900/20" />
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
                <span>{archive.gameName}</span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">
                  {Math.round(Math.random() * 10 + 90)}% Match
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-50">{archive.summary}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                {new Date(archive.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                  {archive.gameId}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(archive.createdAt).toLocaleTimeString()}</span>
                <span>COMPLETED</span>
              </div>
            </article>
          ))}

          <button
            type="button"
            className="grid min-h-[290px] place-items-center rounded-[22px] border border-dashed border-cyan-400/18 bg-cyan-400/3 text-center transition hover:border-cyan-300/35"
          >
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/8 text-2xl text-cyan-200">
                +
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">Initiate New Reconstruction</p>
              <p className="mt-2 text-sm text-slate-500">Capture fresh memory shards for archiving</p>
            </div>
          </button>
        </div>
      </section>

      <aside className="rounded-[24px] border border-cyan-500/12 bg-[#071021]/95 p-5 sm:p-6">
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
          ARC-772
        </span>
        <h3 className="mt-4 text-3xl font-semibold text-slate-50">{archiveDetail.title}</h3>
        <p className="mt-2 text-sm text-cyan-300">{archiveDetail.system}</p>
        <div className="mt-6 h-40 rounded-[22px] border border-white/6 bg-[linear-gradient(135deg,rgba(22,34,68,0.85),rgba(13,79,130,0.35)),radial-gradient(circle_at_top_left,rgba(0,226,255,0.45),transparent_55%)]" />
        <div className="mt-5 rounded-2xl border border-white/6 bg-white/4 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
            <span>{archiveDetail.status}</span>
            <span className="text-cyan-300">{archiveDetail.match}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/5">
            <div className="h-full w-[98%] rounded-full bg-[linear-gradient(90deg,#22d3ee,#7c3aed)]" />
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-white/6 bg-white/4 p-4 text-sm text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Summary</p>
          <p className="mt-3 leading-7">{archiveDetail.summary}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <InfoRow label="Reconstruction Fidelity" value={archiveDetail.fidelity} />
          <InfoRow label="Last Sync" value={archiveDetail.lastSync} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {archiveDetail.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-violet-400/15 bg-violet-500/10 px-3 py-1 text-xs text-violet-100"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="mt-8 w-full rounded-2xl bg-[linear-gradient(90deg,#7c3aed,#8b5cf6)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.35)]"
        >
          Re-Analyze Memory
        </button>
      </aside>
    </section>
  );
}

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" defaultChecked={item === items[0]} className="h-4 w-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/4 p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}
