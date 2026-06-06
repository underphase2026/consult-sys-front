import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import signUpImg from '../../images/icons/sign-up.svg';
import { useAuth } from '../../hooks/useAuth';
import { usePhoneAuth } from '../../hooks/usePhoneAuth';
import TimerDisplay from '../../components/TimerDisplay';

const signUpSchema = z.object({
  role: z.enum(['owner', 'staff']),
  name: z.string().min(2, '이름을 2자 이상 입력해주세요.').max(50, '이름을 50자 이하로 입력해주세요.'),
  phone: z.string().regex(/^01[0-9]{9}$/, '올바른 휴대폰 번호 형식이 아닙니다. (- 없이 숫자만)'),
  verificationCode: z.string().length(6, '6자리 인증번호를 입력해주세요.').optional(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.').or(z.literal('')).optional(),
  password: z.string().regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    '영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.'
  ),
  passwordConfirm: z.string(),
  terms: z.object({
    service: z.boolean().refine(val => val === true, { message: '필수 약관에 동의해야 합니다.' }),
    privacy: z.boolean().refine(val => val === true, { message: '필수 약관에 동의해야 합니다.' }),
    marketing: z.boolean().optional()
  })
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 cursor-pointer">
      <path d="M5 12L9 16L19 7" stroke={checked ? '#1a80ff' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const { sendVerificationCode, verifyCode, register: registerUser, isLoading } = useAuth();
  
  // V3: 의존성 주입(DI) 방식으로 네트워크 함수 주입 -> 도메인 격리 및 Testability 확보
  const auth = usePhoneAuth({
    apiSendCode: sendVerificationCode,
    apiVerifyCode: verifyCode,
  });

  // V3: 렌더링 억제를 위해 watch() 전면 배제 (getValues 사용)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'owner',
      name: '',
      phone: '',
      verificationCode: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: { service: false, privacy: false, marketing: false },
    },
    mode: 'onTouched',
  });

  // 약관 동의 체크박스와 역할(role) 등 렌더링에 꼭 필요한 값들만 최소한으로 watch
  const watchRole = watch('role');
  const watchTerms = watch('terms');
  const agreeAll = watchTerms.service && watchTerms.privacy && watchTerms.marketing;

  const handleToggleAgreeAll = () => {
    const next = !agreeAll;
    setValue('terms.service', next);
    setValue('terms.privacy', next);
    setValue('terms.marketing', next);
    trigger('terms');
  };

  const handleToggleTerm = (key: keyof SignUpFormData['terms']) => {
    setValue(`terms.${key}`, !watchTerms[key]);
    trigger('terms');
  };

  const onSendCodeClick = async () => {
    // getValues()를 사용하여 불필요한 렌더링 없이 현재 입력값만 읽어옵니다.
    const isValid = await trigger('phone');
    if (!isValid) return;

    try {
      await auth.requestCode(getValues('phone'));
    } catch (error: any) {
      alert(error.message || '오류가 발생했습니다.');
    }
  };

  const onVerifyCodeClick = async () => {
    const code = getValues('verificationCode');
    if (!code || code.length !== 6) return;

    try {
      await auth.confirmCode(getValues('phone'), code);
    } catch (error: any) {
      alert(error.message || '인증에 실패했습니다.');
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (auth.step !== 'VERIFIED' || !auth.verifyToken) {
      return alert('휴대폰 본인인증을 완료해주세요.');
    }

    // V3: 교차 검증 (Cross Validation) -> 인증 성공 시점의 번호와 제출 시점의 번호 일치 여부 확인
    const submitPhone = data.phone.replace(/-/g, '');
    if (auth.verifiedPhone !== submitPhone) {
      return alert('인증된 휴대폰 번호와 입력된 번호가 일치하지 않습니다. 다시 인증해주세요.');
    }

    const payload = {
      name: data.name,
      phoneNumber: submitPhone,
      email: data.email || undefined,
      password: data.password,
      terms: {
        serviceAgreed: data.terms.service,
        privacyAgreed: data.terms.privacy,
        marketingAgreed: data.terms.marketing || false,
      },
    };

    try {
      await registerUser(data.role, payload, auth.verifyToken);
      auth.resetAuth(); // 성공 시 잔여 sessionStorage 정리
      navigate('/complete-sign-up');
    } catch (error: any) {
      alert(error.message || '회원가입에 실패했습니다.');
    }
  };

  // 타이머가 작동 중일 때만 렌더링을 갱신하는 것이 아니라, 시작/종료 시에만 리렌더링됨
  const isSendingOrVerified = auth.step === 'VERIFIED' || auth.step === 'SENDING' || auth.isTimerActive();

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
              onClick={() => setValue('role', 'owner')}
              type="button"
              className="flex w-[180px] h-14 p-[10px] justify-center items-center gap-[10px] bg-white cursor-pointer outline-none"
              style={{ border: 'none', borderBottom: watchRole === 'owner' ? '2px solid #1A80FF' : '2px solid transparent' }}
            >
              <span className={`text-base font-semibold ${watchRole === 'owner' ? 'text-[#1A80FF]' : 'text-[#9CA3AF]'}`}>매장 대표</span>
            </button>
            <button
              onClick={() => setValue('role', 'staff')}
              type="button"
              className="flex w-[180px] h-14 p-[10px] justify-center items-center gap-[10px] bg-white cursor-pointer outline-none"
              style={{ border: 'none', borderBottom: watchRole === 'staff' ? '2px solid #1A80FF' : '2px solid transparent' }}
            >
              <span className={`text-base font-semibold ${watchRole === 'staff' ? 'text-[#1A80FF]' : 'text-[#9CA3AF]'}`}>매장 직원</span>
            </button>
          </div>

          <form className="w-full flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="field-group">
              <label className="field-label">이름</label>
              <input type="text" placeholder="홍길동" {...register('name')} className="form-input" />
              {errors.name && <span className="text-[13px] text-[#EF4444] leading-6">{errors.name.message}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">휴대폰 번호</label>
              <div className="input-wrap">
                <input
                  type="tel" // V3: 태블릿 숫자 키패드 지원
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="-없이 숫자만 입력해주세요"
                  {...register('phone')}
                  className={`inner-input ${isSendingOrVerified ? 'bg-gray-50 cursor-not-allowed text-text-gray' : ''}`}
                  disabled={isSendingOrVerified}
                />
                <button
                  type="button"
                  className="action-btn shrink-0"
                  onClick={onSendCodeClick}
                  disabled={isSendingOrVerified}
                >
                  {auth.step === 'VERIFIED' ? '인증 완료' : auth.step === 'SENDING' ? '전송 중...' : auth.isTimerActive() ? '재전송 대기' : '인증'}
                </button>
              </div>
              {errors.phone && <span className="text-[13px] text-[#EF4444] leading-6">{errors.phone.message}</span>}
              
              {(auth.step === 'SENT' || auth.step === 'VERIFYING' || auth.step === 'VERIFIED') && auth.step !== 'VERIFIED' && (
                <div className="flex gap-2 mt-2">
                  <div className="input-wrap flex-1 min-w-0 relative">
                    <input
                      type="text" 
                      inputMode="numeric" // V3: 태블릿 가상 숫자 키패드 강제 호출
                      pattern="[0-9]*"
                      autoComplete="one-time-code" // V3: iOS/Android 인증번호 자동완성 최적화
                      placeholder="인증번호 6자리 입력"
                      {...register('verificationCode')}
                      className="inner-input pr-16"
                      maxLength={6}
                      disabled={auth.step === 'VERIFYING'}
                    />
                    {/* V3: 독립적인 TimerDisplay 적용으로 매초 부모(SignUp) 리렌더링 방지 */}
                    <TimerDisplay endTime={auth.timerEndTime} onExpire={auth.handleTimerExpire} />
                  </div>
                  <button
                    type="button"
                    className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover"
                    onClick={onVerifyCodeClick}
                    disabled={auth.step === 'VERIFYING'}
                  >
                    {auth.step === 'VERIFYING' ? '확인 중...' : '확인'}
                  </button>
                </div>
              )}
            </div>

            <div className="field-group">
              <div className="label-row">
                <label className="field-label">이메일</label>
                <span className="label-optional">(선택)</span>
              </div>
              <input type="email" placeholder="example@yo-jeong.com" {...register('email')} className="form-input" />
              {errors.email && <span className="text-[13px] text-[#EF4444] leading-6">{errors.email.message}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">비밀번호</label>
              <input type="password" placeholder="영문, 숫자, 특수문자 포함 8자 이상" {...register('password')} className="form-input" />
              {errors.password && <span className="text-[13px] text-[#EF4444] leading-6">{errors.password.message}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">비밀번호 확인</label>
              <input type="password" placeholder="비밀번호를 한 번 더 입력해 주세요" {...register('passwordConfirm')} className="form-input" />
              {errors.passwordConfirm && <span className="text-[13px] text-[#EF4444] leading-6">{errors.passwordConfirm.message}</span>}
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-input-border cursor-pointer mt-5" onClick={handleToggleAgreeAll}>
              <CheckIcon checked={agreeAll || false} />
              <span className="text-[15px] font-medium text-text-gray">전체동의</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleTerm('service')}>
                <CheckIcon checked={watchTerms?.service || false} />
                <span className="text-sm text-text-gray leading-6">(필수) 이용 약관 동의</span>
              </div>
              <span className="text-[13px] text-text-muted cursor-pointer underline" onClick={() => navigate('/terms')}>더보기</span>
            </div>
            {errors.terms?.service && <span className="text-[13px] text-[#EF4444] leading-6 pl-8">{errors.terms.service.message}</span>}

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleTerm('privacy')}>
                <CheckIcon checked={watchTerms?.privacy || false} />
                <span className="text-sm text-text-gray leading-6">(필수) 개인정보 수집 동의</span>
              </div>
              <span className="text-[13px] text-text-muted cursor-pointer underline" onClick={() => navigate('/terms')}>더보기</span>
            </div>
            {errors.terms?.privacy && <span className="text-[13px] text-[#EF4444] leading-6 pl-8">{errors.terms.privacy.message}</span>}

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleTerm('marketing')}>
                <CheckIcon checked={watchTerms?.marketing || false} />
                <span className="text-sm text-text-gray leading-6">(선택) 마케팅 수신 동의</span>
              </div>
            </div>

            <div className="submit-wrap pb-5 mt-4">
              <button type="submit" className="btn-primary disabled:opacity-50" disabled={isLoading || auth.step !== 'VERIFIED'}>
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
