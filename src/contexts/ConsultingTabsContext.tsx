import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';

export type ConsultingStep =
  | { name: 'type-select' }
  | { name: 'wireless-carrier' }
  | { name: 'wireless-device'; carrier: string }
  | { name: 'wireless-consulting'; carrier: string; deviceId: string }
  | { name: 'wired-carrier' };

export interface Tab {
  id: string;
  label: string;
  quoteId?: string;
  step: ConsultingStep;
}

function stepToPath(step: ConsultingStep): string {
  switch (step.name) {
    case 'type-select': return '/consulting';
    case 'wireless-carrier': return '/consulting/wireless';
    case 'wireless-device': return `/consulting/wireless/${step.carrier.toLowerCase()}`;
    case 'wireless-consulting': return `/consulting/wireless/${step.carrier.toLowerCase()}/${step.deviceId}`;
    case 'wired-carrier': return '/consulting/wired';
  }
}

function pathToStep(pathname: string): ConsultingStep | null {
  if (pathname === '/consulting') return { name: 'type-select' };
  if (pathname === '/consulting/wireless') return { name: 'wireless-carrier' };
  if (pathname.startsWith('/consulting/wireless/')) {
    const parts = pathname.split('/');
    const carrier = parts[3]?.toUpperCase();
    if (parts.length > 4 && parts[4]) {
      return { name: 'wireless-consulting', carrier: carrier || 'SKT', deviceId: parts[4] };
    }
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
  navigateStep: (step: ConsultingStep, label?: string, quoteId?: string) => void;
}

const ConsultingTabsCtx = createContext<ContextType | null>(null);

export function ConsultingTabsProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();

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

  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // 1. 초기 로드 시 DB에서 탭 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      setIsDbLoaded(true);
      return;
    }

    fetch('/api/api/consultations/temp-quotes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const tempQuotes = data.data;
          const mappedTabs: Tab[] = tempQuotes.map((t: any) => ({
            id: t.id,
            label: `${t.carrierId}_${t.deviceName}`,
            quoteId: t.id,
            step: {
              name: 'wireless-consulting',
              carrier: t.carrierId,
              deviceId: t.deviceId
            }
          }));
          
          setTabs(mappedTabs);
          setActiveTabId(mappedTabs[0].id);
          
          navigate(stepToPath(mappedTabs[0].step), { replace: true });
        } else {
          // No DB temp quotes, if we have sessionStorage tabs keep them, otherwise reset
          const saved = sessionStorage.getItem('consulting-tabs');
          if (!saved) {
            setTabs([{ id: '1', label: '새 견적_1', step: { name: 'type-select' } }]);
            setActiveTabId('1');
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsDbLoaded(true);
      });
  }, []);

  // 2. 탭이 변경될 때마다 sessionStorage에 동기화
  useEffect(() => {
    sessionStorage.setItem('consulting-tabs', JSON.stringify(tabs));
    sessionStorage.setItem('consulting-active-tab-id', activeTabId);
  }, [tabs, activeTabId]);

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
  const navigateStep = useCallback((step: ConsultingStep, label?: string, quoteId?: string) => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTabId) {
          const updated = { ...t, step };
          if (label !== undefined) updated.label = label;
          if (quoteId !== undefined) updated.quoteId = quoteId;
          return updated;
        }
        return t;
      })
    );
    navigate(stepToPath(step));
  }, [activeTabId, navigate]);

  // Sync activeTab to URL on browser Back/Forward or initial load
  useEffect(() => {
    if (location.state?.newQuote) return;

    const stepFromUrl = pathToStep(location.pathname);
    if (stepFromUrl) {
      if (JSON.stringify(activeTab.step) !== JSON.stringify(stepFromUrl)) {
        if (navType === 'POP') {
          setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, step: stepFromUrl } : t)));
        } else {
          navigate(stepToPath(activeTab.step), { replace: true });
        }
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
      const tabToRemove = prev.find(t => t.id === id);
      if (!tabToRemove) return prev;
      if (prev.length === 1) return prev;

      // DB에 저장된 임시 견적(quoteId가 있는 탭)이라면 서버에 비활성화 요청
      if (tabToRemove.quoteId) {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
          fetch(`/api/api/consultations/temp-quotes/${tabToRemove.quoteId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          }).catch(console.error);
        }
      }

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
