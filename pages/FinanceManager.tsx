
import React from 'react';
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Download, 
  Calendar, 
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Receipt,
  // Added missing imports for pagination controls
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DashboardGrid, StatsCard } from '../components/DashboardCards';
import { useAuth } from '../hooks/useAuth';

const FinanceManager: React.FC = () => {
  const { profile } = useAuth();
  const isStudent = profile?.role === 'student';
  const isAdmin = profile?.role === 'institution_admin' || profile?.role === 'super_admin';

  const mockAdminFees = [
    { id: '1', student: 'Alice Thompson', class: '10-A', title: 'Q1 Tuition Fee', amount: 1200, paid: 1200, status: 'paid', date: '2024-03-01' },
    { id: '2', student: 'Bob Miller', class: '10-A', title: 'Q1 Tuition Fee', amount: 1200, paid: 600, status: 'partial', date: '2024-03-05' },
    { id: '3', student: 'Charlie Davis', class: '11-B', title: 'Laboratory Charges', amount: 350, paid: 0, status: 'pending', date: '2024-03-10' },
    { id: '4', student: 'Diana Prince', class: '9-C', title: 'Quarterly Sports Fee', amount: 150, paid: 150, status: 'paid', date: '2024-02-28' },
  ];

  const mockStudentLedger = [
    { id: 'l1', title: 'Annual Tuition Fee', total: 4800, remaining: 1200, status: 'partial', due: 'Apr 15' },
    { id: 'l2', title: 'Library Membership', total: 120, remaining: 0, status: 'paid', due: '-' },
    { id: 'l3', title: 'Exam Registration (Term II)', total: 250, remaining: 250, status: 'pending', due: 'Mar 25' },
  ];

  const mockStudentHistory = [
    { id: 'h1', date: 'Mar 01, 2024', amount: 1200, method: 'Stripe / Card', type: 'Tuition' },
    { id: 'h2', date: 'Feb 15, 2024', amount: 120, method: 'PayPal', type: 'Library' },
    { id: 'h3', date: 'Jan 10, 2024', amount: 1200, method: 'Stripe / Card', type: 'Tuition' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner Stats */}
      <DashboardGrid>
        {isAdmin ? (
          <>
            <StatsCard title="Total Collected" value="$84,200" change="+12%" icon={ArrowUpCircle} color="bg-indigo-600" />
            <StatsCard title="Outstanding" value="$12,450" change="-5%" icon={ArrowDownCircle} color="bg-rose-500" />
            <StatsCard title="Expensing" value="$28,300" change="+2%" icon={DollarSign} color="bg-amber-500" />
            <StatsCard title="Collection Rate" value="92.4%" change="+1.5%" icon={CreditCard} color="bg-emerald-500" />
          </>
        ) : (
          <>
            <StatsCard title="My Balance" value="$1,450" change="Pending Dues" icon={Clock} color="bg-rose-500" />
            <StatsCard title="Total Paid" value="$3,420" change="This Session" icon={CheckCircle2} color="bg-emerald-500" />
            <StatsCard title="Next Due" value="Mar 25" change="Exam Fee" icon={Calendar} color="bg-amber-500" />
            <StatsCard title="Ledger Status" value="Healthy" icon={ShieldCheck} color="bg-indigo-600" />
          </>
        )}
      </DashboardGrid>

      {isStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Active Dues */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Dues</h3>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 text-xs uppercase tracking-widest">
                Pay Selected
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockStudentLedger.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    item.status === 'paid' ? 'bg-emerald-500' : item.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <Receipt size={24} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      item.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'partial' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h4>
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Outstanding</p>
                      <p className="text-2xl font-black text-slate-800">${item.remaining}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-black text-slate-600">{item.due}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 tracking-tight px-2 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              Receipt History
            </h3>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {mockStudentHistory.map((h) => (
                  <div key={h.id} className="p-6 hover:bg-slate-50/50 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-black text-slate-700">{h.type} Payment</p>
                      <span className="text-xs font-black text-emerald-600">+ ${h.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.date}</p>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {h.method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 hover:bg-slate-100 transition-all border-t border-slate-50">
                View All Statements
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-20">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase">Platform Invoicing Ledger</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter global transactions..." 
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" 
                />
              </div>
              <button className="p-3.5 bg-slate-50 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"><Filter size={20} /></button>
              <button className="p-3.5 bg-slate-50 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"><Download size={20} /></button>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Legal Entity / Invoiced To</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Assessment Description</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Financial Load</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Status</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Filing Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockAdminFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xs shadow-sm group-hover:bg-white transition-all">
                          {fee.student.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{fee.student}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{fee.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600 uppercase tracking-tight">{fee.title}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800">${fee.amount}</p>
                      {fee.paid < fee.amount && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1">Deficit: ${fee.amount - fee.paid}</p>}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        fee.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        fee.status === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs text-slate-500 font-bold">{new Date(fee.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cluster Node: FINANCE-WEST-01</p>
            <div className="flex space-x-3">
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-95 shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-95 shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
