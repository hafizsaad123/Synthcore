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
    showToast(`Instructions compiled for ${editingAgent.name}.`);
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
    showToast(`Agent status updated.`);
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
      goal: activeGoalText || 'Reduce customer support response times',
      instructions: newInstructions,
      priority: 'normal'
    };

    setAgents((prev) => [newAgent, ...prev]);
    setCreateOpen(false);
    
    // Clear inputs
    setName('');
    setNewInstructions('');
    
    showToast(`Agent "${name}" successfully deployed!`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Autonomous Agent Fleet</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Inspect, adjust instructions, and re-compile individual worker nodes in real time.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Agent Node
          </button>
        </div>
      </div>

      {/* AGENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-colors duration-150">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-black tracking-tight">{agent.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-neutral-100 text-neutral-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                      <ToolLogo id={agent.tool} className="w-2.5 h-2.5 text-black" />
                      {agent.tool.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      agent.priority === 'critical'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : agent.priority === 'high'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {agent.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  agent.status === 'Running'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : agent.status === 'Warning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : agent.status === 'Failed'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>

              {/* Progress bar tracking health */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                  <span>NODE HEALTH INDEX</span>
                  <span className="font-bold text-neutral-700">{agent.health}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      agent.health > 80 ? 'bg-emerald-500' : agent.health > 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.health}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#F5F5F5] pt-3 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-400 block uppercase">Current Load</span>
                  <span className="font-bold text-black mt-0.5 block">{agent.opsPerMin} ops/min</span>
                </div>
                <div>
                  <span className="text-neutral-400 block uppercase">Objective</span>
                  <span className="font-semibold text-neutral-600 mt-0.5 block truncate" title={agent.goal}>
                    {agent.goal}
                  </span>
                </div>
              </div>

              {/* System prompt preview */}
              <div className="bg-neutral-50 border border-[#EAEAEA] p-3 rounded font-mono text-[11px]">
                <span className="font-bold text-neutral-700 block uppercase mb-1.5">Instruction directives:</span>
                <p className="text-neutral-500 leading-normal line-clamp-3 min-h-[48px]">
                  {agent.instructions}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[#F5F5F5]">
              <button
                onClick={() => handleToggleStatus(agent.id, agent.status)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all border cursor-pointer ${
                  agent.status === 'Paused'
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border-[#EAEAEA]'
                }`}
              >
                {agent.status === 'Paused' ? 'Resume Execution' : 'Pause Node'}
              </button>
              
              <button
                onClick={() => handleEditClick(agent)}
                className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Re-Compile
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* EDIT SYSTEM INSTRUCTIONS MODAL */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Compile Prompt Instructions: {editingAgent.name}</span>
              </div>
              <button 
                onClick={() => setEditingAgent(null)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 font-sans text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">System Prompt and Directives (plain English)</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans resize-none text-xs"
                />
                <span className="text-[10px] text-neutral-400 font-mono">Directives are compiled dynamically and hot-swapped into the running execution thread.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Execution Priority Pool</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white text-xs"
                >
                  <option value="critical">Critical — Absolute highest thread preference</option>
                  <option value="high">High — Immediate processing window</option>
                  <option value="normal">Normal — Round-robin queue allocation</option>
                  <option value="low">Low — Idle queue processing only</option>
                </select>
              </div>

            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingAgent(null)}
                className="px-4 py-2 bg-white hover:bg-neutral-100 border border-[#EAEAEA] rounded text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Save & Re-Compile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW AGENT MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Deploy New Agent Worker Node</span>
              </div>
              <button 
                onClick={() => setCreateOpen(false)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 font-sans text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Agent Node Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FinanceParser-01"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Primary Intelligence Node</label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white text-xs"
                >
                  <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="OpenAI">OpenAI GPT-4o</option>
                  <option value="Gemini">Google Gemini 1.5 Pro</option>
                  <option value="Zapier">Zapier Webhook Runner</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Instruction Directive Set</label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  rows={4}
                  placeholder="Provide clean operational guidelines..."
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans resize-none text-xs"
                />
              </div>

            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 bg-white hover:bg-neutral-100 border border-[#EAEAEA] rounded text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Deploy Node
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
