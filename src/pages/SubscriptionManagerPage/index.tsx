import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubscriptionTable from './components/SubscriptionTable'
import SubscriptionFilters from './components/SubscriptionFilters'
import BannedAccountsTab from './components/BannedAccountsTab'
import { useAdminSubscriptions } from '@/hooks/queries/useSubscriptionQuery'
import type { SubscriptionStatus } from '@/types/subscription.type'
export default function SubscriptionManagerPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SubscriptionStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useAdminSubscriptions({
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
    page,
    limit,
  })

  const totalPages = data?.meta?.totalPages || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Duyệt Yêu Cầu Nâng Cấp VIP
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Kiểm tra thông tin giao dịch và kích hoạt gói VIP cho học viên.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="mb-4 bg-card border">
          <TabsTrigger value="subscriptions" className="text-sm px-4 py-2">
            Danh sách Đơn
          </TabsTrigger>
          <TabsTrigger value="blacklist" className="text-sm px-4 py-2">
            Danh sách đen STK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <div className="bg-card rounded-2xl shadow-sm border p-6">
            <SubscriptionFilters
              search={search}
              setSearch={(val) => {
                setSearch(val)
                setPage(1)
              }}
              status={status}
              setStatus={(val) => {
                setStatus(val)
                setPage(1)
              }}
            />

            <SubscriptionTable data={data?.data || []} isLoading={isLoading} />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded hover:bg-muted disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded hover:bg-muted disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="blacklist">
          <BannedAccountsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
