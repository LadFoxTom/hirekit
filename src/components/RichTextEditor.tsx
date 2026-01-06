'use client'

import { FC, useMemo } from 'react'
import dynamic from 'next/dynamic'
import '@/styles/quill.css'

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  section?: 'summary' | 'experience' | 'education' | 'skills'
}

export const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  section = 'summary'
}) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: section === 'summary' ? [2, 3, false] : [3, false] }],
        ['bold', 'italic', 'underline'],
        section !== 'skills' ? [{ list: 'bullet' }, { list: 'ordered' }] : [],
        section === 'summary' ? ['link'] : [],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }), [section])

  const formats = useMemo(() => [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    ...(section === 'summary' ? ['link'] : []),
  ], [section])

  const getPlaceholder = () => {
    switch (section) {
      case 'summary':
        return 'Write a compelling professional summary...'
      case 'experience':
        return 'Describe your work experience...'
      case 'education':
        return 'List your educational background...'
      case 'skills':
        return 'List your key skills (one per line)...'
      default:
        return placeholder
    }
  }

  const handleChange = (content: string) => {
    // For skills section, ensure each skill is on a new line
    if (section === 'skills') {
      const cleanContent = content
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<br\/?>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .trim()
      onChange(cleanContent)
    } else {
      onChange(content)
    }
  }

  return (
    <div className="quill" data-section={section}>
      <QuillEditor
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={getPlaceholder()}
        theme="snow"
      />
    </div>
  )
} 