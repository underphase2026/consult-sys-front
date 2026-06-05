import { useState, useEffect } from 'react';
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
  const [phoneError, setPhoneError] = useState(false);
  const [phoneVerifyToken, setPhoneVerifyToken] = useState<string | null>(null);

  const isValidPhone = (p: string) => /^01[0-9]{9}$/.test(p.replace(/[^0-9]/g, ''));

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

  const { sendVerificationCode, verifyCode, register, isLoading } = useAuth();

  const handleSendVerificationCode = async () => {
    if (!phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    if (!isValidPhone(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    
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
      const data = await verifyCode(phone.replace(/-/g, ''), verificationCode);
      setPhoneVerifyToken(data?.phoneVerifyToken);
      timer.stop();
      setIsVerificationVisible(false);
      setIsVerified(true);
    } catch (error: any) {
      alert(error.message || '오류가 발생했습니다.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) return alert('이름을 입력해주세요.');
    if (!isVerified || !phoneVerifyToken) return alert('휴대폰 인증을 완료해주세요.');
    if (!password || password.length < 8) return alert('비밀번호는 최소 8자 이상이어야 합니다.');
    if (password !== passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!agrees[0] || !agrees[1]) return alert('필수 약관에 동의해주세요.');

    const payload = {
      name,
      phoneNumber: phone.replace(/-/g, ''),
      email: email || undefined,
      password,
      terms: {
        serviceAgreed: agrees[0],
        privacyAgreed: agrees[1],
        marketingAgreed: agrees[2],
      },
    };

    try {
      await register(role, payload, phoneVerifyToken);
      alert('회원가입이 완료되었습니다.');
      navigate('/complete-sign-up');
    } catch (error: any) {
      alert(error.message || '회원가입에 실패했습니다.');
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

          <div className="flex w-full">
            <button
              onClick={() => setRole('owner')}
              className="flex w-[180px] h-14 p-[10px] justify-center items-center gap-[10px] bg-white cursor-pointer outline-none"
              style={{ border: 'none', borderBottom: role === 'owner' ? '2px solid #1A80FF' : '2px solid transparent' }}
            >
              <span className={`text-base font-semibold ${role === 'owner' ? 'text-[#1A80FF]' : 'text-[#9CA3AF]'}`}>
                매장 대표
              </span>
            </button>
            <button
              onClick={() => setRole('staff')}
              className="flex w-[180px] h-14 p-[10px] justify-center items-center gap-[10px] bg-white cursor-pointer outline-none"
              style={{ border: 'none', borderBottom: role === 'staff' ? '2px solid #1A80FF' : '2px solid transparent' }}
            >
              <span className={`text-base font-semibold ${role === 'staff' ? 'text-[#1A80FF]' : 'text-[#9CA3AF]'}`}>
                매장 직원
              </span>
            </button>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={handleRegister}
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
              {/* 1단계: 번호 입력 + 인증 버튼 */}
              <div className="input-wrap">
                <input
                  type="tel" placeholder="-없이 숫자만 입력해주세요" value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError(false);
                  }}
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
              {phoneError && (
                <span className="text-[13px] text-[#EF4444] leading-6">올바르지 않은 번호 형식이에요</span>
              )}
              {isVerificationVisible && (
                <div className="flex gap-2 mt-2">
                  <div className="input-wrap flex-1 min-w-0 relative">
                    <input
                      type="text" placeholder="인증번호 6자리 입력" value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="inner-input pr-16"
                      maxLength={6}
                    />
                    {(timer.isActive || timer.timeLeft === 0) && (
                      <span className="absolute right-3 text-sm text-primary shrink-0">
                        {timer.formatTime()}
                      </span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover"
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
              <button type="submit" className="btn-primary disabled:opacity-50" disabled={isLoading}>
                {isLoading ? '가입 중...' : '가입 완료'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
