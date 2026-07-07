export type AgentStatus = 'Running' | 'Warning' | 'Failed' | 'Paused';

export interface Agent {
  id: string;
  name: string;
  tool: string;
  status: AgentStatus;
  opsPerMin: number;
  health: number;
  goal: string;
  instructions: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
}

export interface Decision {
  id: string;
  type: 'Rerouted' | 'Completed' | 'Alert' | 'Deployed';
  description: string;
  agent: string;
  time: string;
}

export interface ConnectedTool {
  id: string;
  name: string;
  logo: string;
  category: string;
  connected: boolean;
}

export interface AlertItem {
  id: string;
  agentId?: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  time: string;
  resolved: boolean;
}

export interface SystemGoal {
  id: string;
  title: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  timeRemaining: string;
  description: string;
}
