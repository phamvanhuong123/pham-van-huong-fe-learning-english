import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface AdminTableLoadingProps {
  columns?: number
  rows?: number
}

export function AdminTableLoading({ columns = 5, rows = 5 }: AdminTableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-4">
              <Skeleton className="h-5 w-full max-w-[80%] rounded-md" />
              {colIndex === 0 && <Skeleton className="h-3 w-1/2 mt-2 rounded-md" />}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
