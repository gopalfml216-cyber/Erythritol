import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import { Header } from './components/layout/Header';
import ResumeUploadPage from './pages/ResumeUpload';
import SkillsGapPage from './pages/SkillsGapPage';
import JobDashboard from './pages/JobDashboard'; // <--- The new import!

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Header />
        
        <main>
          <Routes>
            {/* Route 1: Resume Upload (Home) */}
            <Route path="/" element={<ResumeUploadPage />} />
            
            {/* Route 2: Skill Gap Analysis */}
            <Route path="/gap-analysis" element={<SkillsGapPage />} />
            
            {/* Route 3: Job Dashboard */}
            <Route path="/jobs" element={<JobDashboard />} /> 

            {/* Fallback for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;