import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSendBroadcast } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Send } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Tiêu đề ít nhất 3 ký tự').max(100, 'Tiêu đề tối đa 100 ký tự'),
  body: z.string().min(5, 'Nội dung ít nhất 5 ký tự').max(500, 'Nội dung tối đa 500 ký tự'),
  type: z.string(),
  targetRole: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function BroadcastForm() {
  const { mutate: sendBroadcast, isPending } = useSendBroadcast();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      type: 'SYSTEM',
      targetRole: 'ALL',
    }
  });

  const onSubmit = (data: FormValues) => {
    sendBroadcast(data, {
      onSuccess: () => {
        reset();
        setValue('type', 'SYSTEM');
        setValue('targetRole', 'ALL');
      }
    });
  };

  const previewTitle = watch('title') || 'Tiêu đề thông báo...';
  const previewBody = watch('body') || 'Nội dung thông báo sẽ hiển thị ở đây...';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="shadow-sm border-dashed">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-dashed mb-4 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5 text-primary" /> Soạn thông báo mới
          </CardTitle>
          <CardDescription>Gửi thông báo real-time tới người dùng đang online.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold text-foreground">Tiêu đề</Label>
              <Input id="title" placeholder="Nhập tiêu đề..." className="focus-visible:ring-primary/20 transition-all" {...register('title')} />
              {errors.title && <p className="text-sm text-rose-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="font-semibold text-foreground">Nội dung</Label>
              <Textarea
                id="body"
                placeholder="Nhập nội dung..."
                className="min-h-[120px] resize-none focus-visible:ring-primary/20 transition-all"
                {...register('body')}
              />
              {errors.body && <p className="text-sm text-rose-500">{errors.body.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Loại thông báo</Label>
                <Select value={watch('type')} onValueChange={(val) => setValue('type', val)}>
                  <SelectTrigger className="focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Chọn loại..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM">Hệ thống (SYSTEM)</SelectItem>
                    <SelectItem value="SUBSCRIPTION">Gói cước (SUBSCRIPTION)</SelectItem>
                    <SelectItem value="EXAM_REMINDER">Nhắc nhở thi (EXAM_REMINDER)</SelectItem>
                    <SelectItem value="VOCAB_REMINDER">Nhắc từ vựng (VOCAB_REMINDER)</SelectItem>
                    <SelectItem value="STREAK_REMINDER">Nhắc chuỗi (STREAK_REMINDER)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Đối tượng nhận</Label>
                <Select value={watch('targetRole')} onValueChange={(val) => setValue('targetRole', val)}>
                  <SelectTrigger className="focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Chọn đối tượng..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả người dùng (ALL)</SelectItem>
                    <SelectItem value="STANDARD">Tài khoản thường (STANDARD)</SelectItem>
                    <SelectItem value="VIP">Tài khoản VIP (VIP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 py-5 border-t border-dashed">
            <Button type="submit" disabled={isPending} className="w-full h-11 shadow-md">
              {isPending ? 'Đang phát sóng...' : 'Gửi thông báo (Broadcast)'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Xem trước hiển thị (Toast)</h3>
        <Card className="bg-card shadow-md border-primary/20 p-5 max-w-sm flex items-start gap-4 rounded-xl overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="p-2 bg-primary/10 rounded-full shrink-0 text-primary mt-1">
            <BellRing className="h-5 w-5" />
          </div>
          <div className="space-y-1 overflow-hidden">
            <h4 className="font-semibold text-sm truncate">{previewTitle}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {previewBody}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
