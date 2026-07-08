import React, { useState } from 'react';
import { SystemGoal } from '../../types';
import { Plus, X, Target, Calendar, CheckSquare, Settings2, ShieldCheck } from 'lucide-react';

interface GoalsProps {
  goals: SystemGoal[];
  setGoals: React.Dispatch<React.SetStateAction<SystemGoal[]>>;
  showToast: (content: string, error?: boolean) => void;
  setActiveGoalText: (val: string) => void;
}

export default function Goals({ goals, setGoals, showToast, setActiveGoalText }: GoalsProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('30 days remaining');

  // Adjust Progress Modal
  const [adjustingGoal, setAdjustingGoal] = useState<SystemGoal | null>(null);
  const [tempProgress, setTempProgress] = useState(0);

  const handleCreateGoal = () => {
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in the title and description.', true);
      return;
    }

    const newGoal: SystemGoal = {
      id: `g${goals.length + 1}`,
      title,
      description,
      progress: 0,
      timeRemaining,
      status: 'active',
    };

    setGoals((prev) => [newGoal, ...prev]);
    setActiveGoalText(title); // Sync with Dashboard
    setCreateOpen(false);
    
    // Clear Form
    setTitle('');
    setDescription('');
    setTimeRemaining('30 days remaining');

    showToast(`Objective "${title}" successfully launched and registered.`);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
          if (nextStatus === 'active') {
            setActiveGoalText(g.title);
          }
          return { ...g, status: nextStatus as any };
        }
        return g;
      })
    );
    showToast('Objective status updated.');
  };

  const handleSaveProgress = () => {
    if (!adjustingGoal) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === adjustingGoal.id
          ? {
              ...g,
              progress: tempProgress,
              status: tempProgress === 100 ? 'completed' : g.status,
            }
          : g
      )
    );
    showToast(`Progress for "${adjustingGoal.title}" updated.`);
    setAdjustingGoal(null);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Strategic Objectives Desktop</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Define company target directives. Arxodyne translates these objectives into real-time LLM agent instructions.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Strategic Goal
          </button>
        </div>
      </div>

      {/* ACTIVE COMPANY DIRECTIVES */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono">Active Company Directives</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals
            .filter((g) => g.status === 'active' || g.status === 'paused')
            .map((goal) => (
              <div key={goal.id} className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-colors duration-150">
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-black tracking-tight">{goal.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      goal.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {goal.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 leading-normal">
                    {goal.description}
                  </p>

                  <div className="flex flex-col gap-1.5 border-t border-b border-neutral-100 py-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center text-neutral-400">
                      <span>STRATEGIC PROGRESS INDEX</span>
                      <span className="font-bold text-neutral-800">{goal.progress}% Achieved</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-black transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-5 pt-1">
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {goal.timeRemaining}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-600 border border-[#EAEAEA] rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {goal.status === 'paused' ? 'Activate' : 'Pause'}
                    </button>
                    <button
                      onClick={() => {
                        setAdjustingGoal(goal);
                        setTempProgress(goal.progress);
                      }}
                      className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3" /> Tweak Progress
                    </button>
                  </div>
                </div>

              </div>
            ))}
        </div>
      </div>

      {/* ARCHIVED & COMPLETED DIRECTIVES */}
      <div className="flex flex-col gap-4 border-t border-[#EAEAEA] pt-6">
        <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono">Archived & Completed Objectives</h2>
        
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-3.5 divide-y divide-neutral-100">
          {goals.filter(g => g.status === 'completed').length === 0 ? (
            <p className="text-xs text-neutral-400 font-mono text-center py-4">No archived objectives found.</p>
          ) : (
            goals.filter(g => g.status === 'completed').map((goal, idx) => (
              <div key={goal.id} className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-3.5' : ''}`}>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-black">{goal.title}</span>
                  <span className="text-[11px] text-neutral-400 leading-normal">{goal.description}</span>
                </div>
                
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono font-bold uppercase shrink-0 flex items-center gap-1">
                  ✓ COMPLETED
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ESTABLISH NEW GOAL OVERLAY MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Establish Strategic Objective</span>
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
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Goal Directive Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scrape & Score 500 leads in July"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Directive Details & APIs</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. 'Track newly registered domain names daily, cross-reference high score targets...'"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans resize-none text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Strategic Due Window</label>
                <input
                  type="text"
                  value={timeRemaining}
                  onChange={(e) => setTimeRemaining(e.target.value)}
                  placeholder="e.g. 14 days remaining, Due Aug 1st"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs"
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
                onClick={handleCreateGoal}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Deploy Objective
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TWEAK PROGRESS OVERLAY MODAL */}
      {adjustingGoal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-sm w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <span className="font-bold text-xs tracking-tight text-black uppercase font-mono">Tweak Progress Index</span>
              <button 
                onClick={() => setAdjustingGoal(null)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 font-sans text-xs">
              <p className="font-bold text-neutral-800 truncate mb-1">"{adjustingGoal.title}"</p>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Set Progress Percentage (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={String(tempProgress)}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    setTempProgress(val);
                  }}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-mono text-xs"
                />
              </div>
            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setAdjustingGoal(null)}
                className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 border border-[#EAEAEA] rounded text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Progress
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
