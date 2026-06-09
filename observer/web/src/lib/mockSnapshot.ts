/**
 * Realistic mock TeamSnapshot for development / pre-T8 testing.
 * Data matches the live konzept-review session captured in DATA-NOTES.md.
 */
import type {
  TeamSnapshot,
  AgentMetrics,
  Task,
  Message,
  CommEdge,
} from '../../../src/types'

const NOW = Date.now()
const TWO_HOURS = 2 * 60 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

/** Sample detail-insight feeds so the mock dev view exercises the new UI. */
function feed(
  to: string,
): Pick<AgentMetrics, 'thinkingCount' | 'activity' | 'sentMessages' | 'turns'> {
  const t = NOW - 60_000
  return {
    thinkingCount: 14,
    activity: [
      { ts: t - 40_000, kind: 'think', label: '' },
      { ts: t - 32_000, kind: 'say', label: 'Lese die Schlüsseldateien, um den Kontext zu verstehen.' },
      { ts: t - 24_000, kind: 'read', label: 'types.ts' },
      { ts: t - 16_000, kind: 'bash', label: 'grep -rn "AgentMetrics" src' },
      { ts: t - 8_000, kind: 'edit', label: 'AgentCard.tsx' },
      { ts: t - 2_000, kind: 'send', label: `→${to}: Abschnitt fertig` },
    ],
    sentMessages: [
      { ts: t - 2_000, to, type: 'message', summary: 'Abschnitt fertig', bodyLength: 240 },
    ],
    turns: [
      { ts: t - 30_000, durationMs: 129_485 },
      { ts: t - 18_000, durationMs: 84_020 },
      { ts: t - 4_000, durationMs: 14_298 },
    ],
  }
}

// ---------------------------------------------------------------------------
// Agents (real token counts from DATA-NOTES.md, colours from agent palette)
// ---------------------------------------------------------------------------
const mockAgents: AgentMetrics[] = [
  {
    agentId: 'team-lead@konzept-review',
    name: 'team-lead',
    color: '#60a5fa', // agent.0 blue-400
    model: 'claude-opus-4-8',
    role: 'team-lead',
    status: 'active',
    runtimeMs: TWO_HOURS,
    currentActivity: 'Read',
    lastActiveAt: NOW - 5_000,
    tokens: {
      inputTokens: 55_785,
      outputTokens: 74_981,
      cacheCreationInputTokens: 359_868,
      cacheReadInputTokens: 3_678_142,
    },
    costUsd: 18.73,
    tokensPerMin: 1_082,
    tasksCompleted: 5,
    tasksTotal: 8,
    messagesSent: 24,
    messagesReceived: 31,
    toolsUsed: { Read: 187, Bash: 94, Edit: 63, Write: 12, Agent: 8 },
    errorCount: 2,
    ...feed('architekt'),
  },
  {
    agentId: 'architekt@konzept-review',
    name: 'architekt',
    color: '#f472b6', // agent.1 pink-400
    model: 'claude-opus-4-8',
    role: 'architect',
    status: 'active',
    runtimeMs: Math.round(ONE_HOUR * 1.8),
    currentActivity: 'Bash',
    lastActiveAt: NOW - 12_000,
    tokens: {
      inputTokens: 41_591,
      outputTokens: 73_846,
      cacheCreationInputTokens: 570_191,
      cacheReadInputTokens: 2_309_408,
    },
    costUsd: 15.51,
    tokensPerMin: 1_074,
    tasksCompleted: 3,
    tasksTotal: 4,
    messagesSent: 18,
    messagesReceived: 14,
    toolsUsed: { Read: 144, Bash: 107, Edit: 55, Write: 9 },
    errorCount: 1,
    ...feed('team-lead'),
  },
  {
    agentId: 'ux@konzept-review',
    name: 'ux',
    color: '#34d399', // agent.2 emerald-400
    model: 'claude-opus-4-8',
    role: 'ux-designer',
    status: 'idle',
    runtimeMs: Math.round(ONE_HOUR * 1.5),
    currentActivity: 'responding',
    lastActiveAt: NOW - 180_000, // 3 min ago → idle
    tokens: {
      inputTokens: 31_582,
      outputTokens: 54_941,
      cacheCreationInputTokens: 545_809,
      cacheReadInputTokens: 2_528_322,
    },
    costUsd: 11.92,
    tokensPerMin: 952,
    tasksCompleted: 4,
    tasksTotal: 5,
    messagesSent: 22,
    messagesReceived: 19,
    toolsUsed: { Read: 122, Write: 88, Edit: 41, Bash: 23 },
    errorCount: 0,
    ...feed('team-lead'),
  },
  {
    agentId: 'advocatus@konzept-review',
    name: 'advocatus',
    color: '#fb923c', // agent.3 orange-400
    model: 'claude-opus-4-8',
    role: 'critic',
    status: 'done',
    runtimeMs: Math.round(ONE_HOUR * 1.2),
    currentActivity: 'responding',
    lastActiveAt: NOW - 600_000, // 10 min ago → done
    tokens: {
      inputTokens: 46_072,
      outputTokens: 57_926,
      cacheCreationInputTokens: 446_085,
      cacheReadInputTokens: 2_831_416,
    },
    costUsd: 14.19,
    tokensPerMin: 1_436,
    tasksCompleted: 6,
    tasksTotal: 6,
    messagesSent: 31,
    messagesReceived: 28,
    toolsUsed: { Read: 98, Bash: 74, Edit: 22, Write: 6 },
    errorCount: 3,
    ...feed('architekt'),
  },
]

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
const mockTasks: Task[] = [
  {
    id: '1',
    subject: 'Scaffold repository structure',
    description: 'Set up monorepo, shared types, and build tooling',
    status: 'completed',
    owner: 'team-lead',
    blocks: ['2', '3'],
    blockedBy: [],
  },
  {
    id: '2',
    subject: 'Design component architecture',
    description: 'Define component boundaries and data flow',
    status: 'completed',
    owner: 'architekt',
    blocks: ['4'],
    blockedBy: ['1'],
  },
  {
    id: '3',
    subject: 'Create UX wireframes',
    description: 'Dashboard wireframes and interaction spec',
    status: 'in_progress',
    owner: 'ux',
    blocks: ['5'],
    blockedBy: ['1'],
  },
  {
    id: '4',
    subject: 'Review architecture proposal',
    description: 'Critical review of the component architecture',
    status: 'completed',
    owner: 'advocatus',
    blocks: [],
    blockedBy: ['2'],
  },
  {
    id: '5',
    subject: 'Implement core components',
    description: 'Build the main UI components',
    status: 'in_progress',
    owner: 'architekt',
    blocks: ['6'],
    blockedBy: ['3'],
  },
  {
    id: '6',
    subject: 'Integration testing',
    description: 'End-to-end test suite',
    status: 'pending',
    owner: '',
    blocks: [],
    blockedBy: ['5'],
  },
  {
    id: '7',
    subject: 'Performance review',
    description: 'Audit rendering performance and bundle size',
    status: 'pending',
    owner: '',
    blocks: [],
    blockedBy: ['5'],
  },
  {
    id: '8',
    subject: 'Final presentation',
    description: 'Prepare and deliver stakeholder demo',
    status: 'pending',
    owner: '',
    blocks: [],
    blockedBy: ['6', '7'],
  },
]

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
const mockMessages: Message[] = [
  {
    from: 'advocatus',
    to: 'architekt',
    text: 'Deal, voll dabei. Die Architektur sieht solide aus, besonders der Trennung von Daten- und Präsentationsschicht.',
    summary: 'Deal angenommen: Architektur sieht solid aus',
    timestamp: NOW - 3_600_000,
    color: '#fb923c',
    read: true,
  },
  {
    from: 'team-lead',
    to: 'ux',
    text: 'Bitte überarbeite die Wireframes für den Dashboard-Bereich — wir brauchen eine mobile-first Ansicht.',
    summary: 'Wireframes für Dashboard überarbeiten',
    timestamp: NOW - 2_400_000,
    color: '#60a5fa',
    read: true,
  },
  {
    from: 'ux',
    to: 'team-lead',
    text: 'Wireframes für alle Breakpoints fertig. Bitte review die neue Kartenansicht.',
    summary: 'Wireframes bereit zum Review',
    timestamp: NOW - 1_800_000,
    color: '#34d399',
    read: false,
  },
  {
    from: 'architekt',
    to: 'team-lead',
    text: 'Komponentenstruktur vollständig umgesetzt, PR #42 ist offen. Wartet auf Approval.',
    summary: 'PR #42 geöffnet — wartet auf Approval',
    timestamp: NOW - 900_000,
    color: '#f472b6',
    read: false,
  },
  {
    from: 'team-lead',
    to: 'advocatus',
    text: 'Kannst du das neue Konzept für die Kommunikationsgraphen kritisch prüfen?',
    summary: 'Bitte Konzept prüfen',
    timestamp: NOW - 450_000,
    color: '#60a5fa',
    read: true,
  },
]

