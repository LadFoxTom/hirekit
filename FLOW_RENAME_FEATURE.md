# Flow Rename Feature

## Overview
Added the ability to rename existing flows in the Flow Management interface. This feature allows users to easily update flow names without having to recreate the entire flow.

## Features

### 1. Inline Rename
- **Double-click to rename**: Users can double-click on any flow name to start editing
- **Visual feedback**: Flow name shows hover effect indicating it's clickable
- **Keyboard shortcuts**: 
  - `Enter` to save changes
  - `Escape` to cancel changes

### 2. Dropdown Menu Option
- **Rename option**: Added "Rename Flow" option in the flow's dropdown menu (three dots)
- **Consistent UI**: Follows the same pattern as other flow actions

### 3. User Experience
- **Auto-focus**: Input field automatically focuses when editing starts
- **Save/Cancel buttons**: Visual buttons for save (✓) and cancel (✗) actions
- **Validation**: Prevents saving empty names
- **Toast notifications**: Success/error feedback for user actions
- **Auto-refresh**: Flow list refreshes after successful rename

## Implementation Details

### Frontend Changes
- **State management**: Added `editingFlow` and `editingName` state variables
- **Event handlers**: 
  - `handleStartRename()`: Initiates rename mode
  - `handleCancelRename()`: Cancels rename operation
  - `handleSaveRename()`: Saves the new name via API
- **UI components**: Inline input field with save/cancel buttons

### API Integration
- **Existing endpoint**: Uses the existing `PUT /api/flows` endpoint
- **Partial updates**: Only sends the flow ID and new name
- **Error handling**: Proper error handling with user feedback

### Database Updates
- **Prisma update**: Updates the `name` field in the database
- **Timestamp update**: Automatically updates the `updatedAt` timestamp
- **No data loss**: Preserves all other flow data during rename

## Usage

### Method 1: Double-click
1. Navigate to Flow Management (`/adminx/flows`)
2. Double-click on any flow name
3. Edit the name in the input field
4. Press `Enter` or click the ✓ button to save
5. Press `Escape` or click the ✗ button to cancel

### Method 2: Dropdown Menu
1. Navigate to Flow Management (`/adminx/flows`)
2. Click the three dots (⋮) on any flow card
3. Select "Rename Flow" from the dropdown
4. Edit the name in the input field
5. Press `Enter` or click the ✓ button to save
6. Press `Escape` or click the ✗ button to cancel

## Technical Details

### API Request Format
```json
PUT /api/flows
{
  "id": "flow_id_here",
  "name": "New Flow Name"
}
```

### API Response
```json
{
  "id": "flow_id_here",
  "name": "New Flow Name",
  "description": "Flow description",
  "data": { ... },
  "isActive": true,
  "isLive": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Handling
- **Empty name**: Shows error toast "Flow name cannot be empty"
- **API errors**: Shows error toast with specific error message
- **Network errors**: Shows generic error toast "Failed to rename flow"

## Benefits

1. **Improved UX**: Users can quickly rename flows without complex workflows
2. **Consistency**: Follows standard UI patterns for inline editing
3. **Efficiency**: No need to recreate flows just to change names
4. **Accessibility**: Multiple ways to access rename functionality
5. **Feedback**: Clear visual and toast feedback for all actions

## Future Enhancements

Potential improvements that could be added:
- **Bulk rename**: Rename multiple flows at once
- **Name validation**: Check for duplicate names
- **Auto-save**: Save changes automatically after a delay
- **Undo functionality**: Ability to undo rename operations
- **Keyboard navigation**: Full keyboard support for accessibility
