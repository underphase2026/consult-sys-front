import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PrivateHeader from '../../components/PrivateHeader';
import Footer from '../../components/Footer';
import PhoneChangeModal from '../../components/PhoneChangeModal';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import PaymentDetailModal, { type PaymentDetail } from '../../components/PaymentDetailModal';
import CardConfirmModal from '../../components/CardConfirmModal';
import Toast from '../../components/Toast';
import personalImg from '../../images/icons/personal.svg';
import personalHoverImg from '../../images/icons/personal2.svg';

const MY_PAGE_TABS = [
  { key: 'info', label: '정보수정' },
  { key: 'payment', label: '결제내역' },
  { key: 'card', label: '결제수단' },
] as const;
type MainTab = typeof MY_PAGE_TABS[number]['key'];

import { useUser, type UserProfileResponseDto } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
export default function MyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as MainTab | null;
  const [mainTab, setMainTab] = useState<MainTab>(
    MY_PAGE_TABS.some(t => t.key === tabParam) ? tabParam! : 'info'
  );

  const switchTab = (t: MainTab) => {
    setMainTab(t);
    navigate(`/my-page?tab=${t}`, { replace: true });
  };

  return (
    <div className="app-page">
      <PrivateHeader />
      <main className="flex-1 flex flex-col items-center px-5 py-[60px]">
        <div className="w-full max-w-form">
          <h1 className="text-xl font-semibold text-text-dark leading-7 mb-5 text-center">마이페이지</h1>

          <div className="flex w-full">
            {MY_PAGE_TABS.map(({ key, label }) => (
              <button
                key={key}
                className={`tab-btn-base ${mainTab === key ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                onClick={() => switchTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {mainTab === 'info' && <InfoTab />}
          {mainTab === 'payment' && <PaymentTab />}
          {mainTab === 'card' && <CardTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoTab() {
  const navigate = useNavigate();
  const { profile, isLoading, errorMsg, fetchProfile, updateProfile } = useUser();

  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const [profileSrc, setProfileSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [showPasswordChangeVerify, setShowPasswordChangeVerify] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { issueResetToken } = useAuth(); // We need to import this

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode).then(() => {
        setToast({ type: 'success', message: '추천인 코드가 복사되었습니다' });
      }).catch(() => {
        setToast({ type: 'error', message: '복사에 실패했습니다' });
      });
    }
  };

  const handleUpdateInfo = async () => {
    setIsUpdating(true);
    try {
      let birthDate = undefined;
      if (birthYear && birthMonth && birthDay) {
         birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      }
      
      const payload = {
        email,
        birthDate,
        marketingAgreed: agreeMarketing,
      };

      await updateProfile(payload);
      
      setToast({ type: 'success', message: '성공적으로 수정되었습니다.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordVerified = async () => {
    setShowPasswordChangeVerify(false);
    if (!profile?.phoneNumber) return;
    try {
      const rt = await issueResetToken(profile.phoneNumber.replace(/-/g, ''));
      setResetToken(rt);
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || '비밀번호 재설정 토큰 발급에 실패했습니다.' });
    }
  };

  useEffect(() => {
    fetchProfile().then((data) => {
      if (data) {
        setEmail(data.email || '');
        setAgreeMarketing(data.marketingAgreed || false);
        if (data.birthDate) {
          const [y, m, d] = data.birthDate.split('-');
          setBirthYear(y || '');
          setBirthMonth(m || '');
          setBirthDay(d || '');
        }
      }
    });
  }, [fetchProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileSrc(URL.createObjectURL(file));
  };

  const avatarSrc = profileSrc ?? (profileHovered ? personalHoverImg : personalImg);

  if (isLoading) {
    return <div className="py-20 text-center text-text-gray">로딩 중...</div>;
  }

  if (errorMsg || !profile) {
    return <div className="py-20 text-center text-red-500">{errorMsg || '정보를 불러올 수 없습니다.'}</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center py-10 gap-4">
        <div
          className="w-[88px] h-[88px] rounded-full overflow-hidden cursor-pointer shrink-0"
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => setProfileHovered(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={avatarSrc} alt="프로필" className="w-[88px] h-[88px] block" />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-lg font-normal text-text-dark leading-6">{profile.name}</span>
      </div>

      <div className="field-group">
        <label className="field-label">이름</label>
        <input type="text" defaultValue={profile.name} disabled className="form-input-disabled" />
      </div>

      <div className="field-group">
        <label className="field-label">휴대폰 번호</label>
        <div className="input-wrap-gray">
          <input type="tel" defaultValue={profile.phoneNumber} disabled className="inner-input-gray" />
          <button type="button" className="action-btn" onClick={() => setShowPhoneModal(true)}>변경</button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">비밀번호</label>
        <div className="input-wrap-gray">
          <input
            type="password"
            defaultValue="********"
            disabled
            className="inner-input-gray tracking-[4px]"
          />
          <button type="button" className="action-btn" onClick={() => setShowPasswordChangeVerify(true)}>변경</button>
        </div>
      </div>

      <div className="field-group">
        <div className="label-row">
          <label className="field-label">생년월일</label>
          <span className="label-optional">(선택)</span>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="YYYY" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="form-input flex-[1.4]" />
          <input type="text" placeholder="MM" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="form-input flex-1" />
          <input type="text" placeholder="DD" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="form-input flex-1" />
        </div>
      </div>

      <div className="field-group">
        <div className="label-row">
          <label className="field-label">이메일</label>
          <span className="label-optional">(선택)</span>
        </div>
        <input type="email" placeholder="example@yo-jeong.com" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
      </div>

      <div className="field-group">
        <label className="field-label">추천인 코드</label>
        <div className="input-wrap">
          <span className="flex-1 text-sm text-text-muted">{profile.referralCode || '발급된 코드가 없습니다'}</span>
          <svg 
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            className="cursor-pointer"
            onClick={handleCopyReferral}
          >
            <rect x="7" y="1" width="12" height="12" rx="2" stroke="#5aaaff" strokeWidth="1.5" />
            <rect x="1" y="7" width="12" height="12" rx="2" stroke="#5aaaff" strokeWidth="1.5" fill="white" />
          </svg>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">수신설정</label>
        <div className="flex items-center justify-between pl-2 h-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={() => setAgreeMarketing(v => !v)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <span className="text-sm text-text-gray">(선택) 마케팅 수신 동의</span>
          </label>
          <span className="text-[13px] text-text-muted cursor-pointer underline">더보기</span>
        </div>
      </div>

      <div className="submit-wrap">
        <button 
          className="btn-primary disabled:opacity-50"
          onClick={handleUpdateInfo}
          disabled={isUpdating}
        >
          {isUpdating ? '수정 중...' : '정보수정'}
        </button>
      </div>

      <div className="pt-5">
        <button
          className="bg-transparent border-none cursor-pointer text-sm text-text-gray underline w-full text-right"
          onClick={() => navigate('/sign-in')}
        >
          회원탈퇴
        </button>
      </div>

      {showPhoneModal && <PhoneChangeModal onClose={() => setShowPhoneModal(false)} />}
      
      {showPasswordChangeVerify && (
        <PhoneVerifyModal
          phone={profile.phoneNumber}
          startStep="initial"
          onVerified={handlePasswordVerified}
          onClose={() => setShowPasswordChangeVerify(false)}
        />
      )}
      
      {resetToken && (
        <PasswordChangeModal 
          resetToken={resetToken} 
          onClose={() => setResetToken(null)}
          onSuccess={() => {
            setResetToken(null);
            setToast({ type: 'success', message: '비밀번호가 변경되었습니다.' });
          }}
        />
      )}
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

const MOCK_SUBSCRIPTIONS = [
  { store: '요정폰 가야점', plan: 'Basic',   card: '현대카드(904*)', nextPayment: '2027.05.02 (300,000원)' },
  { store: '요정폰 가야점', plan: 'Pro', card: '현대카드(904*)', nextPayment: '2027.05.02 (300,000원)' },
];

const MOCK_PAYMENTS: PaymentDetail[] = [
  { orderId: '20261231-000123', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20261130-000122', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20261031-000121', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260930-000120', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260831-000119', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260731-000118', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260630-000117', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260531-000116', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260430-000115', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
  { orderId: '20260331-000114', date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999', months: '일시불', card: '현대카드 (9040-****-****-4301)' },
];

const TOTAL_PAGES = 5;

function PaymentTab() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const hasSubscription = MOCK_SUBSCRIPTIONS.length > 0;
  const hasPayments = MOCK_PAYMENTS.length > 0;

  return (
    <div className="flex flex-col gap-1">
      {/* 정기결제 */}
      <div className="field-group">
        <label className="field-label">정기결제</label>
        {!hasSubscription ? (
          <input disabled defaultValue="예정된 정기결제가 없습니다" className="form-input-disabled" />
        ) : (
          MOCK_SUBSCRIPTIONS.map((sub, i) => (
            <div key={i} className="bg-input-disabled-bg rounded-lg px-4 py-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-text-dark">{sub.store}</span>
                  <span className={`text-xs font-normal text-white rounded px-1.5 py-0.5 ${sub.plan === 'Pro' ? 'bg-primary' : 'bg-[#023e8a]'}`}>{sub.plan}</span>
                </div>
                <span className="text-[13px] text-text-gray cursor-pointer hover:text-text-dark">결제 관리 &gt;</span>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-[13px] text-text-muted mr-1.5">결제 정보</span>
                  <span className="text-[13px] text-text-gray">{sub.card}</span>
                </div>
                <div>
                  <span className="text-[13px] text-text-muted mr-1.5">다음 결제일</span>
                  <span className="text-[13px] text-text-gray">{sub.nextPayment}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 결제내역 */}
      <div className="field-group">
        <label className="field-label">결제내역</label>
        {!hasPayments ? (
          <input disabled defaultValue="결제내역이 없습니다" className="form-input-disabled" />
        ) : (
          <>
            <div className="rounded-lg overflow-hidden border border-input-border">
              {/* 헤더 행 */}
              <div className="grid grid-cols-[1fr_1.4fr_0.9fr_44px] bg-input-disabled-bg border-b border-input-border">
                {['결제일', '상품명', '금액'].map((h) => (
                  <span key={h} className="px-3 py-[16px] text-sm text-text-muted">{h}</span>
                ))}
                <span />
              </div>
              {/* 데이터 행 */}
              {MOCK_PAYMENTS.map((p) => (
                <div key={p.orderId} className="grid grid-cols-[1fr_1.4fr_0.9fr_44px] border-b border-[#e8ecf2] last:border-0">
                  <span className="px-3 py-[16px] text-sm text-text-dark">{p.date}</span>
                  <span className="px-3 py-[16px] text-sm text-text-dark">{p.product}</span>
                  <span className="px-3 py-[16px] text-sm text-text-dark">{p.amount}</span>
                  <button
                    type="button"
                    className="py-[16px] text-sm text-text-gray bg-transparent border-none cursor-pointer hover:text-text-dark"
                    onClick={() => setSelectedPayment(p)}
                  >
                    상세
                  </button>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-1 pt-2">
              <button
                className="w-7 h-7 flex items-center justify-center text-sm text-text-muted bg-transparent border-none cursor-pointer"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ←
              </button>
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 flex items-center justify-center text-[13px] rounded bg-transparent border-none cursor-pointer ${p === currentPage ? 'text-primary font-semibold' : 'text-text-muted'}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="w-7 h-7 flex items-center justify-center text-sm text-text-muted bg-transparent border-none cursor-pointer"
                onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
              >
                →
              </button>
            </div>
          </>
        )}
      </div>

      {selectedPayment && (
        <PaymentDetailModal
          detail={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}

interface CardItem {
  id: number;
  name: string;
  isDefault: boolean;
}

const MOCK_CARDS: CardItem[] = [
  { id: 1, name: '현대카드(803*)', isDefault: true },
  { id: 2, name: '신한카드(103*)', isDefault: false },
];

function CardTab() {
  const [cards, setCards] = useState<CardItem[]>(MOCK_CARDS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [pendingDefault, setPendingDefault] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = (cardId: number) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    setPendingDelete(null);
    setToast({ type: 'success', message: '카드가 정상적으로 삭제되었습니다' });
  };

  const handleSetDefault = (cardId: number) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === cardId })));
    setPendingDefault(null);
  };

  const handleDeleteClick = (card: CardItem) => {
    setOpenMenuId(null);
    if (card.isDefault) {
      // 기본(정기결제) 카드는 확인 모달 없이 바로 에러 토스트
      setToast({ type: 'error', message: '정기결제 중인 카드는 삭제 불가합니다' });
    } else {
      setPendingDelete(card.id);
    }
  };

  return (
    <div className="field-group">
      <label className="field-label">결제수단 관리</label>

      {openMenuId !== null && (
        <div className="fixed inset-0 z-[150]" onClick={() => setOpenMenuId(null)} />
      )}

      {cards.length === 0 ? (
        <input disabled defaultValue="등록된 결제수단이 없습니다" className="form-input-disabled" />
      ) : (
        <div className="flex flex-col border border-input-border rounded-lg">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className={`relative flex items-center justify-between px-3 h-input bg-white
                ${idx === 0 ? 'rounded-t-lg' : ''}
                ${idx === cards.length - 1 ? 'rounded-b-lg' : 'border-b border-input-border'}`}
            >
              <div className="flex items-center gap-2">
                {card.isDefault && <span className="text-sm text-link">기본</span>}
                <span className="text-sm text-text-dark">{card.name}</span>
              </div>

              <div className="relative shrink-0">
                <button
                  type="button"
                  className="w-6 h-6 flex flex-col items-center justify-center gap-[3px] bg-transparent border-none cursor-pointer"
                  onClick={() => setOpenMenuId(openMenuId === card.id ? null : card.id)}
                >
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1 h-1 rounded-full bg-text-muted" />
                  ))}
                </button>

                {openMenuId === card.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-input-border rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-[160] w-max">
                    <button
                      type="button"
                      className="block w-full px-4 py-2.5 text-sm text-text-dark text-left bg-transparent border-none rounded-t-lg cursor-pointer hover:bg-ghost-hover whitespace-nowrap"
                      onClick={() => { setOpenMenuId(null); if (!card.isDefault) setPendingDefault(card.id); }}
                    >
                      기본 결제카드로 변경
                    </button>
                    <button
                      type="button"
                      className="block w-full px-4 py-2.5 text-sm text-error text-left bg-transparent border-none rounded-b-lg cursor-pointer hover:bg-ghost-hover whitespace-nowrap"
                      onClick={() => handleDeleteClick(card)}
                    >
                      카드 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="submit-wrap">
        <button className="btn-primary">+ 카드 등록</button>
      </div>

      {pendingDelete !== null && (
        <CardConfirmModal
          type="delete"
          onConfirm={() => handleDelete(pendingDelete)}
          onClose={() => setPendingDelete(null)}
        />
      )}

      {pendingDefault !== null && (
        <CardConfirmModal
          type="setDefault"
          onConfirm={() => handleSetDefault(pendingDefault)}
          onClose={() => setPendingDefault(null)}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}