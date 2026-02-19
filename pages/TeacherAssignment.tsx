
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  X, 
  Check, 
  Trash2, 
  Loader2, 
  ArrowRight,
  UserCheck,
  GraduationCap,
  Layers,
  ChevronRight,
  AlertCircle,
  Filter,
  Info,
  ChevronDown,
  SearchIcon,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
  UserPlus2,
  PieChart,
  Tag,
  BarChart3,
  SearchX,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Assignment {
  id: string;
  teacherName: string;
  teacherId: string;
  subject: string;
  class: string;
  section: string;
  assignedAt: string;
}

interface Teacher {
  id: string;
  name: string;
  dept: string;
  avatarColor: string;
}

const TeacherAssignment: React.FC = () => {
  const { isDemo } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  // Form State
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Dropdown States
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('All');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const teacherDropdownRef = useRef<HTMLDivElement>(null);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll Lock Management
  useEffect(() => {
    if (isModalOpen || assignmentToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen, assignmentToDelete]);

  const mockTeachers: Teacher[] = [
    { id: 't1', name: 'Dr. Sarah Wilson', dept: 'Science', avatarColor: 'bg-indigo-500' },
    { id: 't2', name: 'Prof. James Miller', dept: 'Physics', avatarColor: 'bg-emerald-500' },
    { id: 't3', name: 'Robert Chen', dept: 'Technology', avatarColor: 'bg-amber-500' },
    { id: 't4', name: 'Elena Rodriguez', dept: 'Arts', avatarColor: 'bg-rose-500' },
    { id: 't5', name: 'Michael Grant', dept: 'History', avatarColor: 'bg-indigo-400' },
    { id: 't6', name: 'Dr. Emily Blunt', dept: 'Mathematics', avatarColor: 'bg-purple-500' }
  ];

  const teacherDepts = ['All', ...Array.from(new Set(mockTeachers.map(t => t.dept)))];

  const mockSubjects = [
    'Mathematics', 'Quantum Physics', 'Computer Science', 'History', 'Biology', 'Advanced Calculus', 'Organic Chemistry', 'Art History', 'Microbiology'
  ];

  const mockClasses = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const availableSections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    fetchAssignments();
    const handleClickOutside = (event: MouseEvent) => {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
      }
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        const saved = localStorage.getItem('educhain_mock_assignments');
        if (saved) {
          setAssignments(JSON.parse(saved));
        } else {
          const initial: Assignment[] = [
            { id: '1', teacherName: 'Dr. Sarah Wilson', teacherId: 't1', subject: 'Mathematics', class: 'Grade 10', section: 'A', assignedAt: new Date().toISOString() },
            { id: '2', teacherName: 'Prof. James Miller', teacherId: 't2', subject: 'Quantum Physics', class: 'Grade 12', section: 'B', assignedAt: new Date().toISOString() },
            { id: '3', teacherName: 'Robert Chen', teacherId: 't3', subject: 'Computer Science', class: 'Grade 11', section: 'A', assignedAt: new Date().toISOString() },
          ];
          setAssignments(initial);
          localStorage.setItem('educhain_mock_assignments', JSON.stringify(initial));
        }
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedTeacher || !selectedSubject || !selectedClass || selectedSections.length === 0) {
      setFormError("Please select a teacher, subject, class, and at least one section.");
      return;
    }

    setFormLoading(true);

    try {
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newMappings: Assignment[] = selectedSections.map(section => ({
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          teacherName: selectedTeacher.name,
          teacherId: selectedTeacher.id,
          subject: selectedSubject!,
          class: selectedClass,
          section: section,
          assignedAt: new Date().toISOString()
        }));

        const updated = [...newMappings, ...assignments];
        setAssignments(updated);
        localStorage.setItem('educhain_mock_assignments', JSON.stringify(updated));
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || "Failed to create assignment.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTeacher(null);
    setSelectedSubject(null);
    setSelectedClass('');
    setSelectedSections([]);
    setTeacherSearch('');
    setTeacherDeptFilter('All');
    setSubjectSearch('');
  };

  const confirmRemoveAssignment = async () => {
    if (!assignmentToDelete) return;
    try {
      if (isDemo) {
        const updated = assignments.filter(a => a.id !== assignmentToDelete.id);
        setAssignments(updated);
        localStorage.setItem('educhain_mock_assignments', JSON.stringify(updated));
      }
      setAssignmentToDelete(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const getTeacherMetrics = (teacherId: string) => {
    const teacherAssignments = assignments.filter(a => a.teacherId === teacherId);
    const classesCount = teacherAssignments.length;
    const uniqueSubjects = new Set(teacherAssignments.map(a => a.subject)).size;
    const loadIndex = classesCount + (uniqueSubjects * 0.5);
    return { classesCount, uniqueSubjects, loadIndex };
  };

  const getLoadIndicator = (teacherId: string) => {
    const { loadIndex } = getTeacherMetrics(teacherId);
    if (loadIndex >= 7) return { color: 'bg-rose-500', text: 'Critical', bg: 'bg-rose-50', barColor: 'bg-rose-500' };
    if (loadIndex >= 5) return { color: 'bg-amber-500', text: 'High', bg: 'bg-amber-50', barColor: 'bg-amber-500' };
    if (loadIndex >= 3) return { color: 'bg-indigo-500', text: 'Balanced', bg: 'bg-indigo-50', barColor: 'bg-indigo-500' };
    return { color: 'bg-emerald-500', text: 'Light', bg: 'bg-emerald-50', barColor: 'bg-emerald-500' };
  };

  const WorkloadDot = ({ teacherId }: { teacherId: string }) => {
    const { loadIndex } = getTeacherMetrics(teacherId);
    const config = getLoadIndicator(teacherId);
    return (
      <div 
        className={`w-3 h-3 rounded-full ${config.color} border-2 border-white shadow-sm shrink-0`}
        title={`Workload Score: ${loadIndex.toFixed(1)} (${config.text})`}
      />
    );
  };

  const filteredAssignments = assignments.filter(a => 
    a.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = mockTeachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                         t.dept.toLowerCase().includes(teacherSearch.toLowerCase());
    const matchesDept = teacherDeptFilter === 'All' || t.dept === teacherDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredSubjects = mockSubjects.filter(s => 
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Analytics */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search faculty deployment registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>
            
            <button 
              onClick={() => {
                setFormError(null);
                setIsModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-[24px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 font-bold"
            >
              <Plus size={20} />
              <span>Map Academic Staff</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:w-[450px] gap-4">
          <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-100">
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Pairs</p>
            <h3 className="text-3xl font-bold">{assignments.length}</h3>
          </div>
          <div className="bg-emerald-500 p-6 rounded-[32px] text-white shadow-xl shadow-emerald-100">
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Coverage</p>
            <h3 className="text-3xl font-bold">92%</h3>
          </div>
          <div className="hidden md:block bg-white p-6 rounded-[32px] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Complexity</p>
            <h3 className="text-3xl font-bold text-slate-800">4.2</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 animate-pulse h-64"></div>
            ))
          ) : filteredAssignments.length > 0 ? filteredAssignments.map((item) => {
            const metrics = getTeacherMetrics(item.teacherId);
            const workload = getLoadIndicator(item.teacherId);
            const loadPercentage = Math.min((metrics.loadIndex / 8) * 100, 100);
            
            return (
              <div key={item.id} className="bg-white p-7 rounded-[48px] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[280px] border-b-4 border-b-indigo-500/0 hover:border-b-indigo-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shrink-0 relative">
                      <UserCheck size={28} />
                      <div className="absolute -top-1 -right-1">
                        <WorkloadDot teacherId={item.teacherId} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{item.teacherName}</h3>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Complexity Score</span>
                          <span className={workload.color.replace('bg-', 'text-')}>{metrics.loadIndex.toFixed(1)} / 8</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${workload.barColor} transition-all duration-700`} 
                            style={{ width: `${loadPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAssignmentToDelete(item)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all flex items-center justify-between">
                    <div className="flex items-center text-sm font-bold text-slate-700 truncate mr-2">
                      <BookOpen size={16} className="mr-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{item.subject}</span>
                    </div>
                    <div className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 whitespace-nowrap">
                      {item.class}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {item.section}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section Assigned</span>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[64px] border-2 border-dashed border-slate-100">
              <div className="bg-indigo-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-[12px] ring-indigo-50/50">
                <GraduationCap size={56} className="text-indigo-600" />
              </div>
              <h3 className="text-slate-800 font-bold text-3xl tracking-tight">No Active Staffing Layers</h3>
              <p className="text-slate-500 text-base mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                Academic coverage is currently empty. Define the instructor-curriculum relationship to begin.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-12 px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 inline-flex items-center gap-3 active:scale-95"
              >
                <UserPlus2 size={24} />
                Provision Academic Pair
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-20 animate-in fade-in duration-500">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Educator</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject Mapping</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Grade Level</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssignments.map(item => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs relative">
                        {item.teacherName.charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.teacherName}</span>
                        <WorkloadDot teacherId={item.teacherId} />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-semibold text-slate-600">{item.subject}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{item.class}</span>
                      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">{item.section}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => setAssignmentToDelete(item)}
                      className="p-3 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Advanced Mapping Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => !formLoading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[64px] shadow-2xl border border-white flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            {/* Left Sidebar Info */}
            <div className="w-full md:w-72 bg-indigo-600 p-12 text-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="bg-indigo-500 w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 shadow-inner ring-4 ring-indigo-500/30">
                  <UserPlus2 size={32} />
                </div>
                <h3 className="text-3xl font-bold tracking-tighter leading-tight mb-4">Academic Provisioning</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                  Define the mapping between staff, subjects, and multiple sections in a single operation.
                </p>
              </div>
              
              <div className="relative z-10 mt-12 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Intelligent Balancing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Complexity Analysis</span>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Form Area */}
            <div className="flex-1 bg-white p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 text-indigo-600 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  Infrastructure Control
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90"
                  disabled={formLoading}
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleAddAssignment} className="space-y-10">
                {formError && (
                  <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-start space-x-4 animate-in shake duration-500">
                    <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
                    <p className="text-sm font-bold text-rose-800 leading-snug">{formError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Searchable Teacher Select */}
                  <div className="space-y-3 relative" ref={teacherDropdownRef}>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Member</label>
                    <div 
                      onClick={() => !formLoading && setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                      className={`w-full px-6 py-5 bg-slate-50 border rounded-[32px] transition-all flex items-center justify-between cursor-pointer group hover:border-indigo-300 ${isTeacherDropdownOpen ? 'border-indigo-500 ring-4 ring-indigo-50 bg-white shadow-xl' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedTeacher ? (
                          <div className={`w-8 h-8 rounded-xl ${selectedTeacher.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                            {selectedTeacher.name.charAt(0)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center">
                            <Users size={16} />
                          </div>
                        )}
                        <span className={`font-bold transition-colors ${selectedTeacher ? 'text-slate-800' : 'text-slate-400'}`}>
                          {selectedTeacher ? selectedTeacher.name : 'Choose Teacher...'}
                        </span>
                      </div>
                      <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isTeacherDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </div>

                    {isTeacherDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-[120] mt-3 bg-white border border-slate-100 shadow-2xl rounded-[32px] overflow-hidden animate-in slide-in-from-top-4 duration-300 p-0 flex flex-col">
                        <div className="p-4 border-b border-slate-50 sticky top-0 bg-white space-y-4 shadow-sm">
                          <div className="relative group/search">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" size={16} />
                            <input 
                              type="text" 
                              autoFocus
                              placeholder="Find staff by name or dept..."
                              value={teacherSearch}
                              onChange={(e) => setTeacherSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
                          {filteredTeachers.length > 0 ? filteredTeachers.map(t => {
                            const { loadIndex, uniqueSubjects } = getTeacherMetrics(t.id);
                            const capacity = getLoadIndicator(t.id);
                            const percent = Math.min((loadIndex / 8) * 100, 100);

                            return (
                              <div 
                                key={t.id} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTeacher(t);
                                  setIsTeacherDropdownOpen(false);
                                }}
                                className={`flex flex-col p-4 rounded-[24px] cursor-pointer transition-all border ${
                                  selectedTeacher?.id === t.id 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${selectedTeacher?.id === t.id ? 'bg-indigo-500 text-white' : t.avatarColor + ' text-white'}`}>
                                      {t.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-sm leading-tight">{t.name}</p>
                                      <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedTeacher?.id === t.id ? 'text-indigo-100' : 'text-slate-400'}`}>{t.dept} • {uniqueSubjects} Subs</p>
                                    </div>
                                  </div>
                                  {selectedTeacher?.id === t.id && <Check size={18} className="text-white" />}
                                </div>
                                
                                <div className="mt-3 space-y-1.5">
                                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span className={selectedTeacher?.id === t.id ? 'text-indigo-100' : 'text-slate-400'}>Complexity Load</span>
                                    <span className={selectedTeacher?.id === t.id ? 'text-white' : capacity.color.replace('bg-', 'text-')}>{loadIndex.toFixed(1)} / 8.0</span>
                                  </div>
                                  <div className={`w-full h-1 rounded-full overflow-hidden ${selectedTeacher?.id === t.id ? 'bg-indigo-400' : 'bg-slate-100'}`}>
                                    <div 
                                      className={`h-full transition-all duration-500 ${selectedTeacher?.id === t.id ? 'bg-white' : capacity.barColor}`} 
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="py-12 text-center space-y-3">
                              <SearchX size={24} className="mx-auto text-slate-300" />
                              <p className="text-slate-400 text-sm font-medium italic">No staff detected matching criteria</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Searchable Subject Select */}
                  <div className="space-y-3 relative" ref={subjectDropdownRef}>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Subject</label>
                    <div 
                      onClick={() => !formLoading && setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                      className={`w-full px-6 py-5 bg-slate-50 border rounded-[32px] transition-all flex items-center justify-between cursor-pointer group hover:border-indigo-300 ${isSubjectDropdownOpen ? 'border-indigo-500 ring-4 ring-indigo-50 bg-white shadow-xl' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedSubject ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                          <BookOpen size={16} />
                        </div>
                        <span className={`font-bold transition-colors ${selectedSubject ? 'text-slate-800' : 'text-slate-400'}`}>
                          {selectedSubject || 'Select Subject...'}
                        </span>
                      </div>
                      <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isSubjectDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </div>

                    {isSubjectDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-[120] mt-3 bg-white border border-slate-100 shadow-2xl rounded-[32px] overflow-hidden animate-in slide-in-from-top-4 duration-300 p-2">
                        <div className="p-3 border-b border-slate-50 sticky top-0 bg-white">
                          <div className="relative group/search">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              autoFocus
                              placeholder="Filter subject registry..."
                              value={subjectSearch}
                              onChange={(e) => setSubjectSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-2xl outline-none text-sm font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                          {filteredSubjects.map(s => (
                            <div 
                              key={s} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubject(s);
                                setIsSubjectDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between p-4 rounded-[24px] cursor-pointer transition-all ${selectedSubject === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'hover:bg-slate-50'}`}
                            >
                              <span className="font-bold text-sm">{s}</span>
                              {selectedSubject === s && <Check size={16} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Grade Level</label>
                    <div className="relative group">
                      <select 
                        required
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="">Choose Level...</option>
                        {mockClasses.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Section Assignment (Bulk)</label>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {availableSections.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSection(s)}
                          className={`w-12 h-12 rounded-2xl font-bold transition-all border-2 ${
                            selectedSections.includes(s) 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-10 border-t border-slate-50">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={formLoading}
                    className="flex-1 py-5 px-8 border border-slate-200 rounded-[32px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="flex-2 py-5 px-12 bg-indigo-600 text-white rounded-[32px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                  >
                    {formLoading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>Deploy Academic Staff <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setAssignmentToDelete(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[48px] shadow-2xl border border-white p-12 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-rose-50 rounded-[36px] flex items-center justify-center text-rose-600 mx-auto mb-8 shadow-inner ring-[12px] ring-rose-50/50">
              <AlertTriangle size={48} />
            </div>
            
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Revoke Rights?</h3>
            <p className="text-base text-slate-500 mt-5 leading-relaxed font-medium">
              You are terminating <span className="text-slate-800 font-bold">{assignmentToDelete.teacherName}'s</span> access to <span className="text-indigo-600 font-bold">{assignmentToDelete.subject}</span> for <span className="text-slate-800 font-bold">{assignmentToDelete.class}-{assignmentToDelete.section}</span>. 
            </p>

            <div className="flex flex-col gap-4 mt-12">
              <button 
                onClick={confirmRemoveAssignment}
                className="w-full py-5 bg-rose-600 text-white rounded-[24px] font-bold shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
              >
                Confirm Revocation
              </button>
              <button 
                onClick={() => setAssignmentToDelete(null)}
                className="w-full py-5 bg-slate-100 text-slate-500 rounded-[24px] font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignment;
