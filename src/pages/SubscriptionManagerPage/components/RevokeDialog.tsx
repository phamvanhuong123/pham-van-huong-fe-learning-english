import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRevokeSubscription, useBanBankAccount } from '@/hooks/queries/useSubscriptionQuery'
import { toast } from 'sonner'

export default function RevokeDialog({
  isOpen,
  onClose,
  subscription,
}: {
  isOpen: boolean
  onClose: () => void
  subscription: any
}) {
  const [reason, setReason] = useState('')
  const [banAccount, setBanAccount] = useState(false)
  const { mutateAsync: revokeSub, isPending } = useRevokeSubscription()
  const { mutateAsync: banAccountMutate } = useBanBankAccount()

  const handleRevoke = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do thu hồi')
      return
    }
    try {
      await revokeSub({ id: subscription.id, reason })
      if (banAccount && subscription.bankAccountNo) {
        await banAccountMutate({
          bankAccountNo: subscription.bankAccountNo,
          reason: 'Gian lận: ' + reason,
        })
      }
      toast.success('Đã thu hồi gói VIP thành công')
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  if (!subscription) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Thu hồi gói VIP</DialogTitle>
          <DialogDescription>
            Hành động này sẽ trừ đi số ngày VIP tương ứng từ tài khoản học viên và đẩy học viên ra
            khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Lý do thu hồi <span className="text-destructive">*</span>
            </label>
            <textarea
              className="w-full h-24 p-3 rounded-md border bg-background"
              placeholder="VD: Giao dịch bị hoàn tiền, hóa đơn giả mạo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer border p-3 rounded-md bg-destructive/5 hover:bg-destructive/10 transition-colors">
            <input
              type="checkbox"
              className="rounded"
              checked={banAccount}
              onChange={(e) => setBanAccount(e.target.checked)}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-destructive">
                Đưa luôn STK này vào danh sách đen
              </span>
              <span className="text-xs text-muted-foreground">
                STK: {subscription.bankAccountNo}
              </span>
            </div>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleRevoke} disabled={isPending}>
            Xác nhận Thu hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
