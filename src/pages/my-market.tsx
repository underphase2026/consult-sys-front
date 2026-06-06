import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';
import marketIcon from '../images/icons/market.svg';
import myMarketBg from '../images/illustrations/my_market.svg';
import rectangleImg from '../images/illustrations/Rectangle.svg';

const planBadge = (plan: string) =>
  `text-xs font-normal px-2 py-0.5 rounded-full whitespace-nowrap ${
    plan === 'Pro'
      ? 'text-white bg-primary'
      : plan === 'Basic'
      ? 'text-white bg-cta-dark'
      : 'text-text-muted bg-input-disabled-bg'
  }`;

import { useStore } from '../hooks/useStore';

export default function MyMarket() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<any[]>([]);
  const { fetchMyStores, isLoading } = useStore();

  useEffect(() => {
    fetchMyStores().then(data => setStores(data));
  }, [fetchMyStores]);

  const hasStores = stores.length > 0;

  return (
    <div className="app-page">
      <PrivateHeader activePage="my-market" />
      <main className="flex-1 pt-[60px] pb-[60px] px-6">
        <div className="max-w-content mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-text-black">내 매장</h1>
            <button
              className="w-8 h-8 rounded bg-white border border-input-border cursor-pointer flex items-center justify-center p-0"
              onClick={() => navigate('/register-market')}
              title="매장 추가"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V11M1 6H11" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-text-gray">매장 목록을 불러오는 중...</div>
          ) : hasStores ? (
            <div className="flex flex-col gap-3">
              {stores.map((store, idx) => (
                <div key={store.storeId || idx} className="flex flex-col pt-5">
                  <div className="flex items-center h-8">
                    <span className="text-sm font-normal text-text-dark">{idx + 1}</span>
                  </div>
                  <hr className="h-px bg-[#e8ecf2] border-none shrink-0" />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-5">
                      <img src={rectangleImg} alt="매장 이미지" className="w-[200px] h-[112px] rounded-lg shrink-0 object-cover" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-text-dark">{store.storeName}</span>
                          <span className={planBadge(store.rate || 'Basic')}>{store.rate || 'Basic'}</span>
                        </div>
                        <span className="text-sm font-normal text-text-muted">{store.ownerName} ({store.phoneNumber})</span>
                      </div>
                    </div>
                    <button
                      className="h-btn px-5 min-w-[140px] text-base font-semibold text-white bg-primary border-none rounded-lg cursor-pointer whitespace-nowrap hover:bg-primary-hover"
                      onClick={() => navigate('/consulting', { state: { newQuote: true } })}
                    >
                      상담 시스템 이동
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <img src={myMarketBg} alt="" className="w-full rounded-xl pointer-events-none select-none" />
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-[360px] rounded-xl border border-input-border bg-white p-[30px_20px] flex flex-col items-center shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="w-[52px] h-[52px] rounded-full bg-secondary-bg flex items-center justify-center mb-4">
                    <img src={marketIcon} alt="" className="w-6 h-6" />
                  </div>
                  <span className="block text-xl font-semibold text-text-dark text-center">등록된 매장이 없어요</span>
                  <span className="block text-base font-normal text-text-gray text-center mt-1">매장을 등록하고 요정을 이용해 보세요</span>
                  <button
                    className="w-[180px] h-btn mt-5 text-base font-semibold text-white bg-primary border-none rounded-lg cursor-pointer hover:bg-primary-hover"
                    onClick={() => navigate('/register-market')}
                  >
                    + 매장 등록하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}