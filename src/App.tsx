import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Agent, Decision, AlertItem, SystemGoal, ConnectedTool } from './types';
import {
  INITIAL_AGENTS,
  INITIAL_DECISIONS,
  INITIAL_ALERTS,
  INITIAL_GOALS,
  INITIAL_AI_TOOLS
} from './data/mockData';
import {
  fetchAgentsFromDb,
  saveAgentToDb,
  deleteAgentFromDb,
  fetchDecisionsFromDb,
  saveDecisionToDb,
  fetchAlertsFromDb,
  saveAlertToDb,
  fetchGoalsFromDb,
  saveGoalToDb,
  fetchConnectedToolsFromDb,
  saveConnectedToolToDb,
  isSupabaseConfigured
} from './utils/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Overview from './pages/dashboard/Overview';
import Agents from './pages/dashboard/Agents';
import Goals from './pages/dashboard/Goals';
import Logs from './pages/dashboard/Logs';
import Alerts from './pages/dashboard/Alerts';
import Integrations from './pages/dashboard/Integrations';
import Settings from './pages/dashboard/Settings';
import SuperAdmin from './pages/dashboard/SuperAdmin';
import SupabaseSync from './pages/dashboard/Supabase';

// Dynamic Core Site Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Docs from './pages/Docs';
import SystemStatus from './pages/SystemStatus';

