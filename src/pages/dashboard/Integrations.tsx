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
      showToast('Please input a valid API Key or secret token.', true);
      return;
    }

    setConnectedTools((prev) =>
      prev.map((t) => (t.id === selectedTool.id ? { ...t, connected: true } : t))
    );
    showToast(`Integration with ${selectedTool.name} was successfully established.`);
    setSelectedTool(null);
  };

  const handleDisconnect = (id: string, name: string) => {
    setConnectedTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, connected: false } : t))
    );
    showToast(`Disconnected from ${name}. Secure tunnels deleted.`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 border-b border-[#EAEAEA] pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-black">Integrated App & API Connectors</h1>
        <p className="text-xs text-neutral-500 font-medium">
          Connect, authorize, and audit secure APIs. Arxodyne schedules execution tasks across these authorized tunnels.
        </p>
      </div>

      {/* INTEGRATIONS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectedTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-colors duration-150">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0">
                    <ToolLogo id={tool.id} className="w-5 h-5 text-neutral-800" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-black tracking-tight">{tool.name}</h3>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">{tool.category}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                  tool.connected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                }`}>
                  {tool.connected ? 'CONNECTED' : 'OFFLINE'}
                </span>
              </div>

              <div className="border-t border-[#F5F5F5] pt-3 text-[11px] font-sans text-neutral-500 min-h-[34px]">
                {tool.connected ? (
                  <span className="text-emerald-700 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> API Secure Tunnel Open
                  </span>
                ) : (
                  <span>No authorization credentials configured yet. Arxodyne agents will fail tasks for this service.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4 border-t border-[#F5F5F5]">
              {tool.connected ? (
                <button
                  onClick={() => handleDisconnect(tool.id, tool.name)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Unlink className="w-3 h-3" /> Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleOpenConnectModal(tool)}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Link2 className="w-3 h-3" /> Configure Key
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* CONNECT API OVERLAY MODAL */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEAEA] rounded-md shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="bg-neutral-50 border-b border-[#EAEAEA] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-black" />
                <span className="font-bold text-sm tracking-tight text-black uppercase font-mono">Authorize Integration: {selectedTool.name}</span>
              </div>
              <button 
                onClick={() => setSelectedTool(null)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4.5 font-sans text-xs">
              
              <div className="p-3 bg-neutral-50 border border-[#EAEAEA] rounded flex gap-3 text-neutral-600 leading-normal">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-sans text-[11px]">
                  Arxodyne utilizes military-grade enterprise AES-256 standards to encrypt auth tokens at rest. Your direct keys are never shared or made visible.
                </span>
              </div>
              
              {selectedTool.id === 'custom_api' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Custom API Webhook Endpoint URL</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.yourcompany.com/v1/webhook"
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">API Authorization Key or Secret Token</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`sk-live-${selectedTool.name.toLowerCase()}-••••••••`}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-mono text-xs"
                  />
                  <span className="text-[10px] text-neutral-400 font-mono">Must be a valid token generated inside your {selectedTool.name} account dashboard.</span>
                </div>
              )}

            </div>

            <div className="bg-neutral-50 border-t border-[#EAEAEA] px-5 py-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 bg-white hover:bg-neutral-100 border border-[#EAEAEA] rounded text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConnection}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Save & Open Secure Tunnel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
