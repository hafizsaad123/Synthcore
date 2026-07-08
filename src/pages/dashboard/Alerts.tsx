import React, { useMemo } from 'react';
import { AlertItem, Agent, Decision } from '../../types';
import { ShieldCheck, AlertTriangle, Play, CheckCircle2, History } from 'lucide-react';

interface AlertsProps {
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  showToast: (content: string, error?: boolean) => void;
}

export default function Alerts({
  alerts,
  setAlerts,
  agents,
  setAgents,
  decisions,
  setDecisions,
  showToast
}: AlertsProps) {
  
  const unresolvedAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);
  const resolvedAlerts = useMemo(() => alerts.filter((a) => a.resolved), [alerts]);

  const handleResolveAlert = (alertId: string, agentId?: string) => {
    // 1. Mark alert as resolved
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );

    // 2. If there's an associated agent, restore its status to Running and health to 100
    if (agentId) {
      setAgents((prevAgents) =>
        prevAgents.map((ag) =>
          ag.id === agentId
            ? { ...ag, status: 'Running', health: 100, opsPerMin: Math.floor(Math.random() * 60) + 40 }
            : ag
        )
      );
    }

    // 3. Log the decision
    const alertTitle = alerts.find((a) => a.id === alertId)?.title || 'Alert';
    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Completed',
      description: `Resolved system anomaly: "${alertTitle}". Associated nodes and traffic queues restored to normal.`,
      agent: 'Arxodyne Self-Healing Engine',
      time: 'Just now'
    };

    setDecisions((prev) => [newDecision, ...prev]);
    showToast(`Anomaly resolved and worker node re-launched.`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 border-b border-[#EAEAEA] pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-black">Alerts Control Desk</h1>
        <p className="text-xs text-neutral-500 font-medium">
          Track active system warnings, hardware constraints, or agent failure points requiring immediate oversight.
        </p>
      </div>

      {/* UNRESOLVED ALERTS LIST */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono">
          Unresolved Warnings & Anomalies ({unresolvedAlerts.length})
        </h2>

        <div className="flex flex-col gap-4">
          {unresolvedAlerts.length === 0 ? (
            <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm text-center flex flex-col items-center justify-center gap-3.5">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> All Systems Clear
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-black font-mono uppercase tracking-wider">No Active Anomalies Detected</h3>
                <p className="text-xs text-neutral-400">
                  Your entire agent network is currently executing within normal nominal thresholds.
                </p>
              </div>
            </div>
          ) : (
            unresolvedAlerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4 hover:border-neutral-400 transition-colors duration-150">
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : alert.severity === 'warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-black tracking-tight">{alert.title}</h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">{alert.time}</span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F5F5F5]">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {alert.agentId ? (
                      <>
                        Source node: <strong className="text-neutral-600 font-bold">
                          {agents.find((a) => a.id === alert.agentId)?.name || 'Unknown Agent'}
                        </strong>
                      </>
                    ) : (
                      <>Source: Arxodyne Core Kernel</>
                    )}
                  </span>

                  <button
                    onClick={() => handleResolveAlert(alert.id, alert.agentId)}
                    className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold rounded transition-colors cursor-pointer"
                  >
                    Resolve Alert & Re-Launch Node
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* RESOLVED ALERTS ARCHIVE */}
      {resolvedAlerts.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-[#EAEAEA] pt-6">
          <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <History className="w-4 h-4 text-neutral-500" /> Resolved Alerts Archive
          </h2>
          
          <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-3.5 divide-y divide-neutral-100">
            {resolvedAlerts.map((alert, idx) => (
              <div key={alert.id} className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-3.5' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                    ✓ RESOLVED
                  </span>
                  <span className="text-xs font-bold text-black">{alert.title}</span>
                </div>
                
                <span className="text-[10px] text-neutral-400 font-mono">Resolved successfully</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
