import { Link } from 'react-router';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
        <ShieldAlert className="w-12 h-12 text-red-600" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
        403 - Không Có Quyền Truy Cập
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        Xin lỗi, bạn không có đủ quyền hạn để xem trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là một sự nhầm lẫn.
      </p>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
