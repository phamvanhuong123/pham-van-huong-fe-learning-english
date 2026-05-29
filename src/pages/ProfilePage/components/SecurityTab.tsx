import { useState } from 'react';
import { Loader2, KeyRound, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordApi, deleteAccountApi } from '@/services/profileService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu mới'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecurityTab() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  
  const [deleteConfirmPwd, setDeleteConfirmPwd] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      const res = await changePasswordApi(data);
      toast.success(res.data?.message || 'Đổi mật khẩu thành công');
      reset();
      clearAuth();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmPwd) {
      toast.error('Vui lòng nhập mật khẩu xác nhận');
      return;
    }
    setDeleting(true);
    try {
      const res = await deleteAccountApi({ password: deleteConfirmPwd });
      toast.success(res.data?.message || 'Đã xóa tài khoản');
      setDialogOpen(false);
      clearAuth();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-8 tracking-tight">Bảo mật tài khoản</h2>
        
        {/* Change Password Section */}
        <div className="mb-12">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-muted-foreground" />
            Đổi mật khẩu
          </h3>
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6 bg-secondary/20 p-6 rounded-xl border">
            <div className="space-y-3">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
                className={`h-11 ${errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.currentPassword && <p className="text-xs text-red-500 font-medium">{errors.currentPassword.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  className={`h-11 ${errors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.newPassword && <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={`h-11 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-md transition-all">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật mật khẩu
            </Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="pt-8 border-t">
          <h3 className="text-lg font-medium text-destructive mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Vùng nguy hiểm
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Xóa tài khoản sẽ gỡ bỏ toàn bộ dữ liệu cá nhân của bạn khỏi hệ thống. Hành động này không thể hoàn tác.
          </p>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="h-11 px-8">Xóa tài khoản</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bạn có chắc chắn muốn xóa tài khoản?</DialogTitle>
                <DialogDescription>
                  Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu của bạn để xác nhận.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="deletePwd" className="mb-2 block">Mật khẩu xác nhận</Label>
                <Input
                  id="deletePwd"
                  type="password"
                  value={deleteConfirmPwd}
                  onChange={(e) => setDeleteConfirmPwd(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting || !deleteConfirmPwd}>
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
