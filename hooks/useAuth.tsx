
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getProfile, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  user: any | null; 
  profile: Profile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isSupabaseConfigured();

  useEffect(() => {
    if (isDemo) {
      const mockSession = localStorage.getItem('educhain_mock_session');
      if (mockSession) {
        const userData = JSON.parse(mockSession);
        setUser(userData);
        fetchProfile(userData.id);
      } else {
        setLoading(false);
      }
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  const fetchProfile = async (userId: string) => {
    try {
      const data = await getProfile(userId);
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    if (isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let mockUser = null;
      if (email === 'super@educhain.com') {
        mockUser = { id: 'mock-super-id', email: 'super@educhain.com' };
      } else if (email === 'admin@centralhigh.edu') {
        mockUser = { id: 'mock-admin-id', email: 'admin@centralhigh.edu' };
      } else if (email === 'teacher@centralhigh.edu') {
        mockUser = { id: 'mock-teacher-id', email: 'teacher@centralhigh.edu' };
      } else if (email === 'student@centralhigh.edu') {
        mockUser = { id: 'mock-student-id', email: 'student@centralhigh.edu' };
      }

      if (mockUser && pass === 'password123') {
        setUser(mockUser);
        localStorage.setItem('educhain_mock_session', JSON.stringify(mockUser));
        await fetchProfile(mockUser.id);
      } else {
        throw new Error('Invalid demo credentials. Use the quick-access buttons.');
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const logout = async () => {
    if (isDemo) {
      localStorage.removeItem('educhain_mock_session');
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
