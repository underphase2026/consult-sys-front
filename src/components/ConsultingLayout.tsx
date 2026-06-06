import React, { useRef, useState } from 'react';
import Sidebar from './Sidebar';
import ConsultingStepContent from './ConsultingStepContent';
import { useConsultingTabs } from '../contexts/ConsultingTabsContext';

interface Props {
  orderId?: string;
  children?: React.ReactNode;
}

export default function ConsultingLayout({ orderId = '#20260520-7135' }: Props) {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab } = useConsultingTabs();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (Math.abs(x - startX) > 5) setDragged(true);
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">

        {/* 헤더 */}
        <header className="h-14 flex items-center justify-between py-2 px-5 bg-white border-b border-input-border shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-text-dark leading-6">고객상담</h1>
            <span className="flex items-center gap-[10px] text-sm font-normal leading-[16px] text-[#9CA3AF] bg-[#F0F1F3] rounded-xl px-2 py-1">{orderId}</span>
          </div>
          <button
            className="flex w-[200px] h-[40px] px-3 justify-center items-center bg-[#1A80FF] hover:bg-[#5AAAFF] text-white text-base font-semibold rounded-lg border-none cursor-pointer transition-colors"
            onClick={addTab}
          >
            + 상담추가
          </button>
        </header>

        {/* 탭 바 */}
        <div 
          ref={scrollContainerRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex items-center h-11 bg-white border-b border-input-border shrink-0 px-2 overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const badgeLabel = tab.step.name.startsWith('wireless') ? '무선'
              : tab.step.name.startsWith('wired') ? '유선'
              : '미정';
            return (
              <div
                key={tab.id}
                onClickCapture={(e) => {
                  if (dragged) {
                    e.stopPropagation();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex justify-center items-center gap-2 h-full py-2 px-0.5 cursor-pointer select-none border-b-2 shrink-0 whitespace-nowrap
                  ${isActive
                    ? 'border-b-primary bg-white text-[#111827]'
                    : 'border-b-transparent text-[#9CA3AF]'
                  }`}
              >
                <span className={`flex flex-col justify-center items-center rounded text-xs font-normal
                  ${badgeLabel !== '미정'
                    ? 'px-1 py-[2px] bg-[#E8F2FF] text-[#5AAAFF] leading-4'
                    : isActive ? 'px-1 py-0.5 bg-[#F0F1F3] text-[#6B7280] leading-none' : 'px-1 py-0.5 bg-[#F0F1F3] text-[#9CA3AF] leading-none'
                  }`}>
                  {badgeLabel}
                </span>
                <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                  {tab.label}
                </span>
                <button
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[#9CA3AF]"
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
            className="w-10 h-11 flex items-center justify-center text-[#C4C4D0] bg-transparent border-none cursor-pointer shrink-0"
            onClick={addTab}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <main className="flex-1 overflow-y-auto">
          <ConsultingStepContent />
        </main>

      </div>
    </div>
  );
}