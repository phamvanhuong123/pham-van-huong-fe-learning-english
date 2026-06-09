import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ElementType } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ElementType
  description?: string
  trend?: string // Optional: e.g. "+12.5%"
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card className="border border-border/50 shadow-sm bg-card hover:border-primary/50 transition-colors duration-200 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[13px] font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-[15px] h-[15px] text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
          {trend && (
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        {description && <p className="text-[13px] text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
