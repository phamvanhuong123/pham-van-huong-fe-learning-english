import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginApi } from '@/services/authServices';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await loginApi({ email: data.email, password: data.password });
      
      const { user, accessToken } = res.data;
      
      // Lưu vào Zustand store (và localStorage qua persist)
      setAuth(user, accessToken);
      
      toast.success('Đăng nhập thành công!');
      
      if (user.role === "superAdmin" || user.role === "ADMIN" || data.email.includes("admin")) {
        console.log(user)
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/75 bg-card shadow-xl rounded-2xl relative overflow-hidden">
      <CardHeader className="space-y-1 pb-3 pt-5">
        <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
          Chào mừng quay trở lại
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 text-xs">
          Nhập email và mật khẩu để tiếp tục hành trình học tiếng Anh của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left">
          <div className="space-y-1">
            <Label htmlFor="email" className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('email')} 
            />
            {errors.email && <p className="text-[11px] text-destructive mt-0.5 font-medium">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase">Mật khẩu</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-semibold transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('password')} 
            />
            {errors.password && <p className="text-[11px] text-destructive mt-0.5 font-medium">{errors.password.message}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3.5 mt-2 rounded-xl text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Đang kết nối..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/40 pt-3 pb-4">
        <p className="text-xs text-muted-foreground/90">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;