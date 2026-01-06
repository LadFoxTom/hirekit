/**
 * Smart CV Mapping - Main Admin Page
 * 
 * Revolutionary AI-powered system that connects chatbot flows to CV documents
 * with intelligent field mapping, visual configuration, and real-time preview.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  Eye,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  BarChart3,
  Users,
  Globe,
  Plus,
  Edit3,
  Play,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  FileText,
  Link,
  Clock,
  GitBranch,
  HelpCircle,
  Wrench
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import VisualMappingInterface from '@/components/smart-mapping/VisualMappingInterface';
import QuestionLibrary from '@/components/smart-mapping/QuestionLibrary';
import { useSmartCVMapping } from '@/hooks/useSmartCVMapping';
import { FlowNode, FlowEdge } from '@/types/flow';
import { CVData } from '@/types/cv';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';

interface Flow {
  id: string;
  name: string;
  description?: string;
  data: any;
  isActive: boolean;
  isDefault: boolean;
  flowType?: 'basic' | 'advanced' | 'custom';
  targetUrl?: string;
  isLive: boolean;
  version: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  nodeCount?: number;
  edgeCount?: number;
  hasMapping?: boolean;
  mappingStatus?: 'not_configured' | 'configured' | 'ready' | 'live';
}

export default function SmartMappingPage() {
  const router = useRouter();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [selectedFlowMappingConfig, setSelectedFlowMappingConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flows' | 'mapping' | 'preview' | 'library'>('flows');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'configured' | 'not_configured' | 'live'>('all');

  // Load flows on mount
  useEffect(() => {
    loadFlows();
  }, []);

  const loadMappingConfig = async (flowId: string) => {
    try {
      const response = await fetch(`/api/smart-mapping?action=get_config&flowId=${flowId}`);
      if (response.ok) {
        const data = await response.json();
        return data.config;
      }
    } catch (error) {
      console.error('Error loading mapping config:', error);
    }
    return null;
  };

  const loadFlows = async () => {
    try {
      setLoading(true);
      
      // Load custom flows
      const response = await fetch('/api/flows');
      let flows = [];
      
      if (response.ok) {
        const data = await response.json();
        flows = Array.isArray(data) ? data.map(flow => ({
          ...flow,
          nodeCount: flow.data?.nodes?.length || 0,
          edgeCount: flow.data?.edges?.length || 0,
          hasMapping: !!flow.mappingConfig,
          mappingStatus: flow.isLive ? 'live' : (flow.mappingConfig ? 'configured' : 'not_configured'),
          mappingConfig: flow.mappingConfig, // Store the mapping config in the flow object
          hasStructureIssues: !flow.data || !flow.data.nodes || !flow.data.edges || flow.data.nodes.length === 0
        })) : [];
      }
      
      // Add comprehensive template flows with actual data
      const templateFlows = [
        {
          id: 'basic_cv_flow',
          name: 'Basic CV Builder Flow',
          description: 'Complete basic CV builder flow with essential questions for quick CV creation',
          data: BASIC_CV_FLOW,
          isActive: true,
          isDefault: true,
          flowType: 'basic' as const,
          targetUrl: '/quick-cv',
          isLive: true,
          version: '1.0.0',
          createdBy: 'System',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodeCount: BASIC_CV_FLOW.nodes.length,
          edgeCount: BASIC_CV_FLOW.edges.length,
          hasMapping: true,
          mappingStatus: 'live' as const
        },
        {
          id: 'advanced_cv_flow',
          name: 'Advanced CV Builder Flow',
          description: 'Comprehensive advanced CV builder flow with detailed questions, conditional branching, and optimization features',
          data: ADVANCED_CV_FLOW,
          isActive: true,
          isDefault: true,
          flowType: 'advanced' as const,
          targetUrl: '/builder',
          isLive: true,
          version: '1.0.0',
          createdBy: 'System',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodeCount: ADVANCED_CV_FLOW.nodes.length,
          edgeCount: ADVANCED_CV_FLOW.edges.length,
          hasMapping: true,
          mappingStatus: 'live' as const
        }
      ];

      // Merge with existing flows
      const allFlows = [...flows, ...templateFlows.filter(tf => !flows.find(f => f.id === tf.id))];
      setFlows(allFlows);
    } catch (error) {
      console.error('Failed to load flows:', error);
      toast.error('Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureMapping = async (flow: Flow) => {
    setSelectedFlow(flow);
    setActiveTab('mapping');
    
    // First check if flow already has mapping config from database
    let mappingConfig = (flow as any).mappingConfig;
    
    // If not found in flow data, try to load from smart-mapping API
    if (!mappingConfig) {
      mappingConfig = await loadMappingConfig(flow.id);
    }
    
    setSelectedFlowMappingConfig(mappingConfig);
    
    console.log('Loaded mapping config for flow:', flow.id, mappingConfig);
  };

  const handleSetLive = async (flow: Flow) => {
    try {
      const response = await fetch('/api/flows/set-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          flowId: flow.id, 
          targetUrl: flow.targetUrl 
        })
      });

      if (response.ok) {
        toast.success(`"${flow.name}" is now live!`);
        loadFlows();
      } else {
        toast.error('Failed to set flow as live');
      }
    } catch (error) {
      console.error('Error setting flow as live:', error);
      toast.error('Failed to set flow as live');
    }
  };

  const handleCreateNewFlow = () => {
    router.push('/adminx/flows/designer');
  };

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (flow.description && flow.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'configured' && flow.hasMapping) ||
                         (filterStatus === 'not_configured' && !flow.hasMapping) ||
                         (filterStatus === 'live' && flow.isLive);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'configured': return 'bg-yellow-100 text-yellow-800';
      case 'not_configured': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-4 h-4" />;
      case 'ready': return <Target className="w-4 h-4" />;
      case 'configured': return <Settings className="w-4 h-4" />;
      case 'not_configured': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mb-4"
              >
                <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">Smart CV Mapping</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600"
              >
                Revolutionary AI-powered system that intelligently connects chatbot flows to CV documents
              </motion.p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateNewFlow}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Flow
              </button>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">💡 Pro Tip: Flow Structure Issues?</p>
                <p className="text-blue-700 mt-1">
                  If you don't see flow nodes in the mapping interface, your flow may have structure issues. 
                  Use the <strong>"Diagnose"</strong> button on any flow to check and fix the structure automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-1">
            {[
              { id: 'flows', label: 'Flow Management', icon: GitBranch },
              { id: 'mapping', label: 'Smart Mapping', icon: Target },
              { id: 'preview', label: 'Live Preview', icon: Eye },
              { id: 'library', label: 'Question Library', icon: HelpCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'flows' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Flow Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search flows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Flows</option>
                    <option value="configured">Configured</option>
                    <option value="not_configured">Not Configured</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>

              {/* Flows Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFlows.map((flow, index) => (
                    <motion.div
                      key={flow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{flow.name}</h3>
                          {flow.description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {flow.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {(flow as any).hasStructureIssues && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              <span>Structure Issues</span>
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(flow.mappingStatus || 'not_configured')}`}>
                            {getStatusIcon(flow.mappingStatus || 'not_configured')}
                            <span className="ml-1">{flow.mappingStatus || 'Not Configured'}</span>
                          </span>
                        </div>
                      </div>

                      {(flow as any).hasStructureIssues && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-red-800 font-medium">Flow structure needs attention</p>
                              <p className="text-red-700 mt-1">
                                This flow may have missing nodes or edges. Click "Diagnose" to check and fix the structure.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {flow.nodeCount || 0} nodes
                          </span>
                          <span className="flex items-center">
                            <Link className="w-4 h-4 mr-1" />
                            {flow.edgeCount || 0} connections
                          </span>
                        </div>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(flow.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleConfigureMapping(flow)}
                            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Configure
                          </button>
                          <button
                            onClick={() => router.push(`/adminx/flows/designer?flowId=${flow.id}`)}
                            className="flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => router.push(`/adminx/flows/diagnose?flowId=${flow.id}`)}
                            className="flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                            title="Diagnose flow structure issues"
                          >
                            <Wrench className="w-3 h-3 mr-1" />
                            Diagnose
                          </button>
                        </div>
                        {flow.hasMapping && (
                          <button
                            onClick={() => handleSetLive(flow)}
                            disabled={flow.isLive}
                            className={`flex items-center px-3 py-1 text-sm rounded transition-colors ${
                              flow.isLive
                                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {flow.isLive ? 'Live' : 'Set Live'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'mapping' && selectedFlow && (
          <VisualMappingInterface
              flowNodes={selectedFlow.data?.nodes || []}
              flowEdges={selectedFlow.data?.edges || []}
              cvTemplate={{
                // Career Stage & Industry
                careerStage: undefined,
                industrySector: '',
                targetRegion: '',
                
                // Enhanced Personal Information
                fullName: '',
                pronouns: '',
                professionalHeadline: '',
                careerObjective: '',
                title: '',
                
                // Enhanced Contact Information
                contact: { 
                  email: '', 
                  phone: '', 
                  location: '' 
                },
                
                // Legal & Availability
                workAuthorization: '',
                availability: '',
                
                // Social Links
                social: {
                  linkedin: '',
                  github: '',
                  website: '',
                  twitter: '',
                  instagram: ''
                },
                
                // Professional Summary
                summary: '',
                
                // Education Level
                highestEducation: '',
                
                // Enhanced Experience Structure
                experience: [],
                
                // Enhanced Education Structure
                education: [],
                
                // Enhanced Skills Structure
                skills: {
                  technical: [],
                  soft: [],
                  tools: [],
                  industry: []
                },
                
                // Additional Sections
                languages: [],
                hobbies: [],
                certifications: [],
                projects: [],
                volunteerWork: [],
                awardsRecognition: [],
                professionalMemberships: [],
                publicationsResearch: [],
                references: '',
                
                // Layout & Metadata
                photoUrl: '',
                template: '',
                goal: '',
                experienceLevel: '',
                onboardingCompleted: false
              }}
              initialConfig={selectedFlowMappingConfig ? {
                ...selectedFlowMappingConfig,
                flowId: selectedFlow.id
              } : {
                id: `mapping-${selectedFlow.id}`,
                name: `${selectedFlow.name} Mapping`,
                description: `Smart mapping configuration for ${selectedFlow.name}`,
                flowId: selectedFlow.id,
                mappings: [],
                transformations: [],
                validations: [],
                industryContext: 'Universal',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }}
              onMappingUpdate={(config) => {
                console.log('Mapping updated:', config);
                toast.success('Mapping configuration updated!');
                // Update local mapping config state
                setSelectedFlowMappingConfig(config);
                // Update flow mapping status
                setFlows(prev => prev.map(f => 
                  f.id === selectedFlow.id 
                    ? { ...f, hasMapping: true, mappingStatus: 'configured' }
                    : f
                ));
              }}
              onPreviewUpdate={(preview) => {
                console.log('Preview updated:', preview);
              }}
            />
        )}

        {activeTab === 'mapping' && !selectedFlow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flow Selected</h3>
            <p className="text-gray-600 mb-6">Select a flow from the Flow Management tab to configure its mapping.</p>
            <button
              onClick={() => setActiveTab('flows')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Flow Management
            </button>
          </motion.div>
        )}

        {activeTab === 'preview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              <p className="text-gray-600">Preview how mapped data will appear in the CV document.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'library' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <QuestionLibrary
              onSelectTemplate={(template) => {
                console.log('Selected template:', template);
                toast.success(`"${template.name}" selected for use`);
              }}
              onImportTemplate={(template) => {
                console.log('Import template:', template);
                toast.success(`"${template.name}" imported to current flow`);
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}