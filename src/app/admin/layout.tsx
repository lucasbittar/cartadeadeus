'use client';

import { usePathname, useRouter } from 'next/navigation';
import { copy } from '@/constants/copy';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show header on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: copy.admin.nav.dashboard },
    { href: '/admin/letters', label: copy.admin.nav.letters },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header */}
      <header className="bg-background border-b border-muted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <h1 className="font-playfair text-lg md:text-xl font-semibold text-foreground">
              {copy.admin.title}
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-foreground text-background'
                        : 'text-muted-dark hover:text-foreground hover:bg-cream'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="w-px h-6 bg-muted-light hidden md:block" />
              <button
                onClick={handleLogout}
                className="text-xs md:text-sm text-muted-dark hover:text-foreground transition-colors"
              >
                {copy.admin.nav.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {children}
      </main>
    </div>
  );
}
