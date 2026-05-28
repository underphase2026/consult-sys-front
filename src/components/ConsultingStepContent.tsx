import { useConsultingTabs, ConsultingStep } from '../contexts/ConsultingTabsContext';
import SKT from '../images/SKT.svg';
import KT from '../images/KT.svg';
import UPlus from '../images/U+.svg';
import WirelessIcon from '../images/whireless.svg';
import WiredIcon from '../images/wired.svg';

const CARRIERS = [
  { key: 'skt', label: 'SKT', logo: SKT },
  { key: 'kt', label: 'KT', logo: KT },
  { key: 'lgu', label: 'LG U+', logo: UPlus },
];

const CARRIER_LABEL: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };

const DEVICES = [
  { id: 'galaxy-s25-ultra', brand: 'Samsung', name: 'Galaxy S25 Ultra', storage: '256GB / 512GB / 1TB',  price: '1,899,800원~', featured: true  },
  { id: 'galaxy-s25',       brand: 'Samsung', name: 'Galaxy S25',       storage: '128GB / 256GB',         price: '1,199,800원~', featured: true  },
  { id: 'iphone-16-pro',    brand: 'Apple',   name: 'iPhone 16 Pro',    storage: '128GB / 256GB / 512GB / 1TB', price: '1,550,000원~', featured: false },
  { id: 'iphone-16',        brand: 'Apple',   name: 'iPhone 16',        storage: '128GB / 256GB / 512GB', price: '1,250,000원~', featured: false },
  { id: 'galaxy-z-fold6',   brand: 'Samsung', name: 'Galaxy Z Fold6',   storage: '256GB / 512GB',         price: '2,099,800원~', featured: false },
  { id: 'galaxy-z-flip6',   brand: 'Samsung', name: 'Galaxy Z Flip6',   storage: '256GB / 512GB',         price: '1,399,800원~', featured: false },
];

// ────────────────────────────────────────────────────────────
// 메인 스위치: 현재 활성 탭의 step에 따라 화면 결정
// key={activeTabId}로 탭 전환 시 컴포넌트 재마운트 → 완전 독립
// ────────────────────────────────────────────────────────────
export default function ConsultingStepContent() {
  const { activeTab, navigateStep } = useConsultingTabs();
  const { step } = activeTab;

  switch (step.name) {
    case 'type-select':
      return <TypeSelectStep navigate={navigateStep} />;
    case 'wireless-carrier':
      return <WirelessCarrierStep navigate={navigateStep} />;
    case 'wireless-device':
      return <WirelessDeviceStep carrier={step.carrier} navigate={navigateStep} />;
    case 'wired-carrier':
      return <WiredCarrierStep navigate={navigateStep} />;
    case 'wired-product':
      return <WiredProductStep carrier={step.carrier} navigate={navigateStep} />;
    default:
      return null;
  }
}

// ────────────────────────────────────────────────────────────
// Step 1: 상담 유형 선택 (무선 / 유선)
// ────────────────────────────────────────────────────────────
function TypeSelectStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-2xl font-semibold text-text-dark">상담 유형을 선택해 주세요</h2>
      <div className="flex gap-6">
        <button
          className="w-[360px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
          onClick={() => navigate({ name: 'wireless-carrier' })}
        >
          <img src={WirelessIcon} alt="무선상담" className="w-[112px] h-[112px]" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-semibold text-text-dark">무선상담</span>
            <div className="flex gap-1.5"><Tag label="# 휴대폰 개통" /></div>
          </div>
        </button>

        <button
          className="w-[360px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
          onClick={() => navigate({ name: 'wired-carrier' })}
        >
          <img src={WiredIcon} alt="유선상담" className="w-[112px] h-[112px]" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-semibold text-text-dark">유선상담</span>
            <div className="flex gap-1.5">
              <Tag label="# 인터넷" /><Tag label="# TV" /><Tag label="# 인터넷 전화" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Step 2a: 무선 통신사 선택
// ────────────────────────────────────────────────────────────
function WirelessCarrierStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-2xl font-semibold text-text-dark">통신사를 선택해 주세요</h2>
      <div className="flex gap-6">
        {CARRIERS.map(carrier => (
          <button
            key={carrier.key}
            className="w-[280px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md hover:border-primary transition-all"
            onClick={() => navigate({ name: 'wireless-device', carrier: carrier.key })}
          >
            <img src={carrier.logo} alt={carrier.label} className="w-28 h-28 object-contain" />
            <span className="text-base font-semibold text-text-dark">{carrier.label}</span>
          </button>
        ))}
      </div>
      <BackButton onClick={() => navigate({ name: 'type-select' })} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Step 3a: 무선 기종 선택
