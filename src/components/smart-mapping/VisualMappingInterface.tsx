/**
 * Visual Flow-to-CV Mapping Interface
 * 
 * Revolutionary drag-and-drop interface for connecting chatbot flows to CV fields
 * with real-time preview and AI-powered suggestions.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Custom drag-and-drop implementation using native HTML5 API
import {
  Settings,
  Eye,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SmartCVMapper, SmartMappingConfig, FieldMapping, MappingSuggestion } from '@/lib/smart-cv-mapper';
import { FlowNode, FlowEdge } from '@/types/flow';
import { CVData } from '@/types/cv';

interface VisualMappingInterfaceProps {
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  cvTemplate: CVData;
  onMappingUpdate: (config: SmartMappingConfig) => void;
  onPreviewUpdate: (preview: CVData) => void;
  initialConfig?: SmartMappingConfig;
}

export default function VisualMappingInterface({
  flowNodes,
  flowEdges,
  cvTemplate,
  onMappingUpdate,
  onPreviewUpdate,
  initialConfig
}: VisualMappingInterfaceProps) {
  // Filter out non-draggable nodes (start, end nodes)
  const draggableNodes = useMemo(() => 
    flowNodes?.filter(node => 
      node.type !== 'start' && 
      node.type !== 'end'
    ) || [],
    [flowNodes]
  );
  
  const [mapper, setMapper] = useState<SmartCVMapper | null>(null);
  const [config, setConfig] = useState<SmartMappingConfig | null>(
    initialConfig || {
      id: 'default-mapping-config',
      name: 'Default Mapping Configuration',
      description: 'Default mapping configuration for flow',
      flowId: 'default',
      mappings: [],
      transformations: [],
      validations: [],
      industryContext: 'Universal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );
  const [activeTab, setActiveTab] = useState<'mapping' | 'preview' | 'ai-suggestions' | 'advanced'>('mapping');
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [mappingSuggestions, setMappingSuggestions] = useState<MappingSuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [previewData, setPreviewData] = useState<CVData>(cvTemplate);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedNode, setDraggedNode] = useState<FlowNode | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  // Update config when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      console.log('Updating config from initialConfig:', initialConfig);
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Initialize mapper
  useEffect(() => {
    if (config) {
      console.log('Initializing mapper with config:', config);
      console.log('Config mappings count:', config.mappings?.length || 0);
      const smartMapper = new SmartCVMapper(config);
      setMapper(smartMapper);
    }
  }, [config]);

  // Generate AI suggestions
  const generateAISuggestions = useCallback(async () => {
    if (!mapper) return;

    setIsGeneratingSuggestions(true);
    try {
      const suggestions = mapper.generateMappingSuggestions(draggableNodes, cvTemplate);
      setMappingSuggestions(suggestions);
      toast.success(`Generated ${suggestions.length} AI mapping suggestions`);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast.error('Failed to generate AI suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [mapper, draggableNodes, cvTemplate]);

  // Custom drag and drop handlers
  const handleDragStart = (e: React.DragEvent, node: FlowNode) => {
    console.log('Drag start:', node);
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setDraggedNode(null);
    setDragOverField(null);
  };

  const handleDragOver = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverField(field);
  };

  const handleDragLeave = () => {
    setDragOverField(null);
  };

  const handleDrop = (e: React.DragEvent, cvField: string) => {
    e.preventDefault();
    console.log('Drop on field:', cvField);
    
    if (draggedNode && config) {
      // Check if this node is already mapped
      const isAlreadyMapped = config.mappings.some(mapping => mapping.sourceNodeId === draggedNode.id);
      
      if (isAlreadyMapped) {
        toast.error('This node is already mapped to a CV field');
        setDraggedNode(null);
        setDragOverField(null);
        return;
      }

      // Check if this CV field is already mapped
      const fieldAlreadyMapped = config.mappings.some(mapping => mapping.targetCvField === cvField);
      
      if (fieldAlreadyMapped) {
        toast.error('This CV field is already mapped to a node');
        setDraggedNode(null);
        setDragOverField(null);
        return;
      }

      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        sourceNodeId: draggedNode.id,
        sourceVariable: draggedNode.data?.variableName || 'user_input',
        targetCvField: cvField,
        targetSection: cvField.split('.')[0],
        mappingType: 'direct',
        priority: 1,
        confidence: 0.8,
        isActive: true
      };

      const updatedConfig = {
        ...config,
        mappings: [...config.mappings, newMapping]
      };

      console.log('Creating new mapping:', newMapping);
      console.log('Updated config:', updatedConfig);

      setConfig(updatedConfig);
      onMappingUpdate(updatedConfig);
      toast.success(`Mapped ${draggedNode.data?.label} to ${cvField}`);
    }
    
    setDraggedNode(null);
    setDragOverField(null);
  };

  const handleDeleteMapping = (cvField: string) => {
    if (!config) return;
    
    const mappingToDelete = config.mappings.find(m => m.targetCvField === cvField);
    if (!mappingToDelete) return;
    
    const updatedConfig = {
      ...config,
      mappings: config.mappings.filter(m => m.targetCvField !== cvField)
    };
    
    console.log('Deleting mapping:', mappingToDelete);
    console.log('Updated config:', updatedConfig);
    
    setConfig(updatedConfig);
    onMappingUpdate(updatedConfig);
    toast.success(`Removed mapping for ${cvField}`);
  };

  // Apply AI suggestion
  const applySuggestion = (suggestion: MappingSuggestion) => {
    if (!config) return;

    const suggestionKey = `${suggestion.nodeId}_${suggestion.suggestedField}`;
    
    // Check if already applied
    if (appliedSuggestions.has(suggestionKey)) {
      toast('This suggestion has already been applied', { icon: 'ℹ️' });
      return;
    }

    const newMapping: FieldMapping = {
      id: `suggestion_${Date.now()}`,
      sourceNodeId: suggestion.nodeId,
      sourceVariable: 'user_input',
      targetCvField: suggestion.suggestedField,
      targetSection: suggestion.suggestedSection,
      mappingType: 'direct',
      priority: 1,
      confidence: suggestion.confidence,
      isActive: true
    };

    const updatedConfig = {
      ...config,
      mappings: [...config.mappings, newMapping]
    };

    setConfig(updatedConfig);
    onMappingUpdate(updatedConfig);
    
    // Mark suggestion as applied
    setAppliedSuggestions(prev => new Set(Array.from(prev).concat(suggestionKey)));
    
    toast.success(`Applied suggestion: ${suggestion.nodeLabel} → ${suggestion.suggestedField}`);
  };

  // Unapply AI suggestion
  const unapplySuggestion = (suggestion: MappingSuggestion) => {
    if (!config) return;

    const suggestionKey = `${suggestion.nodeId}_${suggestion.suggestedField}`;
    
    // Remove the mapping
    const updatedConfig = {
      ...config,
      mappings: config.mappings.filter(mapping => 
        !(mapping.sourceNodeId === suggestion.nodeId && mapping.targetCvField === suggestion.suggestedField)
      )
    };

    setConfig(updatedConfig);
    onMappingUpdate(updatedConfig);
    
    // Mark suggestion as not applied
    setAppliedSuggestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestionKey);
      return newSet;
    });
    
    toast.success(`Removed suggestion: ${suggestion.nodeLabel} → ${suggestion.suggestedField}`);
  };

  // Apply all suggestions
  const applyAllSuggestions = () => {
    if (!config || mappingSuggestions.length === 0) return;

    const newMappings: FieldMapping[] = [];
    const newAppliedSuggestions = new Set(appliedSuggestions);

    mappingSuggestions.forEach(suggestion => {
      const suggestionKey = `${suggestion.nodeId}_${suggestion.suggestedField}`;
      
      // Only apply if not already applied
      if (!appliedSuggestions.has(suggestionKey)) {
        const newMapping: FieldMapping = {
          id: `suggestion_${Date.now()}_${Math.random()}`,
          sourceNodeId: suggestion.nodeId,
          sourceVariable: 'user_input',
          targetCvField: suggestion.suggestedField,
          targetSection: suggestion.suggestedSection,
          mappingType: 'direct',
          priority: 1,
          confidence: suggestion.confidence,
          isActive: true
        };
        
        newMappings.push(newMapping);
        newAppliedSuggestions.add(suggestionKey);
      }
    });

    if (newMappings.length === 0) {
      toast('All suggestions have already been applied', { icon: 'ℹ️' });
      return;
    }

    const updatedConfig = {
      ...config,
      mappings: [...config.mappings, ...newMappings]
    };

    setConfig(updatedConfig);
    onMappingUpdate(updatedConfig);
    setAppliedSuggestions(newAppliedSuggestions);
    
    toast.success(`Applied ${newMappings.length} suggestions`);
  };

  // Save configuration
  const handleSaveConfiguration = useCallback(async () => {
    if (!config || !config.mappings || config.mappings.length === 0) {
      toast.error('No mappings to save');
      return;
    }

    console.log('Saving configuration:', {
      flowId: config.flowId,
      mappingsCount: config.mappings.length,
      config: config
    });

    try {
      const requestBody = {
        action: 'save_config',
        flowId: config.flowId,
        config: config
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        toast.success('Configuration saved successfully!');
        onMappingUpdate(config);
      } else {
        const error = await response.json();
        console.error('Save error response:', error);
        toast.error(error.message || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    }
  }, [config, onMappingUpdate]);

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!mapper || !config) return;

    try {
      // Generate realistic data based on current mappings
      const mockMappedData: Record<string, any> = {};
      
      // Create sample data for each mapped field
      config.mappings.forEach(mapping => {
        const field = mapping.targetCvField;
        const nodeLabel = flowNodes.find(n => n.id === mapping.sourceNodeId)?.data?.label || mapping.sourceNodeId;
        
        // Generate appropriate sample data based on field type
        if (field.includes('fullName') || field.includes('name')) {
          mockMappedData[field] = 'John Doe';
        } else if (field.includes('email')) {
          mockMappedData[field] = 'john.doe@example.com';
        } else if (field.includes('phone')) {
          mockMappedData[field] = '+1 (555) 123-4567';
        } else if (field.includes('location')) {
          mockMappedData[field] = 'San Francisco, CA';
        } else if (field.includes('title')) {
          mockMappedData[field] = 'Senior Software Engineer';
        } else if (field.includes('company')) {
          mockMappedData[field] = 'Tech Corp Inc.';
        } else if (field.includes('dates')) {
          mockMappedData[field] = '2020 - Present';
        } else if (field.includes('degree')) {
          mockMappedData[field] = 'Bachelor of Science in Computer Science';
        } else if (field.includes('institution')) {
          mockMappedData[field] = 'University of California';
        } else if (field.includes('summary')) {
          mockMappedData[field] = 'Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.';
        } else if (field.includes('achievements')) {
          mockMappedData[field] = 'Led development of microservices architecture that improved system performance by 40%';
        } else if (field.includes('technical')) {
          mockMappedData[field] = 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker';
        } else if (field.includes('soft')) {
          mockMappedData[field] = 'Leadership, Communication, Problem Solving, Team Collaboration';
        } else if (field.includes('tools')) {
          mockMappedData[field] = 'Git, Docker, Kubernetes, Jenkins, VS Code';
        } else if (field.includes('description')) {
          mockMappedData[field] = 'Built a comprehensive web application using modern technologies and best practices.';
        } else if (field.includes('technologies')) {
          mockMappedData[field] = 'React, Node.js, MongoDB, AWS';
        } else if (field.includes('issuer')) {
          mockMappedData[field] = 'AWS Certified Solutions Architect';
        } else if (field.includes('language')) {
          mockMappedData[field] = 'English';
        } else if (field.includes('proficiency')) {
          mockMappedData[field] = 'Native';
        } else {
          // Default fallback - use the node label or a generic value
          mockMappedData[field] = `Sample data from ${nodeLabel}`;
        }
      });

      console.log('Generated mock data for preview:', mockMappedData);
      console.log('Current mappings:', config.mappings);

      const preview = mapper.generatePreview(mockMappedData, cvTemplate);
      console.log('Generated preview:', preview);
      
      setPreviewData(preview.preview);
      onPreviewUpdate(preview.preview);
      setIsPreviewMode(true);
      toast.success(`Preview generated with ${config.mappings.length} mapped fields`);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      toast.error('Failed to generate preview');
    }
  }, [mapper, config, cvTemplate, onPreviewUpdate, flowNodes]);

  // CV field structure for mapping - Comprehensive list of all available fields
  const cvFields = [
    { 
      section: 'Career Context', 
      fields: [
        'careerStage', 
        'industrySector', 
        'targetRegion',
        'workAuthorization',
        'availability',
        'highestEducation',
        'experienceLevel'
      ] 
    },
    { 
      section: 'Personal Information', 
      fields: [
        'fullName', 
        'pronouns',
        'professionalHeadline',
        'careerObjective',
        'title',
        'photoUrl'
      ] 
    },
    { 
      section: 'Contact Information', 
      fields: [
        'contact.email', 
        'contact.phone', 
        'contact.location'
      ] 
    },
    { 
      section: 'Social Links', 
      fields: [
        'social.linkedin', 
        'social.github', 
        'social.website', 
        'social.twitter', 
        'social.instagram'
      ] 
    },
    { 
      section: 'Professional Summary', 
      fields: [
        'summary'
      ] 
    },
    { 
      section: 'Work Experience', 
      fields: [
        'experience.0.title', 
        'experience.0.company', 
        'experience.0.type',
        'experience.0.location',
        'experience.0.current',
        'experience.0.dates', 
        'experience.0.achievements',
        'experience.0.content'
      ] 
    },
    { 
      section: 'Education', 
      fields: [
        'education.0.degree', 
        'education.0.institution', 
        'education.0.field', 
        'education.0.dates',
        'education.0.achievements',
        'education.0.content'
      ] 
    },
    { 
      section: 'Skills', 
      fields: [
        'skills.technical', 
        'skills.soft', 
        'skills.tools',
        'skills.industry'
      ] 
    },
    { 
      section: 'Languages', 
      fields: [
        'languages'
      ] 
    },
    { 
      section: 'Projects', 
      fields: [
        'projects.0.title', 
        'projects.0.description', 
        'projects.0.content'
      ] 
    },
    { 
      section: 'Certifications', 
      fields: [
        'certifications.0.title', 
        'certifications.0.content'
      ] 
    },
    { 
      section: 'Volunteer Work', 
      fields: [
        'volunteerWork.0.title', 
        'volunteerWork.0.content'
      ] 
    },
    { 
      section: 'Awards & Recognition', 
      fields: [
        'awardsRecognition.0.title', 
        'awardsRecognition.0.content'
      ] 
    },
    { 
      section: 'Professional Memberships', 
      fields: [
        'professionalMemberships'
      ] 
    },
    { 
      section: 'Publications & Research', 
      fields: [
        'publicationsResearch.0.title', 
        'publicationsResearch.0.content'
      ] 
    },
    { 
      section: 'Hobbies & Interests', 
      fields: [
        'hobbies'
      ] 
    },
    { 
      section: 'References', 
      fields: [
        'references'
      ] 
    },
    { 
      section: 'Layout & Metadata', 
      fields: [
        'template',
        'goal',
        'onboardingCompleted'
      ] 
    }
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Smart CV Mapping Engine</h2>
            <p className="text-sm text-gray-600">Connect chatbot flows to CV fields with AI-powered intelligence</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateAISuggestions}
              disabled={isGeneratingSuggestions}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isGeneratingSuggestions ? 'Generating...' : 'AI Suggestions'}
            </button>
            <button
              onClick={generatePreview}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSaveConfiguration}
              disabled={!config || !config.mappings || config.mappings.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex space-x-1">
          {[
            { id: 'mapping', label: 'Visual Mapping', icon: Target },
            { id: 'preview', label: 'Live Preview', icon: Eye },
            { id: 'ai-suggestions', label: 'AI Suggestions', icon: Brain },
            { id: 'advanced', label: 'Advanced Config', icon: Settings }
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

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'mapping' && (
          <div className="flex" style={{ height: '700px' }}>
            {/* Flow Nodes Panel */}
            <div className="w-1/3 bg-white border-r border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Flow Nodes</h3>
              <div
                className="space-y-2"
                style={{ height: '600px', overflowY: 'auto' }}
              >
                {draggableNodes.map((node) => {
                  const isAlreadyMapped = config?.mappings?.some(mapping => mapping.sourceNodeId === node.id);
                  const isDragging = draggedNode?.id === node.id;
                  
                  return (
                    <div
                      key={node.id}
                      draggable={!isAlreadyMapped}
                      onDragStart={(e) => !isAlreadyMapped && handleDragStart(e, node)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 border rounded-lg transition-all ${
                        isAlreadyMapped 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
                          : 'bg-blue-50 border-blue-200 cursor-move hover:shadow-md'
                      } ${isDragging ? 'opacity-50' : ''}`}
                      title={isAlreadyMapped ? 'This node is already mapped to a CV field' : 'Drag to map to a CV field'}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            isAlreadyMapped ? 'text-gray-500' : 'text-blue-900'
                          }`}>
                            {node.data?.label || node.id}
                            {isAlreadyMapped && ' ✓'}
                          </h4>
                          <p className={`text-sm ${
                            isAlreadyMapped ? 'text-gray-400' : 'text-blue-700'
                          }`}>
                            {node.type}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          isAlreadyMapped ? 'bg-gray-400' : 'bg-blue-400'
                        }`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CV Fields Panel */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">CV Fields</h3>
                {config?.mappings && config.mappings.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {config.mappings.length} mapping{config.mappings.length !== 1 ? 's' : ''} created
                  </div>
                )}
              </div>
              <div 
                className="space-y-6"
                style={{ height: '600px', overflowY: 'auto' }}
              >
                {cvFields.map((section) => (
                  <div key={section.section} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{section.section}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {section.fields.map((field) => (
                        <div
                          key={field}
                          onDragOver={(e) => handleDragOver(e, field)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, field)}
                          className={`p-3 border-2 border-dashed rounded-lg transition-all min-h-[60px] flex flex-col items-center justify-center relative ${
                            dragOverField === field
                              ? 'border-green-400 bg-green-50'
                              : config?.mappings?.find(m => m.targetCvField === field)
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {/* Delete button for mapped fields */}
                          {config?.mappings?.find(m => m.targetCvField === field) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMapping(field);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors"
                              title="Remove mapping"
                            >
                              <X size={12} />
                            </button>
                          )}
                          
                          <div className="text-sm text-gray-600 text-center">{field}</div>
                          {config?.mappings?.find(m => m.targetCvField === field) && (
                            <div className="text-xs text-blue-600 mt-1">
                              ✓ Mapped to: {config.mappings.find(m => m.targetCvField === field)?.sourceNodeId}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full p-6">
            <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Live CV Preview</h3>
                  <button
                    onClick={generatePreview}
                    disabled={!config?.mappings || config.mappings.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {config?.mappings && config.mappings.length > 0 
                      ? `Generate Preview (${config.mappings.length} mappings)` 
                      : 'No mappings to preview'
                    }
                  </button>
                </div>
                <div className="prose max-w-none">
                  {!previewData || Object.keys(previewData).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
                      <p className="text-gray-600 mb-4">
                        Create some mappings first, then click "Generate Preview" to see how your CV will look.
                      </p>
                      {config?.mappings && config.mappings.length > 0 && (
                        <p className="text-sm text-blue-600">
                          You have {config.mappings.length} mapping{config.mappings.length !== 1 ? 's' : ''} ready for preview.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h1 className="text-2xl font-bold">{previewData.fullName || 'Your Name'}</h1>
                      <p className="text-gray-600">{previewData.title || 'Your Title'}</p>
                      <p className="text-sm text-gray-500">
                        {previewData.contact?.email} | {previewData.contact?.phone} | {previewData.contact?.location}
                      </p>
                    
                    {previewData.summary && (
                      <div className="mt-6">
                        <h2 className="text-lg font-semibold">Professional Summary</h2>
                        <p className="text-gray-700">{previewData.summary}</p>
                      </div>
                    )}

                    {previewData.experience && previewData.experience.length > 0 && (
                      <div className="mt-6">
                        <h2 className="text-lg font-semibold">Experience</h2>
                        {previewData.experience.map((exp, index) => (
                          <div key={index} className="mt-4">
                            <h3 className="font-medium">{exp.title}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.dates}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-suggestions' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">AI-Powered Mapping Suggestions</h3>
                {mappingSuggestions.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {appliedSuggestions.size} of {mappingSuggestions.length} applied
                    </span>
                    <button
                      onClick={applyAllSuggestions}
                      disabled={appliedSuggestions.size === mappingSuggestions.length}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Apply All
                    </button>
                  </div>
                )}
              </div>
              
              {mappingSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No AI suggestions available yet.</p>
                  <button
                    onClick={generateAISuggestions}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Generate Suggestions
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mappingSuggestions.map((suggestion, index) => {
                    const suggestionKey = `${suggestion.nodeId}_${suggestion.suggestedField}`;
                    const isApplied = appliedSuggestions.has(suggestionKey);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-lg p-4 transition-all ${
                          isApplied 
                            ? 'bg-gray-50 border-gray-300 opacity-75' 
                            : 'bg-white border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${
                                  isApplied ? 'text-gray-500' : 'text-gray-900'
                                }`}>
                                  {suggestion.nodeLabel}
                                </span>
                                <ArrowRight className={`w-4 h-4 ${
                                  isApplied ? 'text-gray-400' : 'text-gray-400'
                                }`} />
                                <span className={`text-sm font-medium ${
                                  isApplied ? 'text-gray-500' : 'text-blue-600'
                                }`}>
                                  {suggestion.suggestedField}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  isApplied 
                                    ? 'text-gray-400 bg-gray-200' 
                                    : 'text-gray-500 bg-gray-100'
                                }`}>
                                  {suggestion.suggestedSection}
                                </span>
                                {isApplied && (
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                    ✓ Applied
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  suggestion.confidence > 0.8 ? 'bg-green-400' : 
                                  suggestion.confidence > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}></div>
                                <span className={`text-xs ${
                                  isApplied ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {Math.round(suggestion.confidence * 100)}% confidence
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm mt-1 ${
                              isApplied ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {suggestion.reasoning}
                            </p>
                            {suggestion.alternativeFields && suggestion.alternativeFields.length > 0 && (
                              <div className="mt-2">
                                <p className={`text-xs mb-1 ${
                                  isApplied ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Alternative fields:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {suggestion.alternativeFields.slice(0, 3).map((field: string, idx: number) => (
                                    <span key={idx} className={`text-xs px-2 py-1 rounded ${
                                      isApplied 
                                        ? 'bg-gray-200 text-gray-500' 
                                        : 'bg-blue-50 text-blue-600'
                                    }`}>
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {isApplied ? (
                              <button
                                onClick={() => unapplySuggestion(suggestion)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Unapply
                              </button>
                            ) : (
                              <button
                                onClick={() => applySuggestion(suggestion)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Advanced Configuration</h3>
              
              <div className="space-y-6">
                {/* Current Mappings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Current Mappings</h4>
                  {config?.mappings.length === 0 ? (
                    <p className="text-gray-600">No mappings configured yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {config?.mappings.map((mapping) => (
                        <div key={mapping.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{mapping.sourceNodeId}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="text-blue-600">{mapping.targetCvField}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {Math.round(mapping.confidence * 100)}%
                            </span>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Data Transformations */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Data Transformations</h4>
                  <p className="text-gray-600">Configure how data is transformed before mapping to CV fields.</p>
                </div>

                {/* Validation Rules */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Validation Rules</h4>
                  <p className="text-gray-600">Set up validation rules to ensure data quality.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
