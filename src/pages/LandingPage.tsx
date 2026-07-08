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
  X,
  Laptop,
  Code,
  Globe,
  Star,
  Users,
  Layers,
  Database,
  Search,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  // active tab state for the Interactive Toolkit section
  const [activeToolkitTab, setActiveToolkitTab] = useState<'workflows' | 'agents' | 'chatbots' | 'tables'>('workflows');

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
      name: 'Starter Plan',
      badgeLeft: 'FOR STARTERS',
      badgeRight: 'FREE',
      price: 'Free',
      originalPrice: '$99',
      discountBadge: 'SAVE 100%',
      cta: 'Start for Free',
      featured: false,
      iconType: 'laptop',
      subtitle: 'Perfect to try out connected AI helpers on your own computer.',
      highlight: 'Get all future updates · Forever free access',
      features: [
        'Run up to 5 AI helpers',
        'Set up 2 business goals',
        'Regular automatic tasks',
        'Help desk support email',
        'Saves data on your computer',
        'Easy-to-use web dashboard',
      ],
      bestFor: ['Students', 'Tinkerers', 'Solo Creators']
    },
    {
      name: 'Growth Plan',
      badgeLeft: 'FOR TEAMS',
      badgeRight: 'POPULAR',
      price: '$499',
      originalPrice: '$849',
      discountBadge: 'SAVE 41%',
      cta: 'Get Started Now',
      featured: true,
      iconType: 'code',
      subtitle: 'Full power for growing teams to run safe, automatic AI helpers in the cloud.',
      highlight: 'Includes all newer features · 99.9% uptime promise',
      features: [
        'Run up to 25 AI helpers',
        'Unlimited custom goals',
        'Faster task completion',
        '1-hour support reply time',
        'Connect with other tools',
        'Secure online cloud database',
      ],
      bestFor: ['Growing Startups', 'AI Creators', 'Product Teams']
    },
    {
      name: 'Enterprise Plan',
      badgeLeft: 'FOR BUSINESS',
      badgeRight: 'CUSTOM',
      price: '$1,499',
      originalPrice: '$2,499',
      discountBadge: 'SAVE 40%',
      cta: 'Contact Sales',
      featured: false,
      iconType: 'globe',
      subtitle: 'Custom setup and branding made for large companies and agencies.',
      highlight: 'Includes custom agreements · Personal setup help',
      features: [
        'Unlimited AI helpers',
        'Use your own AI system',
        'Instant task starting',
        'Your own personal support person',
        'Use your own company logo',
        'We set everything up for you',
      ],
      bestFor: ['Large Corporations', 'Agencies', 'SaaS Owners']
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans">
      
      {/* 1.1 NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate flex items-center">
              arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
            </span>
          </div>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-brand-stone font-semibold">
            <button onClick={() => document.getElementById('why-arxodyne')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange transition-colors cursor-pointer">Why Arxodyne</button>
            <button onClick={() => document.getElementById('features-mesh')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange transition-colors cursor-pointer">Features</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange transition-colors cursor-pointer">How it works</button>
            <button onClick={() => document.getElementById('pricing-grid')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => navigate('/docs')} className="hover:text-brand-orange transition-colors cursor-pointer">Docs</button>
            <button onClick={() => navigate('/status')} className="hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1.5 bg-brand-sand px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Status
            </button>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/onboarding', { state: { mode: 'signin' } })}
              className="hover:text-brand-orange text-sm font-semibold px-4 py-2.5 transition-all duration-150 cursor-pointer text-brand-chocolate"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-150 shadow-md active:scale-98 cursor-pointer"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      {/* 1.2 HERO SECTION (Zapier style hero with huge friendly headings & orange buttons) */}
      <section className="relative overflow-hidden bg-brand-cream pt-16 pb-24 md:pt-24 md:pb-32 border-b border-brand-sand">
        <div className="absolute inset-0 bg-[radial-gradient(#e9e2d7_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-sand bg-brand-beige text-xs text-brand-stone font-semibold mb-8 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
            AI AUTOMATION, GOVERNED & SECURE
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tight text-brand-chocolate max-w-5xl leading-[1.05] mb-8">
            Your tools. <span className="text-brand-stone">Your rules.</span> <span className="text-brand-orange">Any AI.</span>
          </h1>

          <p className="text-brand-stone text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            Arxodyne gives teams one secure place to set guardrails, manage model access, and coordinate automated AI agents—so everyone can automate confidently, on any model, without waiting for permission.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12 max-w-lg">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-white text-base font-bold px-8 py-4 rounded-full transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl active:scale-98"
            >
              Start free with email <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/onboarding', { state: { mode: 'signin' } })}
              className="w-full sm:w-auto bg-white border border-brand-sand hover:bg-brand-beige text-brand-chocolate text-base font-bold px-8 py-4 rounded-full transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Start with Google
            </button>
          </div>

          {/* Quick stats / Credential Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-brand-stone uppercase tracking-wider mb-14 bg-brand-sand/50 px-8 py-3.5 rounded-full border border-brand-sand">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-brand-orange fill-brand-orange" /> 450K+ AI AGENTS BUILT</span>
            <span className="hidden sm:inline text-brand-sand">•</span>
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-brand-orange" /> 9,000+ App Integrations</span>
            <span className="hidden sm:inline text-brand-sand">•</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-brand-orange" /> SOC 2 TYPE II COMPLIANT</span>
          </div>
        </div>
      </section>

      {/* 1.3 BUILDERS QUICK START LAUNCHPAD */}
      <section className="bg-brand-beige py-12 border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-brand-stone tracking-wider uppercase mb-6">FOR BUILDERS. CHOOSE YOUR BASE ENVIRONMENT AND GET STARTED SECONDS:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Claude', 'ChatGPT', 'Gemini', 'Llama 3.1', 'Mistral Large', 'DeepSeek', 'Custom Node API'].map((model) => (
              <button 
                key={model}
                onClick={() => navigate('/onboarding')}
                className="bg-white border border-brand-sand hover:border-brand-orange px-5 py-3 rounded-xl text-xs font-semibold text-brand-chocolate transition-all hover:shadow-md cursor-pointer flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {model}
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-stone group-hover:text-brand-orange transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 1.4 TRUST BAR */}
      <section className="py-14 bg-brand-cream border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-brand-stone tracking-wider uppercase mb-8">TRUSTED BY TEAMS AT THE WORLD'S MOST FORWARD-THINKING COMPANIES</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            <span className="font-display font-extrabold text-lg text-brand-chocolate tracking-wider">NVIDIA</span>
            <span className="font-display font-black text-xl text-brand-chocolate tracking-tight">META</span>
            <span className="font-display font-semibold text-lg text-brand-chocolate">CANVA</span>
            <span className="font-display font-bold text-xl text-brand-chocolate tracking-tighter">SAMSUNG</span>
            <span className="font-display font-extrabold text-base text-brand-chocolate uppercase tracking-widest">OKTA</span>
            <span className="font-display font-medium text-lg text-brand-chocolate">DROPBOX</span>
          </div>
        </div>
      </section>

      {/* 1.5 WHY ARXODYNE SECTION */}
      <section id="why-arxodyne" className="py-24 bg-brand-cream border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-brand-orange text-xs font-extrabold uppercase tracking-widest block mb-3">EVERY TEAM HAS AI</span>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-brand-chocolate tracking-tight mb-6">
              Every team has AI.<br />Now they need a <span className="text-brand-orange underline decoration-wavy decoration-2">system.</span>
            </h2>
            <p className="text-brand-stone text-base leading-relaxed">
              Your teams are independently connecting random AI tools to business databases. Each one works great alone. The question is whether they work together—safely, visibly, and without crashing.
            </p>
          </div>

          {/* Zapier-style 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-brand-beige border border-brand-sand p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-chocolate mb-4">Connect any AI model to 9,000+ apps</h3>
                <p className="text-sm text-brand-stone leading-relaxed mb-6">
                  Plug Anthropic, OpenAI, or Google models directly into your company systems. Arxodyne coordinates credentials and manages automated API triggers autonomously.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-brand-sand flex items-center justify-between text-xs font-semibold text-brand-chocolate">
                <span className="flex items-center gap-2"><Database className="w-4 h-4 text-brand-stone" /> Hubspot integration connected</span>
                <span className="text-brand-orange text-xs">Active</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-brand-beige border border-brand-sand p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-chocolate mb-4">AI agents that execute deep workflows</h3>
                <p className="text-sm text-brand-stone leading-relaxed mb-6">
                  Establish natural-language objectives and watch Arxodyne analyze resources, schedule multi-step tool calls, and auto-recover if any agent experiences lag.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-brand-sand flex items-center justify-between text-xs font-semibold text-brand-chocolate">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Completed task: Generate PDF Briefing</span>
                <span className="text-emerald-600 text-xs font-mono font-bold">100% SUCCESS</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-brand-beige border border-brand-sand p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-chocolate mb-4">Every user under one central admin roof</h3>
                <p className="text-sm text-brand-stone leading-relaxed mb-6">
                  Empower engineering, marketing, and sales agents while maintaining complete visibility over API usage thresholds, total budget run-rates, and security limits.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-brand-sand flex items-center justify-between text-xs font-semibold text-brand-chocolate">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-brand-stone" /> Active workspace users: 24</span>
                <span className="text-brand-stone text-xs font-mono">Limit: Unlimited</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-brand-beige border border-brand-sand p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-chocolate mb-4">Instant system compliance and logging</h3>
                <p className="text-sm text-brand-stone leading-relaxed mb-6">
                  Get full real-time logs of every model change, system error, or authentication bypass. Safe-keeping auditing built natively into the platform core.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-brand-sand flex items-center justify-between text-xs font-semibold text-brand-chocolate">
                <span className="flex items-center gap-2 font-mono text-[10px]"><Terminal className="w-4 h-4 text-brand-orange" /> Log // Model changed: Claude-3.5 to Gemini-1.5</span>
                <span className="text-brand-stone text-[10px] font-mono">14ms ago</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.6 ARXODYNE MCP & SDK SHOWCASE */}
      <section className="py-24 bg-brand-beige border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="flex flex-col gap-6">
              <span className="text-brand-orange text-xs font-extrabold uppercase tracking-widest">SECURE DATA INTERFACE</span>
              <h3 className="text-3xl md:text-5xl font-display font-extrabold text-brand-chocolate tracking-tight leading-tight">
                Arxodyne MCP + Arxodyne SDK.<br />One connection.
              </h3>
              <p className="text-brand-stone text-base leading-relaxed">
                Connect your AI workflows with secure, standard data tunnels. Developers integrate via standard API keys, and coding agents utilize our fast TypeScript SDK, while security administrators see everything in one centralized compliance log.
              </p>

              <div className="space-y-4 text-sm text-brand-chocolate font-semibold mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-sand flex items-center justify-center"><Check className="w-4 h-4 text-brand-orange" /></div>
                  <span>Universal authentication for all connected apps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-sand flex items-center justify-center"><Check className="w-4 h-4 text-brand-orange" /></div>
                  <span>Real-time billing constraints and threshold warnings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-sand flex items-center justify-center"><Check className="w-4 h-4 text-brand-orange" /></div>
                  <span>Failover redundancy to guarantee 99.9% agent uptime</span>
                </div>
              </div>
            </div>

            {/* Visual Diagram Box */}
            <div className="bg-brand-cream border border-brand-sand rounded-2xl p-8 shadow-md">
              <div className="border-b border-brand-sand pb-4 mb-6 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-chocolate font-mono">ARXODYNE MODEL ROUTER MESH</span>
                <span className="px-2 py-0.5 bg-brand-sand rounded text-[10px] font-mono font-bold text-brand-stone">v1.4.2</span>
              </div>

              {/* Diagram */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="bg-white p-3 rounded-xl border border-brand-sand text-xs font-bold w-1/3 text-center">Claude / GPT</div>
                  <div className="text-brand-stone text-xs">➔</div>
                  <div className="bg-brand-orange text-white p-3.5 rounded-xl text-xs font-bold w-1/3 text-center shadow-md">Arxodyne MCP</div>
                  <div className="text-brand-stone text-xs">➔</div>
                  <div className="bg-white p-3 rounded-xl border border-brand-sand text-xs font-bold w-1/3 text-center">Slack / Gmail</div>
                </div>

                <div className="h-4 border-l-2 border-dashed border-brand-sand ml-1/2"></div>

                <div className="flex items-center justify-between gap-4">
                  <div className="bg-white p-3 rounded-xl border border-brand-sand text-xs font-bold w-1/3 text-center">SDK Developer</div>
                  <div className="text-brand-stone text-xs">➔</div>
                  <div className="bg-brand-orange text-white p-3.5 rounded-xl text-xs font-bold w-1/3 text-center shadow-md">Arxodyne SDK</div>
                  <div className="text-brand-stone text-xs">➔</div>
                  <div className="bg-white p-3 rounded-xl border border-brand-sand text-xs font-bold w-1/3 text-center">Salesforce / S3</div>
                </div>
              </div>

              {/* Logs display */}
              <div className="bg-brand-beige border border-brand-sand rounded-xl p-4 mt-8">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-brand-stone">
                  <Terminal className="w-4 h-4 text-brand-orange" />
                  <span>INTELLIGENT TELEMETRY</span>
                </div>
                <div className="font-mono text-[10px] text-brand-stone space-y-1">
                  <div>[08:14:22] <span className="text-brand-orange">SYSTEM_OK</span> Initialized auth handshake for Slack</div>
                  <div>[08:14:23] <span className="text-brand-orange">GOAL_SYNC</span> Processing objective threshold audit...</div>
                  <div>[08:14:25] <span className="text-emerald-600">ROUTER</span> Rerouted lagging task node to Gemini-1.5-Pro</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.7 INTERACTIVE TOOLKIT SELECTOR */}
      <section className="py-24 bg-brand-cream border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-extrabold text-brand-chocolate tracking-tight mb-4">Your complete AI toolkit</h2>
            <p className="text-brand-stone text-sm font-semibold">Deploy connected tools, agents, and custom chatbots in minutes, not months.</p>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 border-b border-brand-sand pb-6">
            {[
              { id: 'workflows', label: 'AI Workflows', icon: Zap },
              { id: 'agents', label: 'AI Agents', icon: Cpu },
              { id: 'chatbots', label: 'AI Chatbots', icon: MessageSquare },
              { id: 'tables', label: 'Intelligent Tables', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeToolkitTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveToolkitTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-orange text-white shadow-md' 
                      : 'bg-white border border-brand-sand text-brand-chocolate hover:bg-brand-beige'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content screenshot showcase */}
          <div className="bg-brand-beige border border-brand-sand rounded-2xl p-6 md:p-10 shadow-sm">
            {activeToolkitTab === 'workflows' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-display font-bold text-brand-chocolate mb-2">Automate complex tasks step-by-step</h4>
                    <p className="text-sm text-brand-stone max-w-xl">Create custom conditional logic, schedules, and loops. Feed task data into your workspace and let Arxodyne route inputs to the ideal LLM.</p>
                  </div>
                  <button onClick={() => navigate('/onboarding')} className="bg-brand-chocolate text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-brand-cocoa transition-colors">Start Building Workflows</button>
                </div>
                <div className="bg-white rounded-xl border border-brand-sand p-6 font-mono text-xs text-brand-stone space-y-4">
                  <div className="flex items-center gap-3 bg-brand-beige p-3 rounded-lg border border-brand-sand">
                    <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span className="font-semibold text-brand-chocolate">TRIGGER:</span> New inbound email received in Customer Desk
                  </div>
                  <div className="h-4 border-l-2 border-brand-sand ml-6"></div>
                  <div className="flex items-center gap-3 bg-brand-beige p-3 rounded-lg border border-brand-sand">
                    <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="font-semibold text-brand-chocolate">ACTION (AI PART):</span> Analyze intent with Claude-3-Haiku & label priority
                  </div>
                  <div className="h-4 border-l-2 border-brand-sand ml-6"></div>
                  <div className="flex items-center gap-3 bg-brand-beige p-3 rounded-lg border border-brand-sand">
                    <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="font-semibold text-brand-chocolate">ACTION:</span> Log ticket details in Hubspot and draft reply draft
                  </div>
                </div>
              </div>
            )}

            {activeToolkitTab === 'agents' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-display font-bold text-brand-chocolate mb-2">Autonomous agents that operate 24/7</h4>
                    <p className="text-sm text-brand-stone max-w-xl">Set strategic objectives and watch Arxodyne's agent fleet research databases, compile code, execute file audits, and ping you when goals are met.</p>
                  </div>
                  <button onClick={() => navigate('/onboarding')} className="bg-brand-chocolate text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-brand-cocoa transition-colors">Deploy an Agent Node</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-brand-sand rounded-xl p-5">
                    <span className="text-[10px] font-mono font-bold text-brand-orange block mb-2">ACTIVE AGENT: RESEARCH_BOT_04</span>
                    <p className="text-sm font-semibold text-brand-chocolate mb-1">Weekly competitor audit</p>
                    <p className="text-xs text-brand-stone">Browsing web, analyzing pricing changes, and compiling a secure Google Sheet breakdown.</p>
                  </div>
                  <div className="bg-white border border-brand-sand rounded-xl p-5">
                    <span className="text-[10px] font-mono font-bold text-brand-orange block mb-2">ACTIVE AGENT: INBOUND_LEAD_BOT</span>
                    <p className="text-sm font-semibold text-brand-chocolate mb-1">Qualify inbound contacts</p>
                    <p className="text-xs text-brand-stone">Checking corporate LinkedIn pages, appending sizing parameters, and forwarding high-priority leads to Slack.</p>
                  </div>
                </div>
              </div>
            )}

            {activeToolkitTab === 'chatbots' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-display font-bold text-brand-chocolate mb-2">Deploy custom internal & external chatbots</h4>
                    <p className="text-sm text-brand-stone max-w-xl">Create helpful chatbots trained on your internal wiki documents. Integrate them on Slack, Teams, or embed them directly on your company website.</p>
                  </div>
                  <button onClick={() => navigate('/onboarding')} className="bg-brand-chocolate text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-brand-cocoa transition-colors">Build a Chatbot</button>
                </div>
                <div className="bg-white rounded-xl border border-brand-sand p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center text-xs font-bold text-brand-chocolate">U</div>
                    <div className="bg-brand-beige p-3 rounded-xl border border-brand-sand text-xs text-brand-chocolate max-w-md">
                      How do I submit an expense report for our team software subscriptions?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-brand-orange/5 p-3 rounded-xl border border-brand-orange/20 text-xs text-brand-chocolate max-w-md text-right">
                      According to our corporate policy handbook, software subscriptions under $500/month should be routed via Expensify under "Category: IT Services". I've pulled the direct form link for you here: <span className="text-brand-orange underline">expensify.com/submit</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-bold">A</div>
                  </div>
                </div>
              </div>
            )}

            {activeToolkitTab === 'tables' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-display font-bold text-brand-chocolate mb-2">Smart databases designed for AI pipelines</h4>
                    <p className="text-sm text-brand-stone max-w-xl">Structured, light tables that let humans and AI agents write, edit, and read data simultaneously. Features automated row triggers.</p>
                  </div>
                  <button onClick={() => navigate('/onboarding')} className="bg-brand-chocolate text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-brand-cocoa transition-colors">Create Smart Table</button>
                </div>
                <div className="bg-white rounded-xl border border-brand-sand overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-brand-beige border-b border-brand-sand text-brand-stone font-semibold">
                      <tr>
                        <th className="p-3">ROW ID</th>
                        <th className="p-3">COMPANY NAME</th>
                        <th className="p-3">OBJECTIVE PROMPT</th>
                        <th className="p-3 text-right">AGENT ASSIGNED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-sand text-brand-chocolate">
                      <tr>
                        <td className="p-3 font-mono text-[10px]">#9022</td>
                        <td className="p-3 font-bold">Acme Global Technologies</td>
                        <td className="p-3">Analyze Q3 billing and find waste</td>
                        <td className="p-3 text-right text-brand-orange font-semibold">BillingBot-01</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[10px]">#9023</td>
                        <td className="p-3 font-bold">VentureScale Partners</td>
                        <td className="p-3">Draft reply emails for high-value leads</td>
                        <td className="p-3 text-right text-brand-orange font-semibold">SupportAI-03</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1.8 CUSTOMER QUOTE SECTION */}
      <section className="py-24 bg-brand-beige border-b border-brand-sand">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-brand-orange text-xs font-extrabold uppercase tracking-widest block mb-4">SUCCESS STORY</span>
          <p className="text-2xl md:text-3xl font-display font-medium text-brand-chocolate leading-relaxed mb-8">
            "Arxodyne has become a critical part of our company's intelligence backbone. When we can safely coordinate agent behaviors and connect models with zero friction, we can resolve stakeholder workflows in hours, not months."
          </p>
          <p className="font-display font-bold text-brand-chocolate">Nina Mirabella</p>
          <p className="text-xs text-brand-stone uppercase font-bold mt-1">Senior Director of AI Operations, Superhuman</p>
          
          <div className="flex items-center justify-center gap-8 mt-8 opacity-60">
            <span className="text-xs font-mono font-bold">✓ 42+ HOURS SAVED PER WEEK</span>
            <span className="text-xs font-mono font-bold">✓ 87% REDUCTION IN WORKFLOW ERRORS</span>
          </div>
        </div>
      </section>

      {/* 1.9 NO HYPE METRICS */}
      <section className="py-24 bg-brand-cream border-b border-brand-sand text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold text-brand-stone tracking-wider uppercase mb-3">NO AI HYPE HERE. JUST REAL RESULTS.</p>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold text-brand-chocolate tracking-tight mb-8">
            593,138,974
          </h2>
          <p className="text-brand-stone text-base font-semibold max-w-md mx-auto mb-10">AI tasks governed, automated, and securely orchestrated on Arxodyne (and counting)</p>
          <button onClick={() => navigate('/onboarding')} className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer">
            Join the Arxodyne network free
          </button>
        </div>
      </section>

      {/* 1.10 PRICING SECTION (Same card layout, updated with custom Zapier beige styling & orange CTAs) */}
      <section id="pricing-grid" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-orange text-xs font-extrabold uppercase tracking-widest block mb-3">GRID PRICING</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-brand-chocolate tracking-tight mb-4">Transparent Grid Pricing</h2>
          <p className="text-brand-stone max-w-2xl mx-auto text-sm font-semibold">
            Configure your autonomous AI network with clear tier-based metrics and zero execution premiums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const renderIcon = () => {
              const iconClass = "w-4 h-4 shrink-0 text-brand-orange";
              if (plan.iconType === 'laptop') return <Laptop className={iconClass} />;
              if (plan.iconType === 'code') return <Code className={iconClass} />;
              return <Globe className={iconClass} />;
            };

            return (
              <div 
                key={plan.name} 
                className={`flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-200 border-2 relative group ${
                  plan.featured 
                    ? 'border-brand-orange bg-white shadow-lg' 
                    : 'border-brand-sand bg-white hover:border-brand-stone shadow-sm'
                }`}
              >
                {/* Visual Arrow indicator for MOST POPULAR styled beautifully in Zapier orange */}
                {plan.featured && (
                  <div className="absolute top-4 right-5 flex items-center gap-1.5 text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full">
                    <span className="text-[9px] font-sans font-extrabold uppercase tracking-wider">MOST POPULAR</span>
                    <Sparkles className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  </div>
                )}

                {/* Top Block */}
                <div className="p-8 pb-6 bg-brand-beige border-b border-brand-sand">
                  
                  {/* Top Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border-2 ${
                      plan.featured 
                        ? 'bg-brand-orange text-white border-brand-orange' 
                        : 'bg-white text-brand-stone border-brand-sand'
                    }`}>
                      {renderIcon()}
                      {plan.badgeLeft}
                    </div>

                    <div className="bg-white text-brand-stone border border-brand-sand text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      {plan.badgeRight}
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-baseline flex-wrap gap-2 mt-4">
                    <span className="text-4xl font-display font-extrabold text-brand-chocolate tracking-tight">{plan.price}</span>
                    <span className="line-through text-brand-stone text-base font-medium ml-1.5 font-mono">
                      {plan.originalPrice}
                    </span>
                    <span className="bg-brand-sand text-brand-chocolate border border-brand-sand text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ml-1">
                      {plan.discountBadge}
                    </span>
                  </div>

                  <p className="text-xs text-brand-stone leading-relaxed mt-4 h-10 font-medium">
                    {plan.subtitle}
                  </p>

                  <div className="mt-5 pt-4 border-t border-brand-sand flex items-center gap-2 text-[11px] text-brand-chocolate font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-sm animate-pulse"></span>
                    <span className="truncate">{plan.highlight}</span>
                  </div>
                </div>

                {/* Bottom block: WHAT YOU GET list + BEST FOR tags */}
                <div className="p-8 pt-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-[10px] font-sans font-extrabold tracking-wider text-brand-stone uppercase mb-4 block">
                      WHAT YOU GET:
                    </span>

                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-brand-chocolate">
                          <div className="w-5 h-5 rounded-full border border-brand-sand bg-brand-beige flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-brand-orange stroke-[3]" />
                          </div>
                          <span className="text-xs font-semibold tracking-tight text-brand-stone">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-brand-sand pt-4 mb-6">
                      <span className="text-[10px] font-sans font-extrabold tracking-wider text-brand-stone uppercase mb-3 block">
                        BEST FOR:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.bestFor.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2.5 py-1 bg-brand-beige text-brand-chocolate border border-brand-sand rounded-full text-[10px] font-bold tracking-tight hover:bg-brand-sand transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Call to action button matching the layout but beautifully styled with orange accent */}
                  <button
                    onClick={() => navigate('/onboarding')}
                    className={`flex items-center justify-between w-full px-5 py-3.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all duration-150 cursor-pointer group active:scale-[0.98] ${
                      plan.featured
                        ? 'bg-brand-orange hover:bg-brand-orange-hover text-white border border-brand-orange shadow-md'
                        : 'bg-white hover:bg-brand-beige text-brand-chocolate border-2 border-brand-sand'
                    }`}
                  >
                    <span className="font-sans font-extrabold">{plan.cta}</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      plan.featured
                        ? 'bg-white text-brand-orange'
                        : 'bg-brand-orange text-white'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 1.11 FOOTER */}
      <footer className="border-t border-brand-sand bg-brand-beige py-16 text-sm text-brand-stone">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate">
                arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
              </span>
            </div>
            <p className="text-xs text-brand-stone leading-relaxed max-w-xs">
              The enterprise-grade operating system designed to securely connect, govern, and orchestrate automated AI workflows on any cloud model.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-chocolate uppercase tracking-widest mb-4">Product</h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <span onClick={() => document.getElementById('why-arxodyne')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange cursor-pointer transition-colors">Why Arxodyne</span>
              <span onClick={() => document.getElementById('features-mesh')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange cursor-pointer transition-colors">Features</span>
              <span onClick={() => document.getElementById('pricing-grid')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-orange cursor-pointer transition-colors">Pricing</span>
              <span onClick={() => navigate('/status')} className="hover:text-brand-orange cursor-pointer transition-colors">Redundancy Status</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-chocolate uppercase tracking-widest mb-4">Resources</h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <span onClick={() => navigate('/docs')} className="hover:text-brand-orange cursor-pointer transition-colors">Documentation</span>
              <span onClick={() => navigate('/docs')} className="hover:text-brand-orange cursor-pointer transition-colors">API References</span>
              <span onClick={() => navigate('/docs')} className="hover:text-brand-orange cursor-pointer transition-colors">System SDK</span>
              <span onClick={() => navigate('/docs')} className="hover:text-brand-orange cursor-pointer transition-colors">Model Support List</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-chocolate uppercase tracking-widest mb-4">Compliance & Trust</h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <span onClick={() => navigate('/privacy')} className="hover:text-brand-orange cursor-pointer transition-colors">Privacy Policy</span>
              <span onClick={() => navigate('/terms')} className="hover:text-brand-orange cursor-pointer transition-colors">Terms of Service</span>
              <span onClick={() => navigate('/status')} className="hover:text-brand-orange cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Status (SOC 2)
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-brand-sand pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-semibold text-brand-stone">
            © 2026 Arxodyne Technologies, Inc. All rights reserved. Zapier is a trademark of Zapier, Inc. This application is inspired by Zapier's design language.
          </div>

          <div className="font-mono text-[11px] text-brand-stone flex items-center gap-1.5">
            SECURE PORTAL OVERRIDE:
            <button
              onClick={() => {
                setIsAdminModalOpen(true);
                setAdminEmail('');
                setAdminPasscode('');
                setAdminError('');
              }}
              className="p-1.5 bg-brand-sand hover:bg-brand-orange hover:text-white transition-all cursor-pointer rounded-full"
              title="Secure Gateway"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* SECURE ADMIN GATEWAY MODAL OVERLAY */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-chocolate/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-brand-cream border border-brand-sand rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 text-left"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-sand bg-brand-beige flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-chocolate">
                <Lock className="w-5 h-5 text-brand-orange" />
                <h3 className="font-display font-bold text-lg tracking-tight">Secure Admin Gateway</h3>
              </div>
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1.5 hover:bg-brand-sand rounded-full text-brand-stone hover:text-brand-chocolate transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAdminAccess} className="p-6 flex flex-col gap-4">
              <p className="text-xs text-brand-stone leading-relaxed">
                Unauthorized access is strictly prohibited. Enter authorized administrator credentials to establish a secure root override session.
              </p>

              {adminError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-mono font-medium leading-normal">
                  ⚠️ {adminError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@arxodyne.com"
                  className="w-full bg-white border border-brand-sand rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-stone uppercase tracking-wider">Security Passcode</label>
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-brand-sand rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Establish Root Override <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="px-6 py-4 bg-brand-beige border-t border-brand-sand text-center">
              <span className="text-[10px] font-mono text-brand-stone">
                IP logged · Encrypted v2 Session
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
