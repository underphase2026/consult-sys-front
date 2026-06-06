import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import completeSignUpImg from '../images/illustrations/complete_sign_up.svg';

type ReferralStatus = 'idle' | 'verified' | 'error';

export default function CompleteSignUp() {
  const navigate = useNavigate();
  const [referral, setReferral] = useState('');
  const [status, setStatus] = useState<ReferralStatus>('idle');

  const handleCheck = () => {
    if (referral.trim().length >= 4) {
      setStatus('verified');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="app-page">
      <PublicHeader />
      <main className="main-center">
        <div className="form-card">
          <div className="w-full h-20 flex items-center justify-center">
            <img src={completeSignUpImg} alt="가입완료" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center mb-9">
            <span className="block text-xl font-semibold text-text-dark leading-7">가입을 환영해요!</span>
            <span className="block text-base font-normal text-text-gray mt-1">추천인 코드 입력하고 1개월 무료로 시작하세요!</span>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={(e) => { e.preventDefault(); navigate('/sign-in'); }}
          >
            {/* 추천인 코드 필드 */}
            <div className="field-group">
              <div className="label-row">
                <label className="field-label">추천인 코드</label>
                <span className="label-optional">(선택)</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className={status === 'verified' ? 'input-wrap-gray' : 'input-wrap'}>
                  <input
                    type="text"
                    placeholder="추천인 코드"
                    value={referral}
                    readOnly={status === 'verified'}
                    onChange={(e) => {
                      setReferral(e.target.value);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    className={status === 'verified' ? 'inner-input-gray' : 'inner-input'}
                  />
                  {status !== 'verified' && (
                    <button
                      type="button"
                      className="action-btn disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={!referral.trim()}
                      onClick={handleCheck}
                    >
                      확인
                    </button>
                  )}
                </div>
                {status === 'verified' && (
                  <p className="text-[13px] text-primary leading-5">추천인 코드가 확인되었어요</p>
                )}
                {status === 'error' && (
                  <p className="text-[13px] text-error leading-5">추천인 코드를 확인해주세요</p>
                )}
              </div>
            </div>

            {/* 버튼 — Figma: 기본=건너뛰기만 / 베리언트2=로그인하기만 */}
            <div className="submit-wrap pb-5">
              {status === 'verified' ? (
                <button type="submit" className="btn-primary">로그인하기</button>
              ) : (
                <button
                  type="button"
                  className="w-full h-btn rounded-lg text-base font-normal text-text-gray bg-white border border-input-border cursor-pointer hover:bg-ghost-hover"
                  onClick={() => navigate('/sign-in')}
                >
                  건너뛰기
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}