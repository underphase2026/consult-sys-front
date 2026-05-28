import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 탭별 현재 화면 상태 타입
export type ConsultingStep =
  | { name: 'type-select' }
  | { name: 'wireless-carrier' }
  | { name: 'wireless-device'; carrier: string }
  | { name: 'wired-carrier' }
  | { name: 'wired-product'; carrier: string };

export interface Tab {
  id: string;
  label: string;
  step: ConsultingStep;
  completed?: boolean; // 상담 완료 여부
}

interface ContextType {
  tabs: Tab[];
  activeTabId: string;
  activeTab: Tab;
  addTab: () => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  navigateStep: (step: ConsultingStep) => void;
  completeTab: (id: string) => void;
}

const ConsultingTabsCtx = createContext<ContextType | null>(null);

export function ConsultingTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', label: '새 견적_1', step: { name: 'type-select' } },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  // 새 탭 추가 — 항상 독립적인 초기 상태로 시작
  const addTab = useCallback(() => {
    const newId = String(Date.now());
    setTabs(prev => {
      const label = `새 견적_${prev.length + 1}`;
      return [...prev, { id: newId, label, step: { name: 'type-select' } }];
    });
    setActiveTabId(newId);
  }, []);

  // 탭 닫기
  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length === 1) return prev;
      const idx = prev.findIndex(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(next[Math.min(idx, next.length - 1)].id);
      }
      return next;
    });
  }, [activeTabId]);

  // 현재 활성 탭의 화면 이동
  const navigateStep = useCallback((step: ConsultingStep) => {
    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, step } : t))
    );
  }, [activeTabId]);

  // 특정 탭 완료 처리
  const completeTab = useCallback((id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: true } : t))
    );
  }, []);

  return (
    <ConsultingTabsCtx.Provider
      value={{
        tabs, activeTabId, activeTab,
        addTab, removeTab,
        setActiveTab: setActiveTabId,
        navigateStep,
        completeTab,
      }}
    >
      {children}
    </ConsultingTabsCtx.Provider>
  );
}

// 탭 완료 여부 → 상태 배지 텍스트 (미정 / 완료)
export function getTabStateLabel(tab: Tab): string {
  return tab.completed ? '완료' : '미정';
}

export function useConsultingTabs() {
  const ctx = useContext(ConsultingTabsCtx);
  if (!ctx) throw new Error('useConsultingTabs must be used within ConsultingTabsProvider');
  return ctx;
}
