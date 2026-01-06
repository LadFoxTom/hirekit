# Multiple Choice Questions & Advanced Conditions Guide

## 🎯 **How to Handle Multiple Choice Questions**

### **Current System Capabilities**

Your flow system already supports multiple choice questions, but you need to understand how to set them up properly for different routing scenarios.

## 📋 **Question Types Available**

### **1. Multiple Choice Questions**
- **Type**: `multiple-choice`
- **Options**: Array of `{id, label, value}` objects
- **Variable**: Stores the selected option's `value`

### **2. Yes/No Questions**
- **Type**: `yes-no`
- **Options**: Automatically generates "Yes" and "No" options
- **Variable**: Stores "yes" or "no"

### **3. Rating Questions**
- **Type**: `rating`
- **Options**: Numeric scale (1-5, 1-10, etc.)
- **Variable**: Stores the numeric rating

## 🔧 **Setting Up Multiple Choice Flows**

### **Method 1: Using Enhanced Condition Operators**

#### **Example: Career Stage Question**
```
Question: "What's your career stage?"
Type: multiple-choice
Options:
  - "Student" (value: "student")
  - "Entry Level" (value: "entry_level") 
  - "Mid Level" (value: "mid_level")
  - "Senior Level" (value: "senior_level")
  - "Executive" (value: "executive")
Variable: career_stage
```

**Condition Setup:**
```
Field: career_stage
Operator: in_list
Value: "student,entry_level"
→ TRUE: Goes to "Education-focused questions"
→ FALSE: Goes to "Experience-focused questions"
```

#### **Example: Industry Selection**
```
Question: "What industry are you in?"
Type: multiple-choice
Options:
  - "Technology" (value: "tech")
  - "Healthcare" (value: "healthcare")
  - "Finance" (value: "finance")
  - "Education" (value: "education")
  - "Other" (value: "other")
Variable: industry
```

**Multiple Conditions:**
```
Condition 1: industry equals "tech" → Tech-specific questions
Condition 2: industry equals "healthcare" → Healthcare-specific questions
Condition 3: industry equals "finance" → Finance-specific questions
Condition 4: industry in_list "education,other" → General questions
```

### **Method 2: Multiple Condition Nodes**

For complex routing, use multiple condition nodes:

```
Question: "What's your experience level?"
Options: ["Beginner", "Intermediate", "Advanced"]

Flow:
Question → Condition1 → Beginner Path
         → Condition2 → Intermediate Path  
         → Condition3 → Advanced Path
```

**Condition 1:**
```
Field: experience_level
Operator: equals
Value: "beginner"
```

**Condition 2:**
```
Field: experience_level
Operator: equals
Value: "intermediate"
```

**Condition 3:**
```
Field: experience_level
Operator: equals
Value: "advanced"
```

## 🚀 **Advanced Condition Operators**

### **New Operators Added:**

1. **`in_list`** - Check if value is in a comma-separated list
   ```
   Field: user_choice
   Operator: in_list
   Value: "option1,option2,option3"
   ```

2. **`not_in_list`** - Check if value is NOT in a comma-separated list
   ```
   Field: user_choice
   Operator: not_in_list
   Value: "excluded1,excluded2"
   ```

3. **`starts_with`** - Check if value starts with specific text
   ```
   Field: user_input
   Operator: starts_with
   Value: "yes"
   ```

4. **`ends_with`** - Check if value ends with specific text
   ```
   Field: filename
   Operator: ends_with
   Value: ".pdf"
   ```

5. **`is_empty`** - Check if field is empty
   ```
   Field: optional_field
   Operator: is_empty
   Value: (ignored)
   ```

6. **`is_not_empty`** - Check if field has a value
   ```
   Field: required_field
   Operator: is_not_empty
   Value: (ignored)
   ```

## 📝 **Practical Examples**

### **Example 1: CV Builder Experience Level**

**Question Node:**
```json
{
  "type": "question",
  "data": {
    "question": "What's your experience level?",
    "questionType": "multiple-choice",
    "options": [
      {"id": "opt1", "label": "Student/New Graduate", "value": "student"},
      {"id": "opt2", "label": "1-3 years experience", "value": "junior"},
      {"id": "opt3", "label": "3-7 years experience", "value": "mid"},
      {"id": "opt4", "label": "7+ years experience", "value": "senior"}
    ],
    "variableName": "experience_level"
  }
}
```

**Condition Node:**
```json
{
  "type": "condition",
  "data": {
    "condition": {
      "operator": "or",
      "rules": [
        {
          "field": "experience_level",
          "operator": "in_list",
          "value": "student,junior"
        }
      ]
    }
  }
}
```

### **Example 2: Industry-Specific Routing**

**Question Node:**
```json
{
  "type": "question",
  "data": {
    "question": "What industry are you targeting?",
    "questionType": "multiple-choice",
    "options": [
      {"id": "opt1", "label": "Technology", "value": "tech"},
      {"id": "opt2", "label": "Healthcare", "value": "healthcare"},
      {"id": "opt3", "label": "Finance", "value": "finance"},
      {"id": "opt4", "label": "Education", "value": "education"},
      {"id": "opt5", "label": "Other", "value": "other"}
    ],
    "variableName": "target_industry"
  }
}
```

**Multiple Condition Nodes:**

**Tech Condition:**
```json
{
  "condition": {
    "operator": "and",
    "rules": [
      {
        "field": "target_industry",
        "operator": "equals",
        "value": "tech"
      }
    ]
  }
}
```

**Healthcare Condition:**
```json
{
  "condition": {
    "operator": "and", 
    "rules": [
      {
        "field": "target_industry",
        "operator": "equals",
        "value": "healthcare"
      }
    ]
  }
}
```

**General Condition:**
```json
{
  "condition": {
    "operator": "and",
    "rules": [
      {
        "field": "target_industry",
        "operator": "in_list",
        "value": "education,other"
      }
    ]
  }
}
```

## 🎨 **Best Practices**

### **1. Option Value Naming**
- Use lowercase, underscore-separated values: `"entry_level"`, `"senior_developer"`
- Keep values consistent across your flow
- Use descriptive but concise values

### **2. Condition Organization**
- Use `in_list` for grouping similar options
- Use multiple condition nodes for complex branching
- Keep condition logic simple and readable

### **3. Flow Design**
- Test all possible paths
- Provide fallback paths for unexpected inputs
- Use clear, descriptive node labels

### **4. Variable Naming**
- Use descriptive variable names: `career_stage`, `target_industry`
- Follow consistent naming conventions
- Document your variables

## 🔍 **Testing Your Flows**

1. **Test each option** - Make sure every choice leads to the correct path
2. **Test edge cases** - Empty inputs, unexpected values
3. **Test condition combinations** - Multiple rules with AND/OR logic
4. **Use the Chat Flow Tester** - Visual testing of your flow logic

## 🚀 **Next Steps**

1. **Create your multiple choice questions** using the Question node
2. **Set up condition nodes** with appropriate operators
3. **Test your flows** using the Chat Flow Tester
4. **Iterate and improve** based on testing results

The system now supports sophisticated multiple choice handling with the new operators and enhanced condition logic!
