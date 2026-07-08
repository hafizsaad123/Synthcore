import React, { useState } from 'react';
import { ConnectedTool } from '../../types';
import { Link2, Unlink, Check, Key, ShieldCheck, X } from 'lucide-react';
import ToolLogo from '../../components/ToolLogo';

interface IntegrationsProps {
  connectedTools: ConnectedTool[];
  setConnectedTools: React.Dispatch<React.SetStateAction<ConnectedTool[]>>;
  showToast: (content: string, error?: boolean) => void;
}

export default function Integrations({
  connectedTools,
  setConnectedTools,
  showToast
}: IntegrationsProps) {
  const [selectedTool, setSelectedTool] = useState<ConnectedTool | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');

  const handleOpenConnectModal = (tool: ConnectedTool) => {
    setSelectedTool(tool);
    setApiKey('');
    setApiEndpoint('');
  };

  const handleSaveConnection = () => {
    if (!selectedTool) return;
    
    // For custom API webhook, make sure endpoint is pasted
    if (selectedTool.id === 'custom_api' && !apiEndpoint.trim()) {
      showToast('Please specify a webhook URL.', true);
      return;
    }

    if (selectedTool.id !== 'custom_api' && !apiKey.trim()) {
      showToast('Please enter a valid API Key or password.', true);
      return;
    }

    setConnectedTools((prev) =>
      prev.map((t) => (t.id === selectedTool.id ? { ...t, connected: true } : t))
    );
    showToast(`Successfully connected to ${selectedTool.name}!`);
    setSelectedTool(null);
  };

  const handleDisconnect = (id: string, name: string) => {
    setConnectedTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, connected: false } : t))
    );
    showToast(`Disconnected from ${name}.`);
  };

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 border-b border-brand-sand pb-5">
        <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">Connected Tools</h1>
        <p className="text-xs text-brand-stone font-semibold">
          Link your favorite apps and tools to your account. Your AI helpers will automatically use these apps to complete tasks for you.
        </p>
      </div>

      {/* INTEGRATIONS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectedTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-brand-orange transition-colors duration-150">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 font-semibold">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-brand-cream border border-brand-sand/60 flex items-center justify-center shrink-0">
                    <ToolLogo id={tool.id} className="w-5 h-5 text-brand-chocolate" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-brand-chocolate tracking-tight">{tool.name}</h3>
                    <span className="text-[10px] text-brand-stone uppercase tracking-wider">{tool.category}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  tool.connected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-brand-beige text-brand-stone border-brand-sand/50'
                }`}>
                  {tool.connected ? 'CONNECTED' : 'OFFLINE'}
                </span>
              </div>

              <div className="border-t border-brand-cream pt-3.5 text-xs text-brand-stone min-h-[34px] font-semibold leading-relaxed">
                {tool.connected ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" /> App Connected Successfully
                  </span>
                ) : (
                  <span>No connection configured yet. Please connect this app to let your AI helpers use it.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4 border-t border-brand-cream font-semibold">
              {tool.connected ? (
                <button
                  onClick={() => handleDisconnect(tool.id, tool.name)}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" /> Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleOpenConnectModal(tool)}
                  className="px-3.5 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Link2 className="w-3.5 h-3.5" /> Connect App
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* CONNECT API OVERLAY MODAL */}
      {selectedTool && (
        <div className="fixed inset-0 bg-brand-chocolate/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-sand rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-brand-cream border-b border-brand-sand px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-display">
                <Key className="w-4.5 h-4.5 text-brand-orange" />
                <span className="font-extrabold text-sm text-brand-chocolate uppercase tracking-wider">Connect {selectedTool.name}</span>
              </div>
              <button 
                onClick={() => setSelectedTool(null)}
                className="text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4.5 font-semibold text-xs">
              
              <div className="p-4 bg-brand-cream border border-brand-sand rounded-xl flex gap-3 text-brand-stone leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  We keep your keys completely safe and locked up. Your connection passwords are never shared or shown to anyone.
                </span>
              </div>
              
              {selectedTool.id === 'custom_api' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Webhook URL</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.yourcompany.com/v1/webhook"
                    className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">API Key or Password</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-live-••••••••••••"
                    className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-bold text-xs font-mono"
                  />
                  <span className="text-[10px] text-brand-stone font-semibold">Paste your API key or password here from your account settings.</span>
                </div>
              )}

            </div>

            <div className="bg-brand-cream border-t border-brand-sand px-6 py-4 flex items-center justify-end gap-2 font-semibold">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 bg-white hover:bg-brand-cream border border-brand-sand rounded-full text-xs font-bold text-brand-stone transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConnection}
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Connect App
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
