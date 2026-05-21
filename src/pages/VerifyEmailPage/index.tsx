import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (token) {
      setStatus('pending');
      const timer = setTimeout(() => {
        setStatus('success');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [token]);

  // ── Không có token trong URL ───────────────────────────────────
  if (!token) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <span className="text-5xl" role="img" aria-label="warning">⚠️</span>
          </div>
          <CardTitle className="text-center font-bold text-xl">Liên kết không hợp lệ</CardTitle>
          <CardDescription className="text-center">
            Không tìm thấy token xác thực trong đường dẫn. Vui lòng kiểm tra lại email của bạn.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Về trang đăng nhập</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ── Đang xác thực ─────────────────────────────────────────────
  if (status === 'pending') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Đang xác thực email của bạn...</p>
        </CardContent>
      </Card>
    );
  }

  // ── Xác thực thành công ────────────────────────────────────────
  if (status === 'success') {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <span className="text-4xl" role="img" aria-label="success">✅</span>
            </div>
          </div>
          <CardTitle className="text-center font-bold text-xl">Xác thực thành công!</CardTitle>
          <CardDescription className="text-center">
            Email của bạn đã được xác thực. Tài khoản đã sẵn sàng, hãy đăng nhập để bắt đầu!
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button asChild className="w-full">
            <Link to="/login">Đăng nhập ngay</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
};

export default VerifyEmailPage;