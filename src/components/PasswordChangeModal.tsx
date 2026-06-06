import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onClose: () => void;
  resetToken: string;
  onSuccess?: () => void;
}

function PasswordChangeModalContent({ onClose, resetToken, onSuccess }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { forgotPassword } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('비밀번호는 영문, 숫자 포함 8~20자여야 합니다.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsUpdating(true);
    try {
      await forgotPassword(resetToken, newPassword);
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[500] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[400px] bg-white rounded-xl p-5 flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-text-dark leading-8">새 비밀번호를 입력해 주세요</h2>

        <div className="field-group w-full mt-2">
          <label className="field-label">새 비밀번호</label>
          <input 
            type="password" 
            placeholder="영문, 숫자 포함 8~20자" 
            className="form-input mb-2" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="비밀번호를 한 번 더 입력해 주세요" 
            className="form-input" 
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          {errorMsg && <span className="text-[13px] text-error leading-6">{errorMsg}</span>}
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
            className="flex-1 h-12 rounded-lg text-base font-semibold text-white bg-primary border-none cursor-pointer hover:bg-primary-hover disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? '변경중...' : '비밀번호 변경'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PasswordChangeModal(props: Props) {
  return createPortal(<PasswordChangeModalContent {...props} />, document.body);
}