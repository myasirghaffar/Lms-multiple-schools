
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Download, ArrowUpRight, X, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const StudentManager: React.FC = () => {
  const { isDemo } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', class: '10-A', parent: '', studentId: '' });

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
    const mockStudents = [
      { id: '1', name: 'Alice Thompson', studentId: 'S-2024-001', class: '10-A', parent: 'John Thompson', status: 'Active', gpa: '3.8' },
      { id: '2', name: 'Bob Miller', studentId: 'S-2024-002', class: '10-A', parent: 'Sarah Miller', status: 'Active', gpa: '3.2' },
      { id: '3', name: 'Charlie Davis', studentId: 'S-2024-003', class: '11-B', parent: 'Michael Davis', status: 'Pending', gpa: '3.5' },
      { id: '4', name: 'Diana Prince', studentId: 'S-2024-004', class: '9-C', parent: 'Hippolyta Prince', status: 'Active', gpa: '4.0' },
      { id: '5', name: 'Ethan Hunt', studentId: 'S-2024-005', class: '12-A', parent: 'Mission Impossible', status: 'Inactive', gpa: '2.9' },
    ];
    
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const handleAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newStudent = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      class: formData.class,
      parent: formData.parent,
      studentId: formData.studentId || `S-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      gpa: '0.0'
    };
    setStudents([newStudent, ...students]);
    setFormLoading(false);
    setIsModalOpen(false);
    setFormData({ name: '', class: '10-A', parent: '', studentId: '' });
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students by name, ID or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Download size={20} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
            <UserPlus size={18} />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class / Section</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPA</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse h-16">
                    <td colSpan={5} className="px-6 py-4"><div className="h-8 bg-slate-50 rounded"></div></td>
                  </tr>
                ))
              ) : filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-400">Parent: {student.parent}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-semibold text-slate-600">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100">
                      Grade {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{student.gpa}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !formLoading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">New Admission</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdmission} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Student Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Class Assignment</label>
                    <select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none">
                      <option>10-A</option>
                      <option>10-B</option>
                      <option>11-A</option>
                      <option>12-A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Student ID</label>
                    <input type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="Auto-generated" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Parent/Guardian Name</label>
                  <input required type="text" value={formData.parent} onChange={e => setFormData({...formData, parent: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none" />
                </div>
              </div>
              <button type="submit" disabled={formLoading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 flex items-center justify-center gap-2">
                {formLoading ? <Loader2 className="animate-spin" size={24} /> : <>Register Student <ArrowRight size={20} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
