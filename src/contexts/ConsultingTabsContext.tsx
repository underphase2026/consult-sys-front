import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

function stepToPath(step: ConsultingStep): string {
  switch (step.name) {
    case 'type-select': return '/consulting';
    case 'wireless-carrier': return '/consulting/wireless';
    case 'wireless-device': return `/consulting/wireless/${step.carrier.toLowerCase()}`;
    case 'wired-carrier': return '/consulting/wired';
  }
}

function pathToStep(pathname: string): ConsultingStep | null {
  if (pathname === '/consulting') return { name: 'type-select' };
  if (pathname === '/consulting/wireless') return { name: 'wireless-carrier' };
  if (pathname.startsWith('/consulting/wireless/')) {
    const carrier = pathname.split('/')[3]?.toUpperCase();
    return { name: 'wireless-device', carrier: carrier || 'SKT' };
  }
  if (pathname === '/consulting/wired') return { name: 'wired-carrier' };
  return null;
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
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = sessionStorage.getItem('consulting-tabs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [{ id: '1', label: '새 견적_1', step: { name: 'type-select' } }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return sessionStorage.getItem('consulting-active-tab-id') || '1';
  });

  useEffect(() => {
    sessionStorage.setItem('consulting-tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    sessionStorage.setItem('consulting-active-tab-id', activeTabId);
  }, [activeTabId]);

  const newQuoteProcessed = useRef(false);

  useEffect(() => {
    if (location.state?.newQuote && !newQuoteProcessed.current) {
      newQuoteProcessed.current = true;
      const newId = String(Date.now());
      setTabs(prev => {
        const label = `새 견적_${prev.length + 1}`;
        return [...prev, { id: newId, label, step: { name: 'type-select' } }];
      });
      setActiveTabId(newId);
      navigate('/consulting', { replace: true, state: {} });
    }
  }, [location.state?.newQuote, navigate]);

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  // Sync URL to activeTab when navigating steps
  const navigateStep = useCallback((step: ConsultingStep, label?: string) => {
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTabId ? { ...t, step, ...(label !== undefined ? { label } : {}) } : t
      )
    );
    navigate(stepToPath(step));
  }, [activeTabId, navigate]);

  // Sync activeTab to URL on browser Back/Forward or initial load
  useEffect(() => {
    const stepFromUrl = pathToStep(location.pathname);
    if (stepFromUrl) {
      if (JSON.stringify(activeTab.step) !== JSON.stringify(stepFromUrl)) {
        setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, step: stepFromUrl } : t)));
      }
    }
  }, [location.pathname]); // ignore activeTab.step dependency to avoid loops

  const addTab = useCallback(() => {
    const newId = String(Date.now());
    setTabs(prev => {
      const label = `새 견적_${prev.length + 1}`;
      return [...prev, { id: newId, label, step: { name: 'type-select' } }];
    });
    setActiveTabId(newId);
    navigate('/consulting');
  }, [navigate]);

  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length === 1) return prev;
      const idx = prev.findIndex(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        const nextActive = next[Math.min(idx, next.length - 1)];
        setActiveTabId(nextActive.id);
        navigate(stepToPath(nextActive.step));
      }
      return next;
    });
  }, [activeTabId, navigate]);

  const handleSetActiveTab = useCallback((id: string) => {
    setActiveTabId(id);
    const tab = tabs.find(t => t.id === id);
    if (tab) {
      navigate(stepToPath(tab.step));
    }
  }, [tabs, navigate]);

  return (
    <ConsultingTabsCtx.Provider
      value={{
        tabs, activeTabId, activeTab,
        addTab, removeTab,
        setActiveTab: handleSetActiveTab,
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
