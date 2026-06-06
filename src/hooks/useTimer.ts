import { useState, useEffect, useCallback } from 'react';

/**
 * sessionStorage를 활용해 화면 전환이나 언마운트 시에도 
 * 남은 시간을 보존하는 태블릿 호환 타이머 커스텀 훅
 */
export default function useTimer(initialSeconds: number, storageKey?: string) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (storageKey) {
      const savedEndTime = sessionStorage.getItem(`${storageKey}_endTime`);
      if (savedEndTime) {
        const remaining = Math.floor((parseInt(savedEndTime, 10) - Date.now()) / 1000);
        if (remaining > 0) return remaining;
        sessionStorage.removeItem(`${storageKey}_endTime`);
      }
    }
    return initialSeconds;
  });

  const [isActive, setIsActive] = useState(() => {
    if (storageKey) {
      const savedEndTime = sessionStorage.getItem(`${storageKey}_endTime`);
      if (savedEndTime) {
        return Math.floor((parseInt(savedEndTime, 10) - Date.now()) / 1000) > 0;
      }
    }
    return false;
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (storageKey) sessionStorage.removeItem(`${storageKey}_endTime`);
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      if (storageKey) sessionStorage.removeItem(`${storageKey}_endTime`);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, storageKey]);

  const start = useCallback(() => {
    setIsActive(true);
    if (storageKey) {
      sessionStorage.setItem(`${storageKey}_endTime`, (Date.now() + timeLeft * 1000).toString());
    }
  }, [storageKey, timeLeft]);

  const stop = useCallback(() => {
    setIsActive(false);
    if (storageKey) sessionStorage.removeItem(`${storageKey}_endTime`);
  }, [storageKey]);

  const reset = useCallback((seconds: number = initialSeconds) => {
    setIsActive(false);
    setTimeLeft(seconds);
    if (storageKey) sessionStorage.removeItem(`${storageKey}_endTime`);
  }, [initialSeconds, storageKey]);

  const formatTime = useCallback(() => {
    const m = Math.floor(timeLeft / 60).toString();
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [timeLeft]);

  return { timeLeft, isActive, start, stop, reset, formatTime };
}
