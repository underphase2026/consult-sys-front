import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import PasswordChangeModal from '../components/PasswordChangeModal';
import yojeongSymbol from '../images/yojeong_simbol.svg';
import passwordDots from '../images/password.svg';

interface LoginResponseDto {
  accessToken: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const msg = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message;
        throw new Error(msg || '로그인에 실패했습니다.');
      }

      const resData: { success: boolean; data: LoginResponseDto } = await response.json();
      localStorage.setItem('accessToken', resData.data.accessToken);
      navigate('/my-market');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-page">
      <PublicHeader />
      <main className="main-center">
        <div className="form-card">
          <div className="h-20 flex items-center justify-center">
            <img src={yojeongSymbol} alt="요정" className="w-[43px] h-[60px] object-contain" />
          </div>
          <div className="mb-5 text-center">
            <span className="block text-xl font-semibold text-text-dark leading-7">반가워요!</span>
            <span className="block text-xl font-semibold text-text-dark leading-7">핸드폰 상담이 훨씬 쉬워질 거예요</span>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={handleLogin}
          >
            <div className="field-group">
              <label className="field-label">휴대폰 번호</label>
              <input
                type="tel"
                placeholder="-없이 숫자만 입력해주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">비밀번호</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  className="form-input"
                />
                {!password && !pwFocused && (
                  <img
                    src={passwordDots}
                    alt=""
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                )}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLogin}
                  onChange={(e) => setKeepLogin(e.target.checked)}
                  className="w-[18px] h-[18px] accent-primary rounded cursor-pointer"
                />
                <span className="text-sm font-normal text-text-gray leading-6">로그인 상태 유지</span>
              </label>
              <span
                className="text-sm font-medium text-text-gray cursor-pointer leading-6"
                onClick={() => setShowPasswordModal(true)}
              >
                비밀번호를 잊으셨나요?
              </span>
            </div>

            <div className="submit-wrap">
              {errorMsg && (
                <div className="mb-3 text-red-500 text-sm font-medium text-center">
                  {errorMsg}
                </div>
              )}
              <button 
                type="submit" 
                className="btn-primary disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="pt-5 flex items-center justify-center gap-2">
            <span className="text-base font-normal text-text-black leading-6">아직 요정 회원이 아니신가요?</span>
            <span
              className="text-base font-medium text-link cursor-pointer leading-6"
              onClick={() => navigate('/sign-up')}
            >
              지금 가입하기
            </span>
          </div>
        </div>
      </main>
      <Footer />
      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          requireCurrent={false}
        />
      )}
    </div>
  );
}