
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  ChevronRight, 
  Edit3, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Mail,
  Smartphone,
  Download,
  Receipt
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type SettingsView = 'main' | 'profile' | 'security' | 'subdomain' | 'billing' | 'notifications';

const Settings: React.FC = () => {
  const { profile, isDemo } = useAuth();
  const [activeView, setActiveView] = useState<SettingsView>('main');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock Profile Form
  const [profileForm, setProfileForm] = useState({
    name: profile?.full_name || '',
    email: profile?.email || ''
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    await new Promise(r => setTimeout(r, 1200));
    setUpdating(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setActiveView('main');
    }, 2000);
  };

  const renderView = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Settings
            </button>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-8">Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input 
                    value={profileForm.name}
                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                  />
                </div>
                <button 
                  disabled={updating || success}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    success ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                  }`}
                >
                  {updating ? <Loader2 className="animate-spin" size={20} /> : success ? <><CheckCircle2 size={20} /> Profile Updated</> : 'Sync Changes'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Settings
            </button>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-8">Credential Security</h3>
              <div className="space-y-6">
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4">
                  <Lock className="text-rose-600 shrink-0" size={24} />
                  <div>
                    <p className="text-sm font-bold text-rose-900">Rotation Recommended</p>
                    <p className="text-xs text-rose-700 mt-1">Your password was last changed 4 months ago. For maximum security, we suggest a refresh.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:bg-white transition-all text-left px-6 flex items-center justify-between">
                    Update Password <ChevronRight size={18} />
                  </button>
                  <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:bg-white transition-all text-left px-6 flex items-center justify-between">
                    Enable 2FA Authentication <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => setActiveView('main')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Settings
            </button>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800">Financial History</h3>
                <Receipt className="text-indigo-600" size={32} />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Invoice #ED-2024-00{i}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">March {10 - i}, 2024</p>
                      </div>
                    </div>
                    <button className="p-3 text-indigo-600 bg-white border border-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Profile Header Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-8 text-center sm:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[36px] bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-100 border-4 border-white shrink-0">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">
                      {profile?.full_name}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mt-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 whitespace-nowrap">
                        {profile?.role.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium text-slate-400 truncate w-full">
                        {profile?.email}
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={() => setActiveView('profile')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-white hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                      <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="space-y-10 pb-20">
              {settingsGroups.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-6">{group.title}</h3>
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                    {group.items.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          if (item.label.includes('Profile')) setActiveView('profile');
                          if (item.label.includes('Security')) setActiveView('security');
                          if (item.label.includes('Billing')) setActiveView('billing');
                          if (item.label.includes('Subdomain')) setActiveView('subdomain');
                          if (item.label.includes('Notification')) setActiveView('notifications');
                        }}
                        className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`${item.bg} ${item.color} p-4 rounded-2xl transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/10 shrink-0`}>
                            <item.icon size={22} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 text-base md:text-lg group-hover:text-indigo-600 transition-colors leading-tight">{item.label}</h4>
                            <p className="text-xs md:text-sm text-slate-400 mt-1 line-clamp-1">{item.desc}</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* System Info Footnote */}
              <div className="p-8 md:p-10 bg-indigo-50/30 rounded-[48px] border border-indigo-50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800">Cluster Security Protocol</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Your data is secured with AES-256 multi-tenant isolation and per-session encryption keys.</p>
                  </div>
                </div>
                <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline whitespace-nowrap">View Global Audit Log</button>
              </div>
            </div>
          </div>
        );
    }
  };

  const settingsGroups = [
    {
      title: 'Personal Account',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Manage your personal data and institutional ID.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { icon: Lock, label: 'Security & Password', desc: 'Update your authentication credentials and 2FA.', color: 'text-rose-600', bg: 'bg-rose-50' },
      ]
    },
    {
      title: 'Institution & Platform',
      items: [
        ...(profile?.role === 'institution_admin' || profile?.role === 'super_admin' ? [
          { icon: Globe, label: 'Subdomain Management', desc: 'Configure custom domains and SSL status.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Shield, label: 'Privacy & Permissions', desc: 'Define access control lists for staff and students.', color: 'text-amber-600', bg: 'bg-amber-50' },
        ] : []),
        { icon: Bell, label: 'Notification Settings', desc: 'Configure global push and email alerts.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      ]
    },
    {
      title: 'Subscription',
      items: [
        { icon: CreditCard, label: 'Billing & Invoices', desc: 'Manage payment methods and download historical bills.', color: 'text-slate-600', bg: 'bg-slate-100' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {renderView()}
    </div>
  );
};

export default Settings;
