import { useEffect } from 'react';
import { useClientExamStore } from '@/store/useClientExamStore';
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

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, incrementTabSwitchCount]);
};
