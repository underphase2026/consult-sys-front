import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PasswordChangeModal from './PasswordChangeModal';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onClose: () => void;
}

function ForgotPasswordModalContent({ onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'reset'>('phone');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);

  const { sendVerificationCode, verifyCode, issueResetToken, isLoading } = useAuth();

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

  useEffect(() => {
    if (step !== 'phone' && step !== 'code') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, step]);

  const isValidPhone = (p: string) => /^01[0-9]{9}$/.test(p.replace(/[^0-9]/g, ''));
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleSendCode = async () => {
    if (!isValidPhone(phone)) { 
      setErrorMsg('올바르지 않은 번호 형식이에요'); 
      return; 
    }
    setErrorMsg('');
    
    try {
      await sendVerificationCode(phone.replace(/-/g, ''));
      setStep('code');
    } catch (err: any) {
      setErrorMsg(err.message || '인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setErrorMsg('6자리 인증번호를 입력해주세요.');
      return;
    }
    setErrorMsg('');
    try {
      await verifyCode(phone.replace(/-/g, ''), code);
      // 인증 성공 시 바로 resetToken 발급
      const rt = await issueResetToken(phone.replace(/-/g, ''));
      setResetToken(rt);
      setStep('reset');
    } catch (err: any) {
      setErrorMsg(err.message || '인증번호 확인 또는 토큰 발급에 실패했습니다.');
    }
  };

  return (
    <>
      {(step === 'phone' || step === 'code') && (
        <div
          className="fixed inset-0 bg-black/50 z-[500] flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="w-[400px] bg-white rounded-xl p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-text-dark leading-8">비밀번호 찾기</h2>

            <div className="field-group w-full mt-2">
              <label className="field-label">가입한 휴대폰 번호</label>
              
              {step === 'phone' && (
                <div className={`input-wrap ${errorMsg ? 'border-error' : ''}`}>
                  <input
                    type="tel"
                    placeholder="-없이 숫자만 입력해주세요"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    className="inner-input"
                  />
                  <button
                    type="button"
                    className="action-btn disabled:opacity-50"
                    onClick={handleSendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? '발송중' : '인증'}
                  </button>
                </div>
              )}

              {step === 'code' && (
                <>
                  <div className="input-wrap-gray">
                    <span className="inner-input-gray">{phone}</span>
                    <button
                      type="button"
                      className="text-sm text-text-muted bg-transparent border-none cursor-pointer shrink-0 p-0 disabled:opacity-50"
                      onClick={handleSendCode}
                      disabled={isLoading}
                    >
                      {isLoading ? '발송중' : '재전송'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <div className="input-wrap flex-1 min-w-0">
                      <input
                        type="text"
                        placeholder="인증번호 6자리"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          setErrorMsg('');
                        }}
                        maxLength={6}
                        className="inner-input"
                      />
                      <span className="text-sm text-primary shrink-0">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                      type="button"
                      className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover disabled:opacity-50"
                      onClick={handleVerifyCode}
                      disabled={isLoading}
                    >
                      인증
                    </button>
                  </div>
                </>
              )}

              {errorMsg && (
                <span className="text-[13px] text-error leading-6">{errorMsg}</span>
              )}
            </div>

            <div className="pt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 h-12 border border-input-border rounded-lg text-base font-normal text-text-gray bg-white cursor-pointer hover:bg-ghost-hover"
                onClick={onClose}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'reset' && resetToken && (
        <PasswordChangeModal
          resetToken={resetToken}
          onClose={onClose}
          onSuccess={() => {
            alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
            onClose();
          }}
        />
      )}
    </>
  );
}

export default function ForgotPasswordModal(props: Props) {
  return createPortal(<ForgotPasswordModalContent {...props} />, document.body);
}
