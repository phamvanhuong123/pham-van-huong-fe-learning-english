import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface OverviewChartProps {
  data?: { name: string; users: number; exams: number }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
  // Biểu đồ fallback nếu không có data từ backend
  const chartData =
    data && data.length > 0
      ? data
      : [
          { name: 'T2', users: 0, exams: 0 },
          { name: 'T3', users: 0, exams: 0 },
          { name: 'T4', users: 0, exams: 0 },
          { name: 'T5', users: 0, exams: 0 },
          { name: 'T6', users: 0, exams: 0 },
          { name: 'T7', users: 0, exams: 0 },
          { name: 'CN', users: 0, exams: 0 },
        ]

  return (
    <Card className="col-span-4 lg:col-span-4 border shadow-sm bg-card rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Tổng quan hoạt động (7 ngày qua)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Biểu đồ thể hiện lượng người dùng và lượt làm bài thi mới.
        </p>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#888' }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Người dùng mới"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="exams"
                name="Lượt làm bài"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExams)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
