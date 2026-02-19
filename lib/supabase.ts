
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) return false;
  if (supabaseUrl.includes('YOUR_SUPABASE') || supabaseAnonKey.includes('YOUR_SUPABASE')) return false;
  if (supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined') return false;
  
  // Basic URL validation
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
};

// Initialize Supabase client
const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://tmp-project.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'tmp-anon-key';

export const supabase = createClient(safeUrl, safeKey);

export const getSession = async () => {
  if (!isSupabaseConfigured()) return { data: { session: null }, error: null };
  return await supabase.auth.getSession();
};

export const getProfile = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    // Return mock profiles based on demo IDs
    if (userId === 'mock-super-id') {
      return { 
        id: 'mock-super-id', 
        full_name: 'Platform Administrator', 
        email: 'super@educhain.com', 
        role: 'super_admin' 
      };
    }
    if (userId === 'mock-admin-id') {
      return { 
        id: 'mock-admin-id', 
        full_name: 'John School-Admin', 
        email: 'admin@centralhigh.edu', 
        role: 'institution_admin' 
      };
    }
    if (userId === 'mock-teacher-id') {
      return { 
        id: 'mock-teacher-id', 
        full_name: 'Dr. Sarah Wilson', 
        email: 'teacher@centralhigh.edu', 
        role: 'teacher' 
      };
    }
    if (userId === 'mock-student-id') {
      return { 
        id: 'mock-student-id', 
        full_name: 'Alice Thompson', 
        email: 'student@centralhigh.edu', 
        role: 'student' 
      };
    }
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*, institutions(name)')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};
