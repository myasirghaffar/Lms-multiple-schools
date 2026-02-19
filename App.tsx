
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import InstitutionsManager from './pages/SuperAdmin/InstitutionsManager';
import SubscriptionPlans from './pages/SuperAdmin/SubscriptionPlans';
import TeacherManager from './pages/TeacherManager';
import StudentManager from './pages/StudentManager';
import AcademicManager from './pages/AcademicManager';
import FinanceManager from './pages/FinanceManager';
import ExamManager from './pages/ExamManager';
import AssignmentManager from './pages/AssignmentManager';
import TeacherAssignment from './pages/TeacherAssignment';
import Settings from './pages/Settings';
import { GraduationCap } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile } = useAuth();

  // Reset tab if role changes
  useEffect(() => {
    if (profile?.role === 'super_admin' && activeTab === 'dashboard') {
       // Keep
    } else if (profile?.role !== 'super_admin' && (activeTab === 'institutions')) {
      setActiveTab('dashboard');
    }
  }, [profile]);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'attendance': return <Attendance />;
      case 'institutions': return <InstitutionsManager />;
      case 'plans': return <SubscriptionPlans />;
      case 'teachers': return <TeacherManager />;
      case 'students': return <StudentManager />;
      case 'classes': return <AcademicManager />;
      case 'fees': return <FinanceManager />;
      case 'exams': return <ExamManager />;
      case 'assignments': return <AssignmentManager />;
      case 'staffing': return <TeacherAssignment />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              {renderContent()}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <MainApp />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
