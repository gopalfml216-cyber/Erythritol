import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- Components ---
// Ensure this path is correct based on your folder structure
import { Header } from './components/layout/Header'; 

// --- Pages ---
// Check that these filenames match exactly what is in your 'src/pages' folder
import ResumeUploadPage from './pages/ResumeUpload'; // Was ResumeUpload in your error
import {ResumeReview} from './pages/ResumeReview';
import SkillsGapPage from './pages/SkillsGapPage';
import JobDash from './pages/JobDashboard'; 

function App() {
  return (
    <div className="min-h-screen bg-[#050505] font-['Plus_Jakarta_Sans'] text-white">
      <Header />
      <main>
        <AnimateRoutes />
      </main>
    </div>
  );
}

const AnimateRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      {/* 1. Use the correct component name: ResumeUploadPage */}
      <Route path="/" element={<ResumeUploadPage />} />
      
      {/* 2. ResumeReview should no longer require props if you updated it to use the store */}
      <Route path="/resume-review" element={<ResumeReview />} />
      
      <Route path="/gap-analysis" element={<SkillsGapPage />} />
      <Route path="/jobs" element={<JobDash />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;