import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/config/rbacConfig';
import { handleLogoutApi } from '@/services/authServices';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  BookOpen,
  Bell,
  X,
  ShieldCheck,
  LogOut,
  FileText,
  Trash2,
  Book,
  BookMarked,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Người dùng', to: '/admin/users', icon: <Users className="w-4 h-4" />, permission: PERMISSIONS.USER_MANAGE },
  { label: 'Quản lý vai trò', to: '/admin/roles', icon: <UserCheck className="w-4 h-4" />, permission: PERMISSIONS.ROLE_MANAGE },
  {
    label: 'Đăng ký VIP',
    to: '/admin/subscriptions',
    icon: <CreditCard className="w-4 h-4" />,
    badgeKey: 'pendingSubscriptions',
    permission: PERMISSIONS.SUBSCRIPTION_MANAGE
  },
  { label: 'Quản lý đề thi', to: '/admin/exams', icon: <FileText className="w-4 h-4" />, permission: PERMISSIONS.EXAM_MANAGE },
  { label: 'Ngân hàng câu hỏi', to: '/admin/questions', icon: <BookOpen className="w-4 h-4" />, permission: PERMISSIONS.QUESTION_MANAGE },
  { label: 'Thư viện từ vựng', to: '/admin/vocab', icon: <Book className="w-4 h-4" />, permission: PERMISSIONS.VOCAB_MANAGE },
  { label: 'Quản lý ngữ pháp', to: '/admin/grammar', icon: <BookMarked className="w-4 h-4" />, permission: PERMISSIONS.GRAMMAR_MANAGE },
  { label: 'Thông báo', to: '/admin/notifications', icon: <Bell className="w-4 h-4" />, permission: PERMISSIONS.ROLE_MANAGE },
  { label: 'Thùng rác', to: '/admin/trash', icon: <Trash2 className="w-4 h-4" />, permission: PERMISSIONS.ROLE_MANAGE },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

function AdminSidebar({ onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { hasPermission } = usePermission();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogoutApi();
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Mock pending subscription counts since there is no api yet
  const pendingCount = 5;

  const getBadgeValue = (badgeKey?: string) => {
    if (badgeKey === 'pendingSubscriptions') return pendingCount;
    return 0;
  };

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border w-60">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground leading-tight">TOEIC Master</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 lg:hidden"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.filter(item => !item.permission || hasPermission(item.permission)).map((item) => {
          const badgeValue = getBadgeValue(item.badgeKey);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 relative',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {badgeValue > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 px-1.5 text-xs rounded-full"
                  aria-label={`${badgeValue} mục chờ xử lý`}
                >
                  {badgeValue > 99 ? '99+' : badgeValue}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          {isLoggingOut ? 'Đang xuất...' : 'Đăng xuất'}
        </Button>
        <p className="text-xs text-center text-muted-foreground">Admin Panel v1.0</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;
