import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExamsPaginationProps {
  page: number
  totalPages: number
  setPage: (page: number | ((p: number) => number)) => void
}

export const ExamsPagination: React.FC<ExamsPaginationProps> = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="h-10 w-10 rounded-md border-gray-200"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1
          // Simple logic to show limited pages
          if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
            if (p === 2 || p === totalPages - 1)
              return (
                <span key={p} className="px-2 self-center text-gray-400">
                  ...
                </span>
              )
            return null
          }
          return (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              onClick={() => setPage(p)}
              className={`h-10 w-10 rounded-md font-medium ${p === page ? 'bg-blue-600 shadow-sm' : 'border-gray-200 text-gray-600 hover:text-blue-600'}`}
            >
              {p}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="h-10 w-10 rounded-md border-gray-200"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
