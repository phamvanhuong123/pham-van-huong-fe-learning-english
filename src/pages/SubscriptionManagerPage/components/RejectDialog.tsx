import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRejectSubscription } from '@/hooks/queries/useSubscriptionQuery';
import { toast } from 'sonner';

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string | null;
}

export default function RejectDialog({ isOpen, onClose, subscriptionId }: RejectDialogProps) {
  const [reason, setReason] = useState('');
  const { mutateAsync: rejectSubscription, isPending } = useRejectSubscription();

  const handleReject = async () => {
    if (!subscriptionId) return;
    if (reason.trim().length < 5) {
      toast.error('Vui lòng nhập lý do từ chối (ít nhất 5 ký tự)');
      return;
    }

    try {
      await rejectSubscription({ id: subscriptionId, data: { reason } });
      toast.success('Đã từ chối yêu cầu');
      setReason('');
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Từ chối yêu cầu nâng cấp</DialogTitle>
          <DialogDescription>
            Hành động này sẽ hủy yêu cầu nâng cấp của user. Vui lòng nhập lý do cụ thể để user biết và sửa lại (ví dụ: "Ảnh biên lai bị mờ", "Số tiền không khớp").
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea 
            placeholder="Nhập lý do từ chối..." 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button variant="destructive" onClick={handleReject} disabled={isPending}>
            {isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
