import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicNavbar from './components/PublicNavbar';
import AppNavbar from './components/AppNavbar';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import ScanList from './pages/ScanList';
import ScanResults from './pages/ScanResults';
import DorkPatterns from './pages/DorkPatterns';
import MobileAppTesting from './pages/MobileAppTesting';
import Learning from './pages/Learning';
import LinuxCommandLab from './pages/LinuxCommandLab';
import Login from './pages/Login';
import Register from './pages/Register';
import AIAssistant from './pages/AIAssistant';
import Pricing from './pages/Pricing';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import ScanModules from './pages/ScanModules';
import WebSecurityPage from './pages/WebSecurityPage';
import MobileSecurityPage from './pages/MobileSecurityPage';
import ApiSecurityPage from './pages/ApiSecurityPage';
import ToolsPage from './pages/ToolsPage';

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <Router>
                        <div className="app">
                            <Routes>
                                {/* Public Landing Pages - Uses PublicNavbar */}
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/web-security" element={<><PublicNavbar /><main className="public-page"><WebSecurityPage /></main></>} />
                                <Route path="/mobile-security" element={<><PublicNavbar /><main className="public-page"><MobileSecurityPage /></main></>} />
                                <Route path="/api-security" element={<><PublicNavbar /><main className="public-page"><ApiSecurityPage /></main></>} />
                                <Route path="/tools" element={<><PublicNavbar /><main className="public-page"><ToolsPage /></main></>} />
                                <Route path="/pricing" element={<><PublicNavbar /><main className="public-page"><Pricing /></main></>} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
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
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/enterprise" element={
                                    <ProtectedRoute>
                                        <EnterpriseDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/scan-modules" element={
                                    <ProtectedRoute>
                                        <AppNavbar /><main className="app-page"><ScanModules /></main>
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </div>
                    </Router>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
