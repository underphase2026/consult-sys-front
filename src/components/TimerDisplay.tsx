import React, { useState, useEffect } from 'react';

interface TimerDisplayProps {
  endTime: number | null;
  onExpire?: () => void;
}

/**
 * 렌더링 성능 최적화(Timer Isolation)를 위한 컴포넌트.
 * 부모 컴포넌트(SignUp)가 매초 리렌더링되는 것을 막기 위해,
 * 1초마다 틱(tick)이 일어나는 카운트다운 로직을 이 컴포넌트 내부에 격리합니다.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = React.memo(({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!endTime || timeLeft <= 0) return null;

  const m = Math.floor(timeLeft / 60).toString();
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <span className="absolute right-3 text-sm text-primary shrink-0">
      {m}:{s}
    </span>
  );
});

export default TimerDisplay;
