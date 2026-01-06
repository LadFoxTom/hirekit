'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  GitBranch,
  HelpCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Home,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ModalProvider } from '@/components/providers/ModalProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/adminx',
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  {
    name: 'Flow Designer',
    href: '/adminx/flows/designer',
    icon: GitBranch,
    description: 'Create and edit conversation flows',
    badge: 'Primary'
  },
  {
    name: 'Smart Mapping',
    href: '/adminx/smart-mapping',
    icon: Target,
    description: 'Map flow data to CV fields with AI intelligence',
    badge: 'Revolutionary'
  },
  {
    name: 'Flow Management',
    href: '/adminx/flows',
    icon: GitBranch,
    description: 'Manage existing flows and templates'
  },
  {
    name: 'Question Library',
    href: '/adminx/questions',
    icon: HelpCircle,
    description: 'Save and reuse questions across flows'
  },
  {
    name: 'Analytics',
    href: '/adminx/analytics',
    icon: BarChart3,
    description: 'Performance metrics and insights'
  },
  {
    name: 'Settings',
    href: '/adminx/settings',
    icon: Settings,
    description: 'System configuration and preferences'
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <ModalProvider>
      <div className="h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:static lg:inset-0 lg:flex lg:flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const hasChildren = item.children && item.children.length > 0;
                  
                  return (
                    <div key={item.name}>
                      <a
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {hasChildren && (
                          <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </a>
                      
                      {/* Children navigation items */}
                      {hasChildren && isActive && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.children!.map((child) => (
                            <a
                              key={child.name}
                              href={child.href}
                              className="group flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                            >
                              <child.icon className="mr-3 h-4 w-4 text-gray-400" />
                              {child.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* User Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name || session.user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-3 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="hidden lg:block">
                  <nav className="flex space-x-8">
                    <a
                      href="/"
                      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Back to App
                    </a>
                  </nav>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Welcome, {session.user?.name || session.user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ModalProvider>
  );
}

