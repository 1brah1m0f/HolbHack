import {
  preservationToggles,
  settingsIdentity,
  settingsSections,
  settingsVisual,
  synthesisToggles,
} from '@/frontend/data/archiveConsole';

export function SettingsWorkspace() {
  return (
    <section className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:p-8">
      <aside className="rounded-[24px] border border-violet-400/18 bg-[#071021]/95 p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">System Navigation</p>
        <div className="mt-5 space-y-3">
          {settingsSections.map((section, index) => (
            <button
              key={section}
              type="button"
              className={[
                'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition',
                index === 0
                  ? 'border-violet-400/25 bg-violet-500/12 text-violet-100'
                  : 'border-white/6 bg-white/4 text-slate-300 hover:border-cyan-300/25',
              ].join(' ')}
            >
              <span>{section}</span>
              <span>{index === 0 ? '+' : '-'}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/6 p-4 text-sm text-slate-300">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Sync Status</p>
          <p className="mt-3 leading-7">Last archive synchronization complete. Core stability at 89.09%.</p>
        </div>
      </aside>

      <section className="rounded-[24px] border border-cyan-500/12 bg-[#061021]/95 p-5 sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Core Settings</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-50">Configure the archive&apos;s fundamental operational parameters</h2>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h3 className="text-2xl font-semibold text-slate-100">Overseer Identity</h3>
            <div className="mt-5 space-y-4 rounded-[24px] border border-white/6 bg-white/4 p-5">
              {settingsIdentity.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/6 bg-[#081121] px-4 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/12 bg-white/4 px-4 py-3 text-sm text-slate-200">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              <ToggleRow
                label="Biometric Verification"
                description="Require multi-factor authorization for data extraction."
                defaultChecked={true}
              />
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-slate-100">Visual Frequency</h3>
            <div className="mt-5 rounded-[24px] border border-white/6 bg-white/4 p-5">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Luminescence Intensity</span>
                    <span className="text-cyan-300">{settingsVisual.preview}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={settingsVisual.luminescence}
                    className="mt-4 h-2 w-full accent-violet-400"
                  />
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    Adjust the glow strength of runic accents and shard borders.
                  </p>
                </div>
                <div className="rounded-[24px] border border-cyan-400/14 bg-[#081121] p-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Shard Preview</p>
                  <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-2xl border border-violet-400/18 bg-violet-500/10 text-violet-100">
                    4Z
                  </div>
                  <p className="mt-4 text-sm text-slate-400">Rune luminescence adjusted to core stability.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleRow
                  label="High Contrast Protocol"
                  description="Enhance text legibility by muting background glass effects."
                  defaultChecked={false}
                />
                <ToggleRow
                  label="Motion Smoothing"
                  description="Enable fluid transitions between reconstruction views."
                  defaultChecked={true}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-slate-100">Archive Preservation</h3>
            <div className="mt-5 rounded-[24px] border border-white/6 bg-white/4 p-5">
              <div className="space-y-4">
                {preservationToggles.map((item) =>
                  item.kind === 'text' ? (
                    <div key={item.label} className="rounded-2xl border border-white/6 bg-[#081121] px-4 py-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                          <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                        </div>
                        <div className="rounded-2xl border border-cyan-400/12 bg-white/4 px-4 py-3 text-sm text-slate-200">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ToggleRow
                      key={item.label}
                      label={item.label}
                      description={item.description}
                      defaultChecked={item.enabled}
                    />
                  ),
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-slate-100">Synthesis Intelligence</h3>
            <div className="mt-5 rounded-[24px] border border-white/6 bg-white/4 p-5">
              <div className="rounded-2xl border border-white/6 bg-[#081121] px-4 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{synthesisToggles[0].label}</p>
                    <p className="mt-2 text-sm text-slate-500">{synthesisToggles[0].description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {synthesisToggles[0].chips?.map((chip, index) => (
                      <span
                        key={chip}
                        className={[
                          'rounded-full border px-3 py-1 text-xs',
                          index === 1
                            ? 'border-violet-400/25 bg-violet-500/12 text-violet-100'
                            : 'border-white/8 bg-white/4 text-slate-300',
                        ].join(' ')}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ToggleRow
                  label={synthesisToggles[1].label}
                  description={synthesisToggles[1].description}
                  defaultChecked={Boolean(synthesisToggles[1].enabled)}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className="rounded-2xl bg-[linear-gradient(90deg,#7c3aed,#8b5cf6)] px-5 py-3 text-sm font-semibold text-white"
          >
            Commit to Core
          </button>
        </div>
      </section>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/6 bg-[#081121] px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      <span className="relative inline-flex items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-7 w-14 rounded-full bg-white/10 transition peer-checked:bg-violet-500/80" />
        <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:left-8" />
      </span>
    </label>
  );
}
