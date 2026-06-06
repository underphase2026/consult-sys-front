import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

export type AuthStep = 'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING' | 'VERIFIED';

/**
 * 의존성 주입(DI) 인터페이스.
 * 전자 계약, CRM 등 어느 도메인에서도 사용할 수 있도록 네트워크 레이어를 외부에서 주입받습니다.
 */
export interface PhoneAuthDependencies {
  apiSendCode: (phone: string) => Promise<void | boolean>;
  apiVerifyCode: (phone: string, code: string) => Promise<{ phoneVerifyToken?: string; token?: string }>;
}

/**
 * V3 최종 리팩토링: 상태 보존, 메모리 누수 방어, 완벽한 의존성 격리가 적용된 본인인증 훅.
 */
export function usePhoneAuth({ apiSendCode, apiVerifyCode }: PhoneAuthDependencies) {
  // 태블릿의 빈번한 화면 분할/회전 시 상태 증발 방지를 위한 스토리지 키
  const STORAGE_KEY = 'phone_auth_step';
  
  const [step, setStep] = useState<AuthStep>(() => (sessionStorage.getItem(STORAGE_KEY) as AuthStep) || 'IDLE');
  const [verifyToken, setVerifyToken] = useState<string | null>(() => sessionStorage.getItem(`${STORAGE_KEY}_token`) || null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(() => sessionStorage.getItem(`${STORAGE_KEY}_phone`) || null);
  
  // 렌더링 발작을 막기 위해 1초마다 갱신되는 timeLeft 대신, 종료 시점(endTime)만 상태로 가집니다.
  const [timerEndTime, setTimerEndTime] = useState<number | null>(() => {
    const saved = sessionStorage.getItem(`${STORAGE_KEY}_endtime`);
    if (saved && parseInt(saved, 10) > Date.now()) return parseInt(saved, 10);
    return null;
  });

  // 메모리 누수(Memory Leak) 차단을 위한 마운트 추적 ref
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const updateStep = useCallback((newStep: AuthStep) => {
    if (!isMounted.current) return;
    setStep(newStep);
    sessionStorage.setItem(STORAGE_KEY, newStep);
  }, []);

  const setTimer = useCallback((durationSec: number) => {
    const end = Date.now() + durationSec * 1000;
    setTimerEndTime(end);
    sessionStorage.setItem(`${STORAGE_KEY}_endtime`, end.toString());
  }, []);

  const clearTimer = useCallback(() => {
    setTimerEndTime(null);
    sessionStorage.removeItem(`${STORAGE_KEY}_endtime`);
  }, []);

  const isTimerActive = useCallback(() => {
    return timerEndTime !== null && timerEndTime > Date.now();
  }, [timerEndTime]);

  const requestCode = useCallback(async (phoneNumber: string) => {
    if (step === 'SENDING' || isTimerActive()) return; // 어뷰징 차단
    
    updateStep('SENDING');
    try {
      await apiSendCode(phoneNumber.replace(/-/g, ''));
      if (!isMounted.current) return; // 언마운트 시 콜백 캔슬
      
      updateStep('SENT');
      setTimer(300);
    } catch (err: any) {
      if (isMounted.current) updateStep('IDLE');
      throw err;
    }
  }, [step, isTimerActive, apiSendCode, updateStep, setTimer]);

  const confirmCode = useCallback(async (phoneNumber: string, code: string) => {
    if (step !== 'SENT' || step === 'VERIFYING') return;
    
    updateStep('VERIFYING');
    try {
      const plainPhone = phoneNumber.replace(/-/g, '');
      const data = await apiVerifyCode(plainPhone, code);
      if (!isMounted.current) return;
      
      const token = data?.phoneVerifyToken || data?.token || ''; 
      setVerifyToken(token);
      sessionStorage.setItem(`${STORAGE_KEY}_token`, token);
      
      // 악의적인 데이터 조작 방어를 위해 인증 성공 시점의 번호 기억 (Cross Validation용)
      setVerifiedPhone(plainPhone);
      sessionStorage.setItem(`${STORAGE_KEY}_phone`, plainPhone);
      
      updateStep('VERIFIED');
      clearTimer();
    } catch (err: any) {
      if (isMounted.current) updateStep('SENT');
      throw err;
    }
  }, [step, apiVerifyCode, updateStep, clearTimer]);

  const resetAuth = useCallback(() => {
    updateStep('IDLE');
    setVerifyToken(null);
    setVerifiedPhone(null);
    sessionStorage.removeItem(`${STORAGE_KEY}_token`);
    sessionStorage.removeItem(`${STORAGE_KEY}_phone`);
    clearTimer();
  }, [updateStep, clearTimer]);

  const handleTimerExpire = useCallback(() => {
    if (step === 'SENT') updateStep('IDLE');
    clearTimer();
  }, [step, updateStep, clearTimer]);

  // 참조 투명성 보장을 위한 완벽한 메모이제이션
  return useMemo(() => ({
    step,
    verifyToken,
    verifiedPhone,
    timerEndTime,
    isTimerActive,
    handleTimerExpire,
    requestCode,
    confirmCode,
    resetAuth,
  }), [step, verifyToken, verifiedPhone, timerEndTime, isTimerActive, handleTimerExpire, requestCode, confirmCode, resetAuth]);
}
