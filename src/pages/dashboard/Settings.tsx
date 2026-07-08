import { useState } from 'react';
import { User, ShieldAlert, Cpu, CreditCard, Save } from 'lucide-react';

interface SettingsProps {
  username: string;
  setUsername: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  showToast: (content: string, error?: boolean) => void;
}

export default function Settings({
  username,
  setUsername,
  companyName,
  setCompanyName,
  showToast
}: SettingsProps) {
  const [email, setEmail] = useState('hafizmuhammadsaad4@gmail.com');
  const [defaultModel, setDefaultModel] = useState('Claude');
  const [failoverTimeout, setFailoverTimeout] = useState('30s');
  const [auditLogRetention, setAuditLogRetention] = useState('90d');

  const handleSaveSettings = () => {
    localStorage.setItem('synthcore_username', username);
    localStorage.setItem('synthcore_company', companyName);
    showToast('Global settings updated and saved.');
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Arxodyne Global Settings</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Adjust executive parameters, default LLMs, failure routing timelines, and system audits.
          </p>
        </div>
        
        <div>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Settings Parameters
          </button>
        </div>
      </div>

      {/* SETTINGS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Profile & Company */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
            <User className="w-4.5 h-4.5 text-neutral-600" />
            <h3 className="text-sm font-bold text-black uppercase font-mono tracking-wider">Administrator Profile</h3>
          </div>

          <div className="flex flex-col gap-4 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs text-neutral-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs text-neutral-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans text-xs text-neutral-800"
              />
            </div>
          </div>
        </div>

        {/* Column 2: System Routing Policy */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
            <Cpu className="w-4.5 h-4.5 text-neutral-600" />
            <h3 className="text-sm font-bold text-black uppercase font-mono tracking-wider">AI Node Policies</h3>
          </div>

          <div className="flex flex-col gap-4 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Default Intelligence Node</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white text-xs text-neutral-800"
              >
                <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                <option value="OpenAI">OpenAI GPT-4o</option>
                <option value="Gemini">Google Gemini 1.5 Pro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Self-healing Failover Timeout</label>
              <select
                value={failoverTimeout}
                onChange={(e) => setFailoverTimeout(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white text-xs text-neutral-800"
              >
                <option value="10s">10 seconds (aggressive)</option>
                <option value="30s">30 seconds (recommended)</option>
                <option value="60s">60 seconds</option>
                <option value="none">No automated fallback</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Cryptographic Audit Retention</label>
              <select
                value={auditLogRetention}
                onChange={(e) => setAuditLogRetention(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded focus:outline-none focus:border-black bg-white text-xs text-neutral-800"
              >
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="365d">365 Days (regulatory compliance)</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>
        </div>

        {/* Column 3: Billing & System Status Summary */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-neutral-50 pb-3">
            <CreditCard className="w-4.5 h-4.5 text-neutral-600" />
            <h3 className="text-sm font-bold text-black uppercase font-mono tracking-wider">Usage & Billing Desk</h3>
          </div>

          <div className="flex flex-col gap-4 font-mono text-[11px]">
            {[
              { label: 'Active Plan:', value: 'Growth Tier' },
              { label: 'Connected Agents:', value: '5 / 50 nodes' },
              { label: 'Operation Volume:', value: '48,291 / 150,000' },
              { label: 'Renew Date:', value: 'July 26, 2026' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-neutral-50 pb-2 last:border-0 last:pb-0">
                <span className="text-neutral-400">{label}</span>
                <span className="font-bold text-black">{value}</span>
              </div>
            ))}

            <div className="border-t border-[#F5F5F5] pt-4 flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Payment Method Connected:</span>
              <span className="font-sans font-bold text-black text-xs">Visa ending in •••• 4242</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
