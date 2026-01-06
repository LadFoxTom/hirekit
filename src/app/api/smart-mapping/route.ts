/**
 * Smart CV Mapping API
 * 
 * Revolutionary API that intelligently connects chatbot flows to CV documents
 * with AI-powered field mapping and real-time processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { SmartCVMapper, SmartMappingConfig } from '@/lib/smart-cv-mapper';
import { CVData } from '@/types/cv';
import { FlowNode, FlowEdge } from '@/types/flow';

// Use the existing database service pattern
function getPrisma() {
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }
  
  if (!globalForPrisma.prisma) {
    try {
      const { PrismaClient } = require('@prisma/client')
      globalForPrisma.prisma = new PrismaClient()
      console.log('✅ Prisma client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Prisma client:', error)
      throw error
    }
  }
  return globalForPrisma.prisma
}

// In-memory storage for demo (in production, use database)
const mappingConfigs = new Map<string, SmartMappingConfig>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Smart mapping API POST request:', JSON.stringify(body, null, 2));
    
    const { action, data, flowId, config } = body;

    // Handle save_config action with direct parameters
    if (action === 'save_config') {
      return await saveMappingConfig({ flowId, config });
    }

    // Handle other actions with data parameter
    switch (action) {
      case 'create_mapping_config':
        return await createMappingConfig(data);
      
      case 'process_user_input':
        return await processUserInput(data);
      
      case 'generate_suggestions':
        return await generateSuggestions(data);
      
      case 'update_mapping':
        return await updateMapping(data);
      
      case 'learn_from_correction':
        return await learnFromCorrection(data);
      
      case 'generate_preview':
        return await generatePreview(data);
      
      case 'export_config':
        return await exportMappingConfig(data);
      
      case 'import_config':
        return await importMappingConfig(data);
      
      default:
        console.error('Invalid action:', action);
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Smart mapping API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Error';
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flowId = searchParams.get('flowId');
    const action = searchParams.get('action');

    if (!flowId) {
      return NextResponse.json(
        { error: 'flowId parameter is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'get_config':
        return await getMappingConfig(flowId);
      
      case 'get_suggestions':
        return await getSuggestions(flowId);
      
      case 'export_config':
        return await exportMappingConfig({ flowId });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Smart mapping API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create a new mapping configuration
 */
