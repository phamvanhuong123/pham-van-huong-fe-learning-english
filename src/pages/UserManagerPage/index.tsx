import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { UserTable } from './components/UserTable';
import { UserFilters } from './components/UserFilters';
import { BanUserModal } from './components/BanUserModal';
import { AssignRoleModal } from './components/AssignRoleModal';

function UserManagerPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const { data, isLoading, error } = useUsers({ page, limit: 10, search, role, status });

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserIsBanned, setSelectedUserIsBanned] = useState(false);

  const handleOpenBanModal = (userId: string, isBanned: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserIsBanned(isBanned);
    setBanModalOpen(true);
  };

  const handleOpenAssignRoleModal = (userId: string) => {
    setSelectedUserId(userId);
    setAssignRoleModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản Lý Người Dùng</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý tài khoản, phân quyền và trạng thái người dùng trong hệ thống.
        </p>
      </div>

      <UserFilters 
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        role={role} onRoleChange={(v) => { setRole(v); setPage(1); }}
        status={status} onStatusChange={(v) => { setStatus(v); setPage(1); }}
      />

      <UserTable 
        users={data?.users || []} 
        pagination={data?.pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        onOpenBanModal={handleOpenBanModal}
        onOpenAssignRoleModal={handleOpenAssignRoleModal}
      />

      <BanUserModal 
        open={banModalOpen} 
        onOpenChange={setBanModalOpen} 
        userId={selectedUserId}
        isCurrentlyBanned={selectedUserIsBanned}
      />

      <AssignRoleModal
        open={assignRoleModalOpen}
        onOpenChange={setAssignRoleModalOpen}
        userId={selectedUserId}
      />
    </div>
  );
}

export default UserManagerPage;
