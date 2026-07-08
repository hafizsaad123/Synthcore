import { createClient } from '@supabase/supabase-js';

// Support dynamic credentials stored in localStorage as well as env variables
export const getSupabaseCredentials = () => {
  let url = '';
  let key = '';
  try {
    url = localStorage.getItem('synthcore_supabase_url') || '';
    key = localStorage.getItem('synthcore_supabase_key') || '';
  } catch (e) {
    // SSR / non-browser fallback
  }
  
  if (!url) {
    url = (import.meta as any).env.VITE_SUPABASE_URL || '';
  }
  if (!key) {
    key = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  }
  return { 
    url: url.trim(), 
    key: key.trim(),
    isCustom: !!(localStorage.getItem('synthcore_supabase_url') && localStorage.getItem('synthcore_supabase_key'))
  };
};

const { url: supabaseUrl, key: supabaseKey } = getSupabaseCredentials();

// Safely initialize the client to prevent crashing the application if keys are missing
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to determine if Supabase is fully configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem('synthcore_supabase_url', url.trim());
  localStorage.setItem('synthcore_supabase_key', key.trim());
  // Force a reload to apply changes instantly
  window.location.reload();
}

export function clearSupabaseConfig() {
  localStorage.removeItem('synthcore_supabase_url');
  localStorage.removeItem('synthcore_supabase_key');
  // Force a reload to apply changes instantly
  window.location.reload();
}

// ==========================================
// 1. ONBOARDING PROFILES & USERS
// ==========================================
export interface OnboardingProfile {
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  industry?: string;
  company_size?: string;
  ai_tool_count?: string;
  selected_tools?: string[];
  goal?: string;
  password?: string;
  is_super?: boolean;
}

export async function saveOnboardingProfile(profile: OnboardingProfile): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      email: profile.email.toLowerCase().trim(),
      first_name: profile.first_name,
      last_name: profile.last_name,
      company: profile.company,
      industry: profile.industry,
      company_size: profile.company_size,
      ai_tool_count: profile.ai_tool_count,
      selected_tools: profile.selected_tools,
      goal: profile.goal,
      password: profile.password,
      is_super: profile.is_super || false,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'email' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase profiles upsert failed, using localStorage fallback:', err);
    return false;
  }
}

export async function fetchOnboardingProfile(email: string): Promise<OnboardingProfile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase profiles fetch failed, using localStorage fallback:', err);
    return null;
  }
}

// ==========================================
// 2. AGENTS
// ==========================================
export interface AgentData {
  id: string;
  name: string;
  tool: string;
  status: string;
  opsPerMin: number;
  health: number;
  goal: string;
  instructions: string;
  priority: string;
}

export async function fetchAgentsFromDb(): Promise<AgentData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase agents fetch failed:', err);
    return null;
  }
}

export async function saveAgentToDb(agent: AgentData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('agents')
      .upsert(agent, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase agent save failed:', err);
    return false;
  }
}

export async function deleteAgentFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase agent delete failed:', err);
    return false;
  }
}

// ==========================================
// 3. DECISIONS (LOGS)
// ==========================================
export interface DecisionData {
  id: string;
  type: string;
  description: string;
  agent: string;
  time: string;
}

export async function fetchDecisionsFromDb(): Promise<DecisionData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase decisions fetch failed:', err);
    return null;
  }
}

export async function saveDecisionToDb(decision: DecisionData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('decisions')
      .upsert(decision, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase decision save failed:', err);
    return false;
  }
}

export async function clearDecisionsFromDb(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('decisions')
      .delete()
      .neq('id', 'dummy_id_never_matching');

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase decisions clear failed:', err);
    return false;
  }
}

// ==========================================
// 4. ALERTS
// ==========================================
export interface AlertData {
  id: string;
  agentId?: string;
  title: string;
  severity: string;
  description: string;
  time: string;
  resolved: boolean;
}

export async function fetchAlertsFromDb(): Promise<AlertData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase alerts fetch failed:', err);
    return null;
  }
}

export async function saveAlertToDb(alert: AlertData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('alerts')
      .upsert(alert, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase alert save failed:', err);
    return false;
  }
}

// ==========================================
// 5. GOALS
// ==========================================
export interface GoalData {
  id: string;
  title: string;
  progress: number;
  status: string;
  timeRemaining: string;
  description: string;
}

export async function fetchGoalsFromDb(): Promise<GoalData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase goals fetch failed:', err);
    return null;
  }
}

export async function saveGoalToDb(goal: GoalData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('goals')
      .upsert(goal, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase goal save failed:', err);
    return false;
  }
}

// ==========================================
// 6. CONNECTED TOOLS
// ==========================================
export interface ConnectedToolData {
  id: string;
  name: string;
  logo: string;
  category: string;
  connected: boolean;
}

export async function fetchConnectedToolsFromDb(): Promise<ConnectedToolData[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('connected_tools')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase connected_tools fetch failed:', err);
    return null;
  }
}

export async function saveConnectedToolToDb(tool: ConnectedToolData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('connected_tools')
      .upsert(tool, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase connected_tool save failed:', err);
    return false;
  }
}
