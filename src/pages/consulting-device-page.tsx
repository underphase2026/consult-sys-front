import { useNavigate, useParams } from 'react-router-dom';
import ConsultingLayout from '../components/ConsultingLayout';

const CARRIER_LABEL: Record<string, string> = {
  skt: 'SKT',
  kt: 'KT',
  lgu: 'LG U+',
};

interface DeviceItem {
  id: string;
  brand: string;
  name: string;
  storage: string;
  price: string;
  featured: boolean;
}

import { useState, useEffect } from 'react';

export default function ConsultingDevicePage() {
  const navigate = useNavigate();
  const { carrier } = useParams<{ carrier: string }>();
  const carrierLabel = CARRIER_LABEL[carrier ?? ''] ?? carrier?.toUpperCase();

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const apiCarrier = carrier?.toUpperCase() || 'SKT';
        const res = await fetch(`/api/api/consultations/devices?networkType=WIRELESS&carrier=${apiCarrier}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('기기 목록을 불러오지 못했습니다.');
        
        const json = await res.json();
        const dataList = Array.isArray(json) ? json : (json.data || []);
        
        const mapped: DeviceItem[] = dataList.map((d: any, idx: number) => {
          const nameLower = (d.deviceName || '').toLowerCase();
          let brand = '기타';
          if (nameLower.includes('galaxy') || nameLower.includes('갤럭시')) brand = 'Samsung';
          else if (nameLower.includes('iphone') || nameLower.includes('아이폰')) brand = 'Apple';
          
          return {
            id: d.id,
            brand,
            name: d.deviceName,
            storage: '256GB / 512GB', // 스펙에 없으므로 기본값
            price: `${(d.retailPrice || 0).toLocaleString()}원~`,
            featured: idx < 2
          };
        });
        setDevices(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [carrier]);

  const featuredDevices = devices.filter(d => d.featured);
  const restDevices = devices.filter(d => !d.featured);

  return (
    <ConsultingLayout>
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-dark">기종을 선택해 주세요</h2>
          <span className="text-sm text-text-muted">{carrierLabel} 취급 기종</span>
        </div>

        {/* 피처드 기종 (888:188 + 432:188 비율) */}
        {isLoading ? (
          <div className="py-20 text-center text-text-gray">기종 목록을 불러오는 중...</div>
        ) : (
          <>
            <div className="flex gap-4">
              {featuredDevices[0] && (
                <DeviceCard
                  device={featuredDevices[0]}
                  className="flex-[2]"
                  onSelect={() => navigate(`/consulting/wireless/${carrier}/${featuredDevices[0].id}`)}
                />
              )}
              {featuredDevices[1] && (
                <DeviceCard
                  device={featuredDevices[1]}
                  className="flex-[1]"
                  onSelect={() => navigate(`/consulting/wireless/${carrier}/${featuredDevices[1].id}`)}
                />
              )}
            </div>

            {/* 나머지 기종 */}
            <div className="grid grid-cols-4 gap-4">
              {restDevices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onSelect={() => navigate(`/consulting/wireless/${carrier}/${device.id}`)}
                />
              ))}
            </div>
          </>
        )}

        <button
          className="text-sm text-text-muted hover:text-text-gray bg-transparent border-none cursor-pointer underline self-start"
          onClick={() => navigate('/consulting/wireless')}
        >
          ← 이전으로
        </button>
      </div>
    </ConsultingLayout>
  );
}

function DeviceCard({
  device,
  className = '',
  onSelect,
}: {
  device: DeviceItem;
  className?: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`${className} bg-white rounded-2xl border border-[#E2E4EC] h-[188px] flex items-center gap-6 px-8 cursor-pointer hover:shadow-md hover:border-primary transition-all text-left`}
    >
      {/* 기기 이미지 placeholder */}
      <div className="w-[88px] h-[120px] rounded-xl bg-[#F0F1F3] shrink-0 flex items-center justify-center">
        <PhoneOutlineIcon />
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-xs text-text-muted">{device.brand}</span>
        <span className="text-base font-semibold text-text-dark">{device.name}</span>
        <span className="text-sm text-text-gray">{device.storage}</span>
        <span className="text-sm font-medium text-primary mt-1">{device.price}</span>
      </div>
    </button>
  );
}

function PhoneOutlineIcon() {
  return (
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      <rect x="2" y="2" width="28" height="44" rx="4" stroke="#D1D5DB" strokeWidth="2" />
      <rect x="6" y="6" width="20" height="32" rx="2" fill="#F9FAFB" />
      <circle cx="16" cy="43" r="2" fill="#D1D5DB" />
    </svg>
  );
}
