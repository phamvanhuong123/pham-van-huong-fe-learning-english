import { Outlet } from 'react-router';
import { ClientHeader } from './components/ClientHeader';

function ClientLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClientHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ClientLayout;