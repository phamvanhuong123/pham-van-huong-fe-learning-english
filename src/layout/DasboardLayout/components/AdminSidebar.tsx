import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useDashboard } from '@/hooks/useDashboard';
import { PERMISSIONS } from '@/config/rbacConfig';
import { handleLogoutApi } from '@/services/authServices';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, CreditCard,
  BookOpen, X, ShieldCheck, LogOut,
  FileText, Trash2, BookMarked,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  permission?: string;
  badgeKey?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Tổng quan', to: '/admin/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      { label: 'Thông báo', to: '/admin/notifications', icon: <Activity className="w-[18px] h-[18px]" />, permission: PERMISSIONS.ROLE_MANAGE },
    ]
  },
  {
    title: 'User Management',
    items: [
      { label: 'Người dùng', to: '/admin/users', icon: <Users className="w-[18px] h-[18px]" />, permission: PERMISSIONS.USER_MANAGE },
      { label: 'Đăng ký VIP', to: '/admin/subscriptions', icon: <CreditCard className="w-[18px] h-[18px]" />, badgeKey: 'pendingSubscriptions', permission: PERMISSIONS.SUBSCRIPTION_MANAGE },
      // { label: 'Quản lý vai trò', to: '/admin/roles', icon: <UserCheck className="w-[18px] h-[18px]" />, permission: PERMISSIONS.ROLE_MANAGE },
    ]
  },
  {
    title: 'Content & Resources',
    items: [
      { label: 'Quản lý đề thi', to: '/admin/exams', icon: <FileText className="w-[18px] h-[18px]" />, permission: PERMISSIONS.EXAM_MANAGE },
      { label: 'Ngân hàng câu hỏi', to: '/admin/questions', icon: <BookOpen className="w-[18px] h-[18px]" />, permission: PERMISSIONS.QUESTION_MANAGE },
      // { label: 'Thư viện từ vựng', to: '/admin/vocab', icon: <Book className="w-[18px] h-[18px]" />, permission: PERMISSIONS.VOCAB_MANAGE },
      { label: 'Quản lý ngữ pháp', to: '/admin/grammar', icon: <BookMarked className="w-[18px] h-[18px]" />, permission: PERMISSIONS.GRAMMAR_MANAGE },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Thùng rác', to: '/admin/trash', icon: <Trash2 className="w-[18px] h-[18px]" />, permission: PERMISSIONS.ROLE_MANAGE },
    ]
  }
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

  const { data: dashboardData } = useDashboard();
  const pendingCount = dashboardData?.stats?.pendingSubscriptions || 0;
  const getBadgeValue = (badgeKey?: string) => badgeKey === 'pendingSubscriptions' ? pendingCount : 0;

  return (
    <aside className="flex flex-col h-full bg-[#FAFAFA] border-r border-border/60 w-[260px]">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border/40 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 bg-black dark:bg-white rounded-md shadow-sm">
          <ShieldCheck className="w-5 h-5 text-white dark:text-black" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[15px] font-semibold text-foreground truncate tracking-tight">TOEIC Master</p>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Admin Workspace</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden -mr-2" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8 custom-scrollbar">
        {NAV_GROUPS.map((group, groupIndex) => {
          const visibleItems = group.items.filter(item => !item.permission || hasPermission(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIndex} className="space-y-2.5">
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                {group.title}
              </h4>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const badgeValue = getBadgeValue(item.badgeKey);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 group',
                          isActive
                            ? 'bg-white text-black shadow-sm ring-1 ring-border/50'
                            : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                        )
                      }
                    >
                      <div className={cn("transition-colors", "group-hover:text-foreground")}>
                        {item.icon}
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {badgeValue > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-[22px] min-w-[22px] px-1.5 text-[11px] font-semibold rounded-full bg-primary/10 text-primary border-none"
                        >
                          {badgeValue > 99 ? '99+' : badgeValue}
                        </Badge>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Profile/Footer Area */}
      <div className="p-4 border-t border-border/40 shrink-0 bg-white">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-black/5 h-10 px-3 rounded-lg"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-[18px] h-[18px] mr-3" />
          <span className="text-[14px] font-medium">{isLoggingOut ? 'Đang xuất...' : 'Đăng xuất'}</span>
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
