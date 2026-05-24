import { useEffect } from 'react';
import { useClientExamStore } from '../store/useClientExamStore';
import { toast } from 'sonner';

export const useAntiCheat = () => {
  const { status, incrementTabSwitchCount } = useClientExamStore();

  useEffect(() => {
    if (status !== 'IN_PROGRESS') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        incrementTabSwitchCount();
        toast.warning("Cảnh báo: Bạn vừa chuyển tab. Hành vi này đã được ghi nhận trên hệ thống!", {
          id: 'anti-cheat-warn',
          duration: 5000,
          position: "top-center"
        });
      }
    };

    const handleBlur = () => {
      // Đôi khi user click ra ngoài cửa sổ duyệt web
      incrementTabSwitchCount();
      toast.warning("Cảnh báo: Bạn đã click ra ngoài vùng làm bài. Hệ thống đã ghi nhận!", {
        id: 'anti-cheat-blur',
        duration: 5000,
        position: "top-center"
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [status, incrementTabSwitchCount]);
};
