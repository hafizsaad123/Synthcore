import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('data-collection');

  const sections = [
    { id: 'data-collection', label: '1. What We Collect' },
    { id: 'data-use', label: '2. How We Use It' },
    { id: 'agent-telemetry', label: '3. AI Assistant & Activity Logs' },
    { id: 'data-sharing', label: '4. Sharing & Protecting Your Data' },
    { id: 'user-rights', label: '5. Your Rights & Choices' },
    { id: 'retention', label: '6. Saving & Deleting Your Data' },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans">
      {/* HEADER Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-sand">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-display font-extrabold text-2xl tracking-tight text-brand-chocolate">
              arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-3xl leading-none -mt-1">*</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-brand-stone hover:text-brand-orange transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        {/* Top Header Panel */}
        <div className="border border-brand-sand bg-white rounded-2xl p-8 md:p-10 mb-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3 text-brand-stone font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-brand-orange" /> Safety & Trust Center
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-chocolate">
                Privacy Policy
              </h1>
              <p className="text-sm text-brand-stone mt-2 font-semibold">
                Last updated: July 8, 2026 • Simple & Clear Version
              </p>
            </div>
            <div className="flex items-center gap-4 bg-brand-beige border border-brand-sand p-4 rounded-xl self-start">
              <div className="p-2.5 bg-brand-orange rounded-xl text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-brand-chocolate">Your Privacy First</div>
                <div className="text-[10px] text-brand-stone font-semibold">Fully Protected & Secure</div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout split */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Side navigation anchor links */}
          <aside className="w-full lg:w-64 shrink-0 sticky top-24 space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-brand-stone uppercase px-3 block mb-3">
              Sections
            </span>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-150 ${
                  activeSection === section.id
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-brand-stone hover:text-brand-chocolate hover:bg-brand-beige'
                }`}
              >
                <span>{section.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${activeSection === section.id ? 'opacity-100 text-white' : ''}`} />
              </button>
            ))}
            <div className="pt-6 mt-6 border-t border-brand-sand px-3">
              <h4 className="text-xs font-bold text-brand-chocolate mb-2">Have a question?</h4>
              <p className="text-[11px] text-brand-stone leading-relaxed mb-3 font-semibold">
                If you want to ask about your data, write to our friendly support team.
              </p>
              <a
                href="mailto:support@arxodyne.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline"
              >
                support@arxodyne.com <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* Policy Text Body */}
          <div className="flex-1 bg-white border border-brand-sand rounded-2xl p-8 md:p-10 shadow-sm space-y-10 text-sm text-brand-stone leading-relaxed font-semibold">
            
            {/* Section 1 */}
            <section id="data-collection" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Eye className="w-5 h-5 text-brand-orange" />
                <h2>1. What We Collect</h2>
              </div>
              <p>
                At Arxodyne, we make our AI assistant tool easy and safe. We only keep the information needed to run your account, save your settings, and connect your AI helpers:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong className="text-brand-chocolate">Account Details:</strong> Your email, your name, your company name, and secure login passwords.
                </li>
                <li>
                  <strong className="text-brand-chocolate">Your Goals:</strong> The business goals and instructions you write for your AI assistants.
                </li>
                <li>
                  <strong className="text-brand-chocolate">Helper Settings:</strong> How you set up your AI assistants and any connection passwords you link (like Slack keys).
                </li>
                <li>
                  <strong className="text-brand-chocolate">Activity Logs:</strong> Simple info on when your AI helpers run, how long they take, and if they succeeded.
                </li>
              </ul>
              <p className="bg-brand-beige border border-brand-sand p-4 rounded-xl text-xs text-brand-stone font-semibold">
                🛡️ Arxodyne does not look at or save any confidential details sent through other apps. All connection passwords you enter are locked safely with standard cloud security locks.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-use" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                <h2>2. How We Use It</h2>
              </div>
              <p>
                We only use your information to run your helpers and improve our website:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="border border-brand-sand p-4 rounded-xl bg-brand-beige">
                  <h4 className="font-extrabold text-xs text-brand-chocolate mb-1">Running AI Assistants</h4>
                  <p className="text-xs text-brand-stone font-semibold">
                    Making sure your helpers can send messages, complete tasks, and do their jobs correctly.
                  </p>
                </div>
                <div className="border border-brand-sand p-4 rounded-xl bg-brand-beige">
                  <h4 className="font-extrabold text-xs text-brand-chocolate mb-1">Safety Checks</h4>
                  <p className="text-xs text-brand-stone font-semibold">
                    Checking if the AI helpers did the right thing and sending you simple warnings if anything goes wrong.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="agent-telemetry" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <FileText className="w-5 h-5 text-brand-orange" />
                <h2>3. AI Assistant & Activity Logs</h2>
              </div>
              <p>
                To keep your assistants running fast, we log simple details like computer memory usage, response times, and success messages.
              </p>
              <p>
                We do not use your private company goals or private assistant messages to train public AI models. Your custom instructions belong entirely to you.
              </p>
            </section>

            {/* Section 4 */}
            <section id="data-sharing" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Shield className="w-5 h-5 text-brand-orange" />
                <h2>4. Sharing & Protecting Your Data</h2>
              </div>
              <p>
                We never sell, rent, or trade your data to advertising companies or anyone else. We only share data when necessary:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>With highly secure cloud storage partners (like Google Cloud Platform) to keep our servers running.</li>
                <li>When you ask us to connect and send messages to other tools you use (like Slack or HubSpot).</li>
                <li>If the law requires us to share it, under strict legal reviews.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="user-rights" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Lock className="w-5 h-5 text-brand-orange" />
                <h2>5. Your Rights & Choices</h2>
              </div>
              <p>
                You are in complete control of your data. No matter where you live, you can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-brand-chocolate">Delete Your Data:</strong> You can permanently wipe out all your goals, assistants, and settings from our database at any time.</li>
                <li><strong className="text-brand-chocolate">Download Your Data:</strong> You can download a simple text file of your goals and helper configurations.</li>
                <li><strong className="text-brand-chocolate">Stop Helpers:</strong> You can pause or stop any AI assistant immediately with a single click.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="retention" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                <h2>6. Saving & Deleting Your Data</h2>
              </div>
              <p>
                We keep your goals and helper settings as long as your account is open. If you do not log in or use your account for 12 months in a row, we will delete all your linked tools, AI assistant configurations, and goals to keep your information safe and clean.
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Elegant minimalist footer for subpages */}
      <footer className="border-t border-brand-sand bg-white py-8 text-xs text-brand-stone mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <span>© 2026 Arxodyne Technologies, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/terms')}>Terms of Service</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/docs')}>Documentation</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/')}>Home</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
