'use client'

import React from 'react'

type SectionStyleType = 'boxed' | 'underlined' | 'minimal' | 'card' | 'gradient';

interface SectionContentProps {
  title: string
  content: string[]
  sectionStyle: SectionStyleType
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  icon?: React.ReactNode
}

// This component extracts the section rendering logic from CVPreview component
const CVSection: React.FC<SectionContentProps> = ({
  title,
  content,
  sectionStyle,
  primaryColor,
  secondaryColor,
  accentColor,
  icon
}) => {
  // Section styles from the parent component
  const sectionClasses: Record<SectionStyleType, string> = {
    boxed: 'border rounded-lg p-4 mb-4',
    underlined: 'border-b pb-4 mb-4',
    minimal: 'mb-6',
    card: 'bg-white shadow-lg rounded-lg p-4 mb-4',
    gradient: 'bg-gradient-to-br from-white to-gray-50 p-4 mb-4 rounded-lg'
  }

  return (
    <div className={sectionClasses[sectionStyle || 'minimal'] + ' print-avoid-break'}>
      <h3
        className="font-medium mb-1 text-lg flex items-center print-avoid-break"
        style={{ color: primaryColor }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      <ul className="space-y-2 print-avoid-break">
        {(Array.isArray(content) ? content : []).map((item, i) => {
          // Check if this is a section header like "Key Responsibilities:" or "Key Achievements:"
          if (item.toLowerCase().includes('key responsibilities') || 
              item.toLowerCase().includes('key achievements') ||
              item.toLowerCase().includes('coursework') ||
              item.toLowerCase().includes('honors') ||
              item.toLowerCase().includes('key features') ||
              item.toLowerCase().includes('technologies') ||
              item.toLowerCase().includes('results') ||
              item.toLowerCase().includes('skills gained')) {
            return (
              <li
                key={i}
                className="flex mt-3 mb-1"
              >
                <span className="font-semibold w-full" style={{ color: primaryColor }}>
                  {item}
                </span>
              </li>
            );
          }
          
          // Regular bullet point
          return (
            <li
              key={i}
              className="flex"
              style={{ color: secondaryColor }}
            >
              <span className="mr-2">•</span>
              <span className="flex-1">{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default CVSection 