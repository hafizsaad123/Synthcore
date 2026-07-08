import React, { useState, useMemo } from 'react';
import { Decision } from '../../types';
import { Search, Trash2, Sliders, Calendar, Terminal } from 'lucide-react';

interface LogsProps {
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  showToast: (content: string, error?: boolean) => void;
}

export default function Logs({ decisions, setDecisions, showToast }: LogsProps) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClearLogs = () => {
    setDecisions([]);
    showToast('Activity logs cleared.');
  };

  // Filtering logs
  const filteredDecisions = useMemo(() => {
    let result = decisions;

    if (filterType !== 'ALL') {
      result = result.filter((d) => d.type.toUpperCase() === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.description.toLowerCase().includes(query) ||
          d.agent.toLowerCase().includes(query) ||
          d.type.toLowerCase().includes(query)
      );
    }

    return result;
  }, [decisions, filterType, searchQuery]);

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">Helper Activity Log</h1>
          <p className="text-xs text-brand-stone font-semibold">
            Review everything your AI helpers have done, including completed tasks, new updates, and fixed alerts.
          </p>
        </div>
        
        <div>
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All Logs
          </button>
        </div>
      </div>

      {/* FILTER AND SEARCH ROW */}
      <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold text-xs">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Sliders className="w-4.5 h-4.5 text-brand-stone" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 text-xs border border-brand-sand bg-white rounded-xl focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer w-full sm:w-48"
            >
              <option value="ALL">All Activities</option>
              <option value="REROUTED">Rerouted Tasks</option>
              <option value="COMPLETED">Finished Tasks</option>
              <option value="ALERT">System Warnings</option>
              <option value="DEPLOYED">Helper Updates</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-stone absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs, helper names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-brand-sand bg-brand-cream rounded-xl focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-chocolate font-bold text-[10px] cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* LOG ITEMS BUFFER */}
        <div className="border-t border-brand-cream pt-4 mt-1 flex flex-col gap-4 divide-y divide-brand-cream/40">
          {filteredDecisions.length === 0 ? (
            <div className="text-center py-12 text-brand-stone font-semibold text-xs flex flex-col items-center gap-2">
              <Terminal className="w-6 h-6 text-brand-stone/60" />
              <span>No activity fits your search.</span>
            </div>
          ) : (
            filteredDecisions.map((decision, i) => (
              <div key={decision.id} className={`flex flex-col sm:flex-row sm:items-start gap-4 font-semibold text-xs ${i > 0 ? 'pt-4' : ''}`}>
                
                {/* Badge Column */}
                <div className="sm:w-28 shrink-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    decision.type === 'Rerouted' || decision.type === 'Alert'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : decision.type === 'Completed' || decision.type === 'Deployed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-brand-cream text-brand-chocolate border-brand-sand/50'
                  }`}>
                    {decision.type}
                  </span>
                </div>

                {/* Info Column */}
                <div className="flex-1 flex flex-col gap-1.5 text-xs text-brand-stone">
                  <p className="text-brand-chocolate leading-relaxed font-bold">{decision.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-brand-stone">
                    <span>
                      HELPER: <strong className="text-brand-chocolate font-extrabold">{decision.agent.toUpperCase()}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-orange" /> {decision.time}
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
