
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  BookOpen, 
  MoreVertical, 
  Filter, 
  Loader2, 
  UserPlus, 
  X, 
  ArrowRight, 
  UserCheck,
  BarChart3,
  AlertTriangle,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TeacherManager: React.FC = () => {
  const { isDemo } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '', employeeId: '' });

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
    const mockTeachers = [
      { id: '1', name: 'Dr. Sarah Wilson', email: 's.wilson@school.edu', employeeId: 'T-2024-001', specialization: 'Advanced Mathematics', status: 'Active', joined: '2022-09-01', classes: 4, subjects: 2 },
      { id: '2', name: 'Prof. James Miller', email: 'j.miller@school.edu', employeeId: 'T-2024-002', specialization: 'Quantum Physics', status: 'Active', joined: '2023-01-15', classes: 2, subjects: 1 },
      { id: '3', name: 'Elena Rodriguez', email: 'e.rod@school.edu', employeeId: 'T-2024-003', specialization: 'Contemporary Art', status: 'Leave', joined: '2021-08-10', classes: 5, subjects: 3 },
      { id: '4', name: 'Robert Chen', email: 'r.chen@school.edu', employeeId: 'T-2024-004', specialization: 'Computer Science', status: 'Active', joined: '2023-11-20', classes: 6, subjects: 2 },
    ];
    
    setTimeout(() => {
      setTeachers(mockTeachers);
      setLoading(false);
    }, 600);
  }, []);

  const getWorkloadStatus = (classes: number, subjects: number) => {
    const index = classes + (subjects * 0.5);
    if (index >= 7) return { label: 'Critical', color: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-500', icon: AlertTriangle };
    if (index >= 5) return { label: 'High', color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', icon: BarChart3 };
    if (index >= 3) return { label: 'Balanced', color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-500', icon: UserCheck };
    return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500', icon: GraduationCap };
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newTeacher = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      specialization: formData.specialization,
      employeeId: formData.employeeId || `T-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active',
      joined: new Date().toISOString(),
      classes: 0,
      subjects: 0
    };
    setTeachers([newTeacher, ...teachers]);
    setFormLoading(false);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', specialization: '', employeeId: '' });
  };

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.employeeId.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search academic staff by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center space-x-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-[20px] font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={18} />
            <span className="text-sm">Filter</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            <UserPlus size={18} />
            <span className="text-sm">Onboard Teacher</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 animate-pulse space-y-4 h-64"></div>
          ))
        ) : filtered.map((teacher) => {
          const workload = getWorkloadStatus(teacher.classes || 0, teacher.subjects || 0);
          const WIcon = workload.icon;
          const loadPercent = Math.min(((teacher.classes + (teacher.subjects * 0.5)) / 8) * 100, 100);

          return (
            <div key={teacher.id} className="bg-white p-8 rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{teacher.name}</h3>
                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.15em] mt-1">{teacher.employeeId}</p>
                  </div>
                </div>
                <button className="p-3 text-slate-300 hover:bg-slate-50 rounded-2xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-4 rounded-[20px] border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                  <BookOpen size={18} className="mr-3 text-indigo-500 shrink-0" />
                  <span className="font-bold truncate">{teacher.specialization}</span>
                </div>
                
                {/* Workload Indicator Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WIcon size={14} className={workload.color} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${workload.color}`}>{workload.label} Workload</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{teacher.classes} Classes / {teacher.subjects} Subs</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${workload.bar} transition-all duration-700 ease-out`} 
                      style={{ width: `${loadPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${teacher.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{teacher.status}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Layers size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Joined {new Date(teacher.joined).getFullYear()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !formLoading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Onboard Staff</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">HR & Academic Registry</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"><X size={32} /></button>
            </div>
            <form onSubmit={handleOnboard} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="e.g. Dr. Jonathan Harker" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="staff@institution.edu" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                  <input type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} placeholder="Auto-gen" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 uppercase" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Specialization</label>
                  <input required type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Computational Fluid Dynamics" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" />
                </div>
              </div>
              <button type="submit" disabled={formLoading} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                {formLoading ? <Loader2 className="animate-spin" size={24} /> : <>Register Academic Staff <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManager;