// ────────────────────────────────────────────────────────────
function WirelessDeviceStep({
  carrier,
  navigate,
}: {
  carrier: string;
  navigate: (s: ConsultingStep) => void;
}) {
  const carrierLabel = CARRIER_LABEL[carrier] ?? carrier.toUpperCase();
  const featured = DEVICES.filter(d => d.featured);
  const rest = DEVICES.filter(d => !d.featured);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text-dark">기종을 선택해 주세요</h2>
        <span className="text-sm text-text-muted">{carrierLabel} 취급 기종</span>
      </div>

      <div className="flex gap-4">
        {featured[0] && (
          <DeviceCard device={featured[0]} className="flex-[2]" onSelect={() => {}} />
        )}
        {featured[1] && (
          <DeviceCard device={featured[1]} className="flex-[1]" onSelect={() => {}} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {rest.map(device => (
          <DeviceCard key={device.id} device={device} onSelect={() => {}} />
        ))}
      </div>

      <BackButton onClick={() => navigate({ name: 'wireless-carrier' })} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Step 2b: 유선 통신사 선택
// ────────────────────────────────────────────────────────────
function WiredCarrierStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-2xl font-semibold text-text-dark">통신사를 선택해 주세요</h2>
      <div className="flex gap-6">
        {CARRIERS.map(carrier => (
          <button
            key={carrier.key}
            className="w-[280px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md hover:border-primary transition-all"
            onClick={() => navigate({ name: 'wired-product', carrier: carrier.key })}
          >
            <img src={carrier.logo} alt={carrier.label} className="w-28 h-28 object-contain" />
            <span className="text-base font-semibold text-text-dark">{carrier.label}</span>
          </button>
        ))}
      </div>
      <BackButton onClick={() => navigate({ name: 'type-select' })} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Step 3b: 유선 상품 선택
// ────────────────────────────────────────────────────────────
function WiredProductStep({
  carrier,
  navigate,
}: {
  carrier: string;
  navigate: (s: ConsultingStep) => void;
}) {
  const carrierLabel = CARRIER_LABEL[carrier] ?? carrier.toUpperCase();

  const PRODUCTS = [
    {
      key: 'internet',
      label: '인터넷',
      desc: '초고속 광랜 인터넷',
      tags: ['기가 인터넷', '안심 인터넷'],
      icon: <InternetIcon />,
    },
    {
      key: 'tv',
      label: 'TV',
      desc: 'IPTV / 케이블 TV',
      tags: ['UHD', '4K', 'VOD'],
      icon: <TvIcon />,
    },
    {
      key: 'phone',
      label: '인터넷 전화',
      desc: '기업용 / 가정용 인터넷 전화',
      tags: ['070 인터넷 전화', 'KT BizCall'],
      icon: <PhoneIcon />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-semibold text-text-dark">상품을 선택해 주세요</h2>
        <span className="text-sm text-text-muted">{carrierLabel} 유선 상품</span>
      </div>

      <div className="flex gap-6">
        {PRODUCTS.map(product => (
          <button
            key={product.key}
            className="w-[280px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
            onClick={() => {/* TODO: 결제 step 연결 */}}
          >
            <div className="w-[88px] h-[88px] rounded-full bg-[#EBF3FF] flex items-center justify-center">
              {product.icon}
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-semibold text-text-dark">{product.label}</span>
              <span className="text-sm text-text-muted">{product.desc}</span>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs text-primary bg-[#EBF3FF]">
                    # {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <BackButton onClick={() => navigate({ name: 'wired-carrier' })} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 공통 소형 컴포넌트
// ────────────────────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-sm text-text-muted hover:text-text-gray bg-transparent border-none cursor-pointer underline"
      onClick={onClick}
    >
      ← 이전으로
    </button>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="px-2 py-0.5 rounded text-xs text-primary bg-[#EBF3FF]">{label}</span>;
}

function DeviceCard({
  device,
  className = '',
  onSelect,
}: {
  device: (typeof DEVICES)[0];
  className?: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`${className} bg-white rounded-2xl border border-[#E2E4EC] h-[188px] flex items-center gap-6 px-8 cursor-pointer hover:shadow-md hover:border-primary transition-all text-left`}
    >
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

// ────────────────────────────────────────────────────────────
// SVG 아이콘
// ────────────────────────────────────────────────────────────
function PhoneOutlineIcon() {
  return (
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      <rect x="2" y="2" width="28" height="44" rx="4" stroke="#D1D5DB" strokeWidth="2" />
      <rect x="6" y="6" width="20" height="32" rx="2" fill="#F9FAFB" />
      <circle cx="16" cy="43" r="2" fill="#D1D5DB" />
    </svg>
  );
}

function InternetIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="8" width="32" height="22" rx="3" fill="#C8DCFF" />
      <rect x="8" y="12" width="24" height="14" rx="1.5" fill="#EBF3FF" />
      <path d="M12 30h16l2 4H10l2-4z" fill="#7AACFF" />
      <path d="M14 22l6-6 6 6" stroke="#7AACFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
      <rect x="4" y="6" width="36" height="26" rx="3" fill="#C8DCFF" />
      <rect x="8" y="10" width="28" height="18" rx="1.5" fill="#EBF3FF" />
      <rect x="14" y="33" width="16" height="3" rx="1.5" fill="#7AACFF" />
      <path d="M18 19l7-4v8l-7-4z" fill="#7AACFF" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="4" width="24" height="32" rx="4" fill="#C8DCFF" />
      <rect x="12" y="8" width="16" height="20" rx="2" fill="#EBF3FF" />
      <circle cx="20" cy="32" r="2" fill="#7AACFF" />
      <path d="M16 14h8M16 17h6" stroke="#7AACFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
