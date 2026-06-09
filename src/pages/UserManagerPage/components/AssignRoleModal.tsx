import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useAssignRole } from '@/hooks/useUsers'
import { useRoles } from '@/hooks/useRoles'
import { UserCog } from 'lucide-react'

interface AssignRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function AssignRoleModal({ open, onOpenChange, userId }: AssignRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { data: roles, isLoading: loadingRoles } = useRoles()
  const { mutate: assignRole, isPending } = useAssignRole()

  const handleConfirm = () => {
    if (!userId || !selectedRole) return
    assignRole(
      { id: userId, role: selectedRole },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedRole('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <UserCog className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Phân quyền người dùng</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Chọn một vai trò mới cho người dùng. Vai trò này sẽ ghi đè lên các quyền hiện tại.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label>Vai trò</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={loadingRoles}>
              <SelectTrigger>
                <SelectValue placeholder={loadingRoles ? 'Đang tải...' : 'Chọn vai trò...'} />
              </SelectTrigger>
              <SelectContent>
                {roles
                  ?.filter((role) => role.name !== 'VIP')
                  .map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Huỷ
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !selectedRole}>
            {isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
