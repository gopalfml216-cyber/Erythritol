import React from 'react';
// CORRECTED IMPORTS: Pointing to components/resume/
import { FileDropzone } from '../components/resume/FileDropzone';
import { ParsedDataForm } from '../components/resume/ParsedDataForm';
import { useUserStore } from '../store/useUserStore';

const ResumeUploadPage = () => {
  const { candidate } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Let's Build Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get started. We'll extract your skills to find your perfect career match.
          </p>
        </div>

        {/* Conditional Rendering: Upload vs Review */}
        <div className="transition-all duration-500 ease-in-out">
          {!candidate ? (
            <FileDropzone />
          ) : (
            <ParsedDataForm />
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeUploadPage;