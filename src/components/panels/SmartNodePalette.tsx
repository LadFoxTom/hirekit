'use client';

import { memo, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Zap,
  MessageCircle,
  GitBranch,
  Play,
  Globe,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { 
  CoreNodeType, 
  NodeVariant, 
  ALL_VARIANTS, 
  SmartNode,
  SmartSuggestion,
  FlowContext 
} from '@/types/flow-redesign';

interface SmartNodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: CoreNodeType, variant: string, data: any) => void;
  currentContext?: FlowContext | null;
  className?: string;
}

const SmartNodePalette = memo(({ 
  onDragStart, 
  currentContext,
  className = '' 
}: SmartNodePaletteProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['interaction', 'logic']);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Categories with metadata
  const categories = useMemo(() => [
    {
      id: 'interaction',
      name: 'Interaction',
      description: 'Collect user input and send messages',
      icon: MessageCircle,
      color: '#3b82f6',
      variants: ALL_VARIANTS.interaction
    },
    {
      id: 'logic',
      name: 'Logic & Control',
      description: 'Branch flows and make decisions',
      icon: GitBranch,
      color: '#8b5cf6',
      variants: ALL_VARIANTS.logic
    },
    {
      id: 'flow',
      name: 'Flow Control',
      description: 'Start, wait, and loop operations',
      icon: Play,
      color: '#10b981',
      variants: ALL_VARIANTS.flow
    },
    {
      id: 'integration',
      name: 'Integrations',
      description: 'Connect to external services',
      icon: Globe,
      color: '#f59e0b',
      variants: ALL_VARIANTS.integration
    }
  ], []);

  // Generate contextual suggestions based on current flow context
  const contextualSuggestions = useMemo((): SmartSuggestion[] => {
    if (!currentContext || !currentContext.flow || !showSuggestions) return [];

    const suggestions: SmartSuggestion[] = [];

    // If no start node, suggest adding one
    const hasStartNode = currentContext.flow.nodes.some(node => 
      node.type === 'flow' && node.variant === 'start'
    );
    if (!hasStartNode) {
      suggestions.push({
        id: 'add-start',
        type: 'next-node',
        title: 'Add Start Node',
        description: 'Every flow needs a start node to begin the conversation',
        confidence: 0.9,
        action: () => {
          // This would trigger adding a start node
          console.log('Adding start node');
        },
        category: 'flow'
      });
    }

    // If last node is a question, suggest adding logic or end
    const lastNode = currentContext.flow.nodes[currentContext.flow.nodes.length - 1];
    if (lastNode && lastNode.type === 'interaction' && lastNode.variant === 'question') {
      suggestions.push({
        id: 'add-condition',
        type: 'next-node',
        title: 'Add Conditional Logic',
        description: 'Branch the flow based on the user\'s answer',
        confidence: 0.8,
        action: () => {
          console.log('Adding condition node');
        },
        category: 'logic'
      });
    }

    // If flow has questions but no end node, suggest adding one
    const hasQuestions = currentContext.flow.nodes.some(node => 
      node.type === 'interaction' && node.variant === 'question'
    );
    const hasEndNode = currentContext.flow.nodes.some(node => 
      node.type === 'interaction' && node.variant === 'end'
    );
    if (hasQuestions && !hasEndNode) {
      suggestions.push({
        id: 'add-end',
        type: 'next-node',
        title: 'Add End Node',
        description: 'Complete the flow with an end node',
        confidence: 0.7,
        action: () => {
          console.log('Adding end node');
        },
        category: 'interaction'
      });
    }

    return suggestions;
  }, [currentContext, showSuggestions]);

  // Filter variants based on search and category
  const filteredVariants = useMemo(() => {
    let filtered = categories;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        variants: Object.entries(category.variants).filter(([key, variant]) =>
          variant.name.toLowerCase().includes(query) ||
          variant.description.toLowerCase().includes(query) ||
          variant.category.toLowerCase().includes(query)
        ).reduce((acc, [key, variant]) => ({ ...acc, [key]: variant }), {})
      })).filter(category => Object.keys(category.variants).length > 0);
    }

    return filtered;
  }, [categories, selectedCategory, searchQuery]);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: CoreNodeType, variant: string) => {
    const variantConfig = ALL_VARIANTS[nodeType]?.[variant];
    if (!variantConfig) return;

    const nodeData = {
      type: nodeType,
      variant: variant,
      config: {
        title: variantConfig.name,
        description: variantConfig.description,
        status: 'incomplete' as const,
        variantConfig: variantConfig.defaultConfig,
        connections: { inputs: [], outputs: [] },
        validation: {}
      },
      visualState: {
        importance: 'medium' as const,
        complexity: variantConfig.complexity,
        color: variantConfig.color,
        icon: variantConfig.icon,
        borderStyle: 'solid' as const,
        hasErrors: false,
        isConfigured: false,
        isSelected: false,
        isHovered: false
      },
      size: {
        width: variantConfig.complexity === 'simple' ? 180 : 
               variantConfig.complexity === 'standard' ? 220 : 280,
        height: variantConfig.complexity === 'simple' ? 60 : 
                variantConfig.complexity === 'standard' ? 80 : 120,
        minWidth: 180,
        minHeight: 60
      }
    };

    onDragStart(event, nodeType, variant, nodeData);
  }, [onDragStart]);

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Node Palette</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contextual Suggestions */}
        {contextualSuggestions.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Zap size={16} className="mr-1 text-yellow-500" />
                Smart Suggestions
              </h3>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showSuggestions ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {contextualSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      onClick={suggestion.action}
                      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-blue-900">
                            {suggestion.title}
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            {suggestion.description}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="text-xs text-blue-600 font-medium">
                            {Math.round(suggestion.confidence * 100)}%
                          </div>
                          <Star size={12} className="text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Node Categories */}
        <div className="p-4 space-y-4">
          {filteredVariants.map(category => {
            const variants = Object.entries(category.variants);
            if (variants.length === 0) return null;

            const isExpanded = expandedCategories.includes(category.id);
            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: category.color }}
                    >
                      <CategoryIcon size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-600">{category.description}</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 space-y-2"
                    >
                      {variants.map(([variantKey, variant]) => (
                        <div
                          key={variantKey}
                          draggable
                          onDragStart={(e) => handleDragStart(e, category.id as CoreNodeType, variantKey)}
                          className="p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: variant.color }}
                            >
                              {variant.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                {variant.name}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {variant.description}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                variant.complexity === 'simple' ? 'bg-green-400' :
                                variant.complexity === 'standard' ? 'bg-yellow-400' : 'bg-red-400'
                              }`} />
                              <span className="text-xs text-gray-500 capitalize">
                                {variant.complexity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredVariants.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No nodes found matching your search</p>
            <p className="text-sm mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Drag nodes to canvas</span>
            <span>{Object.values(ALL_VARIANTS).reduce((acc, variants) => acc + Object.keys(variants).length, 0)} nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SmartNodePalette.displayName = 'SmartNodePalette';

export default SmartNodePalette;
