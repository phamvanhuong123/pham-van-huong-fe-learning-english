import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import {
  User,
  LogOut,
  LayoutDashboard,
  Library,
  History,
  BookOpen,
  Menu,
  Crown,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

const navItems = [
  { label: 'Trang chủ', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Luyện đề', to: '/exams', icon: Library, end: false },
  { label: 'Từ vựng', to: '/vocab', icon: BookOpen, end: false },
  { label: 'Ngữ pháp', to: '/grammar', icon: GraduationCap, end: false },
  { label: 'Lịch sử', to: '/history', icon: History, end: false },
];

export function ClientHeader() {
  const { userInfo, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
    setUserMenuOpen(false);
  };

  const isAdmin = userInfo?.role === 'ADMIN' || userInfo?.role === 'superAdmin';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5" replace>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
              TOEIC Master
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-2">
          {/* Go VIP button — chỉ hiển thị với user thường */}
          {userInfo && !isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex gap-2 border-primary/30 text-primary hover:bg-primary/5 rounded-full"
              asChild
            >
              <Link to="/pricing">
                <Crown className="h-4 w-4" />
                Nâng cấp VIP
              </Link>
            </Button>
          )}

          {/* ── Khi đã đăng nhập: User Menu ── */}
          {userInfo ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              
              <div className="relative">
              <button
                id="client-user-menu-trigger"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                  {userInfo.avatarUrl ? (
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo.name || 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium hidden md:inline-block">
                  {userInfo.name || userInfo.email.split('@')[0]}
                </span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  {/* overlay để click ngoài đóng menu */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-popover shadow-md z-50 p-1.5 flex flex-col gap-0.5">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Tài khoản:{' '}
                      <span className="font-medium text-foreground">{userInfo.email}</span>
                    </div>
                    <div className="h-px bg-border my-1" />

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4" /> Hồ sơ của tôi
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Trang Admin
                      </Link>
                    )}

                    {!isAdmin && (
                      <Link
                        to="/pricing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted text-primary font-medium transition-colors"
                      >
                        <Crown className="h-4 w-4" /> Nâng cấp VIP
                      </Link>
                    )}

                    <div className="h-px bg-border my-1" />

                    <button
                      id="client-logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
              </div>
            </div>
          ) : (
            /* ── Khi chưa đăng nhập ── */
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* ── Mobile Hamburger ── */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                id="client-mobile-menu-btn"
                variant="ghost"
                size="sm"
                className="md:hidden px-2"
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-4 pt-5 pb-3 border-b">
                <SheetTitle asChild>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight">TOEIC Master</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Mobile User Section */}
              <div className="border-t p-3 mt-auto">
                {userInfo ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border flex-shrink-0">
                        {userInfo.avatarUrl ? (
                          <img
                            src={userInfo.avatarUrl}
                            alt={userInfo.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {userInfo.name || userInfo.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        Đăng ký
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
