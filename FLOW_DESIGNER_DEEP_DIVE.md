# Flow Designer Deep Dive - Complete Functionality Guide

## Table of Contents
1. [Overview](#overview)
2. [Available Node Types](#available-node-types)
3. [Node Configurations & Options](#node-configurations--options)
4. [Connection System](#connection-system)
5. [Properties Panel Details](#properties-panel-details)
6. [Flow Execution Logic](#flow-execution-logic)
7. [Advanced Features](#advanced-features)
8. [Common Patterns & Use Cases](#common-patterns--use-cases)
9. [Troubleshooting Guide](#troubleshooting-guide)

## Overview

The Flow Designer is a visual, node-based editor for creating conversational flows. It uses ReactFlow as the underlying engine and provides a comprehensive set of nodes for building complex chatbot interactions.

### Core Architecture
- **Visual Editor**: Drag-and-drop interface with ReactFlow
- **Node-Based**: Each interaction is represented by a node
- **Connection-Based**: Nodes connect via edges to define flow logic
- **Properties Panel**: Context-sensitive configuration for each node
- **Real-time Testing**: Chat test window for flow validation

## Available Node Types

### 1. **Start Node** 🟢
**Purpose**: Entry point of the flow
**Color**: Green
**Icon**: ▶️ Play

#### Configuration Options:
```typescript
interface StartNodeData {
  label: string;           // Display name
  description?: string;    // Optional description
}
```

#### Default Configuration:
```json
{
  "label": "Start",
  "description": "Flow begins here"
}
```

#### Connection Rules:
- **Inputs**: None (entry point)
- **Outputs**: 1 (connects to first question/action)
- **Handle**: Single output handle at bottom

---

### 2. **Question Node** 🔵
**Purpose**: Collect user input through various question types
**Color**: Blue
**Icon**: 💬 MessageCircle

#### Question Types Available:

##### **Text Input**
- **Purpose**: Free text input from user
- **Validation**: Optional email/phone validation
- **Variable**: Stores user input in specified variable

##### **Multiple Choice**
- **Purpose**: User selects from predefined options
- **Options**: Customizable list of choices
- **Variable**: Stores selected option value

##### **Yes/No**
- **Purpose**: Binary choice question
- **Auto-generated Options**: Yes/No
- **Variable**: Stores "yes" or "no"

##### **Rating (1-5)**
- **Purpose**: 5-point rating scale
- **Auto-generated Options**: 1-5 with labels
- **Variable**: Stores rating value (1-5)

##### **Email**
- **Purpose**: Email address collection
- **Validation**: Built-in email validation
- **Variable**: Stores email address

##### **Phone**
- **Purpose**: Phone number collection
- **Validation**: Built-in phone validation
- **Variable**: Stores phone number

#### Configuration Options:
```typescript
interface QuestionNodeData {
  label: string;
  question: string;                    // Question text
  questionType: 'text' | 'multiple-choice' | 'yes-no' | 'rating' | 'email' | 'phone';
  options?: Array<{                    // For multiple-choice questions
    id: string;
    label: string;                     // Display text
    value: string;                     // Stored value
  }>;
  required?: boolean;                  // Whether answer is required
  variableName?: string;               // Variable to store answer
  conditionTriggers?: {                // Which conditions trigger this question
    [conditionId: string]: string;     // conditionId -> output value
  };
}
```

#### Example Configurations:

**Text Question:**
```json
{
  "label": "Name Question",
  "question": "What is your full name?",
  "questionType": "text",
  "required": true,
  "variableName": "fullName"
}
```

**Multiple Choice Question:**
```json
{
  "label": "Experience Question",
  "question": "How many years of experience do you have?",
  "questionType": "multiple-choice",
  "required": true,
  "variableName": "experience",
  "options": [
    { "id": "opt1", "label": "0-1 years", "value": "junior" },
    { "id": "opt2", "label": "2-5 years", "value": "mid" },
    { "id": "opt3", "label": "5+ years", "value": "senior" }
  ]
}
```

**Yes/No Question:**
```json
{
  "label": "Availability Question",
  "question": "Are you available for immediate start?",
  "questionType": "yes-no",
  "required": true,
  "variableName": "immediateStart"
}
```

#### Connection Rules:
- **Inputs**: 1 (from start, condition, or other question)
- **Outputs**: 1 (to next question, condition, or end)
- **Handles**: Single input at top, single output at bottom

---

### 3. **Condition Node** 🟣
**Purpose**: Branch flow based on user responses or variables
**Color**: Purple
**Icon**: 🌿 GitBranch

#### Condition Types:

##### **Simple Condition (True/False)**
- **Purpose**: Binary branching based on single condition
- **Outputs**: True/False handles
- **Use Case**: Simple yes/no logic

##### **Multi-Output Condition (A, B, C, D...)**
- **Purpose**: Multiple branching paths based on conditions
- **Outputs**: Custom handles (A, B, C, etc.)
- **Use Case**: Complex routing based on multiple criteria

#### Configuration Options:
```typescript
interface ConditionNodeData {
  label: string;
  conditionType: 'simple' | 'multi-output';
  condition: {
    operator: 'and' | 'or';           // Logical operator for multiple rules
    rules: ConditionRule[];           // For simple conditions
    outputs: ConditionOutput[];       // For multi-output conditions
  };
}

interface ConditionRule {
  id: string;
  field: string;                      // Variable name to check
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;                      // Value to compare against
}

interface ConditionOutput {
  id: string;
  label: string;                      // Display name
  value: string;                      // Handle ID (A, B, C, etc.)
  rules: ConditionRule[];             // Rules for this output
}
```

#### Example Configurations:

**Simple Condition:**
```json
{
  "label": "Experience Check",
  "conditionType": "simple",
  "condition": {
    "operator": "and",
    "rules": [
      {
        "id": "rule1",
        "field": "experience",
        "operator": "equals",
        "value": "senior"
      }
    ],
    "outputs": []
  }
}
```

**Multi-Output Condition:**
```json
{
  "label": "Experience Router",
  "conditionType": "multi-output",
  "condition": {
    "operator": "and",
    "rules": [],
    "outputs": [
      {
        "id": "output-a",
        "label": "Junior Path",
        "value": "A",
        "rules": [
          {
            "id": "rule1",
            "field": "experience",
            "operator": "equals",
            "value": "junior"
          }
        ]
      },
      {
        "id": "output-b",
        "label": "Senior Path",
        "value": "B",
        "rules": [
          {
            "id": "rule2",
            "field": "experience",
            "operator": "equals",
            "value": "senior"
          }
        ]
      }
    ]
  }
}
```

#### Connection Rules:
- **Inputs**: 1 (from question or other node)
- **Outputs**: 2+ (True/False for simple, A/B/C/etc. for multi-output)
- **Handles**: 
  - Simple: `true` and `false` handles
  - Multi-output: Custom handles based on output values

---

### 4. **Action Node** 🟠
**Purpose**: Perform actions like setting variables, sending emails, API calls
**Color**: Orange
**Icon**: ⚡ Zap

#### Action Types:

##### **Set Variable**
- **Purpose**: Store or modify flow variables
- **Configuration**: Variable name and value
- **Use Case**: Data manipulation, calculations

##### **Send Email**
- **Purpose**: Send email notifications
- **Configuration**: Recipient, subject, body template
- **Use Case**: Notifications, confirmations

##### **Send SMS**
- **Purpose**: Send SMS messages
- **Configuration**: Phone number, message template
- **Use Case**: Mobile notifications

##### **Call API**
- **Purpose**: Make HTTP requests to external APIs
- **Configuration**: URL, method, headers, body
- **Use Case**: External data integration

##### **Send Webhook**
- **Purpose**: Trigger external webhooks
- **Configuration**: Webhook URL, payload
- **Use Case**: Third-party integrations

##### **Wait**
- **Purpose**: Pause flow execution
- **Configuration**: Duration or condition
- **Use Case**: Rate limiting, delays

#### Configuration Options:
```typescript
interface ActionNodeData {
  label: string;
  action: {
    type: 'set_variable' | 'send_email' | 'send_sms' | 'call_api' | 'send_webhook' | 'wait';
    config: {
      // Set Variable
      variableName?: string;
      value?: string;
      
      // Send Email
      to?: string;
      subject?: string;
      body?: string;
      
      // Send SMS
      phoneNumber?: string;
      message?: string;
      
      // Call API
      url?: string;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      headers?: Record<string, string>;
      body?: any;
      timeout?: number;
      
      // Send Webhook
      webhookUrl?: string;
      payload?: any;
      
      // Wait
      duration?: number;
      condition?: string;
    };
  };
}
```

#### Example Configurations:

**Set Variable:**
```json
{
  "label": "Set User Type",
  "action": {
    "type": "set_variable",
    "config": {
      "variableName": "userType",
      "value": "premium"
    }
  }
}
```

**Send Email:**
```json
{
  "label": "Send Welcome Email",
  "action": {
    "type": "send_email",
    "config": {
      "to": "{{userEmail}}",
      "subject": "Welcome to our service!",
      "body": "Hello {{userName}}, welcome to our platform!"
    }
  }
}
```

**Call API:**
```json
{
  "label": "Get User Profile",
  "action": {
    "type": "call_api",
    "config": {
      "url": "https://api.example.com/users/{{userId}}",
      "method": "GET",
      "headers": {
        "Authorization": "Bearer {{apiToken}}"
      },
      "timeout": 30000
    }
  }
}
```

#### Connection Rules:
- **Inputs**: 1 (from question, condition, or other action)
- **Outputs**: 1 (to next node)
- **Handles**: Single input at top, single output at bottom

---

### 5. **Wait Node** 🟡
**Purpose**: Pause flow execution for specified duration or conditions
**Color**: Yellow
**Icon**: 🕐 Clock

#### Wait Types:

##### **Fixed Time**
- **Purpose**: Wait for specific duration
- **Configuration**: Duration in milliseconds
- **Use Case**: Rate limiting, delays

##### **Random Time**
- **Purpose**: Wait for random duration within range
- **Configuration**: Min and max duration
- **Use Case**: Natural conversation timing

##### **Until Time**
- **Purpose**: Wait until specific time
- **Configuration**: Target time/date
- **Use Case**: Scheduled actions

##### **Until Condition**
- **Purpose**: Wait until condition is met
- **Configuration**: Condition to check
- **Use Case**: Polling, status checks

#### Configuration Options:
```typescript
interface WaitNodeData {
  label: string;
  wait: {
    type: 'fixed' | 'random' | 'until_time' | 'until_condition';
    duration?: number;                 // For fixed wait
    minDuration?: number;              // For random wait
    maxDuration?: number;              // For random wait
    targetTime?: string;               // For until_time
    condition?: string;                // For until_condition
    description?: string;              // Optional description
    config?: Record<string, any>;      // Additional configuration
  };
}
```

#### Example Configurations:

**Fixed Wait:**
```json
{
  "label": "Wait 5 Seconds",
  "wait": {
    "type": "fixed",
    "duration": 5000,
    "description": "Rate limiting delay"
  }
}
```

**Random Wait:**
```json
{
  "label": "Natural Pause",
  "wait": {
    "type": "random",
    "minDuration": 2000,
    "maxDuration": 8000,
    "description": "Simulate human typing"
  }
}
```

#### Connection Rules:
- **Inputs**: 1 (from any node)
- **Outputs**: 1 (to next node)
- **Handles**: Single input at top, single output at bottom

---

### 6. **API Call Node** 🔵
**Purpose**: Make HTTP requests to external APIs
**Color**: Indigo
**Icon**: 🗄️ Database

#### HTTP Methods Supported:
- **GET**: Retrieve data
- **POST**: Create/send data
- **PUT**: Update data
- **DELETE**: Remove data
- **PATCH**: Partial update

#### Configuration Options:
```typescript
interface ApiCallNodeData {
  label: string;
  apiCall: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;                       // API endpoint
    headers?: Record<string, string>;  // HTTP headers
    body?: any;                        // Request body
    timeout?: number;                  // Request timeout
    responseMapping?: Record<string, string>; // Map response to variables
  };
}
```

#### Example Configuration:
```json
{
  "label": "Get Weather Data",
  "apiCall": {
    "method": "GET",
    "url": "https://api.weather.com/current",
    "headers": {
      "Authorization": "Bearer {{weatherApiKey}}",
      "Content-Type": "application/json"
    },
    "timeout": 10000,
    "responseMapping": {
      "temperature": "currentTemp",
      "condition": "weatherCondition"
    }
  }
}
```

#### Connection Rules:
- **Inputs**: 1 (from any node)
- **Outputs**: 2 (success and error handles)
- **Handles**: 
  - Input at top
  - `success` handle (left, green)
  - `error` handle (right, red)

---

### 7. **Transfer Node** 🩷
**Purpose**: Transfer conversation to human agent
**Color**: Pink
**Icon**: 📞 Phone

#### Configuration Options:
```typescript
interface TransferNodeData {
  label: string;
  action: string;                     // Transfer message
  transferType?: 'agent' | 'department' | 'queue';
  targetId?: string;                  // Specific agent/department ID
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  context?: Record<string, any>;      // Additional context
}
```

#### Example Configuration:
```json
{
  "label": "Transfer to Support",
  "action": "Transfer to human agent",
  "transferType": "department",
  "targetId": "support",
  "priority": "normal",
  "context": {
    "userType": "{{userType}}",
    "issueCategory": "{{issueCategory}}"
  }
}
```

#### Connection Rules:
- **Inputs**: 1 (from any node)
- **Outputs**: 1 (to end or confirmation)
- **Handles**: Single input at top, single output at bottom

---

### 8. **End Node** 🔴
**Purpose**: Terminate the flow
**Color**: Red
**Icon**: ⏹️ Square

#### Configuration Options:
```typescript
interface EndNodeData {
  label: string;
  action: string;                     // End message/action
  endType?: 'success' | 'error' | 'incomplete' | 'transfer';
  data?: Record<string, any>;         // Final data collection
}
```

#### Example Configuration:
```json
{
  "label": "Flow Complete",
  "action": "Flow completed successfully",
  "endType": "success",
  "data": {
    "completionTime": "{{timestamp}}",
    "userSatisfaction": "{{rating}}"
  }
}
```

#### Connection Rules:
- **Inputs**: 1+ (from any node)
- **Outputs**: None (termination point)
- **Handles**: Single input at top

## Connection System

### Handle Types

#### **Input Handles**
- **Position**: Top of node
- **Color**: Gray
- **Purpose**: Receive connections from other nodes
- **Connection Rules**: Can only connect to output handles

#### **Output Handles**
- **Position**: Bottom of node
- **Color**: Varies by node type
- **Purpose**: Send connections to other nodes
- **Connection Rules**: Can only connect to input handles

### Connection Rules by Node Type

#### **Start Node**
- **Inputs**: None (entry point)
- **Outputs**: 1 (to first question/action)

#### **Question Node**
- **Inputs**: 1 (from start, condition, or other question)
- **Outputs**: 1 (to next question, condition, or end)

#### **Condition Node**
- **Inputs**: 1 (from question or other node)
- **Outputs**: 
  - Simple: 2 (true/false)
  - Multi-output: N (A, B, C, etc.)

#### **Action Node**
- **Inputs**: 1 (from any node)
- **Outputs**: 1 (to next node)

#### **Wait Node**
- **Inputs**: 1 (from any node)
- **Outputs**: 1 (to next node)

#### **API Call Node**
- **Inputs**: 1 (from any node)
- **Outputs**: 2 (success/error)

#### **Transfer Node**
- **Inputs**: 1 (from any node)
- **Outputs**: 1 (to end or confirmation)

#### **End Node**
- **Inputs**: 1+ (from any node)
- **Outputs**: None (termination)

### Edge Configuration

```typescript
interface FlowEdge {
  id: string;                         // Unique edge ID
  source: string;                     // Source node ID
  target: string;                     // Target node ID
  sourceHandle: string | null;        // Source handle ID (for conditions)
  targetHandle: string | null;        // Target handle ID (usually null)
  label?: string;                     // Optional edge label
  type?: string;                      // Edge type (default, conditional)
}
```

## Properties Panel Details

### Context-Sensitive Configuration

The Properties Panel automatically adapts based on the selected node type, showing only relevant configuration options.

#### **Question Properties Panel**

##### **Basic Configuration**
- **Question Text**: Multi-line textarea for question content
- **Question Type**: Dropdown with all available types
- **Required Field**: Checkbox to make question mandatory
- **Variable Name**: Text input for storing user response

##### **Multiple Choice Options**
- **Add Option**: Button to add new choice
- **Option Label**: Display text for the choice
- **Option Value**: Stored value when selected
- **Reorder Options**: Up/down arrows to change order
- **Delete Option**: Remove unwanted choices

##### **Condition Triggers**
- **Incoming Conditions**: Shows which conditions can trigger this question
- **Condition Mapping**: Map condition outputs to question triggers
- **Visual Indicators**: Shows current trigger configuration

#### **Condition Properties Panel**

##### **Condition Type Selection**
- **Simple**: True/False branching
- **Multi-Output**: A, B, C, D... branching

##### **Rule Configuration**
- **Field Selection**: Choose variable to evaluate
- **Operator Selection**: equals, not_equals, contains, etc.
- **Value Input**: Value to compare against
- **Add/Remove Rules**: Manage multiple conditions

##### **Output Configuration (Multi-Output)**
- **Output Label**: Display name for the output
- **Output Value**: Handle ID (A, B, C, etc.)
- **Output Rules**: Conditions for this specific output
- **Connection Management**: Visual connection to target nodes

##### **Connection Management**
- **Available Variables**: Dropdown of all question variables
- **Target Nodes**: List of nodes that can receive connections
- **Current Connections**: Visual representation of existing connections
- **Connection Updates**: Real-time connection management

#### **Action Properties Panel**

##### **Action Type Selection**
- **Set Variable**: Store or modify variables
- **Send Email**: Email notifications
- **Send SMS**: SMS messages
- **Call API**: HTTP requests
- **Send Webhook**: Webhook triggers
- **Wait**: Pause execution

##### **Type-Specific Configuration**
Each action type has its own configuration interface:

**Set Variable:**
- Variable name input
- Value input (supports templates)

**Send Email:**
- Recipient email
- Subject line
- Body template (supports variables)

**Call API:**
- HTTP method selection
- URL input
- Headers configuration
- Request body
- Timeout settings

#### **Wait Properties Panel**

##### **Wait Type Selection**
- **Fixed Time**: Specific duration
- **Random Time**: Range of durations
- **Until Time**: Wait until specific time
- **Until Condition**: Wait until condition met

##### **Duration Configuration**
- **Duration Input**: Time in milliseconds
- **Min/Max Duration**: For random waits
- **Target Time**: For time-based waits
- **Condition**: For condition-based waits

#### **API Call Properties Panel**

##### **Request Configuration**
- **HTTP Method**: GET, POST, PUT, DELETE, PATCH
- **URL**: API endpoint
- **Headers**: Key-value pairs
- **Body**: Request payload
- **Timeout**: Request timeout

##### **Response Handling**
- **Response Mapping**: Map API response to variables
- **Error Handling**: Configure error responses
- **Success/Error Paths**: Define flow paths based on response

## Flow Execution Logic

### Execution Engine

The Flow Designer uses a custom execution engine that processes flows step by step:

#### **Flow State Management**
```typescript
interface FlowState {
  currentNodeId: string | null;       // Current position in flow
  variables: Record<string, any>;     // Collected user data
  messages: ChatMessage[];            // Conversation history
  isComplete: boolean;                // Flow completion status
}
```

#### **Message Processing**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  nodeId?: string;                    // Associated flow node
}
```

### Node Processing Logic

#### **Start Node**
1. Initialize flow state
2. Set current node to first connected node
3. Send welcome message (if configured)

#### **Question Node**
1. Display question to user
2. Wait for user response
3. Validate response (if required)
4. Store response in variable
5. Move to next connected node

#### **Condition Node**
1. Evaluate condition rules against flow state
2. Determine which output handle matches
3. Move to node connected to matching handle
4. If no match, follow default path (if configured)

#### **Action Node**
1. Execute configured action
2. Update flow state with action results
3. Move to next connected node
4. Handle action errors appropriately

#### **Wait Node**
1. Pause execution for specified duration
2. Check wait conditions (if applicable)
3. Resume execution after wait period
4. Move to next connected node

#### **API Call Node**
1. Make HTTP request to configured endpoint
2. Process response data
3. Map response to flow variables
4. Follow success or error path based on response

#### **Transfer Node**
1. Prepare transfer context
2. Send transfer request to agent system
3. End current flow
4. Hand off to human agent

#### **End Node**
1. Finalize flow data collection
2. Send completion message
3. Mark flow as complete
4. Clean up flow state

### Condition Evaluation

#### **Rule Evaluation**
```typescript
function evaluateRule(rule: ConditionRule, flowState: FlowState): boolean {
  const variableValue = flowState.variables[rule.field];
  
  switch (rule.operator) {
    case 'equals':
      return variableValue === rule.value;
    case 'not_equals':
      return variableValue !== rule.value;
    case 'contains':
      return String(variableValue).includes(rule.value);
    case 'greater_than':
      return Number(variableValue) > Number(rule.value);
    case 'less_than':
      return Number(variableValue) < Number(rule.value);
    default:
      return false;
  }
}
```

#### **Multi-Rule Evaluation**
```typescript
function evaluateCondition(condition: Condition, flowState: FlowState): boolean {
  if (condition.rules.length === 0) return true;
  
  if (condition.operator === 'and') {
    return condition.rules.every(rule => evaluateRule(rule, flowState));
  } else {
    return condition.rules.some(rule => evaluateRule(rule, flowState));
  }
}
```

## Advanced Features

### Variable System

#### **Variable Types**
- **User Input**: Data collected from questions
- **System Variables**: Built-in flow variables
- **Computed Variables**: Calculated from other variables
- **External Variables**: Data from API calls

#### **Variable Templates**
Variables can be used in templates throughout the flow:
```typescript
// Template syntax
"Hello {{userName}}, your experience level is {{experienceLevel}}"

// Available in:
// - Question text
// - Action configurations
// - API request bodies
// - Email/SMS content
```

#### **Variable Scope**
- **Flow Scope**: Available throughout entire flow
- **Node Scope**: Available only within specific node
- **Session Scope**: Persists across multiple flows

### Flow Validation

#### **Structural Validation**
- **Start Node**: Must have exactly one start node
- **End Nodes**: Must have at least one end node
- **Connectivity**: All nodes must be reachable from start
- **Circular References**: Detects and prevents infinite loops

#### **Configuration Validation**
- **Required Fields**: Ensures all required fields are filled
- **Data Types**: Validates data types match expected formats
- **References**: Validates variable and node references
- **API Endpoints**: Validates API call configurations

#### **Logic Validation**
- **Condition Coverage**: Ensures all condition paths are covered
- **Variable Usage**: Validates all variables are defined before use
- **Error Handling**: Ensures error paths are configured
- **Completion Paths**: Validates all paths lead to end nodes

### Testing & Debugging

#### **Chat Test Window**
- **Real-time Testing**: Test flows as you build them
- **Step-by-step Execution**: See flow progression
- **Variable Inspection**: View current variable values
- **Error Reporting**: See where flows fail

#### **Flow Simulation**
- **Mock User Input**: Simulate user responses
- **Path Testing**: Test different flow paths
- **Performance Testing**: Measure flow execution time
- **Load Testing**: Test with multiple concurrent users

#### **Debugging Tools**
- **Flow Visualization**: See current execution path
- **Variable Inspector**: Real-time variable values
- **Error Logging**: Detailed error information
- **Performance Metrics**: Execution timing and statistics

## Common Patterns & Use Cases

### 1. **Simple Q&A Flow**
```
Start → Question → Question → Question → End
```
**Use Case**: Basic information collection
**Configuration**: Linear flow with text questions

### 2. **Conditional Branching**
```
Start → Question → Condition → Question A
                    ↓
                  Question B → End
```
**Use Case**: Different paths based on user responses
**Configuration**: Condition node with simple true/false logic

### 3. **Multi-Path Routing**
```
Start → Question → Multi-Condition → Path A → End
                    ↓              → Path B → End
                                  → Path C → End
```
**Use Case**: Complex routing based on multiple criteria
**Configuration**: Multi-output condition with custom outputs

### 4. **API Integration Flow**
```
Start → Question → API Call → Success → Question → End
                    ↓
                  Error → Transfer → End
```
**Use Case**: External data integration with error handling
**Configuration**: API call node with success/error paths

### 5. **Email Notification Flow**
```
Start → Question → Action (Email) → Wait → End
```
**Use Case**: Automated email notifications
**Configuration**: Action node with email configuration

### 6. **Complex Decision Tree**
```
Start → Question → Condition → Question A → Condition A → End A
                    ↓
                  Question B → Condition B → End B
                    ↓
                  Question C → End C
```
**Use Case**: Complex decision-making processes
**Configuration**: Multiple condition nodes with nested logic

### 7. **Data Collection with Validation**
```
Start → Question → Validation → Valid → Next Question
                    ↓
                  Invalid → Error Message → Retry
```
**Use Case**: Form validation with retry logic
**Configuration**: Condition nodes for validation checks

### 8. **Progressive Disclosure**
```
Start → Question → Condition → Basic Questions → End
                    ↓
                  Advanced Questions → Complex Logic → End
```
**Use Case**: Adaptive questioning based on user level
**Configuration**: Multi-output conditions with different question sets

## Troubleshooting Guide

### Common Issues

#### **1. Flow Freezes After Question**
**Symptoms**: User answers question but flow doesn't continue
**Causes**:
- Missing connections between nodes
- Incorrect condition rule values
- Missing condition triggers on target questions

**Solutions**:
- Check all node connections
- Verify condition rule values match question option values
- Ensure target questions have proper condition triggers

#### **2. Condition Never Matches**
**Symptoms**: Condition always follows default path
**Causes**:
- Value mismatch between question options and condition rules
- Incorrect operator selection
- Missing or incorrect variable names

**Solutions**:
- Verify question option values match condition rule values exactly
- Check operator selection (equals vs contains)
- Ensure variable names are consistent

#### **3. Properties Panel Not Updating**
**Symptoms**: Changes in properties panel don't reflect in flow
**Causes**:
- State synchronization issues
- React re-rendering problems
- Store update failures

**Solutions**:
- Refresh the flow designer
- Check browser console for errors
- Verify store state updates

#### **4. API Calls Failing**
**Symptoms**: API call nodes always follow error path
**Causes**:
- Invalid API endpoints
- Incorrect authentication
- Network connectivity issues
- Invalid request format

**Solutions**:
- Test API endpoints independently
- Verify authentication credentials
- Check request headers and body format
- Test network connectivity

#### **5. Variables Not Updating**
**Symptoms**: Variables don't contain expected values
**Causes**:
- Incorrect variable names
- Variable scope issues
- Template syntax errors

**Solutions**:
- Verify variable names match exactly
- Check variable scope and availability
- Validate template syntax

### Debugging Steps

#### **1. Check Flow Structure**
- Verify all nodes are connected
- Ensure start and end nodes exist
- Check for circular references

#### **2. Validate Node Configuration**
- Check all required fields are filled
- Verify data types and formats
- Test individual node configurations

#### **3. Test Flow Execution**
- Use chat test window
- Test different user input scenarios
- Check variable values at each step

#### **4. Review Error Logs**
- Check browser console for errors
- Review server logs for API issues
- Monitor network requests

#### **5. Validate External Integrations**
- Test API endpoints independently
- Verify authentication credentials
- Check external service status

### Best Practices

#### **1. Flow Design**
- Keep flows simple and linear when possible
- Use clear, descriptive node labels
- Add comments and documentation
- Test flows thoroughly before deployment

#### **2. Variable Management**
- Use consistent naming conventions
- Document variable purposes
- Avoid variable name conflicts
- Use descriptive variable names

#### **3. Error Handling**
- Always provide error paths
- Include user-friendly error messages
- Test error scenarios
- Provide fallback options

#### **4. Performance**
- Minimize API calls
- Use efficient condition logic
- Avoid unnecessary waits
- Optimize flow structure

#### **5. User Experience**
- Provide clear instructions
- Use appropriate question types
- Include progress indicators
- Allow users to go back/retry

---

*This document provides a comprehensive guide to the Flow Designer's functionality. For specific implementation details, refer to the source code and component documentation.*
