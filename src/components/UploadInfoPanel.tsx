import React, { useRef, useState } from 'react';
import PDFUploader from './PDFUploader';
import { FaFilePdf, FaFileAlt, FaTrash, FaPaste, FaCheckCircle } from 'react-icons/fa';

type UploadInfo = {
  cvFile?: any;
  jobFile?: any;
  pastedText?: string;
};

interface UploadInfoPanelProps {
  uploadInfo: UploadInfo;
  setUploadInfo: (info: UploadInfo) => void;
  onCvExtracted: (data: any) => void;
}

const UploadInfoPanel: React.FC<UploadInfoPanelProps> = ({ uploadInfo, setUploadInfo, onCvExtracted }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [jobTab, setJobTab] = useState<'upload' | 'paste'>('upload');

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Information</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your CV, a job description, or paste relevant information to help the assistant tailor your CV and advice.
          </p>
        </div>

        {/* Upload Sections Grid */}
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {/* CV PDF Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-3">
                <FaFilePdf className="text-red-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upload your CV (PDF)</h3>
            </div>
            
            {uploadInfo.cvFile ? (
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                <span className="text-gray-900 font-medium flex-1 truncate">
                  {uploadInfo.cvFile.name || 'CV.pdf'}
                </span>
                <button 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setUploadInfo({ ...uploadInfo, cvFile: undefined })}
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ) : (
              <PDFUploader 
                title="Upload your CV (PDF)"
                onPDFDataExtracted={data => {
                  setUploadInfo({ ...uploadInfo, cvFile: { name: 'CV.pdf', ...data } });
                  onCvExtracted(data);
                }} 
              />
            )}
          </div>

          {/* Job Description Upload or Paste */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                  <FaFileAlt className="text-blue-600 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
              </div>
              
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    jobTab === 'upload' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setJobTab('upload')}
                >
                  Upload PDF
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    jobTab === 'paste' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setJobTab('paste')}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {jobTab === 'upload' ? (
              uploadInfo.jobFile ? (
                <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg border border-green-200">
                  <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                  <span className="text-gray-900 font-medium flex-1 truncate">
                    {uploadInfo.jobFile.name || 'JobDescription.pdf'}
                  </span>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => setUploadInfo({ ...uploadInfo, jobFile: undefined })}
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ) : (
                <PDFUploader 
                  title="Upload Job Description (PDF)"
                  onPDFDataExtracted={data => {
                    setUploadInfo({ ...uploadInfo, jobFile: { name: 'JobDescription.pdf', ...data } });
                  }} 
                />
              )
            ) : (
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-green-700">
                  <FaPaste className="mr-2" />
                  Paste Job Description or Info
                </div>
                <textarea
                  ref={textAreaRef}
                  className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Paste job description, requirements, or other relevant info here..."
                  value={uploadInfo.pastedText || ''}
                  onChange={e => setUploadInfo({ ...uploadInfo, pastedText: e.target.value })}
                />
                {uploadInfo.pastedText && (
                  <button 
                    className="text-sm text-gray-500 hover:text-red-600 underline"
                    onClick={() => setUploadInfo({ ...uploadInfo, pastedText: '' })}
                  >
                    Clear pasted text
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">Summary of Uploaded Information</h4>
          <div className="space-y-2">
            {uploadInfo.cvFile && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-green-700">CV uploaded:</span>
                <span className="ml-2 text-gray-700">{uploadInfo.cvFile.name || 'CV.pdf'}</span>
              </div>
            )}
            {uploadInfo.jobFile && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-blue-700">Job description uploaded:</span>
                <span className="ml-2 text-gray-700">{uploadInfo.jobFile.name || 'JobDescription.pdf'}</span>
              </div>
            )}
            {uploadInfo.pastedText && (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-green-700">Pasted info:</span>
                <span className="ml-2 text-gray-700">
                  {uploadInfo.pastedText.slice(0, 80)}{uploadInfo.pastedText.length > 80 ? '...' : ''}
                </span>
              </div>
            )}
            {!uploadInfo.cvFile && !uploadInfo.jobFile && !uploadInfo.pastedText && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                No information uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInfoPanel; 