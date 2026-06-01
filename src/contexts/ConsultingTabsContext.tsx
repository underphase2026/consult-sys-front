import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ConsultingStep =
  | { name: 'type-select' }
  | { name: 'wireless-carrier' }
  | { name: 'wireless-device'; carrier: string }
  | { name: 'wireless-consulting'; carrier: string; deviceId: string }
  | { name: 'wired-carrier' };

export interface Tab {
  id: string;
  label: string;
  step: ConsultingStep;
}

interface ContextType {
  tabs: Tab[];
  activeTabId: string;
  activeTab: Tab;
  addTab: () => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  navigateStep: (step: ConsultingStep, label?: string) => void;
}

const ConsultingTabsCtx = createContext<ContextType | null>(null);

export function ConsultingTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', label: '새 견적_1', step: { name: 'type-select' } },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  const addTab = useCallback(() => {
    const newId = String(Date.now());
    setTabs(prev => {
      const label = `새 견적_${prev.length + 1}`;
      return [...prev, { id: newId, label, step: { name: 'type-select' } }];
    });
    setActiveTabId(newId);
  }, []);

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

  const navigateStep = useCallback((step: ConsultingStep, label?: string) => {
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTabId ? { ...t, step, ...(label !== undefined ? { label } : {}) } : t
      )
    );
  }, [activeTabId]);

  return (
    <ConsultingTabsCtx.Provider
      value={{
        tabs, activeTabId, activeTab,
        addTab, removeTab,
        setActiveTab: setActiveTabId,
        navigateStep,
      }}
    >
      {children}
    </ConsultingTabsCtx.Provider>
  );
}

export function useConsultingTabs() {
  const ctx = useContext(ConsultingTabsCtx);
  if (!ctx) throw new Error('useConsultingTabs must be used within ConsultingTabsProvider');
  return ctx;
}
