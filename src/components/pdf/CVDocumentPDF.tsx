'use client'

import React, { useState, useEffect } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from '@react-pdf/renderer'
import { CVData } from '@/types/cv'
import { optimizeLayout, LayoutSettings } from '@/lib/pdf/layout-optimizer'
import { cropImageForPDF } from '@/utils/imageCropper'

// ============================================
// FONT CONFIG - Prevent awkward word breaks
// ============================================

Font.registerHyphenationCallback(word => [word])

// ============================================
// TEMPLATE TYPES
// ============================================

// Style-based templates (sidebar layouts with different colors)
export type CVStyleTemplate = 'modern' | 'executive' | 'creative' | 'minimal' | 'professional' | 'tech'

// ATS-friendly layout templates (distinct structural layouts)
export type CVLayoutTemplate = 'classic-chronological' | 'skills-forward' | 'modern-minimalist' | 'executive-leader' | 'ats-simple' | 'compact-professional'

// Combined template type
export type CVTemplate = CVStyleTemplate | CVLayoutTemplate

// Template category for UI organization
export interface TemplateInfo {
  id: CVTemplate
  name: string
  description: string
  category: 'style' | 'ats-layout'
  color: string
  atsScore: number // 1-100, how ATS-friendly
  bestFor: string[]
}

// All available templates with metadata
export const TEMPLATE_INFO: TemplateInfo[] = [
  // Style-based templates
  { id: 'modern', name: 'Modern', description: 'Clean & contemporary sidebar layout', category: 'style', color: '#2563eb', atsScore: 85, bestFor: ['Tech', 'Startups', 'Creative'] },
  { id: 'executive', name: 'Executive', description: 'Sophisticated & elegant sidebar layout', category: 'style', color: '#18181b', atsScore: 85, bestFor: ['Senior Roles', 'Management', 'Finance'] },
  { id: 'creative', name: 'Creative', description: 'Bold & expressive sidebar layout', category: 'style', color: '#7c3aed', atsScore: 80, bestFor: ['Design', 'Marketing', 'Media'] },
  { id: 'minimal', name: 'Minimal', description: 'Simple & timeless sidebar layout', category: 'style', color: '#374151', atsScore: 90, bestFor: ['All Industries', 'Traditional', 'Corporate'] },
  { id: 'professional', name: 'Professional', description: 'Corporate & polished sidebar layout', category: 'style', color: '#0369a1', atsScore: 88, bestFor: ['Corporate', 'Consulting', 'Business'] },
  { id: 'tech', name: 'Tech', description: 'Modern developer style sidebar layout', category: 'style', color: '#059669', atsScore: 85, bestFor: ['Software', 'Engineering', 'IT'] },
  
  // ATS-optimized layout templates
  { id: 'classic-chronological', name: 'Classic ATS', description: 'Single column, most ATS-friendly format', category: 'ats-layout', color: '#1e40af', atsScore: 100, bestFor: ['All Industries', 'Corporate', 'Government'] },
  { id: 'skills-forward', name: 'Skills Forward', description: 'Skills highlighted at top, great for career changers', category: 'ats-layout', color: '#7c3aed', atsScore: 95, bestFor: ['Career Change', 'Tech Roles', 'Entry Level'] },
  { id: 'modern-minimalist', name: 'Modern Minimal', description: 'Clean two-column with subtle styling', category: 'ats-layout', color: '#0f766e', atsScore: 88, bestFor: ['Startups', 'Creative', 'Tech'] },
  { id: 'executive-leader', name: 'Executive Leader', description: 'Accomplishment-focused for senior professionals', category: 'ats-layout', color: '#18181b', atsScore: 95, bestFor: ['C-Suite', 'Directors', 'VP Level'] },
  { id: 'ats-simple', name: 'ATS Simple', description: 'Plain text optimized, maximum parseability', category: 'ats-layout', color: '#374151', atsScore: 100, bestFor: ['Government', 'Large Corps', 'ATS-Heavy'] },
  { id: 'compact-professional', name: 'Compact Pro', description: 'Dense layout for extensive experience', category: 'ats-layout', color: '#0369a1', atsScore: 92, bestFor: ['Experienced', '10+ Years', 'Multiple Roles'] },
]

interface TemplateConfig {
  primaryColor: string
  sidebarBg: string
  sidebarText: string
  textColor: string
  lightText: string
  layoutType: 'sidebar' | 'single-column' | 'two-column-subtle'
  headerStyle: 'standard' | 'centered' | 'left-aligned' | 'minimal'
  sectionStyle: 'underlined' | 'boxed' | 'minimal' | 'spaced'
}

