import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyEmailApi } from '@/services/authServices';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          setStatus('pending');
          await verifyEmailApi(token);
          setStatus('success');
        } catch (error) {
          setStatus('error');
        }
      };
      verify();
    }
  }, [token]);


  if (!token) {
    return (
      <Card className="w-full max-w-[400px] mx-auto border border-border/75 bg-card shadow-xl rounded-2xl relative overflow-hidden text-center animate-fade-in duration-200">
        <CardHeader className="space-y-3 pb-3 pt-5 px-6">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-extrabold tracking-tight text-foreground">Liên kết không hợp lệ</CardTitle>
            <CardDescription className="text-muted-foreground/80 text-xs px-2 leading-relaxed">
              Không tìm thấy mã xác thực trong đường dẫn. Vui lòng kiểm tra lại email hoặc thử đăng ký lại.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="pt-2 pb-4 px-6 w-full flex flex-col">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3 rounded-xl text-sm">
            <Link to="/login">Trở lại đăng nhập</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }


  if (status === 'pending') {
    return (
      <Card className="w-full max-w-[400px] mx-auto border border-border/75 bg-card shadow-xl rounded-2xl relative overflow-hidden text-center py-8 animate-fade-in duration-200">
        <CardContent className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-xs font-medium">Đang xác thực tài khoản của bạn...</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-[400px] mx-auto border border-border/75 bg-card shadow-xl rounded-2xl relative overflow-hidden text-center animate-fade-in duration-200">
        <CardHeader className="space-y-3 pb-3 pt-5 px-6">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 animate-pulse">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-extrabold tracking-tight text-foreground">Xác thực thành công!</CardTitle>
            <CardDescription className="text-muted-foreground/80 text-xs px-2 leading-relaxed">
              Tài khoản của bạn đã được xác minh hoàn tất. Hãy đăng nhập ngay để bắt đầu rèn luyện TOEIC nhé!
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="pt-2 pb-4 px-6 w-full flex flex-col">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3 rounded-xl text-sm">
            <Link to="/login">Đăng nhập ngay</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-[400px] mx-auto border border-border/75 bg-card shadow-xl rounded-2xl relative overflow-hidden text-center animate-fade-in duration-200">
        <CardHeader className="space-y-3 pb-3 pt-5 px-6">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Xác thực thất bại</CardTitle>
            <CardDescription className="text-muted-foreground/80 text-xs px-2 leading-relaxed">
              Đường dẫn xác minh không chính xác hoặc đã hết hạn. Vui lòng đăng ký lại để nhận liên kết mới.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="pt-2 pb-4 px-6 w-full flex flex-col gap-2">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3 rounded-xl text-sm">
            <Link to="/login">Trở lại đăng nhập</Link>
          </Button>
          <Button asChild variant="outline" className="w-full hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 py-3 rounded-xl text-sm border-border/80">
            <Link to="/register">Đăng ký tài khoản mới</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
};

export default VerifyEmailPage;