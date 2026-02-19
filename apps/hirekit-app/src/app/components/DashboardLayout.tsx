'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'ph ph-squares-four' },
  { href: '/jobs', label: 'Jobs', icon: 'ph ph-briefcase' },
  { href: '/applications', label: 'Applications', icon: 'ph ph-users' },
  { href: '/configuration', label: 'Configuration', icon: 'ph ph-sliders' },
  { href: '/embed', label: 'Embed Code', icon: 'ph ph-code' },
];

function EmailVerificationBanner() {
  const { data: session } = useSession();
  if (!session?.user || (session.user as any).emailVerified) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-amber-800 text-sm">
        <i className="ph ph-warning-circle text-lg" />
        <span>Please verify your email address. Check your inbox for a verification link.</span>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css"
      />
      <div className="min-h-screen flex bg-[#FAFBFC]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-extrabold text-[#4F46E5]">HireKit</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
                (item.href === '/configuration' && pathname.startsWith('/settings'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#E0E7FF] text-[#4F46E5]'
                      : 'text-[#64748B] hover:bg-[#FAFBFC] hover:text-[#1E293B]'
                  }`}
                >
                  <i className={`${item.icon} text-lg`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#E0E7FF] rounded-full flex items-center justify-center">
                <span className="text-[#4F46E5] text-xs font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1E293B] truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-[#94A3B8] truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="text-sm text-[#64748B] hover:text-[#FF6B6B] font-medium transition-colors duration-300"
            >
              Sign out
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <EmailVerificationBanner />
          {children}
        </main>
      </div>
    </>
  );
}
