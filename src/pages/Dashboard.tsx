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
  ChevronRight
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
      label: 'Overview Panel',
      icon: Home,
      badge: null
    },
    {
      path: '/dashboard/agents',
      label: 'Agent Node Fleet',
      icon: Cpu,
      badge: agents.filter(a => a.status === 'Running' || a.status === 'Warning').length.toString()
    },
    {
      path: '/dashboard/goals',
      label: 'Business Goals',
      icon: Target,
      badge: null
    },
    {
      path: '/dashboard/logs',
      label: 'Decision Logs',
      icon: Terminal,
      badge: null
    },
    {
      path: '/dashboard/alerts',
      label: 'Alerts Desk',
      icon: AlertTriangle,
      badge: alerts.filter(a => !a.resolved).length.toString()
    }
  ];

  const userEmail = (localStorage.getItem('synthcore_email') || '').trim().toLowerCase();
  const isSuperAdmin = userEmail === 'admin@arxodyne.com' && localStorage.getItem('synthcore_is_super') === 'true';

  const navItemsConfig = [
    {
      path: '/dashboard/integrations',
      label: 'API Tunnels',
      icon: Zap,
      badge: null
    },
    {
      path: '/dashboard/settings',
      label: 'Global Settings',
      icon: Settings,
      badge: null
    },
    ...(isSuperAdmin ? [{
      path: '/dashboard/super-admin',
      label: 'Super Admin Override',
      icon: ShieldAlert,
      badge: 'ROOT'
    }] : [])
  ];

  const initials = username
    ? username.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AR';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white antialiased font-sans flex flex-col">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAEAEA] h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-600 cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="bg-black text-white w-6.5 h-6.5 rounded flex items-center justify-center font-bold text-xs tracking-tight">
              AR
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:inline">Arxodyne OS</span>
          </div>

          {/* Desktop Collapsible Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-600 cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-neutral-500" /> : <ChevronLeft className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded hidden lg:inline-block">
            V1.4.2 // STATUS: SECURE
          </div>

          {/* USER MENU DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 px-2.5 hover:bg-neutral-50 rounded-md transition-colors border border-transparent hover:border-[#EAEAEA] text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-black leading-none">{username || 'Saad'}</span>
                <span className="text-[10px] text-neutral-400 leading-none mt-0.5">{companyName || 'Arxodyne'}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:inline" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setUserMenuOpen(false)}></div>
                <div className="absolute right-0 mt-1 w-52 bg-white border border-[#EAEAEA] rounded-md shadow-lg z-50 py-1 divide-y divide-[#EAEAEA] animate-in fade-in duration-100">
                  <div className="px-3 py-2">
                    <p className="text-xs font-bold text-neutral-800">{username}</p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{companyName}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/dashboard/settings');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer"
                    >
                      Profile & Settings
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/dashboard/super-admin');
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        ⚡ Super Admin Override
                      </button>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
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
        <aside className={`hidden md:flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-[#EAEAEA] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto transition-all duration-300`}>
          <div className={`p-4 ${sidebarCollapsed ? 'px-2' : ''} flex flex-col gap-6 flex-1`}>
            
            <div className="flex flex-col gap-1.5">
              {sidebarCollapsed ? (
                <div className="h-px bg-neutral-200 my-1.5 mx-2" />
              ) : (
                <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase px-2">COMMAND CENTER</span>
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
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-1' : 'justify-between px-2.5'} py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-100 text-black font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </span>
                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
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
                <div className="h-px bg-neutral-200 my-1.5 mx-2" />
              ) : (
                <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase px-2">CONFIGURATION</span>
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
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-1' : 'justify-between px-2.5'} py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-100 text-black font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>

          <div className={`p-4 border-t border-[#EAEAEA] font-mono text-[10px] text-neutral-400 flex flex-col gap-1 ${sidebarCollapsed ? 'items-center text-center px-1' : ''}`}>
            {sidebarCollapsed ? (
              <span className="font-bold text-black bg-neutral-100 rounded px-1.5 py-0.5" title="5 Grid Nodes Active">5N</span>
            ) : (
              <>
                <span>GRID NODES ACTIVE: 5</span>
                <span>SECURE TUNNEL: SSL_TLS_256</span>
              </>
            )}
          </div>
        </aside>

        {/* SIDEBAR NAVIGATION - MOBILE */}
        {mobileNavOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileNavOpen(false)}></div>
            <aside className="fixed inset-y-14 left-0 w-64 bg-white border-r border-[#EAEAEA] z-40 md:hidden flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-4 flex flex-col gap-6 flex-1">
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase px-2">COMMAND CENTER</span>
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
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-neutral-100 text-black font-semibold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="bg-neutral-100 text-neutral-600 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase px-2">CONFIGURATION</span>
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
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-neutral-100 text-black font-semibold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

              </div>

              <div className="p-4 border-t border-[#EAEAEA] font-mono text-[10px] text-neutral-400 flex flex-col gap-1">
                <span>MOBILE CONNECTION</span>
                <span>SECURE HOST BYPASS</span>
              </div>
            </aside>
          </>
        )}

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 bg-[#FAFAFA] overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet context={{ showToast, activeGoalText }} />
          </div>
        </main>

      </div>

      {/* GEIST TOAST NOTIFICATION FLOATER */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-black text-white px-4 py-3 rounded-md shadow-lg border border-neutral-800 max-w-sm font-sans animate-in slide-in-from-bottom duration-200">
          {toastError ? (
            <AlertOctagon className="w-4.5 h-4.5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-neutral-100 flex-1 leading-normal">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white transition-colors text-[10px] font-mono font-bold uppercase tracking-wider pl-2"
          >
            DISMISS
          </button>
        </div>
      )}

    </div>
  );
}
