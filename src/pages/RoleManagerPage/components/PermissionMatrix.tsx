import { usePermissions, useRolePermissions, useUpdateRolePermissions } from '@/hooks/useRoles'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

interface PermissionMatrixProps {
  roleId: string | null
}

export function PermissionMatrix({ roleId }: PermissionMatrixProps) {
  const { data: allPermissions, isLoading: loadingAll } = usePermissions()
  const { data: rolePermissions, isLoading: loadingRolePerms } = useRolePermissions(roleId || '')
  const { mutate: updatePermissions, isPending } = useUpdateRolePermissions()

  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPerms(new Set(rolePermissions))
    } else {
      setSelectedPerms(new Set())
    }
  }, [rolePermissions, roleId])

  if (!roleId) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
        <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
        <p>Chọn một vai trò bên trái để xem và quản lý phân quyền.</p>
      </Card>
    )
  }

  if (loadingAll || loadingRolePerms) {
    return (
      <Card className="h-full p-6 space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    )
  }

  if (!allPermissions) return null

  // Group permissions by 'group' field
  const groupedPerms = allPermissions.reduce(
    (acc, perm) => {
      const group = perm.group || 'Khác'
      if (!acc[group]) acc[group] = []
      acc[group].push(perm)
      return acc
    },
    {} as Record<string, typeof allPermissions>
  )

  const handleToggle = (permId: string) => {
    const next = new Set(selectedPerms)
    if (next.has(permId)) {
      next.delete(permId)
    } else {
      next.add(permId)
    }
    setSelectedPerms(next)
  }

  const handleSave = () => {
    if (roleId) {
      updatePermissions({ id: roleId, permissionIds: Array.from(selectedPerms) })
    }
  }

  const hasChanges = () => {
    if (!rolePermissions) return false
    if (selectedPerms.size !== rolePermissions.length) return true
    for (const p of rolePermissions) {
      if (!selectedPerms.has(p)) return true
    }
    return false
  }

  return (
    <Card className="h-full flex flex-col shadow-sm border">
      <CardHeader>
        <CardTitle>Ma trận Phân quyền</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-6">
        {Object.entries(groupedPerms).map(([group, perms]) => (
          <div key={group} className="space-y-3">
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">{group}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed rounded-xl p-5 bg-zinc-50/50 dark:bg-zinc-900/20">
              {perms.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                >
                  <Checkbox
                    id={`perm-${perm.id}`}
                    checked={selectedPerms.has(perm.id)}
                    onCheckedChange={() => handleToggle(perm.id)}
                    className="mt-0.5"
                  />
                  <div
                    className="grid gap-1.5 leading-none cursor-pointer"
                    onClick={() => handleToggle(perm.id)}
                  >
                    <Label
                      htmlFor={`perm-${perm.id}`}
                      className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
                    >
                      {perm.description || perm.code}
                    </Label>
                    <p className="text-[10px] text-muted-foreground">{perm.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between bg-muted/10">
        <div className="text-sm text-muted-foreground">
          Đã chọn: <span className="font-bold text-foreground">{selectedPerms.size}</span> /{' '}
          {allPermissions.length} quyền
        </div>
        <Button onClick={handleSave} disabled={isPending || !hasChanges()}>
          {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </CardFooter>
    </Card>
  )
}
