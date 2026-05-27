import { useState } from 'react';
import { Ban, Trash2, Plus } from 'lucide-react';
import { useBannedBankAccounts, useBanBankAccount, useUnbanBankAccount } from '@/hooks/queries/useSubscriptionQuery';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function BannedAccountsTab() {
  const { data: accounts, isLoading } = useBannedBankAccounts();
  const banMutation = useBanBankAccount();
  const unbanMutation = useUnbanBankAccount();
  
  const [newAccount, setNewAccount] = useState('');
  const [reason, setReason] = useState('');
  
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    unbanId: string | null;
  }>({ isOpen: false, unbanId: null });

  const handleBan = () => {
    if (!newAccount) {
      toast.error('Vui lòng nhập số tài khoản');
      return;
    }
    banMutation.mutate({ bankAccountNo: newAccount, reason }, {
      onSuccess: () => {
        toast.success('Đã đưa vào danh sách đen');
        setNewAccount('');
        setReason('');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    });
  };

  const handleUnban = (id: string) => {
    setConfirmState({ isOpen: true, unbanId: id });
  };

  const executeUnban = () => {
    if (!confirmState.unbanId) return;
    unbanMutation.mutate(confirmState.unbanId, {
      onSuccess: () => {
        toast.success('Đã gỡ chặn thành công');
        setConfirmState({ isOpen: false, unbanId: null });
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        setConfirmState({ isOpen: false, unbanId: null });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-6 space-y-6">
      <div className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Số Tài Khoản</label>
          <input 
            type="text" 
            className="w-full h-10 px-3 rounded-md border bg-background" 
            placeholder="Ví dụ: 1903423423"
            value={newAccount}
            onChange={(e) => setNewAccount(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Lý do chặn (tuỳ chọn)</label>
          <input 
            type="text" 
            className="w-full h-10 px-3 rounded-md border bg-background" 
            placeholder="Lừa đảo, nộp biên lai giả..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button 
          onClick={handleBan}
          disabled={banMutation.isPending}
          className="h-10 px-4 bg-destructive text-destructive-foreground rounded-md flex items-center gap-2 hover:bg-destructive/90 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Chặn STK này
        </button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Số Tài Khoản</th>
              <th className="p-4 font-medium">Lý do</th>
              <th className="p-4 font-medium">Người khóa</th>
              <th className="p-4 font-medium">Thời gian khóa</th>
              <th className="p-4 font-medium w-24 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {accounts?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Chưa có tài khoản nào trong danh sách đen
                </td>
              </tr>
            ) : (
              accounts?.map((acc: any) => (
                <tr key={acc.id} className="hover:bg-muted/50">
                  <td className="p-4 font-bold text-destructive flex items-center gap-2">
                    <Ban className="w-4 h-4" /> {acc.bankAccountNo}
                  </td>
                  <td className="p-4 text-muted-foreground">{acc.reason || '-'}</td>
                  <td className="p-4">{acc.admin?.name || acc.admin?.email || 'N/A'}</td>
                  <td className="p-4">{new Date(acc.bannedAt).toLocaleString('vi-VN')}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleUnban(acc.id)}
                      disabled={unbanMutation.isPending}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Gỡ chặn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState(prev => ({ ...prev, isOpen }))}
        onConfirm={executeUnban}
        title="Xác nhận gỡ chặn"
        description="Bạn có chắc muốn gỡ STK này khỏi danh sách đen?"
        variant="destructive"
      />
    </div>
  );
}
