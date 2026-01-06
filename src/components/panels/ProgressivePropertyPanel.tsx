'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Zap,
  Eye,
  Code,
  Palette,
  Shield,
  Info
} from 'lucide-react';
import { 
  SmartNode, 
  ConfigSection, 
  ConfigField, 
  ValidationResult, 
  ConfigSuggestion,
  ALL_VARIANTS 
} from '@/types/flow-redesign';

interface ProgressivePropertyPanelProps {
  node: SmartNode | null;
  onUpdate: (nodeId: string, updates: Partial<SmartNode>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ProgressivePropertyPanel = memo(({ 
  node, 
  onUpdate, 
  onClose, 
  isOpen 
}: ProgressivePropertyPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>('quick');

  // Get variant configuration
  const variant = useMemo(() => {
    if (!node) return null;
    return (ALL_VARIANTS as any)[node.type]?.[node.variant];
  }, [node]);

  // Generate configuration sections based on node type and variant
  const configSections = useMemo((): ConfigSection[] => {
    if (!node || !variant) return [];

    const sections: ConfigSection[] = [
      {
        id: 'basic',
        title: 'Basic Settings',
        description: 'Essential configuration for this node',
        expanded: expandedSections.includes('basic'),
        required: true,
        fields: [
          {
            id: 'title',
            type: 'text',
            label: 'Node Title',
            description: 'A clear, descriptive name for this node',
            required: true,
            value: node.config.title || variant.name
          },
          {
            id: 'description',
            type: 'textarea',
            label: 'Description',
            description: 'Optional description of what this node does',
            required: false,
            value: node.config.description || ''
          }
        ]
      }
    ];

    // Add variant-specific sections
    if (node.type === 'interaction') {
      if (node.variant === 'question') {
        sections.push({
          id: 'question',
          title: 'Question Configuration',
          description: 'Configure the question and response options',
          expanded: expandedSections.includes('question'),
          required: true,
          fields: [
            {
              id: 'questionText',
              type: 'textarea',
              label: 'Question Text',
              description: 'The question to ask the user',
              required: true,
              value: node.config.variantConfig.question || ''
            },
            {
              id: 'questionType',
              type: 'select',
              label: 'Question Type',
              description: 'How the user will respond',
              required: true,
              value: node.config.variantConfig.questionType || 'text',
              options: [
                { label: 'Text Input', value: 'text' },
                { label: 'Multiple Choice', value: 'multiple-choice' },
                { label: 'Yes/No', value: 'yes-no' },
                { label: 'Rating (1-5)', value: 'rating' },
                { label: 'Email', value: 'email' },
                { label: 'Phone', value: 'phone' }
              ]
            },
            {
              id: 'required',
              type: 'checkbox',
              label: 'Required',
              description: 'User must answer this question',
              required: false,
              value: node.config.variantConfig.required || false
            },
            {
              id: 'variableName',
              type: 'text',
              label: 'Variable Name',
              description: 'Where to store the user\'s response',
              required: true,
              value: node.config.variantConfig.variableName || ''
            }
          ]
        });
      }
    } else if (node.type === 'logic') {
      if (node.variant === 'condition') {
        sections.push({
          id: 'condition',
          title: 'Condition Logic',
          description: 'Define the conditions for branching',
          expanded: expandedSections.includes('condition'),
          required: true,
          fields: [
            {
              id: 'conditionType',
              type: 'select',
              label: 'Condition Type',
              description: 'Simple true/false or multi-output branching',
              required: true,
              value: node.config.variantConfig.conditionType || 'simple',
              options: [
                { label: 'Simple (True/False)', value: 'simple' },
                { label: 'Multi-Output (A, B, C...)', value: 'multi-output' }
              ]
            }
          ]
        });
      }
    }

    // Add validation section
    sections.push({
      id: 'validation',
      title: 'Validation & Rules',
      description: 'Configure validation rules and error handling',
      expanded: expandedSections.includes('validation'),
      required: false,
      fields: [
        {
          id: 'validationRules',
          type: 'json',
          label: 'Validation Rules',
          description: 'Custom validation rules for this node',
          required: false,
          value: node.config.validation || {}
        }
      ]
    });

    // Add styling section
    sections.push({
      id: 'styling',
      title: 'Visual Styling',
      description: 'Customize the appearance of this node',
      expanded: expandedSections.includes('styling'),
      required: false,
      fields: [
        {
          id: 'customColor',
          type: 'text',
          label: 'Custom Color',
          description: 'Override the default node color',
          required: false,
          value: node.visualState.color || variant.color
        },
        {
          id: 'customIcon',
          type: 'text',
          label: 'Custom Icon',
          description: 'Override the default node icon',
          required: false,
          value: node.visualState.icon || variant.icon
        }
      ]
    });

    return sections;
  }, [node, variant, expandedSections]);

  // Generate validation results
  const validationResults = useMemo((): ValidationResult[] => {
    if (!node) return [];

    const results: ValidationResult[] = [];

    // Check required fields
    configSections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && (!field.value || field.value === '')) {
          results.push({
            field: field.id,
            valid: false,
            message: `${field.label} is required`,
            severity: 'error'
          });
        }
      });
    });

