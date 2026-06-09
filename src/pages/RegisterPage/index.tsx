import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { registerApi } from '@/services/authServices'
import { toast } from 'sonner'
import { MailOpen } from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập tên của bạn'),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/\d/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true)
      await registerApi({ email: data.email, name: data.name, password: data.password })
      setIsSuccess(true)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border border-border/75 bg-card shadow-xl rounded-lg relative overflow-hidden text-center py-4">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <MailOpen className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Kiểm tra email của bạn
            </CardTitle>
            <CardDescription className="text-muted-foreground/90 text-sm leading-relaxed px-2">
              Chúng tôi đã gửi một đường link xác thực tài khoản vào email của bạn. Vui lòng kiểm
              tra hộp thư đến (và cả thư mục spam).
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-center border-t border-border/40 pt-6 pb-4">
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-5 rounded-md"
          >
            <Link to="/login">Trở lại trang Đăng nhập</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border border-border/75 bg-card shadow-xl rounded-lg relative overflow-hidden">
      <CardHeader className="space-y-1 pb-3 pt-5">
        <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
          Đăng ký tài khoản
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 text-xs">
          Tạo tài khoản để bắt đầu hành trình học tiếng Anh ngay hôm nay.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left">
          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase"
            >
              Họ và tên
            </Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-0.5 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[11px] text-destructive mt-0.5 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase"
            >
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-[11px] text-destructive mt-0.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="font-semibold text-[10px] text-muted-foreground tracking-wide uppercase"
            >
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="h-9 bg-slate-50/50 dark:bg-slate-900/30 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary text-sm transition-all duration-150"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-destructive mt-0.5 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3.5 mt-2 rounded-md text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/40 pt-3 pb-4">
        <p className="text-xs text-muted-foreground/90">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterPage
