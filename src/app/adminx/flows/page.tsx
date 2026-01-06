'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  GitBranch,
  Calendar,
  User,
  Clock,
  FileText,
  Globe,
  Power,
  PowerOff,
  RefreshCw,
  Link,
  ExternalLink,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useModalContext } from '@/components/providers/ModalProvider';

interface Flow {
  id: string;
  name: string;
  description?: string;
  data: any;
  isActive: boolean;
  isDefault: boolean;
  flowType?: 'basic' | 'advanced' | 'custom';
  targetUrl?: string;
  isLive: boolean;
  version: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  nodeCount?: number;
  edgeCount?: number;
}

export default function FlowManagementPage() {
  const router = useRouter();
  const { showConfirm } = useModalContext();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingFlow, setEditingFlow] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  useEffect(() => {
    loadFlows();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/flows');
      let flows = [];
      
      if (response.ok) {
        const data = await response.json();
        flows = Array.isArray(data) ? data : [];
      }
      
      // Add template flows only if they don't exist in the database
      const existingFlowIds = flows.map(f => f.id);
      
      // Only add basic_cv_flow if it doesn't exist in the database
      if (!existingFlowIds.includes('basic_cv_flow')) {
        flows.push({
          id: 'basic_cv_flow',
          name: 'Basic CV Builder Flow',
          description: 'Complete basic CV builder flow with essential questions for quick CV creation',
          data: BASIC_CV_FLOW,
          flowType: 'basic',
          targetUrl: '/quick-cv',
          isLive: true,
          version: '1.0.0',
          nodeCount: BASIC_CV_FLOW.nodes.length,
          edgeCount: BASIC_CV_FLOW.edges.length,
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'System'
        });
      }
      
      // Only add advanced_cv_flow if it doesn't exist in the database
      if (!existingFlowIds.includes('advanced_cv_flow')) {
        flows.push({
          id: 'advanced_cv_flow',
          name: 'Advanced CV Builder Flow',
          description: 'Comprehensive advanced CV builder flow with detailed questions, conditional branching, and optimization features',
          data: ADVANCED_CV_FLOW,
          flowType: 'advanced',
          targetUrl: '/builder',
          isLive: true,
          version: '1.0.0',
          nodeCount: ADVANCED_CV_FLOW.nodes.length,
          edgeCount: ADVANCED_CV_FLOW.edges.length,
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'System'
        });
      }
      
      setFlows(flows);
    } catch (error) {
      console.error('Error loading flows:', error);
      toast.error('Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlow = async (flowId: string, flowName: string) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${flowName}"? This action cannot be undone.`,
      'Delete Flow'
    );
    
    if (confirmed) {
      try {
        const response = await fetch(`/api/flows?id=${flowId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Flow deleted successfully');
          loadFlows();
        } else {
          toast.error('Failed to delete flow');
        }
      } catch (error) {
        console.error('Error deleting flow:', error);
        toast.error('Failed to delete flow');
      }
    }
  };

  const handleEditFlow = (flowId: string) => {
    router.push(`/adminx/flows/designer?flowId=${flowId}`);
  };

  const handleViewFlow = (flowId: string) => {
    router.push(`/adminx/flows/designer?flowId=${flowId}&view=true`);
  };

  const handleStartRename = (flow: Flow) => {
    setEditingFlow(flow.id);
    setEditingName(flow.name);
    setOpenDropdown(null);
  };

  const handleCancelRename = () => {
    setEditingFlow(null);
    setEditingName('');
  };

  const handleSaveRename = async (flowId: string) => {
    if (!editingName.trim()) {
      toast.error('Flow name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/flows', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: flowId,
          name: editingName.trim()
        })
      });

      if (response.ok) {
        toast.success('Flow renamed successfully');
        setEditingFlow(null);
        setEditingName('');
        loadFlows(); // Reload flows to show updated name
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to rename flow');
      }
    } catch (error) {
      console.error('Error renaming flow:', error);
      toast.error('Failed to rename flow');
    }
  };

  const handleSetAsLive = async (flowId: string, flowName: string, targetUrl: string) => {
    const builderName = targetUrl === '/quick-cv' ? 'Quick CV Builder' : 
                       targetUrl === '/builder' ? 'Advanced CV Builder' : 
                       targetUrl;
    
    const currentFlow = flows.find(f => f.id === flowId);
    const isCurrentlyLive = currentFlow?.isLive || false;
    
    const action = isCurrentlyLive ? 'turn off' : 'set as live';
    const confirmed = await showConfirm(
      `Are you sure you want to ${action} "${flowName}" for the ${builderName}?`,
      isCurrentlyLive ? 'Turn Flow Off' : 'Set Flow as Live'
    );
    
    if (confirmed) {
      try {
        if (isCurrentlyLive) {
          // Turn off the current flow
          await fetch('/api/flows', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: flowId,
              name: flowName,
              description: currentFlow?.description,
              data: currentFlow?.data,
              isLive: false
            })
          });
          
          toast.success(`Flow "${flowName}" turned off for the ${builderName}`);
        } else {
          // First, deactivate all other flows for the same target URL
          const flowsToUpdate = flows.filter(flow => 
            flow.targetUrl === targetUrl && flow.id !== flowId
          );
          
          // Deactivate other flows
          for (const flow of flowsToUpdate) {
            await fetch('/api/flows', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: flow.id,
                name: flow.name,
                description: flow.description,
                data: flow.data,
                isLive: false
              })
            });
          }
          
          // Set the selected flow as live
          await fetch('/api/flows', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: flowId,
              name: flowName,
              description: currentFlow?.description,
              data: currentFlow?.data,
              isLive: true
            })
          });
          
          toast.success(`Flow "${flowName}" set as live for the ${builderName}`);
        }
        
        await loadFlows();
      } catch (error) {
        console.error('Error updating flow status:', error);
        toast.error(`Failed to ${action} flow`);
      }
    }
  };

  const handleSwitchVersion = async (flowId: string, flowName: string) => {
    const confirmed = await showConfirm(
      `Are you sure you want to switch the live version to "${flowName}"? This will affect users currently using the CV builder.`,
      'Switch Live Version'
    );
    
    if (confirmed) {
      try {
        // Deactivate all other flows of the same type
        const targetFlow = flows.find(f => f.id === flowId);
        if (targetFlow) {
          setFlows(prevFlows => 
            prevFlows.map(flow => ({
              ...flow,
              isLive: flow.id === flowId || (flow.flowType !== targetFlow.flowType)
            }))
          );
          
          toast.success(`Live version switched to "${flowName}"`);
        }
      } catch (error) {
        console.error('Error switching version:', error);
        toast.error('Failed to switch version');
      }
    }
  };

  const toggleDropdown = (flowId: string) => {
    setOpenDropdown(openDropdown === flowId ? null : flowId);
  };

  const handleExportFlow = async (flow: Flow) => {
    try {
      const dataStr = JSON.stringify(flow.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${flow.name.replace(/\s+/g, '_')}_flow.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Flow exported successfully');
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error exporting flow:', error);
      toast.error('Failed to export flow');
    }
  };

  const handleDuplicateFlow = async (flow: Flow) => {
    try {
      const duplicatedFlow = {
        ...flow,
        id: `${flow.id}_copy_${Date.now()}`,
        name: `${flow.name} (Copy)`,
        isActive: false,
        isLive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedFlow),
      });

      if (response.ok) {
        const newFlow = await response.json();
        setFlows(prev => [...prev, newFlow]);
        toast.success('Flow duplicated successfully');
        setOpenDropdown(null);
      } else {
        throw new Error('Failed to duplicate flow');
      }
    } catch (error) {
      console.error('Error duplicating flow:', error);
      toast.error('Failed to duplicate flow');
    }
  };

  const filteredAndSortedFlows = flows
    .filter(flow => {
      const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (flow.description && flow.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'active' && flow.isActive) ||
                           (filterStatus === 'inactive' && !flow.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
        {/* Header */}
        <div className="px-4 py-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/adminx')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <GitBranch className="w-8 h-8 text-blue-600 mr-3" />
                  Flow Management
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your conversation flows and templates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/adminx/flows/designer')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Flow
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
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

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy as any);
                    setSortOrder(newSortOrder as any);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="updated-desc">Recently Updated</option>
                  <option value="updated-asc">Oldest Updated</option>
                  <option value="created-desc">Recently Created</option>
                  <option value="created-asc">Oldest Created</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Flows Grid */}
        <div className="px-4 sm:px-0">
          {filteredAndSortedFlows.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No flows found' : 'No flows yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first conversation flow'
                }
              </p>
              <button
                onClick={() => router.push('/adminx/flows/designer')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Flow
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedFlows.map((flow, index) => (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingFlow === flow.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveRename(flow.id);
                                } else if (e.key === 'Escape') {
                                  handleCancelRename();
                                }
                              }}
                              className="text-lg font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(flow.id)}
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 
                            className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                            onDoubleClick={() => handleStartRename(flow)}
                            title="Double-click to rename"
                          >
                            {flow.name}
                          </h3>
                        )}
                        {flow.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {flow.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteFlow(flow.id, flow.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete flow"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative dropdown-container">
                          <button 
                            onClick={() => toggleDropdown(flow.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {openDropdown === flow.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                              <div className="py-1">
                                <button
                                  onClick={() => handleStartRename(flow)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit3 className="w-4 h-4 mr-3" />
                                  Rename Flow
                                </button>
                                <button
                                  onClick={() => handleExportFlow(flow)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Download className="w-4 h-4 mr-3" />
                                  Export Flow
                                </button>
                                <button
                                  onClick={() => handleDuplicateFlow(flow)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <RefreshCw className="w-4 h-4 mr-3" />
                                  Duplicate Flow
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(flow.id);
                                    toast.success('Flow ID copied to clipboard');
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <FileText className="w-4 h-4 mr-3" />
                                  Copy Flow ID
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          flow.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {getStatusText(flow.isActive)}
                        </span>
                        {flow.isLive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            <Globe className="w-3 h-3 mr-1" />
                            Live
                          </span>
                        )}
                        {flow.flowType && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
                            {flow.flowType}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatDate(flow.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        {flow.nodeCount && (
                          <div className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            <span>{flow.nodeCount} nodes</span>
                          </div>
                        )}
                        {flow.edgeCount && (
                          <div className="flex items-center">
                            <GitBranch className="w-3 h-3 mr-1" />
                            <span>{flow.edgeCount} connections</span>
                          </div>
                        )}
                        {flow.targetUrl && (
                          <div className="flex items-center">
                            <Link className="w-3 h-3 mr-1" />
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              flow.targetUrl === '/quick-cv'
                                ? 'bg-green-50 text-green-700'
                                : flow.targetUrl === '/builder'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}>
                              {flow.targetUrl === '/quick-cv' ? 'Quick CV' : 
                               flow.targetUrl === '/builder' ? 'Advanced CV' : 
                               flow.targetUrl}
                            </span>
                          </div>
                        )}
                      </div>
                      {flow.createdBy && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{flow.createdBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Clean Action Bar */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        {/* Primary Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditFlow(flow.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewFlow(flow.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                        </div>

                        {/* Status Controls */}
                        <div className="flex items-center space-x-2">
                          {flow.targetUrl && (
                            <button
                              onClick={() => window.open(flow.targetUrl, '_blank')}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visit
                            </button>
                          )}
                          <button
                            onClick={() => handleSetAsLive(flow.id, flow.name, flow.targetUrl || '')}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 ${
                              flow.isLive
                                ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100 focus:ring-green-500'
                                : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:ring-gray-500'
                            }`}
                            title={flow.targetUrl ? `Set as live flow for ${flow.targetUrl === '/quick-cv' ? 'Quick CV Builder' : flow.targetUrl === '/builder' ? 'Advanced CV Builder' : flow.targetUrl}` : 'Set as live flow'}
                          >
                            {flow.isLive ? (
                              <>
                                <Globe className="w-4 h-4 mr-1" />
                                Live
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4 mr-1" />
                                Set Live
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {flows.length > 0 && (
          <div className="px-4 sm:px-0 mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Flow Statistics & Live Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{flows.length}</div>
                  <div className="text-sm text-gray-600">Total Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {flows.filter(f => f.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {flows.filter(f => f.isLive).length}
                  </div>
                  <div className="text-sm text-gray-600">Live Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {flows.filter(f => f.flowType === 'basic').length}
                  </div>
                  <div className="text-sm text-gray-600">Basic Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {flows.filter(f => f.flowType === 'advanced').length}
                  </div>
                  <div className="text-sm text-gray-600">Advanced Flows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {flows.reduce((acc, f) => acc + (f.nodeCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Nodes</div>
                </div>
              </div>
              
              {/* Flow Selection Guide */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-3">How to Select Flows for Builders</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">💡</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-blue-900">Flow Selection Guide</h5>
                      <div className="mt-2 text-sm text-blue-800">
                        <p className="mb-2">Each flow is configured for a specific CV builder:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li><span className="font-medium">Quick CV Builder</span> - Uses flows with target URL <code className="bg-blue-100 px-1 rounded">/quick-cv</code></li>
                          <li><span className="font-medium">Advanced CV Builder</span> - Uses flows with target URL <code className="bg-blue-100 px-1 rounded">/builder</code></li>
                        </ul>
                        <p className="mt-2">Click "Set Live" on any flow to make it active for its configured builder.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Flow Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-3">Live Flow Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Quick CV (/quick-cv)</span>
                    </div>
                    <div className="flex items-center">
                      {flows.find(f => f.targetUrl === '/quick-cv' && f.isLive) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Power className="w-3 h-3 mr-1" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <PowerOff className="w-3 h-3 mr-1" />
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Advanced Builder (/builder)</span>
                    </div>
                    <div className="flex items-center">
                      {flows.find(f => f.targetUrl === '/builder' && f.isLive) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Power className="w-3 h-3 mr-1" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <PowerOff className="w-3 h-3 mr-1" />
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
