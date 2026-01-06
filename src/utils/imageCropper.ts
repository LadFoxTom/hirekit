/**
 * Image Cropper Utility for PDF Generation
 * 
 * Crops images client-side based on positioning (X/Y) to ensure
 * the preview matches the PDF output exactly.
 * 
 * Uses 3x scale factor for high-quality Retina/print output.
 */

/**
 * Result from cropping operation
 */
export interface CroppedImageResult {
  dataUrl: string  // PNG data URL of cropped image
  width: number    // Display width (including border)
  height: number   // Display height (including border)
}

/**
 * Crop an image based on position and shape for PDF rendering
 * Uses 3x scale factor for high quality output
 * 
 * @param imageUrl - Image URL (data URL or HTTP/HTTPS URL)
 * @param displayWidth - Target display width in pixels (actual canvas will be 3x)
 * @param displayHeight - Target display height in pixels (actual canvas will be 3x)
 * @param positionX - Horizontal position (0-100, where 0=left, 50=center, 100=right)
 * @param positionY - Vertical position (0-100, where 0=top, 50=center, 100=bottom)
 * @param shape - Shape of the crop (circle, square, or rounded)
 * @param borderWidth - Border width in pixels (0-8)
 * @param borderColor - Border color in hex format (e.g., '#3b82f6')
 * @returns Promise<CroppedImageResult> - Data URL and dimensions of the cropped image
 */
export async function cropImageForPDF(
  imageUrl: string,
  displayWidth: number,      // Display size (e.g., 60)
  displayHeight: number,      // Display size (e.g., 60)
  positionX: number = 50,
  positionY: number = 50,
  shape: 'circle' | 'square' | 'rounded' = 'circle',
  borderWidth: number = 0,
  borderColor: string = '#000000'
): Promise<CroppedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    // Handle CORS for external URLs
    if (imageUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous'
    }
    
    img.onload = () => {
      try {
        // CRITICAL: Use 3x scale factor for high quality (Retina/print)
        const SCALE_FACTOR = 3
        const scaledWidth = displayWidth * SCALE_FACTOR
        const scaledHeight = displayHeight * SCALE_FACTOR
        const scaledBorder = borderWidth * SCALE_FACTOR
        
        // Total canvas size includes border
        const totalSize = scaledWidth + (scaledBorder * 2)
        
        const canvas = document.createElement('canvas')
        // CRITICAL: Enable alpha channel for transparency + high quality settings
        const ctx = canvas.getContext('2d', { 
          alpha: true,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        })
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Set canvas to 3x size for high quality
        canvas.width = totalSize
        canvas.height = totalSize

        // CRITICAL: Clear canvas with transparency (NOT black)
        ctx.clearRect(0, 0, totalSize, totalSize)

        // Step 1: Draw border background if needed (scaled)
        if (scaledBorder > 0) {
          ctx.save()
          ctx.fillStyle = borderColor
          
          if (shape === 'circle') {
            ctx.beginPath()
            ctx.arc(totalSize / 2, totalSize / 2, totalSize / 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (shape === 'rounded') {
            const radius = totalSize * 0.15
            roundRect(ctx, 0, 0, totalSize, totalSize, radius)
            ctx.fill()
          } else {
            // Square
            ctx.fillRect(0, 0, totalSize, totalSize)
          }
          
          ctx.restore()
        }

        // Step 2: Prepare image area with offset for border
        ctx.save()
        ctx.translate(scaledBorder, scaledBorder)

        // Calculate source dimensions (what part of the image to use)
        const imgAspect = img.width / img.height
        const containerAspect = scaledWidth / scaledHeight
        
        let sourceWidth: number
        let sourceHeight: number
        let sourceX: number
        let sourceY: number

        if (imgAspect > containerAspect) {
          // Image is wider than container - crop horizontally
          sourceHeight = img.height
          sourceWidth = img.height * containerAspect
          sourceY = 0
          // Use positionX to determine horizontal crop position
          sourceX = (img.width - sourceWidth) * (positionX / 100)
        } else {
          // Image is taller than container - crop vertically
          sourceWidth = img.width
          sourceHeight = img.width / containerAspect
          sourceX = 0
          // Use positionY to determine vertical crop position
          sourceY = (img.height - sourceHeight) * (positionY / 100)
        }

        // Ensure source coordinates are within bounds
        sourceX = Math.max(0, Math.min(sourceX, img.width - sourceWidth))
        sourceY = Math.max(0, Math.min(sourceY, img.height - sourceHeight))

        // Step 3: Apply clipping for the image area (BEFORE drawing, scaled)
        if (shape === 'circle') {
          // Clip to circle
          ctx.beginPath()
          ctx.arc(
            scaledWidth / 2,
            scaledHeight / 2,
            scaledWidth / 2,
            0,
            Math.PI * 2
          )
          ctx.clip()
        } else if (shape === 'rounded') {
          // Clip to rounded rectangle (15% border radius)
          const radius = scaledWidth * 0.15
          roundRect(ctx, 0, 0, scaledWidth, scaledHeight, radius)
          ctx.clip()
        }
        // For 'square', no clipping needed

        // Step 4: Draw the cropped portion at 3x size for quality
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
          0, 0, scaledWidth, scaledHeight // Destination rectangle (3x display size)
        )

        // Restore context after drawing
        ctx.restore()

        // CRITICAL: Use PNG format to preserve transparency
        // High quality PNG maintains the 3x pixel density
        const dataUrl = canvas.toDataURL('image/png')
        
        // Return both the data URL and the DISPLAY dimensions
        // PDF will use the high-res dataUrl but display at these dimensions
        resolve({
          dataUrl,
          width: displayWidth + (borderWidth * 2),  // Actual display size
          height: displayHeight + (borderWidth * 2)
        })
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Start loading the image
    img.src = imageUrl
  })
}

/**
 * Helper function to draw a rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Batch crop multiple images (useful for pre-processing)
 */
export async function cropImagesForPDF(
  images: Array<{
    url: string
    width: number
    height: number
    positionX?: number
    positionY?: number
    shape?: 'circle' | 'square' | 'rounded'
    borderWidth?: number
    borderColor?: string
  }>
): Promise<CroppedImageResult[]> {
  return Promise.all(
    images.map(({ url, width, height, positionX, positionY, shape, borderWidth, borderColor }) =>
      cropImageForPDF(url, width, height, positionX, positionY, shape, borderWidth, borderColor)
    )
  )
}

