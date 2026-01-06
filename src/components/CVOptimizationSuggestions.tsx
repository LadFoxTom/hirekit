import React from 'react';
import { FaLightbulb, FaMagic, FaChartBar, FaEdit, FaEye, FaDownload } from 'react-icons/fa';

interface CVOptimizationSuggestionsProps {
  cvData: any;
  onSuggestionClick: (suggestion: string) => void;
  onGenerateOptimized: () => void;
  onAnalyzeCV: () => void;
  onEditCV: () => void;
  onPreviewCV: () => void;
  onDownloadCV: () => void;
  isLoading?: boolean;
}

const CVOptimizationSuggestions: React.FC<CVOptimizationSuggestionsProps> = ({
  cvData,
  onSuggestionClick,
  onGenerateOptimized,
  onAnalyzeCV,
  onEditCV,
  onPreviewCV,
  onDownloadCV,
  isLoading = false
}) => {
  // CV optimization suggestions based on common improvement areas
  const optimizationSuggestions = [
    "Make summary more impactful",
    "Add quantifiable achievements",
    "Improve skills organization",
    "Enhance experience descriptions",
    "Optimize for ATS",
    "Add relevant keywords",
    "Improve formatting",
    "Make it more concise",
    "Add industry-specific terms",
    "Highlight leadership experience",
    "Improve action verbs",
    "Add certifications",
    "Include relevant projects",
    "Optimize for target role"
  ];

  // Quick actions for CV optimization
  const quickActions = [
    {
      label: "Generate Optimized CV",
      action: onGenerateOptimized,
      icon: FaMagic,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "AI-powered CV optimization"
    },
    {
      label: "Analyze CV",
      action: onAnalyzeCV,
      icon: FaChartBar,
      color: "bg-green-600 hover:bg-green-700",
      description: "Get detailed feedback"
    },
    {
      label: "Edit CV",
      action: onEditCV,
      icon: FaEdit,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Manual editing mode"
    },
    {
      label: "Preview CV",
      action: onPreviewCV,
      icon: FaEye,
      color: "bg-orange-600 hover:bg-orange-700",
      description: "Full preview mode"
    },
    {
      label: "Download PDF",
      action: onDownloadCV,
      icon: FaDownload,
      color: "bg-red-600 hover:bg-red-700",
      description: "Export as PDF"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              🎉 Your CV is complete!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              You now have a professional CV ready for job applications. Use the suggestions below to optimize it further.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                disabled={isLoading}
                className={`${action.color} text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>💡 <strong>Tip:</strong> Start with "Analyze CV" to get personalized improvement suggestions based on your current CV content.</p>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FaLightbulb className="text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Optimization Suggestions</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Click on any suggestion below to get AI-powered improvements for your CV:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {optimizationSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              disabled={isLoading}
              className="text-left px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* CV Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your CV Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {cvData.experience?.length || 0}
            </div>
            <div className="text-sm text-blue-700">Experience Entries</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {cvData.education?.length || 0}
            </div>
            <div className="text-sm text-green-700">Education Entries</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Array.isArray(cvData.skills) 
                ? cvData.skills.length 
                : Object.values(cvData.skills || {}).reduce((total: number, skills: any) => total + (skills?.length || 0), 0)
              }
            </div>
            <div className="text-sm text-purple-700">Skills Listed</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {cvData.languages?.length || 0}
            </div>
            <div className="text-sm text-orange-700">Languages</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Recommended Next Steps:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. <strong>Analyze your CV</strong> - Get AI-powered feedback and improvement suggestions</li>
          <li>2. <strong>Optimize content</strong> - Use the suggestions above to enhance specific sections</li>
          <li>3. <strong>Customize template</strong> - Choose the best template for your industry</li>
          <li>4. <strong>Test ATS compatibility</strong> - Ensure your CV passes through applicant tracking systems</li>
          <li>5. <strong>Download and apply</strong> - Export your optimized CV and start applying</li>
        </ol>
      </div>
    </div>
  );
};

export default CVOptimizationSuggestions; 