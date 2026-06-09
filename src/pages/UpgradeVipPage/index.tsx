import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, CheckCircle2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import PlanCard from './components/PlanCard'
import PaymentInstruction from './components/PaymentInstruction'
import UploadProof from './components/UploadProof'
import type { SubscriptionPlan } from '@/types/subscription.type'
import { useCreateSubscription } from '@/hooks/queries/useSubscriptionQuery'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'

type Step = 'SELECT_PLAN' | 'PAYMENT' | 'SUCCESS'

export default function UpgradeVipPage() {
  const [step, setStep] = useState<Step>('SELECT_PLAN')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('VIP_1_MONTH')
  const [selectedAmount, setSelectedAmount] = useState<number>(49000)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string>('')

  const user = useAuthStore((state) => state.userInfo)
  const navigate = useNavigate()
  const { mutateAsync: createSubscription, isPending } = useCreateSubscription()

  // Generate unique transaction ref format: TOEIC_{USER_ID_SUFFIX}
  // Simplified for mockup, backend handles verification
  const transactionRef = `TOEIC_${user?.email?.split('@')[0].toUpperCase() || 'VIP'}_${new Date().getTime().toString().slice(-4)}`

  const handlePlanSelect = (plan: SubscriptionPlan, amount: number) => {
    setSelectedPlan(plan)
    setSelectedAmount(amount)
  }

  const handleContinueToPayment = () => {
    setStep('PAYMENT')
  }

  const handleSubmit = async () => {
    if (!proofFile) {
      setUploadError('Vui lòng tải lên ảnh chụp giao dịch')
      return
    }
    setUploadError('')

    try {
      await createSubscription({
        plan: selectedPlan,
        amount: selectedAmount,
        bankAccountNo: '0123456789', // Target bank account
        transactionRef,
        image: proofFile,
      })
      setStep('SUCCESS')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"
          >
            <Crown className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Nâng cấp{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary">
              TOEIC Master VIP
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Mở khóa toàn bộ kho đề thi độc quyền, lộ trình học cá nhân hóa và tính năng Flashcard
            SM-2 nâng cao.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'SELECT_PLAN' && (
            <motion.div
              key="step-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlanCard
                  plan="VIP_1_MONTH"
                  title="1 Tháng"
                  price={49000}
                  months={1}
                  features={[
                    'Truy cập toàn bộ đề thi Part 1-7',
                    'Luyện tập ngữ pháp VIP',
                    'Hệ thống Flashcard thông minh',
                  ]}
                  isSelected={selectedPlan === 'VIP_1_MONTH'}
                  onSelect={handlePlanSelect}
                />
                <PlanCard
                  plan="VIP_3_MONTH"
                  title="3 Tháng"
                  price={129000}
                  originalPrice={147000}
                  months={3}
                  isPopular
                  features={[
                    'Mọi quyền lợi của gói 1 Tháng',
                    'Ưu tiên hỗ trợ từ Mentor',
                    'Lộ trình cá nhân hóa',
                    'Bảo lưu khóa học 1 lần',
                  ]}
                  isSelected={selectedPlan === 'VIP_3_MONTH'}
                  onSelect={handlePlanSelect}
                />
                <PlanCard
                  plan="VIP_6_MONTH"
                  title="6 Tháng"
                  price={219000}
                  originalPrice={294000}
                  months={6}
                  features={[
                    'Mọi quyền lợi của gói 3 Tháng',
                    'Tặng bộ sách TOEIC PDF',
                    'Bảo lưu khóa học 2 lần',
                  ]}
                  isSelected={selectedPlan === 'VIP_6_MONTH'}
                  onSelect={handlePlanSelect}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="rounded-full px-12 h-14 text-lg font-semibold shadow-lg shadow-primary/25"
                  onClick={handleContinueToPayment}
                >
                  Tiếp tục thanh toán
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'PAYMENT' && (
            <motion.div
              key="step-payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <Button
                variant="ghost"
                className="mb-2 -ml-4 text-muted-foreground"
                onClick={() => setStep('SELECT_PLAN')}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Quay lại chọn gói
              </Button>

              <PaymentInstruction amount={selectedAmount} transactionRef={transactionRef} />

              <div className="bg-card border rounded-2xl p-6 md:p-8">
                <UploadProof onFileSelect={setProofFile} error={uploadError} />

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4 items-center justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('SELECT_PLAN')}
                    disabled={isPending}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-full sm:w-auto px-8"
                  >
                    {isPending ? 'Đang gửi...' : 'Gửi yêu cầu nâng cấp'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center bg-card border rounded-3xl p-10 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-4">Gửi yêu cầu thành công!</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Hóa đơn của bạn đã được gửi tới hệ thống. Chúng tôi sẽ kiểm tra và kích hoạt gói VIP
                cho bạn trong vòng tối đa{' '}
                <span className="font-semibold text-foreground">24 giờ</span> làm việc.
              </p>

              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate('/profile')} // Assuming profile page has a section to view status
              >
                Về trang cá nhân
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
