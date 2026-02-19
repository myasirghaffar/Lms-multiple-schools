
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CheckCircle2,
  TrendingUp,
  FileText,
  CreditCard,
  Building,
  Activity,
  Globe,
  ShieldCheck,
  PieChart as PieChartIcon,
  Loader2,
  Bell,
  Clock,
  ExternalLink,
  Award,
  Check
} from 'lucide-react';
import { StatsCard, DashboardGrid } from '../components/DashboardCards';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Cell,
  Pie,
  Legend
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const isSuper = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'institution_admin';
  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data for the dashboard
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardGrid>
        {isSuper ? (
          <>
            <StatsCard title="Total Institutions" value="142" change="Active: 128" icon={Building} color="bg-indigo-600" />
            <StatsCard title="Platform Users" value="84,200" change="+12%" icon={Users} color="bg-emerald-500" />
            <StatsCard title="System Status" value="99.98%" change="Healthy" icon={Activity} color="bg-orange-500" />
            <StatsCard title="Monthly Revenue" value="$24,500" change="+15.4%" icon={TrendingUp} color="bg-rose-500" />
          </>
        ) : isAdmin ? (
          <>
            <StatsCard title="Total Students" value="1,284" change="+12%" icon={Users} color="bg-indigo-600" />
            <StatsCard title="Active Teachers" value="48" change="+2%" icon={GraduationCap} color="bg-emerald-500" />
            <StatsCard title="Inst. Attendance" value="94.2%" change="+1.5%" icon={Calendar} color="bg-orange-500" />
            <StatsCard title="Total Collected" value="$42,800" change="+8%" icon={CreditCard} color="bg-rose-500" />
          </>
        ) : isTeacher ? (
          <>
            <StatsCard title="My Students" value="184" icon={Users} color="bg-indigo-600" />
            <StatsCard title="Active Classes" value="06" icon={BookOpen} color="bg-emerald-500" />
            <StatsCard title="Class Attendance" value="96.5%" icon={CheckCircle2} color="bg-orange-500" />
            <StatsCard title="Pending Grading" value="14" icon={FileText} color="bg-rose-500" />
          </>
        ) : (
          <>
            <StatsCard title="My GPA" value="3.85" change="+0.2" icon={Award} color="bg-indigo-600" />
            <StatsCard title="Attendance" value="98%" change="This Month" icon={Calendar} color="bg-emerald-500" />
            <StatsCard title="Tasks Pending" value="03" icon={Clock} color="bg-orange-500" />
            <StatsCard title="Next Exam" value="Tomorrow" icon={FileText} color="bg-rose-500" />
          </>
        )}
      </DashboardGrid>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {isSuper ? 'Global Revenue' : isAdmin ? 'Collection Trends' : isTeacher ? 'Average Marks by Class' : 'My Grade Progression'}
              </h3>
              <p className="text-sm text-slate-500">
                {isSuper ? 'Monthly earnings across all tenants' : isAdmin ? 'Tuition and laboratory fee receipts' : isTeacher ? 'Performance across your assigned cohorts' : 'Your performance across recent assessments'}
              </p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {isStudent ? (
                <AreaChart data={[
                  { name: 'Unit 1', score: 85 },
                  { name: 'Unit 2', score: 88 },
                  { name: 'Midterm', score: 92 },
                  { name: 'Unit 3', score: 87 },
                  { name: 'Finals', score: 95 },
                ]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              ) : (
                <BarChart data={
                  isTeacher ? [
                    { name: 'Grade 10A', avg: 78 },
                    { name: 'Grade 10B', avg: 82 },
                    { name: 'Grade 12A', avg: 89 },
                    { name: 'Grade 12C', avg: 74 },
                  ] : [
                    { name: 'Jan', val: 18400 },
                    { name: 'Feb', val: 19200 },
                    { name: 'Mar', val: 21500 },
                    { name: 'Apr', val: 22100 },
                    { name: 'May', val: 23800 },
                    { name: 'Jun', val: 24500 },
                  ]
                }>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey={isTeacher ? "avg" : "val"} fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon size={20} className="text-indigo-600" />
              {isSuper ? 'Market Share' : isAdmin ? 'Department Split' : isTeacher ? 'Mark Distribution' : 'Subject Breakdown'}
            </h3>
            <p className="text-sm text-slate-500">
              {isSuper ? 'By subscription tier' : isAdmin ? 'Teacher allocation by dept' : isTeacher ? 'Latest assessment results' : 'Time spent per subject'}
            </p>
          </div>
          
          <div className="flex-1 h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    isSuper ? [
                      { name: 'Basic', value: 45 }, { name: 'Pro', value: 72 }, { name: 'Enterprise', value: 25 }
                    ] : isAdmin ? [
                      { name: 'Science', value: 15 }, { name: 'Maths', value: 12 }, { name: 'Arts', value: 8 }, { name: 'Sports', value: 13 }
                    ] : isTeacher ? [
                      { name: 'A Grade', value: 42 }, { name: 'B Grade', value: 88 }, { name: 'C Grade', value: 34 }, { name: 'Failing', value: 20 }
                    ] : [
                      { name: 'Mathematics', value: 40 }, { name: 'Physics', value: 30 }, { name: 'History', value: 20 }, { name: 'Other', value: 10 }
                    ]
                  }
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-700">
                {isSuper ? 'Cloud Health' : isAdmin ? 'Enrollment Goal' : isTeacher ? 'Curriculum Progress' : 'Weekly Goal'}
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">85%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xl tracking-tight">
              {isSuper ? 'Security Events' : isAdmin ? 'Recent Activities' : isTeacher ? 'Pending Submissions' : 'Academic Timeline'}
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">View Full Log</button>
          </div>
          <div className="divide-y divide-slate-50">
            {(isSuper ? [
              { id: 1, type: 'security', msg: 'Firewall: Blocked 4.2k requests (IP Range US-East)', time: '12 mins ago', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 2, type: 'billing', msg: 'Payout of $14,200 initiated (Stripe)', time: '2 hours ago', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 3, type: 'alert', msg: 'System Backup: S3 Replication completed', time: '4 hours ago', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
            ] : isAdmin ? [
              { id: 1, type: 'onboard', msg: '12 new student admissions processed', time: '1 hour ago', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 2, type: 'fee', msg: 'Bulk fee reminder sent to Grade 10', time: '3 hours ago', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 3, type: 'staff', msg: 'Dr. Sarah Wilson assigned to Grade 12 Physics', time: '5 hours ago', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50' },
            ] : isTeacher ? [
              { id: 1, type: 'sub', msg: 'World War II Summary - 12 new files', time: '10 mins ago', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 2, type: 'sub', msg: 'Linear Equations Lab - 5 new files', time: '2 hours ago', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 3, type: 'exam', msg: 'Mid-term results pending for 10A', time: 'Yest, 4:00 PM', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
            ] : [
              { id: 1, type: 'grade', msg: 'Mathematics Exam: Scored 94/100', time: '2 hours ago', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 2, type: 'task', msg: 'New Assignment: Biology Lab Report', time: '5 hours ago', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 3, type: 'notice', msg: 'Sports Day rescheduled for Saturday', time: 'Yest, 9:00 AM', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
            ]).map(item => (
              <div key={item.id} className="p-6 flex items-center space-x-5 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className={`${item.bg} ${item.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{item.msg}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <Clock size={12} /> {item.time}
                  </p>
                </div>
                <ExternalLink size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-2xl mb-3 tracking-tight">
                {isSuper ? 'Cluster Status' : isAdmin ? 'Admin Deck' : isTeacher ? 'Marking Lab' : 'Goal Tracker'}
              </h4>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed opacity-80">
                {isSuper ? 'All database nodes are synchronized with 24ms latency.' : isAdmin ? 'Access the institution configuration engine.' : isTeacher ? 'Open the advanced automated grading assistant.' : 'You are only 12% away from your semester GPA goal.'}
              </p>
              <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-50 active:scale-95 transition-all">
                {isSuper ? 'Infrastucture Maps' : isAdmin ? 'Configure School' : isTeacher ? 'Open Lab' : 'View Plan'}
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
              <Bell size={20} className="text-amber-500" />
              Institutional Feed
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
                <p className="text-xs font-black text-slate-700 tracking-tight uppercase group-hover:text-indigo-600">Maintenance Window</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Infrastructure upgrade scheduled for Saturday 2:00 AM UTC.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
                <p className="text-xs font-black text-slate-700 tracking-tight uppercase group-hover:text-indigo-600">v3.0 Release Notes</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">AI-powered predictive analytics is now active for all cohorts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
