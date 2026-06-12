export type WorkspaceTab =
  | 'reconstruct'
  | 'archives'
  | 'game-index'
  | 'settings';

export interface NavItem {
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
}

export interface ArchiveCard {
  id: string;
  title: string;
  system: string;
  subtitle: string;
  match: number;
  status: string;
  date: string;
  tags: string[];
  coverStyle: string;
}

export interface CatalogEntry {
  id: string;
  system: string;
  title: string;
  sessions: number;
  players: number;
  lastSync: string;
  status: string;
  coverStyle: string;
}

export const navItems: NavItem[] = [
  { id: 'reconstruct', label: 'Reconstruct', shortLabel: 'RECONSTRUCT' },
  { id: 'archives', label: 'Archives', shortLabel: 'ARCHIVES' },
  { id: 'game-index', label: 'Game Index', shortLabel: 'GAME INDEX' },
  { id: 'settings', label: 'System', shortLabel: 'SYSTEM' },
];

export const fallbackGames = [
  { id: 'elden-ring', name: 'Elden Ring', supported: true },
  { id: 'witcher-3', name: 'The Witcher 3', supported: true },
  { id: 'skyrim', name: 'Skyrim', supported: true },
  { id: 'mass-effect-3', name: 'Mass Effect 3', supported: false },
];

export const reconstructSeed = {
  activeSession: 'CURRENT ACTIVE SESSION: "THE VOID BREACH"',
  syncMode: 'Scribe Mode',
  summaryTitle: 'Current Situation Summary',
  summaryText:
    "The party stands before the Crystalline Veil within the Obsidian Spires. Malakor's shade has warned of a traitor among the Council of Seven, but his memory is flickering. The ambient mana is highly unstable, requiring a Level 4 Arcane Stability Check to proceed further into the ritual chamber.",
  narrative:
    'The party entered the Obsidian Spires and met the ghost of Malakor while trying to reconstruct the last stable ritual sequence.',
  certainty: 75,
  tags: ['Malakor', 'Ghost', 'Obsidian Spires'],
  events: [
    { ago: '10M AGO', type: 'LORE', text: "Malakor's shade summoned" },
    { ago: '42M AGO', type: 'HAZARD', text: 'Trap triggered in West Wing' },
    { ago: '1H AGO', type: 'STATUS', text: 'Rest at the Shattered Hearth' },
  ],
  nextSteps: [
    'Interrogate Malakor further',
    'Examine the Council Sigils',
    'Retreat to the Shattered Hearth',
  ],
  warning:
    'Several memory strands regarding the "Council of Seven" are conflicting. The Reconstruction Engine predicts a 25% chance of unreliable narrative synthesis. Cross-reference with SESSION LOGS is advised.',
};

export const archiveFilters = {
  systems: ['D&D 5E', 'Cyberpunk Red', 'Shadowrun', 'Pathfinder', 'Warhammer Fantasy'],
  states: ['High Fidelity', 'Stable', 'Fragmented', 'Corrupted'],
  memoryTypes: ['Combat', 'Diplomacy', 'Lore', 'Exploration', 'NPC Interaction'],
};

