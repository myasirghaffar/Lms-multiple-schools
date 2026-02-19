
import React from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Award, 
  CheckCircle2, 
  MoreVertical, 
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ExamManager: React.FC = () => {
  const { profile } = useAuth();
  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher';
  const isAdmin = profile?.role === 'institution_admin' || profile?.role === 'super_admin';

  const mockExams = [
    { id: '1', title: 'Mathematics Mid-Term', class: 'Grade 10', date: '2024-04-15', status: 'Scheduled', subjects: 6, room: 'Hall A' },
    { id: '2', title: 'Science Lab Assessment', class: 'Grade 12', date: '2024-03-20', status: 'In Progress', subjects: 8, room: 'Lab 2' },
    { id: '3', title: 'History Final Review', class: 'Grade 9', date: '2024-05-01', status: 'Draft', subjects: 5, room: 'Room 104' },
  ];

  const studentSchedule = [
    { id: 'e1', subject: 'Calculus II', date: 'Mar 25', time: '09:00 AM', room: 'Block C-12', status: 'Upcoming' },
    { id: 'e2', subject: 'Quantum Physics', date: 'Mar 28', time: '01:30 PM', room: 'Main Lab', status: 'Upcoming' },
    { id: 'e3', subject: 'History of Art', date: 'Apr 02', time: '10:00 AM', room: 'Library', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-10 rounded-[48px] text-white flex items-center justify-between shadow-2xl shadow-indigo-100 overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">
              {isStudent ? 'Total Assessments' : 'Active Examinations'}
            </p>
            <h3 className="text-4xl font-black">{isStudent ? '03' : '04'}</h3>
          </div>
          <FileText size={80} className="absolute -right-5 -bottom-5 text-indigo-500 opacity-30 group-hover:scale-110 transition-transform duration-700" />
        </div>
        
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 flex items-center justify-between shadow-sm relative group">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              {isStudent ? 'Target Score' : 'Global Avg. Score'}
            </p>
            <h3 className="text-4xl font-black text-slate-800">{isStudent ? '95%' : '74%'}</h3>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[24px] group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            <Award size={32} />
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 flex items-center justify-between shadow-sm relative group">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              {isStudent ? 'Hall Pass Status' : 'Overall Pass Rate'}
            </p>
            <h3 className="text-4xl font-black text-slate-800">{isStudent ? 'Valid' : '91.2%'}</h3>
          </div>
          <div className="bg-amber-50 text-amber-600 p-6 rounded-[24px] group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
            <ShieldCheck size={32} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {isStudent ? 'My Assessment Registry' : 'Strategic Exam Schedules'}
          </h3>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Session 2023-2024 • Term II</p>
        </div>
        { (isAdmin || isTeacher) && (
          <button className="flex items-center space-x-3 px-10 py-4 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm uppercase tracking-widest">
            <Plus size={20} />
            <span>New Examination</span>
          </button>
        )}
      </div>

      {isStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Calendar size={14} className="text-indigo-500" />
              Incoming Schedule
            </h4>
            <div className="space-y-4">
              {studentSchedule.map((exam) => (
                <div key={exam.id} className="bg-white p-8 rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100">
                      {exam.subject.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{exam.subject}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {exam.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {exam.time}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 mb-2">{exam.room}</p>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1 ml-auto">
                      Hall Ticket <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Info size={14} className="text-amber-500" />
              Candidate Guidelines
            </h4>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Reporting Time</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Students must arrive at the examination center at least 30 minutes before the scheduled start time.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Verification Policy</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">A valid institutional identity card and hall ticket are mandatory for entry to all venues.</p>
                </div>
              </div>
              <button className="w-full bg-slate-50 text-slate-600 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">
                Download Global Ruleset (PDF)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockExams.map((exam) => (
            <div key={exam.id} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-2.5 h-full ${
                exam.status === 'Scheduled' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : exam.status === 'In Progress' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-300'
              }`}></div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                    exam.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                    exam.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {exam.status}
                  </span>
                  <h4 className="text-2xl font-black text-slate-800 mt-5 leading-tight group-hover:text-indigo-600 transition-colors">{exam.title}</h4>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{exam.class}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exam.subjects} Subjects Mapped</span>
                  </div>
                </div>
                <button className="p-3 text-slate-300 hover:bg-slate-50 rounded-2xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Calendar size={12} /> Launch Date
                  </p>
                  <p className="text-sm font-black text-slate-700">{new Date(exam.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} /> Location
                  </p>
                  <p className="text-sm font-black text-slate-700">{exam.room}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <button className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-indigo-50 px-5 py-3 rounded-2xl transition-all group/btn">
                  <CheckCircle2 size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                  Manage Results
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
                  <Info size={18} />
                </button>
              </div>
            </div>
          ))}

          <button className="border-4 border-dashed border-slate-100 rounded-[56px] p-12 flex flex-col items-center justify-center space-y-6 hover:bg-slate-50 hover:border-indigo-100 transition-all group relative overflow-hidden">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:shadow-xl transition-all group-hover:scale-110 duration-500">
              <Plus size={40} />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-800 text-xl tracking-tight">Provision Exam</p>
              <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Global Scheduling Engine</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamManager;
