import type { ReactNode } from 'react';
import { navItems, type WorkspaceTab } from '@/frontend/data/archiveConsole';

interface ConsoleShellProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  children: ReactNode;
}

export function ConsoleShell({ activeTab, onTabChange, children }: ConsoleShellProps) {
  return (
    <div className="min-h-screen bg-[#040816] px-3 py-3 text-slate-100 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1720px] flex-col overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[#071022] shadow-[0_0_0_1px_rgba(32,201,255,0.08),0_32px_80px_rgba(3,7,18,0.75)]">
        <header className="border-b border-cyan-500/15 bg-[linear-gradient(180deg,rgba(11,19,41,0.98),rgba(8,13,30,0.92))] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-500/30 bg-violet-500/15 text-[10px] font-semibold tracking-[0.28em] text-violet-200">
                ARC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/75">Reconstruct</p>
                <h1 className="text-lg font-semibold tracking-[0.18em] text-violet-300 sm:text-xl">
                  Memory Core // Archive System
                </h1>
              </div>
            </div>

            <nav className="flex flex-nowrap items-center gap-1.5 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = item.id === activeTab;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={[
                      'shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition',
                      isActive
                        ? 'border-violet-400/50 bg-violet-500/25 text-white shadow-[0_0_24px_rgba(139,92,246,0.28)]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-100',
                    ].join(' ')}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 self-end xl:self-auto">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 md:flex">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                Scan archive
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),rgba(148,163,184,0.08))] text-sm font-semibold text-cyan-100">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between border-b border-cyan-500/10 bg-[#050b19] px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-400 sm:px-6">
          <div className="flex items-center gap-3 text-cyan-200/80">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            Current active session: &quot;The Void Breach&quot;
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <span>Scribe Mode</span>
            <span>Scan History</span>
            <span>Clear Buffer</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_30%),linear-gradient(180deg,#071022_0%,#050917_100%)]">
          {children}
        </main>

        <footer className="flex items-center justify-between border-t border-cyan-500/10 bg-[#050b19] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:px-6">
          <span className="text-cyan-300/70">Core status: optimal</span>
          <span>Latent memory capacity: 94.2%</span>
          <span className="hidden sm:inline">System time: 22:04:11</span>
        </footer>
      </div>
    </div>
  );
}
