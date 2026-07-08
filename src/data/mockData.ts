import { Agent, Decision, ConnectedTool, AlertItem, SystemGoal } from '../types';

export const INITIAL_AI_TOOLS: ConnectedTool[] = [
  { id: 'openai', name: 'OpenAI / ChatGPT', logo: '🤖', category: 'LLM Provider', connected: false },
  { id: 'claude', name: 'Anthropic Claude', logo: '🎭', category: 'LLM Provider', connected: false },
  { id: 'gemini', name: 'Google Gemini', logo: '✨', category: 'LLM Provider', connected: false },
  { id: 'zapier', name: 'Arxodyne Orchestrator', logo: '✴️', category: 'Automation', connected: true },
  { id: 'make', name: 'Make.com', logo: '🔗', category: 'Automation', connected: false },
  { id: 'hubspot', name: 'HubSpot', logo: '🧡', category: 'CRM', connected: false },
  { id: 'salesforce', name: 'Salesforce', logo: '☁️', category: 'CRM', connected: false },
  { id: 'slack', name: 'Slack', logo: '💬', category: 'Communication', connected: false },
  { id: 'notion', name: 'Notion', logo: '📓', category: 'Productivity', connected: false },
  { id: 'supabase', name: 'Supabase Database', logo: '⚡', category: 'Database', connected: true },
  { id: 'custom_api', name: 'Custom API Webhook', logo: '🔌', category: 'Developer', connected: false },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'arxodyne-gateway-01',
    tool: 'Claude',
    status: 'Running',
    opsPerMin: 142,
    health: 100,
    goal: 'Securely route AI traffic across redundant API endpoints',
    instructions: 'Monitor global failover latency, analyze response metrics, and automatically switch models when latency exceeds 1.5 seconds.',
    priority: 'high',
  },
  {
    id: 'a2',
    name: 'arxodyne-guardrail-v4',
    tool: 'OpenAI',
    status: 'Running',
    opsPerMin: 89,
    health: 98,
    goal: 'Identify and filter sensitive data inputs and malicious system prompts',
    instructions: 'Scan all inbound and outbound payloads for PII, API tokens, and potential jailbreak attempts. Block requests violating compliance policies.',
    priority: 'normal',
  },
  {
    id: 'a3',
    name: 'arxodyne-DataSync-07',
    tool: 'Arxodyne',
    status: 'Warning',
    opsPerMin: 12,
    health: 67,
    goal: 'Maintain real-time database synchronization with CRM records',
    instructions: 'Trigger on HubSpot lead changes and update relational data records in the Postgres database, verifying address consistency.',
    priority: 'low',
  },
  {
    id: 'a4',
    name: 'arxodyne-ReportGen-02',
    tool: 'Gemini',
    status: 'Failed',
    opsPerMin: 0,
    health: 0,
    goal: 'Aggregate system performance stats into weekly report briefs',
    instructions: 'Fetch data points from Google Analytics, Stripe logs, and SendGrid campaigns. Format into a comprehensive markdown layout and push to Slack.',
    priority: 'high',
  },
  {
    id: 'a5',
    name: 'arxodyne-outreach-05',
    tool: 'Claude',
    status: 'Running',
    opsPerMin: 78,
    health: 95,
    goal: 'Automate onboarding engagement sequences',
    instructions: 'Send personalized onboarding emails to newly qualified Tier-A leads, offering tailored workspace setups based on their sector.',
    priority: 'normal',
  },
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'd1',
    type: 'Rerouted',
    description: 'arxodyne-ReportGen-02 failed during Stripe fetch — tasks rerouted to OpenAI backup gateway automatically to maintain continuity.',
    agent: 'Arxodyne OS Kernel',
    time: '2 mins ago',
  },
  {
    id: 'd2',
    type: 'Completed',
    description: 'arxodyne-guardrail-v4 processed 47 inbound requests, blocked 2 jailbreak attempts, and scrubbed 1 client token from logging headers.',
    agent: 'arxodyne-guardrail-v4',
    time: '4 mins ago',
  },
  {
    id: 'd3',
    type: 'Alert',
    description: 'arxodyne-DataSync-07 buffer capacity exceeded (847 database transactions pending sync). Model entering throttled mode.',
    agent: 'arxodyne-DataSync-07',
    time: '7 mins ago',
  },
  {
    id: 'd4',
    type: 'Deployed',
    description: 'New autonomous worker instance arxodyne-gateway-01 successfully compiled, tested, and added to the gateway cluster.',
    agent: 'Arxodyne OS Kernel',
    time: '12 mins ago',
  },
  {
    id: 'd5',
    type: 'Completed',
    description: 'arxodyne-outreach-05 sent out 14 custom-composed system welcome layouts with an opening engagement rate of 88%.',
    agent: 'arxodyne-outreach-05',
    time: '28 mins ago',
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'al1',
    agentId: 'a3',
    title: 'Sync Latency Degraded',
    severity: 'warning',
    description: 'arxodyne-DataSync-07 connection latency has spiked to 1420ms. Transaction items are queuing up.',
    time: '7 mins ago',
    resolved: false,
  },
  {
    id: 'al2',
    agentId: 'a4',
    title: 'Stripe Fetch Failure',
    severity: 'critical',
    description: 'arxodyne-ReportGen-02 failed to authenticate with Stripe API due to a missing client token in current environment variables.',
    time: '2 mins ago',
    resolved: false,
  },
  {
    id: 'al3',
    title: 'CPU Usage Alert',
    severity: 'info',
    description: 'Kernel system performance warning: Simulated worker #3 cpu limit reached 67%. Safe operating range maintained.',
    time: '1 hour ago',
    resolved: false,
  },
];

export const INITIAL_GOALS: SystemGoal[] = [
  {
    id: 'g1',
    title: 'Optimize global failover routing and compile kernel micro-configs',
    progress: 73,
    status: 'active',
    timeRemaining: '12 days remaining',
    description: 'Deploy auto-classification and response drafting agents. Goal is to bring the median routing response down under 1.2 seconds.',
  },
  {
    id: 'g2',
    title: 'Automate weekly performance stats pipeline',
    progress: 10,
    status: 'paused',
    timeRemaining: '30 days remaining',
    description: 'Build an automated reporting system that synthesizes analytics from Stripe, GA4, and HubSpot every Sunday night.',
  },
  {
    id: 'g3',
    title: 'Accelerate outbound qualified lead engagement',
    progress: 100,
    status: 'completed',
    timeRemaining: 'Completed 3 days ago',
    description: 'Filter Tier-A prospects and draft initial engagement guides. Target was 20 campaigns/week; running 35.',
  }
];
