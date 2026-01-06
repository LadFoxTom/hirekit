'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  GitBranch,
  HelpCircle,
  BarChart3,
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Users,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface RecentActivity {
  id: string;
  type: 'flow_created' | 'flow_updated' | 'config_updated' | 'user_action';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const quickActions: QuickAction[] = [
    {
      title: 'Flow Designer',
      description: 'Create and edit conversation flows with our visual designer',
      href: '/adminx/flows/designer',
      icon: GitBranch,
      color: 'bg-blue-500',
      badge: 'Primary'
    },
    {
      title: 'Manage Flows',
      description: 'View, edit, and organize existing flows and templates',
      href: '/adminx/flows',
      icon: GitBranch,
      color: 'bg-green-500'
    },
    {
      title: 'Smart Mapping',
      description: 'Map flow data to CV fields with AI intelligence',
      href: '/adminx/smart-mapping',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Monitor performance metrics and user engagement',
      href: '/adminx/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real flows data
      const flowsResponse = await fetch('/api/flows');
      let flows = flowsResponse.ok ? await flowsResponse.json() : [];
      
      // Add template flows only if they don't exist in the database
      const existingFlowIds = flows.map((f: any) => f.id);
      
      // Only add basic_cv_flow if it doesn't exist in the database
      if (!existingFlowIds.includes('basic_cv_flow')) {
        flows.push({
          id: 'basic_cv_flow',
          name: 'Basic CV Builder Flow',
          description: 'Complete basic CV builder flow with essential questions for quick CV creation',
          flowType: 'basic',
          targetUrl: '/quick-cv',
          isLive: true,
          isActive: true,
          isDefault: true,
          createdBy: 'System'
        });
      }
      
      // Only add advanced_cv_flow if it doesn't exist in the database
      if (!existingFlowIds.includes('advanced_cv_flow')) {
        flows.push({
          id: 'advanced_cv_flow',
          name: 'Advanced CV Builder Flow',
          description: 'Comprehensive advanced CV builder flow with detailed questions, conditional branching, and optimization features',
          flowType: 'advanced',
          targetUrl: '/builder',
          isLive: true,
          isActive: true,
          isDefault: true,
          createdBy: 'System'
        });
      }
      
      // Load real question configs data
      const configsResponse = await fetch('/api/admin/question-configs');
      const configs = configsResponse.ok ? await configsResponse.json() : { configurations: [] };
      
      // Calculate real stats
      const totalFlows = Array.isArray(flows) ? flows.length : 0;
      const activeFlows = Array.isArray(flows) ? flows.filter((f: any) => f.isActive).length : 0;
      const totalQuestions = Array.isArray(configs.configurations) 
        ? configs.configurations.reduce((acc: number, config: any) => acc + (config.questions?.length || 0), 0)
        : 0;
      
      // Set real stats
      setStats([
        {
          title: 'Total Flows',
          value: totalFlows.toString(),
          change: totalFlows > 0 ? `${activeFlows} active` : 'No flows yet',
          changeType: totalFlows > 0 ? 'positive' : 'neutral',
          icon: GitBranch
        },
        {
          title: 'Active Flows',
          value: activeFlows.toString(),
          change: totalFlows > 0 ? `${Math.round((activeFlows / totalFlows) * 100)}% of total` : 'No flows',
          changeType: activeFlows > 0 ? 'positive' : 'neutral',
          icon: Users
        },
        {
          title: 'Questions Configured',
          value: totalQuestions.toString(),
          change: totalQuestions > 0 ? 'Across all configs' : 'No questions yet',
          changeType: totalQuestions > 0 ? 'positive' : 'neutral',
          icon: HelpCircle
        },
        {
          title: 'Configurations',
          value: (configs.configurations?.length || 0).toString(),
          change: configs.configurations?.length > 0 ? 'Available' : 'No configs yet',
          changeType: configs.configurations?.length > 0 ? 'positive' : 'neutral',
          icon: TrendingUp
        }
      ]);

      // Set empty activity for now (can be populated with real data later)
      setRecentActivity([]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set empty stats on error
      setStats([
        {
          title: 'Total Flows',
          value: '0',
          change: 'No data available',
          changeType: 'neutral',
          icon: GitBranch
        },
        {
          title: 'Active Flows',
          value: '0',
          change: 'No data available',
          changeType: 'neutral',
          icon: Users
        },
        {
          title: 'Questions Configured',
          value: '0',
          change: 'No data available',
          changeType: 'neutral',
          icon: HelpCircle
        },
        {
          title: 'Configurations',
          value: '0',
          change: 'No data available',
          changeType: 'neutral',
          icon: TrendingUp
        }
      ]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'flow_created':
        return Plus;
      case 'flow_updated':
        return GitBranch;
      case 'config_updated':
        return Settings;
      case 'user_action':
        return Users;
      default:
        return FileText;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back! Here's what's happening with your CV Builder.
              </p>
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

        {/* Quick Stats */}
        <div className="px-4 sm:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.title}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Quick Actions */}
            <div className="xl:col-span-3">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Jump to the most important admin functions
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.button
                          key={action.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => router.push(action.href)}
                          className="group relative p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left"
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                                  {action.title}
                                </h3>
                                {action.badge && (
                                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {action.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col">
              <div className="bg-white shadow rounded-lg flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Latest changes and updates
                  </p>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                      <p className="text-gray-600">
                        Activity will appear here as you create and modify flows and configurations.
                      </p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {recentActivity.map((activity, index) => {
                          const Icon = activity.icon;
                          return (
                            <motion.li
                              key={activity.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="relative pb-8">
                                {index !== recentActivity.length - 1 && (
                                  <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                )}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                                      <Icon className="w-4 h-4 text-blue-600" />
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {activity.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {activity.description}
                                      </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {activity.timestamp}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="px-4 sm:px-0 mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  New to the Admin Panel?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Start by creating your first flow with the Flow Designer, or explore the question management system.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => router.push('/adminx/flows/designer')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
