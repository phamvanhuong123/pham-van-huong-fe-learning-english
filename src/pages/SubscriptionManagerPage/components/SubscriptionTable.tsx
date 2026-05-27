import { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Eye, AlertTriangle, ShieldBan } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import ProofPreviewModal from './ProofPreviewModal';
import RejectDialog from './RejectDialog';

import type { Subscription } from '@/types/subscription.type';
import { useApproveSubscription, useBanBankAccount } from '@/hooks/queries/useSubscriptionQuery';

interface SubscriptionTableProps {
  data: Subscription[];
  isLoading: boolean;
}

export default function SubscriptionTable({ data, isLoading }: SubscriptionTableProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  
  const { mutateAsync: approveSubscription, isPending: isApproving } = useApproveSubscription();
  const { mutateAsync: banBankAccount } = useBanBankAccount();

  const handleApprove = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu này? User sẽ được cộng thời gian VIP tương ứng.')) {
      try {
        await approveSubscription(id);
        toast.success('Đã duyệt yêu cầu thành công');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };

  const handleBanAccount = async (bankAccountNo: string | null) => {
    if (!bankAccountNo) return;
    if (window.confirm(`Bạn có chắc chắn muốn cấm STK ${bankAccountNo}? Tất cả yêu cầu tương lai từ STK này sẽ bị flag.`)) {
      try {
        await banBankAccount({ bankAccountNo, reason: 'Gian lận hóa đơn' });
        toast.success(`Đã cấm STK ${bankAccountNo}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="py-20 text-center border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Check className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Không có yêu cầu nào</h3>
        <p className="text-muted-foreground text-sm mt-1">Mọi thứ đã được xử lý xong.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>User</TableHead>
            <TableHead>Gói VIP</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Thông tin CK</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Rủi ro</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>
                <div className="font-medium text-sm">{sub.user?.email || 'N/A'}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(sub.createdAt), 'dd/MM/yyyy HH:mm')}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-primary">{sub.plan.replace('VIP_', '').replace('_', ' ')}</span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {sub.amount?.toLocaleString('vi-VN')}đ
              </TableCell>
              <TableCell>
                <div className="text-xs font-mono mb-1">{sub.transactionRef}</div>
                <div className="text-xs text-muted-foreground">STK: {sub.bankAccountNo}</div>
              </TableCell>
              <TableCell>
                <SubscriptionStatusBadge status={sub.status} />
              </TableCell>
              <TableCell>
                {sub.riskScore > 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded-md w-fit cursor-help border border-red-100">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Điểm: {sub.riskScore}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="w-64 p-3 space-y-1">
                        <p className="font-semibold text-sm border-b pb-1 mb-2">Phát hiện rủi ro</p>
                        {Array.isArray(sub.riskFlags) && sub.riskFlags.map((flag: string, idx: number) => (
                          <div key={idx} className="text-xs flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                            {flag === 'DUPLICATE_PROOF' && 'Ảnh hóa đơn này đã được dùng cho giao dịch khác (có thể là giả mạo).'}
                            {flag === 'BANNED_BANK_ACCOUNT' && 'Số tài khoản ngân hàng này nằm trong danh sách đen.'}
                            {flag === 'MULTIPLE_PENDING' && 'User này đang spam nhiều yêu cầu cùng lúc.'}
                            {flag === 'SUSPICIOUS_IP' && 'Phát hiện nhiều tài khoản dùng chung IP để gửi yêu cầu.'}
                            {!['DUPLICATE_PROOF', 'BANNED_BANK_ACCOUNT', 'MULTIPLE_PENDING', 'SUSPICIOUS_IP'].includes(flag) && flag}
                          </div>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">An toàn (0)</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 shadow-sm"
                    onClick={() => setPreviewImage(sub.proofUrl)}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Bill
                  </Button>
                  
                  {sub.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-8 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        disabled={isApproving}
                        onClick={() => handleApprove(sub.id)}
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Duyệt
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-8 shadow-sm"
                        onClick={() => setRejectId(sub.id)}
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        Từ chối
                      </Button>
                    </>
                  )}

                  {sub.riskScore > 50 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => handleBanAccount(sub.bankAccountNo)}
                          >
                            <ShieldBan className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cấm STK này</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProofPreviewModal 
        isOpen={!!previewImage} 
        onClose={() => setPreviewImage(null)} 
        imageUrl={previewImage} 
      />

      <RejectDialog 
        isOpen={!!rejectId} 
        onClose={() => setRejectId(null)} 
        subscriptionId={rejectId} 
      />
    </div>
  );
}
