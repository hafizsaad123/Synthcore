import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Cpu, 
  Target, 
  Terminal, 
  AlertTriangle, 
  Zap, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Bell,
  CheckCircle,
  AlertOctagon,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { Agent, Decision, ConnectedTool, AlertItem, SystemGoal } from '../types';

interface DashboardProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  goals: SystemGoal[];
  setGoals: React.Dispatch<React.SetStateAction<SystemGoal[]>>;
  connectedTools: ConnectedTool[];
  setConnectedTools: React.Dispatch<React.SetStateAction<ConnectedTool[]>>;
  username: string;
  setUsername: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  activeGoalText: string;
  setActiveGoalText: (v: string) => void;
  toastMessage: string | null;
  toastError: boolean;
  setToastMessage: (v: string | null) => void;
  showToast: (content: string, isError?: boolean) => void;
}

export default function Dashboard({
  agents,
  setAgents,
  decisions,
  setDecisions,
  alerts,
  setAlerts,
  goals,
  setGoals,
  connectedTools,
  setConnectedTools,
  username,
  setUsername,
  companyName,
  setCompanyName,
  activeGoalText,
  setActiveGoalText,
  toastMessage,
  toastError,
  setToastMessage,
  showToast
}: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('synthcore_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('synthcore_sidebar_collapsed', String(newVal));
      return newVal;
    });
  };

  // Check if onboarded / authenticated!
  useEffect(() => {
    const onboarded = localStorage.getItem('synthcore_onboarded');
    if (!onboarded) {
      navigate('/onboarding');
      return;
    }

    const obUsername = localStorage.getItem('synthcore_username');
    const obCompany = localStorage.getItem('synthcore_company');
    const obGoal = localStorage.getItem('synthcore_goal');
    const obToolsStr = localStorage.getItem('synthcore_selected_tools');

    if (obUsername) setUsername(obUsername);
    if (obCompany) setCompanyName(obCompany);
    if (obGoal) {
      setActiveGoalText(obGoal);
      // Ensure the first goal in our state matches the onboarding goal
      setGoals((prev) =>
        prev.map((g, i) =>
          i === 0 ? { ...g, title: obGoal, description: `Onboarding initialized objective: ${obGoal}` } : g
        )
      );
    }
    if (obToolsStr) {
      try {
        const obTools = JSON.parse(obToolsStr) as string[];
        setConnectedTools((prev) =>
          prev.map((t) => ({ ...t, connected: obTools.includes(t.id) }))
        );
      } catch (e) {
        console.error('Error parsing onboarding tools', e);
      }
    }

    // Guard Super Admin Route
    const userEmail = (localStorage.getItem('synthcore_email') || '').trim().toLowerCase();
    const isSuper = userEmail === 'admin@arxodyne.com' && localStorage.getItem('synthcore_is_super') === 'true';
    if (location.pathname.includes('/super-admin') && !isSuper) {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('synthcore_onboarded');
    localStorage.removeItem('synthcore_username');
    localStorage.removeItem('synthcore_email');
    localStorage.removeItem('synthcore_company');
    localStorage.removeItem('synthcore_goal');
    localStorage.removeItem('synthcore_selected_tools');
    localStorage.removeItem('synthcore_is_super');
    navigate('/');
  };

  const navItemsCommand = [
    {
      path: '/dashboard',
      label: 'Dashboard Overview',
      icon: Home,
      badge: null
    },
    {
      path: '/dashboard/agents',
      label: 'AI Helpers',
      icon: Cpu,
      badge: agents.filter(a => a.status === 'Running' || a.status === 'Warning').length.toString()
    },
    {
      path: '/dashboard/goals',
      label: 'My Goals',
      icon: Target,
      badge: null
    },
    {
      path: '/dashboard/logs',
      label: 'Action History',
      icon: Terminal,
      badge: null
    },
    {
      path: '/dashboard/alerts',
      label: 'Notices & Alerts',
      icon: AlertTriangle,
      badge: alerts.filter(a => !a.resolved).length.toString()
    }
  ];

  const userEmail = (localStorage.getItem('synthcore_email') || '').trim().toLowerCase();
  const isSuperAdmin = userEmail === 'admin@arxodyne.com' && localStorage.getItem('synthcore_is_super') === 'true';

  const navItemsConfig = [
    {
      path: '/dashboard/integrations',
      label: 'Connected Tools',
      icon: Zap,
      badge: null
    },
    {
      path: '/dashboard/supabase',
      label: 'Supabase Sync',
      icon: Database,
      badge: null
    },
    {
      path: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    },
    ...(isSuperAdmin ? [{
      path: '/dashboard/super-admin',
      label: 'Admin Mode',
      icon: ShieldAlert,
      badge: 'ROOT'
    }] : [])
  ];

  const initials = username
    ? username.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AR';

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate selection:bg-brand-orange selection:text-white antialiased font-sans flex flex-col">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-sand h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 hover:bg-brand-cream rounded-xl transition-colors text-brand-stone cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="font-display font-extrabold text-lg tracking-tight text-brand-chocolate">
              arxodyne<span className="text-brand-orange ml-0.5 font-sans font-bold text-2xl leading-none -mt-1">*</span>
            </span>
            <span className="text-[10px] border border-brand-sand px-2 py-0.5 rounded-full text-brand-stone font-bold bg-brand-beige ml-1.5">Dashboard</span>
          </div>

          {/* Desktop Collapsible Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 hover:bg-brand-cream rounded-full transition-colors text-brand-stone cursor-pointer border border-brand-sand/50"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-3 py-1 rounded-full hidden lg:inline-block">
            ● System Active & Secure
          </div>

          {/* USER MENU DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 px-2.5 hover:bg-brand-cream rounded-full transition-colors border border-brand-sand/50 text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center font-sans shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-brand-chocolate leading-none">{username || 'Saad'}</span>
                <span className="text-[9px] text-brand-stone font-bold leading-none mt-0.5">{companyName || 'Arxodyne'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brand-stone hidden sm:inline" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setUserMenuOpen(false)}></div>
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-brand-sand rounded-2xl shadow-lg z-50 py-1 divide-y divide-brand-sand animate-in fade-in duration-100">
                  <div className="px-3 py-2">
                    <p className="text-xs font-bold text-brand-chocolate">{username}</p>
                    <p className="text-[10px] text-brand-stone font-semibold mt-0.5">{companyName}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/dashboard/settings');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-brand-stone hover:bg-brand-cream hover:text-brand-chocolate font-bold transition-colors cursor-pointer"
                    >
                      Profile & Settings
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/dashboard/super-admin');
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-brand-orange hover:bg-brand-cream font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        ⚡ Admin Mode Override
                      </button>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* VIEW CONTENT WRAPPER */}
      <div className="flex flex-1 relative">
        
        {/* SIDEBAR NAVIGATION - DESKTOP */}
        <aside className={`hidden md:flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-brand-sand shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto transition-all duration-300`}>
          <div className={`p-4 ${sidebarCollapsed ? 'px-2' : ''} flex flex-col gap-6 flex-1`}>
            
            <div className="flex flex-col gap-1.5">
              {sidebarCollapsed ? (
                <div className="h-px bg-brand-sand my-1.5 mx-2" />
              ) : (
                <span className="text-[10px] font-bold text-brand-stone tracking-wider uppercase px-2">COMMAND CENTER</span>
              )}
              <nav className="flex flex-col gap-0.5">
                {navItemsCommand.map((item) => {
                  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      title={sidebarCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-1' : 'justify-between px-2.5'} py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-brand-orange text-white'
                          : 'text-brand-stone hover:bg-brand-cream hover:text-brand-chocolate'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-orange'}`} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </span>
                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white text-brand-orange' : 'bg-brand-beige text-brand-stone'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col gap-1.5">
              {sidebarCollapsed ? (
                <div className="h-px bg-brand-sand my-1.5 mx-2" />
              ) : (
                <span className="text-[10px] font-bold text-brand-stone tracking-wider uppercase px-2">CONFIGURATION</span>
              )}
              <nav className="flex flex-col gap-0.5">
                {navItemsConfig.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-1' : 'justify-between px-2.5'} py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-brand-orange text-white'
                          : 'text-brand-stone hover:bg-brand-cream hover:text-brand-chocolate'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-orange'}`} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>

          <div className={`p-4 border-t border-brand-sand text-[10px] text-brand-stone flex flex-col gap-1 ${sidebarCollapsed ? 'items-center text-center px-1' : ''} font-bold`}>
            {sidebarCollapsed ? (
              <span className="font-bold text-brand-orange bg-brand-cream rounded px-1.5 py-0.5" title="5 AI Helpers Online">5H</span>
            ) : (
              <>
                <span>AI HELPERS ONLINE: 5</span>
                <span>SECURE CONNECTION ACTIVE</span>
              </>
            )}
          </div>
        </aside>

        {/* SIDEBAR NAVIGATION - MOBILE */}
        {mobileNavOpen && (
          <>
            <div className="fixed inset-0 bg-brand-chocolate/40 z-30 md:hidden" onClick={() => setMobileNavOpen(false)}></div>
            <aside className="fixed inset-y-14 left-0 w-64 bg-white border-r border-brand-sand z-40 md:hidden flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-4 flex flex-col gap-6 flex-1">
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-brand-stone tracking-wider uppercase px-2">COMMAND CENTER</span>
                  <nav className="flex flex-col gap-0.5">
                    {navItemsCommand.map((item) => {
                      const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            setMobileNavOpen(false);
                            navigate(item.path);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-brand-orange text-white'
                              : 'text-brand-stone hover:bg-brand-cream hover:text-brand-chocolate'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-orange'}`} />
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-white text-brand-orange' : 'bg-brand-cream text-brand-stone'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-brand-stone tracking-wider uppercase px-2">CONFIGURATION</span>
                  <nav className="flex flex-col gap-0.5">
                    {navItemsConfig.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            setMobileNavOpen(false);
                            navigate(item.path);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-brand-orange text-white'
                              : 'text-brand-stone hover:bg-brand-cream hover:text-brand-chocolate'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-orange'}`} />
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

              </div>

              <div className="p-4 border-t border-brand-sand text-[10px] text-brand-stone flex flex-col gap-1 font-bold">
                <span>MOBILE CONNECTION</span>
                <span>SECURE ROUTING ACTIVE</span>
              </div>
            </aside>
          </>
        )}

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 bg-brand-cream overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet context={{ showToast, activeGoalText }} />
          </div>
        </main>

      </div>

      {/* TOAST NOTIFICATION FLOATER */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-brand-chocolate text-white px-4 py-3 rounded-2xl shadow-lg border border-brand-sand max-w-sm font-sans animate-in slide-in-from-bottom duration-200">
          {toastError ? (
            <AlertOctagon className="w-4.5 h-4.5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4.5 h-4.5 text-brand-orange shrink-0" />
          )}
          <span className="text-xs font-semibold text-brand-cream flex-1 leading-normal">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-brand-sand hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider pl-2"
          >
            DISMISS
          </button>
        </div>
      )}

    </div>
  );
}
