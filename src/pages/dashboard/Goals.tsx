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

    showToast(`Goal "${title}" was successfully created and started!`);
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
    showToast('Goal status updated.');
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
    <div className="flex flex-col gap-8 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">My Goals</h1>
          <p className="text-xs text-brand-stone font-semibold">
            Set custom goals for your business. Your AI helpers will automatically read these goals to guide their tasks.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Custom Goal
          </button>
        </div>
      </div>

      {/* ACTIVE COMPANY DIRECTIVES */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-brand-stone uppercase tracking-wider font-sans">Active Goals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals
            .filter((g) => g.status === 'active' || g.status === 'paused')
            .map((goal) => (
              <div key={goal.id} className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors duration-150">
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3 font-semibold">
                    <h3 className="text-base font-bold text-brand-chocolate tracking-tight">{goal.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      goal.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {goal.status}
                    </span>
                  </div>

                  <p className="text-xs text-brand-stone leading-relaxed font-semibold">
                    {goal.description}
                  </p>

                  <div className="flex flex-col gap-1.5 border-t border-b border-brand-cream py-3 text-[10px] font-bold">
                    <div className="flex justify-between items-center text-brand-stone">
                      <span>GOAL PROGRESS</span>
                      <span className="text-brand-chocolate">{goal.progress}% Achieved</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-cream border border-brand-sand/40 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-brand-orange transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-5 pt-1 font-semibold text-brand-stone">
                  <span className="text-[10px] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" /> Due: {goal.timeRemaining}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                      className="px-3 py-1 bg-white hover:bg-brand-cream text-brand-stone border border-brand-sand rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {goal.status === 'paused' ? 'Activate' : 'Pause'}
                    </button>
                    <button
                      onClick={() => {
                        setAdjustingGoal(goal);
                        setTempProgress(goal.progress);
                      }}
                      className="px-3 py-1 bg-brand-chocolate hover:bg-brand-chocolate/90 text-white rounded-full text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3 text-brand-orange" /> Update Progress
                    </button>
                  </div>
                </div>

              </div>
            ))}
        </div>
      </div>

      {/* ARCHIVED & COMPLETED DIRECTIVES */}
      <div className="flex flex-col gap-4 border-t border-brand-sand pt-6">
        <h2 className="text-xs font-bold text-brand-stone uppercase tracking-wider font-sans">Recently Finished Goals</h2>
        
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 divide-y divide-brand-cream">
          {goals.filter(g => g.status === 'completed').length === 0 ? (
            <p className="text-xs text-brand-stone font-semibold text-center py-4">No finished goals yet.</p>
          ) : (
            goals.filter(g => g.status === 'completed').map((goal, idx) => (
              <div key={goal.id} className={`flex items-center justify-between gap-4 font-semibold ${idx > 0 ? 'pt-3.5' : ''}`}>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-brand-chocolate">{goal.title}</span>
                  <span className="text-[11px] text-brand-stone leading-normal">{goal.description}</span>
                </div>
                
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold uppercase shrink-0 flex items-center gap-1">
                  ✓ COMPLETED
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ESTABLISH NEW GOAL OVERLAY MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-display font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Add Custom Goal</span>
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
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Goal Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Help 500 customers this month"
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Goal Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. 'Read customer support tickets, answer questions automatically, and follow up quickly.'"
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold resize-none text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Due Date</label>
                <input
                  type="text"
                  value={timeRemaining}
                  onChange={(e) => setTimeRemaining(e.target.value)}
                  placeholder="e.g. 14 days remaining, Due Aug 1st"
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
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
                onClick={handleCreateGoal}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Create Goal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TWEAK PROGRESS OVERLAY MODAL */}
      {adjustingGoal && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <span className="font-display font-extrabold text-xs text-brand-chocolate uppercase tracking-wider">Update Goal Progress</span>
              <button 
                onClick={() => setAdjustingGoal(null)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs font-semibold">
              <p className="font-bold text-brand-chocolate truncate mb-1">"{adjustingGoal.title}"</p>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Set Progress Percentage (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={String(tempProgress)}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    setTempProgress(val);
                  }}
                  className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-bold text-xs font-mono"
                />
              </div>
            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setAdjustingGoal(null)}
                className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand rounded-full text-xs font-bold text-brand-stone transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Update Progress
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
