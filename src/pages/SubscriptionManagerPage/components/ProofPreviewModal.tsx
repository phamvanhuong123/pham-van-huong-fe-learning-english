import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProofPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ProofPreviewModal({ isOpen, onClose, imageUrl }: ProofPreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-transparent border-none shadow-none p-0">
        <div className="relative flex items-center justify-center w-full h-[80vh]">
          <img 
            src={imageUrl} 
            alt="Proof of payment" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
