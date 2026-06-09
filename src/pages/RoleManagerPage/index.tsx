import { useState } from 'react'
import { RoleList } from './components/RoleList'
import { PermissionMatrix } from './components/PermissionMatrix'

function RoleManagerPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  return (
    <div className="p-8 h-[calc(100vh-theme(spacing.16))] flex flex-col animate-fade-in">
      <div className="mb-6 shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">Quản Lý Phân Quyền (RBAC)</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý các vai trò trong hệ thống và cấu hình quyền hạn (permissions) cho từng vai trò.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Cột trái: Danh sách Role */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col h-full border-r pr-6">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg font-semibold">Danh sách Vai trò</h3>
          </div>
          <div className="flex-1 overflow-auto pr-2">
            <RoleList onSelectRole={setSelectedRoleId} selectedRoleId={selectedRoleId} />
          </div>
        </div>

        {/* Cột phải: Permission Matrix */}
        <div className="md:col-span-8 lg:col-span-9 h-full">
          <PermissionMatrix roleId={selectedRoleId} />
        </div>
      </div>
    </div>
  )
}

export default RoleManagerPage
