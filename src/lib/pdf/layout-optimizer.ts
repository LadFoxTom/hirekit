/**
 * PDF Layout Optimizer
 * 
 * Calculates content dimensions and optimizes layout for professional CVs.
 * Implements best practices from tools like Canva, Novoresume, and Overleaf.
 */

import { CVData } from '@/types/cv'

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const MARGIN_TOP = 30
const MARGIN_BOTTOM = 30
const SIDEBAR_WIDTH = 170
const MAIN_PADDING = 47 // 22 left + 25 right

// Estimated line heights (in points)
const LINE_HEIGHTS = {
  name: 20,          // 16pt font + spacing
  headline: 12,      // 8pt font + spacing
  sectionTitle: 18,  // 10pt font + margin
  itemTitle: 14,     // 10pt font + company + spacing
  bulletItem: 12,    // 8pt font + spacing
  text: 12,          // 9pt font + line height
  sidebarSection: 25, // title + spacing
  skillTag: 14,      // tag height + margin
  languageRow: 12,
  contactItem: 18,   // label + value + spacing
}

// Content estimation
interface ContentMetrics {
  totalHeight: number
  sidebarHeight: number
  mainHeight: number
  pageCount: number
  sections: {
    name: string
    height: number
    canBreak: boolean
  }[]
}

/**
 * Estimate the height of text content
 */
function estimateTextHeight(text: string | undefined, lineHeight: number, maxWidth: number): number {
  if (!text) return 0
  const avgCharWidth = 5 // approximate for 9pt Helvetica
  const charsPerLine = Math.floor(maxWidth / avgCharWidth)
  const lines = Math.ceil(text.length / charsPerLine)
  return lines * lineHeight
}

/**
 * Estimate the height of bullet list items
 */
function estimateBulletsHeight(items: string[] | undefined, maxWidth: number): number {
  if (!items || items.length === 0) return 0
  let totalHeight = 0
  for (const item of items) {
    totalHeight += estimateTextHeight(item, LINE_HEIGHTS.bulletItem, maxWidth - 8)
  }
  return totalHeight + 5 // margin top
}

/**
 * Calculate content metrics for layout optimization
 */
export function calculateContentMetrics(data: CVData): ContentMetrics {
  const mainWidth = A4_WIDTH - SIDEBAR_WIDTH - MAIN_PADDING
  const sidebarContentWidth = SIDEBAR_WIDTH - 30 // padding
  
  const sections: ContentMetrics['sections'] = []
  
  // === SIDEBAR CALCULATIONS ===
  let sidebarHeight = 0
  
  // Name + headline
  sidebarHeight += LINE_HEIGHTS.name
  if (data.professionalHeadline || data.title) {
    sidebarHeight += LINE_HEIGHTS.headline + 20 // margin bottom
  }
  
  // Contact section
  const contactItems = [
    data.contact?.email,
    data.contact?.phone,
    data.contact?.location,
    data.contact?.linkedin,
    data.social?.github,
    data.contact?.website,
  ].filter(Boolean).length
  sidebarHeight += LINE_HEIGHTS.sidebarSection + (contactItems * LINE_HEIGHTS.contactItem)
  
  // Skills
  const skills = getSkillsArray(data)
  if (skills.length > 0) {
    const skillRows = Math.ceil(skills.length / 2) // ~2 tags per row
    sidebarHeight += LINE_HEIGHTS.sidebarSection + (skillRows * LINE_HEIGHTS.skillTag)
  }
  
  // Languages
  if (data.languages && data.languages.length > 0) {
    sidebarHeight += LINE_HEIGHTS.sidebarSection + (data.languages.length * LINE_HEIGHTS.languageRow)
  }
  
  // Hobbies/Interests
  if (data.hobbies && data.hobbies.length > 0) {
    sidebarHeight += LINE_HEIGHTS.sidebarSection + estimateTextHeight(
      data.hobbies.join(' • '),
      LINE_HEIGHTS.text,
      sidebarContentWidth
    )
  }
  
  // === MAIN CONTENT CALCULATIONS ===
  let mainHeight = 0
  
  // Profile/Summary
  if (data.summary) {
    const summaryHeight = LINE_HEIGHTS.sectionTitle + estimateTextHeight(data.summary, LINE_HEIGHTS.text, mainWidth)
    sections.push({ name: 'profile', height: summaryHeight, canBreak: false })
    mainHeight += summaryHeight
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    let expSectionHeight = LINE_HEIGHTS.sectionTitle
    
    for (const exp of data.experience) {
      const itemHeight = LINE_HEIGHTS.itemTitle + 
        (exp.location ? LINE_HEIGHTS.text : 0) +
        estimateBulletsHeight(exp.achievements || exp.content, mainWidth)
      
      sections.push({ name: `exp-${exp.company}`, height: itemHeight, canBreak: false })
      expSectionHeight += itemHeight + 12 // item margin
    }
    
    mainHeight += expSectionHeight
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    let eduSectionHeight = LINE_HEIGHTS.sectionTitle
    
    for (const edu of data.education) {
      const itemHeight = LINE_HEIGHTS.itemTitle +
        estimateBulletsHeight(edu.achievements || edu.content, mainWidth)
      
      sections.push({ name: `edu-${edu.institution}`, height: itemHeight, canBreak: false })
      eduSectionHeight += itemHeight + 12
    }
    
    mainHeight += eduSectionHeight
  }
  
  // Projects
  if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
    let projSectionHeight = LINE_HEIGHTS.sectionTitle
    
    for (const proj of data.projects) {
      const itemHeight = LINE_HEIGHTS.itemTitle +
        estimateBulletsHeight(proj.content, mainWidth)
      
      sections.push({ name: `proj-${proj.title}`, height: itemHeight, canBreak: false })
      projSectionHeight += itemHeight + 10
    }
    
    mainHeight += projSectionHeight
  }
  
  // Certifications
  if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
    let certSectionHeight = LINE_HEIGHTS.sectionTitle
    
    for (const cert of data.certifications) {
      certSectionHeight += LINE_HEIGHTS.itemTitle + 10
    }
    
    sections.push({ name: 'certifications', height: certSectionHeight, canBreak: true })
    mainHeight += certSectionHeight
  }
  
  // Calculate total and page count
  const usableHeight = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
  const effectiveHeight = Math.max(sidebarHeight, mainHeight)
  const pageCount = Math.ceil(effectiveHeight / usableHeight)
  
  return {
    totalHeight: effectiveHeight,
    sidebarHeight,
    mainHeight,
    pageCount,
    sections,
  }
}

