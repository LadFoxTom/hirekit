/**
 * Smart CV Mapping Hook
 * 
 * React hook that integrates the Smart CV Mapping Engine with the existing flow system
 * providing seamless connection between chatbot flows and CV documents.
 */

import { useState, useEffect, useCallback } from 'react';
import { SmartCVMapper, SmartMappingConfig, MappingResult } from '@/lib/smart-cv-mapper';
import { CVData } from '@/types/cv';
import { FlowNode, FlowEdge } from '@/types/flow';
import { toast } from 'react-hot-toast';
import { BASIC_CV_MAPPING_CONFIG, ADVANCED_CV_MAPPING_CONFIG } from '@/data/smartMappingConfigs';

interface UseSmartCVMappingProps {
  flowId: string;
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  cvData: CVData;
  onCVUpdate: (update: Partial<CVData>) => void;
}

interface UseSmartCVMappingReturn {
  // Core functionality
  mapper: SmartCVMapper | null;
  config: SmartMappingConfig | null;
  isInitialized: boolean;
  
  // Mapping operations
  processUserInput: (
    userInput: string,
    conversationHistory: Array<{ role: string; content: string }>,
    currentNode: FlowNode,
    flowState: Record<string, any>
  ) => Promise<MappingResult>;
  
  // Configuration
  createMappingConfig: (config: Partial<SmartMappingConfig>) => Promise<void>;
  updateMappingConfig: (config: SmartMappingConfig) => Promise<void>;
  
  // AI features
  generateMappingSuggestions: () => Promise<any[]>;
  learnFromCorrection: (originalMapping: any, correction: any) => Promise<void>;
  
  // Preview
  generatePreview: (mappedData: Record<string, any>) => Promise<CVData>;
  
  // State
  isLoading: boolean;
  error: string | null;
  lastMappingResult: MappingResult | null;
}

