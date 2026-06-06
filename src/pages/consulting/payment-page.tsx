import Sidebar from '../../components/Sidebar';

const MOCK_PLAN = {
  name: '요정폰 가야점',
  plan: 'Pro',
  nextDate: '2027.05.02',
  nextAmount: '300,000원',
  card: '현대카드(904*)',
};

const MOCK_HISTORY = [
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
  { date: '2025.12.31', product: '(프로) 매장명', amount: '9,999,999' },
];

const TOTAL_PAGES = 5;

export default function PaymentPage() {
  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-6 bg-white border-b border-[#E2E4EC] shrink-0">
          <h1 className="text-lg font-semibold text-text-dark">결제</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-8 max-w-[800px]">
          {/* 사용 중인 요금제 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text-dark">사용 중인 요금제</h2>
            <div className="bg-white rounded-2xl border border-[#E2E4EC] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-text-dark">{MOCK_PLAN.name}</span>
                <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${MOCK_PLAN.plan === 'Pro' ? 'bg-primary' : 'bg-cta-dark'}`}>
                  {MOCK_PLAN.plan}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-muted">결제 정보</span>
                  <span className="text-text-gray">{MOCK_PLAN.card}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-muted">다음 결제일</span>
                  <span className="text-text-gray">{MOCK_PLAN.nextDate} ({MOCK_PLAN.nextAmount})</span>
                </div>
              </div>
              <button className="text-sm text-text-gray hover:text-text-dark bg-transparent border-none cursor-pointer">
                결제 관리 &gt;
              </button>
            </div>
          </section>

          {/* 결제 내역 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text-dark">결제 내역</h2>
            <div className="bg-white rounded-xl border border-[#E2E4EC] overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-[1fr_1.4fr_0.9fr_60px] bg-[#F8F9FA] border-b border-[#E2E4EC]">
                {['결제일', '상품명', '금액', ''].map((h, i) => (
                  <span key={i} className="px-4 py-3 text-sm text-text-muted">{h}</span>
                ))}
              </div>
              {/* 데이터 */}
              {MOCK_HISTORY.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.4fr_0.9fr_60px] border-b border-[#E2E4EC] last:border-0">
                  <span className="px-4 py-4 text-sm text-text-dark">{row.date}</span>
                  <span className="px-4 py-4 text-sm text-text-dark">{row.product}</span>
                  <span className="px-4 py-4 text-sm text-text-dark">{row.amount}</span>
                  <button className="py-4 text-sm text-text-gray hover:text-text-dark bg-transparent border-none cursor-pointer">
                    상세
                  </button>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-1 pt-1">
              <button className="w-7 h-7 flex items-center justify-center text-sm text-text-muted bg-transparent border-none cursor-pointer">←</button>
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`w-7 h-7 flex items-center justify-center text-[13px] rounded bg-transparent border-none cursor-pointer ${p === 1 ? 'text-primary font-semibold' : 'text-text-muted'}`}
                >
                  {p}
                </button>
              ))}
              <button className="w-7 h-7 flex items-center justify-center text-sm text-text-muted bg-transparent border-none cursor-pointer">→</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
