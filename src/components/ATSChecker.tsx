import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiRefreshCw } from 'react-icons/fi';

interface ATSCheckerProps {
  cvData: any;
  onClose?: () => void;
}

interface ATSAssessment {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  details?: {
    parseability?: number;
    contactInfo?: number;
    formatting?: number;
    contentQuality?: number;
    quantification?: number;
    summaryQuality?: number;
    skillsSupport?: number;
    keywordContext?: number;
    coherence?: number;
  };
  explanation?: {
    gradeExplanation?: string;
    atsExplanation?: string;
    contentExplanation?: string;
    keyFindings?: string[];
  };
}

const ATSChecker: React.FC<ATSCheckerProps> = ({ cvData, onClose }) => {
  const [assessment, setAssessment] = useState<ATSAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/ats-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Assessment failed');
      }

      const data = await response.json();
      setAssessment(data.assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess CV');
      console.error('[ATS Checker] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cvData) {
      fetchAssessment();
    }
  }, [cvData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FiRefreshCw className="animate-spin mx-auto mb-4 text-2xl" style={{ color: 'var(--text-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Analyzing your CV for ATS compatibility...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiXCircle className="text-red-500" size={18} />
            <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Assessment Error
            </h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
          <button
            onClick={fetchAssessment}
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No assessment data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiCheckCircle className="text-indigo-500" size={20} />
            ATS Assessment
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Comprehensive CV compatibility analysis
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FiXCircle size={18} />
          </button>
        )}
      </div>

      {/* Overall Score */}
      <div className={`rounded-xl p-6 border ${getScoreBgColor(assessment.overallScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Overall Grade
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {getScoreLabel(assessment.overallScore)}
            </p>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(assessment.overallScore)}`}>
            {assessment.overallScore}
          </div>
        </div>
        {assessment.explanation?.gradeExplanation && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {assessment.explanation.gradeExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-lg p-4 border ${getScoreBgColor(assessment.atsScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              ATS Compatibility
            </span>
            <span className={`text-lg font-bold ${getScoreColor(assessment.atsScore)}`}>
              {assessment.atsScore}
            </span>
          </div>
          {assessment.explanation?.atsExplanation && (
            <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
              {assessment.explanation.atsExplanation}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-4 border ${getScoreBgColor(assessment.contentScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Content Quality
            </span>
            <span className={`text-lg font-bold ${getScoreColor(assessment.contentScore)}`}>
              {assessment.contentScore}
            </span>
          </div>
          {assessment.explanation?.contentExplanation && (
            <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
              {assessment.explanation.contentExplanation}
            </p>
          )}
        </div>
      </div>

      {/* Detailed Scores */}
      {assessment.details && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiInfo size={14} className="text-blue-500" />
            Detailed Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {assessment.details.parseability !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Parseability</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.parseability)}`}>
                    {assessment.details.parseability}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.contactInfo !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Contact Info</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.contactInfo)}`}>
                    {assessment.details.contactInfo}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.formatting !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Formatting</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.formatting)}`}>
                    {assessment.details.formatting}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.contentQuality !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Content Quality</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.contentQuality)}`}>
                    {assessment.details.contentQuality}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.quantification !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Quantification</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.quantification)}`}>
                    {assessment.details.quantification}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.summaryQuality !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Summary</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.summaryQuality)}`}>
                    {assessment.details.summaryQuality}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.skillsSupport !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Skills Support</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.skillsSupport)}`}>
                    {assessment.details.skillsSupport}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.keywordContext !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keywords</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.keywordContext)}`}>
                    {assessment.details.keywordContext}
                  </span>
                </div>
              </div>
            )}
            {assessment.details.coherence !== undefined && (
              <div className="p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Coherence</span>
                  <span className={`text-xs font-medium ${getScoreColor(assessment.details.coherence)}`}>
                    {assessment.details.coherence}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strengths */}
      {assessment.strengths && assessment.strengths.length > 0 && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiCheckCircle size={14} className="text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {assessment.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0 mt-0.5" style={{ lineHeight: '1.2' }}>•</span>
                <span className="text-xs flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {assessment.weaknesses && assessment.weaknesses.length > 0 && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiAlertCircle size={14} className="text-yellow-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {assessment.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 flex-shrink-0 mt-0.5" style={{ lineHeight: '1.2' }}>•</span>
                <span className="text-xs flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {weakness}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {assessment.suggestions && assessment.suggestions.length > 0 && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiInfo size={14} className="text-blue-500" />
            Actionable Suggestions
          </h3>
          <ul className="space-y-2">
            {assessment.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 flex-shrink-0 mt-0.5" style={{ lineHeight: '1.2' }}>{index + 1}.</span>
                <span className="text-xs flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Findings */}
      {assessment.explanation?.keyFindings && assessment.explanation.keyFindings.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FiInfo size={14} className="text-indigo-500" />
            Key Findings
          </h3>
          <ul className="space-y-2">
            {assessment.explanation.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-500 flex-shrink-0 mt-0.5" style={{ lineHeight: '1.2' }}>•</span>
                <span className="text-xs flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {finding}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchAssessment}
        disabled={isLoading}
        className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          backgroundColor: 'var(--bg-hover)',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }
        }}
      >
        <FiRefreshCw className={isLoading ? 'animate-spin' : ''} size={14} />
        Refresh Assessment
      </button>
    </div>
  );
};

export default ATSChecker;
