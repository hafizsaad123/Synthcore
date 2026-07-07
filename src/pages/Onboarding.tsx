import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_AI_TOOLS } from '../data/mockData';
import { Check, ArrowRight, ArrowLeft, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import ToolLogo from '../components/ToolLogo';

export default function Onboarding() {
  const navigate = useNavigate();
  
  // Step State
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Step 1: Account Creation
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  // Step 2: Company Profile
  const [industry, setIndustry] = useState('ecommerce');
  const [companySize, setCompanySize] = useState('small');
  const [aiToolCount, setAiToolCount] = useState('few');

  // Step 3: Selected Tools
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Step 4: First Goal
  const [goal, setGoal] = useState('');

  const nextStep = () => {
    if (step === 1) {
      if (!firstName || !lastName || !email || !password || !company) {
        return;
      }
      localStorage.setItem('synthcore_username', `${firstName} ${lastName}`);
      localStorage.setItem('synthcore_company', company);
    }
    if (step === 3) {
      localStorage.setItem('synthcore_selected_tools', JSON.stringify(selectedTools));
    }
    if (step === 4) {
      localStorage.setItem('synthcore_goal', goal);
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleLaunchDashboard = () => {
    localStorage.setItem('synthcore_onboarded', 'true');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-bold text-black tracking-tight">Welcome to Arxodyne</h2>
                <p className="text-sm text-neutral-500">
                  Set up your AI command center in under 5 minutes.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@enterprise.com"
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                  />
                  <span className="text-[11px] text-neutral-400 font-mono">We will send your secure backup link here.</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!firstName || !lastName || !email || !password || !company}
                className="w-full py-3 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
              >
                Create Account <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#F5F5F5] mt-1">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('synthcore_onboarded', 'true');
                    localStorage.setItem('synthcore_username', 'Super Admin');
                    localStorage.setItem('synthcore_company', 'Arxodyne Global HQ');
                    localStorage.setItem('synthcore_goal', 'Optimize global failover routing and compile kernel micro-configs');
                    localStorage.setItem('synthcore_selected_tools', JSON.stringify(['custom_api', 'slack', 'notion']));
                    navigate('/dashboard/super-admin');
                  }}
                  className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-[#EAEAEA] hover:border-neutral-300 text-[11px] font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                >
                  ⚡ Super Admin Bypass to Dashboard
                </button>
              </div>

              <p className="text-[10px] text-center text-neutral-400 font-mono leading-normal">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-bold text-black tracking-tight">Company Profile</h2>
                <p className="text-sm text-neutral-500">
                  This helps Arxodyne recommend the right agent templates for your industry.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans bg-white"
                  >
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="fintech">Financial Services</option>
                    <option value="healthcare">Healthcare & Life Sciences</option>
                    <option value="saas">SaaS & Technology</option>
                    <option value="logistics">Logistics & Supply Chain</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans bg-white"
                  >
                    <option value="micro">1–10 employees</option>
                    <option value="small">11–50 employees</option>
                    <option value="medium">51–200 employees</option>
                    <option value="large">201–1000 employees</option>
                    <option value="enterprise">1000+ employees</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">AI Tools currently in use</label>
                  <select
                    value={aiToolCount}
                    onChange={(e) => setAiToolCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans bg-white"
                  >
                    <option value="0">None yet</option>
                    <option value="few">1–3 tools</option>
                    <option value="several">4–10 tools</option>
                    <option value="many">10+ tools</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-[#EAEAEA] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ml-auto"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-bold text-black tracking-tight">Connect AI Tools</h2>
                <p className="text-sm text-neutral-500">
                  Select the tools you currently use. Arxodyne will register and coordinate them as unified assets.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {INITIAL_AI_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`cursor-pointer rounded-md border p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected 
                          ? 'border-black bg-neutral-50 ring-1 ring-black' 
                          : 'border-[#EAEAEA] bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-9 h-9 flex items-center justify-center text-neutral-800">
                        <ToolLogo id={tool.id} className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-neutral-900 text-center line-clamp-1">
                        {tool.name}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected 
                          ? 'bg-black text-white' 
                          : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {isSelected ? 'SELECTED' : 'CONNECT'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-[#EAEAEA] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={selectedTools.length === 0}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ml-auto"
                >
                  Connect {selectedTools.length} Tool{selectedTools.length !== 1 ? 's' : ''} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-bold text-black tracking-tight">Set First Goal</h2>
                <p className="text-sm text-neutral-500">
                  Tell Arxodyne what outcome you want to achieve. In plain English.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">What should Arxodyne focus on?</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  placeholder='e.g. "Reduce customer support response time by 50%" or "Automate our weekly reporting pipeline"'
                  className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded focus:outline-none focus:border-black font-sans resize-none"
                />
                <span className="text-[11px] text-neutral-400 font-mono">Be specific about the outcome, not the process. Arxodyne figures out the process.</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Or choose a common goal template:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Reduce customer support response time by 50%',
                    'Automate our weekly reporting pipeline',
                    'Increase outbound lead velocity',
                    'Sync sales and customer service notes',
                    'Monitor database records for anomalies',
                  ].map((template) => (
                    <button
                      key={template}
                      onClick={() => setGoal(template)}
                      type="button"
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium rounded transition-colors text-left"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {goal.length >= 10 && (
                <div className="p-4 bg-neutral-50 border border-[#EAEAEA] rounded-md flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-black font-mono">
                    <Layers className="w-4 h-4 text-neutral-800" />
                    ARXODYNE OPERATIONAL MODEL PLAN
                  </div>
                  <ul className="text-xs text-neutral-600 list-disc list-inside space-y-1.5 font-mono">
                    <li>Compile and build custom agent nodes using selected models.</li>
                    <li>Route priority queues automatically between agents to optimize execution.</li>
                    <li>Maintain fully auditable decision tracks for transparency.</li>
                    <li>Trigger self-healing fallbacks if any API becomes slow or unresponsive.</li>
                  </ul>
                  <span className="text-[10px] text-neutral-400 italic">Adjust or override any of this from your command center dashboard.</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={prevStep}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-[#EAEAEA] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={goal.length < 10}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ml-auto"
                >
                  Activate Arxodyne <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-white border border-[#EAEAEA] rounded-md p-8 shadow-sm">
            <div className="flex flex-col gap-6 text-center items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-emerald-600 font-mono tracking-wider uppercase">ALL SYSTEMS ACTIVE</span>
                <h2 className="text-2xl font-bold text-black tracking-tight">Arxodyne is Online</h2>
                <p className="text-sm text-neutral-500 max-w-sm">
                  Your autonomous AI agents are compiled and connected. Your real-time operations dashboard is ready.
                </p>
              </div>

              <div className="w-full bg-neutral-50 border border-[#EAEAEA] rounded p-4 text-left font-mono text-xs flex flex-col gap-2.5">
                {[
                  { label: `Account for ${firstName || 'User'} created`, done: true },
                  { label: `${selectedTools.length} AI tools integrated`, done: true },
                  { label: `Goal: "${goal}" initialized`, done: true },
                  { label: 'Self-healing routing protocols online', done: true },
                  { label: 'Arxodyne dashboard engine loaded', done: true },
                ].map(({ label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-neutral-700">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLaunchDashboard}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Open Command Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white antialiased font-sans flex flex-col justify-center py-12 px-6">
      <div className="max-w-[500px] w-full mx-auto flex flex-col gap-6">
        
        {/* Onboarding Logo */}
        <div className="flex items-center justify-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-black text-white w-7 h-7 rounded flex items-center justify-center font-bold text-sm tracking-tight">
            AR
          </div>
          <span className="font-bold text-lg tracking-tight">Arxodyne Onboarding</span>
        </div>

        {/* Progress header bar */}
        <div className="bg-white border border-[#EAEAEA] rounded-md p-4 shadow-sm flex flex-col gap-2.5 font-mono text-xs text-neutral-500">
          <div className="flex justify-between items-center">
            <span>STEP {step} OF {totalSteps}</span>
            <span>{Math.round(progress)}% COMPLETE</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content card */}
        {renderStep()}
      </div>
    </div>
  );
}
