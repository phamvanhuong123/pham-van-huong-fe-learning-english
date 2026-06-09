import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadProofProps {
  onFileSelect: (file: File | null) => void
  error?: string
}

export default function UploadProof({ onFileSelect, error }: UploadProofProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng upload file ảnh (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    onFileSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setPreviewUrl(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Tải lên hóa đơn
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Chụp ảnh màn hình giao dịch chuyển khoản thành công và tải lên đây.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!previewUrl ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-zinc-50 dark:bg-zinc-900/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-1">
                  Click hoặc kéo thả ảnh vào đây
                </p>
                <p className="text-sm text-muted-foreground">Hỗ trợ JPG, PNG, WEBP (Tối đa 2MB)</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative border rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/3] md:aspect-[16/9] w-full flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt="Proof preview"
                className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full shadow-md w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-card border-t p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Ảnh đã tải lên thành công
              </span>
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Đổi ảnh khác
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  )
}
