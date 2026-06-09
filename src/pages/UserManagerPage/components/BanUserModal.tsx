import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useBanUser } from '@/hooks/useUsers'
import { Ban, CheckCircle } from 'lucide-react'

interface BanUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  isCurrentlyBanned: boolean
}

export function BanUserModal({ open, onOpenChange, userId, isCurrentlyBanned }: BanUserModalProps) {
  const [reason, setReason] = useState('')
  const { mutate: banUser, isPending } = useBanUser()

  const handleConfirm = () => {
    if (!userId) return
    banUser(
      { id: userId, isBanned: !isCurrentlyBanned, reason },
      {
        onSuccess: () => {
          onOpenChange(false)
          setReason('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-full ${isCurrentlyBanned ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
            >
              {isCurrentlyBanned ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Ban className="h-5 w-5" />
              )}
            </div>
            <DialogTitle className="text-lg font-bold">
              {isCurrentlyBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            {isCurrentlyBanned
              ? 'Tài khoản này sẽ có thể đăng nhập và sử dụng hệ thống trở lại.'
              : 'Tài khoản này sẽ bị khóa và tất cả phiên đăng nhập hiện tại sẽ bị ngắt lập tức.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do (Tùy chọn)</Label>
            <Input
              id="reason"
              placeholder={isCurrentlyBanned ? 'Lý do mở khóa...' : 'Lý do khóa tài khoản...'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Huỷ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant={isCurrentlyBanned ? 'default' : 'destructive'}
          >
            {isPending ? 'Đang xử lý...' : isCurrentlyBanned ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
