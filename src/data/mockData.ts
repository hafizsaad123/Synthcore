import { Agent, Decision, ConnectedTool, AlertItem, SystemGoal } from '../types';

export const INITIAL_AI_TOOLS: ConnectedTool[] = [
  { id: 'openai', name: 'OpenAI / ChatGPT', logo: '🤖', category: 'LLM Provider', connected: false },
  { id: 'claude', name: 'Anthropic Claude', logo: '🎭', category: 'LLM Provider', connected: false },
  { id: 'gemini', name: 'Google Gemini', logo: '✨', category: 'LLM Provider', connected: false },
  { id: 'zapier', name: 'Zapier', logo: '⚡', category: 'Automation', connected: false },
  { id: 'make', name: 'Make.com', logo: '🔗', category: 'Automation', connected: false },
  { id: 'hubspot', name: 'HubSpot', logo: '🧡', category: 'CRM', connected: false },
  { id: 'salesforce', name: 'Salesforce', logo: '☁️', category: 'CRM', connected: false },
  { id: 'slack', name: 'Slack', logo: '💬', category: 'Communication', connected: false },
  { id: 'notion', name: 'Notion', logo: '📓', category: 'Productivity', connected: false },
  { id: 'custom_api', name: 'Custom API Webhook', logo: '🔌', category: 'Developer', connected: false },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'SupportBot-01',
    tool: 'Claude',
    status: 'Running',
    opsPerMin: 142,
    health: 100,
    goal: 'Automate customer support response times',
    instructions: 'Monitor the incoming support queue, categorize queries by emergency level, and draft answers with appropriate product guides.',
    priority: 'high',
  },
  {
    id: 'a2',
    name: 'LeadQual-03',
    tool: 'OpenAI',
    status: 'Running',
    opsPerMin: 89,
    health: 98,
    goal: 'Speed up lead qualification',
    instructions: 'Review inbound signup metadata, fetch company context from clearbit or linkedin API, and score them from A-D.',
    priority: 'normal',
  },
  {
    id: 'a3',
    name: 'DataSync-07',
    tool: 'Zapier',
    status: 'Warning',
    opsPerMin: 12,
    health: 67,
    goal: 'Sync CRM and database',
    instructions: 'Trigger on HubSpot lead changes and update relational data records in the Postgres database, verifying address consistency.',
    priority: 'low',
  },
  {
    id: 'a4',
    name: 'ReportGen-02',
    tool: 'Gemini',
    status: 'Failed',
    opsPerMin: 0,
    health: 0,
    goal: 'Automate weekly reporting pipeline',
    instructions: 'Aggregate previous week analytics from Google Analytics, Stripe, and Sendgrid. Compile into a markdown layout and post to Slack.',
    priority: 'high',
  },
  {
    id: 'a5',
    name: 'EmailBot-05',
    tool: 'Claude',
    status: 'Running',
    opsPerMin: 78,
    health: 95,
    goal: 'Email automation campaign',
    instructions: 'Send personalized onboarding emails to newly qualified Tier-A leads, offering tailored workspace setups based on their sector.',
    priority: 'normal',
  },
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'd1',
    type: 'Rerouted',
    description: 'ReportGen-02 failed during Stripe fetch — tasks rerouted to OpenAI backup automatically to maintain service.',
    agent: 'Arxodyne OS',
    time: '2 mins ago',
  },
  {
    id: 'd2',
    type: 'Completed',
    description: 'LeadQual-03 processed 47 new leads from HubSpot and marked 6 as Enterprise Tier-A candidates.',
    agent: 'LeadQual-03',
    time: '4 mins ago',
  },
  {
    id: 'd3',
    type: 'Alert',
    description: 'DataSync-07 queue depth exceeding normal threshold (847 database items pending sync). Speed is degraded.',
    agent: 'DataSync-07',
    time: '7 mins ago',
  },
  {
    id: 'd4',
    type: 'Deployed',
    description: 'New autonomous agent SupportBot-01 successfully compiled, tested, and added to the CRM pipeline.',
    agent: 'Arxodyne OS',
    time: '12 mins ago',
  },
  {
    id: 'd5',
    type: 'Completed',
    description: 'EmailBot-05 sent out 14 custom-composed workspace upgrade sequences with an open rate of 88%.',
    agent: 'EmailBot-05',
    time: '28 mins ago',
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'al1',
    agentId: 'a3',
    title: 'Sync Rate Degraded',
    severity: 'warning',
    description: 'DataSync-07 API latency has spiked to 1420ms. Synchronizations are queueing up.',
    time: '7 mins ago',
    resolved: false,
  },
  {
    id: 'al2',
    agentId: 'a4',
    title: 'Aggregation Failure',
    severity: 'critical',
    description: 'ReportGen-02 failed to authenticate with Stripe API. Missing token in environment.',
    time: '2 mins ago',
    resolved: false,
  },
  {
    id: 'al3',
    title: 'CPU Usage Spiked',
    severity: 'info',
    description: 'Autonomous worker instance #3 memory usage is currently 67%. Normal limits respected.',
    time: '1 hour ago',
    resolved: false,
  },
];

export const INITIAL_GOALS: SystemGoal[] = [
  {
    id: 'g1',
    title: 'Reduce customer support response time by 50%',
    progress: 73,
    status: 'active',
    timeRemaining: '12 days remaining',
    description: 'Deploy auto-classification and response drafting agents. Goal is to bring the median response down from 2.4 hours to under 1.2 hours.',
  },
  {
    id: 'g2',
    title: 'Automate our weekly reporting pipeline',
    progress: 10,
    status: 'paused',
    timeRemaining: '30 days remaining',
    description: 'Build a comprehensive automated workflow where stats from Stripe, GA4, and Hubspot are synthesized every Sunday night.',
  },
  {
    id: 'g3',
    title: 'Increase outbound lead velocity',
    progress: 100,
    status: 'completed',
    timeRemaining: 'Completed 3 days ago',
    description: 'Automate Tier-A lead filtering and instant initial outreach emails. Target was 20 qualified campaigns per week; currently running 35.',
  }
];
