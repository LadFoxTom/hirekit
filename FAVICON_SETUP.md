# Favicon Setup Guide for LadderFox

## Quick Setup

To add a custom favicon (browser tab icon) for LadderFox, you need to create and add icon files to the `public` directory.

## Required Files

Place these files in the `public` directory:

1. **favicon.ico** - Main favicon (16x16, 32x32, 48x48 sizes in one file)
2. **icon-192.png** - 192x192 pixels PNG (for Android)
3. **icon-512.png** - 512x512 pixels PNG (for PWA)
4. **apple-icon.png** - 180x180 pixels PNG (for iOS)

## How to Create Favicon Files

### Option 1: Online Favicon Generator (Easiest)

1. Go to https://realfavicongenerator.net/ or https://favicon.io/
2. Upload your logo/image (should be square, at least 512x512px)
3. Download the generated files
4. Extract and place in the `public` directory

### Option 2: Design Your Own

1. Create a square image (512x512px minimum) with your LadderFox logo
2. Use a tool like:
   - **Favicon.io**: https://favicon.io/favicon-converter/
   - **Canva**: Design at 512x512px, export as PNG
   - **Photoshop/GIMP**: Create and export at required sizes

3. Convert to ICO format for favicon.ico:
   - Use https://convertio.co/png-ico/ or similar
   - Or use ImageMagick: `convert icon.png -resize 32x32 favicon.ico`

## File Structure

After adding files, your `public` directory should have:

```
public/
  ├── favicon.ico
  ├── icon-192.png
  ├── icon-512.png
  ├── apple-icon.png
  └── site.webmanifest (already updated)
```

## Design Tips

- **Keep it simple**: Favicons are small, so simple designs work best
- **Use your brand colors**: Match your LadderFox gradient (blue to purple)
- **High contrast**: Ensure it's visible on both light and dark backgrounds
- **Square format**: Always start with a square image
- **Test at small sizes**: Make sure it's recognizable at 16x16 pixels

## Quick Test

After adding the files:

1. Restart your dev server
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the browser tab - you should see your new favicon

## Current Setup

The code is already configured to use these files. Once you add them to the `public` directory, they will automatically be used.
