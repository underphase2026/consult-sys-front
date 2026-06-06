import { useState, useCallback } from 'react';

export interface DeviceData {
  id: string;
  brand: string;
  name: string;
  model: string;
  price: string;
  support: string;
  remaining: string;
  colors: { name: string; hex: string }[];
  specs: Record<string, string>;
  featured?: boolean;
}

const deviceCache: Record<string, DeviceData[]> = {};

export function getCachedDevices(carrier: string, networkType: string = 'WIRELESS'): DeviceData[] | null {
  return deviceCache[`${networkType}_${carrier.toUpperCase()}`] || null;
}

export function useConsulting() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchDevices = useCallback(async (carrier: string, networkType: string = 'WIRELESS') => {
    const cacheKey = `${networkType}_${carrier.toUpperCase()}`;
    if (deviceCache[cacheKey]) {
      return deviceCache[cacheKey];
    }

    setIsLoading(true);
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      const res = await fetch(`/api/api/consultations/devices?networkType=${networkType}&carrier=${carrier.toUpperCase()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('기기 목록을 불러오지 못했습니다.');
      
      const json = await res.json();
      const dataList = Array.isArray(json) ? json : (json.data || []);
      
      const mapped: DeviceData[] = dataList.map((d: any, idx: number) => {
        const nameLower = (d.deviceName || '').toLowerCase();
        let brand = '기타';
        if (nameLower.includes('galaxy') || nameLower.includes('갤럭시')) brand = 'Samsung';
        else if (nameLower.includes('iphone') || nameLower.includes('아이폰')) brand = 'Apple';
        
        return {
          id: String(d.id),
          brand,
          name: d.deviceName,
          model: d.modelName || '',
          price: `${(d.retailPrice || 0).toLocaleString()}원`,
          support: `${(d.publicSubsidy || 0).toLocaleString()}원`,
          remaining: `${(d.principal || 0).toLocaleString()}원`,
          colors: [
            { name: '소프트핑크', hex: '#F2B8C6' },
            { name: '화이트',     hex: '#F5F5F0' },
            { name: '블랙',       hex: '#1C1C1E' },
          ],
          specs: {
            cpu: d.specs?.cpu || '-',
            ram: d.specs?.ram || '-',
            storage: d.specs?.storage || '256GB / 512GB',
            display: d.specs?.display || '-',
            camera: d.specs?.camera || '-',
            battery: d.specs?.battery || '-',
            weight: d.specs?.weight || '-',
            released: d.releaseDate ? new Date(d.releaseDate).toLocaleDateString('ko-KR') : '-',
          },
          featured: idx < 2
        };
      });
      deviceCache[cacheKey] = mapped;
      return mapped;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTempQuote = useCallback(async (networkType: string, carrierId: string, deviceId: string, deviceName: string) => {
    const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
    if (!token) return null;
    try {
      const res = await fetch('/api/api/consultations/temp-quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ networkType: networkType.toUpperCase(), carrierId: carrierId.toUpperCase(), deviceId, deviceName })
      });
      if (!res.ok) throw new Error('임시 견적 생성에 실패했습니다.');
      const json = await res.json();
      return json.data; // Returns TempQuote entity
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  return {
    isLoading,
    fetchDevices,
    createTempQuote,
  };
}
