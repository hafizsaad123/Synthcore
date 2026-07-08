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
    showToast('Settings saved successfully!');
  };

  return (
    <div className="flex flex-col gap-8 text-brand-chocolate">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">My Settings</h1>
          <p className="text-xs text-brand-stone font-semibold">
            Manage your contact info, default AI helpers, and account plan details.
          </p>
        </div>
        
        <div>
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>

      {/* SETTINGS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Profile & Company */}
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-brand-cream pb-3 font-display">
            <User className="w-4.5 h-4.5 text-brand-orange" />
            <h3 className="text-sm font-extrabold text-brand-chocolate uppercase tracking-wider">Profile Info</h3>
          </div>

          <div className="flex flex-col gap-4 font-semibold text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs"
              />
            </div>
          </div>
        </div>

        {/* Column 2: System Routing Policy */}
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-brand-cream pb-3 font-display">
            <Cpu className="w-4.5 h-4.5 text-brand-orange" />
            <h3 className="text-sm font-extrabold text-brand-chocolate uppercase tracking-wider">AI Settings</h3>
          </div>

          <div className="flex flex-col gap-4 font-semibold text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Default AI Engine</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer text-xs"
              >
                <option value="Claude">Anthropic Claude 3.5 Sonnet</option>
                <option value="OpenAI">OpenAI GPT-4o</option>
                <option value="Gemini">Google Gemini 1.5 Pro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">Time before retrying failed tasks</label>
              <select
                value={failoverTimeout}
                onChange={(e) => setFailoverTimeout(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer text-xs"
              >
                <option value="10s">10 seconds (aggressive)</option>
                <option value="30s">30 seconds (recommended)</option>
                <option value="60s">60 seconds</option>
                <option value="none">Do not retry automatically</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">How long to keep activity history</label>
              <select
                value={auditLogRetention}
                onChange={(e) => setAuditLogRetention(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-sand rounded-xl bg-white focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold cursor-pointer text-xs"
              >
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="365d">365 Days</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>
        </div>

        {/* Column 3: Billing & System Status Summary */}
        <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-4.5">
          <div className="flex items-center gap-2.5 border-b border-brand-cream pb-3 font-display">
            <CreditCard className="w-4.5 h-4.5 text-brand-orange" />
            <h3 className="text-sm font-extrabold text-brand-chocolate uppercase tracking-wider">Billing & Usage</h3>
          </div>

          <div className="flex flex-col gap-4 font-semibold text-xs text-brand-stone">
            {[
              { label: 'Current Plan:', value: 'Growth Plan' },
              { label: 'AI Helpers:', value: '5 / 50 active' },
              { label: 'Tasks Done This Month:', value: '48,291 / 150,000' },
              { label: 'Next Renewal Date:', value: 'July 26, 2026' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-brand-cream pb-2 last:border-0 last:pb-0">
                <span>{label}</span>
                <span className="font-bold text-brand-chocolate">{value}</span>
              </div>
            ))}

            <div className="border-t border-brand-cream pt-4 flex flex-col gap-1.5">
              <span className="text-[10px] text-brand-stone uppercase tracking-wider font-bold">Connected Card:</span>
              <span className="font-sans font-bold text-brand-chocolate text-xs">Visa ending in 4242</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
