# Smart CV Mapping API Reference

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Formats](#requestresponse-formats)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)
9. [SDK Examples](#sdk-examples)

## Overview

The Smart CV Mapping API provides intelligent field mapping between chatbot flows and CV documents. It supports AI-powered context analysis, conditional mapping, data transformations, and validation rules.

### Key Features
- **AI-Powered Mapping**: Intelligent field detection and mapping
- **Conditional Logic**: Context-aware mapping based on user responses
- **Data Transformations**: Format and enhance data before mapping
- **Validation Rules**: Ensure data quality and completeness
- **Import/Export**: Share and version control mapping configurations
- **Real-time Processing**: Process user input and generate CV updates

## Authentication

The API uses session-based authentication. Include the session cookie in your requests:

```http
Cookie: session=your_session_token
```

## Base URL

```
https://your-domain.com/api/smart-mapping
```

## API Endpoints

### 1. Create Mapping Configuration

**POST** `/api/smart-mapping`

Creates a new mapping configuration for a flow.

#### Request Body
```json
{
  "action": "create_mapping_config",
  "data": {
    "flowId": "flow_123",
    "name": "My Mapping Configuration",
    "description": "Description of the mapping",
    "industryContext": "Technology",
    "userPreferences": {
      "preferredDateFormat": "MMM YYYY",
      "nameFormat": "first_last",
      "experienceOrder": "chronological",
      "skillCategorization": "automatic",
      "languageStyle": "formal"
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "config": {
    "id": "config_1234567890",
    "name": "My Mapping Configuration",
    "description": "Description of the mapping",
    "flowId": "flow_123",
    "mappings": [],
    "transformations": [],
    "validations": [],
    "industryContext": "Technology",
    "userPreferences": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get Mapping Configuration

**GET** `/api/smart-mapping?action=get_config&flowId=flow_123`

Retrieves an existing mapping configuration.

#### Response
```json
{
  "success": true,
  "config": {
    "id": "config_1234567890",
    "name": "My Mapping Configuration",
    "description": "Description of the mapping",
    "flowId": "flow_123",
    "mappings": [...],
    "transformations": [...],
    "validations": [...],
    "industryContext": "Technology",
    "userPreferences": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Save Mapping Configuration

**POST** `/api/smart-mapping`

Saves a complete mapping configuration.

#### Request Body
```json
{
  "action": "save_config",
  "flowId": "flow_123",
  "config": {
    "name": "My Mapping Configuration",
    "description": "Description of the mapping",
    "mappings": [
      {
        "id": "map_full_name",
        "sourceNodeId": "personal_info",
        "sourceVariable": "fullName",
        "targetCvField": "fullName",
        "targetSection": "personal",
        "mappingType": "direct",
        "priority": 1,
        "confidence": 0.95,
        "isActive": true
      }
    ],
    "transformations": [
      {
        "id": "format_phone",
        "field": "contact.phone",
        "transformationType": "format_phone",
        "parameters": {
          "format": "international",
          "countryCode": "US"
        }
      }
    ],
    "validations": [
      {
        "id": "validate_email",
        "field": "contact.email",
        "ruleType": "format",
        "parameters": {
          "pattern": "email"
        },
        "errorMessage": "Please enter a valid email address"
      }
    ]
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Mapping configuration saved successfully to database",
  "config": { ... },
  "databaseSaveSuccess": true
}
```

### 4. Process User Input

**POST** `/api/smart-mapping`

Processes user input and maps it to CV fields.

#### Request Body
```json
{
  "action": "process_user_input",
  "data": {
    "flowId": "flow_123",
    "userInput": "John Smith",
    "conversationHistory": [
      {
        "role": "user",
        "content": "Hello"
      },
      {
        "role": "assistant",
        "content": "What is your full name?"
      }
    ],
    "currentNode": {
      "id": "personal_info",
      "type": "question",
      "data": {
        "label": "Personal Information",
        "question": "What is your full name?",
        "questionType": "text",
        "variableName": "fullName"
      }
    },
    "flowState": {
      "fullName": "John Smith"
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "result": {
    "success": true,
    "cvUpdate": {
      "fullName": "John Smith"
    },
    "confidence": 0.95,
    "warnings": [],
    "suggestions": [
      "Consider adding a professional headline"
    ],
    "appliedTransformations": ["capitalize"],
    "appliedValidations": ["required"]
  }
}
```

### 5. Generate Mapping Suggestions

**POST** `/api/smart-mapping`

Generates AI-powered mapping suggestions for flow nodes.

#### Request Body
```json
{
  "action": "generate_suggestions",
  "data": {
    "flowId": "flow_123",
    "flowNodes": [
      {
        "id": "personal_info",
        "type": "question",
        "data": {
          "label": "Personal Information",
          "question": "What is your full name?",
          "variableName": "fullName"
        }
      }
    ],
    "cvTemplate": {
      "fullName": "",
      "contact": {
        "email": "",
        "phone": ""
      }
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "suggestions": [
    {
      "nodeId": "personal_info",
      "nodeLabel": "Personal Information",
      "nodeType": "question",
      "suggestedField": "fullName",
      "suggestedSection": "Personal",
      "confidence": 0.95,
      "reasoning": "Question asks for personal name information",
      "alternativeFields": ["contact.email"]
    }
  ]
}
```

### 6. Update Mapping

**POST** `/api/smart-mapping`

Updates a specific mapping in the configuration.

#### Request Body
```json
{
  "action": "update_mapping",
  "data": {
    "flowId": "flow_123",
    "mapping": {
      "id": "map_full_name",
      "sourceNodeId": "personal_info",
      "sourceVariable": "fullName",
      "targetCvField": "fullName",
      "targetSection": "personal",
      "mappingType": "direct",
      "priority": 1,
      "confidence": 0.95,
      "isActive": true
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "config": { ... }
}
```

### 7. Learn from Correction

**POST** `/api/smart-mapping`

Learns from user corrections to improve mapping accuracy.

#### Request Body
```json
{
  "action": "learn_from_correction",
  "data": {
    "flowId": "flow_123",
    "originalMapping": {
      "id": "map_experience",
      "sourceNodeId": "experience_question",
      "sourceVariable": "experience",
      "targetCvField": "experience.0.title",
      "targetSection": "experience"
    },
    "correction": {
      "correctField": "experience.0.company",
      "correctSection": "experience",
      "userInput": "I worked at Google",
      "context": { ... }
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Learning applied successfully"
}
```

### 8. Generate Preview

**POST** `/api/smart-mapping`

Generates a preview of how mapped data will appear in the CV.

#### Request Body
```json
{
  "action": "generate_preview",
  "data": {
    "flowId": "flow_123",
    "mappedData": {
      "fullName": "John Smith",
      "contact": {
        "email": "john@example.com"
      }
    },
    "cvTemplate": {
      "fullName": "",
      "contact": {
        "email": ""
      }
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "preview": {
    "original": { ... },
    "preview": {
      "fullName": "John Smith",
      "contact": {
        "email": "john@example.com"
      }
    },
    "changes": {
      "fullName": "John Smith",
      "contact.email": "john@example.com"
    },
    "confidence": 0.95
  }
}
```

### 9. Export Mapping Configuration

**GET** `/api/smart-mapping?action=export_config&flowId=flow_123`

Exports a mapping configuration as a downloadable file.

#### Response
```json
{
  "metadata": {
    "exportedAt": "2024-01-01T00:00:00.000Z",
    "exportedBy": "system",
    "version": "1.0.0",
    "format": "json",
    "sourceFlowId": "flow_123"
  },
  "config": {
    "name": "My Mapping Configuration",
    "description": "Description of the mapping",
    "mappings": [...],
    "transformations": [...],
    "validations": [...]
  }
}
```

### 10. Import Mapping Configuration

**POST** `/api/smart-mapping`

Imports a mapping configuration from a file.

#### Request Body
```json
{
  "action": "import_config",
  "data": {
    "config": {
      "name": "Imported Configuration",
      "description": "Imported mapping configuration",
      "mappings": [...],
      "transformations": [...],
      "validations": [...]
    },
    "targetFlowId": "flow_456",
    "mergeStrategy": "replace"
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Mapping configuration imported successfully",
  "config": { ... },
  "flowId": "flow_456"
}
```

## Request/Response Formats

### Mapping Object
```typescript
interface FieldMapping {
  id: string;
  sourceNodeId: string;
  sourceVariable: string;
  targetCvField: string;
  targetSection: string;
  mappingType: 'direct' | 'conditional' | 'aggregated' | 'transformed';
  conditions?: MappingCondition[];
  priority: number;
  confidence: number;
  isActive: boolean;
}
```

### Transformation Object
```typescript
interface DataTransformation {
  id: string;
  field: string;
  transformationType: 'format_date' | 'capitalize' | 'extract_keywords' | 'ai_enhance' | 'custom';
  parameters: Record<string, any>;
  aiPrompt?: string;
}
```

### Validation Object
```typescript
interface ValidationRule {
  id: string;
  field: string;
  ruleType: 'required' | 'format' | 'length' | 'ai_validate';
  parameters: Record<string, any>;
  errorMessage: string;
  aiPrompt?: string;
}
```

### Mapping Condition
```typescript
interface MappingCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'regex' | 'ai_classify';
  value: string;
  aiPrompt?: string;
}
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `INVALID_ACTION`: Invalid action specified
- `MISSING_PARAMETERS`: Required parameters missing
- `CONFIG_NOT_FOUND`: Mapping configuration not found
- `INVALID_CONFIG`: Invalid configuration format
- `PROCESSING_ERROR`: Error processing user input
- `VALIDATION_ERROR`: Configuration validation failed

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The API has rate limiting to prevent abuse:
- **100 requests per minute** per user
- **1000 requests per hour** per user
- **10,000 requests per day** per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Examples

### Complete Mapping Configuration Example

```json
{
  "name": "Complete CV Mapping",
  "description": "Comprehensive mapping for CV builder",
  "industryContext": "Technology",
  "mappings": [
    {
      "id": "map_personal_info",
      "sourceNodeId": "personal_info",
      "sourceVariable": "fullName",
      "targetCvField": "fullName",
      "targetSection": "personal",
      "mappingType": "direct",
      "priority": 1,
      "confidence": 0.95,
      "isActive": true
    },
    {
      "id": "map_experience_conditional",
      "sourceNodeId": "experience_question",
      "sourceVariable": "experience",
      "targetCvField": "experience.0.title",
      "targetSection": "experience",
      "mappingType": "conditional",
      "conditions": [
        {
          "field": "careerStage",
          "operator": "equals",
          "value": "experienced"
        }
      ],
      "priority": 1,
      "confidence": 0.9,
      "isActive": true
    }
  ],
  "transformations": [
    {
      "id": "format_phone",
      "field": "contact.phone",
      "transformationType": "format_phone",
      "parameters": {
        "format": "international",
        "countryCode": "US"
      }
    },
    {
      "id": "enhance_summary",
      "field": "summary",
      "transformationType": "ai_enhance",
      "parameters": {
        "maxLength": 500,
        "style": "professional"
      },
      "aiPrompt": "Improve this professional summary to be more compelling and concise"
    }
  ],
  "validations": [
    {
      "id": "validate_email",
      "field": "contact.email",
      "ruleType": "format",
      "parameters": {
        "pattern": "email"
      },
      "errorMessage": "Please enter a valid email address"
    },
    {
      "id": "ai_validate_experience",
      "field": "experience.0.title",
      "ruleType": "ai_validate",
      "parameters": {
        "checkRelevance": true,
        "checkCompleteness": true
      },
      "errorMessage": "Experience description could be improved",
      "aiPrompt": "Validate that this experience description is relevant and complete"
    }
  ],
  "userPreferences": {
    "preferredDateFormat": "MMM YYYY",
    "nameFormat": "first_last",
    "experienceOrder": "chronological",
    "skillCategorization": "automatic",
    "languageStyle": "formal"
  }
}
```

### Conditional Mapping Example

```json
{
  "id": "map_skills_by_industry",
  "sourceNodeId": "skills_question",
  "sourceVariable": "skills",
  "targetCvField": "skills.technical",
  "targetSection": "skills",
  "mappingType": "conditional",
  "conditions": [
    {
      "field": "industrySector",
      "operator": "equals",
      "value": "technology"
    },
    {
      "field": "careerStage",
      "operator": "in_list",
      "value": "mid,senior,expert"
    }
  ],
  "priority": 1,
  "confidence": 0.9,
  "isActive": true
}
```

### AI-Enhanced Transformation Example

```json
{
  "id": "ai_enhance_summary",
  "field": "summary",
  "transformationType": "ai_enhance",
  "parameters": {
    "maxLength": 500,
    "style": "technical",
    "includeKeywords": true
  },
  "aiPrompt": "Improve this professional summary for a software engineer role. Make it more compelling, highlight technical expertise, and include relevant keywords for ATS systems. Keep it under 500 characters."
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class SmartMappingAPI {
  private baseUrl: string;
  private sessionToken: string;

  constructor(baseUrl: string, sessionToken: string) {
    this.baseUrl = baseUrl;
    this.sessionToken = sessionToken;
  }

  async createMappingConfig(config: CreateMappingConfigRequest) {
    const response = await fetch(`${this.baseUrl}/api/smart-mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${this.sessionToken}`
      },
      body: JSON.stringify({
        action: 'create_mapping_config',
        data: config
      })
    });

    return response.json();
  }

  async processUserInput(input: ProcessUserInputRequest) {
    const response = await fetch(`${this.baseUrl}/api/smart-mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${this.sessionToken}`
      },
      body: JSON.stringify({
        action: 'process_user_input',
        data: input
      })
    });

    return response.json();
  }

  async exportConfig(flowId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/smart-mapping?action=export_config&flowId=${flowId}`,
      {
        headers: {
          'Cookie': `session=${this.sessionToken}`
        }
      }
    );

    return response.json();
  }

  async importConfig(config: ImportConfigRequest) {
    const response = await fetch(`${this.baseUrl}/api/smart-mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${this.sessionToken}`
      },
      body: JSON.stringify({
        action: 'import_config',
        data: config
      })
    });

    return response.json();
  }
}

// Usage
const api = new SmartMappingAPI('https://your-domain.com', 'your_session_token');

// Create mapping configuration
const config = await api.createMappingConfig({
  flowId: 'flow_123',
  name: 'My Mapping Configuration',
  description: 'Description of the mapping',
  industryContext: 'Technology'
});

// Process user input
const result = await api.processUserInput({
  flowId: 'flow_123',
  userInput: 'John Smith',
  conversationHistory: [...],
  currentNode: {...},
  flowState: {...}
});

// Export configuration
const exported = await api.exportConfig('flow_123');

// Import configuration
const imported = await api.importConfig({
  config: {...},
  targetFlowId: 'flow_456',
  mergeStrategy: 'replace'
});
```

### Python

```python
import requests
import json

class SmartMappingAPI:
    def __init__(self, base_url: str, session_token: str):
        self.base_url = base_url
        self.session_token = session_token
        self.headers = {
            'Content-Type': 'application/json',
            'Cookie': f'session={session_token}'
        }

    def create_mapping_config(self, config: dict):
        response = requests.post(
            f'{self.base_url}/api/smart-mapping',
            headers=self.headers,
            json={
                'action': 'create_mapping_config',
                'data': config
            }
        )
        return response.json()

    def process_user_input(self, input_data: dict):
        response = requests.post(
            f'{self.base_url}/api/smart-mapping',
            headers=self.headers,
            json={
                'action': 'process_user_input',
                'data': input_data
            }
        )
        return response.json()

    def export_config(self, flow_id: str):
        response = requests.get(
            f'{self.base_url}/api/smart-mapping',
            params={'action': 'export_config', 'flowId': flow_id},
            headers={'Cookie': f'session={self.session_token}'}
        )
        return response.json()

    def import_config(self, config_data: dict):
        response = requests.post(
            f'{self.base_url}/api/smart-mapping',
            headers=self.headers,
            json={
                'action': 'import_config',
                'data': config_data
            }
        )
        return response.json()

# Usage
api = SmartMappingAPI('https://your-domain.com', 'your_session_token')

# Create mapping configuration
config = api.create_mapping_config({
    'flowId': 'flow_123',
    'name': 'My Mapping Configuration',
    'description': 'Description of the mapping',
    'industryContext': 'Technology'
})

# Process user input
result = api.process_user_input({
    'flowId': 'flow_123',
    'userInput': 'John Smith',
    'conversationHistory': [...],
    'currentNode': {...},
    'flowState': {...}
})

# Export configuration
exported = api.export_config('flow_123')

# Import configuration
imported = api.import_config({
    'config': {...},
    'targetFlowId': 'flow_456',
    'mergeStrategy': 'replace'
})
```

---

This API reference provides comprehensive documentation for all Smart CV Mapping API endpoints. Use this as a guide when integrating with the mapping system.