export const archiveCards: ArchiveCard[] = [
  {
    id: 'obsidian-spire-collapse',
    title: 'The Obsidian Spire Collapse',
    system: 'Shadowrun: Neo-Tokyo',
    subtitle: 'ARC-772',
    match: 88,
    status: 'ABR-772',
    date: '2026-03-12',
    tags: ['Combat', 'Major Event'],
    coverStyle:
      'linear-gradient(135deg, rgba(22,34,68,0.85), rgba(13,79,130,0.35)), radial-gradient(circle at top left, rgba(0,226,255,0.45), transparent 55%)',
  },
  {
    id: 'negotiations-high-inquisitor',
    title: 'Negotiations with High Inquisitor',
    system: 'Pathfinder: Wrath of the Righteous',
    subtitle: 'ARC-785',
    match: 84,
    status: 'ARC-785',
    date: '2026-03-08',
    tags: ['Diplomacy', 'Social'],
    coverStyle:
      'linear-gradient(135deg, rgba(84,89,110,0.9), rgba(216,222,234,0.25)), radial-gradient(circle at top right, rgba(255,255,255,0.45), transparent 35%)',
  },
  {
    id: 'whisperer-static',
    title: 'The Whisperer in the Static',
    system: 'Cyberpunk Red',
    subtitle: 'ARC-759',
    match: 72,
    status: 'ARC-759',
    date: '2026-03-05',
    tags: ['Netrunning', 'Ritual'],
    coverStyle:
      'linear-gradient(135deg, rgba(12,19,36,0.92), rgba(47,47,88,0.45)), radial-gradient(circle at center, rgba(103,232,249,0.2), transparent 35%)',
  },
  {
    id: 'ambush-raven-creek',
    title: 'Ambush at Raven Creek',
    system: 'D&D 5E: Curse of Strahd',
    subtitle: 'ARC-741',
    match: 86,
    status: 'ARC-741',
    date: '2026-02-28',
    tags: ['Combat', 'Encounter'],
    coverStyle:
      'linear-gradient(135deg, rgba(36,16,41,0.92), rgba(92,23,56,0.38)), radial-gradient(circle at top, rgba(255,113,113,0.22), transparent 40%)',
  },
  {
    id: 'shattered-compass',
    title: 'Finding the Shattered Compass',
    system: 'Sea of Thieves TTRPG',
    subtitle: 'ARC-730',
    match: 89,
    status: 'ARC-730',
    date: '2026-02-15',
    tags: ['Exploration', 'Treasure'],
    coverStyle:
      'linear-gradient(135deg, rgba(8,43,53,0.92), rgba(60,127,88,0.42)), radial-gradient(circle at bottom right, rgba(110,231,183,0.2), transparent 40%)',
  },
  {
    id: 'alchemists-betrayal',
    title: "The Alchemist's Betrayal",
    system: 'Warhammer Fantasy',
    subtitle: 'ARC-712',
    match: 81,
    status: 'ARC-712',
    date: '2026-02-01',
    tags: ['Plot Twist', 'NPC Interaction'],
    coverStyle:
      'linear-gradient(135deg, rgba(69,26,3,0.92), rgba(146,64,14,0.35)), radial-gradient(circle at top right, rgba(251,191,36,0.2), transparent 35%)',
  },
];

export const archiveDetail = {
  title: 'The Obsidian Spire Collapse',
  system: 'Shadowrun: Neo-Tokyo',
  status: 'Stability Status',
  fidelity: 'Level 5: High Fidelity',
  lastSync: '2026-03-12',
  match: 98,
  summary:
    'The moment the core containment failed and the spire began its structural descent into the bay.',
  tags: ['#Combat', '#MajorEvent', '#CriticalFailure'],
};

export const gameIndexStats = [
  { label: 'Total Systems', value: '12' },
  { label: 'Active Campaigns', value: '03' },
  { label: 'Archived Logs', value: '1.2k' },
  { label: 'Players Connected', value: '18' },
];

