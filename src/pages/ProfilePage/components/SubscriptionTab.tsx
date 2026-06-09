import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useMySubscriptions } from '@/hooks/queries/useSubscriptionQuery'
import {
  Crown,
  Calendar,
  Sparkles,
  CreditCard,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import ProofPreviewModal from '@/pages/SubscriptionManagerPage/components/ProofPreviewModal'
import { format } from 'date-fns'

import { getProfileApi } from '@/services/profileService'

export default function SubscriptionTab() {
  const { userInfo } = useAuthStore()
  const { data: subsData, isLoading } = useMySubscriptions()
  const navigate = useNavigate()

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [vipExpiresAt, setVipExpiresAt] = useState<string | null>(null)

  useEffect(() => {
    getProfileApi()
      .then((res) => {
        setVipExpiresAt(res.data.data.vipExpiresAt)
      })
      .catch(console.error)
  }, [])

  // Is VIP if authStore says so (covers Admin) or if vipExpiresAt is valid
  const isVip = userInfo?.isVip || (vipExpiresAt && new Date(vipExpiresAt) > new Date())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-rose-500" />
      case 'REVOKED':
        return <ShieldAlert className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã duyệt'
      case 'PENDING':
        return 'Đang xử lý'
      case 'REJECTED':
        return 'Từ chối'
      case 'REVOKED':
        return 'Thu hồi'
      default:
        return status
    }
  }

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 tracking-tight">Gói VIP & Thanh toán</h2>

        {/* Thẻ VIP (Digital VIP Card) */}
        <div className="mb-12">
          {isVip ? (
            <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 border border-purple-500/30">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm">
                        PRO Member
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold">{userInfo?.name || userInfo?.email}</h3>
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-300 opacity-80" />
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wider font-semibold">
                      Hạn sử dụng
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-100" />
                      <span className="text-xl font-mono tracking-wider font-medium">
                        {vipExpiresAt ? format(new Date(vipExpiresAt), 'dd/MM/yyyy') : 'Vĩnh viễn'}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md"
                  >
                    Gia hạn
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl p-8 text-slate-800 shadow-md bg-slate-100 border border-slate-200">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6 text-slate-400" />
                    <span className="text-slate-500 font-bold tracking-widest uppercase text-sm">
                      Tài khoản Thường
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Chưa đăng ký gói VIP</h3>
                  <p className="text-slate-500 text-sm max-w-md">
                    Nâng cấp VIP ngay để mở khóa toàn bộ đề thi, tính năng giải thích chi tiết
                  </p>
                </div>

                <Button
                  onClick={() => navigate('/pricing')}
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Nâng cấp VIP ngay
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lịch sử thanh toán */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Lịch sử giao dịch</h3>
          </div>

          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Đang tải lịch sử...</div>
            ) : !subsData?.data || subsData.data.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h4 className="text-lg font-medium mb-1">Chưa có giao dịch nào</h4>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Bạn chưa thực hiện bất kỳ giao dịch nâng cấp VIP nào trên hệ thống.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Mã đơn</th>
                      <th className="p-4 font-medium">Gói VIP</th>
                      <th className="p-4 font-medium">Số tiền</th>
                      <th className="p-4 font-medium">Ngày gửi</th>
                      <th className="p-4 font-medium">Trạng thái</th>
                      <th className="p-4 font-medium text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subsData.data.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {sub.transactionRef || sub.id.substring(0, 8)}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-primary">
                          {sub.plan.replace('VIP_', '').replace('_', ' ')}
                        </td>
                        <td className="p-4 font-mono font-medium">
                          {sub.amount?.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {format(new Date(sub.createdAt), 'HH:mm dd/MM/yyyy')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-medium">
                            {getStatusIcon(sub.status)}
                            <span
                              className={
                                sub.status === 'APPROVED'
                                  ? 'text-emerald-600'
                                  : sub.status === 'PENDING'
                                    ? 'text-amber-600'
                                    : 'text-rose-600'
                              }
                            >
                              {getStatusText(sub.status)}
                            </span>
                          </div>
                          {sub.rejectionReason && (
                            <p
                              className="text-xs text-rose-500 mt-1 max-w-[200px] truncate"
                              title={sub.rejectionReason}
                            >
                              Lý do: {sub.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => setPreviewImage(sub.proofUrl)}
                          >
                            <Eye className="w-4 h-4 mr-1.5" /> Biên lai
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProofPreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
      />
    </div>
  )
}
