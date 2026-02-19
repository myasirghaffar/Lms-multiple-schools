
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login, isDemo } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('fetch')) {
        setError('Network error: Unable to connect to Supabase. Please check your internet connection or project status.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (role: 'super' | 'admin' | 'teacher' | 'student') => {
    setError(null);
    setPassword('password123');
    switch (role) {
      case 'super':
        setEmail('super@educhain.com');
        break;
      case 'admin':
        setEmail('admin@centralhigh.edu');
        break;
      case 'teacher':
        setEmail('teacher@centralhigh.edu');
        break;
      case 'student':
        setEmail('student@centralhigh.edu');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">EduChain LMS</h1>
          <p className="text-slate-500 mt-2">Enterprise Multi-Tenant Management</p>
          
          {isDemo && (
            <div className="mt-4 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
              Preview / Demo Mode Active
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white space-y-6 transition-all">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-semibold text-rose-800 leading-tight">{error}</p>
            </div>
          )}

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start space-x-3">
            <Info className="text-indigo-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Quick Access Roles</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button 
                  type="button"
                  onClick={() => useDemo('super')} 
                  className="text-[10px] bg-white border border-indigo-200 px-3 py-1.5 rounded-lg font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-center"
                >
                  Super Admin
                </button>
                <button 
                  type="button"
                  onClick={() => useDemo('admin')} 
                  className="text-[10px] bg-white border border-indigo-200 px-3 py-1.5 rounded-lg font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-center"
                >
                  Institution Admin
                </button>
                <button 
                  type="button"
                  onClick={() => useDemo('teacher')} 
                  className="text-[10px] bg-white border border-indigo-200 px-3 py-1.5 rounded-lg font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-center"
                >
                  Teacher
                </button>
                <button 
                  type="button"
                  onClick={() => useDemo('student')} 
                  className="text-[10px] bg-white border border-indigo-200 px-3 py-1.5 rounded-lg font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-center"
                >
                  Student
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder="name@school.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-50">
          EduChain Cloud Infrastructure • 256-bit AES Encryption
        </p>
      </div>
    </div>
  );
};

export default Login;
