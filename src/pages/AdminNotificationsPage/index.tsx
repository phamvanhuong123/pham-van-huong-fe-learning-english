import { BroadcastForm } from './components/BroadcastForm'
import { BroadcastHistory } from './components/BroadcastHistory'

function AdminNotificationsPage() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hệ Thống Thông Báo</h2>
        <p className="text-muted-foreground mt-2">
          Gửi thông báo real-time tới người dùng đang online (Broadcast) và xem lịch sử phát sóng.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <BroadcastForm />
        </section>

        <section className="pt-6 border-t border-border/50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Lịch sử phát sóng</h3>
            <p className="text-sm text-muted-foreground">Danh sách các thông báo đã được gửi đi.</p>
          </div>
          <BroadcastHistory />
        </section>
      </div>
    </div>
  )
}

export default AdminNotificationsPage