const TEMPLATES: Record<CVTemplate, TemplateConfig> = {
  // Style-based templates (sidebar layouts)
  modern: {
    primaryColor: '#2563eb',
    sidebarBg: '#1e3a5f',
    sidebarText: '#ffffff',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'underlined',
  },
  executive: {
    primaryColor: '#18181b',
    sidebarBg: '#1f2937',
    sidebarText: '#ffffff',
    textColor: '#18181b',
    lightText: '#52525b',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'underlined',
  },
  creative: {
    primaryColor: '#7c3aed',
    sidebarBg: '#4c1d95',
    sidebarText: '#ffffff',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'boxed',
  },
  minimal: {
    primaryColor: '#374151',
    sidebarBg: '#f3f4f6',
    sidebarText: '#1f2937',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'minimal',
  },
  professional: {
    primaryColor: '#0369a1',
    sidebarBg: '#0c4a6e',
    sidebarText: '#ffffff',
    textColor: '#1e293b',
    lightText: '#64748b',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'underlined',
  },
  tech: {
    primaryColor: '#059669',
    sidebarBg: '#064e3b',
    sidebarText: '#ffffff',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'sidebar',
    headerStyle: 'standard',
    sectionStyle: 'boxed',
  },
  
  // ATS-optimized layout templates
  'classic-chronological': {
    primaryColor: '#1e40af',
    sidebarBg: '#ffffff',
    sidebarText: '#1f2937',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'single-column',
    headerStyle: 'centered',
    sectionStyle: 'underlined',
  },
  'skills-forward': {
    primaryColor: '#7c3aed',
    sidebarBg: '#ffffff',
    sidebarText: '#1f2937',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'single-column',
    headerStyle: 'left-aligned',
    sectionStyle: 'boxed',
  },
  'modern-minimalist': {
    primaryColor: '#0f766e',
    sidebarBg: '#f8fafc',
    sidebarText: '#0f172a',
    textColor: '#0f172a',
    lightText: '#64748b',
    layoutType: 'two-column-subtle',
    headerStyle: 'left-aligned',
    sectionStyle: 'minimal',
  },
  'executive-leader': {
    primaryColor: '#18181b',
    sidebarBg: '#ffffff',
    sidebarText: '#18181b',
    textColor: '#18181b',
    lightText: '#52525b',
    layoutType: 'single-column',
    headerStyle: 'left-aligned',
    sectionStyle: 'spaced',
  },
  'ats-simple': {
    primaryColor: '#374151',
    sidebarBg: '#ffffff',
    sidebarText: '#1f2937',
    textColor: '#1f2937',
    lightText: '#6b7280',
    layoutType: 'single-column',
    headerStyle: 'left-aligned',
    sectionStyle: 'minimal',
  },
  'compact-professional': {
    primaryColor: '#0369a1',
    sidebarBg: '#ffffff',
    sidebarText: '#1e293b',
    textColor: '#1e293b',
    lightText: '#64748b',
    layoutType: 'single-column',
    headerStyle: 'left-aligned',
    sectionStyle: 'underlined',
  },
}

// ============================================
// DYNAMIC STYLES BASED ON LAYOUT SETTINGS
// ============================================

const createStyles = (
  config: TemplateConfig, 
  layout: LayoutSettings,
  accentColor?: string
) => {
  const primary = accentColor || config.primaryColor

  return StyleSheet.create({
    // ========== PAGE LAYOUTS ==========
    page: {
      fontFamily: 'Helvetica',
      fontSize: layout.fontSize.body,
      color: config.textColor,
      backgroundColor: '#ffffff',
    },
    
    // Two-column container (sidebar layout)
    twoColumnContainer: {
      flexDirection: 'row',
      minHeight: '100%',
    },

    // Single column container (no sidebar - for multi-page)
    singleColumnContainer: {
      paddingTop: layout.margins.top,
      paddingBottom: layout.margins.bottom,
      paddingHorizontal: layout.margins.left,
    },

    // ========== SIDEBAR ==========
    sidebar: {
      width: layout.sidebarWidth,
      backgroundColor: config.sidebarBg,
      paddingTop: layout.margins.top,
      paddingBottom: layout.margins.bottom,
      paddingHorizontal: 15,
    },
    sidebarSection: {
      marginBottom: layout.spacing.sectionGap,
    },
    sidebarTitle: {
      fontSize: layout.fontSize.body,
      fontFamily: 'Helvetica-Bold',
      color: config.sidebarText,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.25)',
    },
    sidebarName: {
      fontSize: layout.fontSize.name,
      fontFamily: 'Helvetica-Bold',
      color: config.sidebarText,
      marginBottom: 2,
    },
    sidebarHeadline: {
      fontSize: layout.fontSize.body - 1,
      color: config.sidebarText,
      opacity: 0.85,
      marginBottom: 18,
      lineHeight: layout.spacing.lineHeight,
    },

    // Contact in sidebar
    contactItem: {
      marginBottom: 5,
    },
    contactLabel: {
      fontSize: layout.fontSize.body - 2,
      color: config.sidebarText,
      opacity: 0.6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 1,
    },
    contactValue: {
      fontSize: layout.fontSize.body - 1,
      color: config.sidebarText,
      lineHeight: layout.spacing.lineHeight,
    },
    contactLink: {
      fontSize: layout.fontSize.body - 1,
      color: config.sidebarText,
      textDecoration: 'none',
    },

    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillTag: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 2,
      marginRight: 3,
      marginBottom: 3,
    },
    skillTagText: {
      fontSize: layout.fontSize.body - 2,
      color: config.sidebarText,
    },

    // Languages
    languageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    languageName: {
      fontSize: layout.fontSize.body - 1,
      color: config.sidebarText,
    },
    languageLevel: {
      fontSize: layout.fontSize.body - 2,
      color: config.sidebarText,
      opacity: 0.7,
    },

    // Interests
    interestsText: {
      fontSize: layout.fontSize.body - 1,
      color: config.sidebarText,
      lineHeight: 1.5,
      opacity: 0.9,
    },

    // ========== MAIN CONTENT ==========
    main: {
      flex: 1,
      paddingTop: layout.margins.top,
      paddingBottom: layout.margins.bottom,
      paddingLeft: layout.margins.left,
      paddingRight: layout.margins.right,
    },

    // ========== FULL-WIDTH HEADER (no sidebar) ==========
    fullWidthHeader: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: primary,
    },
    fullWidthName: {
      fontSize: layout.fontSize.name + 4,
      fontFamily: 'Helvetica-Bold',
      color: config.textColor,
      marginBottom: 2,
    },
    fullWidthHeadline: {
      fontSize: layout.fontSize.body + 1,
      color: primary,
      marginBottom: 8,
    },
    fullWidthContact: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    fullWidthContactItem: {
      fontSize: layout.fontSize.body - 1,
      color: config.lightText,
      marginRight: 12,
      marginBottom: 2,
    },

    // ========== SECTIONS ==========
    section: {
      marginBottom: layout.spacing.sectionGap,
    },
    sectionTitle: {
      fontSize: layout.fontSize.sectionTitle,
      fontFamily: 'Helvetica-Bold',
      color: primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },

    // Profile text
    profileText: {
      fontSize: layout.fontSize.body,
      lineHeight: layout.spacing.lineHeight + 0.1,
      color: config.textColor,
      textAlign: 'justify',
    },

    // Items (experience, education, etc.)
    itemContainer: {
      marginBottom: layout.spacing.itemGap,
    },
    itemHeader: {
      marginBottom: 3,
    },
    itemTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemTitle: {
      fontSize: layout.fontSize.heading,
      fontFamily: 'Helvetica-Bold',
      color: config.textColor,
      flex: 1,
      paddingRight: 8,
    },
    itemDate: {
      fontSize: layout.fontSize.body - 1,
      color: config.lightText,
      textAlign: 'right',
    },
    itemSubtitle: {
      fontSize: layout.fontSize.body,
      fontFamily: 'Helvetica-Bold',
      color: primary,
      marginTop: 1,
    },
    itemMeta: {
      fontSize: layout.fontSize.body - 1,
      color: config.lightText,
      marginTop: 1,
    },

    // Bullet lists
    bulletList: {
      marginTop: 4,
    },
    bulletRow: {
      flexDirection: 'row',
      marginBottom: layout.compactMode ? 2 : 3,
    },
    bulletPoint: {
      width: 8,
      fontSize: layout.fontSize.body,
      color: primary,
    },
    bulletContent: {
      flex: 1,
      fontSize: layout.fontSize.body - 1,
      lineHeight: layout.spacing.lineHeight,
      color: config.textColor,
      paddingRight: 3,
    },

    // Skills section (full-width layout)
    skillsSection: {
      marginBottom: layout.spacing.sectionGap,
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillChip: {
      backgroundColor: config.lightText + '15',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 3,
      marginRight: 5,
      marginBottom: 4,
    },
    skillChipText: {
      fontSize: layout.fontSize.body - 1,
      color: config.textColor,
    },

    // Languages section (full-width)
    languagesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    languageChip: {
      marginRight: 15,
      marginBottom: 3,
    },
    languageText: {
      fontSize: layout.fontSize.body,
      color: config.textColor,
    },
    languageLevelText: {
      fontSize: layout.fontSize.body - 1,
      color: config.lightText,
    },

    // Photo styles
    photoContainer: {
      marginBottom: 12,
      alignItems: 'center',
    },
    photoSidebar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: config.sidebarText,
    },
    photoHeader: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: primary,
    },
  })
}