export function useSmartCVMapping({
  flowId,
  flowNodes,
  flowEdges,
  cvData,
  onCVUpdate
}: UseSmartCVMappingProps): UseSmartCVMappingReturn {
  const [mapper, setMapper] = useState<SmartCVMapper | null>(null);
  const [config, setConfig] = useState<SmartMappingConfig | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMappingResult, setLastMappingResult] = useState<MappingResult | null>(null);

  // Initialize mapping configuration
  const initializeMapping = useCallback(async () => {
    if (!flowId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load predefined configuration based on flow ID
      let predefinedConfig: SmartMappingConfig | null = null;
      
      if (flowId === 'basic_cv_flow') {
        predefinedConfig = BASIC_CV_MAPPING_CONFIG;
      } else if (flowId === 'advanced_cv_flow') {
        predefinedConfig = ADVANCED_CV_MAPPING_CONFIG;
      }

      if (predefinedConfig) {
        // Use predefined configuration
        setConfig(predefinedConfig);
        setMapper(new SmartCVMapper(predefinedConfig));
        setIsInitialized(true);
        toast.success(`Loaded ${predefinedConfig.name} configuration`);
      } else {
        // Check if custom config exists
        const response = await fetch(`/api/smart-mapping?action=get_config&flowId=${flowId}`);
        
        if (response.ok) {
          const { config: existingConfig } = await response.json();
          setConfig(existingConfig);
          setMapper(new SmartCVMapper(existingConfig));
        } else {
          // Create new config
          const newConfigResponse = await fetch('/api/smart-mapping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create_mapping_config',
              data: {
                flowId,
                name: `Mapping for ${flowId}`,
                description: 'Auto-generated mapping configuration',
                industryContext: 'General'
              }
            })
          });

        if (newConfigResponse.ok) {
          const { config: newConfig } = await newConfigResponse.json();
          setConfig(newConfig);
          setMapper(new SmartCVMapper(newConfig));
        } else {
          throw new Error('Failed to create mapping configuration');
        }
      }
    }

      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize smart CV mapping:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to initialize smart CV mapping');
    } finally {
      setIsLoading(false);
    }
  }, [flowId]);

  // Process user input and map to CV fields
  const processUserInput = useCallback(async (
    userInput: string,
    conversationHistory: Array<{ role: string; content: string }>,
    currentNode: FlowNode,
    flowState: Record<string, any>
  ): Promise<MappingResult> => {
    if (!mapper) {
      // Return a fallback result if mapper is not available
      const fallbackResult: MappingResult = {
        success: true,
        cvUpdate: { summary: userInput },
        confidence: 0.5,
        warnings: ['Using fallback mapping - AI features not available'],
        suggestions: ['Configure OpenAI API key for full AI functionality'],
        appliedTransformations: [],
        appliedValidations: []
      };
      
      onCVUpdate(fallbackResult.cvUpdate);
      toast.success('CV updated with fallback mapping');
      return fallbackResult;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mapper.mapToCVFields(
        userInput,
        conversationHistory,
        currentNode,
        flowState
      );

      setLastMappingResult(result);

      // Apply CV update if successful
      if (result.success && Object.keys(result.cvUpdate).length > 0) {
        onCVUpdate(result.cvUpdate);
        
        // Show success message with confidence
        const confidence = Math.round(result.confidence * 100);
        toast.success(`CV updated with ${confidence}% confidence`);
        
        // Show warnings if any
        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            toast.error(warning);
          });
        }
      }

      return result;
    } catch (err) {
      console.error('Failed to process user input:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to process user input');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [mapper, onCVUpdate]);

  // Create mapping configuration
  const createMappingConfig = useCallback(async (configData: Partial<SmartMappingConfig>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_mapping_config',
          data: {
            flowId,
            ...configData
          }
        })
      });

      if (response.ok) {
        const { config: newConfig } = await response.json();
        setConfig(newConfig);
        setMapper(new SmartCVMapper(newConfig));
        toast.success('Mapping configuration created successfully');
      } else {
        throw new Error('Failed to create mapping configuration');
      }
    } catch (err) {
      console.error('Failed to create mapping configuration:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to create mapping configuration');
    } finally {
      setIsLoading(false);
    }
  }, [flowId]);

  // Update mapping configuration
  const updateMappingConfig = useCallback(async (newConfig: SmartMappingConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_mapping',
          data: {
            flowId,
            mapping: newConfig
          }
        })
      });

      if (response.ok) {
        setConfig(newConfig);
        setMapper(new SmartCVMapper(newConfig));
        toast.success('Mapping configuration updated successfully');
      } else {
        throw new Error('Failed to update mapping configuration');
      }
    } catch (err) {
      console.error('Failed to update mapping configuration:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to update mapping configuration');
    } finally {
      setIsLoading(false);
    }
  }, [flowId]);

  // Generate AI mapping suggestions
  const generateMappingSuggestions = useCallback(async (): Promise<any[]> => {
    if (!mapper) {
      // Return fallback suggestions based on variable names
      const fallbackSuggestions = flowNodes
        .filter(node => node.type === 'question' && node.data?.variableName)
        .map(node => ({
          nodeId: node.id,
          suggestedField: getSuggestedFieldFromVariable(node.data?.variableName || ''),
          suggestedSection: getSuggestedSectionFromVariable(node.data?.variableName || ''),
          confidence: 0.7,
          reasoning: `Based on variable name "${node.data?.variableName}"`
        }));
      
      toast.success(`Generated ${fallbackSuggestions.length} fallback mapping suggestions`);
      return fallbackSuggestions;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_suggestions',
          data: {
            flowId,
            flowNodes,
            cvTemplate: cvData
          }
        })
      });

      if (response.ok) {
        const { suggestions } = await response.json();
        toast.success(`Generated ${suggestions.length} AI mapping suggestions`);
        return suggestions;
      } else {
        throw new Error('Failed to generate mapping suggestions');
      }
    } catch (err) {
      console.error('Failed to generate mapping suggestions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to generate mapping suggestions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mapper, flowId, flowNodes, cvData]);

  // Helper function to get suggested field from variable name
  const getSuggestedFieldFromVariable = (variableName: string): string => {
    const name = variableName.toLowerCase();
    if (name.includes('name') || name.includes('fullname')) return 'fullName';
    if (name.includes('title') || name.includes('job')) return 'title';
    if (name.includes('email')) return 'contact.email';
    if (name.includes('phone')) return 'contact.phone';
    if (name.includes('location') || name.includes('address')) return 'contact.location';
    if (name.includes('skill')) return 'skills';
    if (name.includes('experience') || name.includes('work')) return 'experience.0.title';
    if (name.includes('education') || name.includes('degree')) return 'education.0.degree';
    if (name.includes('summary') || name.includes('about')) return 'summary';
    return 'summary';
  };

  // Helper function to get suggested section from variable name
  const getSuggestedSectionFromVariable = (variableName: string): string => {
    const name = variableName.toLowerCase();
    if (name.includes('name') || name.includes('title') || name.includes('email') || name.includes('phone') || name.includes('location')) return 'Personal';
    if (name.includes('experience') || name.includes('work') || name.includes('job')) return 'Experience';
    if (name.includes('education') || name.includes('degree')) return 'Education';
    if (name.includes('skill')) return 'Skills';
    if (name.includes('summary') || name.includes('about')) return 'Summary';
    return 'Summary';
  };

  // Learn from user corrections
  const learnFromCorrection = useCallback(async (originalMapping: any, correction: any) => {
    if (!mapper) {
      throw new Error('Smart CV mapper not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'learn_from_correction',
          data: {
            flowId,
            originalMapping,
            correction
          }
        })
      });

      if (response.ok) {
        toast.success('Learning applied successfully');
      } else {
        throw new Error('Failed to learn from correction');
      }
    } catch (err) {
      console.error('Failed to learn from correction:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to learn from correction');
    } finally {
      setIsLoading(false);
    }
  }, [mapper, flowId]);

  // Generate CV preview
  const generatePreview = useCallback(async (mappedData: Record<string, any>): Promise<CVData> => {
    if (!mapper) {
      throw new Error('Smart CV mapper not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_preview',
          data: {
            flowId,
            mappedData,
            cvTemplate: cvData
          }
        })
      });

      if (response.ok) {
        const { preview } = await response.json();
        return preview.preview;
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (err) {
      console.error('Failed to generate preview:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to generate preview');
      return cvData;
    } finally {
      setIsLoading(false);
    }
  }, [mapper, flowId, cvData]);

  // Initialize on mount
  useEffect(() => {
    initializeMapping();
  }, [initializeMapping]);

  return {
    // Core functionality
    mapper,
    config,
    isInitialized,
    
    // Mapping operations
    processUserInput,
    
    // Configuration
    createMappingConfig,
    updateMappingConfig,
    
    // AI features
    generateMappingSuggestions,
    learnFromCorrection,
    
    // Preview
    generatePreview,
    
    // State
    isLoading,
    error,
    lastMappingResult
  };
}

export default useSmartCVMapping;
