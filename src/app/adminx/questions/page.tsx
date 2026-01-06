'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle
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

export default function QuestionManagementPage() {
  const router = useRouter();
  const { showConfirm } = useModalContext();
  const [configurations, setConfigurations] = useState<QuestionConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'advanced' | 'simplified'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/question-configs');
      if (response.ok) {
        const data = await response.json();
        setConfigurations(data.configurations || []);
      } else {
        toast.error('Failed to load question configurations');
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast.error('Failed to load question configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfiguration = async (configId: string, configName: string) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${configName}"? This action cannot be undone.`,
      'Delete Configuration'
    );
    
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/question-configs/${configId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Configuration deleted successfully');
          loadConfigurations();
        } else {
          toast.error('Failed to delete configuration');
        }
      } catch (error) {
        console.error('Error deleting configuration:', error);
        toast.error('Failed to delete configuration');
      }
    }
  };

  const handleEditConfiguration = (configId: string) => {
    router.push(`/adminx/questions/configs?configId=${configId}`);
  };

  const handleViewConfiguration = (configId: string) => {
    router.push(`/adminx/questions/configs?configId=${configId}&view=true`);
  };

  const filteredAndSortedConfigurations = configurations
    .filter(config => {
      const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (config.description && config.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || config.type === filterType;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && config.isActive) ||
                           (filterStatus === 'inactive' && !config.isActive);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime();
          break;
        case 'created':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'simplified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionStats = (questions: QuestionConfig[]) => {
    const total = questions.length;
    const enabled = questions.filter(q => q.enabled).length;
    const required = questions.filter(q => q.required).length;
    const optional = questions.filter(q => q.optional).length;
    
    return { total, enabled, required, optional };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                onClick={() => router.push('/adminx')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
                  Question Management
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Configure questions, responses, and validation rules
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/adminx/questions/configs')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="advanced">Advanced</option>
                  <option value="simplified">Simplified</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy as any);
                    setSortOrder(newSortOrder as any);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="updated-desc">Recently Updated</option>
                  <option value="updated-asc">Oldest Updated</option>
                  <option value="created-desc">Recently Created</option>
                  <option value="created-asc">Oldest Created</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Grid */}
        <div className="px-4 sm:px-0">
          {filteredAndSortedConfigurations.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 'No configurations found' : 'No configurations yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first question configuration'
                }
              </p>
              <button
                onClick={() => router.push('/adminx/questions/configs')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Configuration
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedConfigurations.map((config, index) => {
                const stats = getQuestionStats(config.questions);
                return (
                  <motion.div
                    key={config.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                            {config.isDefault && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          {config.description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {config.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="relative">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(config.type)}`}>
                            {config.type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(config.isActive)}`}>
                            {getStatusText(config.isActive)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Updated {formatDate(config.updatedAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>Total Questions:</span>
                          <span className="font-medium">{stats.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Enabled:</span>
                          <span className="font-medium text-green-600">{stats.enabled}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Required:</span>
                          <span className="font-medium text-red-600">{stats.required}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Optional:</span>
                          <span className="font-medium text-blue-600">{stats.optional}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2">
                        <button
                          onClick={() => handleViewConfiguration(config.id!)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditConfiguration(config.id!)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteConfiguration(config.id!, config.name)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        {configurations.length > 0 && (
          <div className="px-4 sm:px-0 mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{configurations.length}</div>
                  <div className="text-sm text-gray-600">Total Configurations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {configurations.filter(c => c.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Configurations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {configurations.filter(c => c.type === 'advanced').length}
                  </div>
                  <div className="text-sm text-gray-600">Advanced Configs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {configurations.reduce((acc, c) => acc + c.questions.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
