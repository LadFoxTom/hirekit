'use client'

import type { FC } from 'react'
import type { CVData } from '@/types/cv'
import { CV_TEMPLATES } from '@/types/cv'
import { 
  FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaInstagram, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaUserTie, FaInfoCircle, FaBriefcase, FaBuilding, FaHistory, FaChartLine, FaGraduationCap, FaBook, FaSchool, FaUniversity, FaTools, FaCogs, FaCode, FaCheck, FaLanguage, FaCommentDots, FaCertificate, FaAward, FaTrophy, FaMedal, FaProjectDiagram, FaFolder, FaTasks, FaHeart, FaSmile, FaHiking, FaMusic, FaCamera
} from 'react-icons/fa'
import { memo, useEffect, useState, useRef, useMemo } from 'react'
import CVSection from './CVSection'
import { IconType } from 'react-icons'

interface PageConfig {
  showHeader?: boolean;
  showSummary?: boolean;
  showExperience?: boolean;
  showEducation?: boolean;
  showSkills?: boolean;
  showLanguages?: boolean;
  showCertifications?: boolean;
  showProjects?: boolean;
  showHobbies?: boolean;
  experience?: any[];
}

interface CVPreviewProps {
  data: CVData
  isPreview?: boolean
  pageConfig?: PageConfig
}

// Helper function to create a stable data signature for comparison
const getDataSignature = (data: CVData): string => {
  try {
    // Create a stable signature based on key properties that affect rendering
    return JSON.stringify({
      fullName: data.fullName,
      title: data.title,
      template: data.template,
      photoUrl: data.photoUrl,
      summary: data.summary,
      experience: data.experience?.length || 0,
      education: data.education?.length || 0,
      skills: Array.isArray(data.skills) ? data.skills.length : Object.keys(data.skills || {}).length,
      layout: data.layout
    });
  } catch {
    return '';
  }
};

// Custom comparison function for memo to prevent unnecessary re-renders
const areEqual = (prevProps: CVPreviewProps, nextProps: CVPreviewProps) => {
  // Compare data signatures instead of object references
  const prevSignature = getDataSignature(prevProps.data);
  const nextSignature = getDataSignature(nextProps.data);
  
  // If data changed, re-render
  if (prevSignature !== nextSignature) {
    return false;
  }
  
  // Compare other props
  if (prevProps.isPreview !== nextProps.isPreview) {
    return false;
  }
  
  // Compare pageConfig (simple reference check is fine for this)
  if (prevProps.pageConfig !== nextProps.pageConfig) {
    // Only re-render if pageConfig actually changed
    if (prevProps.pageConfig && nextProps.pageConfig) {
      const prevKeys = Object.keys(prevProps.pageConfig);
      const nextKeys = Object.keys(nextProps.pageConfig);
      if (prevKeys.length !== nextKeys.length) {
        return false;
      }
      for (const key of prevKeys) {
        if (prevProps.pageConfig[key as keyof PageConfig] !== nextProps.pageConfig[key as keyof PageConfig]) {
          return false;
        }
      }
    } else if (prevProps.pageConfig !== nextProps.pageConfig) {
      return false;
    }
  }
  
  return true;
};