// ============================================
// COMPONENT
// ============================================

interface CVDocumentPDFProps {
  data: CVData
  showPageNumbers?: boolean
  processedPhotoUrl?: string | null // Pre-cropped photo URL
}

export const CVDocumentPDF: React.FC<CVDocumentPDFProps> = ({ data, processedPhotoUrl }) => {
  const template = (data.template as CVTemplate) || 'modern'
  const config = TEMPLATES[template] || TEMPLATES.modern
  
  // Get optimized layout settings based on content
  const layout = optimizeLayout(data)
  
  // Use processed photo URL if provided, otherwise fall back to original
  const photoUrl = processedPhotoUrl || data.photoUrl
  
  // Get photo size from layout (with defaults based on position)
  const isCenter = data.layout?.photoPosition === 'center'
  const defaultPhotoSize = isCenter ? 80 : 60
  const photoSize = data.layout?.photoSize ?? defaultPhotoSize
  
  // Determine if this is an ATS layout template (single-column or two-column-subtle)
  const isATSLayout = config.layoutType === 'single-column' || config.layoutType === 'two-column-subtle'
  
  // For ATS layouts, force single-column mode
  const effectiveLayout = isATSLayout ? { ...layout, useSidebar: false } : layout
  
  const styles = createStyles(config, effectiveLayout, data.layout?.accentColor)
  const primary = data.layout?.accentColor || config.primaryColor

  // ========== HELPERS ==========
  const getTechnicalSkills = (): string[] => {
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

  const formatLanguage = (lang: any): { name: string; level: string } => {
    if (typeof lang === 'string') {
      const match = lang.match(/^(.+?)\s*\((.+?)\)$/)
      if (match) return { name: match[1].trim(), level: match[2].trim() }
      return { name: lang, level: '' }
    }
    if (lang?.language) {
      return { name: lang.language, level: lang.proficiency || '' }
    }
    return { name: String(lang), level: '' }
  }

  const formatHobby = (hobby: any): string => {
    if (typeof hobby === 'string') return hobby
    if (hobby?.name) return hobby.name
    return String(hobby)
  }

  // Render bullet points with wrap={false} to keep together
  const renderBullets = (items: string[] | undefined) => {
    if (!items || items.length === 0) return null
    return (
      <View style={styles.bulletList}>
        {items.map((item: string, idx: number) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletContent}>{item}</Text>
          </View>
        ))}
      </View>
    )
  }

  // ========== SKILLS-FORWARD LAYOUT ==========
  // Skills highlighted prominently at the top, ideal for career changers
  if (template === 'skills-forward') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.singleColumnContainer}>
            {/* Header - Left aligned */}
            <View style={{
              marginBottom: 16,
              paddingBottom: 12,
              borderBottomWidth: 3,
              borderBottomColor: primary,
            }}>
              <Text style={styles.fullWidthName}>{data.fullName || 'Your Name'}</Text>
              {(data.professionalHeadline || data.title) && (
                <Text style={styles.fullWidthHeadline}>{data.professionalHeadline || data.title}</Text>
              )}
              <View style={styles.fullWidthContact}>
                {data.contact?.email && <Text style={styles.fullWidthContactItem}>{data.contact.email}</Text>}
                {data.contact?.phone && <Text style={styles.fullWidthContactItem}>{data.contact.phone}</Text>}
                {data.contact?.location && <Text style={styles.fullWidthContactItem}>{data.contact.location}</Text>}
                {data.contact?.linkedin && <Text style={styles.fullWidthContactItem}>LinkedIn</Text>}
                {data.social?.github && <Text style={styles.fullWidthContactItem}>GitHub</Text>}
              </View>
            </View>

            {/* CORE COMPETENCIES - Prominent skills section at top */}
            {getTechnicalSkills().length > 0 && (
              <View style={{
                marginBottom: 16,
                backgroundColor: primary + '08',
                padding: 12,
                borderRadius: 4,
                borderLeftWidth: 3,
                borderLeftColor: primary,
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  borderBottomWidth: 0,
                  marginBottom: 8,
                  color: primary,
                }}>Core Competencies</Text>
                <View style={styles.skillsRow}>
                  {getTechnicalSkills().map((skill: string, idx: number) => (
                    <View key={idx} style={{
                      backgroundColor: primary + '20',
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      marginRight: 6,
                      marginBottom: 6,
                    }}>
                      <Text style={{
                        fontSize: effectiveLayout.fontSize.body,
                        color: config.textColor,
                        fontFamily: 'Helvetica-Bold',
                      }}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Summary */}
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.profileText}>{data.summary}</Text>
              </View>
            )}

            {/* Relevant Experience */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        {exp.dates && <Text style={styles.itemDate}>{exp.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      {exp.location && <Text style={styles.itemMeta}>{exp.location}</Text>}
                    </View>
                    {renderBullets(exp.achievements || exp.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </Text>
                        {edu.dates && <Text style={styles.itemDate}>{edu.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    </View>
                    {renderBullets(edu.achievements || edu.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert: any, idx: number) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: effectiveLayout.fontSize.body, color: config.textColor }}>{cert.title}</Text>
                    {cert.year && <Text style={{ fontSize: effectiveLayout.fontSize.body - 1, color: config.lightText }}>{cert.year}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.languagesRow}>
                  {data.languages.map((lang: any, idx: number) => {
                    const { name, level } = formatLanguage(lang)
                    return (
                      <View key={idx} style={styles.languageChip}>
                        <Text style={styles.languageText}>
                          {name}{level && <Text style={styles.languageLevelText}> ({level})</Text>}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // ========== EXECUTIVE-LEADER LAYOUT ==========
  // Accomplishment-focused with prominent summary and scope indicators
  if (template === 'executive-leader') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.singleColumnContainer}>
            {/* Executive Header */}
            <View style={{
              marginBottom: 20,
              paddingBottom: 16,
              borderBottomWidth: 2,
              borderBottomColor: primary,
            }}>
              <Text style={{
                fontSize: effectiveLayout.fontSize.name + 6,
                fontFamily: 'Helvetica-Bold',
                color: config.textColor,
                letterSpacing: 1,
                marginBottom: 4,
              }}>{(data.fullName || 'Your Name').toUpperCase()}</Text>
              {(data.professionalHeadline || data.title) && (
                <Text style={{
                  fontSize: effectiveLayout.fontSize.heading + 2,
                  color: config.lightText,
                  marginBottom: 12,
                  fontFamily: 'Helvetica',
                }}>{data.professionalHeadline || data.title}</Text>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {data.contact?.email && <Text style={{ ...styles.fullWidthContactItem, fontSize: effectiveLayout.fontSize.body }}>{data.contact.email}</Text>}
                {data.contact?.phone && <Text style={{ ...styles.fullWidthContactItem, fontSize: effectiveLayout.fontSize.body }}>{data.contact.phone}</Text>}
                {data.contact?.location && <Text style={{ ...styles.fullWidthContactItem, fontSize: effectiveLayout.fontSize.body }}>{data.contact.location}</Text>}
                {data.contact?.linkedin && <Text style={{ ...styles.fullWidthContactItem, fontSize: effectiveLayout.fontSize.body }}>linkedin.com/in/{data.fullName?.toLowerCase().replace(/\s+/g, '')}</Text>}
              </View>
            </View>

            {/* Executive Summary - Prominent */}
            {data.summary && (
              <View style={{
                marginBottom: 18,
                paddingBottom: 14,
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  fontSize: effectiveLayout.fontSize.sectionTitle + 1,
                  letterSpacing: 2,
                }}>EXECUTIVE SUMMARY</Text>
                <Text style={{
                  ...styles.profileText,
                  fontSize: effectiveLayout.fontSize.body + 0.5,
                  lineHeight: 1.5,
                }}>{data.summary}</Text>
              </View>
            )}

            {/* Core Competencies - Horizontal Layout */}
            {getTechnicalSkills().length > 0 && (
              <View style={{
                marginBottom: 16,
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  letterSpacing: 2,
                }}>CORE COMPETENCIES</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {getTechnicalSkills().slice(0, 12).map((skill: string, idx: number) => (
                    <Text key={idx} style={{
                      fontSize: effectiveLayout.fontSize.body,
                      color: config.textColor,
                      marginRight: 8,
                      marginBottom: 4,
                    }}>• {skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Professional Experience - With Scope Indicators */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={{
                  ...styles.sectionTitle,
                  letterSpacing: 2,
                }}>PROFESSIONAL EXPERIENCE</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 14 }} wrap={false}>
                    <View style={{ marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                          fontSize: effectiveLayout.fontSize.heading + 1,
                          fontFamily: 'Helvetica-Bold',
                          color: config.textColor,
                        }}>{exp.company}</Text>
                        <Text style={{
                          fontSize: effectiveLayout.fontSize.body,
                          color: config.lightText,
                        }}>{exp.dates}</Text>
                      </View>
                      <Text style={{
                        fontSize: effectiveLayout.fontSize.heading,
                        fontFamily: 'Helvetica-Bold',
                        color: primary,
                        marginTop: 2,
                      }}>{exp.title}</Text>
                      {exp.location && (
                        <Text style={{
                          fontSize: effectiveLayout.fontSize.body - 1,
                          color: config.lightText,
                          fontStyle: 'italic',
                        }}>{exp.location}</Text>
                      )}
                    </View>
                    {renderBullets(exp.achievements || exp.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={{
                  ...styles.sectionTitle,
                  letterSpacing: 2,
                }}>EDUCATION</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 8 }} wrap={false}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{
                        fontSize: effectiveLayout.fontSize.heading,
                        fontFamily: 'Helvetica-Bold',
                        color: config.textColor,
                      }}>
                        {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                      </Text>
                      {edu.dates && <Text style={styles.itemDate}>{edu.dates}</Text>}
                    </View>
                    <Text style={{
                      fontSize: effectiveLayout.fontSize.body,
                      color: primary,
                    }}>{edu.institution}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Professional Affiliations / Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={{
                  ...styles.sectionTitle,
                  letterSpacing: 2,
                }}>CERTIFICATIONS & AFFILIATIONS</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {data.certifications.map((cert: any, idx: number) => (
                    <Text key={idx} style={{
                      fontSize: effectiveLayout.fontSize.body,
                      color: config.textColor,
                      marginRight: 16,
                      marginBottom: 4,
                    }}>• {cert.title}{cert.year ? ` (${cert.year})` : ''}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // ========== ATS-SIMPLE LAYOUT ==========
  // Maximum parseability, minimal formatting
  if (template === 'ats-simple') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{
            paddingTop: 40,
            paddingBottom: 40,
            paddingHorizontal: 50,
          }}>
            {/* Simple Header */}
            <View style={{ marginBottom: 16, textAlign: 'center' }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Helvetica-Bold',
                color: '#000000',
                marginBottom: 4,
              }}>{data.fullName || 'Your Name'}</Text>
              <Text style={{
                fontSize: 10,
                color: '#374151',
              }}>
                {[
                  data.contact?.email,
                  data.contact?.phone,
                  data.contact?.location,
                ].filter(Boolean).join(' | ')}
              </Text>
              {data.contact?.linkedin && (
                <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>
                  LinkedIn: {data.contact.linkedin}
                </Text>
              )}
            </View>

            {/* Summary */}
            {data.summary && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>SUMMARY</Text>
                <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#1f2937' }}>{data.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>PROFESSIONAL EXPERIENCE</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 10 }} wrap={false}>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#000000' }}>
                      {exp.title} - {exp.company}
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 4 }}>
                      {exp.dates}{exp.location ? ` | ${exp.location}` : ''}
                    </Text>
                    {(exp.achievements || exp.content)?.map((item: string, i: number) => (
                      <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                        <Text style={{ fontSize: 9, color: '#000000', width: 10 }}>•</Text>
                        <Text style={{ fontSize: 9, color: '#1f2937', flex: 1, lineHeight: 1.3 }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>EDUCATION</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#000000' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''} - {edu.institution}
                    </Text>
                    {edu.dates && <Text style={{ fontSize: 9, color: '#6b7280' }}>{edu.dates}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {getTechnicalSkills().length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>SKILLS</Text>
                <Text style={{ fontSize: 10, color: '#1f2937', lineHeight: 1.4 }}>
                  {getTechnicalSkills().join(', ')}
                </Text>
              </View>
            )}

            {/* Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>CERTIFICATIONS</Text>
                {data.certifications.map((cert: any, idx: number) => (
                  <Text key={idx} style={{ fontSize: 10, color: '#1f2937', marginBottom: 2 }}>
                    • {cert.title}{cert.year ? ` (${cert.year})` : ''}
                  </Text>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: '#000000',
                  marginBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  paddingBottom: 2,
                }}>LANGUAGES</Text>
                <Text style={{ fontSize: 10, color: '#1f2937' }}>
                  {data.languages.map((lang: any) => {
                    const { name, level } = formatLanguage(lang)
                    return `${name}${level ? ` (${level})` : ''}`
                  }).join(', ')}
                </Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // ========== COMPACT-PROFESSIONAL LAYOUT ==========
  // Dense layout for extensive experience
  if (template === 'compact-professional') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{
            paddingTop: 25,
            paddingBottom: 25,
            paddingHorizontal: 35,
          }}>
            {/* Compact Header */}
            <View style={{
              marginBottom: 12,
              borderBottomWidth: 2,
              borderBottomColor: primary,
              paddingBottom: 8,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: 'Helvetica-Bold',
                    color: config.textColor,
                  }}>{data.fullName || 'Your Name'}</Text>
                  {(data.professionalHeadline || data.title) && (
                    <Text style={{
                      fontSize: 10,
                      color: primary,
                      marginTop: 2,
                    }}>{data.professionalHeadline || data.title}</Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {data.contact?.email && <Text style={{ fontSize: 8, color: config.lightText }}>{data.contact.email}</Text>}
                  {data.contact?.phone && <Text style={{ fontSize: 8, color: config.lightText }}>{data.contact.phone}</Text>}
                  {data.contact?.location && <Text style={{ fontSize: 8, color: config.lightText }}>{data.contact.location}</Text>}
                </View>
              </View>
            </View>

            {/* Summary - Compact */}
            {data.summary && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 8, lineHeight: 1.35, color: config.textColor }}>{data.summary}</Text>
              </View>
            )}

            {/* Skills - Inline */}
            {getTechnicalSkills().length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{
                  fontSize: 9,
                  fontFamily: 'Helvetica-Bold',
                  color: primary,
                  marginBottom: 3,
                }}>KEY SKILLS</Text>
                <Text style={{ fontSize: 8, color: config.textColor, lineHeight: 1.3 }}>
                  {getTechnicalSkills().join(' • ')}
                </Text>
              </View>
            )}

            {/* Experience - Compact */}
            {data.experience && data.experience.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{
                  fontSize: 9,
                  fontFamily: 'Helvetica-Bold',
                  color: primary,
                  marginBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: primary,
                  paddingBottom: 2,
                }}>EXPERIENCE</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 8 }} wrap={false}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: config.textColor }}>
                        {exp.title}
                      </Text>
                      <Text style={{ fontSize: 7, color: config.lightText }}>{exp.dates}</Text>
                    </View>
                    <Text style={{ fontSize: 8, color: primary, marginBottom: 2 }}>
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </Text>
                    {(exp.achievements || exp.content)?.slice(0, 4).map((item: string, i: number) => (
                      <View key={i} style={{ flexDirection: 'row', marginBottom: 1 }}>
                        <Text style={{ fontSize: 7, color: primary, width: 8 }}>•</Text>
                        <Text style={{ fontSize: 7.5, color: config.textColor, flex: 1, lineHeight: 1.25 }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Education - Single line format */}
            {data.education && data.education.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{
                  fontSize: 9,
                  fontFamily: 'Helvetica-Bold',
                  color: primary,
                  marginBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: primary,
                  paddingBottom: 2,
                }}>EDUCATION</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontSize: 8, color: config.textColor }}>
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>{edu.degree}</Text>
                      {edu.field ? ` in ${edu.field}` : ''} - {edu.institution}
                    </Text>
                    {edu.dates && <Text style={{ fontSize: 7, color: config.lightText }}>{edu.dates}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications & Languages - Combined */}
            <View style={{ flexDirection: 'row' }}>
              {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: primary, marginBottom: 2 }}>CERTIFICATIONS</Text>
                  {data.certifications.slice(0, 4).map((cert: any, idx: number) => (
                    <Text key={idx} style={{ fontSize: 7, color: config.textColor, marginBottom: 1 }}>
                      • {cert.title}
                    </Text>
                  ))}
                </View>
              )}
              {data.languages && data.languages.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: primary, marginBottom: 2 }}>LANGUAGES</Text>
                  {data.languages.map((lang: any, idx: number) => {
                    const { name, level } = formatLanguage(lang)
                    return (
                      <Text key={idx} style={{ fontSize: 7, color: config.textColor, marginBottom: 1 }}>
                        • {name}{level ? ` (${level})` : ''}
                      </Text>
                    )
                  })}
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  // ========== CLASSIC-CHRONOLOGICAL LAYOUT ==========
  // The most ATS-friendly single column format with centered header
  if (template === 'classic-chronological') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.singleColumnContainer}>
            {/* Centered Header */}
            <View style={{
              marginBottom: 16,
              paddingBottom: 12,
              borderBottomWidth: 2,
              borderBottomColor: primary,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: effectiveLayout.fontSize.name + 4,
                fontFamily: 'Helvetica-Bold',
                color: config.textColor,
                marginBottom: 4,
              }}>{data.fullName || 'Your Name'}</Text>
              {(data.professionalHeadline || data.title) && (
                <Text style={{
                  fontSize: effectiveLayout.fontSize.heading + 1,
                  color: primary,
                  marginBottom: 8,
                }}>{data.professionalHeadline || data.title}</Text>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {data.contact?.email && <Text style={{ ...styles.fullWidthContactItem, textAlign: 'center' }}>{data.contact.email}</Text>}
                {data.contact?.phone && <Text style={{ ...styles.fullWidthContactItem, textAlign: 'center' }}>{data.contact.phone}</Text>}
                {data.contact?.location && <Text style={{ ...styles.fullWidthContactItem, textAlign: 'center' }}>{data.contact.location}</Text>}
                {data.contact?.linkedin && <Text style={{ ...styles.fullWidthContactItem, textAlign: 'center' }}>LinkedIn</Text>}
              </View>
            </View>

            {/* Summary */}
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.profileText}>{data.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        {exp.dates && <Text style={styles.itemDate}>{exp.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      {exp.location && <Text style={styles.itemMeta}>{exp.location}</Text>}
                    </View>
                    {renderBullets(exp.achievements || exp.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </Text>
                        {edu.dates && <Text style={styles.itemDate}>{edu.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    </View>
                    {renderBullets(edu.achievements || edu.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {getTechnicalSkills().length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={{ fontSize: effectiveLayout.fontSize.body, color: config.textColor, lineHeight: 1.4 }}>
                  {getTechnicalSkills().join(' • ')}
                </Text>
              </View>
            )}

            {/* Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert: any, idx: number) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: effectiveLayout.fontSize.body, color: config.textColor }}>{cert.title}</Text>
                    {cert.institution && <Text style={{ fontSize: effectiveLayout.fontSize.body - 1, color: config.lightText }}>{cert.institution}</Text>}
                    {cert.year && <Text style={{ fontSize: effectiveLayout.fontSize.body - 1, color: config.lightText }}>{cert.year}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.languagesRow}>
                  {data.languages.map((lang: any, idx: number) => {
                    const { name, level } = formatLanguage(lang)
                    return (
                      <View key={idx} style={styles.languageChip}>
                        <Text style={styles.languageText}>
                          {name}{level && <Text style={styles.languageLevelText}> ({level})</Text>}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // ========== MODERN-MINIMALIST LAYOUT ==========
  // Clean two-column with subtle styling
  if (template === 'modern-minimalist') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{
            flexDirection: 'row',
            minHeight: '100%',
          }}>
            {/* Left Sidebar - Skills & Contact */}
            <View style={{
              width: 180,
              backgroundColor: config.sidebarBg,
              paddingTop: 30,
              paddingBottom: 30,
              paddingHorizontal: 15,
            }}>
              {/* Name in sidebar */}
              <Text style={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: config.sidebarText,
                marginBottom: 2,
              }}>{data.fullName || 'Your Name'}</Text>
              {(data.professionalHeadline || data.title) && (
                <Text style={{
                  fontSize: 9,
                  color: primary,
                  marginBottom: 16,
                }}>{data.professionalHeadline || data.title}</Text>
              )}

              {/* Contact */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 8,
                  fontFamily: 'Helvetica-Bold',
                  color: primary,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>Contact</Text>
                {data.contact?.email && <Text style={{ fontSize: 8, color: config.sidebarText, marginBottom: 3 }}>{data.contact.email}</Text>}
                {data.contact?.phone && <Text style={{ fontSize: 8, color: config.sidebarText, marginBottom: 3 }}>{data.contact.phone}</Text>}
                {data.contact?.location && <Text style={{ fontSize: 8, color: config.sidebarText, marginBottom: 3 }}>{data.contact.location}</Text>}
                {data.contact?.linkedin && <Text style={{ fontSize: 8, color: primary, marginBottom: 3 }}>LinkedIn Profile</Text>}
              </View>

              {/* Skills */}
              {getTechnicalSkills().length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 8,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Skills</Text>
                  {getTechnicalSkills().map((skill: string, idx: number) => (
                    <Text key={idx} style={{
                      fontSize: 8,
                      color: config.sidebarText,
                      marginBottom: 3,
                    }}>• {skill}</Text>
                  ))}
                </View>
              )}

              {/* Languages */}
              {data.languages && data.languages.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 8,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Languages</Text>
                  {data.languages.map((lang: any, idx: number) => {
                    const { name, level } = formatLanguage(lang)
                    return (
                      <Text key={idx} style={{ fontSize: 8, color: config.sidebarText, marginBottom: 3 }}>
                        {name}{level ? ` - ${level}` : ''}
                      </Text>
                    )
                  })}
                </View>
              )}

              {/* Interests */}
              {data.hobbies && data.hobbies.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 8,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Interests</Text>
                  <Text style={{ fontSize: 8, color: config.sidebarText, lineHeight: 1.4 }}>
                    {data.hobbies.map(h => formatHobby(h)).join(' • ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Right Main Content */}
            <View style={{
              flex: 1,
              paddingTop: 30,
              paddingBottom: 30,
              paddingHorizontal: 25,
            }}>
              {/* Summary */}
              {data.summary && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 9,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>About</Text>
                  <Text style={{
                    fontSize: 9,
                    color: config.textColor,
                    lineHeight: 1.5,
                  }}>{data.summary}</Text>
                </View>
              )}

              {/* Experience */}
              {data.experience && data.experience.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 9,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Experience</Text>
                  {data.experience.map((exp: any, idx: number) => (
                    <View key={idx} style={{ marginBottom: 12 }} wrap={false}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                          fontSize: 10,
                          fontFamily: 'Helvetica-Bold',
                          color: config.textColor,
                        }}>{exp.title}</Text>
                        <Text style={{ fontSize: 8, color: config.lightText }}>{exp.dates}</Text>
                      </View>
                      <Text style={{
                        fontSize: 9,
                        color: primary,
                        marginBottom: 4,
                      }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>
                      {(exp.achievements || exp.content)?.map((item: string, i: number) => (
                        <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                          <Text style={{ fontSize: 8, color: primary, width: 8 }}>•</Text>
                          <Text style={{ fontSize: 8, color: config.textColor, flex: 1, lineHeight: 1.35 }}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Education */}
              {data.education && data.education.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 9,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Education</Text>
                  {data.education.map((edu: any, idx: number) => (
                    <View key={idx} style={{ marginBottom: 8 }} wrap={false}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                          fontSize: 9,
                          fontFamily: 'Helvetica-Bold',
                          color: config.textColor,
                        }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                        {edu.dates && <Text style={{ fontSize: 8, color: config.lightText }}>{edu.dates}</Text>}
                      </View>
                      <Text style={{ fontSize: 8, color: primary }}>{edu.institution}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Certifications */}
              {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 9,
                    fontFamily: 'Helvetica-Bold',
                    color: primary,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>Certifications</Text>
                  {data.certifications.map((cert: any, idx: number) => (
                    <Text key={idx} style={{ fontSize: 8, color: config.textColor, marginBottom: 2 }}>
                      • {cert.title}{cert.year ? ` (${cert.year})` : ''}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  // ========== FULL-WIDTH LAYOUT (for multi-page or minimal) ==========
  if (!effectiveLayout.useSidebar) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.singleColumnContainer}>
            {/* Header */}
            <View style={styles.fullWidthHeader}>
              {/* Photo - center position */}
              {photoUrl && data.layout?.photoPosition === 'center' && (
                <View style={styles.photoContainer}>
                  {/* Photo is pre-cropped with shape and border */}
                  <View style={{
                    width: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                    height: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                    overflow: 'hidden',
                  }}>
                    <Image
                      src={photoUrl}
                      style={{
                        width: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                        height: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                      }}
                    />
                  </View>
                </View>
              )}
              
              <Text style={styles.fullWidthName}>{data.fullName || 'Your Name'}</Text>
              {(data.professionalHeadline || data.title) && (
                <Text style={styles.fullWidthHeadline}>{data.professionalHeadline || data.title}</Text>
              )}
              <View style={styles.fullWidthContact}>
                {data.contact?.email && <Text style={styles.fullWidthContactItem}>{data.contact.email}</Text>}
                {data.contact?.phone && <Text style={styles.fullWidthContactItem}>{data.contact.phone}</Text>}
                {data.contact?.location && <Text style={styles.fullWidthContactItem}>{data.contact.location}</Text>}
                {data.contact?.linkedin && <Text style={styles.fullWidthContactItem}>LinkedIn</Text>}
                {data.social?.github && <Text style={styles.fullWidthContactItem}>GitHub</Text>}
              </View>
            </View>

            {/* Summary */}
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.profileText}>{data.summary}</Text>
              </View>
            )}

            {/* Skills - placed early for visibility */}
            {getTechnicalSkills().length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsRow}>
                  {getTechnicalSkills().map((skill: string, idx: number) => (
                    <View key={idx} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Experience - each item wrapped to prevent orphans */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        {exp.dates && <Text style={styles.itemDate}>{exp.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      {exp.location && <Text style={styles.itemMeta}>{exp.location}</Text>}
                    </View>
                    {renderBullets(exp.achievements || exp.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </Text>
                        {edu.dates && <Text style={styles.itemDate}>{edu.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    </View>
                    {renderBullets(edu.achievements || edu.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {data.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((project: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{project.title}</Text>
                    </View>
                    {renderBullets(project.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{cert.title}</Text>
                        {cert.year && <Text style={styles.itemDate}>{cert.year}</Text>}
                      </View>
                      {cert.institution && <Text style={styles.itemSubtitle}>{cert.institution}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.languagesRow}>
                  {data.languages.map((lang: any, idx: number) => {
                    const { name, level } = formatLanguage(lang)
                    return (
                      <View key={idx} style={styles.languageChip}>
                        <Text style={styles.languageText}>
                          {name}{level && <Text style={styles.languageLevelText}> ({level})</Text>}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}

            {/* Interests */}
            {data.hobbies && data.hobbies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <Text style={styles.profileText}>
                  {data.hobbies.map(h => formatHobby(h)).join('  •  ')}
                </Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // ========== SIDEBAR LAYOUT (single page optimized) ==========
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={!layout.forceOnePage}>
        <View style={styles.twoColumnContainer}>
          {/* ===== SIDEBAR ===== */}
          <View style={styles.sidebar} fixed={layout.forceOnePage}>
            {/* Photo */}
            {photoUrl && data.layout?.photoPosition !== 'none' && (
              <View style={styles.photoContainer}>
                {/* Photo is pre-cropped with shape and border */}
                <View style={{
                  width: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                  height: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                  overflow: 'hidden',
                }}>
                  <Image
                    src={photoUrl}
                    style={{
                      width: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                      height: photoSize + (data.layout?.photoBorderWidth ?? 0) * 2,
                    }}
                  />
                </View>
              </View>
            )}
            
            {/* Name & Title */}
            <Text style={styles.sidebarName}>{data.fullName || 'Your Name'}</Text>
            {(data.professionalHeadline || data.title) && (
              <Text style={styles.sidebarHeadline}>{data.professionalHeadline || data.title}</Text>
            )}

            {/* Contact */}
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Contact</Text>
              
              {data.contact?.email && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{data.contact.email}</Text>
                </View>
              )}
              
              {data.contact?.phone && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{data.contact.phone}</Text>
                </View>
              )}
              
              {data.contact?.location && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>Location</Text>
                  <Text style={styles.contactValue}>{data.contact.location}</Text>
                </View>
              )}
              
              {data.contact?.linkedin && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>LinkedIn</Text>
                  <Link src={data.contact.linkedin} style={styles.contactLink}>
                    <Text style={styles.contactValue}>View Profile</Text>
                  </Link>
                </View>
              )}
              
              {data.social?.github && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>GitHub</Text>
                  <Link src={data.social.github} style={styles.contactLink}>
                    <Text style={styles.contactValue}>View Profile</Text>
                  </Link>
                </View>
              )}
            </View>

            {/* Skills */}
            {getTechnicalSkills().length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {getTechnicalSkills().map((skill: string, idx: number) => (
                    <View key={idx} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Languages</Text>
                {data.languages.map((lang: any, idx: number) => {
                  const { name, level } = formatLanguage(lang)
                  return (
                    <View key={idx} style={styles.languageRow}>
                      <Text style={styles.languageName}>{name}</Text>
                      {level && <Text style={styles.languageLevel}>{level}</Text>}
                    </View>
                  )
                })}
              </View>
            )}

            {/* Interests */}
            {data.hobbies && data.hobbies.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Interests</Text>
                <Text style={styles.interestsText}>
                  {data.hobbies.map(h => formatHobby(h)).join('  •  ')}
                </Text>
              </View>
            )}
          </View>

          {/* ===== MAIN CONTENT ===== */}
          <View style={styles.main}>
            {/* Profile/Summary */}
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.profileText}>{data.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.map((exp: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        {exp.dates && <Text style={styles.itemDate}>{exp.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      {exp.location && <Text style={styles.itemMeta}>{exp.location}</Text>}
                    </View>
                    {renderBullets(exp.achievements || exp.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </Text>
                        {edu.dates && <Text style={styles.itemDate}>{edu.dates}</Text>}
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    </View>
                    {renderBullets(edu.achievements || edu.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {data.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((project: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{project.title}</Text>
                    </View>
                    {renderBullets(project.content)}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert: any, idx: number) => (
                  <View key={idx} style={styles.itemContainer} wrap={false}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemTitle}>{cert.title}</Text>
                        {cert.year && <Text style={styles.itemDate}>{cert.year}</Text>}
                      </View>
                      {cert.institution && <Text style={styles.itemSubtitle}>{cert.institution}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default CVDocumentPDF
