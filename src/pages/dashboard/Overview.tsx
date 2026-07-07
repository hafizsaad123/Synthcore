import { useState, useMemo } from 'react';
import { Agent, Decision, AlertItem, SystemGoal } from '../../types';
import { CustomLineChart, CustomDonutChart } from '../../components/CustomCharts';
import ToolLogo from '../../components/ToolLogo';
import { 
  Search, 
  Plus, 
  Terminal, 
  AlertTriangle, 
  Play, 
  Pause, 
  ArrowRight, 
  Eye, 
  Layers, 
  Activity, 
  Settings,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';

interface OverviewProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  goals: SystemGoal[];
  setGoals: React.Dispatch<React.SetStateAction<SystemGoal[]>>;
  username: string;
  companyName: string;
  activeGoalText: string;
  showToast: (content: string, error?: boolean) => void;
  onNavigate: (path: string) => void;
}

export default function Overview({
  agents,
  setAgents,
  decisions,
  setDecisions,
  alerts,
  setAlerts,
  goals,
  setGoals,
  username,
  companyName,
  activeGoalText,
  showToast,
  onNavigate
}: OverviewProps) {
  const [timeRange, setTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Deploy Agent Modal state
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentTool, setNewAgentTool] = useState('Claude');
  const [newAgentInstructions, setNewAgentInstructions] = useState('');
  const [newAgentPriority, setNewAgentPriority] = useState<'critical' | 'high' | 'normal' | 'low'>('normal');
  const [deploying, setDeploying] = useState(false);

  // Agent Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Dismissing global banner
  const [showBanner, setShowBanner] = useState(true);

  // Filtered agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.tool.toLowerCase().includes(query) ||
        a.status.toLowerCase().includes(query) ||
        a.goal.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  // Operations Data based on Time Range
  const operationsData = useMemo(() => {
    switch (timeRange) {
      case '30d':
        return [
          { label: 'Week 1', value: 245000 },
          { label: 'Week 2', value: 312000 },
          { label: 'Week 3', value: 289000 },
          { label: 'Week 4', value: 384000 },
        ];
      case '7d':
        return [
          { label: 'Mon', value: 41200 },
          { label: 'Tue', value: 43500 },
          { label: 'Wed', value: 39100 },
          { label: 'Thu', value: 48200 },
          { label: 'Fri', value: 46700 },
          { label: 'Sat', value: 21300 },
          { label: 'Sun', value: 25100 },
        ];
      case '24h':
      default:
        return [
          { label: '00:00', value: 1200 },
          { label: '04:00', value: 850 },
          { label: '08:00', value: 2400 },
          { label: '12:00', value: 3600 },
          { label: '16:00', value: 4200 },
          { label: '20:00', value: 3100 },
          { label: 'Now', value: 4829 },
        ];
    }
  }, [timeRange]);

  // Health Distribution for Donut Chart
  const healthDistribution = useMemo(() => {
    const running = agents.filter((a) => a.status === 'Running').length;
    const warning = agents.filter((a) => a.status === 'Warning').length;
    const critical = agents.filter((a) => a.status === 'Failed').length;
    const paused = agents.filter((a) => a.status === 'Paused').length;

    return [
      { key: 'healthy', label: 'Healthy (Running)', value: running, color: 'success' },
      { key: 'warning', label: 'Degraded (Warning)', value: warning, color: 'warning' },
      { key: 'critical', label: 'Critical (Failed)', value: critical, color: 'critical' },
      { key: 'paused', label: 'Paused', value: paused, color: 'border' },
    ];
  }, [agents]);

  const hasUnresolvedAlerts = useMemo(() => {
    return alerts.some((a) => !a.resolved);
  }, [alerts]);

  const handleDeployAgentSubmit = () => {
    if (!newAgentName.trim() || !newAgentInstructions.trim()) {
      showToast('Please fill in all agent fields.', true);
      return;
    }

    setDeploying(true);
    setTimeout(() => {
      const newId = `a${agents.length + 1}`;
      const newlyDeployed: Agent = {
        id: newId,
        name: newAgentName,
        tool: newAgentTool,
        status: 'Running',
        opsPerMin: Math.floor(Math.random() * 80) + 20,
        health: 100,
        goal: activeGoalText || 'Reduce support response time',
        instructions: newAgentInstructions,
        priority: newAgentPriority
      };

      const newDecision: Decision = {
        id: `d${decisions.length + 1}`,
        type: 'Deployed',
        description: `New custom agent ${newAgentName} compiled and deployed into execution loop successfully.`,
        agent: 'Arxodyne OS',
        time: 'Just now'
      };

      setAgents((prev) => [newlyDeployed, ...prev]);
      setDecisions((prev) => [newDecision, ...prev]);
      setDeploying(false);
      setDeployModalOpen(false);
      
      // Reset Form
      setNewAgentName('');
      setNewAgentInstructions('');
      setNewAgentPriority('normal');
      
      showToast(`Agent "${newAgentName}" compiled & deployed successfully!`);
    }, 1200);
  };

  const handleToggleAgentStatus = (id: string, currentStatus: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const isRunning = currentStatus === 'Running';
          const newStatus = isRunning ? 'Paused' : 'Running';
          
          // Log decision
          const newDecision: Decision = {
            id: `d${decisions.length + 1}`,
            type: isRunning ? 'Alert' : 'Deployed',
            description: `Agent ${a.name} was manually ${isRunning ? 'paused' : 'resumed'} by administrator.`,
            agent: 'Arxodyne OS',
            time: 'Just now'
          };
          setDecisions((prevD) => [newDecision, ...prevD]);
          
          return {
            ...a,
            status: newStatus,
            opsPerMin: newStatus === 'Running' ? Math.floor(Math.random() * 100) + 20 : 0,
            health: newStatus === 'Running' ? 100 : a.health
          };
        }
        return a;
      })
    );
    showToast(`Agent status updated.`);
  };

  const openAgentDetail = (agent: Agent) => {
    setSelectedAgent(agent);
    setDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">{companyName || 'Arxodyne'} Command Center</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Welcome back, {username || 'Administrator'} · All core modules healthy · Real-time update active
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/dashboard/logs')}
            className="px-3.5 py-1.5 bg-white hover:bg-neutral-50 border border-[#EAEAEA] text-xs font-semibold rounded text-neutral-700 transition-colors"
          >
            System Logs
          </button>
          <button
            onClick={() => setDeployModalOpen(true)}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Deploy Agent
          </button>
        </div>
      </div>

      {/* ── ROW 1: STATUS BANNER (if any active warnings/failures) ── */}
      {showBanner && hasUnresolvedAlerts && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-900 flex gap-3 relative">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="font-bold">System Alert: AI Agent Networks Require Attention</span>
            <p className="leading-relaxed text-amber-800">
              Anomalies detected inside the active agent routing network. <strong>ReportGen-02</strong> has failed and tasks were safely migrated to OpenAI fallback nodes. 
              <strong>DataSync-07</strong> has experienced high connection latency.
            </p>
            <div>
              <button 
                onClick={() => onNavigate('/dashboard/alerts')}
                className="text-amber-950 font-bold hover:underline"
              >
                Resolve at Alerts Desk →
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute top-3 right-3 text-amber-600 hover:text-amber-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── ROW 2: KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Agents',
            value: agents.filter((a) => a.status === 'Running' || a.status === 'Warning').length,
            badgeText: '↑ 2 new',
            badgeTone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            sub: 'since wizard'
          },
          {
            label: 'Daily Agent Ops',
            value: '48,291',
            badgeText: '↑ 12.4%',
            badgeTone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            sub: 'vs previous day'
          },
          {
            label: 'Scheduler Uptime',
            value: '99.98%',
            badgeText: 'Nominal',
            badgeTone: 'bg-neutral-100 text-neutral-700 border-neutral-200',
            sub: 'SLA respected'
          },
          {
            label: 'Core Goal Progress',
            value: '73%',
            progressValue: 73,
            sub: '12 days remaining'
          }
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">{card.label}</span>
              <span className="text-2xl font-extrabold text-black font-mono tracking-tight">{card.value}</span>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              {card.badgeText && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${card.badgeTone}`}>
                  {card.badgeText}
                </span>
              )}
              {card.progressValue !== undefined && (
                <div className="w-full flex flex-col gap-1.5">
                  <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all" style={{ width: `${card.progressValue}%` }}></div>
                  </div>
                </div>
              )}
              <span className="text-[11px] text-neutral-400 font-mono">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 3: CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Operations Chart */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] pb-4 mb-4">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">Operations Over Time</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-[#EAEAEA] bg-white rounded px-2.5 py-1 font-mono focus:outline-none focus:border-black text-neutral-700"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          <CustomLineChart data={operationsData} />
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm">
          <div className="border-b border-[#F5F5F5] pb-4 mb-4">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">Agent Status Distribution</span>
          </div>
          <CustomDonutChart data={healthDistribution} />
        </div>

      </div>

      {/* ── ROW 4: LIVE AGENT TABLE ── */}
      <div className="bg-white border border-[#EAEAEA] rounded-md shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-[#EAEAEA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">Live Agent Node List</h3>
            <span className="text-[11px] text-neutral-400 font-mono">Telemetry grid displaying model nodes in local workspace</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-black font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black font-mono text-[10px]"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 text-neutral-500 font-semibold border-b border-[#EAEAEA] uppercase font-mono text-[10px]">
                <th className="p-4">AGENT NODE</th>
                <th className="p-4">LLM ENGINE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">OPS/MIN</th>
                <th className="p-4">HEALTH INDEX</th>
                <th className="p-4">ASSIGNED GOAL</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA] text-neutral-700">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-mono">
                    No active agent nodes matching search criteria
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-bold text-black">{agent.name}</td>
                    <td className="p-4">
                      <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1.5 w-fit">
                        <ToolLogo id={agent.tool} className="w-3.5 h-3.5" />
                        {agent.tool}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        agent.status === 'Running'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : agent.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : agent.status === 'Failed'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === 'Running'
                            ? 'bg-emerald-500'
                            : agent.status === 'Warning'
                            ? 'bg-amber-500'
                            : agent.status === 'Failed'
                            ? 'bg-red-500'
                            : 'bg-neutral-400'
                        }`} />
                        {agent.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-black font-semibold">{agent.opsPerMin}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 w-28">
                        <span className="text-[10px] font-mono font-semibold text-neutral-700">{agent.health}%</span>
                        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              agent.health > 80 ? 'bg-emerald-500' : agent.health > 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${agent.health}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-neutral-500 font-mono text-[11px]" title={agent.goal}>
                        {agent.goal}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openAgentDetail(agent)}
                          className="px-2.5 py-1 hover:bg-neutral-100 border border-[#EAEAEA] rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-neutral-500" /> View
                        </button>
                        <button
                          onClick={() => handleToggleAgentStatus(agent.id, agent.status)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                            agent.status === 'Paused'
                              ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700'
                              : 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-700'
                          }`}
                        >
                          {agent.status === 'Paused' ? 'Resume' : 'Pause'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── ROW 5: RECENT DECISIONS FEED & SIDEBARS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Decision logs feed (spanning 2 columns on desktop) */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="border-b border-[#F5F5F5] pb-3">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">Autonomous Operations Decision Feed</h3>
            </div>
            
            <div className="flex flex-col gap-4 divide-y divide-neutral-100">
              {decisions.slice(0, 4).map((decision, i) => (
                <div key={decision.id} className={`flex gap-4 items-start ${i > 0 ? 'pt-4' : ''}`}>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                    decision.type === 'Rerouted' || decision.type === 'Alert'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : decision.type === 'Completed' || decision.type === 'Deployed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                  }`}>
                    {decision.type}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1 font-mono text-[11px]">
                    <p className="text-neutral-800 leading-normal">{decision.description}</p>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="font-bold text-neutral-500">{decision.agent}</span>
                      <span>·</span>
                      <span>{decision.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#F5F5F5] pt-4 mt-4">
            <button
              onClick={() => onNavigate('/dashboard/logs')}
              className="text-xs font-bold text-neutral-800 hover:text-black font-mono uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              View all historical logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side panel column */}
        <div className="flex flex-col gap-4">
          
          {/* Active Goal Widget */}
          <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">Active Target Goal</span>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-bold text-black leading-relaxed font-sans">
                "{activeGoalText || 'Reduce customer support response time by 50%'}"
              </p>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-black transition-all" style={{ width: '73%' }} />
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 mt-0.5">
                <span>73% ACHIEVED</span>
                <span>12 DAYS LEFT</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/goals')}
              className="w-full py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-[#EAEAEA] text-xs font-semibold rounded transition-colors"
            >
              Adjust Objectives
            </button>
          </div>

          {/* Core telemetries panel */}
          <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">Autonomous Telemetry</span>
            <div className="flex flex-col gap-2.5 font-mono text-[11px]">
              {[
                { label: 'Agent Routing Delay', value: '143ms', bad: false },
                { label: 'Active Tasks Queue', value: '12 active', bad: false },
                { label: 'Self-healing Retries', value: '0 failures', bad: false },
                { label: 'Model Sync Token Rate', value: '8,400 t/s', bad: false },
                { label: 'Operating System Load', value: '67%', bad: true },
              ].map(({ label, value, bad }) => (
                <div key={label} className="flex items-center justify-between border-b border-neutral-50 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-neutral-500">{label}</span>
                  <span className={`font-bold ${bad ? 'text-amber-600' : 'text-neutral-800'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* DEPLOY NEW AGENT OVERLAY MODAL */}
      {deployModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Compile & Deploy Agent Node</span>
              </div>
              <button 
                onClick={() => setDeployModalOpen(false)}
                className="text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 font-sans">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Agent Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. SalesScraper-04, TicketRouter-01"
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Primary LLM Intelligence Node</label>
                <select
                  value={newAgentTool}
                  onChange={(e) => setNewAgentTool(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="OpenAI">OpenAI GPT-4o</option>
                  <option value="Gemini">Google Gemini 1.5 Pro</option>
                  <option value="Zapier">Zapier Automation Engine</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Agent Core Instruction Set (English Rules)</label>
                <textarea
                  value={newAgentInstructions}
                  onChange={(e) => setNewAgentInstructions(e.target.value)}
                  rows={4}
                  placeholder="Provide rules, objectives, APIs, and edge cases to check. e.g. 'Scrape newly registered leads, fetch tech stack, score index...'"
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans resize-none"
                />
                <span className="text-[10px] text-neutral-400 font-mono">Arxodyne automatically compiles these rules into real-time LLM prompts.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Thread Priority Pool</label>
                <select
                  value={newAgentPriority}
                  onChange={(e) => setNewAgentPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="critical">Critical — Execution takes absolute priority</option>
                  <option value="high">High — Prefer node allocation instantly</option>
                  <option value="normal">Normal — Standard round-robin queuing</option>
                  <option value="low">Low — Compute only when queue is idle</option>
                </select>
              </div>

            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeployModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-neutral-100 border border-[#EAEAEA] rounded text-xs font-semibold text-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeployAgentSubmit}
                disabled={deploying}
                className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white rounded text-xs font-semibold transition-colors"
              >
                {deploying ? 'Compiling Agent...' : 'Deploy Agent Node'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW AGENT INSPECT OVERLAY MODAL */}
      {detailModalOpen && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Agent Inspect: {selectedAgent.name}</span>
              </div>
              <button 
                onClick={() => setDetailModalOpen(false)}
                className="text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 text-xs font-sans">
              
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase">STATUS</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    selectedAgent.status === 'Running'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedAgent.status === 'Warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedAgent.status === 'Failed'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                  }`}>
                    {selectedAgent.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-neutral-200"></div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase">LLM MODEL NODE</span>
                  <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1.5 w-fit">
                    <ToolLogo id={selectedAgent.tool} className="w-3.5 h-3.5 text-black" />
                    {selectedAgent.tool}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <span className="font-bold text-neutral-700 uppercase">Core Instructions:</span>
                <div className="p-3 bg-neutral-50 border border-[#EAEAEA] rounded leading-normal text-neutral-600 max-h-36 overflow-y-auto whitespace-pre-line">
                  {selectedAgent.instructions}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-neutral-100 py-3.5 font-mono text-[11px]">
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 uppercase">Ops Frequency</span>
                  <span className="font-bold text-black">{selectedAgent.opsPerMin} ops/min</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 uppercase">Node Health</span>
                  <span className={`font-bold ${selectedAgent.health > 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {selectedAgent.health}%
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-neutral-400 uppercase">Thread Priority</span>
                  <span className={`font-bold uppercase ${
                    selectedAgent.priority === 'critical' 
                      ? 'text-red-600' 
                      : selectedAgent.priority === 'high' 
                      ? 'text-amber-600' 
                      : 'text-neutral-600'
                  }`}>
                    {selectedAgent.priority}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                <span className="font-bold text-neutral-700 uppercase">Target Goal Context:</span>
                <p className="text-neutral-600 leading-normal">{selectedAgent.goal}</p>
              </div>

            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors"
              >
                Close Inspect
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
