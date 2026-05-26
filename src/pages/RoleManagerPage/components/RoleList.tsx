import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RoleListProps {
  onSelectRole: (roleId: string) => void;
  selectedRoleId: string | null;
}

export function RoleList({ onSelectRole, selectedRoleId }: RoleListProps) {
  const { data: roles, isLoading, error } = useRoles();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (error || !roles) {
    return <div className="text-rose-500">Lỗi khi tải danh sách vai trò.</div>;
  }

  return (
    <div className="space-y-4">
      {roles.map(role => (
        <Card 
          key={role.id} 
          className={`cursor-pointer transition-colors hover:border-primary/50 ${selectedRoleId === role.id ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => onSelectRole(role.id)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {role.name}
                  {role.isSystem && <Badge variant="secondary" className="text-[10px]">System</Badge>}
                </CardTitle>
                <CardDescription className="text-xs mt-1 truncate max-w-[200px]">
                  {role.description || 'Chưa có mô tả'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {role._count.userRoles} users
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[10px] text-muted-foreground">
              Tạo lúc: {format(new Date(role.createdAt), 'dd/MM/yyyy', { locale: vi })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
