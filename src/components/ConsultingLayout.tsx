import Sidebar from './Sidebar';
import ConsultingStepContent from './ConsultingStepContent';
import { useConsultingTabs } from '../contexts/ConsultingTabsContext';

interface Props {
  orderId?: string;
  children?: React.ReactNode;
}

export default function ConsultingLayout({ orderId = '#20260520-7135' }: Props) {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab } = useConsultingTabs();

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">

        {/* 헤더 */}
        <header className="h-14 flex items-center justify-between py-2 px-5 bg-white border-b border-input-border shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-text-dark">고객상담</h1>
            <span className="text-sm text-muted bg-[#F0F1F3] rounded-xl px-2 py-1">{orderId}</span>
          </div>
          <button
            className="w-[200px] h-10 bg-primary text-white text-base font-semibold rounded-lg border-none cursor-pointer hover:bg-primary-hover"
            onClick={addTab}
          >
            + 상담추가
          </button>
        </header>

        {/* 탭 바 */}
        <div className="flex items-center h-11 bg-white border-b border-input-border shrink-0 px-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex justify-center items-center gap-2 h-full py-2 px-0.5 cursor-pointer select-none transition-colors border-b-2
                  ${isActive
                    ? 'border-b-primary bg-white text-[#111827]'
                    : 'border-b-transparent text-[#9CA3AF] hover:text-[#6B7280]'
                  }`}
              >
                <span className={`px-1 py-0.5 rounded text-xs font-normal leading-none
                  ${isActive ? 'bg-[#F0F1F3] text-[#6B7280]' : 'bg-[#F0F1F3] text-[#9CA3AF]'}`}>
                  미정
                </span>
                <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                  {tab.label}
                </span>
                <button
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[#9CA3AF] hover:text-[#111827] hover:bg-[#E2E4EC]"
                  onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            );
          })}

          <button
            className="w-10 h-11 flex items-center justify-center text-[#C4C4D0] hover:text-[#111827] bg-transparent border-none cursor-pointer"
            onClick={addTab}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <main className="flex-1 overflow-y-auto" key={activeTabId}>
          <ConsultingStepContent />
        </main>

      </div>
    </div>
  );
}