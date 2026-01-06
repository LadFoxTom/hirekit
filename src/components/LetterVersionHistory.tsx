'use client'

import React, { useState } from 'react'
import { FaHistory, FaEye, FaUndo, FaClock, FaEdit } from 'react-icons/fa'
import { LetterVersion } from '@/types/letter'
import { useModalContext } from '@/components/providers/ModalProvider'

interface LetterVersionHistoryProps {
  versions: LetterVersion[]
  currentVersion: number
  onVersionSelect: (version: number) => void
  onRevertToVersion: (version: number) => void
}

const LetterVersionHistory: React.FC<LetterVersionHistoryProps> = ({
  versions,
  currentVersion,
  onVersionSelect,
  onRevertToVersion
}) => {
  const { showConfirm } = useModalContext()
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  const getVersionLabel = (version: LetterVersion) => {
    if (version.isInitialDraft) return 'Initial Draft'
    if (version.editRequest) return `Edit: ${version.editRequest.substring(0, 30)}...`
    return `Version ${version.version}`
  }

  const handleVersionClick = (version: number) => {
    setSelectedVersion(version)
    onVersionSelect(version)
  }

  const handleRevert = async (version: number) => {
    const confirmed = await showConfirm('Are you sure you want to revert to this version? This will replace your current letter.', 'Revert to Version')
    if (confirmed) {
      onRevertToVersion(version)
    }
  }

  if (versions.length <= 1) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <FaHistory className="text-gray-400 text-2xl mx-auto mb-2" />
        <p className="text-sm text-gray-600">No version history yet</p>
        <p className="text-xs text-gray-500">Changes will appear here as you edit your letter</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              showDiff 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaEye className="mr-1" />
            {showDiff ? 'Hide' : 'Show'} Diff
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.version}
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              version.version === currentVersion
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleVersionClick(version.version)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaClock className="text-gray-400 text-sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getVersionLabel(version)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(version.timestamp)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {version.version !== currentVersion && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRevert(version.version)
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Revert to this version"
                  >
                    <FaUndo className="text-xs" />
                  </button>
                )}
                {version.version === currentVersion && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Current
                  </span>
                )}
              </div>
            </div>

            {version.editRequest && (
              <p className="text-xs text-gray-600 mt-1">
                "{version.editRequest}"
              </p>
            )}

            {showDiff && selectedVersion === version.version && version.explanation && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>Changes:</strong> {version.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center">
        Click on a version to preview it. Use the revert button to restore a previous version.
      </div>
    </div>
  )
}

export default LetterVersionHistory 