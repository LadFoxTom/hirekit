'use client';

import React, { useState } from 'react';

type Props = {
  data: any;
  onClose: () => void;
};

const PDFPreviewClient: React.FC<Props> = ({ data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [PDFModal, setPDFModal] = useState<React.ComponentType<any> | null>(null);

  const loadPDFModal = async () => {
    setIsLoading(true);
    try {
      const { PDFViewer, PDFDownloadLink } = await import('@react-pdf/renderer');
      const CVPdfDocument = (await import('./CVPdfDocument')).default;
      
      const PDFModalComponent = ({ data, onClose }: { data: any; onClose: () => void }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <span className="font-semibold text-lg">PDF Preview</span>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">Close</button>
            </div>
            <div className="flex-1 overflow-hidden p-2 sm:p-4">
              <PDFViewer width="100%" height="100%">
                <CVPdfDocument data={data} />
              </PDFViewer>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end flex-shrink-0">
              <PDFDownloadLink document={<CVPdfDocument data={data} />} fileName="cv.pdf">
                {({ loading }: { loading: boolean }) => (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      );
      
      setPDFModal(() => PDFModalComponent);
    } catch (error) {
      console.error('Failed to load PDF components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load PDF modal when component mounts
  React.useEffect(() => {
    loadPDFModal();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <span className="font-semibold text-lg">PDF Preview</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">Close</button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Loading PDF preview...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!PDFModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <span className="font-semibold text-lg">PDF Preview</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">Close</button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Failed to load PDF preview</div>
          </div>
        </div>
      </div>
    );
  }

  return <PDFModal data={data} onClose={onClose} />;
};

export default PDFPreviewClient; 