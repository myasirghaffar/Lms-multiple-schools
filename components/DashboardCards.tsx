
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 font-medium ${change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change} <span className="text-slate-400">vs last month</span>
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-xl`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export const DashboardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);
