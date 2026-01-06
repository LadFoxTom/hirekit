'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiExternalLink,
  FiX, FiHeart, FiBookmark, FiChevronLeft, FiChevronRight,
  FiStar, FiCheck, FiTrendingUp, FiGlobe
} from 'react-icons/fi';

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  remote?: boolean;
  postedDate?: string;
  matchScore?: number;
  matchReason?: string;
  keywordMatches?: string[];
  source?: string;
}

interface JobSwiperProps {
  jobs: JobMatch[];
  onSave: (job: JobMatch) => void;
  onSkip: (job: JobMatch) => void;
  onOpen: (job: JobMatch) => void;
  onApply?: (job: JobMatch) => void;
  savedJobs?: string[];
}

export function JobSwiper({ jobs, onSave, onSkip, onOpen, onApply, savedJobs = [] }: JobSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentJob = jobs[currentIndex];
  const hasNext = currentIndex < jobs.length - 1;
  const hasPrev = currentIndex > 0;

  const handleSwipe = (dir: 'left' | 'right') => {
    if (isAnimating || !currentJob) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    if (dir === 'right') {
      onSave(currentJob);
    } else {
      onSkip(currentJob);
    }
    
    setTimeout(() => {
      if (hasNext) {
        setCurrentIndex(prev => prev + 1);
      }
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const goToJob = (index: number) => {
    if (index >= 0 && index < jobs.length && !isAnimating) {
      setCurrentIndex(index);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400 p-8">
          <FiBriefcase size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-sm">Try adjusting your CV or ask me to search for different roles</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400 p-8">
          <FiCheck size={48} className="mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">All caught up!</h3>
          <p className="text-sm mb-4">You've reviewed all {jobs.length} jobs</p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const isSaved = savedJobs.includes(currentJob.id);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FiBriefcase size={16} className="text-blue-400" />
          <span className="text-sm font-medium">Job Matches</span>
          <span className="text-xs text-gray-500">
            {currentIndex + 1} of {jobs.length}
          </span>
        </div>
        
        {/* Navigation dots */}
        <div className="flex items-center gap-1">
          {jobs.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
            const actualIdx = Math.max(0, currentIndex - 2) + idx;
            return (
              <button
                key={actualIdx}
                onClick={() => goToJob(actualIdx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  actualIdx === currentIndex 
                    ? 'bg-blue-500 w-4' 
                    : savedJobs.includes(jobs[actualIdx]?.id)
                    ? 'bg-green-500'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Job Card */}
      <div className="flex-1 overflow-hidden relative p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentJob.id}
            initial={{ opacity: 0, x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
              transition: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className="h-full bg-gradient-to-b from-[#1a1a1a] to-[#151515] rounded-2xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Match Score Banner */}
            {currentJob.matchScore && (
              <div className={`px-4 py-2 flex items-center justify-between ${
                currentJob.matchScore >= 80 ? 'bg-green-500/20' :
                currentJob.matchScore >= 60 ? 'bg-blue-500/20' :
                'bg-orange-500/20'
              }`}>
                <div className="flex items-center gap-2">
                  <FiTrendingUp size={14} className={
                    currentJob.matchScore >= 80 ? 'text-green-400' :
                    currentJob.matchScore >= 60 ? 'text-blue-400' :
                    'text-orange-400'
                  } />
                  <span className="text-sm font-medium">
                    {currentJob.matchScore}% Match
                  </span>
                </div>
                {currentJob.source && (
                  <span className="text-xs text-gray-400 capitalize">{currentJob.source}</span>
                )}
              </div>
            )}

            {/* Job Content */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100%-120px)]">
              {/* Title & Company */}
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{currentJob.title}</h2>
                <p className="text-blue-400 font-medium">{currentJob.company}</p>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <FiMapPin size={14} />
                  <span>{currentJob.location}</span>
                </div>
                {currentJob.remote && (
                  <div className="flex items-center gap-1.5 text-green-400">
                    <FiGlobe size={14} />
                    <span>Remote</span>
                  </div>
                )}
                {currentJob.salary && (
                  <div className="flex items-center gap-1.5">
                    <FiDollarSign size={14} />
                    <span>{currentJob.salary}</span>
                  </div>
                )}
                {currentJob.postedDate && (
                  <div className="flex items-center gap-1.5">
                    <FiClock size={14} />
                    <span>{currentJob.postedDate}</span>
                  </div>
                )}
              </div>

              {/* Match Reason */}
              {currentJob.matchReason && (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Why this matches</div>
                  <p className="text-sm text-gray-300">{currentJob.matchReason}</p>
                </div>
              )}

              {/* Keywords */}
              {currentJob.keywordMatches && currentJob.keywordMatches.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentJob.keywordMatches.slice(0, 8).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">About this role</div>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
                  {currentJob.description}
                </p>
              </div>
            </div>

            {/* Swipe Hints */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 pointer-events-none flex items-center justify-start pl-4 transition-opacity"
              style={{ opacity: direction === 'left' ? 0.8 : 0 }}
            >
              <FiX size={32} className="text-red-400" />
            </div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-green-500/20 to-transparent opacity-0 pointer-events-none flex items-center justify-end pr-4 transition-opacity"
              style={{ opacity: direction === 'right' ? 0.8 : 0 }}
            >
              <FiHeart size={32} className="text-green-400" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => goToJob(currentIndex - 1)}
          disabled={!hasPrev || isAnimating}
          className={`absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 transition-all ${
            hasPrev && !isAnimating ? 'opacity-100 hover:bg-white/10' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={() => goToJob(currentIndex + 1)}
          disabled={!hasNext || isAnimating}
          className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 transition-all ${
            hasNext && !isAnimating ? 'opacity-100 hover:bg-white/10' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-4">
          {/* Skip */}
          <button
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
            className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            <FiX size={24} />
          </button>

          {/* Open Job Listing */}
          <button
            onClick={() => onOpen(currentJob)}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            <FiExternalLink size={18} />
          </button>

          {/* Save / Like */}
          <button
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all disabled:opacity-50 ${
              isSaved 
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:scale-105'
            }`}
          >
            {isSaved ? <FiCheck size={24} /> : <FiHeart size={24} />}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => onApply?.(currentJob)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <FiBriefcase size={14} />
            Quick Apply
          </button>
          <button
            onClick={() => window.open(currentJob.url, '_blank')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <FiExternalLink size={14} />
            View Full Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSwiper;










