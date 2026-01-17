import React, { useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Filter, Star, CheckCircle2, Bookmark, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  matchScore: number;
  posted: string;
  logoColor: string;
}

const JobDashboard = () => {
  const [filter, setFilter] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Enhanced Mock Data
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'TechFlow',
      location: 'Remote',
      salary: '$120k - $150k',
      type: 'Full-time',
      tags: ['React', 'TypeScript', 'Tailwind'],
      matchScore: 94,
      posted: '2d ago',
      logoColor: 'bg-blue-600'
    },
    {
      id: '2',
      title: 'Backend Developer',
      company: 'DataCorp',
      location: 'Bangalore',
      salary: '₹24L - ₹35L',
      type: 'Hybrid',
      tags: ['Python', 'FastAPI', 'AWS'],
      matchScore: 88,
      posted: '5h ago',
      logoColor: 'bg-indigo-600'
    },
    {
      id: '3',
      title: 'Product Designer',
      company: 'Creative Studio',
      location: 'Mumbai',
      salary: '₹18L - ₹25L',
      type: 'On-site',
      tags: ['Figma', 'UI/UX', 'Prototyping'],
      matchScore: 72,
      posted: '1d ago',
      logoColor: 'bg-pink-600'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudSystems',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Contract',
      tags: ['Docker', 'K8s', 'CI/CD'],
      matchScore: 45,
      posted: '3d ago',
      logoColor: 'bg-orange-600'
    },
    {
      id: '5',
      title: 'Full Stack Developer',
      company: 'StartupX',
      location: 'Delhi',
      salary: '₹15L - ₹22L',
      type: 'Full-time',
      tags: ['MERN', 'Next.js'],
      matchScore: 65,
      posted: '6h ago',
      logoColor: 'bg-green-600'
    }
  ];

  const filteredJobs = jobs.filter(job => 
    (selectedType === 'All' || job.type === selectedType) &&
    (job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.company.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Recommended Opportunities
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Found <span className="font-bold text-gray-800">{filteredJobs.length} jobs</span> matching your profile
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search roles..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 2. Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Job Type</h3>
              <div className="space-y-2">
                {['All', 'Full-time', 'Contract', 'Remote', 'Hybrid'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedType === type ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {selectedType === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name="jobType" 
                      className="hidden" 
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                    />
                    <span className={`text-sm ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-blue-100 text-sm mb-4">Get unlimited job matches and AI resume reviews.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20">
                View Plans
              </button>
            </div>
          </div>

          {/* 3. Job Feed */}
          <div className="lg:col-span-3 space-y-4">
            {filteredJobs.map((job) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                className={`bg-white rounded-2xl p-6 border transition-all relative group
                  ${job.matchScore > 90 ? 'border-blue-200 shadow-blue-100/50' : 'border-gray-100 shadow-sm'}
                `}
              >
                {/* Match Score Badge */}
                <div className="absolute right-6 top-6 flex flex-col items-end">
                  <div className={`
                    flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-1
                    ${job.matchScore >= 80 ? 'bg-green-100 text-green-700' : 
                      job.matchScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}
                  `}>
                    <Star size={12} fill="currentColor" />
                    {job.matchScore}% Match
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{job.posted}</span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Company Logo Placeholder */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${job.logoColor}`}>
                    {job.company[0]}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                      {job.company} 
                      {job.matchScore > 85 && <CheckCircle2 size={14} className="text-blue-500" />}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <MapPin size={14} className="text-gray-400" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <DollarSign size={14} className="text-gray-400" /> {job.salary}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Briefcase size={14} className="text-gray-400" /> {job.type}
                      </div>
                    </div>

                    {/* Skills/Tags */}
                    <div className="flex gap-2 mt-4">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Bookmark size={20} />
                  </button>
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10">
                    Apply Now <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDashboard;