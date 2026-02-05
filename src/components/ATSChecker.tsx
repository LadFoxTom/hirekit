import React, { useState, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiRefreshCw, FiLock } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';

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

const ATS_ASSESSMENT_STORAGE_KEY = 'ats_assessment_cache';
const ATS_CV_HASH_KEY = 'ats_cv_hash';
const ATS_CACHE_TIMESTAMP_KEY = 'ats_cache_timestamp';
const ATS_CACHE_EXPIRY_DAYS = 7; // Keep cache for 7 days

// Create a stable hash based on core CV content (not template/layout)
const createCVHash = (cvData: any): string => {
  try {
    // Only use core content fields that represent actual CV content
    // Exclude: template, layout, photos, photoUrl, and other UI/metadata fields
    const coreFields = {
      fullName: cvData.fullName || cvData.personalInfo?.fullName,
      title: cvData.title || cvData.professionalHeadline,
      summary: cvData.summary || cvData.objective,
      experience: cvData.experience,
      education: cvData.education,
      skills: cvData.skills || cvData.technicalSkills || cvData.softSkills,
      certifications: cvData.certifications,
      languages: cvData.languages,
      // Include contact structure but not actual values (for privacy)
      hasEmail: !!(cvData.contact?.email || cvData.personalInfo?.email || cvData.email),
      hasPhone: !!(cvData.contact?.phone || cvData.personalInfo?.phone || cvData.phone),
      hasLocation: !!(cvData.contact?.location || cvData.personalInfo?.location || cvData.location),
    };
    
    const dataString = JSON.stringify(coreFields);
    
    // Simple hash - sum of character codes
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  } catch (error) {
    console.error('[ATS Checker] Error creating CV hash:', error);
    return Date.now().toString(); // Fallback to timestamp
  }
};

// Check if cache is still valid (not expired)
const isCacheValid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const timestamp = localStorage.getItem(ATS_CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheDate = new Date(parseInt(timestamp));
    const now = new Date();
    const daysDiff = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff < ATS_CACHE_EXPIRY_DAYS;
  } catch (error) {
    console.error('[ATS Checker] Error checking cache validity:', error);
    return false;
  }
};

// Clear ATS cache
const clearATSCache = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ATS_ASSESSMENT_STORAGE_KEY);
  localStorage.removeItem(ATS_CV_HASH_KEY);
  localStorage.removeItem(ATS_CACHE_TIMESTAMP_KEY);
};

// Login prompt translations (outside component to avoid recreation)
const LOGIN_PROMPT_TEXT = {
  title: {
    en: 'Login Required',
    nl: 'Inloggen Vereist',
    es: 'Inicio de Sesión Requerido',
    de: 'Anmeldung Erforderlich',
    fr: 'Connexion Requise'
  },
  description: {
    en: 'Sign in to use the ATS CV Checker and get detailed feedback on your CV.',
    nl: 'Log in om de ATS CV Checker te gebruiken en gedetailleerde feedback op je CV te krijgen.',
    es: 'Inicia sesión para usar el verificador ATS de CV y obtener comentarios detallados sobre tu CV.',
    de: 'Melden Sie sich an, um den ATS-Lebenslauf-Checker zu verwenden.',
    fr: 'Connectez-vous pour utiliser le vérificateur ATS de CV.'
  },
  loginButton: {
    en: 'Sign In',
    nl: 'Inloggen',
    es: 'Iniciar Sesión',
    de: 'Anmelden',
    fr: 'Se Connecter'
  },
  signupButton: {
    en: 'Create Account',
    nl: 'Account Aanmaken',
    es: 'Crear Cuenta',
    de: 'Konto Erstellen',
    fr: 'Créer un Compte'
  },
  freeFeature: {
    en: 'Free feature for registered users',
    nl: 'Gratis functie voor geregistreerde gebruikers',
    es: 'Función gratuita para usuarios registrados',
    de: 'Kostenlose Funktion für registrierte Benutzer',
    fr: 'Fonctionnalité gratuite pour les utilisateurs enregistrés'
  }
};

