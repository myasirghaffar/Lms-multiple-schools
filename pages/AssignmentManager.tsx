
import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  Users, 
  BookOpen, 
  ChevronRight, 
  FileCheck, 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Trophy,
  Filter,
  ArrowRight,
  Loader2,
  Edit3,
  Upload,
  File,
  Paperclip,
  Download,
  Trash2,
  ExternalLink,
  Info,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string | null;
  status: 'graded' | 'submitted' | 'late' | 'pending';
  score: number | null;
  fileUrl?: string;
  fileName?: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  due: string;
  submissions: number;
  total: number;
  maxScore: number;
  description: string;
}

const AssignmentManager: React.FC = () => {
  const { profile, isDemo } = useAuth();
  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submissionSearch, setSubmissionSearch] = useState('');
  
  // File Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Assignment Form State
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    due: '',
    maxScore: 100
  });

  // Scroll Lock Management
  useEffect(() => {
    if (isSubmissionsModalOpen || isCreateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSubmissionsModalOpen, isCreateModalOpen]);

  const mockSubjects = ['Mathematics', 'History', 'Science', 'English', 'Computer Science', 'Art'];
  const mockClasses = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  useEffect(() => {
    // Simulate fetching assignments
    const initialAssignments: Assignment[] = [
      { id: '1', title: 'World War II Summary', subject: 'History', class: 'Grade 10', due: '2024-03-25', submissions: 24, total: 32, maxScore: 100, description: 'Write a 1000-word summary on the key turning points of WWII. Focus on the Pacific and European theaters.' },
      { id: '2', title: 'Linear Equations Lab', subject: 'Mathematics', class: 'Grade 9', due: '2024-03-28', submissions: 12, total: 28, maxScore: 50, description: 'Solve the attached worksheet on linear equations. Show all your working steps clearly.' },
      { id: '3', title: 'Plant Biology Research', subject: 'Science', class: 'Grade 11', due: '2024-04-02', submissions: 0, total: 45, maxScore: 100, description: 'Research a local plant species and document its lifecycle and environmental adaptations.' },
    ];
    setAssignments(initialAssignments);
    setLoading(false);
  }, []);

  const [mockSubmissions, setMockSubmissions] = useState<Submission[]>([
    { id: 's1', studentName: 'Alice Thompson', studentId: 'S-2024-001', submittedAt: '2024-03-20 14:30', status: 'graded', score: 92, fileName: 'ww2_summary_v1.pdf', fileUrl: '#' },
    { id: 's2', studentName: 'Bob Miller', studentId: 'S-2024-002', submittedAt: '2024-03-21 09:15', status: 'submitted', score: null, fileName: 'history_assignment.docx', fileUrl: '#' },
    { id: 's3', studentName: 'Charlie Davis', studentId: 'S-2024-003', submittedAt: '2024-03-25 23:50', status: 'late', score: null, fileName: 'assignment_final.pdf', fileUrl: '#' },
    { id: 's4', studentName: 'Diana Prince', studentId: 'S-2024-004', submittedAt: '2024-03-19 11:20', status: 'graded', score: 98, fileName: 'research_paper.pdf', fileUrl: '#' },
    { id: 's5', studentName: 'Ethan Hunt', studentId: 'S-2024-005', submittedAt: null, status: 'pending', score: null },
  ]);

  const filteredSubmissions = mockSubmissions.filter(s => 
    s.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
    s.studentId.includes(submissionSearch)
  );

  const gradedCount = mockSubmissions.filter(s => s.status === 'graded').length;

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createForm.title || !createForm.subject || !createForm.class || !createForm.due) {
      setCreateError("All required fields must be populated.");
      return;
    }

    setCreateLoading(true);

    try {
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newAssignment: Assignment = {
          id: Math.random().toString(36).substr(2, 9),
          ...createForm,
          submissions: 0,
          total: 30, // Mock class size
        };
        setAssignments([newAssignment, ...assignments]);
      } else {
        // Real Supabase Insert Logic
        const { error } = await supabase
          .from('assignments')
          .insert([{
            title: createForm.title,
            description: createForm.description,
            subject: createForm.subject,
            class_name: createForm.class,
            due_date: createForm.due,
            max_score: createForm.maxScore,
            institution_id: profile?.institution_id
          }]);
        
        if (error) throw error;
        // Re-fetch logic here in production
      }

      setIsCreateModalOpen(false);
      setCreateForm({
        title: '',
        description: '',
        subject: '',
        class: '',
        due: '',
        maxScore: 100
      });
    } catch (err: any) {
      setCreateError(err.message || "Failed to broadcast assignment.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!attachedFile || !selectedAssignment) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      let fileUrl = '';
      if (!isDemo && isSupabaseConfigured()) {
        const fileExt = attachedFile.name.split('.').pop();
        const fileName = `${profile?.id}/${selectedAssignment.id}/${Date.now()}.${fileExt}`;
        const filePath = `submissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('assignments')
          .upload(filePath, attachedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('assignments')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrl;
      } else {
        // Demo Mode Simulation
        for (let i = 20; i <= 100; i += 20) {
          await new Promise(r => setTimeout(r, 400));
          setUploadProgress(i);
        }
        fileUrl = `https://demo-storage.educhain.cloud/${attachedFile.name}`;
      }

      // Update local state to reflect the new submission
      const newSubmission: Submission = {
        id: `s-new-${Math.random()}`,
        studentName: profile?.full_name || 'Demo Student',
        studentId: profile?.id || 'S-USER',
        submittedAt: new Date().toLocaleString(),
        status: 'submitted',
        score: null,
        fileName: attachedFile.name,
        fileUrl: fileUrl
      };

      setMockSubmissions(prev => [newSubmission, ...prev.filter(s => s.studentId !== (profile?.id || 'S-USER'))]);
      setAttachedFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading file: ' + (error.message || 'Check your bucket configuration in Supabase.'));
    } finally {
      setUploading(false);
    }
  };

  const viewFile = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    } else {
      alert('File access is restricted in demo mode.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isStudent ? 'My Assignments' : 'Academic Assignments'}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {isStudent ? 'Track your progress and submit your deliverables.' : 'Global curriculum and student deliverables management.'}
          </p>
        </div>
        {isTeacher && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white p-8 rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex flex-col group relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <ClipboardList size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{assignment.title}</h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.15em] bg-indigo-50 px-3 py-1 rounded-full">
                        {assignment.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-bold flex items-center">
                        <Users size={14} className="mr-1.5" /> {assignment.class}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="flex items-center text-[11px] font-bold text-slate-500">
                    <Clock size={14} className="mr-2" /> Due {new Date(assignment.due).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{assignment.submissions} / {assignment.total} submissions</p>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsSubmissionsModalOpen(true);
                      }}
                      className="px-6 py-3 bg-slate-50 text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      {isStudent ? 'Open Portal' : 'Review Results'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[48px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-indigo-500 w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 shadow-inner ring-4 ring-indigo-500/30">
                <FileCheck size={28} />
              </div>
              <h4 className="text-2xl font-bold mb-3 tracking-tight">
                {isStudent ? 'Academic Locker' : 'Review Deck'}
              </h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8 opacity-80">
                {isStudent ? 'Centralized access for all your graded work and feedback loops.' : 'Manage assessments and peer-feedback across all active educational tracks.'}
              </p>
              <button className="w-full bg-white text-indigo-600 py-4 rounded-[20px] font-bold text-sm shadow-xl hover:bg-indigo-50 transition-all active:scale-[0.98]">
                {isStudent ? 'My Performance' : 'Open Gradebook'}
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              {isStudent ? 'Semester Standing' : 'Class Progress'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[24px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isStudent ? 'My Average' : 'Institution Avg'}</span>
                <span className="text-lg font-bold text-slate-800">{isStudent ? '91%' : '84%'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[24px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pass Confidence</span>
                <span className="text-lg font-bold text-emerald-600">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => !createLoading && setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[56px] shadow-2xl border border-white flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                  <Plus size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 tracking-tight">New Deliverable</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Assignment Creation Suite</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90">
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
              {createError && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-start space-x-4 animate-in shake duration-500">
                  <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
                  <p className="text-sm font-bold text-rose-800 leading-snug">{createError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Assignment Title</label>
                  <input 
                    type="text" 
                    required 
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                    placeholder="e.g. Quantum Mechanics Lab Report"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-800 text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Instructions</label>
                  <textarea 
                    rows={4}
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    placeholder="Provide context, required resources, and submission guidelines..."
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-600 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Subject</label>
                    <div className="relative">
                      <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        required
                        value={createForm.subject}
                        onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="">Select Subject...</option>
                        {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Class Cohort</label>
                    <div className="relative">
                      <Users size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        required
                        value={createForm.class}
                        onChange={(e) => setCreateForm({...createForm, class: e.target.value})}
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="">Select Cohort...</option>
                        {mockClasses.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Final Submission Deadline</label>
                    <div className="relative">
                      <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="date" 
                        required
                        value={createForm.due}
                        onChange={(e) => setCreateForm({...createForm, due: e.target.value})}
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Maximum Assessment Score</label>
                    <div className="relative">
                      <Target size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input 
                        type="number" 
                        required
                        value={createForm.maxScore}
                        onChange={(e) => setCreateForm({...createForm, maxScore: parseInt(e.target.value) || 0})}
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                        min="1"
                        max="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                <Info size={18} className="text-indigo-600" />
                Assignment will be visible to students in the target cohort immediately.
              </div>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createLoading}
                  className="px-8 py-3.5 border border-slate-200 rounded-[20px] font-bold text-slate-500 hover:bg-white transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateAssignment}
                  disabled={createLoading}
                  className="px-10 py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 group"
                >
                  {createLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />}
                  Broadcast Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Assignment Workspace Modal (Review Submissions) */}
      {isSubmissionsModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => !uploading && setIsSubmissionsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[56px] shadow-2xl border border-white flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <ClipboardList size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedAssignment.title}</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {selectedAssignment.subject} • {selectedAssignment.class} • Max: {selectedAssignment.maxScore} pts
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSubmissionsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90">
                <X size={32} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {isStudent ? (
                /* Student View */
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Detailed Instructions</h4>
                        <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 text-slate-600 leading-relaxed font-medium italic">
                          "{selectedAssignment.description}"
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Assignment Submission</h4>
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => !uploading && fileInputRef.current?.click()}
                          className={`
                            border-4 border-dashed rounded-[40px] p-12 text-center transition-all cursor-pointer relative
                            ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[0.99]' : ''}
                            ${attachedFile ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30'}
                          `}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            className="hidden" 
                            accept=".pdf,.doc,.docx"
                          />
                          {attachedFile ? (
                            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                                <File size={32} />
                              </div>
                              <p className="font-bold text-slate-800">{attachedFile.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for ingestion</p>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }}
                                className="mt-4 text-[10px] font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 transition-all flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Discard File
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-50">
                                <Upload size={40} />
                              </div>
                              <p className="font-bold text-slate-800 text-xl tracking-tight">Drop your deliverable here</p>
                              <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-[0.15em]">PDF, Word (Max 25MB)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {uploading && (
                        <div className="space-y-3 bg-white p-6 rounded-[32px] border border-indigo-100 shadow-sm animate-in slide-in-from-bottom-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-indigo-600 flex items-center gap-2">
                              <Loader2 className="animate-spin" size={12} />
                              Streaming to Cloud Core...
                            </span>
                            <span className="text-slate-500">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Submission Repository</h4>
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                          {mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER')) ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-[28px] border border-emerald-100 group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={24} />
                                  </div>
                                  <div>
                                    <span className="font-bold text-emerald-800 block text-sm">On-Time Delivery</span>
                                    <span className="text-[10px] font-bold text-emerald-600/60 uppercase">System Validated</span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-4">
                                  <Paperclip className="text-slate-400" size={20} />
                                  <div>
                                    <span className="text-sm font-bold text-slate-700 block truncate max-w-[140px]">
                                      {mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER'))?.fileName}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Received: {mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER'))?.submittedAt?.split(' ')[1]}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => viewFile(mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER'))?.fileUrl)}
                                  className="p-3 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl shadow-sm border border-indigo-50 transition-all"
                                >
                                  <Download size={20} />
                                </button>
                              </div>
                              <div className="pt-6 border-t border-slate-50 flex items-center justify-between px-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Final Grade</span>
                                <div className="text-right">
                                  <span className="text-4xl font-black text-slate-800 tracking-tighter">
                                    {mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER'))?.score || '—'}
                                  </span>
                                  <span className="text-sm font-bold text-slate-300 ml-2">/ {selectedAssignment.maxScore}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-16 text-center">
                              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mb-6 shadow-inner ring-8 ring-slate-50/50">
                                <AlertCircle size={40} />
                              </div>
                              <p className="font-bold text-slate-800 text-lg">No deliverable found</p>
                              <p className="text-sm text-slate-400 mt-2 max-w-[200px] leading-relaxed">Please upload your completed file to initiate the grading cycle.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Teacher View */
                <>
                  <div className="px-10 py-6 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 shrink-0">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment</span>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">{selectedAssignment.total}</span>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graded</span>
                        <span className="text-2xl font-bold text-emerald-600 tracking-tight">{gradedCount}</span>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Queue</span>
                        <span className="text-2xl font-bold text-indigo-600 tracking-tight">{mockSubmissions.length - gradedCount}</span>
                      </div>
                    </div>

                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search student roster..."
                        value={submissionSearch}
                        onChange={(e) => setSubmissionSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-semibold transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar px-10">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">Student Identity</th>
                          <th className="py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">Delivery Status</th>
                          <th className="py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">Deliverable</th>
                          <th className="py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">Assessment</th>
                          <th className="py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[18px] bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm group-hover:bg-white transition-colors">
                                  {sub.studentName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 text-base">{sub.studentName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{sub.studentId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-4">
                              {sub.status === 'graded' ? (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                  <CheckCircle2 size={12} className="mr-2" />
                                  Graded
                                </span>
                              ) : sub.status === 'submitted' ? (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-widest border border-indigo-100">
                                  Submitted
                                </span>
                              ) : sub.status === 'late' ? (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 uppercase tracking-widest border border-amber-100">
                                  Late Entry
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 uppercase tracking-widest border border-slate-100">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-6 px-4">
                              {sub.fileName ? (
                                <div 
                                  onClick={() => viewFile(sub.fileUrl)}
                                  className="flex items-center gap-2 text-indigo-600 font-bold text-sm cursor-pointer hover:text-indigo-800 transition-colors group/file"
                                >
                                  <Paperclip size={16} className="group-hover/file:rotate-45 transition-transform" />
                                  <span className="truncate max-w-[140px] border-b border-transparent group-hover/file:border-indigo-600">{sub.fileName}</span>
                                  <ExternalLink size={12} className="opacity-0 group-hover/file:opacity-100 transition-opacity" />
                                </div>
                              ) : <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">None</span>}
                            </td>
                            <td className="py-6 px-4">
                              <div className="flex items-center gap-2">
                                {sub.status === 'graded' ? (
                                  <div className="flex items-baseline gap-1 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
                                    <span className="text-xl font-bold text-slate-800 tracking-tight">{sub.score}</span>
                                    <span className="text-[10px] text-slate-300 font-bold">/ {selectedAssignment.maxScore}</span>
                                  </div>
                                ) : sub.status === 'pending' ? (
                                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Awaiting</span>
                                ) : (
                                  <div className="relative w-28 group/input">
                                    <input 
                                      type="number" 
                                      placeholder="Grade"
                                      className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold transition-all text-slate-700 shadow-inner"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 opacity-0 group-focus-within/input:opacity-100 transition-opacity">/{selectedAssignment.maxScore}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-6 px-4 text-right">
                              <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all hover:shadow-sm border border-transparent hover:border-indigo-50">
                                <Edit3 size={18} />
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="py-32 text-center text-slate-400">
                              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={48} className="opacity-10" />
                              </div>
                              <p className="font-bold text-2xl text-slate-800 tracking-tight">No submissions detected</p>
                              <p className="text-sm mt-2 font-medium">Please verify student access levels if this is unexpected.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Info size={18} />
                </div>
                {isStudent ? 'Your submission is immutable once final confirmation is established.' : 'All scoring updates will be reflected in the central gradebook immediately.'}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSubmissionsModalOpen(false)}
                  disabled={uploading}
                  className="px-8 py-3.5 border border-slate-200 rounded-[20px] font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                >
                  {isStudent && !mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER')) ? 'Discard Entry' : 'Close Workspace'}
                </button>
                {isStudent && !mockSubmissions.find(s => s.studentId === (profile?.id || 'S-USER')) && (
                  <button 
                    onClick={handleFileUpload}
                    disabled={!attachedFile || uploading}
                    className="px-10 py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 group"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <FileCheck size={20} className="group-hover:scale-110 transition-transform" />}
                    Confirm & Submit
                  </button>
                )}
                {isTeacher && (
                  <button 
                    onClick={() => setIsSubmissionsModalOpen(false)}
                    className="px-10 py-3.5 bg-indigo-600 text-white rounded-[20px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
                  >
                    Post Results & Notify
                    <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManager;
