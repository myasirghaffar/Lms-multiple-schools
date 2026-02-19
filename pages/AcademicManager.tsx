
import React, { useState } from 'react';
import { BookOpen, Layers, Plus, ChevronRight, Settings, Grid, List, MoreVertical } from 'lucide-react';

const AcademicManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'sessions' | 'subjects'>('classes');

  const mockClasses = [
    { id: '1', name: 'Grade 1', sections: ['A', 'B', 'C'], students: 84 },
    { id: '2', name: 'Grade 2', sections: ['A', 'B'], students: 62 },
    { id: '3', name: 'Grade 3', sections: ['A', 'B', 'D'], students: 75 },
    { id: '4', name: 'Grade 4', sections: ['A'], students: 30 },
    { id: '5', name: 'Grade 10', sections: ['A', 'B', 'C', 'D'], students: 120 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border w-fit shadow-sm">
        <button 
          onClick={() => setActiveSubTab('classes')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'classes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Classes & Sections
        </button>
        <button 
          onClick={() => setActiveSubTab('sessions')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'sessions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Academic Sessions
        </button>
        <button 
          onClick={() => setActiveSubTab('subjects')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'subjects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Subject Registry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              {activeSubTab === 'classes' ? 'Class Configuration' : activeSubTab === 'sessions' ? 'Yearly Sessions' : 'Global Subjects'}
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
              <Plus size={18} />
              <span>Add New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockClasses.map((cls) => (
              <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {cls.name.match(/\d+/)?.[0] || 'G'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{cls.name}</h4>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{cls.students} Enrolled Students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {cls.sections.map((s, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                        {s}
                      </div>
                    ))}
                  </div>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Settings size={18} />
              Quick Actions
            </h4>
            <div className="space-y-2 mt-4">
              <button className="w-full text-left p-3 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Bulk Assign Sections</button>
              <button className="w-full text-left p-3 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Generate Class Lists</button>
              <button className="w-full text-left p-3 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Promote Students</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicManager;
