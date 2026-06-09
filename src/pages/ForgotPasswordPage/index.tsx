import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '@/services/authServices'
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
import { toast } from 'sonner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
    onSuccess: () => {
      setSuccessMsg(
        'Một link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.'
      )
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.')
    },
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data.email)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMsg ? (
          <div className="bg-emerald-50 text-emerald-600 text-sm p-4 rounded-md mb-4 text-center border border-emerald-200">
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Đang gửi...' : 'Gửi link khôi phục'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="ghost" asChild className="text-muted-foreground w-full">
          <Link to="/login">Quay lại Đăng nhập</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ForgotPasswordPage