export const gameCatalogEntries: CatalogEntry[] = [
  {
    id: 'neon-protocol',
    system: 'Cyberpunk Red',
    title: 'The Neon Protocol',
    sessions: 24,
    players: 5,
    lastSync: '2 days ago',
    status: 'Active',
    coverStyle:
      'linear-gradient(135deg, rgba(44,8,64,0.92), rgba(181,25,82,0.38)), radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 35%)',
  },
  {
    id: 'oakhaven',
    system: 'D&D 5th Edition',
    title: 'Shadows over Oakhaven',
    sessions: 52,
    players: 6,
    lastSync: 'Oct 14, 2023',
    status: 'Legacy',
    coverStyle:
      'linear-gradient(135deg, rgba(15,32,24,0.9), rgba(74,124,89,0.38)), radial-gradient(circle at center, rgba(163,230,53,0.18), transparent 40%)',
  },
  {
    id: 'vector-9',
    system: 'Mothership RPG',
    title: 'Vector-9 Extraction',
    sessions: 8,
    players: 4,
    lastSync: '1 week ago',
    status: 'Active',
    coverStyle:
      'linear-gradient(135deg, rgba(8,24,55,0.92), rgba(36,98,155,0.4)), radial-gradient(circle at top right, rgba(167,139,250,0.22), transparent 38%)',
  },
  {
    id: 'crimson-moon',
    system: 'Pathfinder 2E',
    title: 'Curse of the Crimson Moon',
    sessions: 15,
    players: 5,
    lastSync: '1 month ago',
    status: 'On Hiatus',
    coverStyle:
      'linear-gradient(135deg, rgba(13,36,83,0.92), rgba(40,93,170,0.34)), radial-gradient(circle at top left, rgba(251,146,60,0.18), transparent 35%)',
  },
  {
    id: 'midnight-mars',
    system: 'Delta Green',
    title: 'Midnight on Mars',
    sessions: 12,
    players: 3,
    lastSync: '3 days ago',
    status: 'Active',
    coverStyle:
      'linear-gradient(135deg, rgba(83,29,14,0.92), rgba(156,90,60,0.38)), radial-gradient(circle at center, rgba(252,165,165,0.16), transparent 38%)',
  },
  {
    id: 'five-rings',
    system: 'L5R 5th Edition',
    title: 'Legends of the Five Rings',
    sessions: 38,
    players: 4,
    lastSync: 'Dec 2022',
    status: 'Legacy',
    coverStyle:
      'linear-gradient(135deg, rgba(34,37,62,0.94), rgba(111,62,149,0.36)), radial-gradient(circle at top, rgba(253,224,71,0.16), transparent 36%)',
  },
];

export const systemGuidance = {
  tip: 'Use the RECONSTRUCT tab to generate new memory shards for any active game index here.',
  note:
    'Keeping detailed system metadata ensures the Archive Overseer can predict narrative branching more accurately.',
  syncActions: ['Import Roll20 Data', 'Foundry VTT Link', 'D&D Beyond Sync'],
  integrity: '99.8%',
  lastRecovery: 'Last recovery scan: 04:00 UTC',
};

export const settingsSections = ['Account', 'Appearance', 'Data & Security', 'AI Synthesis', 'Key Bindings'];

export const settingsIdentity = [
  {
    label: 'Archive Alias',
    description: 'Your public identifier within the reconstruction network.',
    value: 'Archive Overseer',
  },
  {
    label: 'Comm-Link Protocol',
    description: 'Primary email for critical system alerts and shard recovery.',
    value: 'overseer@rpg-core.archive',
  },
];

export const settingsVisual = {
  luminescence: 75,
  preview: 'LEVEL 75%',
};

export const preservationToggles = [
  {
    label: 'Auto-Archive Frequency',
    description: 'Interval between automatic session log preservation.',
    value: 'Every 6 hours',
    kind: 'text' as const,
  },
  {
    label: 'Memory Compression',
    description: 'Optimize storage usage for long-form session logs.',
    enabled: true,
    kind: 'toggle' as const,
  },
  {
    label: 'Deep Purge',
    description: 'Irreversibly delete corrupted memory shards after 30 days.',
    enabled: false,
    kind: 'toggle' as const,
  },
];

export const synthesisToggles = [
  {
    label: 'Narrative Creativity',
    description: 'Level of interpretive detail provided during shard reconstruction.',
    chips: ['Literal', 'Balanced', 'Creative'],
  },
  {
    label: 'Predictive Next Steps',
    description: 'Enable AI-suggested actions based on current situation summaries.',
    enabled: true,
  },
];
