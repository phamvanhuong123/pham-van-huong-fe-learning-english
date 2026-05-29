import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  isLoading?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Xác nhận xoá?",
  description = "Bạn có chắc chắn muốn xoá dữ liệu này không? Hành động này không thể hoàn tác.",
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-rose-600 mb-2">
            <div className="p-2 rounded-full bg-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Huỷ
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-rose-600 text-white hover:bg-rose-700"
            disabled={isLoading}
          >
            {isLoading ? "Đang xoá..." : "Xác nhận xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
