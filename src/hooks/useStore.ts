import { useState, useCallback } from 'react';

export function useStore() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      const res = await fetch('/api/stores/mine', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyBusinessNumber = async (businessRegistrationNumber: string) => {
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      const res = await fetch('/api/stores/business-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ businessRegistrationNumber: businessRegistrationNumber.replace(/-/g, '') })
      });
      
      if (res.ok) {
        return true;
      } else {
        const errorData = await res.json();
        let message = '인증에 실패했습니다.';
        if (res.status === 404 || errorData.message?.includes('존재하지 않는')) {
          message = '존재하지 않는 사업자등록번호입니다.';
        } else if (errorData.message?.includes('폐업')) {
          message = '폐업인 사업자등록번호입니다.';
        } else if (errorData.message) {
          message = errorData.message;
        }
        throw new Error(message);
      }
    } catch (e: any) {
      throw e;
    }
  };

  const createStore = async (payload: any) => {
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return true;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || '매장 등록에 실패했습니다.');
      }
    } catch (e: any) {
      throw e;
    }
  };

  return {
    isLoading,
    fetchMyStores,
    verifyBusinessNumber,
    createStore,
  };
}
