
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  ShieldAlert, 
  ExternalLink,
  Plus,
  Loader2,
  X,
  Building,
  ArrowRight,
  AlertCircle,
  Power,
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Institution } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const InstitutionsManager: React.FC = () => {
  const { isDemo } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Institution Form State
  const [newInst, setNewInst] = useState({ name: '', subdomain: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Scroll Lock Management
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        const saved = localStorage.getItem('educhain_mock_institutions');
        const mockData = saved ? JSON.parse(saved) : [
          { id: '1', name: 'Central High School', subdomain: 'central-high', is_active: true, created_at: new Date().toISOString() },
          { id: '2', name: 'Oakwood University', subdomain: 'oakwood-edu', is_active: true, created_at: new Date().toISOString() },
          { id: '3', name: 'West Oak Academy', subdomain: 'west-oak', is_active: false, created_at: new Date().toISOString() },
        ];
        setInstitutions(mockData);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateSubdomain = (sub: string) => {
    const regex = /^[a-z0-9-]+$/;
    if (!sub) return "Subdomain is required.";
    if (sub.length < 3) return "Subdomain must be at least 3 characters.";
    if (!regex.test(sub)) return "Only lowercase letters, numbers, and hyphens are allowed.";
    if (sub.startsWith('-') || sub.endsWith('-')) return "Subdomain cannot start or end with a hyphen.";
    return null;
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate Institution Name
    if (!newInst.name.trim()) {
      setFormError("Institution name is required.");
      return;
    }

    // 2. Validate Subdomain Format
    const subError = validateSubdomain(newInst.subdomain);
    if (subError) {
      setFormError(subError);
      return;
    }

    setFormLoading(true);
    try {
      const subdomain = newInst.subdomain.toLowerCase();
      
      if (isDemo) {
        // 3. Check for duplicates in Demo Mode
        if (institutions.some(i => i.subdomain === subdomain)) {
          throw new Error("This subdomain is already taken by another tenant.");
        }

        // Simulate network latency for better UX feel
        await new Promise(resolve => setTimeout(resolve, 1200));

        const newEntry: Institution = {
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: newInst.name.trim(),
          subdomain: subdomain,
          is_active: true,
          created_at: new Date().toISOString()
        };

        const updated = [newEntry, ...institutions];
        setInstitutions(updated);
        // Persist to localStorage for demo
        localStorage.setItem('educhain_mock_institutions', JSON.stringify(updated));
      } else {
        // Production Supabase Logic
        const { error } = await supabase
          .from('institutions')
          .insert([{
            name: newInst.name.trim(),
            subdomain: subdomain,
            is_active: true
          }]);

        if (error) throw error;
        await fetchInstitutions();
      }

      // Success cleanup
      setIsModalOpen(false);
      setNewInst({ name: '', subdomain: '' });
    } catch (error: any) {
      setFormError(error.message || "An unexpected error occurred during provisioning.");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? 'Deactivate' : 'Activate';
    if (!window.confirm(`Are you sure you want to ${action} this institution? Access for all its users will be ${currentStatus ? 'suspended' : 'restored'} immediately.`)) {
      return;
    }

    setUpdatingId(id);
    try {
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const updated = institutions.map(inst => 
          inst.id === id ? { ...inst, is_active: !currentStatus } : inst
        );
        setInstitutions(updated);
        localStorage.setItem('educhain_mock_institutions', JSON.stringify(updated));
      } else {
        const { error } = await supabase
          .from('institutions')
          .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
        setInstitutions(prev => prev.map(inst => 
          inst.id === id ? { ...inst, is_active: !currentStatus } : inst
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteInstitution = async (id: string) => {
    if (!window.confirm('CRITICAL WARNING: Are you sure you want to PERMANENTLY DELETE this institution? This will purge all student records, teacher profiles, and academic history.')) {
      return;
    }

    setUpdatingId(id);
    try {
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const updated = institutions.filter(inst => inst.id !== id);
        setInstitutions(updated);
        localStorage.setItem('educhain_mock_institutions', JSON.stringify(updated));
      } else {
        const { error } = await supabase.from('institutions').delete().eq('id', id);
        if (error) throw error;
        setInstitutions(prev => prev.filter(inst => inst.id !== id));
      }
    } catch (error) {
      console.error('Error deleting institution:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = institutions.filter(inst => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = inst.name.toLowerCase().includes(searchLower) || 
                         (inst.subdomain && inst.subdomain.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && inst.is_active) || 
                         (statusFilter === 'suspended' && !inst.is_active);
                         
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Platform Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border shadow-sm border-slate-100">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search tenants by school name or subdomain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
            <button onClick={() => setStatusFilter('all')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>All</button>
            <button onClick={() => setStatusFilter('active')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Active</button>
            <button onClick={() => setStatusFilter('suspended')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === 'suspended' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Suspended</button>
          </div>
        </div>
        
        <button onClick={() => { setFormError(null); setIsModalOpen(true); }} className="flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 font-bold">
          <Plus size={20} />
          <span>Provision New Tenant</span>
        </button>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 space-y-4 text-center">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <div>
              <p className="text-slate-800 font-bold text-lg">Loading Infrastructure</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-1">Syncing with global distribution network...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Legal Entity</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subdomain Access</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Service Health</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? filtered.map((inst) => (
                  <tr key={inst.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform duration-300">
                          <Building size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg leading-tight">{inst.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {inst.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl w-fit border border-indigo-100">
                        <Globe size={16} />
                        <span className="text-sm font-bold tracking-tight">{inst.subdomain}.educhain.cloud</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {inst.is_active ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                          Healthy
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 uppercase tracking-widest border border-rose-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></div>
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => toggleStatus(inst.id, inst.is_active)}
                          disabled={updatingId === inst.id}
                          className={`flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-300 ${
                            inst.is_active 
                              ? 'border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white' 
                              : 'border-emerald-100 text-emerald-500 hover:bg-emerald-600 hover:text-white'
                          } disabled:opacity-50`}
                          title={inst.is_active ? 'Deactivate Tenant' : 'Activate Tenant'}
                        >
                          {updatingId === inst.id ? <Loader2 className="animate-spin" size={16} /> : <Power size={18} />}
                        </button>
                        
                        <button 
                          onClick={() => deleteInstitution(inst.id)}
                          disabled={updatingId === inst.id}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>

                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                          <ExternalLink size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center text-slate-400">
                      <Building size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-lg text-slate-800">No tenants found</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !formLoading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Provision Tenant</h3>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Environment Setup Module</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90" disabled={formLoading}><X size={24} /></button>
            </div>

            <form onSubmit={handleAddInstitution} className="p-10 space-y-8">
              {formError && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-start space-x-3 animate-in shake duration-500">
                  <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-bold text-rose-800 leading-snug">{formError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Legal Institution Name</label>
                  <input 
                    type="text" 
                    required 
                    autoFocus 
                    value={newInst.name} 
                    onChange={(e) => setNewInst({ ...newInst, name: e.target.value })} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700 text-lg placeholder:text-slate-300" 
                    placeholder="e.g. St. Patrick's Academy" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Workspace Subdomain</label>
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      required 
                      value={newInst.subdomain} 
                      onChange={(e) => { 
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); 
                        setNewInst({ ...newInst, subdomain: val }); 
                      }} 
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-[24px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-indigo-600 text-lg placeholder:text-slate-300" 
                      placeholder="st-pats" 
                    />
                    <div className="px-6 py-4 bg-slate-100 border border-slate-200 border-l-0 rounded-r-[24px] text-slate-500 font-bold text-base">.educhain.cloud</div>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400 font-medium px-1">Must be unique and contain only lowercase letters, numbers, and hyphens.</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[32px] text-[11px] text-indigo-800 leading-relaxed flex items-start space-x-4">
                <ShieldAlert className="shrink-0 mt-0.5 text-indigo-500" size={20} />
                <p className="font-bold">Automated deployment will allocate isolated data storage and core logic handlers for this tenant upon confirmation.</p>
              </div>

              <div className="flex items-center gap-5 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={formLoading} className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  {formLoading ? <Loader2 className="animate-spin" size={24} /> : <>Initialize Deployment <ArrowRight size={20} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionsManager;
