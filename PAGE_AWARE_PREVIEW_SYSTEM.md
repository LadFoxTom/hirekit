# Page-Aware Preview System

## Overview

This document describes the comprehensive page-aware preview system implemented for the CV/Letter builder application. The system addresses the core problem of unpredictable whitespace and layout differences between preview and PDF export by providing deterministic page preview, smart suggestions, and AI-powered optimization.

## Problem Solved

### Original Issues
- **Unpredictable whitespace**: Large blank regions at page bottoms
- **Layout mismatches**: Preview didn't match final PDF
- **No page awareness**: Users couldn't see where pages would break
- **Poor optimization**: No suggestions for improving layout
- **Manual guesswork**: Users had to guess how content would fit

### Root Causes
1. **Different layout models**: Web pages use continuous flow, PDFs use discrete pages
2. **Dynamic content heights**: Variable text, images, and user content
3. **Font loading delays**: Late font loading caused reflows
4. **No page break control**: Browser decided page breaks arbitrarily
5. **Preview/export mismatch**: Different rendering engines

## Solution Architecture

### 1. Measurement System (`useSectionMeasurement`)

**Purpose**: Accurately measure rendered heights of all CV sections

**Key Features**:
- **ResizeObserver integration**: Automatically detects size changes
- **Font-aware measurement**: Waits for fonts to load before measuring
- **Caching system**: Avoids remeasuring unchanged content
- **Hidden measurement container**: Measures at exact A4 width
- **Performance optimized**: Debounced updates and batched operations

**Implementation**:
```typescript
const {
  measurements,
  isMeasuring,
  measureAllSections,
  A4_HEIGHT_PX,
  A4_WIDTH_PX
} = useSectionMeasurement()
```

### 2. Pagination Logic (`usePagination`)

**Purpose**: Intelligently split content into A4 pages

**Algorithms**:
- **Greedy pagination**: Simple, fast packing algorithm
- **First-fit-decreasing**: Optimized packing for better space utilization
- **Smart splitting**: Handles oversized sections
- **Widow/orphan prevention**: Typography best practices

**Features**:
- **Fit score calculation**: 0-100 score for page utilization
- **Problem detection**: Identifies overflow, excessive whitespace
- **Smart suggestions**: AI-powered optimization recommendations

### 3. Page Preview UI (`PagePreview`)

**Purpose**: Single-page view with navigation controls

**Features**:
- **Page-by-page navigation**: Left/right arrows, keyboard shortcuts
- **Zoom controls**: Auto-fit, manual zoom, percentage display
- **Thumbnail sidebar**: Quick page navigation
- **Fit score indicators**: Visual feedback on page utilization
- **Overflow warnings**: Clear indication of layout problems
- **Fullscreen mode**: Distraction-free editing

### 4. Smart Suggestions (`SmartSuggestions`)

**Purpose**: AI-powered optimization recommendations

**Suggestion Types**:
- **Rephrasing**: AI shortens content while preserving meaning
- **Reordering**: Optimizes section order for better fit
- **Resizing**: Adjusts font size or spacing
- **Splitting**: Breaks large sections across pages
- **Combining**: Merges small sections

**AI Integration**:
- **OpenAI API**: GPT-4 for intelligent rephrasing
- **Context-aware**: Understands section types and content
- **Preservation**: Maintains formatting and key information
- **Configurable reduction**: 5-50% content reduction options

### 5. Section Manager (`SectionManager`)

**Purpose**: Drag-and-drop section reordering

**Features**:
- **Visual drag-and-drop**: Intuitive section reordering
- **Section grouping**: Organizes by type (header, section, break)
- **Quick actions**: Add/remove page breaks, edit sections
- **Real-time feedback**: Immediate layout updates
- **Accessibility**: Keyboard navigation support

### 6. Enhanced CV Preview (`EnhancedCVPreview`)

**Purpose**: Main orchestrator component

**Features**:
- **Unified interface**: Combines all preview features
- **Toggle controls**: Show/hide suggestions and section manager
- **Real-time updates**: Automatic remeasurement on content changes
- **Performance optimized**: Debounced updates and caching
- **Responsive design**: Works on all screen sizes

