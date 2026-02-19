
import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Check, 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Download, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const mockStudents = [
  { id: '1', name: 'Alice Thompson', studentId: 'SCH-2024-001', class: '10-A', status: 'present' },
  { id: '2', name: 'Bob Miller', studentId: 'SCH-2024-002', class: '10-A', status: 'absent' },
  { id: '3', name: 'Charlie Davis', studentId: 'SCH-2024-003', class: '10-A', status: 'late' },
  { id: '4', name: 'Diana Prince', studentId: 'SCH-2024-004', class: '10-A', status: 'present' },
  { id: '5', name: 'Ethan Hunt', studentId: 'SCH-2024-005', class: '10-A', status: 'present' },
];

const mockStudentHistory = [
  { date: '2024-03-15', status: 'present', class: 'Physics' },
  { date: '2024-03-14', status: 'present', class: 'Physics' },
  { date: '2024-03-13', status: 'late', class: 'Mathematics' },
  { date: '2024-03-12', status: 'present', class: 'History' },
  { date: '2024-03-11', status: 'absent', class: 'Chemistry' },
];

const mockAdminSummary = [
  { class: '10-A', total: 32, present: 28, absent: 2, late: 2, percentage: '87.5%' },
  { class: '10-B', total: 28, present: 27, absent: 1, late: 0, percentage: '96.4%' },
  { class: '11-A', total: 45, present: 40, absent: 3, late: 2, percentage: '88.8%' },
  { class: '12-A', total: 38, present: 38, absent: 0, late: 0, percentage: '100%' },
];

const Attendance: React.FC = () => {
  const { profile } = useAuth();
  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher';
  const isAdmin = profile?.role === 'institution_admin' || profile?.role === 'super_admin';

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState(mockStudents);

  const updateStatus = (id: string, status: string) => {
    setAttendance(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="space-y-6">
      {/* Role-Specific Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isStudent ? (
          <>
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">My Average</p>
                <h3 className="text-3xl font-black">94.2%</h3>
              </div>
              <TrendingUp size={40} className="opacity-20" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Days Absent</p>
                <h3 className="text-3xl font-bold text-slate-800">02</h3>
              </div>
              <AlertCircle size={40} className="text-rose-100" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">On-Time Rate</p>
                <h3 className="text-3xl font-bold text-slate-800">98%</h3>
              </div>
              <CheckCircle2 size={40} className="text-emerald-100" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">{isAdmin ? 'Inst. Average' : 'Class Average'}</p>
                <h3 className="text-3xl font-black">92.8%</h3>
              </div>
              <Users size={40} className="opacity-20" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Critical Alerts</p>
                <h3 className="text-3xl font-bold text-slate-800">08</h3>
              </div>
              <AlertCircle size={40} className="text-rose-100" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Top Cohort</p>
                <h3 className="text-3xl font-bold text-slate-800">12-A</h3>
              </div>
              <CheckCircle2 size={40} className="text-emerald-100" />
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-8 rounded-[40px] border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-12 pr-6 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none font-bold text-sm text-slate-700 transition-all"
              />
            </div>
            { (isTeacher || isAdmin) && (
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="pl-12 pr-10 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-sm text-slate-700 appearance-none cursor-pointer">
                  <option>Class 10-A</option>
                  <option>Class 10-B</option>
                  <option>Class 11-A</option>
                  <option>Class 12-A</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100">
              <Download size={20} />
            </button>
            <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100">
              <Filter size={20} />
            </button>
            { (isTeacher || isAdmin) && (
              <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                Publish Register
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {isStudent ? (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Marked Date</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Assigned Class</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockStudentHistory.map((rec, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4 font-bold text-slate-700">
                        <Calendar size={18} className="text-slate-300" />
                        {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-10 py-6 font-bold text-slate-500">{rec.class}</td>
                    <td className="px-10 py-6 text-right">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        rec.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                        rec.status === 'late' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : isAdmin ? (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cohort / Section</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Daily Status (P/A/L)</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockAdminSummary.map((sum, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-10 py-6 font-black text-slate-800 text-lg">Grade {sum.class}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <p className="text-xs font-black text-emerald-600">{sum.present}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase">Pres</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-black text-rose-500">{sum.absent}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase">Abs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-black text-amber-500">{sum.late}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase">Lat</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-xl font-black text-indigo-600">{sum.percentage}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Profile</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Reference ID</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Attendance Status</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendance.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-100 flex items-center justify-center text-slate-600 font-black border-2 border-white shadow-sm group-hover:bg-white group-hover:scale-105 transition-all">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs text-slate-500 font-mono font-bold tracking-tighter">{student.studentId}</td>
                    <td className="px-10 py-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateStatus(student.id, 'present')}
                          className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${student.status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => updateStatus(student.id, 'absent')}
                          className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${student.status === 'absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => updateStatus(student.id, 'late')}
                          className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${student.status === 'late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                        >
                          <Clock size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Full History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {isStudent ? mockStudentHistory.length : isTeacher ? attendance.length : mockAdminSummary.length} Records Detected
          </p>
          <div className="flex space-x-3">
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-95 shadow-sm"><ChevronLeft size={20} /></button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-95 shadow-sm"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
