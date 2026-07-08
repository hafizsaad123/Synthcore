import React, { useState } from 'react';
import { Agent } from '../../types';
import { Plus, X, Terminal, Cpu, Play, Pause, Edit3, Settings, ShieldAlert } from 'lucide-react';
import ToolLogo from '../../components/ToolLogo';

interface AgentsProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  showToast: (content: string, error?: boolean) => void;
  activeGoalText: string;
}

export default function Agents({ agents, setAgents, showToast, activeGoalText }: AgentsProps) {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState<'critical' | 'high' | 'normal' | 'low'>('normal');

  // Create Agent modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [tool, setTool] = useState('Claude');
  const [newInstructions, setNewInstructions] = useState('');

  const handleEditClick = (agent: Agent) => {
    setEditingAgent(agent);
    setInstructions(agent.instructions);
    setPriority(agent.priority);
  };

  const handleSaveInstructions = () => {
    if (!editingAgent) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === editingAgent.id ? { ...a, instructions, priority } : a
      )
    );
    setEditingAgent(null);
    showToast(`Instructions updated for ${editingAgent.name}.`);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const isRunning = currentStatus === 'Running';
          return {
            ...a,
            status: isRunning ? 'Paused' : 'Running',
            opsPerMin: isRunning ? 0 : Math.floor(Math.random() * 80) + 30,
            health: isRunning ? a.health : 100
          };
        }
        return a;
      })
    );
    showToast(`Helper status updated.`);
  };

  const handleCreateAgent = () => {
    if (!name.trim() || !newInstructions.trim()) {
      showToast('Please provide a name and instructions.', true);
      return;
    }

    const newAgent: Agent = {
      id: `a${agents.length + 1}`,
      name,
      tool,
      status: 'Running',
      opsPerMin: Math.floor(Math.random() * 90) + 10,
      health: 100,
      goal: activeGoalText || 'Make customer support faster',
      instructions: newInstructions,
      priority: 'normal'
    };

    setAgents((prev) => [newAgent, ...prev]);
    setCreateOpen(false);
    
    // Clear inputs
    setName('');
    setNewInstructions('');
    
    showToast(`Helper "${name}" is now active and working!`);
  };

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">My AI Helpers</h1>
          <p className="text-xs text-brand-stone font-semibold">
            View, change instructions, and update your AI helpers at any time.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Deploy AI Helper
          </button>
        </div>
      </div>

      {/* AGENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors duration-150">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-brand-chocolate tracking-tight">{agent.name}</h3>
                  <div className="flex flex-wrap gap-1.5 font-semibold">
                    <span className="bg-brand-cream text-brand-chocolate text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-sand/60 flex items-center gap-1">
                      <ToolLogo id={agent.tool} className="w-2.5 h-2.5 text-brand-chocolate" />
                      {agent.tool.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      agent.priority === 'critical'
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : agent.priority === 'high'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {agent.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  agent.status === 'Running'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : agent.status === 'Warning'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : agent.status === 'Failed'
                    ? 'bg-red-50 text-red-700 border-red-100'
                    : 'bg-brand-beige text-brand-stone border-brand-sand/50'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>

              {/* Progress bar tracking health */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-brand-stone font-bold">
                  <span>HELPER HEALTH INDEX</span>
                  <span className="font-bold text-brand-chocolate">{agent.health}%</span>
                </div>
                <div className="w-full h-1.5 bg-brand-cream border border-brand-sand/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      agent.health > 80 ? 'bg-emerald-500' : agent.health > 50 ? 'bg-brand-orange' : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.health}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-cream pt-3 text-[11px] font-semibold text-brand-stone">
                <div>
                  <span className="text-brand-stone block uppercase text-[9px] font-bold">Speed</span>
                  <span className="font-bold text-brand-chocolate mt-0.5 block">{agent.opsPerMin} tasks/min</span>
                </div>
                <div>
                  <span className="text-brand-stone block uppercase text-[9px] font-bold">Main Goal</span>
                  <span className="font-bold text-brand-chocolate mt-0.5 block truncate" title={agent.goal}>
                    {agent.goal}
                  </span>
                </div>
              </div>

              {/* System prompt preview */}
              <div className="bg-brand-cream border border-brand-sand/60 p-3.5 rounded-xl">
                <span className="font-bold text-brand-chocolate block uppercase text-[9px] mb-1.5">Helper Instructions:</span>
                <p className="text-brand-stone leading-relaxed font-semibold text-xs line-clamp-3 min-h-[48px]">
                  {agent.instructions}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-brand-cream">
              <button
                onClick={() => handleToggleStatus(agent.id, agent.status)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                  agent.status === 'Paused'
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-white hover:bg-brand-cream text-brand-stone border-brand-sand'
                }`}
              >
                {agent.status === 'Paused' ? 'Resume Execution' : 'Pause Helper'}
              </button>
              
              <button
                onClick={() => handleEditClick(agent)}
                className="px-3.5 py-1.5 bg-brand-chocolate hover:bg-brand-chocolate/90 text-white text-[11px] font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Re-Compile
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* EDIT SYSTEM INSTRUCTIONS MODAL */}
      {editingAgent && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-display font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Instructions: {editingAgent.name}</span>
              </div>
              <button 
                onClick={() => setEditingAgent(null)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs font-semibold">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Instructions (Simple English Rules)</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold resize-none text-xs"
                />
                <span className="text-[10px] text-brand-stone font-semibold">Instructions are compiled and active immediately.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">How fast to run</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer text-xs"
                >
                  <option value="critical">Critical — Run as fast as possible</option>
                  <option value="high">High — Run quickly when ready</option>
                  <option value="normal">Normal — Standard speed</option>
                  <option value="low">Low — Run only when queue is empty</option>
                </select>
              </div>

            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingAgent(null)}
                className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand rounded-full text-xs font-bold text-brand-stone transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Save Instructions
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW AGENT MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-display font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Deploy AI Helper</span>
              </div>
              <button 
                onClick={() => setCreateOpen(false)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs font-semibold">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Helper Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FinanceParser-01"
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Primary AI Engine</label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer text-xs"
                >
                  <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="OpenAI">OpenAI GPT-4o</option>
                  <option value="Gemini">Google Gemini 1.5 Pro</option>
                  <option value="Zapier">Zapier Automation Engine</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Instructions (Simple English Rules)</label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  rows={4}
                  placeholder="Provide simple operational guidelines..."
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold resize-none text-xs"
                />
              </div>

            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand rounded-full text-xs font-bold text-brand-stone transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Deploy AI Helper
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
