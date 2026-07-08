import React, { useState, useMemo } from 'react';
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
      { key: 'healthy', label: 'Healthy', value: running, color: 'success' },
      { key: 'warning', label: 'Needs Attention', value: warning, color: 'warning' },
      { key: 'critical', label: 'Stopped', value: critical, color: 'critical' },
      { key: 'paused', label: 'Paused', value: paused, color: 'border' },
    ];
  }, [agents]);

  const hasUnresolvedAlerts = useMemo(() => {
    return alerts.some((a) => !a.resolved);
  }, [alerts]);

  const handleDeployAgentSubmit = () => {
    if (!newAgentName.trim() || !newAgentInstructions.trim()) {
      showToast('Please fill in all helper fields.', true);
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
        goal: activeGoalText || 'Make customer support faster',
        instructions: newAgentInstructions,
        priority: newAgentPriority
      };

      const newDecision: Decision = {
        id: `d${decisions.length + 1}`,
        type: 'Deployed',
        description: `New AI helper ${newAgentName} was created and started running successfully.`,
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
      
      showToast(`AI helper "${newAgentName}" is now active and working!`);
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
            description: `Helper ${a.name} was manually ${isRunning ? 'paused' : 'resumed'} by the administrator.`,
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
    showToast(`Helper status updated.`);
  };

  const openAgentDetail = (agent: Agent) => {
    setSelectedAgent(agent);
    setDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">
            {companyName || 'My Team'} Dashboard
          </h1>
          <p className="text-xs text-brand-stone font-semibold">
            Welcome back, {username || 'Friend'} · Your active helpers are running normally.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/dashboard/logs')}
            className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand text-xs font-bold rounded-full text-brand-stone transition-colors cursor-pointer"
          >
            Activity Logs
          </button>
          <button
            onClick={() => setDeployModalOpen(true)}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Deploy AI Helper
          </button>
        </div>
      </div>

      {/* ── ROW 1: STATUS BANNER ── */}
      {showBanner && hasUnresolvedAlerts && (
        <div className="bg-amber-50 border border-brand-orange/30 rounded-2xl p-5 text-xs text-brand-chocolate flex gap-4 relative shadow-sm">
          <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-col gap-1.5 font-semibold">
            <span className="font-display font-extrabold text-sm text-brand-chocolate">Notice: Some helpers need attention</span>
            <p className="leading-relaxed text-brand-stone">
              We noticed some minor delays with your AI helper network. <strong>ReportGen-02</strong> experienced issues, so we safely moved its tasks to backup OpenAI nodes.
            </p>
            <div>
              <button 
                onClick={() => onNavigate('/dashboard/alerts')}
                className="text-brand-orange font-bold hover:underline cursor-pointer"
              >
                Go to Alerts Desk →
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── ROW 2: KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active AI Helpers',
            value: agents.filter((a) => a.status === 'Running' || a.status === 'Warning').length,
            badgeText: '↑ 2 new',
            badgeTone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            sub: 'ready for tasks'
          },
          {
            label: 'Daily Tasks Done',
            value: '48,291',
            badgeText: '↑ 12.4%',
            badgeTone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            sub: 'vs last week'
          },
          {
            label: 'Helper Uptime',
            value: '99.98%',
            badgeText: 'Healthy',
            badgeTone: 'bg-brand-beige text-brand-stone border-brand-sand/50',
            sub: 'running smoothly'
          },
          {
            label: 'Goal Progress',
            value: '73%',
            progressValue: 73,
            sub: '12 days left'
          }
        ].map((card, i) => (
          <div key={i} className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">{card.label}</span>
              <span className="text-2xl font-extrabold text-brand-chocolate tracking-tight font-mono">{card.value}</span>
            </div>
            
            <div className="mt-4 flex items-center gap-2 font-semibold">
              {card.badgeText && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeTone}`}>
                  {card.badgeText}
                </span>
              )}
              {card.progressValue !== undefined && (
                <div className="w-full flex flex-col gap-1.5">
                  <div className="w-full h-1.5 bg-brand-cream border border-brand-sand/40 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-orange transition-all" style={{ width: `${card.progressValue}%` }}></div>
                  </div>
                </div>
              )}
              <span className="text-[10px] text-brand-stone font-semibold">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 3: CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Operations Chart */}
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-brand-cream pb-4 mb-4">
            <span className="text-xs font-bold text-brand-chocolate uppercase tracking-wider">Helper Activities</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-brand-sand bg-white rounded-full px-3 py-1 font-bold focus:outline-none focus:border-brand-orange text-brand-stone cursor-pointer"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          <CustomLineChart data={operationsData} />
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm">
          <div className="border-b border-brand-cream pb-4 mb-4">
            <span className="text-xs font-bold text-brand-chocolate uppercase tracking-wider">Helper Status Breakdown</span>
          </div>
          <CustomDonutChart data={healthDistribution} />
        </div>

      </div>

      {/* ── ROW 4: LIVE AGENT TABLE ── */}
      <div className="bg-white border border-brand-sand rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-brand-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-display font-extrabold text-brand-chocolate uppercase tracking-wider">My Active AI Helpers</h3>
            <span className="text-[11px] text-brand-stone font-semibold">All active AI assistants working inside your private workspace</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-stone absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AI helpers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-brand-sand rounded-full bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-orange font-bold text-[10px] cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream text-brand-stone font-bold border-b border-brand-sand uppercase text-[10px]">
                <th className="p-4 pl-6">HELPER NAME</th>
                <th className="p-4">AI ENGINE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">TASKS/MIN</th>
                <th className="p-4">HEALTH INDEX</th>
                <th className="p-4">ASSIGNED GOAL</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream text-brand-stone font-semibold">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-brand-stone font-semibold">
                    No active helpers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-brand-chocolate">{agent.name}</td>
                    <td className="p-4">
                      <span className="bg-brand-cream text-brand-chocolate text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-sand/60 flex items-center gap-1.5 w-fit">
                        <ToolLogo id={agent.tool} className="w-3.5 h-3.5" />
                        {agent.tool}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        agent.status === 'Running'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : agent.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : agent.status === 'Failed'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-brand-beige text-brand-stone border-brand-sand/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === 'Running'
                            ? 'bg-emerald-500'
                            : agent.status === 'Warning'
                            ? 'bg-amber-500'
                            : agent.status === 'Failed'
                            ? 'bg-red-500'
                            : 'bg-brand-stone'
                        }`} />
                        {agent.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-brand-chocolate font-bold">{agent.opsPerMin}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 w-28">
                        <span className="text-[10px] font-bold text-brand-chocolate">{agent.health}%</span>
                        <div className="w-full h-1 bg-brand-cream border border-brand-sand/40 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              agent.health > 80 ? 'bg-emerald-500' : agent.health > 50 ? 'bg-brand-orange' : 'bg-red-500'
                            }`}
                            style={{ width: `${agent.health}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-brand-stone font-medium" title={agent.goal}>
                        {agent.goal}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openAgentDetail(agent)}
                          className="px-3 py-1 bg-white hover:bg-brand-cream border border-brand-sand text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-stone" /> View
                        </button>
                        <button
                          onClick={() => handleToggleAgentStatus(agent.id, agent.status)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                            agent.status === 'Paused'
                              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                              : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
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
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="border-b border-brand-cream pb-3">
              <h3 className="text-sm font-display font-extrabold text-brand-chocolate uppercase tracking-wider">AI Activity Log</h3>
            </div>
            
            <div className="flex flex-col gap-4 divide-y divide-brand-cream">
              {decisions.slice(0, 4).map((decision, i) => (
                <div key={decision.id} className={`flex gap-4 items-start ${i > 0 ? 'pt-4' : ''}`}>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    decision.type === 'Rerouted' || decision.type === 'Alert'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : decision.type === 'Completed' || decision.type === 'Deployed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-brand-cream text-brand-stone border-brand-sand/50'
                  }`}>
                    {decision.type}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1 text-[11px] font-semibold text-brand-stone">
                    <p className="text-brand-chocolate leading-normal">{decision.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-brand-stone">
                      <span className="font-bold text-brand-orange">{decision.agent}</span>
                      <span>·</span>
                      <span>{decision.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-brand-cream pt-4 mt-4">
            <button
              onClick={() => onNavigate('/dashboard/logs')}
              className="text-xs font-bold text-brand-orange hover:underline uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              View all activity logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side panel column */}
        <div className="flex flex-col gap-4">
          
          {/* Active Goal Widget */}
          <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-bold text-brand-chocolate uppercase tracking-wider">My Target Goal</span>
            <div className="flex flex-col gap-1.5 font-semibold">
              <p className="text-xs font-bold text-brand-chocolate leading-relaxed">
                "{activeGoalText || 'Reduce support delays for our customers.'}"
              </p>
              <div className="w-full h-1.5 bg-brand-cream border border-brand-sand/30 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-brand-orange transition-all" style={{ width: '73%' }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-brand-stone mt-0.5 font-bold">
                <span>73% ACHIEVED</span>
                <span>12 DAYS LEFT</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/goals')}
              className="w-full py-2 bg-brand-cream hover:bg-brand-sand/30 text-brand-chocolate border border-brand-sand text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Adjust Goal Rules
            </button>
          </div>

          {/* Core telemetries panel */}
          <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-brand-chocolate uppercase tracking-wider">Activity Speed & Stats</span>
            <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-brand-stone">
              {[
                { label: 'Helper Routing Delay', value: '143ms', bad: false },
                { label: 'Active Tasks Queue', value: '12 active', bad: false },
                { label: 'Self-healing Retries', value: '0 failures', bad: false },
                { label: 'Model Sync Token Rate', value: '8,400 t/s', bad: false },
                { label: 'Operating System Load', value: '67%', bad: true },
              ].map(({ label, value, bad }) => (
                <div key={label} className="flex items-center justify-between border-b border-brand-cream pb-1.5 last:border-0 last:pb-0">
                  <span className="text-brand-stone">{label}</span>
                  <span className={`font-bold ${bad ? 'text-brand-orange' : 'text-brand-chocolate'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* DEPLOY NEW AGENT OVERLAY MODAL */}
      {deployModalOpen && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-display font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Deploy an AI Helper</span>
              </div>
              <button 
                onClick={() => setDeployModalOpen(false)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Helper Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. SalesScraper-04, TicketRouter-01"
                  className="w-full px-4 py-2.5 text-xs border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Primary AI Engine</label>
                <select
                  value={newAgentTool}
                  onChange={(e) => setNewAgentTool(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer"
                >
                  <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="OpenAI">OpenAI GPT-4o</option>
                  <option value="Gemini">Google Gemini 1.5 Pro</option>
                  <option value="Arxodyne">Arxodyne Integration Engine</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Helper Instructions (Simple English Rules)</label>
                <textarea
                  value={newAgentInstructions}
                  onChange={(e) => setNewAgentInstructions(e.target.value)}
                  rows={4}
                  placeholder="Provide simple rules or tasks. e.g. 'Read newly registered leads, check their website tech stack, and send a warning if it is not working properly.'"
                  className="w-full px-4 py-2.5 text-xs border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold resize-none"
                />
                <span className="text-[10px] text-brand-stone font-semibold">Arxodyne automatically converts these rules into active AI tasks.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">How fast to run</label>
                <select
                  value={newAgentPriority}
                  onChange={(e) => setNewAgentPriority(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer"
                >
                  <option value="critical">Critical — Run as fast as possible</option>
                  <option value="high">High — Run quickly when ready</option>
                  <option value="normal">Normal — Standard speed</option>
                  <option value="low">Low — Run only when queue is empty</option>
                </select>
              </div>

            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeployModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand rounded-full text-xs font-bold text-brand-stone transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeployAgentSubmit}
                disabled={deploying}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-sand text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                {deploying ? 'Preparing Helper...' : 'Deploy AI Helper'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW AGENT INSPECT OVERLAY MODAL */}
      {detailModalOpen && selectedAgent && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-display font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Inspect Helper: {selectedAgent.name}</span>
              </div>
              <button 
                onClick={() => setDetailModalOpen(false)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 text-xs font-semibold">
              
              <div className="flex items-center gap-4 border-b border-brand-cream pb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-stone font-bold uppercase">STATUS</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    selectedAgent.status === 'Running'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : selectedAgent.status === 'Warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : selectedAgent.status === 'Failed'
                      ? 'bg-red-50 text-red-700 border-red-100'
                      : 'bg-brand-beige text-brand-stone border-brand-sand/50'
                  }`}>
                    {selectedAgent.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-brand-sand"></div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-stone font-bold uppercase">AI ENGINE</span>
                  <span className="bg-brand-cream text-brand-chocolate text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-sand/60 flex items-center gap-1.5 w-fit">
                    <ToolLogo id={selectedAgent.tool} className="w-3.5 h-3.5 text-black" />
                    {selectedAgent.tool}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-brand-chocolate uppercase text-[10px]">Helper Instructions:</span>
                <div className="p-4 bg-brand-cream border border-brand-sand rounded-xl text-brand-stone font-semibold leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line">
                  {selectedAgent.instructions}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-brand-cream py-3.5 text-[11px]">
                <div className="flex flex-col gap-1">
                  <span className="text-brand-stone font-bold uppercase text-[9px]">Speed</span>
                  <span className="font-bold text-brand-chocolate">{selectedAgent.opsPerMin} tasks/min</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-brand-stone font-bold uppercase text-[9px]">Health</span>
                  <span className={`font-bold ${selectedAgent.health > 80 ? 'text-emerald-600' : 'text-brand-orange'}`}>
                    {selectedAgent.health}%
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-brand-stone font-bold uppercase text-[9px]">Run Speed</span>
                  <span className={`font-bold uppercase ${
                    selectedAgent.priority === 'critical' 
                      ? 'text-red-600' 
                      : selectedAgent.priority === 'high' 
                      ? 'text-brand-orange' 
                      : 'text-brand-stone'
                  }`}>
                    {selectedAgent.priority}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-brand-chocolate uppercase text-[10px]">Target Goal Context:</span>
                <p className="text-brand-stone font-semibold leading-normal">{selectedAgent.goal}</p>
              </div>

            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 bg-brand-chocolate hover:bg-brand-chocolate/90 text-white font-bold rounded-full text-xs transition-colors cursor-pointer"
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