// Using memo to prevent unnecessary re-renders with custom comparison
const CVPreviewComponent: FC<CVPreviewProps> = ({ data, isPreview = false, pageConfig }) => {
  const [isReady, setIsReady] = useState(false);
  const dataSignatureRef = useRef<string>('');
  const loadResourcesTimeoutRef = useRef<NodeJS.Timeout>();

  // Create stable data signature
  const currentDataSignature = useMemo(() => getDataSignature(data), [data]);

  useEffect(() => {
    // Only reload resources if data actually changed
    if (dataSignatureRef.current === currentDataSignature) {
      // Data hasn't changed, keep current ready state
      return;
    }

    // Clear any pending timeouts
    if (loadResourcesTimeoutRef.current) {
      clearTimeout(loadResourcesTimeoutRef.current);
    }

    // Only reset ready state when data signature actually changes
    setIsReady(false);
    dataSignatureRef.current = currentDataSignature;

    // Wait for fonts and images to load completely
    const loadResources = async () => {
      try {
        // Check if fonts API is available (not all mobile browsers support it)
        if (typeof document !== 'undefined' && 'fonts' in document && document.fonts && typeof document.fonts.ready !== 'undefined') {
          try {
            await document.fonts.ready;
          } catch (fontError) {
            // Fonts API not available or failed, continue anyway
            console.debug('Fonts API not available, continuing without font check');
          }
        }
        
        // Wait for images to load (with timeout for mobile)
        if (typeof document !== 'undefined' && document.images) {
          const images = Array.from(document.images);
          if (images.length > 0) {
            // Use Promise.race with timeout to prevent hanging on mobile
            await Promise.race([
              Promise.all(
                images.map(img => {
                  if (img.complete) return Promise.resolve();
                  return new Promise(resolve => {
                    const timeout = setTimeout(() => resolve(void 0), 2000); // 2s timeout per image
                    img.onload = () => {
                      clearTimeout(timeout);
                      resolve(void 0);
                    };
                    img.onerror = () => {
                      clearTimeout(timeout);
                      resolve(void 0);
                    };
                  });
                })
              ),
              new Promise(resolve => setTimeout(resolve, 3000)) // Max 3s total wait
            ]);
          }
        }
        
        // Shorter wait for React to render (reduced from 500ms to 100ms)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Signal that we're ready for PDF generation
        if (typeof window !== 'undefined') {
          (window as any).cvReady = true;
        }
        setIsReady(true);
        
        console.log('CV Preview is ready for PDF generation');
      } catch (error) {
        console.warn('Error loading resources:', error);
        // Still signal ready even if there's an error (important for mobile)
        if (typeof window !== 'undefined') {
          (window as any).cvReady = true;
        }
        setIsReady(true);
      }
    };

    // Use a small delay to batch multiple rapid updates
    loadResourcesTimeoutRef.current = setTimeout(() => {
      loadResources();
    }, 50);

    // Cleanup
    return () => {
      if (loadResourcesTimeoutRef.current) {
        clearTimeout(loadResourcesTimeoutRef.current);
      }
    };
  }, [currentDataSignature]); // Only depend on data signature, not isReady

  const template = CV_TEMPLATES.find((t) => t.id === data.template) || CV_TEMPLATES[0]
  const styles = {
    ...template.styles,
    // Override template's accent color with user-defined accent color if available
    accentColor: data.layout?.accentColor || template.styles.accentColor
  }

  const sectionClasses = {
    boxed: 'border rounded-lg p-4 mb-4',
    underlined: 'border-b pb-4 mb-4',
    minimal: 'mb-6',
    card: 'bg-white shadow-lg rounded-lg p-4 mb-4',
    gradient: 'bg-gradient-to-br from-white to-gray-50 p-4 mb-4 rounded-lg'
  }

  const headerClasses = {
    centered: 'text-center',
    'left-aligned': 'text-left',
    modern: 'text-left border-l-4 pl-4',
    minimalist: 'text-left border-b-2 pb-4',
    creative: 'text-left transform -rotate-1'
  }
  
  // Determine photo position based on layout or default to none
  const photoPosition = data.layout?.photoPosition || 'none'

  // Determine if we should show icons
  const showIcons = data.layout?.showIcons !== undefined ? data.layout.showIcons : true

  // Helper: dynamically import icon from react-icons by identifier
  const getDynamicIconComponent = (iconId: string, props: any = {}) => {
    // For deployment compatibility, return null for now
    // Icons can be implemented later with proper dynamic imports
    return null;
  };

  // Order of sections to display (can be customized by user)
  const baseSectionOrder = data.layout?.sectionOrder || [
    'summary',
    'experience',
    'education',
    'skills',
    'languages',
    'certifications',
    'projects',
    'hobbies'
  ]
  
  // Filter out hidden sections
  const sectionOrder = baseSectionOrder.filter(sectionId => 
    !data.layout?.hiddenSections?.includes(sectionId)
  )

  const fontFamily = data.layout?.fontFamily || template.styles.fontFamily

  // Helper to get section title (custom or default)
  const getSectionTitle = (sectionKey: string, defaultTitle: string) =>
    data.layout?.sectionTitles?.[sectionKey] || defaultTitle

  // Helper to render contact info with enhanced layout options
  const renderContactInfo = () => {
    const contact = data.contact || {}
    const layout = data.layout || {}
    
    const items = [
      contact.email && { icon: FaEnvelope, label: contact.email },
      contact.phone && { icon: FaPhone, label: contact.phone },
      contact.location && { icon: FaMapMarkerAlt, label: contact.location },
    ].filter((item): item is { icon: any; label: string } => Boolean(item))

    if (items.length === 0) return null

    const display = layout.contactDisplay || 'inline'
    const alignment = layout.contactAlignment || 'left'
    const spacing = layout.contactSpacing || 'normal'
    const separator = layout.contactSeparator || 'none'
    const showContactIcons = layout.contactIcons !== undefined ? layout.contactIcons : showIcons

    // Spacing classes
    const spacingClasses = {
      tight: 'gap-2',
      normal: 'gap-3',
      spread: 'gap-6'
    }

    // Alignment classes
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      justify: 'justify-between'
    }

    // Separator rendering
    const renderSeparator = () => {
      switch (separator) {
        case 'dot': return <span className="mx-2">•</span>
        case 'pipe': return <span className="mx-2">|</span>
        case 'bullet': return <span className="mx-2">●</span>
        case 'dash': return <span className="mx-2">—</span>
        default: return null
      }
    }

    if (display === 'stacked') {
      return (
        <div className={`flex flex-col ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {items.map((item: any, i: number) => (
            <span key={i} className="flex items-center text-sm">
              {showContactIcons && <item.icon className="inline-block mr-2 text-sm" />}
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      )
    } else if (display === 'centered') {
      return (
        <div className={`flex flex-wrap items-center text-sm ${spacingClasses[spacing]} justify-center`}>
          {items.map((item: any, i: number) => (
            <span key={i} className="flex items-center">
              {showContactIcons && <item.icon className="inline-block mr-2 text-sm" />}
              <span>{item.label}</span>
              {i < items.length - 1 && renderSeparator()}
            </span>
          ))}
        </div>
      )
    } else if (display === 'justified') {
      return (
        <div className={`flex flex-wrap items-center text-sm ${spacingClasses[spacing]} justify-between`}>
          {items.map((item: any, i: number) => (
            <span key={i} className="flex items-center">
              {showContactIcons && <item.icon className="inline-block mr-2 text-sm" />}
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      )
    } else if (display === 'separated') {
      return (
        <div className={`flex flex-wrap items-center text-sm ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {items.map((item: any, i: number) => (
            <span key={i} className="flex items-center">
              {showContactIcons && <item.icon className="inline-block mr-2 text-sm" />}
              <span>{item.label}</span>
              {i < items.length - 1 && renderSeparator()}
            </span>
          ))}
        </div>
      )
    } else {
      // inline (default)
      return (
        <div className={`flex flex-wrap items-center text-sm ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {items.map((item: any, i: number) => (
            <span key={i} className="flex items-center">
              {showContactIcons && <item.icon className="inline-block mr-2 text-sm" />}
              <span>{item.label}</span>
              {i < items.length - 1 && renderSeparator()}
            </span>
          ))}
        </div>
      )
    }
  }

  // Helper to render social links with enhanced layout options
  const renderSocialLinks = () => {
    const social = data.social || {}
    const layout = data.layout || {}
    
    const links = [
      social.linkedin && { icon: FaLinkedin, label: 'LinkedIn', url: social.linkedin },
      social.github && social.github.toLowerCase() !== 'no' && { icon: FaGithub, label: 'GitHub', url: social.github },
      social.website && social.website.toLowerCase() !== 'no' && { icon: FaGlobe, label: 'Website', url: social.website },
      social.twitter && social.twitter.toLowerCase() !== 'no' && { icon: FaTwitter, label: 'Twitter', url: social.twitter },
      social.instagram && social.instagram.toLowerCase() !== 'no' && { icon: FaInstagram, label: 'Instagram', url: social.instagram },
    ].filter((link): link is { icon: any; label: string; url: string } => Boolean(link))

    if (links.length === 0) return null

    const display = layout.socialLinksDisplay || 'icons-text'
    const alignment = layout.socialLinksAlignment || 'left'
    const spacing = layout.socialLinksSpacing || 'normal'
    const style = layout.socialLinksStyle || 'default'
    const showSocialIcons = layout.socialLinksIcons !== undefined ? layout.socialLinksIcons : true
    const color = layout.socialLinksColor || 'primary'

    // Spacing classes
    const spacingClasses = {
      tight: 'gap-2',
      normal: 'gap-3',
      spread: 'gap-6'
    }

    // Alignment classes
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      justify: 'justify-between'
    }

    // Style classes
    const getStyleClasses = (baseClasses: string) => {
      switch (style) {
        case 'rounded':
          return `${baseClasses} px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors`
        case 'outlined':
          return `${baseClasses} px-3 py-1 border border-gray-300 rounded hover:border-gray-400 transition-colors`
        case 'minimal':
          return `${baseClasses} hover:opacity-75 transition-opacity`
        default:
          return `${baseClasses} hover:underline`
      }
    }

    // Color classes
    const getColorClasses = () => {
      switch (color) {
        case 'primary':
          return `text-[${styles.primaryColor}]`
        case 'secondary':
          return `text-[${styles.secondaryColor}]`
        case 'accent':
          return `text-[${styles.accentColor || styles.primaryColor}]`
        default:
          return 'text-inherit'
      }
    }

    const baseClasses = `flex items-center ${getColorClasses()}`

    if (display === 'icons') {
      return (
        <div className={`flex flex-wrap items-center ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={getStyleClasses(baseClasses)}>
              <link.icon className="text-lg" />
            </a>
          ))}
        </div>
      )
    } else if (display === 'text') {
      return (
        <div className={`flex flex-wrap items-center ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={getStyleClasses(baseClasses)}>
              {link.label}
            </a>
          ))}
        </div>
      )
    } else if (display === 'buttons') {
      return (
        <div className={`flex flex-wrap items-center ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors`}>
              {showSocialIcons && <link.icon className="mr-2" />}
              {link.label}
            </a>
          ))}
        </div>
      )
    } else if (display === 'minimal') {
      return (
        <div className={`flex flex-wrap items-center ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} opacity-75 hover:opacity-100 transition-opacity`}>
              {showSocialIcons && <link.icon className="mr-1 text-sm" />}
              <span className="text-sm">{link.label}</span>
            </a>
          ))}
        </div>
      )
    } else {
      // icons-text (default)
      return (
        <div className={`flex flex-wrap items-center ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={getStyleClasses(baseClasses)}>
              {showSocialIcons && <link.icon className="mr-1 text-lg" />}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )
    }
  }

  // Helper to render content with page breaks
  const renderContentWithBreaks = (content: string[], isPrint = false) => {
    const parts = []
    let buffer: string[] = []
    content.forEach((line, idx) => {
      if (line.trim() === '<break>') {
        if (buffer.length > 0) {
          parts.push(<div key={`part-${idx}`}>{buffer.map((t, i) => <p key={i}>{t}</p>)}</div>)
          buffer = []
        }
        parts.push(
          <div
            key={`break-${idx}`}
            className={isPrint ? 'cv-page-break print-page-break' : 'cv-page-break-viewer'}
            style={isPrint ? {} : { borderTop: '2px dashed #bbb', margin: '2rem 0', textAlign: 'center', color: '#bbb', position: 'relative' }}
          >
            {!isPrint && <span style={{ background: '#fff', padding: '0 1rem', position: 'relative', top: '-0.8em', fontSize: '0.9em' }}>Page Break</span>}
          </div>
        )
      } else {
        buffer.push(line)
      }
    })
    if (buffer.length > 0) {
      parts.push(<div key={`part-final`}>{buffer.map((t, i) => <p key={i}>{t}</p>)}</div>)
    }
    return parts
  }

  // Match PDF logic: use sidebar when photoPosition is 'left' or 'right'
  // This ensures preview matches the downloaded PDF exactly
  const sidebarPosition = photoPosition === 'left' || photoPosition === 'right' 
    ? photoPosition 
    : (data.layout?.sidebarPosition || 'none')
  
  // Get sidebar colors matching PDF template (same as CVDocumentPDF)
  const getSidebarColors = () => {
    const templateId = data.template || 'modern'
    const templateMap: Record<string, { bg: string; text: string }> = {
      modern: { bg: '#1e3a5f', text: '#ffffff' },
      executive: { bg: '#1f2937', text: '#ffffff' },
      creative: { bg: '#4c1d95', text: '#ffffff' },
      minimal: { bg: '#f3f4f6', text: '#1f2937' },
      professional: { bg: '#0c4a6e', text: '#ffffff' },
      tech: { bg: '#064e3b', text: '#ffffff' },
    }
    return templateMap[templateId] || templateMap.modern
  }
  const sidebarColors = getSidebarColors()


  return (
    <div
      data-testid="cv-preview"
      data-pdf-ready={isReady}
      className={`bg-white p-6 shadow-lg rounded-lg cv-print-container a4-page${sidebarPosition !== 'none' ? ' flex' : ''}`}
      style={{
        fontFamily,
        '--spacing': styles.spacing,
        color: styles.primaryColor,
        backgroundColor: styles.backgroundColor || 'white',
        maxWidth: '100%',
        minWidth: '0',
        overflow: 'hidden',
        // Mobile optimizations
        WebkitOverflowScrolling: 'touch',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // Prevent layout shifts on mobile
        contain: 'layout style paint',
        // Ensure proper rendering on mobile
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      } as React.CSSProperties}
    >
      {sidebarPosition !== 'none' && (
        <aside
          className={`sidebar-${sidebarPosition} print:static`}
          style={{
            minWidth: 220,
            maxWidth: 280,
            background: sidebarColors.bg,
            color: sidebarColors.text,
            padding: '2rem 1.5rem',
            marginRight: sidebarPosition === 'left' ? '2rem' : 0,
            marginLeft: sidebarPosition === 'right' ? '2rem' : 0,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }}
        >
          {data.photoUrl && (
            <div 
              className={`w-24 h-24 overflow-hidden border-2 shadow-md mb-4 ${
                (data.layout?.photoShape || 'circle') === 'circle'
                  ? 'rounded-full'
                  : (data.layout?.photoShape || 'circle') === 'rounded'
                  ? 'rounded-lg'
                  : 'rounded-none'
              }`}
              style={{ borderColor: styles.primaryColor }}
            >
              <img 
                src={data.photoUrl} 
                alt={data.fullName} 
                className="w-full h-full object-cover" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${data.layout?.photoPositionX ?? 50}% ${data.layout?.photoPositionY ?? 50}%`,
                  display: 'block',
                  flexShrink: 0
                }}
                loading="lazy"
                onError={(e) => {
                  // Hide image on error to prevent broken image icon
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {data.fullName && <h1 className="text-xl font-bold mb-1 text-center" style={{ color: sidebarColors.text }}>{data.fullName}</h1>}
          {data.title && <p className="text-base mb-3 text-center" style={{ color: sidebarColors.text, opacity: 0.85 }}>{data.title}</p>}
          
          {/* Contact section - matching PDF format */}
          <div className="mt-4 w-full">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: sidebarColors.text, borderBottom: `1px solid rgba(255,255,255,0.25)`, paddingBottom: '4px' }}>
              Contact
            </h3>
            <div className="space-y-2 text-xs" style={{ color: sidebarColors.text }}>
              {data.contact?.email && (
                <div>
                  <div className="font-medium mb-0.5" style={{ opacity: 0.9 }}>Email</div>
                  <div style={{ opacity: 0.8 }}>{data.contact.email}</div>
                </div>
              )}
              {data.contact?.phone && (
                <div>
                  <div className="font-medium mb-0.5" style={{ opacity: 0.9 }}>Phone</div>
                  <div style={{ opacity: 0.8 }}>{data.contact.phone}</div>
                </div>
              )}
              {data.contact?.location && (
                <div>
                  <div className="font-medium mb-0.5" style={{ opacity: 0.9 }}>Location</div>
                  <div style={{ opacity: 0.8 }}>{data.contact.location}</div>
                </div>
              )}
              {data.contact?.linkedin && (
                <div>
                  <div className="font-medium mb-0.5" style={{ opacity: 0.9 }}>LinkedIn</div>
                  <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: sidebarColors.text, opacity: 0.8, textDecoration: 'underline' }}>
                    View Profile
                  </a>
                </div>
              )}
              {data.social?.github && (
                <div>
                  <div className="font-medium mb-0.5" style={{ opacity: 0.9 }}>GitHub</div>
                  <a href={data.social.github} target="_blank" rel="noopener noreferrer" style={{ color: sidebarColors.text, opacity: 0.8, textDecoration: 'underline' }}>
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills in sidebar - matching PDF layout */}
          {(() => {
            const allSkills = Array.isArray(data.skills) 
              ? data.skills.filter(s => typeof s === 'string')
              : data.technicalSkills 
                ? data.technicalSkills.split(',').map(s => s.trim()).filter(Boolean)
                : data.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)
                  ? [...((data.skills as any).technical || []), ...((data.skills as any).tools || [])].filter(Boolean)
                  : []
            
            if (allSkills.length > 0) {
              return (
                <div className="mt-4 w-full">
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: sidebarColors.text, borderBottom: `1px solid rgba(255,255,255,0.25)`, paddingBottom: '4px' }}>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {allSkills.slice(0, 10).map((skill: any, index: number) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: sidebarColors.text 
                        }}
                      >
                        {typeof skill === 'string' ? skill : (skill.name || skill.skill || String(skill))}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          })()}
          
          {/* Languages in sidebar - matching PDF layout */}
          {data.languages && data.languages.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: sidebarColors.text, borderBottom: `1px solid rgba(255,255,255,0.25)`, paddingBottom: '4px' }}>
                Languages
              </h3>
              <div className="space-y-1">
                {data.languages.map((lang: any, index: number) => {
                  const languageText = typeof lang === 'string' 
                    ? lang 
                    : (lang && typeof lang === 'object')
                      ? (lang.language || lang.name || String(lang))
                      : String(lang)
                  const level = typeof lang === 'object' && lang.proficiency ? lang.proficiency : ''
                  const match = typeof lang === 'string' ? lang.match(/^(.+?)\s*\((.+?)\)$/) : null
                  const name = match ? match[1].trim() : (typeof lang === 'object' && lang.language ? lang.language : languageText)
                  const proficiency = match ? match[2].trim() : level
                  
                  return (
                    <div key={index} className="text-xs flex justify-between" style={{ color: sidebarColors.text }}>
                      <span>{name}</span>
                      {proficiency && <span style={{ opacity: 0.8 }}>{proficiency}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Interests in sidebar - matching PDF layout */}
          {data.hobbies && (Array.isArray(data.hobbies) ? data.hobbies.length > 0 : data.hobbies) && (
            <div className="mt-4 w-full">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: sidebarColors.text, borderBottom: `1px solid rgba(255,255,255,0.25)`, paddingBottom: '4px' }}>
                Interests
              </h3>
              <p className="text-xs" style={{ color: sidebarColors.text }}>
                {Array.isArray(data.hobbies) 
                  ? data.hobbies.map((h: any) => typeof h === 'string' ? h : (h?.name || String(h))).join('  •  ')
                  : String(data.hobbies)
                }
              </p>
            </div>
          )}
        </aside>
      )}
      <div className={sidebarPosition !== 'none' ? 'flex-1' : ''}>
        {/* Print header (only visible in print) */}
        <div className="cv-print-header hidden print:block">
          <span className="font-bold">{data.fullName}</span>
          {data.title && <span className="ml-2">| {data.title}</span>}
        </div>
        {/* Add top spacing for sidebar layouts */}
        {sidebarPosition !== 'none' && <div className="mt-8"></div>}
        {/* Center photo position rendered before header */}
        {sidebarPosition === 'none' && data.photoUrl && photoPosition === 'center' && (
          <div className="flex justify-center mt-8 mb-6">
            <div 
              className={`w-32 h-32 overflow-hidden border-2 shadow-md ${
                (data.layout?.photoShape || 'circle') === 'circle'
                  ? 'rounded-full'
                  : (data.layout?.photoShape || 'circle') === 'rounded'
                  ? 'rounded-lg'
                  : 'rounded-none'
              }`}
              style={{ borderColor: styles.primaryColor }}
            >
              <img 
                src={data.photoUrl} 
                alt={data.fullName} 
                className="w-full h-full object-cover" 
                style={{
                  objectPosition: `${data.layout?.photoPositionX ?? 50}% ${data.layout?.photoPositionY ?? 50}%`
                }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        {/* Header with optional profile photo */}
        {sidebarPosition === 'none' && (!pageConfig || pageConfig.showHeader !== false) && (
          <header
            className={`mb-8 ${headerClasses[styles.headerStyle || 'left-aligned']} ${photoPosition === 'left' || photoPosition === 'right' ? 'flex items-center gap-4' : ''}`}
            style={{
              ...(styles.headerStyle === 'modern' ? { borderColor: styles.primaryColor } : {}),
              ...(styles.headerStyle === 'minimalist' ? { borderColor: styles.secondaryColor } : {}),
              ...(photoPosition === 'left' || photoPosition === 'right' ? { marginTop: '2rem' } : {}),
              ...(photoPosition === 'none' ? { marginTop: '2rem' } : {})
            }}
            data-cv-section={`header-${data.fullName || 'default'}`}
            data-section-type="header"
          >
            {/* Profile photo handling */}
            {data.photoUrl && photoPosition === 'left' && (
              <div 
                className={`flex-shrink-0 w-24 h-24 overflow-hidden mr-4 border shadow-sm ${
                  (data.layout?.photoShape || 'circle') === 'circle'
                    ? 'rounded-full'
                    : (data.layout?.photoShape || 'circle') === 'rounded'
                    ? 'rounded-lg'
                    : 'rounded-none'
                }`}
                style={{ borderColor: styles.secondaryColor }}
              >
                <img 
                  src={data.photoUrl} 
                  alt={data.fullName} 
                  className="w-full h-full object-cover" 
                  style={{
                    objectPosition: `${data.layout?.photoPositionX ?? 50}% ${data.layout?.photoPositionY ?? 50}%`
                  }}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className={photoPosition === 'left' || photoPosition === 'right' ? 'flex-1' : ''}>
              {data.fullName && (
                <h1 className="text-3xl font-bold mb-2">{data.fullName}</h1>
              )}
              {data.title && (
                <p className="text-xl mb-4" style={{ color: styles.secondaryColor }}>{data.title}</p>
              )}
              {/* Contact and social info with enhanced positioning */}
              {data.layout?.socialLinksPosition === 'header-right' ? (
                <div className="flex justify-between items-start">
                  <div style={{ color: styles.secondaryColor }}>
                    {renderContactInfo()}
                  </div>
                  <div style={{ color: styles.secondaryColor }}>
                    {renderSocialLinks()}
                  </div>
                </div>
              ) : data.layout?.socialLinksPosition === 'separate' ? (
                <div style={{ color: styles.secondaryColor }}>
                  {renderContactInfo()}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3" style={{ color: styles.secondaryColor }}>
                  {renderContactInfo()}
                  {data.layout?.socialLinksPosition !== 'below' && renderSocialLinks()}
                </div>
              )}
              {data.layout?.socialLinksPosition === 'below' && (
                <div className="mt-2" style={{ color: styles.secondaryColor }}>
                  {renderSocialLinks()}
                </div>
              )}
            </div>
            {/* Profile photo right position */}
            {data.photoUrl && photoPosition === 'right' && (
              <div 
                className={`flex-shrink-0 w-24 h-24 overflow-hidden ml-4 border shadow-sm ${
                  (data.layout?.photoShape || 'circle') === 'circle'
                    ? 'rounded-full'
                    : (data.layout?.photoShape || 'circle') === 'rounded'
                    ? 'rounded-lg'
                    : 'rounded-none'
                }`}
                style={{ borderColor: styles.secondaryColor }}
              >
                <img 
                  src={data.photoUrl} 
                  alt={data.fullName} 
                  className="w-full h-full object-cover" 
                  style={{
                    objectPosition: `${data.layout?.photoPositionX ?? 50}% ${data.layout?.photoPositionY ?? 50}%`
                  }}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </header>
        )}
        {/* Separate social links section */}
        {data.layout?.socialLinksPosition === 'separate' && (
          <div className="mb-6" style={{ color: styles.secondaryColor }}>
            {renderSocialLinks()}
          </div>
        )}
        {/* Render sections based on sectionOrder */}
        {sectionOrder.map((sectionKey, idx) => {
          if (sectionKey === '<break>') {
            return (
              <div
                key={`break-${idx}`}
                className="cv-page-break-viewer print:hidden"
                style={{ borderTop: '2px dashed #bbb', margin: '2rem 0', textAlign: 'center', color: '#bbb', position: 'relative' }}
              >
                <span style={{ background: '#fff', padding: '0 1rem', position: 'relative', top: '-0.8em', fontSize: '0.9em' }}>Page Break</span>
              </div>
            );
          }
          // Only render sections that have data and are enabled for this page
          if (sectionKey === 'summary' && data.summary && (pageConfig ? pageConfig.showSummary === true : true)) {
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="summary"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('summary', 'Profile')}
                </h2>
                <div className="leading-relaxed" style={{ color: styles.secondaryColor }}>
                  {renderContentWithBreaks([data.summary])}
                </div>
              </section>
            );
          }
          
          if (sectionKey === 'experience' && data.experience && data.experience.length > 0 && (pageConfig ? pageConfig.showExperience === true : true)) {
            const experienceToShow = pageConfig?.experience || data.experience;
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="experience"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('experience', 'Experience')}
                </h2>
                {experienceToShow.map((exp, index) => (
                  <div key={index} className="mb-4">
                    {/* Title and dates on same line - matching PDF */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg" style={{ color: styles.primaryColor }}>{exp.title}</h3>
                      {exp.dates && (
                        <span className="text-sm" style={{ color: styles.secondaryColor }}>{exp.dates}</span>
                      )}
                    </div>
                    {/* Company on separate line - matching PDF */}
                    {exp.company && (
                      <div className="text-sm mb-1" style={{ color: styles.secondaryColor }}>
                        <span className="font-medium">{exp.company}</span>
                      </div>
                    )}
                    {/* Location on separate line if available - matching PDF */}
                    {exp.location && (
                      <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                        {exp.location}
                      </div>
                    )}
                    {(exp.achievements || exp.content) && (
                      <ul className="list-disc pl-6">
                        {(exp.achievements || exp.content || []).map((item: string, i: number) => (
                          <li key={i} className="mb-1" style={{ color: styles.secondaryColor }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
          }
          
          if (sectionKey === 'education' && data.education && data.education.length > 0 && (pageConfig ? pageConfig.showEducation === true : true)) {
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="education"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('education', 'Education')}
                </h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    {/* Degree in Field with dates on right - matching PDF */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg" style={{ color: styles.primaryColor }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      {edu.dates && (
                        <span className="text-sm" style={{ color: styles.secondaryColor }}>{edu.dates}</span>
                      )}
                    </div>
                    {/* Institution on separate line - matching PDF */}
                    {edu.institution && (
                      <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                        <span className="font-medium">{edu.institution}</span>
                      </div>
                    )}
                    {(edu.achievements || edu.content) && (
                      <ul className="list-disc pl-6">
                        {(edu.achievements || edu.content || []).map((item: string, i: number) => (
                          <li key={i} className="mb-1" style={{ color: styles.secondaryColor }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
          }
          
          // Skip skills in main content if they're in sidebar (matching PDF layout)
          if (sectionKey === 'skills' && sidebarPosition === 'none' && data.skills && (Array.isArray(data.skills) ? data.skills.length > 0 : 
            (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + 
            (data.skills.tools?.length || 0) + (data.skills.industry?.length || 0) > 0) && 
            (pageConfig ? pageConfig.showSkills === true : true)) {
            const allSkills = Array.isArray(data.skills) 
              ? data.skills.filter(skill => skill && skill.trim())
              : [
                  ...(data.skills.technical || []),
                  ...(data.skills.soft || []),
                  ...(data.skills.tools || []),
                  ...(data.skills.industry || [])
                ].filter(skill => skill && skill.trim());
            
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="skills"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('skills', 'Skills')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill: any, index: number) => {
                    // Handle both string and object formats for skills
                    const skillText = typeof skill === 'string' 
                      ? skill 
                      : (skill && typeof skill === 'object')
                        ? (skill.name || skill.skill || skill.title || String(skill))
                        : String(skill);
                    
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: styles.accentColor
                            ? `${styles.accentColor}20`
                            : `${styles.primaryColor}20`,
                          color: styles.accentColor || styles.primaryColor,
                        }}
                      >
                        {skillText}
                      </span>
                    );
                  })}
                </div>
              </section>
            );
          }
          
          // Skip languages in main content if they're in sidebar (matching PDF layout)
          if (sectionKey === 'languages' && sidebarPosition === 'none' && data.languages && data.languages.length > 0 && (pageConfig ? pageConfig.showLanguages === true : true)) {
            // Ensure languages is an array
            const languagesArray = Array.isArray(data.languages) ? data.languages : [data.languages];
            
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="languages"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('languages', 'Languages')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {languagesArray.map((language: any, index: number) => {
                    // Handle both string and object formats for languages
                    const languageText = typeof language === 'string' 
                      ? language 
                      : (language && typeof language === 'object')
                        ? `${language.language || language.name || ''}${language.proficiency ? ` (${language.proficiency})` : ''}`.trim()
                        : String(language);
                    
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: styles.accentColor
                            ? `${styles.accentColor}20`
                            : `${styles.primaryColor}20`,
                          color: styles.accentColor || styles.primaryColor,
                        }}
                      >
                        {languageText}
                      </span>
                    );
                  })}
                </div>
              </section>
            );
          }
          
          if (sectionKey === 'certifications' && data.certifications && (pageConfig ? pageConfig.showCertifications === true : true)) {
            // Handle both string and array formats for certifications
            let certificationsToRender: any[] = [];
            
            if (typeof data.certifications === 'string' && data.certifications.trim()) {
              // If it's a string, split by common separators and create array
              const certStrings = data.certifications.split(/[,;|]/).map(cert => cert.trim()).filter(cert => cert);
              certificationsToRender = certStrings.map(cert => ({
                title: cert,
                content: [] // Empty array instead of array with empty string
              }));
            } else if (Array.isArray(data.certifications) && data.certifications.length > 0) {
              // If it's already an array, use it directly
              certificationsToRender = data.certifications;
            }
            
            if (certificationsToRender.length > 0) {
              return (
                <section 
                  key={`${sectionKey}-${idx}`} 
                  className={sectionClasses[styles.sectionStyle || 'minimal']}
                  data-cv-section="certifications"
                  data-section-type="section"
                >
                  <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                    {getSectionTitle('certifications', 'Certifications')}
                  </h2>
                  {certificationsToRender.map((cert, index) => {
                    // If it's a simple string-based certification (from our defensive programming)
                    if (cert.content && cert.content.length === 0) {
                      return (
                        <div key={index} className="mb-4">
                          <h3 className="font-medium text-lg" style={{ color: styles.primaryColor }}>
                            {cert.title}
                          </h3>
                        </div>
                      );
                    }
                    // If it's a complex certification with content (from smart mapping or enhanced sample data)
                    return (
                      <div key={index} className="mb-4">
                        <h3 className="font-medium text-lg mb-1" style={{ color: styles.primaryColor }}>
                          {cert.title}
                        </h3>
                        {(cert.institution || cert.year) && (
                          <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                            {cert.institution && <span className="font-medium">{cert.institution}</span>}
                            {cert.institution && cert.year && <span className="mx-2">•</span>}
                            {cert.year && <span>{cert.year}</span>}
                          </div>
                        )}
                        {cert.content && cert.content.length > 0 && (
                          <ul className="list-disc pl-6">
                            {cert.content.map((item: any, i: number) => (
                              <li key={i} className="mb-1" style={{ color: styles.secondaryColor }}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            }
          }
          
          if (sectionKey === 'projects' && data.projects && (pageConfig ? pageConfig.showProjects === true : true)) {
            // Handle both string and array formats for projects
            let projectsToRender: any[] = [];
            
            if (typeof data.projects === 'string' && data.projects.trim()) {
              // If it's a string, split by common separators and create array
              const projectStrings = data.projects.split(/[,;|]/).map(project => project.trim()).filter(project => project);
              projectsToRender = projectStrings.map(project => ({
                title: project,
                content: [] // Empty array instead of array with empty string
              }));
            } else if (Array.isArray(data.projects) && data.projects.length > 0) {
              // If it's already an array, use it directly
              projectsToRender = data.projects;
            }
            
            if (projectsToRender.length > 0) {
              return (
                <section 
                  key={`${sectionKey}-${idx}`} 
                  className={sectionClasses[styles.sectionStyle || 'minimal']}
                  data-cv-section="projects"
                  data-section-type="section"
                >
                  <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                    {getSectionTitle('projects', 'Projects')}
                  </h2>
                  {projectsToRender.map((project, index) => {
                    // If it's a simple string-based project (from our defensive programming)
                    if (project.content && project.content.length === 0) {
                      return (
                        <div key={index} className="mb-4">
                          <h3 className="font-medium text-lg" style={{ color: styles.primaryColor }}>
                            {project.title}
                          </h3>
                        </div>
                      );
                    }
                    // If it's a complex project with content (from smart mapping or enhanced sample data)
                    return (
                      <div key={index} className="mb-4">
                        <h3 className="font-medium text-lg mb-1" style={{ color: styles.primaryColor }}>
                          {project.title}
                        </h3>
                        {(project.organization || project.startDate || project.endDate) && (
                          <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                            {project.organization && <span className="font-medium">{project.organization}</span>}
                            {project.organization && (project.startDate || project.endDate) && <span className="mx-2">•</span>}
                            {project.startDate && project.endDate && <span>{project.startDate} - {project.endDate}</span>}
                            {project.startDate && !project.endDate && <span>{project.startDate} - Present</span>}
                            {!project.startDate && project.endDate && <span>{project.endDate}</span>}
                          </div>
                        )}
                        {project.content && project.content.length > 0 && (
                          <ul className="list-disc pl-6">
                            {project.content.map((item: any, i: number) => (
                              <li key={i} className="mb-1" style={{ color: styles.secondaryColor }}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            }
          }
          
          // Skip hobbies/interests in main content if they're in sidebar (matching PDF layout)
          if (sectionKey === 'hobbies' && sidebarPosition === 'none' && data.hobbies && data.hobbies.length > 0 && (pageConfig ? pageConfig.showHobbies === true : true)) {
            // Ensure hobbies is an array
            const hobbiesArray = Array.isArray(data.hobbies) ? data.hobbies.filter(hobby => hobby && hobby.trim()) : [data.hobbies];
            
            return (
              <section 
                key={`${sectionKey}-${idx}`} 
                className={sectionClasses[styles.sectionStyle || 'minimal']}
                data-cv-section="hobbies"
                data-section-type="section"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('hobbies', 'Interests & Activities')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hobbiesArray.map((hobby: any, index: number) => {
                    // Handle both string and object formats for hobbies
                    const hobbyText = typeof hobby === 'string' 
                      ? hobby 
                      : (hobby && typeof hobby === 'object')
                        ? (hobby.name || hobby.hobby || hobby.activity || String(hobby))
                        : String(hobby);
                    
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: styles.accentColor
                            ? `${styles.accentColor}15`
                            : `${styles.primaryColor}15`,
                          color: styles.accentColor || styles.primaryColor,
                        }}
                      >
                        {hobbyText}
                      </span>
                    );
                  })}
                </div>
              </section>
            );
          }
          
          return null;
        })}
      </div>
    </div>
  )
}

// Memoize with custom comparison function
const CVPreview = memo(CVPreviewComponent, areEqual);

// Add display name for better debugging
CVPreview.displayName = 'CVPreview'

// Helper to get an array of React section elements for pagination
export function getCVSections(data: CVData, showHeader = true) {
  const template = CV_TEMPLATES.find((t) => t.id === data.template) || CV_TEMPLATES[0]
  const styles = {
    ...template.styles,
    accentColor: data.layout?.accentColor || template.styles.accentColor
  }
  const sectionOrder = data.layout?.sectionOrder || [
    'summary',
    'experience',
    'education',
    'skills',
    'languages',
    'certifications',
    'projects',
    'hobbies'
  ];
  const sections: React.ReactNode[] = [];
  // Header
  if (showHeader) {
    sections.push(
      <header key={`header-${data.fullName || 'default'}`} className="cv-header print-avoid-break">
        {/* ...header rendering logic from the main component... */}
      </header>
    );
  }
  // Sections
  sectionOrder.forEach((section) => {
    // ...logic to push each CVSection as a React element...
  });
  return sections;
}

export { CVPreview } 