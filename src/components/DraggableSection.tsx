'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SectionMeasurement } from '@/hooks/useSectionMeasurement'
import { FaGripVertical, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'

interface DraggableSectionProps {
  section: SectionMeasurement
  index: number
  onEdit?: (sectionId: string) => void
  onAddPageBreak?: (sectionId: string) => void
  onRemovePageBreak?: (sectionId: string) => void
  isOverlay?: boolean
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  onEdit,
  onAddPageBreak,
  onRemovePageBreak,
  isOverlay = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(section.id)
  }

  const handleAddPageBreak = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddPageBreak?.(section.id)
  }

  const handleRemovePageBreak = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemovePageBreak?.(section.id)
  }

  if (isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border-2 border-blue-300 rounded-lg shadow-lg p-3 cursor-grabbing"
      >
        <div className="flex items-center space-x-2">
          <FaGripVertical className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <div className="font-medium text-sm">{section.id}</div>
            <div className="text-xs text-gray-500 truncate">
              {section.content.substring(0, 50)}...
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(section.height)}px
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border-2 border-transparent hover:border-blue-300 rounded-lg p-3 transition-all ${
        isDragging ? 'shadow-lg bg-blue-50' : 'bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
        >
          <FaGripVertical className="w-4 h-4" />
        </div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-gray-800">
              {section.id}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              section.type === 'header' ? 'bg-blue-100 text-blue-700' :
              section.type === 'break' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {section.type}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 truncate mt-1">
            {section.content.substring(0, 100)}
            {section.content.length > 100 && '...'}
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-400">
              {Math.round(section.height)}px
            </span>
            {section.type === 'break' && (
              <span className="text-xs text-yellow-600 font-medium">
                Page Break
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && section.type !== 'break' && (
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Edit section"
            >
              <FaEdit className="w-3 h-3" />
            </button>
          )}
          
          {onAddPageBreak && section.type !== 'break' && (
            <button
              onClick={handleAddPageBreak}
              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
              title="Add page break after"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          )}
          
          {onRemovePageBreak && section.type === 'break' && (
            <button
              onClick={handleRemovePageBreak}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Remove page break"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}