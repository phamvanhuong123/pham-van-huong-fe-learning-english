import { motion } from 'framer-motion';
import { Copy, WalletCards, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentInstructionProps {
  amount: number;
  transactionRef: string;
}

export default function PaymentInstruction({ amount, transactionRef }: PaymentInstructionProps) {
  const bankDetails = {
    bankName: 'Vietcombank',
    accountName: 'CONG TY TNHH TOEIC MASTER',
    accountNo: '0123456789',
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start"
    >
      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
        <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm border flex items-center justify-center">
          {/* Mock QR Code */}
          <div className="w-full h-full border-4 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center text-zinc-400">
            <WalletCards className="w-10 h-10 mb-2" />
            <span className="text-sm font-medium">VietQR Image</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Quét mã QR qua ứng dụng<br />ngân hàng để thanh toán nhanh
        </p>
      </div>

      {/* Details Section */}
      <div className="flex-1 w-full space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <WalletCards className="w-5 h-5 text-primary" />
            Chuyển khoản thủ công
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Hoặc sao chép thông tin bên dưới để chuyển khoản thủ công.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow 
            label="Ngân hàng" 
            value={bankDetails.bankName} 
          />
          <DetailRow 
            label="Chủ tài khoản" 
            value={bankDetails.accountName} 
          />
          <DetailRow 
            label="Số tài khoản" 
            value={bankDetails.accountNo} 
            canCopy
          />
          <DetailRow 
            label="Số tiền" 
            value={`${amount.toLocaleString('vi-VN')} VND`} 
            copyValue={amount.toString()}
            canCopy
          />
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Nội dung chuyển khoản (Bắt buộc)</span>
              <span className="font-mono text-lg font-bold text-foreground">{transactionRef}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0"
              onClick={() => handleCopy(transactionRef, 'Nội dung chuyển khoản')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200/50">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Vui lòng ghi đúng nội dung chuyển khoản để hệ thống duyệt tự động nhanh nhất. Nếu quên, bạn sẽ cần chờ Admin duyệt thủ công (tối đa 24h).
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ 
  label, 
  value, 
  canCopy = false,
  copyValue 
}: { 
  label: string, 
  value: string, 
  canCopy?: boolean,
  copyValue?: string 
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border">
      <span className="text-xs text-muted-foreground block mb-1">{label}</span>
      <div className="flex justify-between items-center">
        <span className="font-medium text-foreground truncate mr-2">{value}</span>
        {canCopy && (
          <button 
            onClick={() => {
              navigator.clipboard.writeText(copyValue || value);
              toast.success(`Đã copy ${label}`);
            }}
            className="text-muted-foreground hover:text-primary transition-colors p-1"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
