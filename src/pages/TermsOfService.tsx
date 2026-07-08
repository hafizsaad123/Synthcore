import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Shield, AlertTriangle, HelpCircle, ChevronRight, Check } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('acceptance');

  const termsList = [
    { id: 'acceptance', label: '1. Using Our Service' },
    { id: 'account-security', label: '2. Your Account & Password' },
    { id: 'acceptable-use', label: '3. Safe & Fair Use' },
    { id: 'pricing-billing', label: '4. Prices & Payments' },
    { id: 'limitations', label: '5. Our Promises & Responsibility' },
    { id: 'termination', label: '6. Stopping Your Account' },
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
                <Scale className="w-4 h-4 text-brand-orange" /> Terms and Rules
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-chocolate">
                Terms of Service
              </h1>
              <p className="text-sm text-brand-stone mt-2 font-semibold">
                Effective July 8, 2026 • Simple & Easy-to-Read Version
              </p>
            </div>
            <div className="flex items-center gap-3 bg-brand-beige border border-brand-sand px-4 py-2.5 rounded-full text-xs text-brand-stone font-bold self-start">
              <span>Arbitration: Not Required</span>
            </div>
          </div>
        </div>

        {/* Layout split */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Side Nav Links */}
          <aside className="w-full lg:w-64 shrink-0 sticky top-24 space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-brand-stone uppercase px-3 block mb-3">
              Agreement Parts
            </span>
            {termsList.map((term) => (
              <button
                key={term.id}
                onClick={() => {
                  setActiveTab(term.id);
                  document.getElementById(term.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-150 ${
                  activeTab === term.id
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-brand-stone hover:text-brand-chocolate hover:bg-brand-beige'
                }`}
              >
                <span>{term.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${activeTab === term.id ? 'opacity-100 text-white' : ''}`} />
              </button>
            ))}
            <div className="pt-6 mt-6 border-t border-brand-sand px-3">
              <h4 className="text-xs font-bold text-brand-chocolate mb-2">Need help?</h4>
              <p className="text-[11px] text-brand-stone leading-relaxed mb-3 font-semibold">
                If you have questions about these terms or need a custom agreement for your business, contact us.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline cursor-pointer"
              >
                Contact Support <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </aside>

          {/* Policy Text Body */}
          <div className="flex-1 bg-white border border-brand-sand rounded-2xl p-8 md:p-10 shadow-sm space-y-10 text-sm text-brand-stone leading-relaxed font-semibold">
            
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Shield className="w-5 h-5 text-brand-orange" />
                <h2>1. Using Our Service</h2>
              </div>
              <p>
                Welcome to Arxodyne. By signing up, setting up goals, using our AI assistants, or connecting tools to our website, you agree to follow these simple rules.
              </p>
              <p>
                If you are using Arxodyne for a company or startup, you represent that you have the authority to agree to these rules for your team.
              </p>
            </section>

            {/* Section 2 */}
            <section id="account-security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <AlertTriangle className="w-5 h-5 text-brand-orange" />
                <h2>2. Your Account & Password</h2>
              </div>
              <p>
                To use our AI assistants, you create an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep your account password and access tokens safe and private.</li>
                <li>Let us know immediately if you think someone else has logged into your account.</li>
                <li>Avoid sharing your account with more people than your plan allows.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="acceptable-use" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Scale className="w-5 h-5 text-brand-orange" />
                <h2>3. Safe & Fair Use</h2>
              </div>
              <p>
                We want you to be highly productive. However, you are not allowed to program your AI assistants to do bad or harmful things, such as:
              </p>
              <div className="space-y-3 mt-3">
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">!</div>
                  <p><strong className="text-brand-chocolate">Spamming:</strong> Sending massive amounts of unwanted emails, social media comments, or messages.</p>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">!</div>
                  <p><strong className="text-brand-chocolate">Hacking:</strong> Trying to break, slow down, or illegally enter other websites or services.</p>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">!</div>
                  <p><strong className="text-brand-chocolate">Pretending to be someone else:</strong> Designing assistants to mimic bank staff, government workers, or other people to steal information.</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="pricing-billing" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <Check className="w-5 h-5 text-brand-orange" />
                <h2>4. Prices & Payments</h2>
              </div>
              <p>
                Some of our plans (like the Growth Plan and Enterprise Plan) require monthly payments.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-brand-chocolate">Monthly Billing:</strong> Paid plans are charged every month starting on the day you sign up.</li>
                <li><strong className="text-brand-chocolate">Easy Cancellation:</strong> You can cancel your paid plan in your settings page at any time. We will stop charging you immediately.</li>
                <li><strong className="text-brand-chocolate">Taxes:</strong> The prices listed on our site do not include local taxes, which will be calculated when you check out.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="limitations" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <AlertTriangle className="w-5 h-5 text-brand-orange" />
                <h2>5. Our Promises & Responsibility</h2>
              </div>
              <p>
                We try our best to make our service work perfectly, but we provide it "as is" and "as available". We cannot promise that our AI helpers will never make a mistake or that our website will be online 100% of the time.
              </p>
              <p>
                We are not responsible for any issues or lost data if you clear your browser cache, or if third-party services you connect (like Slack) have outages.
              </p>
            </section>

            {/* Section 6 */}
            <section id="termination" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2 text-brand-chocolate font-display font-extrabold text-lg border-b border-brand-sand pb-2">
                <HelpCircle className="w-5 h-5 text-brand-orange" />
                <h2>6. Stopping Your Account</h2>
              </div>
              <p>
                If we detect that your account is breaking our rules (like sending spam or hacking other systems), we have the right to pause or close your account.
              </p>
              <p>
                If we pause your account, your AI assistants will stop working immediately.
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-sand bg-white py-8 text-xs text-brand-stone mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <span>© 2026 Arxodyne Technologies, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/docs')}>Documentation</span>
            <span className="hover:text-brand-orange cursor-pointer" onClick={() => navigate('/')}>Home</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
