import type { FC } from 'react'
import type { CVData } from '@/types/cv'
import { CV_TEMPLATES } from '@/types/cv'
import { 
  FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaInstagram, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaUserTie, FaInfoCircle, FaBriefcase, FaBuilding, FaHistory, FaChartLine, FaGraduationCap, FaBook, FaSchool, FaUniversity, FaTools, FaCogs, FaCode, FaCheck, FaLanguage, FaCommentDots, FaCertificate, FaAward, FaTrophy, FaMedal, FaProjectDiagram, FaFolder, FaTasks, FaHeart, FaSmile, FaHiking, FaMusic, FaCamera
} from 'react-icons/fa'
import { memo } from 'react'

interface CVPreviewServerProps {
  data: CVData
  isPreview?: boolean
}

// Server-side version of CVPreview without client-side dependencies
const CVPreviewServer: FC<CVPreviewServerProps> = memo(({ data, isPreview = false }) => {
  const template = CV_TEMPLATES.find((t) => t.id === data.template) || CV_TEMPLATES[0]
  const styles = {
    ...template.styles,
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
  
  const photoPosition = data.layout?.photoPosition || 'none'
  const showIcons = data.layout?.showIcons !== undefined ? data.layout.showIcons : true
  const sidebarPosition = data.layout?.sidebarPosition || 'none';

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
  
  const sectionOrder = baseSectionOrder.filter(sectionId => 
    !data.layout?.hiddenSections?.includes(sectionId)
  )

  const fontFamily = data.layout?.fontFamily || template.styles.fontFamily
  
  // Get the font class name from the font family
  const getFontClass = (fontFamily: string) => {
    if (fontFamily.includes('Inter')) return 'font-inter'
    if (fontFamily.includes('Roboto')) return 'font-roboto'
    if (fontFamily.includes('Poppins')) return 'font-poppins'
    if (fontFamily.includes('Montserrat')) return 'font-montserrat'
    if (fontFamily.includes('Open Sans')) return 'font-open-sans'
    if (fontFamily.includes('DM Sans')) return 'font-dm-sans'
    if (fontFamily.includes('Merriweather')) return 'font-merriweather'
    if (fontFamily.includes('Playfair Display')) return 'font-playfair'
    if (fontFamily.includes('Crimson Text')) return 'font-crimson'
    if (fontFamily.includes('Lora')) return 'font-lora'
    if (fontFamily.includes('Nunito')) return 'font-nunito'
    if (fontFamily.includes('Quicksand')) return 'font-quicksand'
    if (fontFamily.includes('JetBrains Mono')) return 'font-jetbrains'
    if (fontFamily.includes('Source Code Pro')) return 'font-source-code'
    if (fontFamily.includes('Fira Code')) return 'font-fira-code'
    return 'font-inter' // default
  }
  
  const fontClass = getFontClass(fontFamily)

  const getSectionTitle = (sectionKey: string, defaultTitle: string) =>
    data.layout?.sectionTitles?.[sectionKey] || defaultTitle

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
          {items.map((item, i) => (
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
          {items.map((item, i) => (
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
          {items.map((item, i) => (
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
          {items.map((item, i) => (
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
          {items.map((item, i) => (
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

    const display = (layout as any).socialDisplay || 'inline'
    const alignment = (layout as any).socialAlignment || 'left'
    const spacing = (layout as any).socialSpacing || 'normal'
    const showSocialIcons = (layout as any).socialIcons !== undefined ? (layout as any).socialIcons : showIcons

    // Spacing classes
    const spacingClasses: Record<string, string> = {
      tight: 'gap-2',
      normal: 'gap-3',
      spread: 'gap-6'
    }

    // Alignment classes
    const alignmentClasses: Record<string, string> = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      justify: 'justify-between'
    }

    if (display === 'stacked') {
      return (
        <div className={`flex flex-col ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <span key={i} className="flex items-center text-sm">
              {showSocialIcons && <link.icon className="inline-block mr-2 text-sm" />}
              <span>{link.label}</span>
            </span>
          ))}
        </div>
      )
    } else {
      // inline (default)
      return (
        <div className={`flex flex-wrap items-center text-sm ${spacingClasses[spacing]} ${alignmentClasses[alignment]}`}>
          {links.map((link, i) => (
            <span key={i} className="flex items-center">
              {showSocialIcons && <link.icon className="inline-block mr-2 text-sm" />}
              <span>{link.label}</span>
            </span>
          ))}
        </div>
      )
    }
  }

  const renderContentWithBreaks = (content: string[]) => {
    return content.map((text, index) => (
      <p key={index} className="mb-2">{text}</p>
    ))
  }

  return (
    <div
      data-testid="cv-preview"
      className={`bg-white p-6 shadow-lg rounded-lg cv-print-container a4-page ${fontClass}${sidebarPosition !== 'none' ? ' flex' : ''}`}
      style={{
        '--spacing': styles.spacing,
        color: styles.primaryColor,
        backgroundColor: styles.backgroundColor || 'white',
        maxWidth: '100%',
        minWidth: '0',
        overflow: 'hidden'
      } as React.CSSProperties}
    >
      {sidebarPosition !== 'none' && (
        <aside
          className={`sidebar-${sidebarPosition} print:static`}
          style={{
            minWidth: 220,
            maxWidth: 280,
            background: '#f8fafc',
            padding: '2rem 1.5rem',
            marginRight: sidebarPosition === 'left' ? '2rem' : 0,
            marginLeft: sidebarPosition === 'right' ? '2rem' : 0,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 0 0 1px #e5e7eb',
          }}
        >
          {data.photoUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 shadow-md mb-4" style={{ borderColor: styles.primaryColor }}>
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
              />
            </div>
          )}
          {data.fullName && <h1 className="text-xl font-bold mb-1 text-center">{data.fullName}</h1>}
          {data.title && <p className="text-base mb-3 text-center" style={{ color: styles.secondaryColor }}>{data.title}</p>}
          <div className="mb-3 w-full text-sm text-gray-600">
            {renderContactInfo()}
          </div>
          {data.layout?.socialLinksPosition !== 'separate' && (
            <div className="w-full text-sm text-gray-600">
              {renderSocialLinks()}
            </div>
          )}
        </aside>
      )}
      <div className={sidebarPosition !== 'none' ? 'flex-1' : ''}>
        {/* Header with optional profile photo */}
        {sidebarPosition === 'none' && (
          <header
            className={`mb-8 ${headerClasses[styles.headerStyle || 'left-aligned']} ${photoPosition === 'left' || photoPosition === 'right' ? 'flex items-center gap-4' : ''}`}
            style={{
              ...(styles.headerStyle === 'modern' ? { borderColor: styles.primaryColor } : {}),
              ...(styles.headerStyle === 'minimalist' ? { borderColor: styles.secondaryColor } : {}),
              ...(photoPosition === 'left' || photoPosition === 'right' ? { marginTop: '2rem' } : {}),
              ...(photoPosition === 'none' ? { marginTop: '2rem' } : {})
            }}
          >
            {data.photoUrl && photoPosition === 'left' && (
              <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden mr-4 border shadow-sm" style={{ borderColor: styles.secondaryColor }}>
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
              <div className="flex flex-wrap gap-3" style={{ color: styles.secondaryColor }}>
                {renderContactInfo()}
                {data.layout?.socialLinksPosition !== 'below' && renderSocialLinks()}
              </div>
            </div>
            {data.photoUrl && photoPosition === 'right' && (
              <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden ml-4 border shadow-sm" style={{ borderColor: styles.secondaryColor }}>
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
                />
              </div>
            )}
          </header>
        )}
        
        {/* Render sections */}
        {sectionOrder.map((sectionKey, idx) => {
          if (sectionKey === 'summary' && data.summary) {
            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('summary', 'Professional Summary')}
                </h2>
                <div className="leading-relaxed" style={{ color: styles.secondaryColor }}>
                  {renderContentWithBreaks([data.summary])}
                </div>
              </section>
            );
          }
          
          if (sectionKey === 'experience' && data.experience && data.experience.length > 0) {
            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('experience', 'Experience')}
                </h2>
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-lg mb-1" style={{ color: styles.primaryColor }}>{exp.title}</h3>
                    {(exp.company || exp.dates) && (
                      <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                        {exp.company && <span className="font-medium">{exp.company}</span>}
                        {exp.company && exp.dates && <span className="mx-2">•</span>}
                        {exp.dates && <span>{exp.dates}</span>}
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
          
          if (sectionKey === 'education' && data.education && data.education.length > 0) {
            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('education', 'Education')}
                </h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-lg mb-1" style={{ color: styles.primaryColor }}>{edu.degree}</h3>
                    {(edu.institution || edu.dates || edu.field) && (
                      <div className="text-sm mb-2" style={{ color: styles.secondaryColor }}>
                        {edu.institution && <span className="font-medium">{edu.institution}</span>}
                        {edu.institution && edu.dates && <span className="mx-2">•</span>}
                        {edu.dates && <span>{edu.dates}</span>}
                        {edu.dates && edu.field && <span className="mx-2">•</span>}
                        {edu.field && <span>{edu.field}</span>}
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
          
          if (sectionKey === 'skills' && data.skills && (Array.isArray(data.skills) ? data.skills.length > 0 : 
            (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + 
            (data.skills.tools?.length || 0) + (data.skills.industry?.length || 0) > 0)) {
            const allSkills = Array.isArray(data.skills) 
              ? data.skills 
              : [
                  ...(data.skills.technical || []),
                  ...(data.skills.soft || []),
                  ...(data.skills.tools || []),
                  ...(data.skills.industry || [])
                ];

            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('skills', 'Skills')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill, index) => (
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
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          
          if (sectionKey === 'languages' && data.languages && data.languages.length > 0) {
            // Ensure languages is an array
            const languagesArray = Array.isArray(data.languages) ? data.languages.filter(lang => lang && lang.trim()) : [data.languages];
            
            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('languages', 'Languages')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {languagesArray.map((language: any, index: number) => (
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
                      {language}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          
          if (sectionKey === 'certifications' && data.certifications) {
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
                <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
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
                      <div key={index} className="mb-4 print-avoid-break">
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
                          <ul className="list-disc pl-6 print-avoid-break">
                            {cert.content.map((item: string, i: number) => (
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
          
          if (sectionKey === 'projects' && data.projects) {
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
                <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
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
                      <div key={index} className="mb-4 print-avoid-break">
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
                          <ul className="list-disc pl-6 print-avoid-break">
                            {project.content.map((item: string, i: number) => (
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
          
          if (sectionKey === 'hobbies' && data.hobbies && data.hobbies.length > 0) {
            // Ensure hobbies is an array
            const hobbiesArray = Array.isArray(data.hobbies) ? data.hobbies.filter(hobby => hobby && hobby.trim()) : [data.hobbies];
            
            return (
              <section key={sectionKey} className={sectionClasses[styles.sectionStyle || 'minimal']}>
                <h2 className="text-xl font-semibold mb-3 flex items-center" style={{ color: styles.primaryColor }}>
                  {getSectionTitle('hobbies', 'Hobbies & Interests')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hobbiesArray.map((hobby, index) => (
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
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          
          return null;
        })}
      </div>
    </div>
  )
})

CVPreviewServer.displayName = 'CVPreviewServer'

export { CVPreviewServer } 