## Technical Implementation

### Data Flow

1. **Content Change** → CV data updates
2. **Measurement** → Sections measured with ResizeObserver
3. **Pagination** → Content split into pages with fit scores
4. **Problem Detection** → Issues identified and categorized
5. **Suggestions** → AI generates optimization recommendations
6. **User Actions** → Drag/drop, rephrasing, manual breaks
7. **Real-time Update** → Preview updates immediately

### Performance Optimizations

1. **Debounced Measurements**: 100ms delay prevents excessive recalculations
2. **Content Caching**: Hash-based caching for unchanged sections
3. **Batched DOM Operations**: Minimizes layout thrashing
4. **Memoized Calculations**: React.useMemo for expensive operations
5. **Lazy Loading**: Components load only when needed

### PDF Export Fidelity

The system maintains perfect fidelity between preview and PDF export:

1. **Same HTML/CSS**: Both use identical rendering
2. **Puppeteer Integration**: Server-side PDF generation
3. **Font Consistency**: Same fonts loaded in both contexts
4. **A4 Dimensions**: Exact pixel-perfect measurements
5. **Print Styles**: Optimized CSS for PDF output

## API Endpoints

### AI Rephrasing (`/api/ai-rephrase`)

**Purpose**: AI-powered content optimization

**Request**:
```json
{
  "content": "Original content text",
  "targetReduction": 20,
  "sectionType": "experience",
  "preserveFormatting": true
}
```

**Response**:
```json
{
  "rephrasedContent": "Optimized content",
  "originalLength": 500,
  "newLength": 400,
  "targetReduction": 20,
  "actualReduction": 20,
  "success": true
}
```

## Usage Examples

### Basic Implementation

```tsx
import { EnhancedCVPreview } from '@/components/EnhancedCVPreview'

function CVBuilder() {
  const [cvData, setCvData] = useState(cvData)
  
  return (
    <EnhancedCVPreview 
      data={cvData}
      onDataChange={setCvData}
      className="h-full"
    />
  )
}
```

### With Enhanced Features

```tsx
<CVPreviewWithPagination 
  data={cvData} 
  enhanced={true}
  onDataChange={handleDataChange}
/>
```

## Benefits

### For Users
- **Predictable Layout**: See exactly how pages will look
- **Smart Optimization**: AI helps improve content fit
- **Easy Editing**: Drag-and-drop section reordering
- **Real-time Feedback**: Immediate visual feedback
- **Professional Results**: Perfect PDF export quality

### For Developers
- **Modular Architecture**: Reusable components
- **Performance Optimized**: Efficient rendering and updates
- **Extensible**: Easy to add new features
- **Type Safe**: Full TypeScript support
- **Well Documented**: Comprehensive API documentation

## Future Enhancements

### Planned Features
1. **Advanced AI**: More sophisticated content optimization
2. **Template Optimization**: AI-suggested template changes
3. **Batch Processing**: Multiple document optimization
4. **Analytics**: Usage tracking and optimization insights
5. **Collaboration**: Real-time collaborative editing

### Performance Improvements
1. **Web Workers**: Offload heavy calculations
2. **Virtual Scrolling**: Handle very long documents
3. **Progressive Loading**: Load content as needed
4. **Advanced Caching**: More sophisticated cache strategies

## Troubleshooting

### Common Issues

1. **Measurements not updating**: Check ResizeObserver setup
2. **PDF mismatch**: Verify font loading in print-cv-server
3. **Performance issues**: Check debouncing and caching
4. **AI errors**: Verify OpenAI API key configuration

### Debug Tools

- **Measurement cache**: Check `useSectionMeasurement` cache
- **Pagination debug**: Log pagination results
- **Performance profiling**: Use React DevTools Profiler
- **Network monitoring**: Check API call performance

## Conclusion

The page-aware preview system transforms the CV/Letter builder from a basic preview tool into an intelligent document optimization platform. Users now have complete control over their document layout with AI-powered suggestions and real-time feedback, ensuring professional-quality results every time.

The system maintains perfect fidelity between preview and export while providing advanced features like drag-and-drop reordering, AI rephrasing, and smart pagination. This represents a significant improvement in user experience and document quality.
