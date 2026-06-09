import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEditSubscription } from '@/hooks/queries/useSubscriptionQuery'
import { toast } from 'sonner'

export default function EditSubscriptionModal({
  isOpen,
  onClose,
  subscription,
}: {
  isOpen: boolean
  onClose: () => void
  subscription: any
}) {
  const [plan, setPlan] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const { mutateAsync: editSub, isPending } = useEditSubscription()

  useEffect(() => {
    if (subscription) {
      setPlan(subscription.plan)
      setAmount(subscription.amount)
    }
  }, [subscription])

  const handleSave = async () => {
    try {
      await editSub({ id: subscription.id, data: { plan, amount: Number(amount) } })
      toast.success('Đã cập nhật thông tin đơn')
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
          <DialogTitle>Chỉnh sửa đơn đăng ký</DialogTitle>
          <DialogDescription>Thay đổi thông tin gói và số tiền trước khi duyệt.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gói VIP</label>
            <select
              className="w-full h-10 px-3 rounded-md border bg-background"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="VIP_1_MONTH">Gói 1 Tháng</option>
              <option value="VIP_3_MONTH">Gói 3 Tháng</option>
              <option value="VIP_6_MONTH">Gói 6 Tháng</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Số tiền (VNĐ)</label>
            <input
              type="number"
              className="w-full h-10 px-3 rounded-md border bg-background"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
