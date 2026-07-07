import { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Agent, Decision, AlertItem, SystemGoal, ConnectedTool } from './types';
import {
  INITIAL_AGENTS,
  INITIAL_DECISIONS,
  INITIAL_ALERTS,
  INITIAL_GOALS,
  INITIAL_AI_TOOLS
} from './data/mockData';

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