/**
 * Get skills array from various data formats
 */
function getSkillsArray(data: CVData): string[] {
  if (data.technicalSkills) {
    return data.technicalSkills.split(',').map(s => s.trim()).filter(Boolean)
  }
  if (data.skills && Array.isArray(data.skills)) {
    return (data.skills as string[]).filter(s => typeof s === 'string')
  }
  if (data.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)) {
    const skillsObj = data.skills as { technical?: string[]; tools?: string[] }
    return [...(skillsObj.technical || []), ...(skillsObj.tools || [])].filter(Boolean)
  }
  return []
}

/**
 * Layout optimization settings based on content analysis
 */
export interface LayoutSettings {
  useSidebar: boolean
  fontSize: {
    body: number
    heading: number
    sectionTitle: number
    name: number
  }
  spacing: {
    sectionGap: number
    itemGap: number
    lineHeight: number
  }
  sidebarWidth: number
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  forceOnePage: boolean
  compactMode: boolean
}

/**
 * Generate optimized layout settings based on content
 */
export function optimizeLayout(data: CVData): LayoutSettings {
  const metrics = calculateContentMetrics(data)
  const usableHeight = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
  
  // Default settings
  const settings: LayoutSettings = {
    useSidebar: true,
    fontSize: {
      body: 9,
      heading: 10,
      sectionTitle: 10,
      name: 16,
    },
    spacing: {
      sectionGap: 14,
      itemGap: 12,
      lineHeight: 1.4,
    },
    sidebarWidth: 170,
    margins: {
      top: 30,
      bottom: 30,
      left: 22,
      right: 25,
    },
    forceOnePage: false,
    compactMode: false,
  }
  
  // If content fits comfortably on one page, use standard settings
  if (metrics.totalHeight <= usableHeight * 0.95) {
    return settings
  }
  
  // If slightly over, try compact mode first
  if (metrics.totalHeight <= usableHeight * 1.15) {
    settings.compactMode = true
    settings.fontSize = {
      body: 8.5,
      heading: 9.5,
      sectionTitle: 9.5,
      name: 15,
    }
    settings.spacing = {
      sectionGap: 12,
      itemGap: 10,
      lineHeight: 1.35,
    }
    settings.forceOnePage = true
    return settings
  }
  
  // If moderately over (up to 1.4x), use aggressive compact mode
  if (metrics.totalHeight <= usableHeight * 1.4) {
    settings.compactMode = true
    settings.fontSize = {
      body: 8,
      heading: 9,
      sectionTitle: 9,
      name: 14,
    }
    settings.spacing = {
      sectionGap: 10,
      itemGap: 8,
      lineHeight: 1.3,
    }
    settings.sidebarWidth = 155
    settings.forceOnePage = true
    return settings
  }
  
  // For very long content, use multi-page layout without sidebar
  // This prevents the orphaned content issue
  settings.useSidebar = false
  settings.compactMode = true
  settings.fontSize = {
    body: 9,
    heading: 10,
    sectionTitle: 10,
    name: 18,
  }
  settings.spacing = {
    sectionGap: 12,
    itemGap: 10,
    lineHeight: 1.4,
  }
  settings.margins = {
    top: 35,
    bottom: 35,
    left: 40,
    right: 40,
  }
  settings.forceOnePage = false
  
  return settings
}

/**
 * Get layout recommendation message for AI agent
 */
export function getLayoutRecommendation(data: CVData): string {
  const metrics = calculateContentMetrics(data)
  const settings = optimizeLayout(data)
  const usableHeight = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
  
  const fillPercentage = Math.round((metrics.totalHeight / usableHeight) * 100)
  
  if (metrics.pageCount === 1 && fillPercentage <= 95) {
    return `✅ Content fits well on one page (${fillPercentage}% filled). Layout is optimal.`
  }
  
  if (settings.forceOnePage && settings.compactMode) {
    return `📐 Content is ${fillPercentage}% of page. Using compact mode with smaller fonts to fit on one page.`
  }
  
  if (!settings.useSidebar) {
    return `📄 Content is extensive (${metrics.pageCount} pages estimated). Switched to full-width layout without sidebar for better multi-page flow.`
  }
  
  return `📊 Layout optimized. Page fill: ${fillPercentage}%.`
}










