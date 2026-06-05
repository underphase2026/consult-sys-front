import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import signUpImg from '../images/sign-up.svg';
import useTimer from '../hooks/useTimer';
import { useAuth } from '../hooks/useAuth';

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 cursor-pointer">
      <path
        d="M5 12L9 16L19 7"
        stroke={checked ? '#1a80ff' : '#9ca3af'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const AGREE_ITEMS = [
  { label: '(필수) 이용 약관 동의' },
  { label: '(필수) 개인정보 수집 동의' },
  { label: '(선택) 마케팅 수신 동의' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'owner' | 'staff'>('owner');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState([false, false, false]);

  const timer = useTimer(300);

  const toggleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgrees([next, next, next]);
  };

  const toggleAgree = (i: number) => {
    const next = agrees.map((v, idx) => (idx === i ? !v : v));
    setAgrees(next);
    setAgreeAll(next.every(Boolean));
  };

  const { sendVerificationCode, verifyCode } = useAuth();

  const handleSendVerificationCode = async () => {
    if (!phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    try {
      await sendVerificationCode(phone.replace(/-/g, ''));
      setIsVerificationVisible(true);
      setIsPhoneDisabled(true);
      timer.reset(300);
      timer.start();
      alert('인증번호가 발송되었습니다.');
    } catch (error: any) {
      alert(error.message || '오류가 발생했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('6자리 인증번호를 입력해주세요.');
      return;
    }
    try {
      await verifyCode(phone.replace(/-/g, ''), verificationCode);
      timer.stop();
      setIsVerificationVisible(false);
      setIsVerified(true);
    } catch (error: any) {
      alert(error.message || '오류가 발생했습니다.');
    }
  };

  return (
    <div className="app-page">
      <PublicHeader />
      <main className="main-top">
        <div className="form-card">
          <div className="w-full h-20 flex items-center justify-center">
            <img src={signUpImg} alt="회원가입" className="w-14 h-14 object-contain" />
          </div>

          <div className="w-full text-center mb-7">
            <span className="block text-xl font-semibold text-text-dark leading-7">회원가입</span>
            <span className="block text-base font-normal text-text-gray leading-7">매장 대표님이신가요, 직원이신가요?</span>
          </div>

          <div className="role-row">
            <button
              className={`role-btn-base ${role === 'owner' ? 'role-btn-active' : 'role-btn-inactive'}`}
              onClick={() => setRole('owner')}
            >
              매장 대표
            </button>
            <button
              className={`role-btn-base ${role === 'staff' ? 'role-btn-active' : 'role-btn-inactive'}`}
              onClick={() => setRole('staff')}
            >
              매장 직원
            </button>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={(e) => { e.preventDefault(); navigate('/complete-sign-up'); }}
          >
            <div className="field-group">
              <label className="field-label">이름</label>
              <input
                type="text" placeholder="홍길동" value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">휴대폰 번호</label>
              <div className="input-wrap">
                <input
                  type="tel" placeholder="-없이 숫자만 입력해주세요" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`inner-input ${isPhoneDisabled || isVerified ? 'bg-gray-50 cursor-not-allowed text-text-gray' : ''}`}
                  disabled={isPhoneDisabled || isVerified}
                />
                <button 
                  type="button" 
                  className="action-btn shrink-0"
                  onClick={handleSendVerificationCode}
                  disabled={isVerified}
                >
                  {isVerified ? '인증 완료' : (isPhoneDisabled ? '재전송' : '인증')}
                </button>
              </div>
              {isVerificationVisible && (
                <div className="input-wrap mt-2 relative">
                  <input
                    type="text" placeholder="인증번호 6자리 입력" value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="inner-input pr-16"
                    maxLength={6}
                  />
                  {(timer.isActive || timer.timeLeft === 0) && (
                    <span className="absolute right-24 text-[13px] font-medium text-red-500">
                      {timer.formatTime()}
                    </span>
                  )}
                  <button 
                    type="button" 
                    className="action-btn shrink-0"
                    onClick={handleVerifyCode}
                  >
                    확인
                  </button>
                </div>
              )}
            </div>

            <div className="field-group">
              <div className="label-row">
                <label className="field-label">이메일</label>
                <span className="label-optional">(선택)</span>
              </div>
              <input
                type="email" placeholder="example@yo-jeong.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">비밀번호</label>
              <input
                type="password" placeholder="영문, 숫자 포함 8~20자" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">비밀번호 확인</label>
              <input
                type="password" placeholder="비밀번호를 한 번 더 입력해 주세요" value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="form-input"
              />
            </div>

            <div
              className="flex items-center gap-2 pb-2 border-b border-input-border cursor-pointer mt-5"
              onClick={toggleAgreeAll}
            >
              <CheckIcon checked={agreeAll} />
              <span className="text-[15px] font-medium text-text-gray">전체동의</span>
            </div>

            {AGREE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleAgree(i)}>
                  <CheckIcon checked={agrees[i]} />
                  <span className="text-sm text-text-gray leading-6">{item.label}</span>
                </div>
                <span
                  className="text-[13px] text-text-muted cursor-pointer underline"
                  onClick={(e) => { e.stopPropagation(); navigate('/terms'); }}
                >
                  더보기
                </span>
              </div>
            ))}

            <div className="submit-wrap pb-5">
              <button type="submit" className="btn-primary">가입 완료</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}