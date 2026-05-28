import { useNavigate, useParams } from 'react-router-dom';
import ConsultingLayout from '../components/ConsultingLayout';

const CARRIER_LABEL: Record<string, string> = {
  skt: 'SKT',
  kt: 'KT',
  lgu: 'LG U+',
};

const DEVICES = [
  {
    id: 'galaxy-s25-ultra',
    brand: 'Samsung',
    name: 'Galaxy S25 Ultra',
    storage: '256GB / 512GB / 1TB',
    price: '1,899,800원~',
    featured: true,
  },
  {
    id: 'galaxy-s25',
    brand: 'Samsung',
    name: 'Galaxy S25',
    storage: '128GB / 256GB',
    price: '1,199,800원~',
    featured: true,
  },
  {
    id: 'iphone-16-pro',
    brand: 'Apple',
    name: 'iPhone 16 Pro',
    storage: '128GB / 256GB / 512GB / 1TB',
    price: '1,550,000원~',
    featured: false,
  },
  {
    id: 'iphone-16',
    brand: 'Apple',
    name: 'iPhone 16',
    storage: '128GB / 256GB / 512GB',
    price: '1,250,000원~',
    featured: false,
  },
  {
    id: 'galaxy-z-fold6',
    brand: 'Samsung',
    name: 'Galaxy Z Fold6',
    storage: '256GB / 512GB',
    price: '2,099,800원~',
    featured: false,
  },
  {
    id: 'galaxy-z-flip6',
    brand: 'Samsung',
    name: 'Galaxy Z Flip6',
    storage: '256GB / 512GB',
    price: '1,399,800원~',
    featured: false,
  },
];

const FEATURED = DEVICES.filter(d => d.featured);
const REST = DEVICES.filter(d => !d.featured);

export default function ConsultingDevicePage() {
  const navigate = useNavigate();
  const { carrier } = useParams<{ carrier: string }>();
  const carrierLabel = CARRIER_LABEL[carrier ?? ''] ?? carrier?.toUpperCase();

  return (
    <ConsultingLayout>
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-dark">기종을 선택해 주세요</h2>
          <span className="text-sm text-text-muted">{carrierLabel} 취급 기종</span>
        </div>

        {/* 피처드 기종 (888:188 + 432:188 비율) */}
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
  device: typeof DEVICES[0];
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