const ATSChecker: React.FC<ATSCheckerProps> = ({ cvData, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLocale();
  const [assessment, setAssessment] = useState<ATSAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLoginText = (key: keyof typeof LOGIN_PROMPT_TEXT) =>
    LOGIN_PROMPT_TEXT[key][language as keyof typeof LOGIN_PROMPT_TEXT.title] || LOGIN_PROMPT_TEXT[key].en;

  // Fetch new assessment (only when explicitly called or CV changes)
  const fetchAssessment = useCallback(async (forceRefresh = false) => {
    if (!cvData) return;

    // Check cache first unless forcing refresh
    if (!forceRefresh && typeof window !== 'undefined') {
      try {
        const cachedAssessment = localStorage.getItem(ATS_ASSESSMENT_STORAGE_KEY);
        const cachedHash = localStorage.getItem(ATS_CV_HASH_KEY);
        const currentHash = createCVHash(cvData);

        // Check if cache exists and is still valid (not expired)
        if (cachedAssessment && cachedHash && isCacheValid()) {
          // If hash matches, use cache
          if (cachedHash === currentHash) {
            try {
              const parsed = JSON.parse(cachedAssessment);
              setAssessment(parsed);
              console.log('[ATS Checker] Using cached assessment');
              return;
            } catch (parseError) {
              console.error('[ATS Checker] Error parsing cached assessment:', parseError);
              // Clear invalid cache
              clearATSCache();
            }
          } else {
            // Hash doesn't match, but cache is still valid - check if CV content actually changed
            // Only clear if core content changed (not just template/layout)
            console.log('[ATS Checker] CV hash changed, but keeping cache if content is similar');
            // For now, we'll keep the cache if it's still valid (within expiry period)
            // This prevents losing cache when user accidentally clicks "New Chat"
            // The cache will only be cleared if CV content actually changes significantly
          }
        } else if (cachedAssessment && !isCacheValid()) {
          // Cache expired, clear it
          console.log('[ATS Checker] Cache expired, clearing');
          clearATSCache();
        }
      } catch (error) {
        console.error('[ATS Checker] Error checking cache:', error);
      }
    }

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
      const assessmentData = data.assessment;
      
      // Store in cache with timestamp
      if (typeof window !== 'undefined' && assessmentData) {
        const currentHash = createCVHash(cvData);
        localStorage.setItem(ATS_ASSESSMENT_STORAGE_KEY, JSON.stringify(assessmentData));
        localStorage.setItem(ATS_CV_HASH_KEY, currentHash);
        localStorage.setItem(ATS_CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log('[ATS Checker] Assessment cached with timestamp');
      }
      
      setAssessment(assessmentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess CV');
      console.error('[ATS Checker] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cvData]);

  // Load cached assessment or fetch new one when CV data is available and authenticated
  useEffect(() => {
    if (cvData && isAuthenticated) {
      fetchAssessment(false); // Try cache first, fetch if needed
    }
  }, [cvData, fetchAssessment, isAuthenticated]); // Re-run if CV data changes

  // Helper functions for score display
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

  // Show login prompt if not authenticated (after all hooks)
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <FiLock size={32} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {getLoginText('title')}
        </h3>
        <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
          {getLoginText('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            {getLoginText('loginButton')}
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            {getLoginText('signupButton')}
          </Link>
        </div>
        <p className="mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {getLoginText('freeFeature')}
        </p>
      </div>
    );
  }

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
            onClick={() => fetchAssessment(true)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={`rounded-lg p-4 border ${getScoreBgColor(assessment.atsScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              ATS Compatibility
            </span>
            <span className={`text-lg font-bold ${getScoreColor(assessment.atsScore)}`}>
              {assessment.atsScore}
            </span>
          </div>
          {assessment.explanation?.atsExplanation && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {assessment.explanation.atsExplanation}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-4 border ${getScoreBgColor(assessment.contentScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Content Quality
            </span>
            <span className={`text-lg font-bold ${getScoreColor(assessment.contentScore)}`}>
              {assessment.contentScore}
            </span>
          </div>
          {assessment.explanation?.contentExplanation && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
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
        onClick={() => fetchAssessment(true)}
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
        {isLoading ? 'Assessing...' : 'Refresh Assessment'}
      </button>
    </div>
  );
};

export default ATSChecker;
