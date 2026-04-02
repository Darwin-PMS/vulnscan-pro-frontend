import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PermissionProvider } from './contexts/PermissionContext';
import ToastProvider from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import PublicNavbar from './components/PublicNavbar';
import AppNavbar from './components/AppNavbar';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import WebSecurityPage from './pages/public/WebSecurityPage';
import MobileSecurityPage from './pages/public/MobileSecurityPage';
import ApiSecurityPage from './pages/public/ApiSecurityPage';
import ToolsPage from './pages/public/ToolsPage';
import Pricing from './pages/public/Pricing';
import PlanComparison from './pages/public/PlanComparison';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import MFASetup from './pages/auth/MFASetup';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import EnterpriseDashboard from './pages/dashboard/EnterpriseDashboard';
import SuperAdminLogin from './pages/dashboard/SuperAdminLogin';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';

// Scanner Pages
import NewScan from './pages/scanners/NewScan';
import ScanList from './pages/scanners/ScanList';
import ScanResults from './pages/scanners/ScanResults';
import ScanModules from './pages/scanners/ScanModules';
import ScheduledScans from './pages/scanners/ScheduledScans';

// Tools Pages
import AIAssistant from './pages/tools/AIAssistant';
import LinuxCommandLab from './pages/tools/LinuxCommandLab';
import DorkPatterns from './pages/tools/DorkPatterns';
import Learning from './pages/tools/Learning';
import MobileAppTesting from './pages/tools/MobileAppTesting';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import Notifications from './pages/admin/Notifications';
import Webhooks from './pages/admin/Webhooks';
import APIKeys from './pages/admin/APIKeys';
import ApiDocs from './pages/admin/ApiDocs';
import SSOConfiguration from './pages/admin/SSOConfiguration';
import MFAEnforcement from './pages/admin/MFAEnforcement';

// Security Pages
import ComplianceReports from './pages/security/ComplianceReports';
import PermissionManagement from './pages/security/PermissionManagement';

// Profile Pages
import UserProfile from './pages/profile/UserProfile';

function AppContent() {
    const { user } = useAuth();
    
    return (
        <PermissionProvider user={user}>
            <div className="app">
                <Routes>
                    {/* Public Landing Pages - Uses PublicNavbar */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/web-security" element={<><PublicNavbar /><main className="public-page"><WebSecurityPage /></main></>} />
                    <Route path="/mobile-security" element={<><PublicNavbar /><main className="public-page"><MobileSecurityPage /></main></>} />
                    <Route path="/api-security" element={<><PublicNavbar /><main className="public-page"><ApiSecurityPage /></main></>} />
                    <Route path="/tools" element={<><PublicNavbar /><main className="public-page"><ToolsPage /></main></>} />
                    <Route path="/pricing" element={<><PublicNavbar /><main className="public-page"><Pricing /></main></>} />
                    <Route path="/plan-comparison" element={<><PublicNavbar /><main className="public-page"><PlanComparison /></main></>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/super-admin" element={<SuperAdminLogin />} />
                    <Route path="/super-admin/dashboard" element={
                        <SuperAdminProtectedRoute>
                            <SuperAdminDashboard />
                        </SuperAdminProtectedRoute>
                    } />
                    
                    {/* Protected Routes - Use AppNavbar */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><Dashboard /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/scan" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><NewScan /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/ai-assistant" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><AIAssistant /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/scans" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ScanList /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/scan/:scanId" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ScanResults /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/mobile" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><MobileAppTesting /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/terminal" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><LinuxCommandLab /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/learning/*" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><Learning /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/dorks" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><DorkPatterns /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><UserProfile /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    } />
                    <Route path="/enterprise" element={
                        <AdminProtectedRoute>
                            <EnterpriseDashboard />
                        </AdminProtectedRoute>
                    } />
                    <Route path="/scan-modules" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ScanModules /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/mfa-setup" element={
                        <ProtectedRoute>
                            <MFASetup />
                        </ProtectedRoute>
                    } />
                    <Route path="/api-keys" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><APIKeys /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/webhooks" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><Webhooks /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><Notifications /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/audit-logs" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><AuditLogs /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/api-docs" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ApiDocs /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/scheduled-scans" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ScheduledScans /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/user-management" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><UserManagement /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/plan-comparison" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><PlanComparison /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/compliance-reports" element={
                        <ProtectedRoute>
                            <AppNavbar /><main className="app-page"><ComplianceReports /></main>
                        </ProtectedRoute>
                    } />
                    <Route path="/sso" element={
                        <AdminProtectedRoute>
                            <AppNavbar /><main className="app-page"><SSOConfiguration /></main>
                        </AdminProtectedRoute>
                    } />
                    <Route path="/mfa-enforcement" element={
                        <AdminProtectedRoute>
                            <AppNavbar /><main className="app-page"><MFAEnforcement /></main>
                        </AdminProtectedRoute>
                    } />
                </Routes>
            </div>
        </PermissionProvider>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
