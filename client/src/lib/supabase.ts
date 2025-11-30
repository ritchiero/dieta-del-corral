import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mugzzceytmcyytzuxllg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3p6Y2V5dG1jeXl0enV4bGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDcxNDEsImV4cCI6MjA3Nzc4MzE0MX0.dKVZWdhh4mO2XPPkDnBm9VncAwHcUWjLckjiAiaul1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DayProgress {
  id: string;
  user_id: string;
  day: number;
  completed: boolean;
  completed_at: string | null;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  created_at: string;
  updated_at: string;
}
