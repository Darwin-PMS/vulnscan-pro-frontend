import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import ScanList from './pages/ScanList';
import ScanResults from './pages/ScanResults';
import DorkPatterns from './pages/DorkPatterns';
import MobileAppTesting from './pages/MobileAppTesting';
import Learning from './pages/Learning';
import LinuxCommandLab from './pages/LinuxCommandLab';
import Login from './pages/Login';
import AIAssistant from './pages/AIAssistant';

const AppRoutes = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="container page-header">
                <div className="empty-state">
                    <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Navbar />
            <main style={{ paddingBottom: '40px' }}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Dashboard /> : <Landing />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                    <Route path="/scan" element={<ProtectedRoute><NewScan /></ProtectedRoute>} />
                    <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                    <Route path="/scans" element={<ProtectedRoute><ScanList /></ProtectedRoute>} />
                    <Route path="/scan/:scanId" element={<ProtectedRoute><ScanResults /></ProtectedRoute>} />
                    <Route path="/mobile" element={<ProtectedRoute><MobileAppTesting /></ProtectedRoute>} />
                    <Route path="/terminal" element={<ProtectedRoute><LinuxCommandLab /></ProtectedRoute>} />
                    <Route path="/learning/*" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
                    <Route path="/dorks" element={<ProtectedRoute><DorkPatterns /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;