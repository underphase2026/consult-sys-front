import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PhoneVerifyModal from './PhoneVerifyModal';

interface Props {
  onClose: () => void;
}

function PhoneChangeModalContent({ onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (showVerify) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, showVerify]);

  const handleChange = () => {
    if (!verified) {
      setError(true);
      return;
    }
    onClose();
  };

  const isValidPhone = (p: string) => /^01[0-9]{9}$/.test(p.replace(/[^0-9]/g, ''));

  const handlePhoneInput = (v: string) => {
    setPhone(v);
    setError(false);
    setVerified(false);
  };

  const handleSendCode = () => {
    if (!isValidPhone(phone)) { setError(true); return; }
    setError(false);
    setShowVerify(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[500] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="w-[400px] bg-white rounded-xl p-5 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-text-dark leading-8">휴대폰 번호 변경</h2>

          <div className="field-group w-full">
            <label className="field-label">변경할 휴대폰 번호</label>
            <div className={`input-wrap ${error ? 'border-error' : ''}`}>
              <input
                type="tel"
                placeholder="-없이 숫자만 입력해주세요"
                value={phone}
                onChange={(e) => handlePhoneInput(e.target.value)}
                className="inner-input"
              />
              <button
                type="button"
                className="action-btn"
                onClick={handleSendCode}
              >
                {verified ? '인증 완료' : '인증'}
              </button>
            </div>
            {error && (
              <span className="text-[13px] text-error leading-6">가입되지 않은 번호예요</span>
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
            <button
              type="button"
              className="flex-1 h-12 rounded-lg text-base font-semibold text-white bg-primary border-none cursor-pointer hover:bg-primary-hover"
              onClick={handleChange}
            >
              변경하기
            </button>
          </div>
        </div>
      </div>

      {showVerify && (
        <PhoneVerifyModal
          phone={phone}
          startStep="code"
          onVerified={() => { setVerified(true); setShowVerify(false); }}
          onClose={() => setShowVerify(false)}
        />
      )}
    </>
  );
}

export default function PhoneChangeModal(props: Props) {
  return createPortal(<PhoneChangeModalContent {...props} />, document.body);
}