// ---------------------------------------------------------------------------
// Comm edges
// ---------------------------------------------------------------------------
const mockEdges: CommEdge[] = [
  { from: 'team-lead', to: 'ux', count: 8 },
  { from: 'team-lead', to: 'architekt', count: 11 },
  { from: 'team-lead', to: 'advocatus', count: 5 },
  { from: 'ux', to: 'team-lead', count: 7 },
  { from: 'architekt', to: 'team-lead', count: 9 },
  { from: 'architekt', to: 'advocatus', count: 4 },
  { from: 'advocatus', to: 'architekt', count: 6 },
  { from: 'advocatus', to: 'ux', count: 3 },
  { from: 'ux', to: 'advocatus', count: 2 },
]

// ---------------------------------------------------------------------------
// Full snapshot
// ---------------------------------------------------------------------------
export const mockSnapshot: TeamSnapshot = {
  team: {
    name: 'konzept-review',
    description: 'Design and review platform for new product concepts',
    createdAt: NOW - TWO_HOURS,
    leadAgentId: 'team-lead@konzept-review',
    leadSessionId: 'd4e9e7cb-0d31-4bb0-a8a3-c95e168fb40c',
    members: mockAgents.map(a => ({
      agentId: a.agentId,
      name: a.name,
      agentType: a.role,
      model: a.model,
      joinedAt: NOW - TWO_HOURS,
      tmuxPaneId: '',
      cwd: '/Users/lionel/fitness-coach',
      subscriptions: [],
    })),
  },
  generatedAt: NOW,
  agents: mockAgents,
  tasks: mockTasks,
  messages: mockMessages,
  edges: mockEdges,
  totals: {
    agentCount: mockAgents.length,
    activeAgents: mockAgents.filter(a => a.status === 'active').length,
    totalCostUsd: mockAgents.reduce((s, a) => s + a.costUsd, 0),
    totalTokens: mockAgents.reduce(
      (s, a) => s + a.tokens.inputTokens + a.tokens.outputTokens,
      0,
    ),
    tasksCompleted: mockTasks.filter(t => t.status === 'completed').length,
    tasksTotal: mockTasks.length,
    messagesExchanged: mockMessages.length,
  },
}

/** Mock team list for the /api/teams fallback */
export const mockTeams: string[] = ['konzept-review']
