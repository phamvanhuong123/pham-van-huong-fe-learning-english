import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordApi } from '@/services/authServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending, error } = useMutation({
    mutationFn: (newPassword: string) => resetPasswordApi({ token: token || '', newPassword }),
    onSuccess: () => {
      setSuccess(true);
    }
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return;
    resetPassword(data.newPassword);
  };

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            Lỗi bảo mật
          </CardTitle>
          <CardDescription>
            Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã bị thiếu mã xác thực.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/forgot-password">Yêu cầu cấp lại link mới</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            Thành công!
          </CardTitle>
          <CardDescription>
            Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/login">Chuyển đến trang Đăng nhập</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mật khẩu mới của bạn bên dưới.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-md mb-4 border border-rose-200">
            {(error as any)?.response?.data?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu."}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" {...register('newPassword')} />
            {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
