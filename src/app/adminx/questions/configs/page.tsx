'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Eye,
  Edit,
  Plus,
  Trash2,
  Search,
  Filter,
  HelpCircle,
  CheckCircle,
  XCircle,
  Settings,
  FileText,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useModalContext } from '@/components/providers/ModalProvider';

interface QuestionConfig {
  id: string;
  section: string;
  textKey: string;
  enabled: boolean;
  order: number;
  optional?: boolean;
  phase?: string;
  required?: boolean;
  text?: string;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: string[];
}

interface QuestionConfiguration {
  id?: string;
  name: string;
  description?: string;
  type: 'advanced' | 'simplified';
  questions: QuestionConfig[];
  isActive: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function QuestionConfigsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showConfirm } = useModalContext();
  const [configuration, setConfiguration] = useState<QuestionConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<QuestionConfig>>({});

  const configId = searchParams?.get('configId');
  const isViewMode = searchParams?.get('view') === 'true';

  useEffect(() => {
    if (configId) {
      loadConfiguration(configId);
    } else {
      // Create new configuration
      setConfiguration({
        name: 'New Configuration',
        description: '',
        type: 'advanced',
        questions: [],
        isActive: true,
        isDefault: false
      });
      setLoading(false);
    }
  }, [configId]);

  const loadConfiguration = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/question-configs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setConfiguration(data);
      } else {
        toast.error('Failed to load configuration');
        router.push('/adminx/questions');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration');
      router.push('/adminx/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!configuration) return;

    try {
      setSaving(true);
      const method = configuration.id ? 'PUT' : 'POST';
      const url = configuration.id 
        ? `/api/admin/question-configs/${configuration.id}`
        : '/api/admin/question-configs';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configuration)
      });

      if (response.ok) {
        const savedConfig = await response.json();
        setConfiguration(savedConfig);
        toast.success('Configuration saved successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!configuration) return;

    const confirmed = await showConfirm(
      'Are you sure you want to delete this question?',
      'Delete Question'
    );

    if (confirmed) {
      const updatedQuestions = configuration.questions.filter(q => q.id !== questionId);
      setConfiguration({
        ...configuration,
        questions: updatedQuestions
      });
      toast.success('Question deleted successfully');
    }
  };

  const handleAddQuestion = () => {
    if (!configuration) return;

    const newQuestion: QuestionConfig = {
      id: `question_${Date.now()}`,
      section: 'general',
      textKey: 'new_question',
      enabled: true,
      order: configuration.questions.length + 1,
      optional: false,
      required: true,
      text: 'New Question',
      placeholder: 'Enter your answer...',
      helpText: '',
      options: [],
      validation: []
    };

    setConfiguration({
      ...configuration,
      questions: [...configuration.questions, newQuestion]
    });
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuestionConfig>) => {
    if (!configuration) return;

    const updatedQuestions = configuration.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    setConfiguration({
      ...configuration,
      questions: updatedQuestions
    });
  };

  const filteredQuestions = configuration?.questions.filter(question => {
    const matchesSearch = question.textKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = filterSection === 'all' || question.section === filterSection;
    return matchesSearch && matchesSection;
  }) || [];

  const sections = ['all', ...Array.from(new Set(configuration?.questions.map(q => q.section) || []))];

  const getStatusColor = (enabled: boolean) => {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (enabled: boolean) => {
    return enabled ? 'Enabled' : 'Disabled';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!configuration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Not Found</h2>
          <button
            onClick={() => router.push('/adminx/questions')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
        {/* Header */}
        <div className="px-4 py-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/adminx/questions')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Back to Questions"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
                  {configuration.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {configuration.description || 'Question configuration management'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isViewMode && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isEditing
                        ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Configuration'}
                  </button>
                  <button
                    onClick={handleSaveConfiguration}
                    disabled={saving || !isEditing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Configuration Name
                </label>
                {isEditing && !isViewMode ? (
                  <input
                    type="text"
                    value={configuration.name}
                    onChange={(e) => setConfiguration({ ...configuration, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{configuration.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                {isEditing && !isViewMode ? (
                  <select
                    value={configuration.type}
                    onChange={(e) => setConfiguration({ ...configuration, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="advanced">Advanced</option>
                    <option value="simplified">Simplified</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    configuration.type === 'advanced' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {configuration.type}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                {isEditing && !isViewMode ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configuration.isActive}
                      onChange={(e) => setConfiguration({ ...configuration, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(configuration.isActive)}`}>
                    {getStatusText(configuration.isActive)}
                  </span>
                )}
              </div>
            </div>
            {isEditing && !isViewMode && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={configuration.description || ''}
                  onChange={(e) => setConfiguration({ ...configuration, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter configuration description..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Questions Management */}
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Questions</h2>
                  <p className="text-sm text-gray-600">
                    Manage questions in this configuration
                  </p>
                </div>
                {isEditing && !isViewMode && (
                  <button
                    onClick={handleAddQuestion}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>
                        {section === 'all' ? 'All Sections' : section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  {filteredQuestions.length} of {configuration.questions.length} questions
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="divide-y divide-gray-200">
              {filteredQuestions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterSection !== 'all' ? 'No questions found' : 'No questions yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterSection !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Add your first question to get started'
                    }
                  </p>
                  {isEditing && !isViewMode && (
                    <button
                      onClick={handleAddQuestion}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </button>
                  )}
                </div>
              ) : (
                filteredQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-500">
                            #{question.order}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {question.text || question.textKey}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.enabled)}`}>
                            {getStatusText(question.enabled)}
                          </span>
                          {question.required && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                          {question.optional && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Optional
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Section: {question.section}</span>
                          <span>Key: {question.textKey}</span>
                          {question.placeholder && (
                            <span>Placeholder: {question.placeholder}</span>
                          )}
                        </div>
                        {question.helpText && (
                          <p className="mt-2 text-sm text-gray-600">{question.helpText}</p>
                        )}
                      </div>
                      {isEditing && !isViewMode && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                            title="Edit question"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
