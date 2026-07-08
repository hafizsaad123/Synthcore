import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Terminal, Cpu, Target, Link, ShieldAlert, 
  ArrowRight, Code, HelpCircle, Check, Copy, ChevronRight, Play
} from 'lucide-react';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  tags: string[];
}

export default function Docs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState('intro');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Articles', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'get-started', label: 'Getting Started', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'agents', label: 'AI Helpers Setup', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'goals', label: 'Custom Business Goals', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'integrations', label: 'Connecting Tools', icon: <Link className="w-3.5 h-3.5" /> },
    { id: 'security', label: 'Safety & Approvals', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  ];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const articles: DocArticle[] = useMemo(() => [
    {
      id: 'intro',
      category: 'get-started',
      title: 'Introduction to Arxodyne',
      excerpt: 'Learn how to easily set up and run connected AI helpers.',
      tags: ['intro', 'philosophy', 'helpers'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            Arxodyne is a simple platform that helps you run and manage AI assistants to complete your business goals. Instead of having separate, disconnected bots, Arxodyne links your helpers together so they can share info and work as a single team.
          </p>
          <div className="my-6 p-5 bg-brand-beige border border-brand-sand rounded-2xl">
            <h4 className="font-bold text-xs text-brand-chocolate uppercase tracking-wider mb-3">The Arxodyne 3-Step Process</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white border border-brand-sand rounded-xl shadow-sm">
                <span className="text-xs font-bold text-brand-orange block mb-1">1. SET GOALS</span>
                <span className="text-xs text-brand-chocolate font-bold">Tell the AI what you want to achieve</span>
              </div>
              <div className="p-4 bg-white border border-brand-sand rounded-xl shadow-sm">
                <span className="text-xs font-bold text-brand-orange block mb-1">2. START HELPERS</span>
                <span className="text-xs text-brand-chocolate font-bold">Turn on specific AI assistants</span>
              </div>
              <div className="p-4 bg-white border border-brand-sand rounded-xl shadow-sm">
                <span className="text-xs font-bold text-brand-orange block mb-1">3. RUN TASKS</span>
                <span className="text-xs text-brand-chocolate font-bold">The assistants do the work automatically</span>
              </div>
            </div>
          </div>
          <h3 className="text-base font-extrabold text-brand-chocolate mt-6 mb-2">Key Ideas</h3>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <strong className="text-brand-chocolate">AI Assistant:</strong> A dedicated helper loaded with custom tools (like reading emails, researching sales, or checking security).
            </li>
            <li>
              <strong className="text-brand-chocolate">Goal:</strong> A simple, written instruction detailing exactly what you want the assistant to do.
            </li>
            <li>
              <strong className="text-brand-chocolate">Helper Action:</strong> A record of a task performed by your helper. If an action needs careful review, we pause and ask you to approve it first.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'quickstart',
      category: 'get-started',
      title: 'Quick Start: Booting Your First Helper',
      excerpt: 'Get your first AI assistant running in under 2 minutes.',
      tags: ['quickstart', 'setup', 'helper'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            This guide will show you how to start an AI assistant on your computer and connect it to your Arxodyne web dashboard.
          </p>
          
          <h3 className="text-sm font-bold text-brand-chocolate mt-4">Step 1: Install the Setup Tool</h3>
          <p>Run this simple command in your terminal or command prompt:</p>
          <div className="relative bg-brand-chocolate text-brand-cream rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <button 
              onClick={() => handleCopyCode('npm install -g @arxodyne/cli', 'cli-inst')}
              className="absolute top-3 right-3 text-brand-sand hover:text-white transition-colors"
              title="Copy code"
            >
              {copiedCode === 'cli-inst' ? <Check className="w-3.5 h-3.5 text-brand-orange" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-brand-sand select-none">$ </span>npm install -g @arxodyne/cli
          </div>

          <h3 className="text-sm font-bold text-brand-chocolate mt-6">Step 2: Connect to Your Dashboard</h3>
          <p>Link your computer using the secure workspace key found in your Settings page:</p>
          <div className="relative bg-brand-chocolate text-brand-cream rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <button 
              onClick={() => handleCopyCode('arxodyne login --token ax_live_839fhd902hj83', 'cli-auth')}
              className="absolute top-3 right-3 text-brand-sand hover:text-white transition-colors"
            >
              {copiedCode === 'cli-auth' ? <Check className="w-3.5 h-3.5 text-brand-orange" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-brand-sand select-none">$ </span>arxodyne login --token ax_live_839fhd902hj83
          </div>

          <h3 className="text-sm font-bold text-brand-chocolate mt-6">Step 3: Start the Assistant</h3>
          <p>Launch your helper to start sorting incoming emails and messages:</p>
          <div className="relative bg-brand-chocolate text-brand-cream rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <button 
              onClick={() => handleCopyCode('arxodyne assistants:start --type "inbox-sorting" --name "Inbox Helper"', 'cli-spawn')}
              className="absolute top-3 right-3 text-brand-sand hover:text-white transition-colors"
            >
              {copiedCode === 'cli-spawn' ? <Check className="w-3.5 h-3.5 text-brand-orange" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-brand-sand select-none">$ </span>arxodyne assistants:start --type "inbox-sorting" --name "Inbox Helper"
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold mt-4 flex items-center gap-2">
            <span>✓ Connected! Open your Arxodyne dashboard under "Helpers" to see your new helper online.</span>
          </div>
        </div>
      )
    },
    {
      id: 'agent-anatomy',
      category: 'agents',
      title: 'How an Assistant Thinks',
      excerpt: 'Understand how your AI assistants think, listen, and perform tasks.',
      tags: ['anatomy', 'how-it-works', 'thinking'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            Arxodyne assistants are smart and can handle multiple actions in a simple loop:
          </p>
          <div className="space-y-4 mt-4">
            <div className="border border-brand-sand p-4 rounded-xl bg-brand-beige">
              <h4 className="font-extrabold text-xs text-brand-chocolate mb-1.5">1. Trigger (When to start)</h4>
              <p className="text-xs text-brand-stone leading-relaxed">
                The assistant listens for specific events, such as a new email, a new database entry, a schedule timer, or a message in your Slack tool.
              </p>
            </div>
            <div className="border border-brand-sand p-4 rounded-xl bg-brand-beige">
              <h4 className="font-extrabold text-xs text-brand-chocolate mb-1.5">2. Goal Check (What rules to follow)</h4>
              <p className="text-xs text-brand-stone leading-relaxed">
                The assistant checks your active goals. For example, if your current goal is "Be polite to customers", the helper reviews its written emails to ensure they sound friendly before sending.
              </p>
            </div>
            <div className="border border-brand-sand p-4 rounded-xl bg-brand-beige">
              <h4 className="font-extrabold text-xs text-brand-chocolate mb-1.5">3. Tool Action (Getting the job done)</h4>
              <p className="text-xs text-brand-stone leading-relaxed">
                The assistant performs the task. If the assistant is not 100% sure about an action, it pauses, saves a draft, and asks for your approval on the dashboard.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goal-engineering',
      category: 'goals',
      title: 'How to Write Clear Goals',
      excerpt: 'Tips for writing instructions that help your AI team succeed.',
      tags: ['goals', 'instructions', 'tips'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            Since your AI assistants read your goals to understand what to do, writing clear, direct instructions is the best way to get great results.
          </p>
          <h3 className="text-sm font-bold text-brand-chocolate mt-4 mb-2">Good vs. Bad Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-red-900">
              <span className="font-extrabold block text-red-700 mb-1">❌ Bad Instruction</span>
              "Make customers happy and reply to messages."
              <p className="text-[11px] text-brand-stone mt-2 font-semibold">
                Why: Too generic. The assistant doesn't know how fast to reply or what tone to use.
              </p>
            </div>
            <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl text-emerald-900">
              <span className="font-extrabold block text-emerald-700 mb-1">✓ Good Instruction</span>
              "Reply to customer emails within 60 minutes, and send billing questions directly to our finance team."
              <p className="text-[11px] text-brand-stone mt-2 font-semibold">
                Why: Gives clear, measurable guidelines and tells the helper exactly where to send billing questions.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'webhook-integrations',
      category: 'integrations',
      title: 'Connecting Your Other Tools',
      excerpt: 'Learn how to send events from other websites into your Arxodyne account.',
      tags: ['tools', 'api', 'connect'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            You can easily trigger your AI assistants whenever something happens in your other business tools (like your sales system, customer list, or web forms).
          </p>
          <h3 className="text-sm font-bold text-brand-chocolate mt-4 mb-2">Example Event Data</h3>
          <p>Send a simple message format to your Arxodyne link:</p>
          <div className="relative bg-brand-chocolate text-brand-cream rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <button 
              onClick={() => handleCopyCode(`{
  "assistant_id": "sales_helper",
  "event_type": "new_lead_added",
  "data": {
    "email": "hello@customer.com",
    "notes": "Interested in standard pricing"
  }
}`, 'webhook-json')}
              className="absolute top-3 right-3 text-brand-sand hover:text-white transition-colors"
            >
              {copiedCode === 'webhook-json' ? <Check className="w-3.5 h-3.5 text-brand-orange" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="text-brand-orange">
{`{
  "assistant_id": "sales_helper",
  "event_type": "new_lead_added",
  "data": {
    "email": "hello@customer.com",
    "notes": "Interested in standard pricing"
  }
}`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'safety-gates',
      category: 'security',
      title: 'Setting Up Safety Approvals',
      excerpt: 'Keep control of important tasks by requiring your approval first.',
      tags: ['safety', 'approvals', 'control'],
      content: (
        <div className="space-y-4 text-brand-stone font-semibold">
          <p>
            When using automatic assistants, you might want to double-check important actions—like refunding money, changing settings, or emailing major clients—before they happen.
          </p>
          <p>
            Arxodyne has built-in Safety Approvals. You can choose when assistants can run automatically and when they must ask you first:
          </p>
          <div className="my-4 p-4 border border-brand-sand bg-brand-beige rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-sand font-bold">
              <span className="text-brand-chocolate">Safety Rules Table</span>
              <span className="text-emerald-600">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-brand-stone">
              <span className="font-bold text-brand-chocolate">Task type</span>
              <span className="font-bold text-brand-chocolate">How sure AI is</span>
              <span className="font-bold text-brand-chocolate text-right">Action taken</span>
              
              <span className="text-brand-chocolate">Simple tasks (like taking notes)</span>
              <span>&gt; 65% sure</span>
              <span className="text-emerald-600 text-right">Run automatically</span>

              <span className="text-brand-chocolate">Medium tasks (like draft emails)</span>
              <span>&gt; 85% sure</span>
              <span className="text-emerald-600 text-right">Run automatically</span>

              <span className="text-brand-chocolate font-bold">Important tasks (like refunds)</span>
              <span>Any level</span>
              <span className="text-brand-orange text-right font-bold">Wait for approval</span>
            </div>
          </div>
          <p className="text-xs text-brand-stone leading-relaxed">
            Whenever an assistant pauses for safety, a notification appears on your dashboard. You can review the details, click "Approve" to complete the task, or "Cancel" to stop it.
          </p>
        </div>
      )
    }
  ], [copiedCode]);

  // Search filtering logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const categoryMatch = activeCategory === 'all' || art.category === activeCategory;
      const searchMatch = searchQuery === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && searchMatch;
    });
  }, [articles, activeCategory, searchQuery]);

  // Find currently selected article
  const selectedArticle = useMemo(() => {
    return articles.find(art => art.id === selectedArticleId) || articles[0];
  }, [articles, selectedArticleId]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate">
              arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
            </span>
            <span className="text-[10px] border border-brand-sand px-2.5 py-0.5 rounded-full text-brand-stone font-bold uppercase bg-brand-beige">Docs</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-brand-stone font-bold">
            <button onClick={() => navigate('/')} className="hover:text-brand-orange transition-colors cursor-pointer">Home</button>
            <button onClick={() => navigate('/onboarding')} className="hover:text-brand-orange transition-colors cursor-pointer">Dashboard</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-150 shadow-md cursor-pointer"
            >
              Get Access
            </button>
          </div>
        </div>
      </header>

      {/* 2. DOCS CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Banner with search */}
        <div className="border border-brand-sand bg-white rounded-2xl p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">
              Documentation Hub
            </h1>
            <p className="text-xs text-brand-stone mt-1.5 font-semibold leading-relaxed">
              Find reference manuals, simple setup tips, goal writing best practices, and easy tool connections.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-stone" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, instructions..."
              className="w-full bg-brand-cream hover:bg-brand-beige border border-brand-sand rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-brand-sand hover:bg-brand-stone px-1.5 py-0.5 rounded text-brand-chocolate font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION: Lg 3cols */}
          <div className="lg:col-span-3 space-y-6 sticky top-24">
            
            {/* Category Filter Pills */}
            <div className="space-y-1 bg-white border border-brand-sand p-3 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-brand-stone uppercase px-2.5 block mb-2">
                Categories
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold transition-all duration-150 ${
                    activeCategory === cat.id
                      ? 'bg-brand-orange text-white'
                      : 'text-brand-stone hover:text-brand-chocolate hover:bg-brand-beige'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Article List Matching Filter */}
            <div className="space-y-1.5 bg-white border border-brand-sand p-3 rounded-2xl shadow-sm max-h-[300px] overflow-y-auto">
              <span className="text-[10px] font-bold tracking-wider text-brand-stone uppercase px-2.5 block mb-2">
                Articles ({filteredArticles.length})
              </span>
              {filteredArticles.length === 0 ? (
                <span className="text-xs text-brand-stone italic px-2.5 block py-1">No articles found</span>
              ) : (
                filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all duration-150 ${
                      selectedArticleId === art.id
                        ? 'bg-brand-beige text-brand-chocolate font-extrabold border-l-2 border-brand-orange rounded-l-none'
                        : 'text-brand-stone hover:text-brand-chocolate hover:bg-brand-cream font-bold'
                    }`}
                  >
                    <span className="truncate">{art.title}</span>
                    <ChevronRight className="w-3 h-3 opacity-30 shrink-0" />
                  </button>
                ))
              )}
            </div>

          </div>

          {/* ACTIVE ARTICLE VIEW: Lg 9cols */}
          <div className="lg:col-span-9 bg-white border border-brand-sand rounded-2xl p-8 md:p-10 shadow-sm min-h-[500px]">
            
            {/* Header info */}
            <div className="border-b border-brand-sand pb-6 mb-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-stone uppercase tracking-widest">
                <span>{selectedArticle.category.replace('-', ' ')}</span>
                <span>•</span>
                <span>Simple & Safe</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-brand-chocolate mt-2 tracking-tight">
                {selectedArticle.title}
              </h2>
              <p className="text-sm text-brand-stone mt-2 font-semibold leading-relaxed">
                {selectedArticle.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-4">
                {selectedArticle.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-brand-beige text-brand-stone text-[10px] font-bold rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Content Render */}
            <div className="text-sm leading-relaxed text-brand-stone">
              {selectedArticle.content}
            </div>

            {/* Pagination helper block */}
            <div className="border-t border-brand-sand pt-8 mt-12 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-brand-stone block font-sans">STILL NEED HELP?</span>
                <span className="text-xs text-brand-chocolate font-bold mt-1 block">Go to your dashboard control panel:</span>
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-brand-sand bg-white py-8 text-xs text-brand-stone mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <span>© 2026 Arxodyne Technologies, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/terms')}>Terms of Service</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/')}>Home</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
