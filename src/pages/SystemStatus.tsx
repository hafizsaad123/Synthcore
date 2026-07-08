import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, RefreshCw, ArrowLeft, 
  Clock, Globe, Terminal, Zap 
} from 'lucide-react';

interface NetworkRegion {
  name: string;
  code: string;
  status: 'operational' | 'congested' | 'down';
  latency: number;
  uptime: string;
  activeNodes: number;
}

export default function SystemStatus() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>(new Date().toLocaleTimeString());
  const [regions, setRegions] = useState<NetworkRegion[]>([
    { name: 'US East (Virginia)', code: 'us-east-1', status: 'operational', latency: 42, uptime: '99.99%', activeNodes: 412 },
    { name: 'US West (Oregon)', code: 'us-west-2', status: 'operational', latency: 58, uptime: '100.00%', activeNodes: 289 },
    { name: 'EU Central (Frankfurt)', code: 'eu-central-1', status: 'operational', latency: 81, uptime: '99.97%', activeNodes: 567 },
    { name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1', status: 'operational', latency: 120, uptime: '99.95%', activeNodes: 198 },
    { name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1', status: 'operational', latency: 114, uptime: '99.98%', activeNodes: 215 },
  ]);

  const [activeIncidents] = useState<Array<{ title: string; time: string; severity: string; resolution: string }>>([
    {
      title: 'Slight delay in sending messages',
      time: 'July 7, 2026 - 18:24 UTC',
      severity: 'Minor',
      resolution: 'Resolved: Fixed by redirecting server traffic to a backup region.'
    }
  ]);

  const [liveStreamLogs, setLiveStreamLogs] = useState<string[]>([
    '[system] Saved data changes successfully.',
    '[assistant] Sent task to Email Helper (AI is 94% sure)',
    '[safety] Checked task: Everything looks safe to run.',
    '[system] Checked: All 1,681 AI assistants are online.'
  ]);

  // Handle mock manual ping test
  const handlePingSimulate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate slight latency changes
      setRegions(prev => prev.map(r => ({
        ...r,
        latency: Math.max(15, r.latency + Math.floor(Math.random() * 15) - 7)
      })));
      setLastChecked(new Date().toLocaleTimeString());
      setIsRefreshing(false);

      // Append new event log
      const codes = ['us-east-1', 'eu-central-1', 'ap-southeast-1'];
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      const randomLatency = Math.floor(Math.random() * 30) + 20;
      const newLog = `[ping]   [${new Date().toLocaleTimeString()}] Checked ${randomCode} servers: Online and fast (${randomLatency}ms).`;
      setLiveStreamLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 800);
  };

  // Auto-tick logs to look alive
  useEffect(() => {
    const interval = setInterval(() => {
      const logTemplates = [
        '[assistant] Checked: Assistant queue is running fine.',
        '[system] Logged in safely and securely.',
        '[system] Cleaned up temporary files (14MB saved).',
        '[safety] Checked goals: 100% correct.',
        '[system] Saved recent activity logs to the cloud.'
      ];
      const selected = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const formattedLog = `[system] [${new Date().toLocaleTimeString()}] ${selected}`;
      setLiveStreamLogs(prev => [formattedLog, ...prev].slice(0, 8));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans">
      
      {/* Header Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate">
              arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
            </span>
            <span className="text-[10px] border border-brand-sand px-2.5 py-0.5 rounded-full text-emerald-600 font-extrabold uppercase bg-emerald-50 animate-pulse font-sans">Live Status</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-brand-stone hover:text-brand-orange transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
      </header>

      {/* Main Content container */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Network Header Panel */}
        <div className="border border-brand-sand bg-white rounded-2xl p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-brand-stone uppercase">
                All Systems Running Normally
              </span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-brand-chocolate tracking-tight">
              System Health & Speed Monitor
            </h1>
            <p className="text-xs text-brand-stone mt-1 font-semibold">
              Live connection speed of our global AI assistant servers.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-brand-stone block font-bold">LAST CHECKED</span>
              <span className="text-xs font-bold text-brand-chocolate font-mono">{lastChecked}</span>
            </div>
            <button
              onClick={handlePingSimulate}
              disabled={isRefreshing}
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-sand text-white disabled:text-brand-stone text-xs font-bold rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking...' : 'Test Connection Speed'}
            </button>
          </div>
        </div>

        {/* 3-Column Quick Metrics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-brand-sand bg-white p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-brand-stone block uppercase mb-1 font-sans">AI ASSISTANTS UPTIME</span>
            <span className="text-3xl font-extrabold text-brand-chocolate tracking-tight font-mono">99.982%</span>
            <p className="text-[11px] text-brand-stone mt-1.5 font-semibold">Calculated over the last 30 days.</p>
          </div>
          <div className="border border-brand-sand bg-white p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-brand-stone block uppercase mb-1 font-sans">ACTIVE AI ASSISTANTS</span>
            <span className="text-3xl font-extrabold text-brand-chocolate tracking-tight font-mono">1,681</span>
            <p className="text-[11px] text-brand-stone mt-1.5 font-semibold">Includes personal helpers & business systems.</p>
          </div>
          <div className="border border-brand-sand bg-white p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-brand-stone block uppercase mb-1 font-sans">AVERAGE RESPOND SPEED</span>
            <span className="text-3xl font-extrabold text-brand-chocolate tracking-tight font-mono">4.2ms</span>
            <p className="text-[11px] text-brand-stone mt-1.5 font-semibold">How fast your assistants start their tasks.</p>
          </div>
        </div>

        {/* Core Layout Grid split: Left Regional statuses, Right Live Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* USAGE AND REGIONS: 7cols */}
          <div className="lg:col-span-7 bg-white border border-brand-sand rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-brand-chocolate text-sm tracking-tight mb-5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-orange" /> Active Server Regions
            </h3>

            <div className="space-y-4">
              {regions.map((region) => (
                <div key={region.code} className="border border-brand-sand bg-brand-beige p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-brand-sand flex items-center justify-center text-brand-stone font-bold text-[10px] uppercase font-sans">
                      {region.code.slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-chocolate block">{region.name}</span>
                      <span className="text-[10px] font-mono text-brand-stone block uppercase font-bold">{region.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-sans">
                    <div className="text-right">
                      <span className="text-[9px] text-brand-stone block font-sans font-bold">SPEED</span>
                      <span className="text-xs font-bold text-brand-chocolate font-mono">{region.latency}ms</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[9px] text-brand-stone block font-sans font-bold">UPTIME</span>
                      <span className="text-xs font-bold text-brand-chocolate font-mono">{region.uptime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-sand rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase font-sans">Working Fine</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REALTIME SYSTEM HEARTBEAT LOGS: 5cols */}
          <div className="lg:col-span-5 bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-brand-chocolate text-sm tracking-tight mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-orange" /> Live Assistant Activity
              </h3>
              
              <div className="bg-brand-chocolate text-brand-cream p-4 rounded-xl font-mono text-[11px] leading-relaxed space-y-2 h-72 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-brand-sand border-b border-brand-sand pb-1.5 mb-2">
                  <Zap className="w-3 h-3 text-brand-orange animate-pulse" />
                  <span>Streaming activity logs...</span>
                </div>
                {liveStreamLogs.map((log, index) => (
                  <div key={index} className="text-brand-cream/80 hover:text-white transition-colors py-0.5 truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-sand pt-4 mt-6">
              <span className="text-[10px] text-brand-stone block font-bold font-sans">NEED SUPPORT?</span>
              <p className="text-xs text-brand-stone mt-1 leading-normal font-semibold">
                If your assistant isn't connecting properly, read our easy documentation or ask our support team for help.
              </p>
              <button
                onClick={() => navigate('/docs')}
                className="mt-3 text-xs font-bold text-brand-orange hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Go to Documentation <ArrowLeft className="w-3.5 h-3.5 transform rotate-180" />
              </button>
            </div>

          </div>

        </div>

        {/* Historic Incidents Timeline */}
        <div className="mt-8 border border-brand-sand bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-brand-chocolate text-sm tracking-tight mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-orange" /> Activity History (Past 14 Days)
          </h3>
          
          {activeIncidents.length === 0 ? (
            <p className="text-xs text-brand-stone italic font-semibold">No events reported.</p>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident, i) => (
                <div key={i} className="border-l-2 border-brand-orange pl-4 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-chocolate">{incident.title}</span>
                    <span className="bg-brand-orange/10 text-brand-orange text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-sans">
                      {incident.severity} Delay
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-stone block mb-1 font-bold">{incident.time}</span>
                  <p className="text-xs text-brand-stone font-semibold leading-relaxed">
                    {incident.resolution}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-brand-sand bg-white py-8 text-xs text-brand-stone mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <span>© 2026 Arxodyne Technologies, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/terms')}>Terms of Service</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/docs')}>Documentation</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
