import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Target, 
  Play, 
  Check, 
  Activity, 
  Shield, 
  Zap, 
  Terminal, 
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronRight,
  Lock,
  X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const emailInput = adminEmail.trim().toLowerCase();
    const allowedEmails = ['admin@arxodyne.com'];
    const allowedPasscodes = ['admin123', '1337', 'arxodyne2026', 'password123'];

    if (!emailInput) {
      setAdminError('Please enter an authorized email address.');
      return;
    }

    if (!allowedEmails.includes(emailInput)) {
      setAdminError('ACCESS DENIED: Email is not registered as an authorized system administrator.');
      return;
    }

    if (!adminPasscode) {
      setAdminError('Please enter the security override passcode.');
      return;
    }

    if (!allowedPasscodes.includes(adminPasscode)) {
      setAdminError('ACCESS DENIED: Security override passcode does not match.');
      return;
    }

    // Success! Setup secure session variables
    localStorage.setItem('synthcore_onboarded', 'true');
    localStorage.setItem('synthcore_is_super', 'true');
    localStorage.setItem('synthcore_username', 'Saad');
    localStorage.setItem('synthcore_company', 'Arxodyne Global HQ');
    localStorage.setItem('synthcore_email', emailInput);
    localStorage.setItem('synthcore_goal', 'Optimize global failover routing and compile kernel micro-configs');
    localStorage.setItem('synthcore_selected_tools', JSON.stringify(['custom_api', 'slack', 'notion']));
    
    setIsAdminModalOpen(false);
    navigate('/dashboard/super-admin');
  };

  const plans = [
    {
      name: 'Starter Network',
      price: 'Free',
      cta: 'Start for Free',
      featured: false,
      features: [
        'Deploy up to 5 agent nodes',
        '2 active strategic goals',
        'Standard execution queue routing',
        'Next-day support SLAs',
      ],
    },
    {
      name: 'Scale Network',
      price: '$499',
      cta: 'Deploy Scale Network',
      featured: true,
      features: [
        'Deploy up to 25 agent nodes',
        'Unlimited strategic goals',
        'High-speed execution routing',
        '1-hour critical response SLAs',
        'Custom integration access',
      ],
    },
    {
      name: 'Enterprise Mesh',
      price: 'Custom',
      cta: 'Contact Architecture Desk',
      featured: false,
      features: [
        'Unlimited agent worker nodes',
        'Private LLM endpoint routing',
        'Sub-100ms scheduler latency',
        'Dedicated success architect',
        '24/7 technical operations desk',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white antialiased font-sans">
      {/* 1.1 NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-black text-white w-7 h-7 rounded flex items-center justify-center font-bold text-sm tracking-tight">
              AR
            </div>
            <span className="font-bold text-lg tracking-tight">Arxodyne</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600 font-medium">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-black transition-colors cursor-pointer">Features</button>
            <button onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-black transition-colors cursor-pointer">Architecture</button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-black transition-colors cursor-pointer">Pricing</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition-all duration-150 shadow-sm active:scale-98 cursor-pointer"
            >
              Start for Free
            </button>
            <button
              onClick={() => navigate('/onboarding', { state: { mode: 'signin' } })}
              className="border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-3.5 py-2 rounded-md transition-all duration-150 cursor-pointer active:scale-98"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* 1.2 HERO SECTION (Geist Stark White) */}
      <section className="relative overflow-hidden bg-white text-neutral-900 py-24 md:py-32 border-b border-[#EAEAEA]">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs text-neutral-600 font-mono mb-8 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Now in Public Beta: Arxodyne v1.4
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-neutral-900 max-w-4xl leading-[1.1] mb-6">
            One Brain. <span className="text-neutral-500">Every AI Agent.</span> <span className="text-neutral-400">Zero Chaos.</span>
          </h1>

          <p className="text-neutral-500 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Arxodyne is the operating system that sits above all your AI tools 
            and coordinates them into a single, unified intelligent grid—autonomously.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white text-sm font-semibold px-8 py-3.5 rounded-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start for Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/onboarding', { state: { mode: 'signin' } })}
              className="w-full sm:w-auto border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-sm font-semibold px-8 py-3.5 rounded-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              Log In
            </button>
          </div>

          <div className="text-neutral-400 text-xs font-mono">
            No credit card required · Free 14-day trial · Standard SLA
          </div>
        </div>
      </section>

      {/* 1.3 STATS BAR CALIBRATION */}
      <div className="relative -mt-10 z-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#EAEAEA] rounded-lg shadow-md divide-y md:divide-y-0 md:divide-x divide-[#EAEAEA] grid grid-cols-1 md:grid-cols-3">
            {[
              { value: '12M+', label: 'Agent Operations Daily', desc: 'Realtime orchestration latency < 5ms' },
              { value: '340ms', label: 'Average Decision Speed', desc: 'LLM routing pipeline optimization' },
              { value: '99.98%', label: 'System Uptime', desc: 'Self-healing connection layers active' },
            ].map(({ value, label, desc }) => (
              <div key={label} className="p-6 text-center md:text-left flex flex-col justify-center">
                <span className="font-mono text-3xl font-extrabold text-black tracking-tight">{value}</span>
                <span className="text-sm font-bold text-neutral-800 mt-1">{label}</span>
                <span className="text-xs text-neutral-400 font-mono mt-0.5">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1.4 HOW IT WORKS SECTION */}
      <section id="architecture" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How Arxodyne Works</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-base">
            Arxodyne abstracts your entire AI workforce into a cohesive network, deploying and scheduling agents based on high-level strategic objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              step: '01',
              title: 'Connect Your AI Tools',
              body: 'Plug in any AI tool—ChatGPT, Claude, Gemini, Zapier, Make, or custom agent endpoints. Arxodyne manages permissions and credentials.'
            },
            {
              icon: Target,
              step: '02',
              title: 'Define Strategic Goals',
              body: 'Input your target outcome in plain English. Arxodyne parses the intent, selects suitable tools, and creates the execution plan.'
            },
            {
              icon: Play,
              step: '03',
              title: 'Autonomous Orchestration',
              body: 'Watch Arxodyne coordinate steps, monitor output state, automatically recover from agent failures, and log all audit steps.'
            },
          ].map(({ icon: IconComponent, step, title, body }) => (
            <div key={step} className="bg-white border border-[#EAEAEA] rounded-lg p-8 flex flex-col justify-between hover:border-neutral-400 transition-colors duration-200">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-neutral-100 p-2.5 rounded-md text-black">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-neutral-400 font-bold tracking-wider">STEP {step}</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1.5 FEATURES SECTION */}
      <section id="features" className="py-24 bg-white border-y border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
                  Live Intelligence
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight mb-4">
                  Watch Every Agent Operate in Real Time
                </h3>
                <p className="text-neutral-500 text-base leading-relaxed">
                  A high-fidelity central log displays every active autonomous agent, showing operations-per-minute, current task streams, and overall node health.
                </p>
              </div>

              <ul className="space-y-3.5 text-sm text-neutral-600 font-medium">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-black text-[10px] font-bold">1</span>
                  <span>Live telemetry streams per agent worker node</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-black text-[10px] font-bold">2</span>
                  <span>Automated load balancing and failover routing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-black text-[10px] font-bold">3</span>
                  <span>Cryptographic execution logs for total auditing</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-lg overflow-hidden font-mono text-xs">
              <div className="bg-white border-b border-[#EAEAEA] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-bold text-neutral-800">Operational Mesh Telemetry</span>
                </div>
                <span className="text-[10px] text-neutral-400">SECURE SHELL</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-semibold pb-2">
                      <th className="pb-2">AGENT NODE</th>
                      <th className="pb-2">METRIC</th>
                      <th className="pb-2 text-right">LOAD</th>
                      <th className="pb-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-600">
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2.5 font-bold text-black">EmailBot-01</td>
                      <td className="py-2.5 text-[10px]">SMTP Sync / Auth</td>
                      <td className="py-2.5 text-right">142 op/m</td>
                      <td className="py-2.5 text-right text-emerald-600 font-bold">RUNNING</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2.5 font-bold text-black">SupportAI-03</td>
                      <td className="py-2.5 text-[10px]">Stripe Webhook</td>
                      <td className="py-2.5 text-right">89 op/m</td>
                      <td className="py-2.5 text-right text-emerald-600 font-bold">RUNNING</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2.5 font-bold text-black">DataSync-07</td>
                      <td className="py-2.5 text-[10px]">JSON Batch / S3</td>
                      <td className="py-2.5 text-right">12 op/m</td>
                      <td className="py-2.5 text-right text-amber-500 font-bold">LAGGING</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2.5 font-bold text-black">ReportGen-02</td>
                      <td className="py-2.5 text-[10px]">PDF Assembly</td>
                      <td className="py-2.5 text-right">0 op/m</td>
                      <td className="py-2.5 text-right text-red-500 font-bold">REROUTED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.6 PRICING SECTION */}
      <section id="pricing" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Transparent Grid Pricing</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-base">
            Configure your autonomous AI network with clear tier-based metrics and zero execution premiums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white border rounded-lg p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.featured 
                  ? 'border-black ring-1 ring-black shadow-md relative' 
                  : 'border-[#EAEAEA] hover:border-neutral-400'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-sm text-neutral-400 font-mono">/mo</span>}
                  </div>
                </div>

                <hr className="border-[#EAEAEA] my-6" />

                <ul className="space-y-3.5 mb-8 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-neutral-600">
                      <Check className="w-4.5 h-4.5 text-black shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className={`w-full text-xs font-semibold py-3 rounded-md transition-colors ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-white text-black border border-[#EAEAEA] hover:bg-neutral-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 1.7 FOOTER */}
      <footer className="border-t border-[#EAEAEA] bg-white py-12 text-sm text-neutral-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-black text-white w-6 h-6 rounded flex items-center justify-center font-bold text-xs tracking-tight">
              AR
            </div>
            <span className="font-bold text-black tracking-tight">Arxodyne</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
            <span className="hover:text-black cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-black cursor-pointer transition-colors">Documentation</span>
          </div>

          <div className="font-mono text-[11px] text-neutral-400 flex items-center gap-1.5">
            © 2026 Arxodyne Technologies, Inc. All rights reserved.
            <button
              onClick={() => {
                setIsAdminModalOpen(true);
                setAdminEmail('');
                setAdminPasscode('');
                setAdminError('');
              }}
              className="p-1 hover:text-black opacity-30 hover:opacity-100 transition-all cursor-pointer rounded"
              title="Secure Gateway"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* SECURE ADMIN GATEWAY MODAL OVERLAY */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-[#EAEAEA] rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 text-left"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between">
              <div className="flex items-center gap-2 text-black">
                <Lock className="w-5 h-5 text-black" />
                <h3 className="font-bold text-base tracking-tight">Secure Admin Gateway</h3>
              </div>
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAdminAccess} className="p-6 flex flex-col gap-4">
              <p className="text-xs text-neutral-500 leading-relaxed">
                Unauthorized access is strictly prohibited. Enter authorized administrator credentials to establish a secure root override session.
              </p>

              {adminError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded text-xs font-mono font-medium leading-normal">
                  ⚠️ {adminError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@arxodyne.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Security Passcode</label>
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-xs focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Establish Root Override <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="px-6 py-4 bg-neutral-50 border-t border-[#F0F0F0] text-center">
              <span className="text-[10px] font-mono text-neutral-400">
                IP logged · Encrypted v2 Session
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