function AppContent() {
  const navigate = useNavigate();

  // Core Global Synchronized States
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [goals, setGoals] = useState<SystemGoal[]>(INITIAL_GOALS);
  const [connectedTools, setConnectedTools] = useState<ConnectedTool[]>(INITIAL_AI_TOOLS);

  const [username, setUsername] = useState('Saad');
  const [companyName, setCompanyName] = useState('Arxodyne Technologies');
  const [activeGoalText, setActiveGoalText] = useState('Reduce customer support response time by 50%');

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Load initial data from Supabase if configured, seeding tables on first setup if empty
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured()) {
        setIsInitialLoadDone(true);
        return;
      }
      try {
        // 1. Agents Sync
        const dbAgents = await fetchAgentsFromDb();
        if (dbAgents && dbAgents.length > 0) {
          setAgents(dbAgents);
        } else if (dbAgents && dbAgents.length === 0) {
          for (const a of INITIAL_AGENTS) {
            await saveAgentToDb(a);
          }
        }

        // 2. Decisions Sync
        const dbDecisions = await fetchDecisionsFromDb();
        if (dbDecisions && dbDecisions.length > 0) {
          setDecisions(dbDecisions);
        } else if (dbDecisions && dbDecisions.length === 0) {
          for (const d of INITIAL_DECISIONS) {
            await saveDecisionToDb(d);
          }
        }

        // 3. Alerts Sync
        const dbAlerts = await fetchAlertsFromDb();
        if (dbAlerts && dbAlerts.length > 0) {
          setAlerts(dbAlerts);
        } else if (dbAlerts && dbAlerts.length === 0) {
          for (const al of INITIAL_ALERTS) {
            await saveAlertToDb(al);
          }
        }

        // 4. Goals Sync
        const dbGoals = await fetchGoalsFromDb();
        if (dbGoals && dbGoals.length > 0) {
          setGoals(dbGoals);
        } else if (dbGoals && dbGoals.length === 0) {
          for (const g of INITIAL_GOALS) {
            await saveGoalToDb(g);
          }
        }

        // 5. Tools Sync
        const dbTools = await fetchConnectedToolsFromDb();
        if (dbTools && dbTools.length > 0) {
          setConnectedTools(dbTools);
        } else if (dbTools && dbTools.length === 0) {
          for (const t of INITIAL_AI_TOOLS) {
            await saveConnectedToolToDb(t);
          }
        }
      } catch (err) {
        console.warn('Initial Supabase fetch & seed failed, staying in local demo mode:', err);
      } finally {
        setIsInitialLoadDone(true);
      }
    }

    loadSupabaseData();
  }, []);

  // Sync state modifications & deletions in real-time to Supabase
  useEffect(() => {
    if (!isInitialLoadDone || !isSupabaseConfigured()) return;
    async function syncAgents() {
      try {
        for (const agent of agents) {
          await saveAgentToDb(agent);
        }
        const dbAgents = await fetchAgentsFromDb();
        if (dbAgents) {
          const localIds = new Set(agents.map(a => a.id));
          for (const dbA of dbAgents) {
            if (!localIds.has(dbA.id)) {
              await deleteAgentFromDb(dbA.id);
            }
          }
        }
      } catch (err) {
        console.error('Real-time Agent sync error:', err);
      }
    }
    syncAgents();
  }, [agents, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !isSupabaseConfigured()) return;
    async function syncDecisions() {
      try {
        for (const dec of decisions) {
          await saveDecisionToDb(dec);
        }
      } catch (err) {
        console.error('Real-time Decision sync error:', err);
      }
    }
    syncDecisions();
  }, [decisions, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !isSupabaseConfigured()) return;
    async function syncAlerts() {
      try {
        for (const al of alerts) {
          await saveAlertToDb(al);
        }
      } catch (err) {
        console.error('Real-time Alert sync error:', err);
      }
    }
    syncAlerts();
  }, [alerts, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !isSupabaseConfigured()) return;
    async function syncGoals() {
      try {
        for (const g of goals) {
          await saveGoalToDb(g);
        }
      } catch (err) {
        console.error('Real-time Goal sync error:', err);
      }
    }
    syncGoals();
  }, [goals, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !isSupabaseConfigured()) return;
    async function syncTools() {
      try {
        for (const t of connectedTools) {
          await saveConnectedToolToDb(t);
        }
      } catch (err) {
        console.error('Real-time Tool sync error:', err);
      }
    }
    syncTools();
  }, [connectedTools, isInitialLoadDone]);

  // Simple toast trigger from subpages passed down or bubbled up via callback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastError, setToastError] = useState(false);

  const showToast = (content: string, isError = false) => {
    setToastMessage(content);
    setToastError(isError);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/status" element={<SystemStatus />} />
      
      {/* Dashboard with Persistent Sidebar and Layout Navigation */}
      <Route
        path="/dashboard"
        element={
          <Dashboard
            agents={agents}
            setAgents={setAgents}
            decisions={decisions}
            setDecisions={setDecisions}
            alerts={alerts}
            setAlerts={setAlerts}
            goals={goals}
            setGoals={setGoals}
            connectedTools={connectedTools}
            setConnectedTools={setConnectedTools}
            username={username}
            setUsername={setUsername}
            companyName={companyName}
            setCompanyName={setCompanyName}
            activeGoalText={activeGoalText}
            setActiveGoalText={setActiveGoalText}
            toastMessage={toastMessage}
            toastError={toastError}
            setToastMessage={setToastMessage}
            showToast={showToast}
          />
        }
      >
        {/* Child subviews of Dashboard */}
        <Route
          index
          element={
            <Overview
              agents={agents}
              setAgents={setAgents}
              decisions={decisions}
              setDecisions={setDecisions}
              alerts={alerts}
              setAlerts={setAlerts}
              goals={goals}
              setGoals={setGoals}
              username={username}
              companyName={companyName}
              activeGoalText={activeGoalText}
              showToast={showToast}
              onNavigate={(path) => navigate(path)}
            />
          }
        />
        <Route
          path="agents"
          element={
            <Agents
              agents={agents}
              setAgents={setAgents}
              showToast={showToast}
              activeGoalText={activeGoalText}
            />
          }
        />
        <Route
          path="goals"
          element={
            <Goals
              goals={goals}
              setGoals={setGoals}
              showToast={showToast}
              setActiveGoalText={setActiveGoalText}
            />
          }
        />
        <Route
          path="logs"
          element={
            <Logs
              decisions={decisions}
              setDecisions={setDecisions}
              showToast={showToast}
            />
          }
        />
        <Route
          path="alerts"
          element={
            <Alerts
              alerts={alerts}
              setAlerts={setAlerts}
              agents={agents}
              setAgents={setAgents}
              decisions={decisions}
              setDecisions={setDecisions}
              showToast={showToast}
            />
          }
        />
        <Route
          path="integrations"
          element={
            <Integrations
              connectedTools={connectedTools}
              setConnectedTools={setConnectedTools}
              showToast={showToast}
            />
          }
        />
        <Route
          path="supabase"
          element={
            <SupabaseSync />
          }
        />
        <Route
          path="settings"
          element={
            <Settings
              username={username}
              setUsername={setUsername}
              companyName={companyName}
              setCompanyName={setCompanyName}
              showToast={showToast}
            />
          }
        />
        <Route
          path="super-admin"
          element={
            <SuperAdmin
              agents={agents}
              setAgents={setAgents}
              decisions={decisions}
              setDecisions={setDecisions}
              alerts={alerts}
              setAlerts={setAlerts}
              connectedTools={connectedTools}
              setConnectedTools={setConnectedTools}
              showToast={showToast}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
