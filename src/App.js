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
import AIAssistant from './pages/AIAssistant';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main style={{ paddingBottom: '40px' }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/scan" element={<NewScan />} />
                            <Route path="/ai-assistant" element={<AIAssistant />} />
                            <Route path="/scans" element={<ScanList />} />
                            <Route path="/scan/:scanId" element={<ScanResults />} />
                            <Route path="/mobile" element={<MobileAppTesting />} />
                            <Route path="/terminal" element={<LinuxCommandLab />} />
                            <Route path="/learning/*" element={<Learning />} />
                            <Route path="/dorks" element={<DorkPatterns />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;