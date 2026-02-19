
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  GraduationCap,
  ClipboardList,
  FileText,
  ShieldCheck,
  Zap,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-bold text-sm">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    // Global items
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'institution_admin', 'teacher', 'student'] },
    
    // Super Admin specific
    { id: 'institutions', label: 'All Institutions', icon: ShieldCheck, roles: ['super_admin'] },
    { id: 'plans', label: 'Subscription Plans', icon: Zap, roles: ['super_admin'] },
    
    // Tenant specific
    { id: 'classes', label: 'Academic Management', icon: BookOpen, roles: ['institution_admin'] },
    { id: 'teachers', label: 'Teachers', icon: Users, roles: ['institution_admin'] },
    { id: 'staffing', label: 'Staffing', icon: UserCheck, roles: ['institution_admin'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['institution_admin', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: Calendar, roles: ['institution_admin', 'teacher', 'student'] },
    { id: 'fees', label: 'Fees & Finance', icon: CreditCard, roles: ['institution_admin', 'student'] },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, roles: ['teacher', 'student'] },
    { id: 'exams', label: 'Exams & Results', icon: FileText, roles: ['institution_admin', 'teacher', 'student'] },
    
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['institution_admin', 'teacher', 'student', 'super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">EduChain</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-8 py-10">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-slate-800">EduChain</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {filteredMenuItems.map(item => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white shrink-0">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{profile?.full_name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{profile?.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        <div className="max-w-[1400px] mx-auto p-4 md:p-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 capitalize tracking-tight">
                {activeTab.replace('_', ' ')}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {profile?.role === 'super_admin' ? 'Global Platform Administration' : 'Enterprise LMS Environment'}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="relative p-3 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm active:scale-95 group">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform"></span>
              </button>
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Institutional Access</p>
                <p className="text-sm font-bold text-slate-700">
                  {profile?.role === 'super_admin' ? 'EduChain Global HQ' : 'Central High School'}
                </p>
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
