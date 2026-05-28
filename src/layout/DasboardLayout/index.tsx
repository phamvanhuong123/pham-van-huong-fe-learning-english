import { Outlet, useLocation } from 'react-router';
import { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from './components/AdminSidebar';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Simple breadcrumb logic based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || 'Dashboard';
  const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex w-full font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 flex h-full w-[260px] animate-in slide-in-from-left duration-200">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border/60 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-black" />
              <span className="text-[15px] font-semibold tracking-tight">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Desktop Topbar */}
        <header className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-border/40 bg-white sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-[16px] font-semibold tracking-tight">{pageTitle}</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;