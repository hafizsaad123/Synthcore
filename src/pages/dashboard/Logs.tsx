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
    showToast('Decision log buffer cleared.');
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
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Autonomous Decision Logs</h1>
          <p className="text-xs text-neutral-500 font-medium">
            A cryptographic-grade, historical stream of every scheduling, execution, routing, and self-healing decision made by Arxodyne.
          </p>
        </div>
        
        <div>
          <button
            onClick={handleClearLogs}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear Decision Logs
          </button>
        </div>
      </div>

      {/* FILTER AND SEARCH ROW */}
      <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Sliders className="w-4.5 h-4.5 text-neutral-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#EAEAEA] bg-white rounded focus:outline-none focus:border-black font-sans text-neutral-700 w-full sm:w-48"
            >
              <option value="ALL">All Decisions</option>
              <option value="REROUTED">Rerouted Fallbacks</option>
              <option value="COMPLETED">Completed Actions</option>
              <option value="ALERT">System Alerts</option>
              <option value="DEPLOYED">Agent Deployments</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs, agent nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-black font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black font-mono text-[10px] cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* LOG ITEMS BUFFER */}
        <div className="border-t border-[#F5F5F5] pt-4 mt-1 flex flex-col gap-4 divide-y divide-[#F9F9F9]">
          {filteredDecisions.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 font-mono text-xs flex flex-col items-center gap-2">
              <Terminal className="w-6 h-6 text-neutral-300" />
              <span>No decision records match your current filters.</span>
            </div>
          ) : (
            filteredDecisions.map((decision, i) => (
              <div key={decision.id} className={`flex flex-col sm:flex-row sm:items-start gap-4 ${i > 0 ? 'pt-4' : ''}`}>
                
                {/* Badge Column */}
                <div className="sm:w-28 shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                    decision.type === 'Rerouted' || decision.type === 'Alert'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : decision.type === 'Completed' || decision.type === 'Deployed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                  }`}>
                    {decision.type}
                  </span>
                </div>

                {/* Info Column */}
                <div className="flex-1 flex flex-col gap-1.5 font-mono text-[11px]">
                  <p className="text-neutral-800 leading-normal">{decision.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-neutral-400">
                    <span>
                      NODE: <strong className="text-neutral-600 font-bold">{decision.agent.toUpperCase()}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {decision.time}
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
