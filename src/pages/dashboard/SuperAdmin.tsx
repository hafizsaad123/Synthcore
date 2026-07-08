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
      showToast('Super Admin Override Auth Unlocked!', false);
    } else {
      setErrorMsg('Invalid authorization passcode.');
      showToast('Access Denied: Invalid Key', true);
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
      description: 'Super-admin manual override: Absolute system-wide self-healing cycle invoked. Degraded telemetry indexes restored.',
      agent: 'Arxodyne OS Kernel',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Core system healed. All worker nodes successfully re-launched and stabilized.');
  };

  // 4. Telemetry Failure Injection Helpers
  const injectCrashReportGen = () => {
    // 1. Set ReportGen-02 to Failed with low health
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name.toLowerCase().includes('reportgen')
          ? { ...agent, status: 'Failed', health: 12, opsPerMin: 0 }
          : agent
      )
    );

    // 2. Add an unresolved critical alert
    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'ReportGen-02 Node Critical Crash',
      description: 'PDF compilation worker experienced sigsev stack overflow in rendering loop. Node automatically terminated to preserve security sandbox.',
      severity: 'critical',
      time: 'Just now',
      agentId: 'a4', // Match ReportGen
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // 3. Add to decision log
    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Alert',
      description: 'CRITICAL WARNING: ReportGen-02 Node disconnected. Execution requests routed to backup fallback threads.',
      agent: 'Failover Manager',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Failure injected: ReportGen-02 worker node crashed.', true);
  };

  const injectApiTimeout = () => {
    // Disconnect slack integration in connected tools
    setConnectedTools((prev) =>
      prev.map((tool) =>
        tool.name.toLowerCase().includes('slack')
          ? { ...tool, connected: false }
          : tool
      )
    );

    // Add alert
    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'Slack Webhook Handshake Timeout',
      description: 'API gateway timeout (504) returned from external server slack.com/api/webhooks. Retries exhausted after 3 attempts.',
      severity: 'warning',
      time: 'Just now',
      agentId: 'a1', // Match EmailBot/Slack
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Log decision
    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Rerouted',
      description: 'Slack handshake failure detected. External webhook connection marked as OFFLINE. Operations delayed.',
      agent: 'Gateway Controller',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Failure injected: Slack webhook handshake timeout.', true);
  };

  const injectMemoryExhaustion = () => {
    // Set DataSync-07 to Warning with health 45%
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name.toLowerCase().includes('datasync')
          ? { ...agent, status: 'Warning', health: 45, opsPerMin: 12 }
          : agent
      )
    );

    // Add Alert
    const newAlertId = `al-${Date.now()}`;
    const newAlert: AlertItem = {
      id: newAlertId,
      title: 'DataSync-07 Memory Leak Warning',
      description: 'DataSync memory usage exceeded 92% of local container heap limits. Throttling active ops to avoid Out-Of-Memory terminal crash.',
      severity: 'warning',
      time: 'Just now',
      agentId: 'a3', // Match DataSync
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Log decision
    const newDecision: Decision = {
      id: `d${decisions.length + 1}`,
      type: 'Alert',
      description: 'DataSync-07 thread heap allocation warning. Node entered throttle state to preserve stability.',
      agent: 'Resource Scheduler',
      time: 'Just now'
    };
    setDecisions((prev) => [newDecision, ...prev]);

    showToast('Failure injected: Memory leak on DataSync-07 node.', true);
  };

  const handleSaveConfigCode = () => {
    if (!isJsonValid) {
      showToast('Cannot save. Config JSON has syntax errors.', true);
      return;
    }
    showToast('Kernel configuration compiled and loaded to flash memory.');
  };

  if (!isUnlocked) {
    if (!isEmailAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in duration-200">
          <div className="bg-white border border-red-200 rounded-md p-8 shadow-sm max-w-sm w-full">
            <div className="flex flex-col gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-red-600 font-mono font-bold tracking-wider uppercase">ROOT ACCESS DENIED</span>
                <h2 className="text-lg font-bold text-black tracking-tight">Security Block Active</h2>
                <p className="text-xs text-neutral-500 leading-normal">
                  Your logged-in account (<code className="bg-neutral-50 px-1 py-0.5 rounded font-mono font-bold text-red-600 text-[11px]">{userEmail || 'guest'}</code>) is not on the authorized system administrator register.
                </p>
                <p className="text-[10px] text-neutral-400 font-mono mt-2 leading-normal">
                  This unauthorized attempt has been logged with system telemetry. Please authenticate with a secure administrator account.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm max-w-sm w-full">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Lock className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-red-600 font-mono font-bold tracking-wider uppercase">SECURE AREA LOCKED</span>
              <h2 className="text-lg font-bold text-black tracking-tight">Super Admin Override</h2>
              <p className="text-xs text-neutral-500 leading-normal">
                This console accesses raw operational kernel configs and system-wide overrides. Authorized credentials are required.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase">ENTER SECURITY DEPLOYMENT PASSCODE</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-red-500 font-mono tracking-widest text-center"
                />
                {errorMsg && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 font-bold">{errorMsg}</span>
                )}
                <span className="text-[9px] text-neutral-400 font-mono mt-2 leading-normal text-center block">
                  Hint: Passcodes are <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600 font-bold">admin123</code> or <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-600 font-bold">1337</code>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Authenticate Override
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-neutral-950 text-white border border-neutral-800 rounded font-mono text-[9px] font-bold tracking-widest uppercase">
              ROOT MODE
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-black">Super-Admin System Console</h1>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Execute direct kernel overrides, inject telemetry faults to verify self-healing routines, and adjust sandbox micro-configurations.
          </p>
        </div>

        <div>
          <button
            onClick={handleSelfHealCycle}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Trigger Global Self-Healing Cycle
          </button>
        </div>
      </div>

      {/* THREE COLUMN GRID - OVERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: LIVE SIMULATOR SLIDERS */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
              <Sliders className="w-4 h-4 text-black" />
              <h3 className="text-xs font-bold text-black uppercase font-mono tracking-wider">Live Scheduler Tweaks</h3>
            </div>

            <div className="flex flex-col gap-4 text-xs font-sans">
              
              {/* Simulated CPU Load */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-mono text-[10px] text-neutral-500">
                  <span>SYSTEM OVERALL CPU LOAD</span>
                  <span className={`font-bold ${simulatedCpuLoad > 85 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                    {simulatedCpuLoad}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={simulatedCpuLoad}
                  onChange={(e) => setSimulatedCpuLoad(parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              {/* Scheduler delay */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-mono text-[10px] text-neutral-500">
                  <span>SCHEDULER ROUTING LATENCY</span>
                  <span className="font-bold text-black font-mono">
                    {schedulerDelay}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  value={schedulerDelay}
                  onChange={(e) => setSchedulerDelay(parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              {/* Simulation Engine Speed */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-500 font-mono uppercase">Simulation Cycle Rate</label>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-neutral-700">
                  {['Realtime', 'Fast-Forward', 'Paused'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      className={`py-1.5 border rounded font-semibold transition-colors ${
                        simSpeed === speed
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-neutral-200 hover:border-black'
                      }`}
                    >
                      {speed.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-[#F5F5F5] pt-4 mt-6 text-[10px] font-mono text-neutral-400">
            Real-time updates are piped into Overview KPIs instantly.
          </div>
        </div>

        {/* COLUMN 2: TELEMETRY CRITICAL FAULT INJECTOR */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
              <Flame className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-black uppercase font-mono tracking-wider">Fault & Failure Injection</h3>
            </div>

            <p className="text-xs text-neutral-500 leading-normal font-sans">
              Manually compromise API nodes or trigger mock crashes to examine Arxodyne's real-time self-healing rerouting mechanisms.
            </p>

            <div className="flex flex-col gap-2.5">
              
              <button
                onClick={injectCrashReportGen}
                className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-[#EAEAEA] hover:border-neutral-400 rounded text-left font-mono text-xs text-black flex items-center justify-between transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Inject Crash: ReportGen-02</span>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono">Simulates Stack Overflow Error</span>
                </div>
                <span className="px-1.5 py-0.5 bg-red-50 border border-red-200 text-red-600 text-[8px] font-bold rounded">CRITICAL</span>
              </button>

              <button
                onClick={injectApiTimeout}
                className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-[#EAEAEA] hover:border-neutral-400 rounded text-left font-mono text-xs text-black flex items-center justify-between transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Inject Timeout: Slack Handshake</span>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono">Fails external webhooks</span>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[8px] font-bold rounded">WARNING</span>
              </button>

              <button
                onClick={injectMemoryExhaustion}
                className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-[#EAEAEA] hover:border-neutral-400 rounded text-left font-mono text-xs text-black flex items-center justify-between transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-bold">Inject Warning: DataSync Heap</span>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono">Forces throttling state</span>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[8px] font-bold rounded">WARNING</span>
              </button>

            </div>
          </div>

          <div className="border-t border-[#F5F5F5] pt-4 mt-4 text-[10px] font-mono text-neutral-400">
            Use "Self-Healing Cycle" above to clear all injected warning variables.
          </div>
        </div>

        {/* COLUMN 3: AUTH KEYS & SECURITY PARAMETERS */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-4.5">
            <div className="flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
              <Lock className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold text-black uppercase font-mono tracking-wider">Root Security Authorization</h3>
            </div>

            <div className="flex flex-col gap-4 font-sans text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-500 font-mono uppercase">Root Authority Signature (HEX)</label>
                <input
                  type="text"
                  value={rootKey}
                  onChange={(e) => setRootKey(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-mono text-xs text-neutral-800"
                />
                <span className="text-[10px] text-neutral-400 font-mono leading-normal">Required to override system telemetry checks and secure memory buffers.</span>
              </div>

              <div className="p-3.5 bg-neutral-50 border border-[#EAEAEA] rounded flex flex-col gap-1.5 font-mono text-[10px] text-neutral-500">
                <div className="flex items-center gap-1.5 text-neutral-800 font-bold uppercase mb-1">
                  <Database className="w-3.5 h-3.5 text-neutral-700" /> Secure Database Status
                </div>
                <div className="flex justify-between">
                  <span>Encryption Module:</span>
                  <span className="text-black font-semibold">AES-GCM-256</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Retries:</span>
                  <span className="text-black font-semibold">0 failed (Nominal)</span>
                </div>
                <div className="flex justify-between">
                  <span>Host Access Policy:</span>
                  <span className="text-black font-semibold">Sandbox Chroot Only</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F5F5F5] pt-4 mt-4 text-[10px] font-mono text-neutral-400">
            Cryptographic audit lock is currently enforced.
          </div>
        </div>

      </div>

      {/* RE-COMPILATION EDITOR SECTION (Full screen width) */}
      <div className="bg-white border border-[#EAEAEA] rounded-md shadow-sm overflow-hidden">
        
        <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-4.5 h-4.5 text-neutral-700" />
            <span className="font-bold text-sm text-black uppercase font-mono tracking-tight">Active Kernel Micro-Configuration (JSON)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5 ${
              isJsonValid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isJsonValid ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {isJsonValid ? 'SYNTAX OK' : 'SYNTAX ERROR: INVALID JSON'}
            </span>
            
            <button
              onClick={handleSaveConfigCode}
              disabled={!isJsonValid}
              className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors"
            >
              Compile & Save Micro-Config
            </button>
          </div>
        </div>

        <div className="p-5 font-mono text-xs flex flex-col gap-2">
          <textarea
            value={configCode}
            onChange={(e) => setConfigCode(e.target.value)}
            rows={15}
            className="w-full p-4 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-neutral-700 font-mono text-xs leading-relaxed leading-normal whitespace-pre"
          />
          <span className="text-[10px] text-neutral-400 font-mono mt-1">
            Careful: Saving an invalid kernel config can halt background execution thread loops. The system performs syntax checks before writing to flash registers.
          </span>
        </div>

      </div>

    </div>
  );
}
