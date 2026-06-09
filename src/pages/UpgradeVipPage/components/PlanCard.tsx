import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubscriptionPlan } from '@/types/subscription.type'

interface PlanCardProps {
  plan: SubscriptionPlan
  title: string
  price: number
  originalPrice?: number
  months: number
  features: string[]
  isPopular?: boolean
  isSelected: boolean
  onSelect: (plan: SubscriptionPlan, amount: number) => void
}

export default function PlanCard({
  plan,
  title,
  price,
  originalPrice,
  months,
  features,
  isPopular,
  isSelected,
  onSelect,
}: PlanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plan, price)}
      className={cn(
        'relative p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300',
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            PHỔ BIẾN NHẤT
          </span>
        </div>
      )}

      <div className="text-center mb-6 mt-2">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <div className="mt-4 flex items-baseline justify-center gap-2">
          <span className="text-3xl font-extrabold text-foreground">
            {price.toLocaleString('vi-VN')}đ
          </span>
          <span className="text-muted-foreground font-medium">/{months} tháng</span>
        </div>
        {originalPrice && (
          <div className="mt-1">
            <span className="line-through text-muted-foreground text-sm">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-green-500 text-sm font-semibold ml-2">
              Tiết kiệm {Math.round((1 - price / originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 bg-primary/10 rounded-full p-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