    // Check variant-specific validation
    if (node.type === 'interaction' && node.variant === 'question') {
      if (!node.config.variantConfig.question) {
        results.push({
          field: 'question',
          valid: false,
          message: 'Question text is required',
          severity: 'error'
        });
      }
      if (!node.config.variantConfig.variableName) {
        results.push({
          field: 'variableName',
          valid: false,
          message: 'Variable name is required',
          severity: 'error'
        });
      }
    }

    return results;
  }, [node, configSections]);

  // Generate suggestions
  const suggestions = useMemo((): ConfigSuggestion[] => {
    if (!node) return [];

    const suggestions: ConfigSuggestion[] = [];

    // Suggest adding description if missing
    if (!node.config.description) {
      suggestions.push({
        id: 'add-description',
        type: 'best-practice',
        title: 'Add Description',
        description: 'Adding a description helps other users understand this node\'s purpose',
        action: () => {
          // Auto-fill description based on variant
          onUpdate(node.id, {
            config: {
              ...node.config,
              description: variant?.description || ''
            }
          });
        },
        priority: 'medium'
      });
    }

    // Suggest variable naming convention
    if (node.type === 'interaction' && node.variant === 'question') {
      const varName = node.config.variantConfig.variableName;
      if (varName && !varName.match(/^[a-z][a-zA-Z0-9]*$/)) {
        suggestions.push({
          id: 'fix-variable-name',
          type: 'best-practice',
          title: 'Improve Variable Name',
          description: 'Variable names should start with a lowercase letter and contain only letters and numbers',
          action: () => {
            const fixedName = varName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            onUpdate(node.id, {
              config: {
                ...node.config,
                variantConfig: {
                  ...node.config.variantConfig,
                  variableName: fixedName
                }
              }
            });
          },
          priority: 'high'
        });
      }
    }

    return suggestions;
  }, [node, variant, onUpdate]);

  // Handle field updates
  const handleFieldUpdate = useCallback((fieldId: string, value: any) => {
    if (!node) return;

    // Update the appropriate part of the node configuration
    if (fieldId === 'title') {
      onUpdate(node.id, {
        config: {
          ...node.config,
          title: value
        }
      });
    } else if (fieldId === 'description') {
      onUpdate(node.id, {
        config: {
          ...node.config,
          description: value
        }
      });
    } else {
      // Update variant-specific configuration
      onUpdate(node.id, {
        config: {
          ...node.config,
          variantConfig: {
            ...node.config.variantConfig,
            [fieldId]: value
          }
        }
      });
    }
  }, [node, onUpdate]);

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  // Render field input
  const renderField = (field: ConfigField) => {
    const commonProps = {
      value: field.value || '',
      onChange: (e: any) => handleFieldUpdate(field.id, e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            {...commonProps}
            type="text"
            placeholder={field.description}
          />
        );
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={3}
            placeholder={field.description}
          />
        );
      case 'select':
        return (
          <select {...commonProps}>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={field.value || false}
            onChange={(e) => handleFieldUpdate(field.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min={0}
          />
        );
      case 'json':
        return (
          <textarea
            {...commonProps}
            rows={4}
            placeholder="Enter JSON configuration..."
            value={JSON.stringify(field.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldUpdate(field.id, parsed);
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            className={`${commonProps.className} font-mono text-xs`}
          />
        );
      default:
        return null;
    }
  };

  if (!node || !variant) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50"
          >
            <div className="p-4">
              <div className="text-center text-gray-500">
                <Settings size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select a node to configure its properties</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Node Properties</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {/* Node Summary */}
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: variant.color }}
              >
                {variant.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{variant.name}</div>
                <div className="text-sm text-gray-600">{variant.description}</div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center space-x-2">
              {validationResults.length === 0 ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Configured</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">{validationResults.length} issues</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'quick'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quick Settings
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'detailed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed Config
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'quick' ? (
              /* Quick Settings */
              <div className="p-4 space-y-4">
                {/* Basic Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Node Title
                  </label>
                  <input
                    type="text"
                    value={node.config.title || variant.name}
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter node title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={node.config.description || ''}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Optional description..."
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lightbulb size={16} className="mr-1" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map(suggestion => (
                        <div key={suggestion.id} className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-900">
                            {suggestion.title}
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            {suggestion.description}
                          </div>
                          <button
                            onClick={suggestion.action}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Apply suggestion
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Detailed Configuration */
              <div className="p-4 space-y-4">
                {configSections.map(section => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{section.title}</div>
                        {section.description && (
                          <div className="text-sm text-gray-600">{section.description}</div>
                        )}
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 space-y-3"
                        >
                          {section.fields.map(field => (
                            <div key={field.id}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {field.description && (
                                <p className="text-xs text-gray-600 mb-2">{field.description}</p>
                              )}
                              {renderField(field)}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {validationResults.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium text-red-600 mb-1">Issues found:</div>
                  {validationResults.map(result => (
                    <div key={result.field} className="text-red-600">
                      • {result.message}
                    </div>
                  ))}
                </div>
              )}
              <div>Node ID: {node.id}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ProgressivePropertyPanel.displayName = 'ProgressivePropertyPanel';

export default ProgressivePropertyPanel;
