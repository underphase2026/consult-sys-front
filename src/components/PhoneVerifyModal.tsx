import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  phone: string;
  onVerified: (token?: string) => void;
  onClose: () => void;
  startStep?: 'initial' | 'code';
}

function PhoneVerifyModalContent({ phone, onVerified, onClose, startStep = 'initial' }: Props) {
  const [step, setStep] = useState<'initial' | 'code' | 'done'>(startStep);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [verifyToken, setVerifyToken] = useState<string | undefined>();
  
  const { sendVerificationCode, verifyCode, isLoading } = useAuth();

  useEffect(() => {
    if (step !== 'code') return;
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSendSms = async () => {
    try {
      await sendVerificationCode(phone.replace(/-/g, ''));
      setStep('code');
    } catch (err: any) {
      alert(err.message || '인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      alert('6자리 인증번호를 입력해주세요.');
      return;
    }
    try {
      const data = await verifyCode(phone.replace(/-/g, ''), code);
      setVerifyToken(data?.phoneVerifyToken);
      setStep('done');
    } catch (err: any) {
      alert(err.message || '인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[600] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[400px] bg-white rounded-xl p-5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-text-dark leading-8">휴대폰 인증</h2>

        <div className="field-group w-full">
          <label className="field-label">휴대폰 번호</label>

          {/* 1단계: 번호 확인 + 인증 버튼 */}
          {step === 'initial' && (
            <div className="input-wrap">
              <span className="inner-input text-text-dark">{phone || '-없이 숫자만 입력해주세요'}</span>
              <button
                type="button"
                className="action-btn disabled:opacity-50"
                onClick={handleSendSms}
                disabled={isLoading}
              >
                {isLoading ? '발송중' : '인증'}
              </button>
            </div>
          )}

          {/* 2단계 이후: 번호 표시 (disabled) + 재전송 or 인증완료 */}
          {(step === 'code' || step === 'done') && (
            <div className="input-wrap-gray">
              <span className="inner-input-gray">{phone || '-없이 숫자만 입력해주세요'}</span>
              {step === 'code' && (
                <button
                  type="button"
                  className="text-sm text-text-muted bg-transparent border-none cursor-pointer shrink-0 p-0 disabled:opacity-50"
                  onClick={handleSendSms}
                  disabled={isLoading}
                >
                  {isLoading ? '발송중' : '재전송'}
                </button>
              )}
              {step === 'done' && (
                <span className="text-sm text-text-muted shrink-0">인증 완료</span>
              )}
            </div>
          )}

          {/* 인증번호 입력 + 타이머 + 인증 버튼 */}
          {step === 'code' && (
            <div className="flex gap-2 mt-2">
              <div className="input-wrap flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="인증번호 6자리"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="inner-input"
                />
                <span className="text-sm text-primary shrink-0">{formatTime(timeLeft)}</span>
              </div>
              <button
                type="button"
                className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover disabled:opacity-50"
                onClick={handleVerify}
                disabled={isLoading}
              >
                인증
              </button>
            </div>
          )}
        </div>

        {/* 다음 버튼 (done 단계) */}
        {step === 'done' && (
          <div className="pt-5">
            <button type="button" className="btn-primary" onClick={() => onVerified(verifyToken)}>
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhoneVerifyModal(props: Props) {
  return createPortal(<PhoneVerifyModalContent {...props} />, document.body);
}
