# CV Photo Management System - Technical Specification

## Document Purpose
This document provides a comprehensive technical specification of the Photo Management system in the CV Builder application. It is intended for external consultants and developers who need to understand, maintain, or extend the photo management features.

---

## Table of Contents
1. [Overview](#overview)
2. [Data Structure](#data-structure)
3. [Photo Storage](#photo-storage)
4. [Photo Upload Features](#photo-upload-features)
5. [Photo Selection & Management](#photo-selection--management)
6. [Photo Display on CV](#photo-display-on-cv)
7. [Photo Positioning](#photo-positioning)
8. [Photo Shape Options](#photo-shape-options)
9. [Photo Visibility Toggle](#photo-visibility-toggle)
10. [Data Persistence](#data-persistence)
11. [Technical Implementation Details](#technical-implementation-details)
12. [API Integration](#api-integration)
13. [Limitations & Constraints](#limitations--constraints)

---

## Overview

The Photo Management system allows users to:
- Upload multiple photos for their CV
- Select which photo appears on the CV
- Position the photo in different locations (left, right, center, or hidden)
- Customize photo shape (circle, square, rounded)
- Fine-tune photo position within its container
- Toggle photo visibility on/off
- Persist photo data with CV saves

### Key Features
- **Multiple Photo Support**: Users can upload and store multiple photos
- **Photo Selection**: One photo is selected as the active photo for the CV
- **Flexible Positioning**: 4 main positions (left, right, center, none) plus fine-grained positioning
- **Shape Customization**: 3 shape options (circle, square, rounded)
- **Dual Storage Methods**: Cloud storage (authenticated users) or base64 data URLs (all users)
- **PDF Compatibility**: Photos work seamlessly in PDF generation

---

## Data Structure

### CVData Interface (TypeScript)

```typescript
interface CVData {
  // Primary photo URL (the currently selected photo)
  photoUrl?: string
  
  // Array of all uploaded photos
  photos?: string[] // Array of photo URLs/data URLs
  
  // Layout configuration
  layout?: {
    // Photo position on CV
    photoPosition?: 'left' | 'right' | 'center' | 'none'
    
    // Photo shape
    photoShape?: 'circle' | 'square' | 'rounded'
    
    // Fine-grained positioning (0-100, CSS object-position percentage)
    photoPositionX?: number // Horizontal position (0 = left, 100 = right)
    photoPositionY?: number // Vertical position (0 = top, 100 = bottom)
    
    // Other layout properties...
    accentColor?: string
    showIcons?: boolean
    // ... etc
  }
}
```

### State Management (React)

The application maintains the following state variables:

```typescript
// Array of all uploaded photos (data URLs or cloud URLs)
const [photos, setPhotos] = useState<string[]>([])

// Index of currently selected photo in the photos array
const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

// CV data object containing photoUrl and layout settings
const [cvData, setCvData] = useState<CVData>({
  photoUrl: undefined,
  photos: [],
  layout: {
    photoPosition: 'none',
    photoShape: 'circle',
    photoPositionX: 50,
    photoPositionY: 50
  }
})
```

### Relationship Between State Variables

- `photos[]`: Master array of all uploaded photos
- `selectedPhotoIndex`: Points to the active photo in `photos[]`
- `cvData.photoUrl`: Contains the URL of the selected photo (synced with `photos[selectedPhotoIndex]`)
- `cvData.photos`: Optional array that mirrors `photos[]` for persistence

---

## Photo Storage

### Storage Methods

The system supports two storage methods:

#### 1. Cloud Storage (UploadThing) - Authenticated Users
- **When Used**: When user is authenticated (`isAuthenticated === true`)
- **Endpoint**: `/api/uploadthing/profileImage`
- **Max File Size**: 4MB
- **Max Files**: 1 per upload (but multiple uploads allowed)
- **File Types**: Images only (`image/*`)
- **Storage**: Files stored on UploadThing cloud service
- **Returns**: Public URL string
- **Database**: File metadata saved to database via `FileUploadService`

#### 2. Base64 Data URLs - All Users (Fallback)
- **When Used**: 
  - Non-authenticated users
  - When UploadThing upload fails
  - For PDF compatibility
- **Method**: `FileReader.readAsDataURL()`
- **Format**: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
- **Storage**: Stored directly in `cvData` and `photos[]` array
- **Advantages**: 
  - Works offline
  - No external dependencies
  - PDF compatible
- **Disadvantages**:
  - Increases data size significantly
  - Not ideal for large files
  - Included in API payloads (sanitized before sending)

### File Validation

Before upload, files are validated:

```typescript
// File type validation
if (!file.type.startsWith('image/')) {
  // Reject non-image files
}

// File size validation
if (file.size > 4 * 1024 * 1024) { // 4MB limit
  // Reject files over 4MB
}
```

**Supported Formats**: JPG, PNG, GIF, WebP (any `image/*` MIME type)
**Size Limit**: 4MB per file
**Multiple Files**: Yes, users can upload multiple photos in one action

---

## Photo Upload Features

### Upload Interface

Located in the "Photos" tab of the main CV builder interface.

#### Upload Button
- **Location**: Photos tab, "Add New Photo" section
- **Action**: Opens native file picker
- **Multiple Selection**: Enabled (`input.multiple = true`)
- **Accept Types**: `image/*`
- **UI**: Dashed border button with upload icon

#### Upload Process

1. **File Selection**
   - User clicks "Upload Photos" button
   - Native file picker opens
   - User can select one or multiple image files

2. **Validation**
   - Each file validated for type and size
   - Invalid files rejected with error toast
   - Valid files proceed to upload

3. **Upload Method Selection**
   ```
   IF user is authenticated:
     TRY UploadThing cloud upload
     IF successful:
       Store cloud URL
     ELSE:
       Fallback to base64
   ELSE:
     Use base64 data URL
   ```

4. **Storage**
   - Valid photos added to `photos[]` array
   - First photo auto-selected if none selected
   - `photoUrl` updated to selected photo
   - Success toast notification

5. **Auto-Positioning**
   - If `photoPosition === 'none'`, automatically set to `'left'`
   - Ensures photo is visible after upload

### Upload Code Flow

```typescript
// 1. Create file input
const input = document.createElement('input')
input.type = 'file'
input.accept = 'image/*'
input.multiple = true

// 2. Handle file selection
input.onchange = async (e) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  
  // 3. Validate files
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) return false
    if (file.size > 4 * 1024 * 1024) return false
    return true
  })
  
  // 4. Process each file
  validFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      // Add to photos array
      setPhotos(prev => [...prev, dataUrl])
    }
    reader.readAsDataURL(file)
  })
}
```

---

## Photo Selection & Management

### Photo Gallery

The Photos tab displays all uploaded photos in a grid layout.

#### Gallery Display
- **Layout**: Responsive grid (2 columns on mobile, 3 on desktop)
- **Thumbnail Size**: Square aspect ratio (`aspect-square`)
- **Image Fit**: `object-cover` (crops to fit square)
- **Selection Indicator**: Blue border + checkmark overlay for selected photo

#### Photo Selection

**Click to Select**:
```typescript
onClick={() => {
  setSelectedPhotoIndex(index)
  setCvData({
    ...cvData,
    photoUrl: photos[index],
    layout: {
      ...cvData.layout,
      photoPosition: cvData.layout?.photoPosition || 'left'
    }
  })
}}
```

**Visual Feedback**:
- Selected photo: Blue border (`border-blue-500`) + ring effect
- Selected photo: Blue overlay with checkmark icon
- Unselected photos: Gray border, hover effect

#### Photo Deletion

**Delete Button**:
- **Location**: Top-right corner of each photo thumbnail
- **Visibility**: Only on hover (`opacity-0 group-hover:opacity-100`)
- **Action**: Removes photo from `photos[]` array

**Delete Logic**:
```typescript
// Remove photo from array
const newPhotos = photos.filter((_, i) => i !== index)
setPhotos(newPhotos)

// Handle selected photo deletion
IF deleted photo was selected:
  IF other photos exist:
    Select nearest photo (Math.min(index, newPhotos.length - 1))
  ELSE:
    Clear selection (setSelectedPhotoIndex(null))
    Set photoPosition to 'none'
    Clear photoUrl
ELSE IF selected index > deleted index:
  Decrement selectedPhotoIndex
```

**Index Management**: When a photo is deleted, indices are automatically adjusted to maintain consistency.

---

## Photo Display on CV

### Display Logic

The photo is displayed on the CV based on the `photoPosition` setting:

#### Position Options

1. **`'left'`**: Photo appears in sidebar (left side of CV)
2. **`'right'`**: Photo appears in sidebar (right side of CV)  
3. **`'center'`**: Photo appears centered in header (full-width layouts)
4. **`'none'`**: Photo is hidden (not displayed)

### Layout-Specific Display

#### Sidebar Layouts (photoPosition: 'left' or 'right')

**When Used**: Style-based templates (modern, executive, creative, minimal, professional, tech)

**Display Location**: Sidebar column

**Photo Container**:
- **Size**: 60x60 pixels
- **Shape**: Based on `photoShape` setting
- **Border**: 2px solid, color matches sidebar text color
- **Position**: Top of sidebar, below header section

**Code Implementation**:
```typescript
{data.photoUrl && data.layout?.photoPosition !== 'none' && (
  <View style={styles.photoContainer}>
    <View style={{
      width: 60,
      height: 60,
      borderRadius: photoShape === 'circle' ? 30 : 
                    photoShape === 'rounded' ? 8 : 0,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: config.sidebarText,
    }}>
      <Image
        src={data.photoUrl}
        style={{ width: 60, height: 60 }}
      />
    </View>
  </View>
)}
```

#### Full-Width Layouts (photoPosition: 'center')

**When Used**: ATS-optimized templates (single-column layouts)

**Display Location**: Centered in header section

**Photo Container**:
- **Size**: 80x80 pixels
- **Shape**: Based on `photoShape` setting
- **Border**: 2px solid, color matches primary accent color
- **Position**: Centered above name/header

**Code Implementation**:
```typescript
{data.photoUrl && data.layout?.photoPosition === 'center' && (
  <View style={styles.photoContainer}>
    <View style={{
      width: 80,
      height: 80,
      borderRadius: photoShape === 'circle' ? 40 : 
                    photoShape === 'rounded' ? 12 : 0,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: primary,
    }}>
      <Image
        src={data.photoUrl}
        style={{ width: 80, height: 80 }}
      />
    </View>
  </View>
)}
```

### Image Rendering

**Library**: `@react-pdf/renderer` (for PDF generation)

**Component**: `<Image src={data.photoUrl} />`

**Supported Formats**:
- Data URLs: `data:image/jpeg;base64,...`
- HTTP/HTTPS URLs: `https://uploadthing.com/...`
- Local file URLs: Not supported in PDF context

**Image Processing**:
- Images are rendered at fixed sizes (60x60 or 80x80)
- `object-fit: cover` behavior (crops to fit)
- Border radius applied based on shape setting
- Border color matches template theme

---

## Photo Positioning

### Main Position Options

The `photoPosition` property controls where the photo appears on the CV:

| Value | Description | Layout Type | Visual Location |
|-------|-------------|-------------|-----------------|
| `'left'` | Left sidebar | Sidebar layouts | Left column, top |
| `'right'` | Right sidebar | Sidebar layouts | Right column, top |
| `'center'` | Centered header | Full-width layouts | Center of header |
| `'none'` | Hidden | All layouts | Not displayed |

### Fine-Grained Positioning

For advanced positioning within the photo container, the system supports:

- **`photoPositionX`**: Horizontal position (0-100)
  - `0` = Left edge
  - `50` = Center (default)
  - `100` = Right edge

- **`photoPositionY`**: Vertical position (0-100)
  - `0` = Top edge
  - `50` = Center (default)
  - `100` = Bottom edge

**UI Control**: 9-point grid selector in Photo Settings

**Grid Positions**:
```
Top Left      | Top Center      | Top Right
(0, 0)        | (50, 0)         | (100, 0)
--------------|-----------------|---------------
Center Left   | Center          | Center Right
(0, 50)       | (50, 50)        | (100, 50)
--------------|-----------------|---------------
Bottom Left   | Bottom Center   | Bottom Right
(0, 100)      | (50, 100)       | (100, 100)
```

**Implementation Note**: Currently, fine-grained positioning (`photoPositionX`, `photoPositionY`) is stored but may not be fully implemented in PDF rendering. The main positioning (`photoPosition`) is fully functional.

---

## Photo Shape Options

### Available Shapes

| Shape | Value | Description | Border Radius |
|-------|-------|-------------|---------------|
| Circle | `'circle'` | Perfect circle | 50% (30px for sidebar, 40px for center) |
| Square | `'square'` | Sharp corners | 0px |
| Rounded | `'rounded'` | Rounded corners | 8px (sidebar), 12px (center) |

### Shape Application

**Sidebar Layouts** (60x60px):
- Circle: `borderRadius: 30`
- Rounded: `borderRadius: 8`
- Square: `borderRadius: 0`

**Center Layouts** (80x80px):
- Circle: `borderRadius: 40`
- Rounded: `borderRadius: 12`
- Square: `borderRadius: 0`

### Default Shape
- **Default**: `'circle'`
- **Applied When**: No `photoShape` specified in `cvData.layout`

---

## Photo Visibility Toggle

### Toggle Control

**Location**: Photos tab, "Show Photo on CV" section

**UI Element**: Toggle switch (iOS-style)

**States**:
- **ON** (Blue): `photoPosition !== 'none'` → Photo visible
- **OFF** (Gray): `photoPosition === 'none'` → Photo hidden

### Toggle Logic

```typescript
onClick={() => {
  const currentPosition = cvData.layout?.photoPosition || 'none'
  const newPosition = currentPosition === 'none' ? 'left' : 'none'
  
  setCvData({
    ...cvData,
    layout: {
      ...cvData.layout,
      photoPosition: newPosition
    }
  })
}}
```

**Behavior**:
- **Toggle ON**: Sets `photoPosition` to `'left'` (if was `'none'`)
- **Toggle OFF**: Sets `photoPosition` to `'none'` (hides photo)

**Note**: When toggling ON, the system defaults to `'left'` position. User can then change to `'right'` or `'center'` manually.

---

## Data Persistence

### Saving Photos with CV

When a CV is saved, photos are included in the CV data:

```typescript
// Save CV with photos
const cvDataToSave = {
  ...cvData,
  photos: photos, // Include photos array
  photoUrl: cvData.photoUrl // Include selected photo URL
}

// API call
await fetch('/api/cv', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My CV',
    content: cvDataToSave,
    template: cvData.template
  })
})
```

### Loading Photos from Saved CV

When loading a saved CV:

```typescript
// Load CV data
const savedCV = await fetch(`/api/cv/${cvId}`).then(r => r.json())

// Restore photos array
if (savedCV.content.photos && Array.isArray(savedCV.content.photos)) {
  setPhotos(savedCV.content.photos)
  
  // Restore selected photo
  if (savedCV.content.photoUrl) {
    const photoIndex = savedCV.content.photos.findIndex(
      photo => photo === savedCV.content.photoUrl
    )
    if (photoIndex !== -1) {
      setSelectedPhotoIndex(photoIndex)
    }
  }
}
```

### Backward Compatibility

**Legacy CV Format** (only `photoUrl`, no `photos[]`):
```typescript
if (cvData.photoUrl && !cvData.photos) {
  // Convert to new format
  setPhotos([cvData.photoUrl])
  setSelectedPhotoIndex(0)
}
```

### Local Storage

Photos are temporarily stored in `localStorage` when navigating between pages:
- **Key**: `cvData`
- **Format**: JSON string containing full CV data including `photos[]` array
- **Cleared**: After successful page load

---

## Technical Implementation Details

### State Synchronization

The system maintains synchronization between:
1. `photos[]` array (master list)
2. `selectedPhotoIndex` (current selection)
3. `cvData.photoUrl` (selected photo URL)
4. `cvData.layout.photoPosition` (display position)

**Sync Logic**:
```typescript
// When photo is selected
useEffect(() => {
  if (selectedPhotoIndex !== null && photos[selectedPhotoIndex]) {
    setCvData(prev => ({
      ...prev,
      photoUrl: photos[selectedPhotoIndex]
    }))
  }
}, [selectedPhotoIndex, photos])

// When photoUrl changes externally
useEffect(() => {
  if (cvData.photoUrl && photos.length > 0) {
    const index = photos.findIndex(p => p === cvData.photoUrl)
    if (index !== -1) {
      setSelectedPhotoIndex(index)
    }
  }
}, [cvData.photoUrl])
```

### Manual Selection Flag

To prevent infinite loops during manual selection:

```typescript
const isManualSelectionRef = useRef(false)

// When user manually selects photo
onClick={() => {
  isManualSelectionRef.current = true
  setSelectedPhotoIndex(index)
  // ... update cvData
}}

// In sync effect
useEffect(() => {
  if (isManualSelectionRef.current) {
    isManualSelectionRef.current = false
    return // Skip auto-sync
  }
  // ... sync logic
})
```

### Photo Sanitization for API

Large base64 photos are removed before sending to chat API:

```typescript
const sanitizeCVDataForAPI = (data: CVData): CVData => {
  const sanitized = { ...data }
  if (sanitized.photos) {
    delete sanitized.photos // Remove large base64 data
  }
  return sanitized
}
```

**Reason**: Base64 photos can be several MB, causing API timeouts.

---

## API Integration

### UploadThing Integration

**Endpoint**: `/api/uploadthing/profileImage`

**Configuration** (`src/lib/uploadthing.ts`):
```typescript
profileImage: f({ 
  image: { 
    maxFileSize: "4MB", 
    maxFileCount: 1 
  } 
})
.middleware(async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return { userId: session.user.id }
})
.onUploadComplete(async ({ metadata, file }) => {
  await FileUploadService.createFileUpload(
    metadata.userId,
    file.name,
    file.url,
    file.size,
    file.type
  )
})
```

**Response Format**:
```json
{
  "url": "https://uploadthing.com/f/abc123.jpg",
  "name": "profile.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

### CV Save API

**Endpoint**: `/api/cv` (POST) or `/api/cv/:id` (PUT)

**Request Body**:
```json
{
  "title": "My CV",
  "content": {
    "photoUrl": "data:image/jpeg;base64,...",
    "photos": ["data:image/jpeg;base64,...", "..."],
    "layout": {
      "photoPosition": "left",
      "photoShape": "circle",
      "photoPositionX": 50,
      "photoPositionY": 50
    },
    // ... other CV data
  },
  "template": "modern"
}
```

### CV Load API

**Endpoint**: `/api/cv/:id` (GET)

**Response Format**:
```json
{
  "cv": {
    "id": "cv-123",
    "title": "My CV",
    "content": {
      "photoUrl": "data:image/jpeg;base64,...",
      "photos": ["data:image/jpeg;base64,..."],
      "layout": { /* ... */ }
    }
  }
}
```

---

## Limitations & Constraints

### File Size Limits
- **Maximum File Size**: 4MB per photo
- **Reason**: Prevents performance issues and API timeouts
- **Enforcement**: Client-side validation before upload

### Storage Constraints

#### Base64 Data URLs
- **Size Increase**: Base64 encoding increases file size by ~33%
- **Storage Location**: Stored in database as part of CV JSON
- **Impact**: Large photos increase database storage requirements
- **Recommendation**: Use cloud storage (UploadThing) for authenticated users

#### Cloud Storage (UploadThing)
- **Requirement**: User must be authenticated
- **Cost**: Subject to UploadThing pricing
- **Limitation**: 4MB per file, 1 file per upload request

### PDF Generation Constraints

- **Image Format**: Must be data URL or HTTP/HTTPS URL
- **Size**: Large images may slow PDF generation
- **Rendering**: Fixed sizes (60x60 or 80x80) - no dynamic sizing
- **Shape**: Border radius applied, but image is cropped to square

### Browser Compatibility

- **FileReader API**: Required for base64 conversion
- **File Input**: Native file picker (all modern browsers)
- **Multiple Selection**: Supported in all modern browsers

### Performance Considerations

1. **Multiple Photos**: Storing many large base64 photos in state can impact performance
2. **PDF Generation**: Large photos increase PDF generation time
3. **API Payloads**: Photos are excluded from chat API requests (sanitized)
4. **Memory Usage**: Base64 photos stored in React state consume browser memory

### Known Issues / Future Improvements

1. **Fine-Grained Positioning**: `photoPositionX` and `photoPositionY` are stored but not fully implemented in PDF rendering
2. **Photo Cropping**: No UI for cropping photos before upload
3. **Photo Editing**: No built-in photo editing (rotate, brightness, etc.)
4. **Photo Compression**: No automatic compression before upload
5. **Photo Optimization**: No automatic optimization for web/PDF

---

## Summary

The Photo Management system provides comprehensive photo handling capabilities:

✅ **Multiple photo upload and storage**
✅ **Photo selection and gallery management**
✅ **Flexible positioning (left, right, center, none)**
✅ **Shape customization (circle, square, rounded)**
✅ **Visibility toggle**
✅ **Dual storage methods (cloud + base64)**
✅ **PDF compatibility**
✅ **Data persistence with CV saves**
✅ **Backward compatibility with legacy CVs**

The system is designed to be flexible, user-friendly, and compatible with both web preview and PDF generation.

---

## Contact & Support

For technical questions or implementation details, refer to:
- Source code: `src/app/page.tsx` (main implementation)
- PDF rendering: `src/components/pdf/CVDocumentPDF.tsx`
- Type definitions: `src/types/cv.ts`
- Upload service: `src/lib/uploadthing.ts`

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team


