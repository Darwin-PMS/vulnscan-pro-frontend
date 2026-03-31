import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
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

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <Router>
                        <div className="app">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* Protected Routes - Require Authentication */}
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><Dashboard /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/scan" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><NewScan /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/ai-assistant" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><AIAssistant /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/scans" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><ScanList /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/scan/:scanId" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><ScanResults /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/mobile" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><MobileAppTesting /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/terminal" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><LinuxCommandLab /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/learning/*" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><Learning /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/dorks" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><DorkPatterns /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/pricing" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><Pricing /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Navbar /><main style={{ paddingBottom: '40px' }}><UserProfile /></main>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin" element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
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