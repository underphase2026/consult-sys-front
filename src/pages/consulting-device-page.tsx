import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConsultingLayout from '../components/ConsultingLayout';

const CARRIER_LABEL: Record<string, string> = {
  skt: 'SKT',
  kt: 'KT',
  lgu: 'LG U+',
};

interface DeviceItem {
  id: string;
  brand: 'Apple' | 'Samsung';
  name: string;
  storage: string;
  price: string;
  featured: boolean;
}

const DEVICES: DeviceItem[] = [
  // ── Apple ──────────────────────────────────────────────────────
  {
    id: 'iphone-17-pro-max',
    brand: 'Apple',
    name: 'iPhone 17 Pro Max',
    storage: '256GB / 512GB / 1TB',
    price: '1,890,000원~',
    featured: true,
  },
  {
    id: 'iphone-17-pro',
    brand: 'Apple',
    name: 'iPhone 17 Pro',
    storage: '256GB / 512GB / 1TB',
    price: '1,690,000원~',
    featured: true,
  },
  {
    id: 'iphone-17',
    brand: 'Apple',
    name: 'iPhone 17',
    storage: '128GB / 256GB / 512GB',
    price: '1,390,000원~',
    featured: false,
  },
  {
    id: 'iphone-17e',
    brand: 'Apple',
    name: 'iPhone 17e',
    storage: '128GB / 256GB',
    price: '990,000원~',
    featured: false,
  },
  {
    id: 'iphone-16-pro-max',
    brand: 'Apple',
    name: 'iPhone 16 Pro Max',
    storage: '256GB / 512GB / 1TB',
    price: '1,750,000원~',
    featured: false,
  },
  {
    id: 'iphone-16-pro',
    brand: 'Apple',
    name: 'iPhone 16 Pro',
    storage: '128GB / 256GB / 512GB / 1TB',
    price: '1,550,000원~',
    featured: false,
  },
  // ── Samsung ────────────────────────────────────────────────────
  {
    id: 'galaxy-s25-ultra',
    brand: 'Samsung',
    name: 'Galaxy S25 Ultra',
    storage: '256GB / 512GB / 1TB',
    price: '1,899,800원~',
    featured: false,
  },
  {
    id: 'galaxy-s25-plus',
    brand: 'Samsung',
    name: 'Galaxy S25+',
    storage: '256GB / 512GB',
    price: '1,499,800원~',
    featured: false,
  },
  {
    id: 'galaxy-s25',
    brand: 'Samsung',
    name: 'Galaxy S25',
    storage: '128GB / 256GB',
    price: '1,199,800원~',
    featured: false,
  },
  {
    id: 'galaxy-z-fold7',
    brand: 'Samsung',
    name: 'Galaxy Z Fold7',
    storage: '256GB / 512GB',
    price: '2,199,800원~',
    featured: false,
  },
  {
    id: 'galaxy-z-flip7',
    brand: 'Samsung',
    name: 'Galaxy Z Flip7',
    storage: '256GB / 512GB',
    price: '1,399,800원~',
    featured: false,
  },
  {
    id: 'galaxy-s24-fe',
    brand: 'Samsung',
    name: 'Galaxy S24 FE',
    storage: '128GB / 256GB',
    price: '899,800원~',
    featured: false,
  },
];

const FEATURED = DEVICES.filter(d => d.featured);
const REST     = DEVICES.filter(d => !d.featured);

export default function ConsultingDevicePage() {
  const navigate     = useNavigate();
  const { carrier }  = useParams<{ carrier: string }>();
  const carrierLabel = CARRIER_LABEL[carrier ?? ''] ?? carrier?.toUpperCase();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [carrier]);

  return (
    <ConsultingLayout>
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-dark">기종을 선택해 주세요</h2>
          <span className="text-sm text-text-muted">{carrierLabel} 취급 기종</span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            {/* featured 스켈레톤 */}
            <div className="flex gap-4">
              <div className="flex-[2] h-[188px] rounded-2xl bg-[#F0F1F3]" />
              <div className="flex-[1] h-[188px] rounded-2xl bg-[#F0F1F3]" />
            </div>
            {/* grid 스켈레톤 */}
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[188px] rounded-2xl bg-[#F0F1F3]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 피처드 기종 */}
            <div className="flex gap-4">
              {FEATURED[0] && (
                <DeviceCard
                  device={FEATURED[0]}
                  className="flex-[2]"
                  onSelect={() => navigate(`/consulting/wireless/${carrier}/${FEATURED[0].id}`)}
                />
              )}
              {FEATURED[1] && (
                <DeviceCard
                  device={FEATURED[1]}
                  className="flex-[1]"
                  onSelect={() => navigate(`/consulting/wireless/${carrier}/${FEATURED[1].id}`)}
                />
              )}
            </div>

            {/* 나머지 기종 */}
            <div className="grid grid-cols-4 gap-4">
              {REST.map(device => (
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
      <div className="w-[88px] h-[120px] rounded-xl bg-[#F0F1F3] shrink-0 flex items-center justify-center">
        {device.brand === 'Apple' ? <AppleIcon /> : <SamsungIcon />}
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

function AppleIcon() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
      <path
        d="M23.2 18.0c-.1-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.8 1.2-4.8 1.2-1 0-2.6-1.1-4.2-1.1-2.2 0-4.2 1.3-5.3 3.2-2.3 3.9-.6 9.8 1.6 13 1.1 1.6 2.4 3.3 4.1 3.3 1.6-.1 2.2-1 4.2-1 2 0 2.5 1 4.2 1 1.7 0 2.9-1.6 4-3.2.7-1 1.2-1.9 1.5-2.6-3.4-1.3-3.4-5.3-3.4-5.5z"
        fill="#9CA3AF"
      />
      <path
        d="M19.8 8.1c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.9-3.7 2-.8 1-1.5 2.5-1.3 4 1.4.1 2.9-.7 3.7-1.9z"
        fill="#9CA3AF"
      />
    </svg>
  );
}

function SamsungIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <rect x="1" y="1" width="30" height="18" rx="3" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
      <text x="16" y="14" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="sans-serif" fontWeight="600">SAMSUNG</text>
    </svg>
  );
}
