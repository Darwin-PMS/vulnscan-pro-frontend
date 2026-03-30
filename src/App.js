import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><Dashboard /></main></>} />
                        <Route path="/scan" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><NewScan /></main></>} />
                        <Route path="/ai-assistant" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><AIAssistant /></main></>} />
                        <Route path="/scans" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><ScanList /></main></>} />
                        <Route path="/scan/:scanId" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><ScanResults /></main></>} />
                        <Route path="/mobile" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><MobileAppTesting /></main></>} />
                        <Route path="/terminal" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><LinuxCommandLab /></main></>} />
                        <Route path="/learning/*" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><Learning /></main></>} />
                        <Route path="/dorks" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><DorkPatterns /></main></>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/pricing" element={<><Navbar /><main style={{ paddingBottom: '40px' }}><Pricing /></main></>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;