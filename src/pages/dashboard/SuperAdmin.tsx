import React, { useState, useMemo } from 'react';
import { Agent, Decision, AlertItem, ConnectedTool } from '../../types';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Activity, 
  RefreshCw, 
  FileCode, 
  Flame, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  Database,
  Lock
} from 'lucide-react';

interface SuperAdminProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  connectedTools: ConnectedTool[];
  setConnectedTools: React.Dispatch<React.SetStateAction<ConnectedTool[]>>;
  showToast: (content: string, error?: boolean) => void;
}

export default function SuperAdmin({
  agents,
  setAgents,
  decisions,
  setDecisions,
  alerts,
  setAlerts,
  connectedTools,
  setConnectedTools,
  showToast
}: SuperAdminProps) {
  const userEmail = (localStorage.getItem('synthcore_email') || '').trim().toLowerCase();
  const isEmailAuthorized = userEmail === 'admin@arxodyne.com';

  // Passcode unlock guard
  const isSuperAdmin = isEmailAuthorized && (localStorage.getItem('synthcore_is_super') === 'true' || localStorage.getItem('synthcore_username') === 'Super Admin');
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(isSuperAdmin);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailAuthorized) {
      setErrorMsg('ACCESS DENIED: Account is unauthorized.');
      showToast('Access Denied: Unauthorized account email', true);
      return;
    }

    if (passcode === 'admin123' || passcode === '1337' || passcode === 'arxodyne2026') {
      setIsUnlocked(true);
      localStorage.setItem('synthcore_is_super', 'true');
      showToast('Developer console unlocked!', false);
    } else {
      setErrorMsg('Invalid authorization passcode.');
      showToast('Access Denied: Invalid passcode', true);
    }
  };

  // 1. Simulation Controls State
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState(67);
  const [schedulerDelay, setSchedulerDelay] = useState(143);
  const [simSpeed, setSimSpeed] = useState('Realtime');
  const [rootKey, setRootKey] = useState('SHA256-ARXODYNE-ROOT-8F2C7A9D1E4B5C6');

  // 2. Interactive JSON Code Editor State
  const defaultKernelConfig = `{
  "kernel": "arxodyne-linux-v1.4.2",
  "routing": "failover-redundant",
  "health_check": {
    "interval_ms": 5000,
    "unhealthy_threshold": 3,
    "retry_backoff": "exponential"
  },
  "concurrency_limit": 150,
  "telemetry": {
    "enabled": true,
    "retention_days": 90,
    "endpoint": "https://telemetry.arxodyne.org/v2"
  },
  "security": {
    "aes_strength": 256,
    "audit_locked": true
  }
}`;
  const [configCode, setConfigCode] = useState(defaultKernelConfig);

  // Computed syntax validation check
  const isJsonValid = useMemo(() => {
    try {
      JSON.parse(configCode);
      return true;
    } catch {
      return false;
    }
  }, [configCode]);

  // 3. Automated Self-healing Cycle
  const handleSelfHealCycle = () => {
    // Repair all degraded agents
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'Running',
        health: 100,
        opsPerMin: agent.status === 'Paused' ? 0 : Math.floor(Math.random() * 40) + 60
      }))
    );

    // Resolve all active alerts
    setAlerts((prev) =>
      prev.map((alert) => ({
        ...alert,
        resolved: true
      }))
    );

    // Add logging entries
    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Completed',
      description: 'Developer manual override: System-wide self-healing cycle was triggered. All helper health restored.',
      agent: 'Arxodyne OS Kernel',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Core system reset. All AI helpers successfully stabilized and working.');
  };

  // 4. Telemetry Failure Injection Helpers
  const injectCrashReportGen = () => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name.toLowerCase().includes('reportgen')
          ? { ...agent, status: 'Failed', health: 12, opsPerMin: 0 }
          : agent
      )
    );

    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'ReportGen-02 Helper Crashed',
      description: 'ReportGen helper encountered an unexpected error. System paused the helper to maintain security.',
      severity: 'critical',
      time: 'Just now',
      agentId: 'a4',
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Alert',
      description: 'CRITICAL WARNING: ReportGen-02 helper disconnected. Tasks routed to fallback helpers.',
      agent: 'Failover Manager',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Mock crash injected: ReportGen-02 has crashed.', true);
  };

  const injectApiTimeout = () => {
    setConnectedTools((prev) =>
      prev.map((tool) =>
        tool.name.toLowerCase().includes('slack')
          ? { ...tool, connected: false }
          : tool
      )
    );

    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'Slack Connection Timeout',
      description: 'The connection to Slack timed out after 3 attempts. Slack has been marked as offline.',
      severity: 'warning',
      time: 'Just now',
      agentId: 'a1',
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Rerouted',
      description: 'Slack connection failed. App marked as OFFLINE. Operations delayed.',
      agent: 'Gateway Controller',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Mock failure injected: Slack webhook timed out.', true);
  };

  const injectMemoryExhaustion = () => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name.toLowerCase().includes('datasync')
          ? { ...agent, status: 'Warning', health: 45, opsPerMin: 12 }
          : agent
      )
    );

    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'DataSync-07 Memory Usage Warning',
      description: 'DataSync memory usage exceeded 92%. Slowing down tasks to avoid crashing.',
      severity: 'warning',
      time: 'Just now',
      agentId: 'a3',
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Alert',
      description: 'DataSync-07 memory usage warning. Helper entered slow state to preserve stability.',
      agent: 'Resource Scheduler',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Mock failure injected: Memory warning on DataSync-07.', true);
  };

  const handleSaveConfigCode = () => {
    if (!isJsonValid) {
      showToast('Cannot save. Config JSON has syntax errors.', true);
      return;
    }
    showToast('System configuration compiled and saved successfully!');
  };

  if (!isUnlocked) {
    if (!isEmailAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in duration-200 text-brand-chocolate">
          <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-sm max-w-sm w-full font-semibold">
            <div className="flex flex-col gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase">ACCESS DENIED</span>
                <h2 className="text-lg font-display font-extrabold text-brand-chocolate tracking-tight">Security Area Locked</h2>
                <p className="text-xs text-brand-stone leading-relaxed">
                  Your account email (<code className="bg-brand-cream px-1.5 py-0.5 rounded font-bold text-red-600 text-[11px]">{userEmail || 'guest'}</code>) is not authorized to access this developer tools page.
                </p>
                <p className="text-[10px] text-brand-stone/85 mt-2 leading-relaxed font-sans">
                  Only the main system administrator can open this page. Please log in with an authorized administrator email.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center text-brand-chocolate">
        <div className="bg-white border border-brand-sand rounded-2xl p-8 shadow-sm max-w-sm w-full font-semibold">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Lock className="w-5 h-5 animate-bounce" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase">DEVELOPER OVERRIDES LOCKED</span>
              <h2 className="text-lg font-display font-extrabold text-brand-chocolate tracking-tight">Admin Authorization</h2>
              <p className="text-xs text-brand-stone leading-relaxed">
                This panel has powerful diagnostic tools and system-wide overrides. Please enter the passcode to unlock.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-bold text-brand-stone uppercase">ENTER ADMINISTRATOR PASSCODE</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-brand-sand bg-brand-cream rounded-xl focus:outline-none focus:border-brand-orange font-bold font-mono tracking-widest text-center text-brand-chocolate"
                />
                {errorMsg && (
                  <span className="text-[10px] text-red-600 mt-1 font-bold">{errorMsg}</span>
                )}
                <span className="text-[9px] text-brand-stone mt-2 leading-relaxed text-center block">
                  Hint: Passcodes are <code className="bg-brand-cream px-1.5 py-0.5 rounded text-brand-chocolate font-bold">admin123</code> or <code className="bg-brand-cream px-1.5 py-0.5 rounded text-brand-chocolate font-bold">1337</code>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-chocolate hover:bg-brand-chocolate/90 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Unlock Developer Tools
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate font-semibold">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-brand-chocolate text-white border border-brand-stone rounded-full text-[9px] font-bold tracking-widest uppercase">
              DEVELOPER TOOLS
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">Developer Control Panel</h1>
          </div>
          <p className="text-xs text-brand-stone font-semibold">
            Run direct system overrides, trigger mock alerts to test how helpers automatically recover, and adjust active system settings.
          </p>
        </div>

        <div>
          <button
            onClick={handleSelfHealCycle}
            className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" /> Fix and Reset All Helpers
          </button>
        </div>
      </div>

      {/* THREE COLUMN GRID - OVERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: LIVE SIMULATOR SLIDERS */}
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-brand-cream pb-3 font-display">
              <Sliders className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-extrabold text-brand-chocolate uppercase tracking-wider">Performance Adjustments</h3>
            </div>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              
              {/* Simulated CPU Load */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-brand-stone">
                  <span>MOCK CPU LOAD</span>
                  <span className={`font-bold ${simulatedCpuLoad > 85 ? 'text-red-600 animate-pulse' : 'text-brand-chocolate'}`}>
                    {simulatedCpuLoad}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={simulatedCpuLoad}
                  onChange={(e) => setSimulatedCpuLoad(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
              </div>

              {/* Scheduler delay */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-brand-stone">
                  <span>SCHEDULER LATENCY</span>
                  <span className="font-bold text-brand-chocolate font-mono">
                    {schedulerDelay}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  value={schedulerDelay}
                  onChange={(e) => setSchedulerDelay(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
              </div>

              {/* Simulation Engine Speed */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase">Simulator Speed</label>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-brand-chocolate">
                  {['Realtime', 'Fast-Forward', 'Paused'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      className={`py-1.5 border rounded-full font-bold transition-colors cursor-pointer ${
                        simSpeed === speed
                          ? 'bg-brand-chocolate text-white border-brand-chocolate'
                          : 'bg-white border-brand-sand hover:border-brand-orange text-brand-stone'
                      }`}
                    >
                      {speed.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-brand-cream pt-4 mt-6 text-[10px] text-brand-stone">
            Changes here are shown instantly on your Overview dashboard.
          </div>
        </div>

        {/* COLUMN 2: TELEMETRY CRITICAL FAULT INJECTOR */}
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-brand-cream pb-3 font-display">
              <Flame className="w-4 h-4 text-red-600 animate-pulse" />
              <h3 className="text-xs font-extrabold text-brand-chocolate uppercase tracking-wider">Trigger Mock Failures</h3>
            </div>

            <p className="text-xs text-brand-stone leading-relaxed">
              Trigger test failures or fake crashes to see how your AI helpers automatically recover.
            </p>

            <div className="flex flex-col gap-2.5">
              
              <button
                onClick={injectCrashReportGen}
                className="w-full px-3.5 py-2.5 bg-brand-cream hover:bg-brand-beige border border-brand-sand/60 hover:border-brand-orange rounded-xl text-left text-xs text-brand-chocolate flex items-center justify-between transition-all cursor-pointer font-semibold"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Trigger Crash: ReportGen-02</span>
                  <span className="text-[9px] text-brand-stone uppercase">Simulates helper crashing</span>
                </div>
                <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 text-[8px] font-bold rounded-full">CRITICAL</span>
              </button>

              <button
                onClick={injectApiTimeout}
                className="w-full px-3.5 py-2.5 bg-brand-cream hover:bg-brand-beige border border-brand-sand/60 hover:border-brand-orange rounded-xl text-left text-xs text-brand-chocolate flex items-center justify-between transition-all cursor-pointer font-semibold"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Trigger Webhook Timeout</span>
                  <span className="text-[9px] text-brand-stone uppercase">Simulates Slack connection failing</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 text-[8px] font-bold rounded-full">WARNING</span>
              </button>

              <button
                onClick={injectMemoryExhaustion}
                className="w-full px-3.5 py-2.5 bg-brand-cream hover:bg-brand-beige border border-brand-sand/60 hover:border-brand-orange rounded-xl text-left text-xs text-brand-chocolate flex items-center justify-between transition-all cursor-pointer font-semibold"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Trigger Memory Warning</span>
                  <span className="text-[9px] text-brand-stone uppercase">Simulates slow helper warning</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 text-[8px] font-bold rounded-full">WARNING</span>
              </button>

            </div>
          </div>

          <div className="border-t border-brand-cream pt-4 mt-4 text-[10px] text-brand-stone">
            Click "Fix and Reset All Helpers" at the top to clear all mock failures.
          </div>
        </div>

        {/* COLUMN 3: AUTH KEYS & SECURITY PARAMETERS */}
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-brand-cream pb-3 font-display">
              <Lock className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-extrabold text-brand-chocolate uppercase tracking-wider">Root Security Authorization</h3>
            </div>

            <div className="flex flex-col gap-4 font-semibold text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-brand-stone uppercase">Authority Signature Key</label>
                <input
                  type="text"
                  value={rootKey}
                  onChange={(e) => setRootKey(e.target.value)}
                  className="w-full px-4 py-2 text-xs border border-brand-sand bg-brand-cream rounded-xl focus:outline-none focus:border-brand-orange font-mono text-brand-chocolate font-bold"
                />
                <span className="text-[10px] text-brand-stone leading-relaxed">Required to authorize system modifications.</span>
              </div>

              <div className="p-4 bg-brand-cream border border-brand-sand rounded-xl flex flex-col gap-1.5 text-[10px] text-brand-stone font-semibold">
                <div className="flex items-center gap-1.5 text-brand-chocolate font-extrabold uppercase mb-1">
                  <Database className="w-3.5 h-3.5 text-brand-orange" /> Database Encryption Status
                </div>
                <div className="flex justify-between">
                  <span>Encryption Method:</span>
                  <span className="text-brand-chocolate font-bold">AES-GCM-256</span>
                </div>
                <div className="flex justify-between">
                  <span>Unfinished Checks:</span>
                  <span className="text-brand-chocolate font-bold">0 failed (Nominal)</span>
                </div>
                <div className="flex justify-between">
                  <span>Access Rules:</span>
                  <span className="text-brand-chocolate font-bold">Sandbox Chroot Only</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-cream pt-4 mt-4 text-[10px] text-brand-stone">
            Database encryption is active and safe.
          </div>
        </div>

      </div>

      {/* RE-COMPILATION EDITOR SECTION (Full screen width) */}
      <div className="bg-white border border-brand-sand rounded-2xl shadow-sm overflow-hidden hover:border-brand-orange transition-colors duration-150">
        
        <div className="px-6 py-4 border-b border-brand-sand flex items-center justify-between bg-brand-cream">
          <div className="flex items-center gap-2 font-display">
            <FileCode className="w-4.5 h-4.5 text-brand-orange" />
            <span className="font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">System Micro-Configuration (JSON)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${
              isJsonValid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isJsonValid ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {isJsonValid ? 'JSON SYNTAX OK' : 'JSON SYNTAX ERROR'}
            </span>
            
            <button
              onClick={handleSaveConfigCode}
              disabled={!isJsonValid}
              className="px-4 py-2 bg-brand-chocolate hover:bg-brand-chocolate/90 disabled:bg-brand-sand/50 disabled:text-brand-stone disabled:cursor-not-allowed text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Save System Config
            </button>
          </div>
        </div>

        <div className="p-6 text-xs flex flex-col gap-2">
          <textarea
            value={configCode}
            onChange={(e) => setConfigCode(e.target.value)}
            rows={15}
            className="w-full p-4 bg-brand-chocolate text-brand-cream border border-brand-stone rounded-xl focus:outline-none font-mono text-xs leading-relaxed whitespace-pre"
          />
          <span className="text-[10px] text-brand-stone font-semibold mt-1">
            Be careful: Saving an invalid config can pause your AI helpers. The system checks your formatting before saving.
          </span>
        </div>

      </div>

    </div>
  );
}
