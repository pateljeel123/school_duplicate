import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import ProfileCompletion from './pages/ProfileCompletion'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'

// Dashboards
import StudentDashboard from './pages/dashboards/StudentDashboard'
import TeacherDashboard from './pages/dashboards/TeacherDashboard'
import HODDashboard from './pages/dashboards/HODDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import AIAssistant from './pages/dashboards/AIAssistant'
import StudentAnalytics from './pages/dashboards/StudentAnalytics'
import Messages from './pages/dashboards/Messages'
import TeacherStudents from './pages/dashboards/TeacherStudents'
import TeacherAnalytics from './pages/dashboards/TeacherAnalytics'
import HODTeachers from './pages/dashboards/HODTeachers'
import HODAnalytics from './pages/dashboards/HODAnalytics'
import AdminUsers from './pages/dashboards/AdminUsers'
import AdminAnalytics from './pages/dashboards/AdminAnalytics'
import AdminSettings from './pages/dashboards/AdminSettings'
import LessonPlanning from './pages/dashboards/LessonPlanning'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  // Use localStorage to persist authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  })
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  })

  // Update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', userRole || '');
  }, [isAuthenticated, userRole]);

  // Login function
  const handleLogin = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/courses" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <Courses />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <About />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/login" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              {isAuthenticated ? 
                <Navigate to={`/dashboard/${userRole}`} /> : 
                <Login onLogin={handleLogin} />
              }
            </main>
            <Footer />
          </div>
        } />
        <Route path="/signup" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              {isAuthenticated ? 
                <Navigate to={`/dashboard/${userRole}`} /> : 
                <Signup onLogin={handleLogin} />
              }
            </main>
            <Footer />
          </div>
        } />
        <Route path="/profile-completion" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <ProfileCompletion />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/reset-password" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <ResetPassword />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/forgot-password" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <ForgotPassword />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/not-found" element={
          <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <main className="flex-grow">
              <NotFound />
            </main>
            <Footer />
          </div>
        } />
        
        {/* Protected Dashboard Routes with Sidebar */}
        <Route path="/dashboard/student" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="student" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/teacher" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="teacher" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/teacher/students" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="teacher" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <TeacherStudents />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/teacher/analytics" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="teacher" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <TeacherAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/hod" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="hod" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <HODDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/hod/teachers" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="hod" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <HODTeachers />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/hod/analytics" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="hod" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <HODAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/users" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/analytics" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <AdminAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/settings" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <AdminSettings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Common Routes for all roles */}
        <Route path="/dashboard/:role/ai-assistant" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={userRole} userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <AIAssistant />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/:role/lesson-planning" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={userRole} userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <LessonPlanning />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/:role/student-analytics" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={userRole} userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <StudentAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/:role/messages" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole={userRole} userRole={userRole}>
            <DashboardLayout userRole={userRole} onLogout={handleLogout}>
              <Messages />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  )
}

export default App
