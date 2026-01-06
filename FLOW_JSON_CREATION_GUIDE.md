# Flow Designer JSON Creation Guide

## Table of Contents
1. [Overview](#overview)
2. [JSON Structure](#json-structure)
3. [Node Types](#node-types)
4. [Edge Connections](#edge-connections)
5. [Variables](#variables)
6. [Settings](#settings)
7. [Complete Examples](#complete-examples)
8. [Best Practices](#best-practices)
9. [Validation Rules](#validation-rules)
10. [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive instructions for creating JSON files that can be imported into the Flow Designer. These JSON files define conversational flows with nodes, edges, variables, and settings that control the chatbot's behavior.

### Key Benefits of JSON Creation
- **Version Control**: Track changes in your flows using Git
- **Bulk Creation**: Create multiple flows programmatically
- **Template Reuse**: Share and reuse flow templates
- **Advanced Logic**: Create complex conditional flows more easily
- **Automation**: Generate flows from external data sources

## JSON Structure

The basic structure of a flow JSON file follows this schema:

```json
{
  "id": "unique-flow-identifier",
  "name": "Human Readable Flow Name",
  "description": "Optional description of the flow",
  "version": "1.0.0",
  "nodes": [...],
  "edges": [...],
  "variables": [...],
  "settings": {...},
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Required Fields
- `id`: Unique identifier for the flow
- `name`: Display name for the flow
- `version`: Semantic version string
- `nodes`: Array of flow nodes
- `edges`: Array of connections between nodes
- `variables`: Array of flow variables
- `settings`: Flow configuration settings

## Node Types

### 1. Start Node
**Purpose**: Entry point of the flow
**Type**: `"start"`

```json
{
  "id": "start",
  "type": "start",
  "position": { "x": 250, "y": 50 },
  "data": {
    "label": "Start",
    "description": "Flow begins here"
  }
}
```

**Properties**:
- `label`: Display name for the node
- `description`: Optional description

### 2. Question Node
**Purpose**: Collect user input through various question types
**Type**: `"question"`

```json
{
  "id": "user-name",
  "type": "question",
  "position": { "x": 250, "y": 150 },
  "data": {
    "label": "User Name",
    "question": "What is your full name?",
    "questionType": "text",
    "required": true,
    "variableName": "fullName",
    "placeholder": "Enter your full name",
    "helpText": "Please provide your complete name"
  }
}
```

**Question Types**:
- `"text"`: Free text input
- `"email"`: Email validation
- `"phone"`: Phone number validation
- `"multiple-choice"`: Select from options
- `"yes-no"`: Boolean choice
- `"rating"`: Numeric rating

**Properties**:
- `label`: Display name
- `question`: The question text
- `questionType`: Type of input expected
- `required`: Whether the field is mandatory
- `variableName`: Variable to store the response
- `placeholder`: Placeholder text for input
- `helpText`: Additional guidance for users
- `options`: Array of choices (for multiple-choice)
- `validation`: Array of validation rules

**Multiple Choice Example**:
```json
{
  "id": "experience-level",
  "type": "question",
  "position": { "x": 250, "y": 250 },
  "data": {
    "label": "Experience Level",
    "question": "How many years of experience do you have?",
    "questionType": "multiple-choice",
    "options": [
      { "id": "opt-1", "label": "0-2 years", "value": "junior" },
      { "id": "opt-2", "label": "3-5 years", "value": "mid" },
      { "id": "opt-3", "label": "6-10 years", "value": "senior" },
      { "id": "opt-4", "label": "10+ years", "value": "expert" }
    ],
    "required": true,
    "variableName": "experienceLevel"
  }
}
```

### 3. Condition Node
**Purpose**: Create conditional branching based on user responses
**Type**: `"condition"`

#### Simple Condition
```json
{
  "id": "experience-check",
  "type": "condition",
  "position": { "x": 250, "y": 350 },
  "data": {
    "label": "Experience Check",
    "conditionType": "simple",
    "condition": {
      "operator": "and",
      "rules": [
        {
          "id": "rule-1",
          "field": "experienceLevel",
          "operator": "equals",
          "value": "senior"
        }
      ]
    }
  }
}
```

#### Multi-Output Condition
```json
{
  "id": "experience-routing",
  "type": "condition",
  "position": { "x": 250, "y": 350 },
  "data": {
    "label": "Experience Routing",
    "conditionType": "multi-output",
    "condition": {
      "operator": "and",
      "rules": [],
      "outputs": [
        {
          "id": "output-junior",
          "label": "Junior Level",
          "value": "A",
          "description": "0-2 years experience",
          "rules": [
            {
              "id": "rule-junior",
              "field": "experienceLevel",
              "operator": "equals",
              "value": "junior"
            }
          ]
        },
        {
          "id": "output-senior",
          "label": "Senior Level",
          "value": "B",
          "description": "6+ years experience",
          "rules": [
            {
              "id": "rule-senior",
              "field": "experienceLevel",
              "operator": "in_list",
              "value": "senior,expert"
            }
          ]
        }
      ]
    }
  }
}
```

**Condition Operators**:
- `equals`: Exact match
- `not_equals`: Not equal to
- `contains`: Contains substring
- `greater_than`: Numeric greater than
- `less_than`: Numeric less than
- `starts_with`: Starts with string
- `ends_with`: Ends with string
- `is_empty`: Field is empty
- `is_not_empty`: Field has value
- `in_list`: Value is in comma-separated list
- `not_in_list`: Value is not in list

### 4. Action Node
**Purpose**: Perform actions like setting variables or calling APIs
**Type**: `"action"`

```json
{
  "id": "set-completion",
  "type": "action",
  "position": { "x": 250, "y": 450 },
  "data": {
    "label": "Set Completion",
    "description": "Mark CV as complete",
    "action": {
      "type": "set_variable",
      "config": {
        "variableName": "cv_complete",
        "value": true
      }
    }
  }
}
```

**Action Types**:
- `set_variable`: Set a variable value
- `call_api`: Make HTTP API call
- `send_webhook`: Send webhook notification
- `wait`: Pause execution

### 5. Wait Node
**Purpose**: Pause flow execution for a specified duration
**Type**: `"wait"`

```json
{
  "id": "processing-wait",
  "type": "wait",
  "position": { "x": 250, "y": 350 },
  "data": {
    "label": "Processing Wait",
    "description": "Wait for processing to complete",
    "waitType": "fixed",
    "duration": 5000
  }
}
```

**Wait Types**:
- `fixed`: Fixed duration in milliseconds
- `random`: Random duration between min/max
- `until_time`: Wait until specific time
- `until_condition`: Wait until condition is met

### 6. API Call Node
**Purpose**: Make HTTP requests to external APIs
**Type**: `"api-call"`

```json
{
  "id": "validate-email",
  "type": "api-call",
  "position": { "x": 250, "y": 350 },
  "data": {
    "label": "Validate Email",
    "description": "Check email validity",
    "method": "POST",
    "url": "https://api.emailvalidator.com/validate",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "email": "{{email}}"
    },
    "timeout": 10000,
    "responseMapping": {
      "isValid": "email_valid"
    }
  }
}
```

### 7. End Node
**Purpose**: Terminate the flow
**Type**: `"end"`

```json
{
  "id": "end",
  "type": "end",
  "position": { "x": 250, "y": 550 },
  "data": {
    "label": "End",
    "description": "Flow completed successfully",
    "action": "CV Generated"
  }
}
```

## Edge Connections

Edges define the flow between nodes. Each edge connects a source node to a target node.

### Basic Edge
```json
{
  "id": "start-to-question",
  "source": "start",
  "target": "user-name",
  "label": "Begin"
}
```

### Conditional Edge
```json
{
  "id": "condition-to-junior",
  "source": "experience-routing",
  "target": "junior-skills",
  "sourceHandle": "A",
  "label": "Junior Path"
}
```

**Edge Properties**:
- `id`: Unique identifier
- `source`: Source node ID
- `target`: Target node ID
- `sourceHandle`: Handle ID for multi-output conditions
- `targetHandle`: Target handle ID
- `label`: Optional label for the connection
- `condition`: Optional condition for the edge

## Variables

Variables store user responses and flow state.

```json
{
  "id": "fullName",
  "name": "fullName",
  "type": "string",
  "scope": "global",
  "description": "User's full name"
}
```

**Variable Types**:
- `string`: Text values
- `number`: Numeric values
- `boolean`: True/false values
- `array`: List of values
- `object`: Complex data structures

**Scopes**:
- `global`: Available throughout the entire flow
- `local`: Available only within the current session

## Settings

Flow settings control behavior and appearance.

```json
{
  "autoSave": true,
  "autoSaveInterval": 5000,
  "snapToGrid": true,
  "gridSize": 20,
  "showMinimap": true,
  "showControls": true,
  "theme": "light"
}
```

**Settings Properties**:
- `autoSave`: Enable automatic saving
- `autoSaveInterval`: Save interval in milliseconds
- `snapToGrid`: Snap nodes to grid
- `gridSize`: Grid size in pixels
- `showMinimap`: Show flow minimap
- `showControls`: Show control buttons
- `theme`: Visual theme (light/dark)

## Complete Examples

### Simple Linear Flow
```json
{
  "id": "simple-cv-flow",
  "name": "Simple CV Builder",
  "description": "Basic CV creation flow",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Start",
        "description": "Begin CV creation"
      }
    },
    {
      "id": "name",
      "type": "question",
      "position": { "x": 250, "y": 150 },
      "data": {
        "label": "Name",
        "question": "What is your name?",
        "questionType": "text",
        "required": true,
        "variableName": "name"
      }
    },
    {
      "id": "email",
      "type": "question",
      "position": { "x": 250, "y": 250 },
      "data": {
        "label": "Email",
        "question": "What is your email?",
        "questionType": "email",
        "required": true,
        "variableName": "email"
      }
    },
    {
      "id": "end",
      "type": "end",
      "position": { "x": 250, "y": 350 },
      "data": {
        "label": "Complete",
        "action": "CV Created"
      }
    }
  ],
  "edges": [
    {
      "id": "start-to-name",
      "source": "start",
      "target": "name",
      "label": "Begin"
    },
    {
      "id": "name-to-email",
      "source": "name",
      "target": "email",
      "label": "Next"
    },
    {
      "id": "email-to-end",
      "source": "email",
      "target": "end",
      "label": "Complete"
    }
  ],
  "variables": [
    {
      "id": "name",
      "name": "name",
      "type": "string",
      "scope": "global",
      "description": "User's name"
    },
    {
      "id": "email",
      "name": "email",
      "type": "string",
      "scope": "global",
      "description": "User's email"
    }
  ],
  "settings": {
    "autoSave": true,
    "autoSaveInterval": 5000,
    "snapToGrid": true,
    "gridSize": 20,
    "showMinimap": true,
    "showControls": true,
    "theme": "light"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Conditional Branching Flow
```json
{
  "id": "conditional-cv-flow",
  "name": "Conditional CV Builder",
  "description": "CV builder with experience-based branching",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Start",
        "description": "Begin CV creation"
      }
    },
    {
      "id": "experience",
      "type": "question",
      "position": { "x": 250, "y": 150 },
      "data": {
        "label": "Experience Level",
        "question": "How many years of experience do you have?",
        "questionType": "multiple-choice",
        "options": [
          { "id": "opt-1", "label": "0-2 years", "value": "junior" },
          { "id": "opt-2", "label": "3-5 years", "value": "mid" },
          { "id": "opt-3", "label": "6+ years", "value": "senior" }
        ],
        "required": true,
        "variableName": "experienceLevel"
      }
    },
    {
      "id": "experience-condition",
      "type": "condition",
      "position": { "x": 250, "y": 250 },
      "data": {
        "label": "Experience Routing",
        "conditionType": "multi-output",
        "condition": {
          "operator": "and",
          "rules": [],
          "outputs": [
            {
              "id": "output-junior",
              "label": "Junior",
              "value": "A",
              "rules": [
                {
                  "id": "rule-junior",
                  "field": "experienceLevel",
                  "operator": "equals",
                  "value": "junior"
                }
              ]
            },
            {
              "id": "output-senior",
              "label": "Senior",
              "value": "B",
              "rules": [
                {
                  "id": "rule-senior",
                  "field": "experienceLevel",
                  "operator": "in_list",
                  "value": "mid,senior"
                }
              ]
            }
          ]
        }
      }
    },
    {
      "id": "junior-skills",
      "type": "question",
      "position": { "x": 100, "y": 350 },
      "data": {
        "label": "Junior Skills",
        "question": "What skills are you learning?",
        "questionType": "text",
        "required": true,
        "variableName": "skills"
      }
    },
    {
      "id": "senior-skills",
      "type": "question",
      "position": { "x": 400, "y": 350 },
      "data": {
        "label": "Senior Skills",
        "question": "What are your core competencies?",
        "questionType": "text",
        "required": true,
        "variableName": "skills"
      }
    },
    {
      "id": "end",
      "type": "end",
      "position": { "x": 250, "y": 450 },
      "data": {
        "label": "Complete",
        "action": "CV Created"
      }
    }
  ],
  "edges": [
    {
      "id": "start-to-experience",
      "source": "start",
      "target": "experience",
      "label": "Begin"
    },
    {
      "id": "experience-to-condition",
      "source": "experience",
      "target": "experience-condition",
      "label": "Route"
    },
    {
      "id": "condition-to-junior",
      "source": "experience-condition",
      "target": "junior-skills",
      "sourceHandle": "A",
      "label": "Junior Path"
    },
    {
      "id": "condition-to-senior",
      "source": "experience-condition",
      "target": "senior-skills",
      "sourceHandle": "B",
      "label": "Senior Path"
    },
    {
      "id": "junior-to-end",
      "source": "junior-skills",
      "target": "end",
      "label": "Complete"
    },
    {
      "id": "senior-to-end",
      "source": "senior-skills",
      "target": "end",
      "label": "Complete"
    }
  ],
  "variables": [
    {
      "id": "experienceLevel",
      "name": "experienceLevel",
      "type": "string",
      "scope": "global",
      "description": "User's experience level"
    },
    {
      "id": "skills",
      "name": "skills",
      "type": "string",
      "scope": "global",
      "description": "User's skills"
    }
  ],
  "settings": {
    "autoSave": true,
    "autoSaveInterval": 5000,
    "snapToGrid": true,
    "gridSize": 20,
    "showMinimap": true,
    "showControls": true,
    "theme": "light"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Best Practices

### 1. Naming Conventions
- Use descriptive, kebab-case IDs: `"user-full-name"` instead of `"q1"`
- Use clear, human-readable labels: `"Full Name"` instead of `"Name"`
- Prefix condition outputs with meaningful names: `"output-junior"`, `"output-senior"`

### 2. Node Positioning
- Start nodes at the top (y: 50)
- Space nodes vertically by 100-150 pixels
- Use horizontal spacing for parallel branches
- Keep related nodes visually grouped

### 3. Variable Management
- Use consistent variable naming: `camelCase` for variable names
- Define all variables in the variables array
- Use appropriate scopes (global vs local)
- Include descriptions for complex variables

### 4. Edge Organization
- Use descriptive edge IDs: `"start-to-personal-info"`
- Include labels for complex flows
- Use sourceHandle for multi-output conditions
- Keep edge IDs unique across the entire flow

### 5. Error Handling
- Always include required field validation
- Provide helpful error messages
- Use appropriate question types (email, phone validation)
- Include helpText for complex questions

### 6. Performance Considerations
- Limit the number of nodes in a single flow
- Use efficient condition operators
- Avoid deeply nested conditions
- Consider breaking large flows into smaller ones

## Validation Rules

### Required Fields Validation
```json
{
  "validation": [
    {
      "type": "required",
      "message": "This field is required"
    }
  ]
}
```

### Email Validation
```json
{
  "validation": [
    {
      "type": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Length Validation
```json
{
  "validation": [
    {
      "type": "minLength",
      "value": 2,
      "message": "Name must be at least 2 characters"
    },
    {
      "type": "maxLength",
      "value": 100,
      "message": "Name must be less than 100 characters"
    }
  ]
}
```

### Pattern Validation
```json
{
  "validation": [
    {
      "type": "pattern",
      "value": "^[A-Za-z\\s]+$",
      "message": "Name can only contain letters and spaces"
    }
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. Invalid JSON Syntax
**Problem**: JSON parsing errors
**Solution**: Validate JSON using online tools or IDE extensions
**Check**: Missing commas, quotes, or brackets

#### 2. Missing Node References
**Problem**: Edges reference non-existent nodes
**Solution**: Ensure all source and target node IDs exist in the nodes array
**Check**: Typos in node IDs

#### 3. Invalid Node Types
**Problem**: Unsupported node types
**Solution**: Use only supported types: start, question, condition, action, end, wait, api-call
**Check**: Node type spelling and case

#### 4. Missing Required Properties
**Problem**: Nodes missing required data properties
**Solution**: Include all required properties for each node type
**Check**: label, question (for question nodes), etc.

#### 5. Invalid Condition Operators
**Problem**: Unsupported condition operators
**Solution**: Use only supported operators: equals, not_equals, contains, etc.
**Check**: Operator spelling and case

### Debugging Tips

1. **Start Simple**: Begin with basic linear flows before adding complexity
2. **Test Incrementally**: Add nodes and edges one at a time
3. **Validate JSON**: Use JSON validators before importing
4. **Check Examples**: Reference existing template files
5. **Use Descriptive Names**: Make debugging easier with clear naming

### Import Process

1. **Prepare JSON**: Ensure valid JSON structure
2. **Save File**: Save as `.json` file
3. **Import in Designer**: Use the import function in the Flow Designer
4. **Validate**: Check for any import errors
5. **Test**: Use the chat test feature to verify flow behavior

### Getting Help

- Check existing template files in `/public/templates/`
- Review the Flow Designer interface for visual guidance
- Test with simple flows first
- Use the chat test feature to debug flow logic

---

This guide provides everything needed to create JSON files for the Flow Designer. Start with simple flows and gradually add complexity as you become more familiar with the system.
