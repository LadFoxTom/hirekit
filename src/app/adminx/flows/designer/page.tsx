'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import QuestionFlowDesigner from '@/components/QuestionFlowDesigner';
import { useFlowStore } from '@/stores/flowStore';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';

export default function FlowDesignerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentFlow, saveFlow, createNewFlow } = useFlowStore();
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [flowData, setFlowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const flowId = searchParams?.get('flowId');
  const viewMode = searchParams?.get('view') === 'true';

  useEffect(() => {
    const loadFlow = async () => {
      setLoading(true);
      try {
        if (flowId) {
          // Always try to load from database first
          const response = await fetch(`/api/flows?id=${flowId}`);
          if (response.ok) {
            const flow = await response.json();
            console.log('Loaded flow from database:', flow);
            setFlowData(flow.data);
          } else {
            // Fall back to static data if not found in database
            console.log('Flow not found in database, using static template');
            if (flowId === 'basic_cv_flow') {
              setFlowData(BASIC_CV_FLOW);
            } else if (flowId === 'advanced_cv_flow') {
              setFlowData(ADVANCED_CV_FLOW);
            } else {
              toast.error('Flow not found');
              router.push('/adminx/flows');
              return;
            }
          }
        } else {
          // Create new flow
          setFlowData({
            id: '',
            name: 'New Flow',
            description: '',
            nodes: [],
            edges: []
          });
        }
        setIsDesignerOpen(true);
      } catch (error) {
        console.error('Error loading flow:', error);
        toast.error('Failed to load flow');
        router.push('/adminx/flows');
      } finally {
        setLoading(false);
      }
    };

    loadFlow();
  }, [flowId, router]);

  const handleFlowUpdate = async (flow: any) => {
    try {
      // Update the current flow in the store first
      setFlowData(flow);
      await saveFlow();
      toast.success('Flow saved successfully!');
      setIsDesignerOpen(false);
      router.push('/adminx/flows');
    } catch (error) {
      console.error('Failed to save flow:', error);
      toast.error('Failed to save flow');
    }
  };

  const handleClose = () => {
    setIsDesignerOpen(false);
    router.push('/adminx/flows');
  };

  if (loading) {
    return (
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading flow...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
      <div className="px-4 py-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Flow Designer</h1>
        <p className="mt-1 text-sm text-gray-600">
          {flowData ? `Editing: ${flowData.name}` : 'Create and edit conversation flows with drag-and-drop interface'}
        </p>
        
        {isDesignerOpen && flowData && (
          <QuestionFlowDesigner
            questions={flowData.nodes || []}
            existingFlow={flowData}
            onFlowUpdate={handleFlowUpdate}
            onClose={handleClose}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}