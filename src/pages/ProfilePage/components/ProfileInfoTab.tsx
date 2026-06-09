import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfileApi, updateProfileApi, uploadAvatarApi } from '@/services/profileService'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const profileSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ và tên').max(50, 'Tên không được vượt quá 50 ký tự'),
  targetScore: z
    .string()
    .optional()
    .refine(
      (val) => !val || (parseInt(val) >= 10 && parseInt(val) <= 990 && parseInt(val) % 5 === 0),
      {
        message: 'Mục tiêu phải từ 10 - 990 và là bội số của 5',
      }
    ),
  examDate: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileInfoTab() {
  const { userInfo, updateUserInfo } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', targetScore: '', examDate: '' },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi()
        const data = res.data.data
        reset({
          name: data.name || '',
          targetScore: data.targetScore ? data.targetScore.toString() : '',
          examDate: data.examDate ? new Date(data.examDate).toISOString().split('T')[0] : '',
        })
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const payload: any = { name: data.name }
      if (data.targetScore) payload.targetScore = parseInt(data.targetScore, 10)
      if (data.examDate) payload.examDate = new Date(data.examDate).toISOString()

      const res = await updateProfileApi(payload)
      updateUserInfo({ name: data.name })
      toast.success(res.data?.message || 'Cập nhật thành công')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 2MB')
      return
    }

    setUploading(true)
    try {
      const res = await uploadAvatarApi(file)
      updateUserInfo({ avatarUrl: res.data.avatarUrl })
      toast.success('Cập nhật ảnh đại diện thành công')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải ảnh lên')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-8 tracking-tight">Hồ sơ cá nhân</h2>

        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-12">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
              {userInfo?.avatarUrl ? (
                <img src={userInfo.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-semibold text-muted-foreground">
                  {userInfo?.name?.charAt(0) || userInfo?.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="space-y-1 overflow-hidden flex-1 min-w-0">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold text-xl tracking-tight truncate cursor-default">
                    {userInfo?.name || 'Chưa cập nhật tên'}
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start">
                  <p>{userInfo?.name || 'Chưa cập nhật tên'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-muted-foreground truncate" title={userInfo?.email}>
              {userInfo?.email}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">
                Họ và tên
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nhập họ và tên"
                maxLength={50}
                className={`h-11 transition-all focus-visible:ring-1 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="targetScore" className="text-sm font-medium">
                Mục tiêu TOEIC
              </Label>
              <Input
                id="targetScore"
                type="number"
                min={10}
                max={990}
                step={5}
                {...register('targetScore')}
                placeholder="VD: 750"
                className={`h-11 transition-all focus-visible:ring-1 ${errors.targetScore ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
              />
              {errors.targetScore && (
                <p className="text-xs text-red-500 font-medium">{errors.targetScore.message}</p>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="examDate" className="text-sm font-medium">
                Ngày thi dự kiến
              </Label>
              <Input
                id="examDate"
                type="date"
                {...register('examDate')}
                min={new Date().toISOString().split('T')[0]}
                className="h-11 transition-all focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-md shadow-sm transition-all hover:shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
