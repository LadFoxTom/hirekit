'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Search,
  AlertCircle,
  CheckCircle,
  Wrench,
  FileText,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Flow {
  id: string;
  name: string;
  description?: string;
  data: any;
  isActive: boolean;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FlowAnalysis {
  flowId: string;
  flowName: string;
  hasData: boolean;
  dataType: string;
  dataKeys: string[];
  hasNodes: boolean;
  hasEdges: boolean;
  nodeCount: number;
  edgeCount: number;
  nodesStructure: Array<{
    id: string;
    type: string;
    hasData: boolean;
    dataKeys: string[];
  }>;
  rawData: any;
}

export default function FlowDiagnosePage() {
  const router = useRouter();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [analysis, setAnalysis] = useState<FlowAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/flows');
      if (response.ok) {
        const data = await response.json();
        setFlows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading flows:', error);
      toast.error('Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  const diagnoseFlow = async (flowId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/flows/diagnose?flowId=${flowId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
        setSelectedFlow(flows.find(f => f.id === flowId) || null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to diagnose flow');
      }
    } catch (error) {
      console.error('Error diagnosing flow:', error);
      toast.error('Failed to diagnose flow');
    } finally {
      setLoading(false);
    }
  };

  const fixFlowStructure = async (flowId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/flows/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flowId: flowId,
          action: 'fix_structure'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        // Reload analysis
        await diagnoseFlow(flowId);
        // Reload flows
        await loadFlows();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to fix flow structure');
      }
    } catch (error) {
      console.error('Error fixing flow:', error);
      toast.error('Failed to fix flow structure');
    } finally {
      setLoading(false);
    }
  };

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flow.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (analysis: FlowAnalysis) => {
    if (analysis.hasNodes && analysis.hasEdges && analysis.nodeCount > 0) {
      return 'text-green-600';
    } else if (analysis.hasData) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  };

  const getStatusIcon = (analysis: FlowAnalysis) => {
    if (analysis.hasNodes && analysis.hasEdges && analysis.nodeCount > 0) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (analysis.hasData) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/adminx/flows')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Back to Flow Management"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Wrench className="w-8 h-8 text-blue-600 mr-3" />
                  Flow Diagnostics
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Diagnose and fix flow data structure issues
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flows List */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Available Flows</h2>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search flows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFlows.map((flow) => (
                    <motion.div
                      key={flow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedFlow?.id === flow.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => diagnoseFlow(flow.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{flow.name}</h3>
                          <p className="text-sm text-gray-600">ID: {flow.id}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analysis?.flowId === flow.id && getStatusIcon(analysis)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              diagnoseFlow(flow.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Diagnose flow"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Flow Analysis</h2>
            </div>
            
            <div className="p-6">
              {!analysis ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select a flow to analyze its structure</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Flow Info */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Flow Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Name:</span>
                          <p className="text-gray-900">{analysis.flowName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">ID:</span>
                          <p className="text-gray-900 font-mono">{analysis.flowId}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Data Type:</span>
                          <p className="text-gray-900">{analysis.dataType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Has Data:</span>
                          <p className={getStatusColor(analysis)}>
                            {analysis.hasData ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Structure Analysis */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Structure Analysis</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Has Nodes:</span>
                          <p className={analysis.hasNodes ? 'text-green-600' : 'text-red-600'}>
                            {analysis.hasNodes ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Node Count:</span>
                          <p className="text-gray-900">{analysis.nodeCount}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Has Edges:</span>
                          <p className={analysis.hasEdges ? 'text-green-600' : 'text-red-600'}>
                            {analysis.hasEdges ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Edge Count:</span>
                          <p className="text-gray-900">{analysis.edgeCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Keys */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Data Structure</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Data Keys:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {analysis.dataKeys.length > 0 ? (
                            analysis.dataKeys.map((key) => (
                              <span
                                key={key}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                              >
                                {key}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No data keys found</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node Structure */}
                  {analysis.nodesStructure.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Node Structure</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {analysis.nodesStructure.slice(0, 5).map((node) => (
                            <div key={node.id} className="flex items-center justify-between text-sm">
                              <div>
                                <span className="font-medium text-gray-900">{node.id}</span>
                                <span className="ml-2 text-gray-600">({node.type})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {node.hasData ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-xs text-gray-500">
                                  {node.dataKeys.length} keys
                                </span>
                              </div>
                            </div>
                          ))}
                          {analysis.nodesStructure.length > 5 && (
                            <p className="text-xs text-gray-500">
                              ... and {analysis.nodesStructure.length - 5} more nodes
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Actions</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => fixFlowStructure(analysis.flowId)}
                        disabled={loading || (analysis.hasNodes && analysis.hasEdges)}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          loading || (analysis.hasNodes && analysis.hasEdges)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        {loading ? 'Fixing...' : 'Fix Structure'}
                      </button>
                      <button
                        onClick={() => router.push(`/adminx/flows/designer?flowId=${analysis.flowId}`)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <GitBranch className="w-4 h-4 mr-2" />
                        Edit Flow
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
