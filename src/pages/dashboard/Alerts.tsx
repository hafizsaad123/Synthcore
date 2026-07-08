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
      description: `Resolved system alert: "${alertTitle}". Restoration completed successfully.`,
      agent: 'Arxodyne Self-Healing Engine',
      time: 'Just now'
    };

    setDecisions((prev) => [newDecision, ...prev]);
    showToast(`Alert fixed and helper restarted successfully.`);
  };

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 border-b border-brand-sand pb-5">
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">Alerts & Notices</h1>
        <p className="text-xs text-brand-stone font-semibold">
          Review active alerts, issues, or warnings that need your attention.
        </p>
      </div>

      {/* UNRESOLVED ALERTS LIST */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-brand-stone uppercase tracking-wider font-sans">
          Active Issues & Alerts ({unresolvedAlerts.length})
        </h2>

        <div className="flex flex-col gap-4">
          {unresolvedAlerts.length === 0 ? (
            <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm text-center flex flex-col items-center justify-center gap-4">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> All Systems Clear
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-display font-extrabold text-brand-chocolate uppercase tracking-wider">No Active Alerts</h3>
                <p className="text-xs text-brand-stone font-semibold">
                  All of your AI helpers are running perfectly without any issues.
                </p>
              </div>
            </div>
          ) : (
            unresolvedAlerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:border-brand-orange transition-colors duration-150">
                
                <div className="flex items-start justify-between gap-4 font-semibold">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : alert.severity === 'warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-brand-cream text-brand-chocolate border-brand-sand/50'
                    }`}>
                      {alert.severity}
                    </span>
                    <h3 className="text-sm font-bold text-brand-chocolate tracking-tight">{alert.title}</h3>
                  </div>
                  <span className="text-[10px] text-brand-stone font-bold uppercase">{alert.time}</span>
                </div>

                <p className="text-xs text-brand-stone leading-relaxed font-semibold">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-brand-cream font-semibold">
                  <span className="text-[11px] text-brand-stone">
                    {alert.agentId ? (
                      <>
                        Source helper: <strong className="text-brand-chocolate font-extrabold">
                          {agents.find((a) => a.id === alert.agentId)?.name || 'Unknown Helper'}
                        </strong>
                      </>
                    ) : (
                      <>Source: Arxodyne Core system</>
                    )}
                  </span>

                  <button
                    onClick={() => handleResolveAlert(alert.id, alert.agentId)}
                    className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer shadow-sm"
                  >
                    Fix Issue & Restart Helper
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* RESOLVED ALERTS ARCHIVE */}
      {resolvedAlerts.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-brand-sand pt-6">
          <h2 className="text-xs font-bold text-brand-stone uppercase tracking-wider font-sans flex items-center gap-1.5">
            <History className="w-4 h-4 text-brand-stone" /> Recently Fixed Alerts
          </h2>
          
          <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 divide-y divide-brand-cream">
            {resolvedAlerts.map((alert, idx) => (
              <div key={alert.id} className={`flex items-center justify-between gap-4 font-semibold ${idx > 0 ? 'pt-3.5' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold uppercase flex items-center gap-1">
                    ✓ FIXED
                  </span>
                  <span className="text-xs font-bold text-brand-chocolate">{alert.title}</span>
                </div>
                
                <span className="text-[10px] text-brand-stone font-bold">Resolved successfully</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