async function createMappingConfig(data: {
  flowId: string;
  name: string;
  description: string;
  industryContext?: string;
  userPreferences?: any;
}): Promise<NextResponse> {
  const config: SmartMappingConfig = {
    id: `config_${Date.now()}`,
    name: data.name,
    description: data.description,
    flowId: data.flowId,
    mappings: [],
    transformations: [],
    validations: [],
    industryContext: data.industryContext,
    userPreferences: data.userPreferences,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mappingConfigs.set(data.flowId, config);

  return NextResponse.json({
    success: true,
    config
  });
}

/**
 * Process user input and map to CV fields
 */
async function processUserInput(data: {
  flowId: string;
  userInput: string;
  conversationHistory: Array<{ role: string; content: string }>;
  currentNode: FlowNode;
  flowState: Record<string, any>;
}): Promise<NextResponse> {
  const config = mappingConfigs.get(data.flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  const mapper = new SmartCVMapper(config);
  
  try {
    const result = await mapper.mapToCVFields(
      data.userInput,
      data.conversationHistory,
      data.currentNode,
      data.flowState
    );

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error processing user input:', error);
    return NextResponse.json(
      { error: 'Failed to process user input' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI-powered mapping suggestions
 */
async function generateSuggestions(data: {
  flowId: string;
  flowNodes: FlowNode[];
  cvTemplate: CVData;
}): Promise<NextResponse> {
  const config = mappingConfigs.get(data.flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  const mapper = new SmartCVMapper(config);
  
  try {
    const suggestions = mapper.generateMappingSuggestions(
      data.flowNodes,
      data.cvTemplate
    );

    return NextResponse.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

/**
 * Update mapping configuration
 */
async function updateMapping(data: {
  flowId: string;
  mapping: any;
}): Promise<NextResponse> {
  const config = mappingConfigs.get(data.flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  // Update the mapping
  const mappingIndex = config.mappings.findIndex(m => m.id === data.mapping.id);
  if (mappingIndex >= 0) {
    config.mappings[mappingIndex] = data.mapping;
  } else {
    config.mappings.push(data.mapping);
  }

  config.updatedAt = new Date().toISOString();
  mappingConfigs.set(data.flowId, config);

  return NextResponse.json({
    success: true,
    config
  });
}

/**
 * Learn from user corrections
 */
async function learnFromCorrection(data: {
  flowId: string;
  originalMapping: any;
  correction: any;
}): Promise<NextResponse> {
  const config = mappingConfigs.get(data.flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  const mapper = new SmartCVMapper(config);
  
  try {
    await mapper.learnFromCorrection(data.originalMapping, data.correction);
    
    // Update the stored config
    mappingConfigs.set(data.flowId, mapper['config']);

    return NextResponse.json({
      success: true,
      message: 'Learning applied successfully'
    });
  } catch (error) {
    console.error('Error learning from correction:', error);
    return NextResponse.json(
      { error: 'Failed to learn from correction' },
      { status: 500 }
    );
  }
}

/**
 * Generate CV preview
 */
async function generatePreview(data: {
  flowId: string;
  mappedData: Record<string, any>;
  cvTemplate: CVData;
}): Promise<NextResponse> {
  const config = mappingConfigs.get(data.flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  const mapper = new SmartCVMapper(config);
  
  try {
    const preview = mapper.generatePreview(data.mappedData, data.cvTemplate);

    return NextResponse.json({
      success: true,
      preview
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

/**
 * Get mapping configuration
 */
async function getMappingConfig(flowId: string | null): Promise<NextResponse> {
  if (!flowId) {
    return NextResponse.json(
      { error: 'Flow ID is required' },
      { status: 400 }
    );
  }

  // First try to get from memory
  let config = mappingConfigs.get(flowId);
  console.log('🔍 Checking memory cache for flow:', flowId, 'Found:', !!config);
  
  // If not found in memory, try to load from database
  if (!config) {
    try {
      const prisma = getPrisma();
      console.log('🔍 Checking database for flow:', flowId);
      const flow = await prisma.flow.findUnique({
        where: { id: flowId }
      });
      
      console.log('📊 Database query result:', {
        flowFound: !!flow,
        hasMappingConfig: !!(flow && flow.mappingConfig)
      });
      
      if (flow && flow.mappingConfig) {
        const mappingConfig = flow.mappingConfig as SmartMappingConfig;
        config = mappingConfig;
        // Store in memory for future requests
        mappingConfigs.set(flowId, mappingConfig);
        console.log('✅ Loaded mapping config from database for flow:', flowId);
      } else {
        console.log('❌ No mapping config found in database for flow:', flowId);
      }
    } catch (error) {
      console.error('❌ Error loading mapping config from database:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : 'Error';
      console.error('Error details:', {
        message: errorMessage,
        stack: errorStack,
        name: errorName
      });
    }
  } else {
    console.log('✅ Found mapping config in memory cache for flow:', flowId);
  }

  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    config
  });
}

/**
 * Get suggestions for a flow
 */
async function getSuggestions(flowId: string | null): Promise<NextResponse> {
  if (!flowId) {
    return NextResponse.json(
      { error: 'Flow ID is required' },
      { status: 400 }
    );
  }

  const config = mappingConfigs.get(flowId);
  if (!config) {
    return NextResponse.json(
      { error: 'Mapping configuration not found' },
      { status: 404 }
    );
  }

  // Return cached suggestions or generate new ones
  return NextResponse.json({
    success: true,
    suggestions: [] // Placeholder - would be cached or generated
  });
}

async function saveMappingConfig(data: {
  flowId: string;
  config: SmartMappingConfig;
}): Promise<NextResponse> {
  try {
    const { flowId, config } = data;
    
    if (!flowId || !config) {
      return NextResponse.json(
        { error: 'Flow ID and config are required' },
        { status: 400 }
      );
    }

    // Store the mapping configuration in memory
    const configWithTimestamp = {
      ...config,
      updatedAt: new Date().toISOString()
    };
    mappingConfigs.set(flowId, configWithTimestamp);

    // Also save to database directly
    let databaseSaveSuccess = false;
    try {
      console.log('🔍 Starting database save operation for flow:', flowId);
      const prisma = getPrisma();
      console.log('🔍 Checking if flow exists in database:', flowId);
      
      // Check if flow exists
      const existingFlow = await prisma.flow.findUnique({
        where: { id: flowId }
      });

      console.log('📊 Flow exists check result:', !!existingFlow);

      if (existingFlow) {
        console.log('🔄 Updating existing flow with mapping config');
        // Update existing flow with mapping config
        await prisma.flow.update({
          where: { id: flowId },
          data: {
            mappingConfig: configWithTimestamp,
            updatedAt: new Date()
          }
        });
        console.log('✅ Mapping config saved to database for existing flow:', flowId);
        databaseSaveSuccess = true;
      } else {
        console.log('🆕 Creating new flow with mapping config');
        console.log('📝 Flow data to create:', {
          id: flowId,
          name: config.name || `Flow ${flowId}`,
          description: config.description || 'Auto-generated flow',
          hasMappingConfig: !!configWithTimestamp
        });
        
        // Create new flow with mapping config (for template flows)
        const newFlow = await prisma.flow.create({
          data: {
            id: flowId,
            name: config.name || `Flow ${flowId}`,
            description: config.description || 'Auto-generated flow',
            data: {}, // Empty data for template flows
            mappingConfig: configWithTimestamp,
            isActive: true,
            isLive: false,
            createdBy: 'system', // Template flows are created by system
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log('✅ Mapping config saved to database for new flow:', flowId);
        console.log('📝 Created flow details:', {
          id: newFlow.id,
          name: newFlow.name,
          hasMappingConfig: !!newFlow.mappingConfig
        });
        databaseSaveSuccess = true;
      }
    } catch (error) {
      console.error('❌ Error saving mapping config to database:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : 'Error';
      const errorCode = (error as any)?.code;
      const errorMeta = (error as any)?.meta;
      console.error('Error details:', {
        message: errorMessage,
        stack: errorStack,
        name: errorName,
        code: errorCode,
        meta: errorMeta
      });
      databaseSaveSuccess = false;
    }

    console.log('Mapping config saved for flow:', flowId);
    console.log('Database save success:', databaseSaveSuccess);
    console.log('Config:', JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      message: `Mapping configuration saved successfully${databaseSaveSuccess ? ' to database' : ' to memory only'}`,
      config: config,
      databaseSaveSuccess: databaseSaveSuccess
    });
  } catch (error) {
    console.error('Error saving mapping config:', error);
    return NextResponse.json(
      { error: 'Failed to save mapping configuration' },
      { status: 500 }
    );
  }
}

/**
 * Export mapping configuration
 */
async function exportMappingConfig(data: {
  flowId: string;
  format?: 'json' | 'yaml';
}): Promise<NextResponse> {
  try {
    const { flowId, format = 'json' } = data;
    
    if (!flowId) {
      return NextResponse.json(
        { error: 'Flow ID is required' },
        { status: 400 }
      );
    }

    // Get the mapping configuration
    const config = mappingConfigs.get(flowId);
    if (!config) {
      return NextResponse.json(
        { error: 'Mapping configuration not found' },
        { status: 404 }
      );
    }

    // Create export data with metadata
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'system',
        version: '1.0.0',
        format: format,
        sourceFlowId: flowId
      },
      config: {
        ...config,
        // Remove internal IDs for clean export
        id: undefined,
        flowId: undefined
      }
    };

    if (format === 'yaml') {
      // For YAML export, we'd need a YAML library
      // For now, return JSON with YAML content type
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="mapping-config-${flowId}.json"`
        }
      });
    } else {
      // JSON export
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="mapping-config-${flowId}.json"`
        }
      });
    }
  } catch (error) {
    console.error('Error exporting mapping config:', error);
    return NextResponse.json(
      { error: 'Failed to export mapping configuration' },
      { status: 500 }
    );
  }
}

/**
 * Import mapping configuration
 */
async function importMappingConfig(data: {
  config: any;
  targetFlowId?: string;
  mergeStrategy?: 'replace' | 'merge' | 'append';
}): Promise<NextResponse> {
  try {
    const { config, targetFlowId, mergeStrategy = 'replace' } = data;
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configuration data is required' },
        { status: 400 }
      );
    }

    // Validate the imported configuration
    const validationResult = validateMappingConfig(config);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid configuration format',
          details: validationResult.errors
        },
        { status: 400 }
      );
    }

    // Determine target flow ID
    const flowId = targetFlowId || config.flowId || `imported_${Date.now()}`;
    
    // Create new configuration with proper IDs
    const importedConfig: SmartMappingConfig = {
      id: `config_${Date.now()}`,
      name: config.name || 'Imported Configuration',
      description: config.description || 'Imported mapping configuration',
      flowId: flowId,
      mappings: config.mappings || [],
      transformations: config.transformations || [],
      validations: config.validations || [],
      industryContext: config.industryContext,
      userPreferences: config.userPreferences,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Handle merge strategy
    if (mergeStrategy === 'merge' || mergeStrategy === 'append') {
      const existingConfig = mappingConfigs.get(flowId);
      if (existingConfig) {
        if (mergeStrategy === 'merge') {
          // Merge configurations, with imported taking precedence
          importedConfig.mappings = [
            ...existingConfig.mappings,
            ...importedConfig.mappings
          ];
          importedConfig.transformations = [
            ...existingConfig.transformations,
            ...importedConfig.transformations
          ];
          importedConfig.validations = [
            ...existingConfig.validations,
            ...importedConfig.validations
          ];
        } else if (mergeStrategy === 'append') {
          // Append to existing configuration
          importedConfig.mappings = [
            ...existingConfig.mappings,
            ...importedConfig.mappings
          ];
          importedConfig.transformations = [
            ...existingConfig.transformations,
            ...importedConfig.transformations
          ];
          importedConfig.validations = [
            ...existingConfig.validations,
            ...importedConfig.validations
          ];
        }
      }
    }

    // Store the imported configuration
    mappingConfigs.set(flowId, importedConfig);

    // Save to database
    try {
      const prisma = getPrisma();
      const existingFlow = await prisma.flow.findUnique({
        where: { id: flowId }
      });

      if (existingFlow) {
        await prisma.flow.update({
          where: { id: flowId },
          data: {
            mappingConfig: importedConfig,
            updatedAt: new Date()
          }
        });
      } else {
        await prisma.flow.create({
          data: {
            id: flowId,
            name: importedConfig.name,
            description: importedConfig.description,
            data: {},
            mappingConfig: importedConfig,
            isActive: true,
            isLive: false,
            createdBy: 'import',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    } catch (dbError) {
      console.error('Error saving imported config to database:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      message: 'Mapping configuration imported successfully',
      config: importedConfig,
      flowId: flowId
    });
  } catch (error) {
    console.error('Error importing mapping config:', error);
    return NextResponse.json(
      { error: 'Failed to import mapping configuration' },
      { status: 500 }
    );
  }
}

/**
 * Validate mapping configuration structure
 */
function validateMappingConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!config.name) {
    errors.push('Configuration name is required');
  }

  if (!config.mappings || !Array.isArray(config.mappings)) {
    errors.push('Mappings array is required');
  }

  if (!config.transformations || !Array.isArray(config.transformations)) {
    errors.push('Transformations array is required');
  }

  if (!config.validations || !Array.isArray(config.validations)) {
    errors.push('Validations array is required');
  }

  // Validate mappings structure
  if (config.mappings && Array.isArray(config.mappings)) {
    config.mappings.forEach((mapping: any, index: number) => {
      if (!mapping.id) {
        errors.push(`Mapping ${index}: ID is required`);
      }
      if (!mapping.sourceNodeId) {
        errors.push(`Mapping ${index}: sourceNodeId is required`);
      }
      if (!mapping.targetCvField) {
        errors.push(`Mapping ${index}: targetCvField is required`);
      }
      if (!mapping.mappingType) {
        errors.push(`Mapping ${index}: mappingType is required`);
      }
    });
  }

  // Validate transformations structure
  if (config.transformations && Array.isArray(config.transformations)) {
    config.transformations.forEach((transformation: any, index: number) => {
      if (!transformation.id) {
        errors.push(`Transformation ${index}: ID is required`);
      }
      if (!transformation.field) {
        errors.push(`Transformation ${index}: field is required`);
      }
      if (!transformation.transformationType) {
        errors.push(`Transformation ${index}: transformationType is required`);
      }
    });
  }

  // Validate validations structure
  if (config.validations && Array.isArray(config.validations)) {
    config.validations.forEach((validation: any, index: number) => {
      if (!validation.id) {
        errors.push(`Validation ${index}: ID is required`);
      }
      if (!validation.field) {
        errors.push(`Validation ${index}: field is required`);
      }
      if (!validation.ruleType) {
        errors.push(`Validation ${index}: ruleType is required`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
