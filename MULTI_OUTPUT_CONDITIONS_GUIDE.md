# Multi-Output Condition Nodes Guide

## 🎯 Overview

The condition nodes have been enhanced to support **multiple output paths** (A, B, C, D, etc.) instead of just True/False, making them much more flexible and user-friendly for complex branching scenarios.

## ✨ Key Features

### 1. **Two Condition Types**
- **Simple (True/False)**: Traditional condition with True/False outputs
- **Multi-Output (A, B, C, D...)**: Advanced condition with multiple output paths

### 2. **Flexible Output Configuration**
- Each output path can have its own set of conditions
- Support for multiple rules per output (AND logic)
- Automatic labeling (A, B, C, D, etc.)
- Custom labels for better readability

### 3. **Smart Condition Evaluation**
- First matching output path is used
- Support for default/catch-all outputs (no rules)
- All existing operators supported (equals, contains, in_list, etc.)

## 🚀 How to Use

### Step 1: Create a Condition Node
1. Drag a **Condition** node from the Node Palette
2. Click on the node to open the Properties Panel

### Step 2: Choose Condition Type
In the Properties Panel, select your condition type:
- **Simple (True/False)**: For basic branching
- **Multi-Output (A, B, C, D...)**: For complex routing

### Step 3: Configure Multi-Output Paths
For multi-output conditions:

1. **Add Output Paths**: Click "Add Output" to create new paths
2. **Configure Each Path**:
   - Set custom labels (e.g., "Excellent Service", "Good Service")
   - Add rules for each path
   - Use available variables from question nodes

3. **Example Configuration**:
   ```
   Output A (Excellent Service):
   - service_rating equals "excellent"
   
   Output B (Good Service):
   - service_rating equals "good"
   
   Output C (Average Service):
   - service_rating equals "average"
   
   Output D (Poor Service):
   - service_rating equals "poor"
   ```

### Step 4: Connect Edges
Connect edges from the condition node using the appropriate source handles:
- **Simple**: Use `true` and `false` handles
- **Multi-Output**: Use `A`, `B`, `C`, `D`, etc. handles

## 📋 Example Use Cases

### 1. **Customer Service Routing**
```
Question: "How would you rate our service?"
Options: Excellent, Good, Average, Poor

Multi-Output Condition:
- A (Excellent) → Thank you message
- B (Good) → Improvement suggestions
- C (Average) → Feedback collection
- D (Poor) → Escalation to manager
```

### 2. **Product Recommendation**
```
Question: "What's your budget range?"
Options: Under $100, $100-500, $500-1000, Over $1000

Multi-Output Condition:
- A (Under $100) → Budget products
- B ($100-500) → Mid-range products
- C ($500-1000) → Premium products
- D (Over $1000) → Luxury products
```

### 3. **Lead Qualification**
```
Question: "What's your company size?"
Options: Startup, Small, Medium, Enterprise

Multi-Output Condition:
- A (Startup) → Startup package
- B (Small) → SMB package
- C (Medium) → Business package
- D (Enterprise) → Enterprise package
```

## 🔧 Technical Details

### Data Structure
```typescript
interface Condition {
  operator: 'and' | 'or';
  rules: ConditionRule[];
  outputs?: ConditionOutput[];
}

interface ConditionOutput {
  id: string;
  label: string;
  value: string;        // A, B, C, D, etc.
  description?: string;
  color?: string;
  rules: ConditionRule[];
}
```

### Evaluation Logic
1. **Multi-Output Mode**: Evaluates each output in order
2. **First Match Wins**: Uses the first output whose rules all match
3. **Default Outputs**: Outputs with no rules act as catch-all
4. **AND Logic**: All rules within an output must match

### Edge Connection
- **Source Handles**: Use output values (A, B, C, D) as source handles
- **Target Nodes**: Connect to appropriate response/question nodes
- **Fallback**: If no output matches, no edge is taken

## 🎨 UI Features

### Properties Panel
- **Condition Type Toggle**: Switch between Simple and Multi-Output
- **Output Management**: Add, edit, delete output paths
- **Rule Configuration**: Set up conditions for each output
- **Visual Preview**: See how conditions will be evaluated
- **Variable Suggestions**: Auto-suggest available variables

### Visual Indicators
- **Output Labels**: Clear A, B, C, D indicators
- **Rule Counts**: Show number of rules per output
- **Color Coding**: Different colors for different outputs
- **Preview Panel**: Real-time condition preview

## 📁 Example Files

- **Template**: `public/templates/multi-output-condition-example.json`
- **Test Flow**: Customer service rating with 4 different response paths

## 🚀 Benefits

1. **Enhanced Flexibility**: Support for complex branching scenarios
2. **Better UX**: More intuitive than nested True/False conditions
3. **Scalability**: Easy to add new output paths
4. **Maintainability**: Clear separation of different paths
5. **User-Friendly**: Visual interface for configuration

## 🔄 Migration

Existing condition nodes will continue to work as **Simple** type. To upgrade:
1. Select the condition node
2. Switch to **Multi-Output** type in Properties Panel
3. Configure your output paths
4. Update edge connections to use new source handles

---

**🎉 The multi-output condition nodes provide a powerful and flexible way to create sophisticated branching logic in your flows!**
