import Sidebar from './Sidebar';
import ConsultingStepContent from './ConsultingStepContent';
import { useConsultingTabs, getTabStateLabel } from '../contexts/ConsultingTabsContext';

interface Props {
  orderId?: string;
  children?: React.ReactNode; // 기존 페이지 파일과의 하위 호환용 (렌더링 안 함)
}

export default function ConsultingLayout({ orderId = '#20260520-7135' }: Props) {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab } = useConsultingTabs();

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">

        {/* 헤더 */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#E2E4EC] shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-text-dark">고객상담</h1>
            <span className="text-sm text-text-gray bg-[#F0F1F3] rounded px-2 py-0.5">{orderId}</span>
          </div>
          <button
            className="h-10 px-5 bg-primary text-white text-base font-semibold rounded-lg border-none cursor-pointer hover:bg-primary-hover"
            onClick={addTab}
          >
            + 상담추가
          </button>
        </header>

        {/* 탭 바 */}
        <div className="flex items-end h-11 px-4 bg-white border-b border-[#E2E4EC] gap-1 shrink-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const stateLabel = getTabStateLabel(tab);

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 h-9 px-3 cursor-pointer select-none text-sm transition-colors rounded-t-md
                  ${isActive
                    ? 'bg-white border border-b-0 border-[#E2E4EC] -mb-px'
                    : 'bg-[#F5F6FA] border border-transparent hover:bg-white'
                  }`}
              >
                {/* 상태 배지 */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium leading-none
                    ${isActive ? 'bg-[#F0F1F3] text-[#6B7280]' : 'bg-[#F0F1F3] text-[#9CA3AF]'}`}
                >
                  {stateLabel}
                </span>

                {/* 탭 라벨 */}
                <span className={isActive ? 'font-semibold text-[#111827]' : 'text-[#9CA3AF]'}>
                  {tab.label}
                </span>

                {/* 닫기 버튼 */}
                <button
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[#9CA3AF] hover:text-[#111827] hover:bg-[#E2E4EC]"
                  onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* 활성 탭 파란 하단 인디케이터 */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-b" />
                )}
              </div>
            );
          })}

          {/* 탭 추가 버튼 */}
          <button
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] bg-transparent border-none cursor-pointer rounded"
            onClick={addTab}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 본문: key={activeTabId} → 탭 전환 시 완전 독립 */}
        <main className="flex-1 overflow-y-auto" key={activeTabId}>
          <ConsultingStepContent />
        </main>

      </div>
    </div>
  );
}
