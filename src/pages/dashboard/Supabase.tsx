import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Database, Plus, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Play, Terminal } from 'lucide-react';

interface Todo {
  id: number;
  name: string;
  created_at?: string;
}

export default function SupabaseSync() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  const isClientConfigured = !!supabase;

  // Mock data to fallback gracefully if the table doesn't exist in user's Supabase project yet
  const DEMO_TODOS: Todo[] = [
    { id: 101, name: 'Compile Arxodyne gateway cluster' },
    { id: 102, name: 'Filter malicious system prompts' },
    { id: 103, name: 'Verify CRM and relational database sync' },
    { id: 104, name: 'Verify Stripe API authentication keys' }
  ];

  async function fetchTodos() {
    if (!isClientConfigured) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase!.from('todos').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setTodos(data || []);
      setIsDemoMode(false);
    } catch (err: any) {
      console.error('Error fetching todos from Supabase:', err);
      setErrorMsg(err.message || 'Table not found or permission denied.');
      // Fallback to local demo list if database table query failed
      setTodos(DEMO_TODOS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isClientConfigured) {
      fetchTodos();
    } else {
      setTodos(DEMO_TODOS);
      setIsDemoMode(true);
    }
  }, []);

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    if (isDemoMode || !isClientConfigured) {
      // Add to local simulation
      const mockNew: Todo = {
        id: Date.now(),
        name: newTodo.trim()
      };
      setTodos(prev => [...prev, mockNew]);
      setNewTodo('');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase!
        .from('todos')
        .insert([{ name: newTodo.trim() }])
        .select();

      if (error) throw error;
      
      if (data) {
        setTodos(prev => [...prev, ...data]);
      } else {
        await fetchTodos();
      }
      setNewTodo('');
    } catch (err: any) {
      console.error('Error adding todo to Supabase:', err);
      setErrorMsg(`Failed to add task: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteTodo(id: number) {
    if (isDemoMode || !isClientConfigured) {
      // Delete from local simulation
      setTodos(prev => prev.filter(t => t.id !== id));
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase!
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      console.error('Error deleting todo from Supabase:', err);
      setErrorMsg(`Failed to delete task: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 text-brand-chocolate">
      {/* HEADER */}
      <div className="flex flex-col gap-1 border-b border-brand-sand pb-5">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-brand-orange" />
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-chocolate">Supabase Live Sync</h1>
        </div>
        <p className="text-xs text-brand-stone font-semibold">
          Real-time dual synchronizations with your live Supabase database instance. Read and write records securely.
        </p>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CONNECTION CARD */}
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-brand-stone uppercase tracking-wider block">DATABASE ENGINE STATUS</span>
            
            {isClientConfigured ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>CONNECTED LIVE</span>
                </div>
                <div className="font-mono text-[10px] text-brand-stone bg-brand-cream/60 border border-brand-sand/50 p-2.5 rounded-lg break-all leading-normal">
                  <strong>URL:</strong> {supabaseUrl}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>MISSING CONFIGURATION</span>
                </div>
                <p className="text-[11px] text-brand-stone leading-relaxed font-semibold">
                  Environment credentials are empty. Please ensure your <code className="bg-brand-cream px-1 py-0.5 rounded border border-brand-sand">.env</code> contains your live Supabase keys.
                </p>
              </div>
            )}

            <div className="mt-4 border-t border-brand-cream pt-4 text-[11px] text-brand-stone leading-relaxed font-semibold">
              {isDemoMode ? (
                <span className="text-amber-700 flex items-start gap-1.5 bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Demo Mode Active:</strong> Reading simulated tasks. Ensure you have run the database setup scripts below.
                  </span>
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Live Connection Operational
                </span>
              )}
            </div>
          </div>

          {isClientConfigured && (
            <button
              onClick={fetchTodos}
              disabled={loading}
              className="mt-6 w-full py-2.5 bg-brand-cream hover:bg-brand-sand/40 border border-brand-sand text-brand-chocolate font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Live Data'}
            </button>
          )}
        </div>

        {/* SQL INSTRUCTIONS PANEL */}
        <div className="bg-white border border-brand-sand rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-brand-stone uppercase tracking-wider">SUPABASE SETUP STEPS</span>
              <span className="font-mono text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full font-bold">1-MINUTE QUICKSTART</span>
            </div>

            <p className="text-xs text-brand-stone leading-relaxed font-semibold">
              To bind your live database schema, execute the SQL script in your Supabase dashboard:
            </p>

            <div className="relative">
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-brand-stone bg-white/80 border border-brand-sand px-2 py-0.5 rounded">
                <Terminal className="w-3 h-3" /> SQL
              </div>
              <pre className="font-mono text-[11px] text-brand-stone bg-brand-cream border border-brand-sand rounded-xl p-3.5 overflow-x-auto leading-relaxed max-h-36">
{`-- Create the Todos table for live sync
CREATE TABLE todos (
  id bigint generated by default as identity primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable row level security (optional) or grant access
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write" ON todos FOR ALL USING (true);`}
              </pre>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-brand-stone leading-relaxed font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
            <span>Querying table name: <strong className="font-bold text-brand-chocolate">"todos"</strong> (columns: id, name).</span>
          </div>
        </div>

      </div>

      {/* ERROR GRACEFUL DISPLAY */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex flex-col gap-1.5 font-semibold text-xs leading-relaxed animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Database Request Warning</span>
          </div>
          <p>{errorMsg}</p>
          <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
            App gracefully entered local client cache simulator to avoid a system freeze.
          </p>
        </div>
      )}

      {/* TODOLIST SYNC MODULE */}
      <div className="bg-white border border-brand-sand rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-cream pb-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-brand-chocolate tracking-tight">Synchronized Tasks Log ({todos.length})</h2>
            <p className="text-[11px] text-brand-stone font-semibold">Add tasks or mark operations complete. Writes are instantaneous.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {isDemoMode && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Simulated Cache Mode
              </span>
            )}
            {!isDemoMode && isClientConfigured && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Live Supabase Sync
              </span>
            )}
          </div>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleAddTodo} className="flex gap-2.5">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={actionLoading}
            placeholder={isDemoMode ? "Simulate task (e.g. Test failover latency)" : "Add task to live Supabase (e.g. Sync model cluster)"}
            className="flex-1 px-4 py-2.5 border border-brand-sand rounded-xl bg-brand-cream focus:outline-none focus:border-brand-orange text-brand-chocolate font-semibold text-xs disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={actionLoading || !newTodo.trim()}
            className="px-5 bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* TASKS LIST */}
        {todos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-brand-sand rounded-xl bg-brand-cream/30 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center border border-brand-sand">
              <Database className="w-4.5 h-4.5 text-brand-stone" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-bold text-brand-chocolate">No synchronized records found</p>
              <p className="text-[10px] text-brand-stone font-semibold">Your table matches the structural queries but contains no row data.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-brand-cream border border-brand-sand/80 rounded-xl overflow-hidden bg-white shadow-sm">
            {todos.map((todo) => (
              <div 
                key={todo.id} 
                className="flex items-center justify-between gap-4 p-4 hover:bg-brand-cream/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-brand-cream border border-brand-sand/50 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold text-brand-stone">
                    #{todo.id.toString().slice(-4)}
                  </span>
                  <p className="text-xs font-bold text-brand-chocolate leading-relaxed">{todo.name}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {todo.created_at && (
                    <span className="text-[10px] text-brand-stone font-semibold font-mono hidden sm:inline-block">
                      {new Date(todo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={actionLoading}
                    className="p-1.5 hover:bg-red-50 text-brand-stone hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-50 cursor-pointer"
                    title="Remove record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
