import { useState } from 'react';
import { User, Shield, BarChart3, MonitorSmartphone, Crown } from 'lucide-react';
import ProfileInfoTab from './components/ProfileInfoTab';
import SecurityTab from './components/SecurityTab';
import StatsTab from './components/StatsTab';
import SessionsTab from './components/SessionsTab';
import SubscriptionTab from './components/SubscriptionTab';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Hồ sơ', icon: User, component: ProfileInfoTab },
  { id: 'security', label: 'Bảo mật', icon: Shield, component: SecurityTab },
  { id: 'stats', label: 'Thống kê', icon: BarChart3, component: StatsTab },
  { id: 'sessions', label: 'Thiết bị', icon: MonitorSmartphone, component: SessionsTab },
  { id: 'subscription', label: 'Gói VIP & Thanh toán', icon: Crown, component: SubscriptionTab },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ProfileInfoTab;

  return (
    <div className="container mx-auto max-w-6xl py-8 md:py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Cài đặt tài khoản</h1>

            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl shadow-sm min-h-[500px] overflow-hidden transition-all duration-300">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
