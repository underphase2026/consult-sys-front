import { useState, useRef, useEffect } from 'react';
import PaymentInfo from '../pages/skt_info';
import LguPaymentInfo from '../pages/U+_info';
import { useConsultingTabs, ConsultingStep } from '../contexts/ConsultingTabsContext';
import SKT from '../images/SKT.svg';
import KT from '../images/KT.svg';
import UPlus from '../images/U+.svg';
import WirelessIcon from '../images/whireless.svg';
import WiredIcon from '../images/wired.svg';
import Iphone17eImg from '../images/Iphone17e.svg';
import SearchImg from '../images/search.svg';

const CARRIERS = [
  { key: 'skt', label: 'SKT', logo: SKT },
  { key: 'kt',  label: 'KT',  logo: KT  },
  { key: 'lgu', label: 'LG U+', logo: UPlus },
];

const BRAND_FILTERS = [
  { key: 'all',     label: '전체' },
  { key: 'samsung', label: '삼성' },
  { key: 'apple',   label: '애플' },
  { key: 'other',   label: '기타' },
] as const;

type BrandFilter = typeof BRAND_FILTERS[number]['key'];

type DeviceColor = { name: string; hex: string };

type Device = {
  id: string;
  brand: string;
  name: string;
  model: string;
  price: string;
  support: string;
  remaining: string;
  colors: DeviceColor[];
  specs: Record<string, string>;
};

const DEVICE_IMAGES: Record<string, string> = {
  'iphone-17e': Iphone17eImg,
};

const DEVICES: Device[] = [
  // ── 사진 보유 기기 (최상단) ────────────────────────────────────
  {
    id: 'iphone-17e',
    brand: 'Apple',
    name: '아이폰 17e',
    model: 'IP17E_256GB',
    price: '990,000원',
    support: '113,000원',
    remaining: '554,000원',
    colors: [
      { name: '소프트핑크', hex: '#F2B8C6' },
      { name: '화이트',     hex: '#F5F5F0' },
      { name: '블랙',       hex: '#1C1C1E' },
    ],
    specs: {
      cpu: 'A19칩', ram: '8GB', storage: '256GB', display: '6.1인치',
      camera: '전면: 1,200만\n후면: 4,800만', battery: '4005mah',
      weight: '200g', released: '2026년 3월 11일',
    },
  },
  // ── Apple ──────────────────────────────────────────────────────
  {
    id: 'iphone-17-pro-max',
    brand: 'Apple',
    name: '아이폰 17 Pro Max',
    model: 'IP17PROMAX_256GB',
    price: '990,000원',
    support: '300,000원',
    remaining: '890,000원',
    colors: [
      { name: '네추럴 티타늄', hex: '#C5B9A8' },
      { name: '블랙 티타늄',   hex: '#4A4A4C' },
      { name: '화이트 티타늄', hex: '#F5F5EF' },
    ],
    specs: {
      cpu: 'A19 Pro칩', ram: '8GB', storage: '256GB', display: '6.9인치 Super Retina XDR',
      camera: '전면: 1,200만\n후면: 4,800만 트리플', battery: '4685mah',
      weight: '227g', released: '2025년 9월',
    },
  },
  {
    id: 'iphone-17-pro',
    brand: 'Apple',
    name: '아이폰 17 Pro',
    model: 'IP17PRO_256GB',
    price: '990,000원',
    support: '200,000원',
    remaining: '990,000원',
    colors: [
      { name: '네추럴 티타늄', hex: '#C5B9A8' },
      { name: '블랙 티타늄',   hex: '#4A4A4C' },
      { name: '화이트 티타늄', hex: '#F5F5EF' },
    ],
    specs: {
      cpu: 'A19 Pro칩', ram: '8GB', storage: '256GB', display: '6.3인치 Super Retina XDR',
      camera: '전면: 1,200만\n후면: 4,800만 트리플', battery: '4422mah',
      weight: '199g', released: '2025년 9월',
    },
  },
  {
    id: 'iphone-17',
    brand: 'Apple',
    name: '아이폰 17',
    model: 'IP17_128GB',
    price: '790,000원',
    support: '370,000원',
    remaining: '820,000원',
    colors: [
      { name: '울트라마린', hex: '#5B7EB5' },
      { name: '화이트',     hex: '#FAFAFA'  },
      { name: '블랙',       hex: '#1C1C1E'  },
      { name: '핑크',       hex: '#F5BDD2'  },
    ],
    specs: {
      cpu: 'A19칩', ram: '8GB', storage: '128GB', display: '6.1인치 Super Retina XDR',
      camera: '전면: 2,400만\n후면: 4,800만 듀얼', battery: '3582mah',
      weight: '170g', released: '2025년 9월',
    },
  },
  {
    id: 'iphone-16-pro-max',
    brand: 'Apple',
    name: '아이폰 16 Pro Max',
    model: 'IP16PROMAX_256GB',
    price: '950,000원',
    support: '650,000원',
    remaining: '900,000원',
    colors: [
      { name: '내추럴 티타늄', hex: '#C5B9A8' },
      { name: '블랙 티타늄',   hex: '#4A4A4C' },
      { name: '사막 티타늄',   hex: '#C8A882' },
    ],
    specs: {
      cpu: 'A18 Pro칩', ram: '8GB', storage: '256GB', display: '6.9인치 Super Retina XDR',
      camera: '전면: 1,200만\n후면: 4,800만 트리플', battery: '4685mah',
      weight: '227g', released: '2024년 9월',
    },
  },
  {
    id: 'iphone-16-pro',
    brand: 'Apple',
    name: '아이폰 16 Pro',
    model: 'IP16PRO_128GB',
    price: '890,000원',
    support: '550,000원',
    remaining: '900,000원',
    colors: [
      { name: '내추럴 티타늄', hex: '#C5B9A8' },
      { name: '블랙 티타늄',   hex: '#4A4A4C' },
      { name: '화이트 티타늄', hex: '#F5F5EF' },
    ],
    specs: {
      cpu: 'A18 Pro칩', ram: '8GB', storage: '128GB', display: '6.3인치 Super Retina XDR',
      camera: '전면: 1,200만\n후면: 4,800만 트리플', battery: '3582mah',
      weight: '199g', released: '2024년 9월',
    },
  },
  // ── Samsung ────────────────────────────────────────────────────
  {
    id: 'galaxy-s25-ultra',
    brand: 'Samsung',
    name: '갤럭시 S25 Ultra',
    model: 'SM-S938N_256GB',
    price: '890,000원',
    support: '780,000원',
    remaining: '990,000원',
    colors: [
      { name: '티타늄 실버블루', hex: '#A8B8CC' },
      { name: '티타늄 블랙',     hex: '#3A3A3C' },
      { name: '티타늄 화이트',   hex: '#E8E8E0' },
    ],
    specs: {
      cpu: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', display: '6.9인치 QHD+ AMOLED',
      camera: '전면: 1,200만\n후면: 2억화소 쿼드', battery: '5000mah',
      weight: '218g', released: '2025년 1월',
    },
  },
  {
    id: 'galaxy-s25-plus',
    brand: 'Samsung',
    name: '갤럭시 S25+',
    model: 'SM-S936N_256GB',
    price: '990,000원',
    support: '620,000원',
    remaining: '880,000원',
    colors: [
      { name: '아이시 블루', hex: '#B8CAD8' },
      { name: '민트',        hex: '#B8D4CC' },
      { name: '블랙',        hex: '#1C1C1E' },
    ],
    specs: {
      cpu: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', display: '6.7인치 FHD+ AMOLED',
      camera: '전면: 1,200만\n후면: 5,000만 트리플', battery: '4900mah',
      weight: '190g', released: '2025년 1월',
    },
  },
  {
    id: 'galaxy-s25',
    brand: 'Samsung',
    name: '갤럭시 S25',
    model: 'SM-S931N_256GB',
    price: '999,000원',
    support: '480,000원',
    remaining: '720,000원',
    colors: [
      { name: '아이시 블루',   hex: '#B8CAD8' },
      { name: '민트',          hex: '#B8D4CC' },
      { name: '블랙',          hex: '#1C1C1E' },
      { name: '실버 섀도우',   hex: '#C8C8D0' },
    ],
    specs: {
      cpu: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', display: '6.2인치 FHD+ AMOLED',
      camera: '전면: 1,200만\n후면: 5,000만 트리플', battery: '4000mah',
      weight: '162g', released: '2025년 1월',
    },
  },
  {
    id: 'galaxy-z-fold7',
    brand: 'Samsung',
    name: '갤럭시 Z Fold7',
    model: 'SM-F966N_256GB',
    price: '990,000원',
    support: '900,000원',
    remaining: '900,000원',
    colors: [
      { name: '크림 화이트', hex: '#F5F0E8' },
      { name: '블랙',        hex: '#1C1C1E' },
      { name: '실버 블루',   hex: '#A8B8CC' },
    ],
    specs: {
      cpu: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', display: '7.9인치 QXGA+ / 커버: 6.5인치',
      camera: '전면: 1,000만\n후면: 5,000만 트리플', battery: '4400mah',
      weight: '236g', released: '2025년 7월',
    },
  },
  {
    id: 'galaxy-z-flip7',
    brand: 'Samsung',
    name: '갤럭시 Z Flip7',
    model: 'SM-F747N_256GB',
    price: '990,000원',
    support: '580,000원',
    remaining: '820,000원',
    colors: [
      { name: '블루 민트', hex: '#A0C8C0' },
      { name: '화이트',    hex: '#F5F5F0' },
      { name: '블랙',      hex: '#1C1C1E' },
      { name: '핑크',      hex: '#F2B8C6' },
    ],
    specs: {
      cpu: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', display: '6.9인치 FHD+ / 커버: 4.1인치',
      camera: '전면: 1,000만\n후면: 5,000만 듀얼', battery: '4300mah',
      weight: '187g', released: '2025년 7월',
    },
  },
  {
    id: 'galaxy-s24-fe',
    brand: 'Samsung',
    name: '갤럭시 S24 FE',
    model: 'SM-S721N_128GB',
    price: '900,000원',
    support: '300,000원',
    remaining: '600,000원',
    colors: [
      { name: '블루',       hex: '#7090C0' },
      { name: '화이트',     hex: '#F5F5F0' },
      { name: '그래파이트', hex: '#5C5C64' },
      { name: '민트',       hex: '#B8D4CC' },
    ],
    specs: {
      cpu: 'Exynos 2500', ram: '8GB', storage: '128GB', display: '6.7인치 FHD+ AMOLED',
      camera: '전면: 1,000만\n후면: 5,000만 트리플', battery: '4700mah',
      weight: '213g', released: '2024년 10월',
    },
  },
];

const SPEC_LABELS = [
  { key: 'cpu',      label: 'CPU'        },
  { key: 'ram',      label: 'RAM'        },
  { key: 'storage',  label: '저장공간'   },
  { key: 'display',  label: '디스플레이' },
  { key: 'camera',   label: '카메라'     },
  { key: 'battery',  label: '배터리'     },
  { key: 'weight',   label: '무게'       },
  { key: 'released', label: '출시일'     },
];

const DEVICE_TYPE_OPTIONS = ['5G', 'LTE', '3G', '기타'];

export default function ConsultingStepContent() {
  const { activeTab, navigateStep } = useConsultingTabs();
  const { step } = activeTab;

  switch (step.name) {
    case 'type-select':      return <TypeSelectStep navigate={navigateStep} />;
    case 'wireless-carrier': return <WirelessCarrierStep navigate={navigateStep} />;
    case 'wireless-device':      return <WirelessDeviceStep carrier={step.carrier} navigate={navigateStep} />;
    case 'wireless-consulting':  return step.carrier === 'lgu'
      ? <LguPaymentInfo carrier={step.carrier} deviceId={step.deviceId} navigate={navigateStep} />
      : <PaymentInfo carrier={step.carrier} deviceId={step.deviceId} navigate={navigateStep} />;
    case 'wired-carrier':        return <WiredCarrierStep />;
    default:                 return null;
  }
}

function TypeSelectStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center pt-[60px] gap-10">
      <h2 className="text-2xl font-semibold text-text-dark">상담 유형을 선택해 주세요</h2>
      <div className="flex gap-6">
        <button
          className="w-[360px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center pt-9 pb-5 cursor-pointer"
          onClick={() => navigate({ name: 'wireless-carrier' })}
        >
          <img src={WirelessIcon} alt="무선상담" className="w-[120px] h-[120px]" />
          <span className="text-lg font-semibold text-text-dark mt-3">무선상담</span>
          <div className="flex gap-1.5 mt-2"><Tag label="# 휴대폰 개통" /></div>
        </button>
        <button
          className="w-[360px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center pt-9 pb-5 cursor-pointer"
          onClick={() => navigate({ name: 'wired-carrier' })}
        >
          <img src={WiredIcon} alt="유선상담" className="w-[120px] h-[120px]" />
          <span className="text-lg font-semibold text-text-dark mt-3">유선상담</span>
          <div className="flex gap-1.5 mt-2">
            <Tag label="# 인터넷" /><Tag label="# TV" /><Tag label="# 인터넷 전화" />
          </div>
        </button>
      </div>
    </div>
  );
}

function WirelessCarrierStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center pt-[60px] gap-10">
      <h2 className="text-2xl font-semibold text-text-dark">통신사를 선택해 주세요</h2>
      <div className="flex gap-6">
        {CARRIERS.map(carrier => (
          <button
            key={carrier.key}
            className="w-[280px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center justify-center gap-3 cursor-pointer"
            onClick={() => navigate({ name: 'wireless-device', carrier: carrier.key })}
          >
            <img src={carrier.logo} alt={carrier.label} className="w-[140px] h-[140px] object-contain" />
            <span className="text-xl font-semibold text-text-dark">{carrier.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WirelessDeviceStep({ carrier, navigate }: { carrier: string; navigate: (s: ConsultingStep, label?: string) => void }) {
  const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(DEVICES[0].id);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const [deviceTypeOpen, setDeviceTypeOpen] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState('단말기 유형');
  const deviceTypeRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (deviceTypeRef.current && !deviceTypeRef.current.contains(e.target as Node)) {
        setDeviceTypeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = DEVICES.filter(d => {
    const matchesBrand =
      brandFilter === 'all' ||
      (brandFilter === 'samsung' && d.brand === 'Samsung') ||
      (brandFilter === 'apple'   && d.brand === 'Apple') ||
      (brandFilter === 'other'   && d.brand !== 'Samsung' && d.brand !== 'Apple');
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.model.toLowerCase().includes(q);
    return matchesBrand && matchesSearch;
  });

  // 즐겨찾기 항목을 상단으로 정렬
  const sortedDevices = [
    ...filtered.filter(d => favorites.has(d.id)),
    ...filtered.filter(d => !favorites.has(d.id)),
  ];

  const selected = DEVICES.find(d => d.id === selectedId) ?? DEVICES[0];

  return (
    <div className="pt-[60px] pb-[60px] flex flex-col items-center">
      <div className="w-[1080px] flex flex-col gap-6">

        {/* Frame 698: 필터 바 */}
        <div className="flex items-center justify-between h-11">

          {/* Frame 704: 브랜드 필터 */}
          <div className="flex items-center p-1 rounded-lg bg-white border border-input-border shrink-0">
            {BRAND_FILTERS.map(b => (
              <button
                key={b.key}
                onClick={() => setBrandFilter(b.key)}
                className={`w-16 h-9 rounded-lg text-sm font-medium border-none cursor-pointer
                  ${brandFilter === b.key
                    ? 'bg-primary text-[#FFFFFF]'
                    : 'bg-transparent text-[#6B7280]'
                  }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Frame 705: 중간 그룹 */}
          <div className="flex gap-6 shrink-0">

            {/* Frame 692/703: 단말기 유형 드롭다운 */}
            <div ref={deviceTypeRef} className="relative shrink-0">
              <button
                className="w-[120px] h-11 flex items-center justify-between py-3 pl-3 pr-2 rounded-lg bg-white border border-input-border text-sm cursor-pointer shrink-0"
                style={{ color: selectedDeviceType === '단말기 유형' ? '#9CA3AF' : '#111827' }}
                onClick={() => setDeviceTypeOpen(o => !o)}
              >
                <span>{selectedDeviceType}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {deviceTypeOpen && (
                <div className="absolute top-full left-0 mt-1 w-[120px] bg-white border border-input-border rounded-lg shadow-md z-50 overflow-hidden">
                  {DEVICE_TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      className={`w-full px-3 py-2 text-left text-sm cursor-pointer border-none text-[#6B7280]
                        ${selectedDeviceType === opt ? 'bg-[#E8F2FF]' : 'bg-white'}`}
                      onClick={() => { setSelectedDeviceType(opt); setDeviceTypeOpen(false); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Frame 645: 단말기 검색 */}
            <div className="w-[280px] h-11 flex items-center justify-between py-3 pl-3 pr-2 rounded-lg bg-white border border-input-border">
              <input
                ref={searchRef}
                type="text"
                placeholder="단말기 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#111827] placeholder:text-[#9CA3AF]"
              />
              {/* Frame 643 */}
              <button
                type="button"
                className="w-6 h-6 flex justify-center items-center shrink-0 border-none bg-transparent cursor-pointer"
                onClick={() => searchRef.current?.focus()}
              >
                <img src={SearchImg} alt="" className="w-[13px] h-[13px]" />
              </button>
            </div>

            {/* Frame 694: 5GX 프리미엄 */}
            <button className="w-[344px] h-11 flex items-center justify-between py-3 pl-3 pr-2 rounded-lg bg-[#F8F9FA] border border-input-border text-sm text-[#9CA3AF] cursor-pointer">
              <span>5GX 프리미엄(유튜브 프리미엄)</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M9.5 2.5L11.5 4.5L5 11H3v-2L9.5 2.5Z" stroke="#9CA3AF" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 기기 목록 + 상세 패널 */}
        <div className="flex gap-6 h-[660px]">

          {/* 기기 목록 테이블 */}
          <div className="w-[712px] shrink-0 rounded-xl border border-input-border overflow-hidden flex flex-col">
            {/* 컬럼 헤더 */}
            <div className="h-[52px] shrink-0 flex justify-between items-center py-4 px-5 bg-[#F8F9FA] border-b border-input-border text-base font-normal text-text-gray">
              <span className="w-[156px] shrink-0">기기명</span>
              <span className="w-[124px] shrink-0">모델명</span>
              <span className="w-[92px] shrink-0 text-right">출고가</span>
              <span className="w-[88px] shrink-0 text-right">공통지원금</span>
              <span className="w-[88px] shrink-0 text-right">할부원금</span>
              <span className="w-6 h-6 flex flex-col justify-center items-center shrink-0" />
            </div>

            {/* 바디 */}
            <div className="flex-1 overflow-y-auto">
              {sortedDevices.map(device => (
                <div
                  key={device.id}
                  onClick={() => setSelectedId(device.id)}
                  className={`flex justify-between items-center h-16 py-4 px-5 shrink-0 self-stretch cursor-pointer border-b border-input-border text-base
                    ${selectedId === device.id ? 'bg-[#E8F2FF]' : 'bg-white'}`}
                >
                  <span className="w-[156px] shrink-0 font-medium text-text-dark truncate">{device.name}</span>
                  <span className="w-[124px] shrink-0 font-medium text-text-gray truncate">{device.model}</span>
                  <span className="w-[92px] shrink-0 font-medium text-text-gray text-right">{device.price}</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">{device.support}</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">{device.remaining}</span>
                  <span className="w-6 h-6 flex flex-col justify-center items-center shrink-0">
                    <StarIcon favorited={favorites.has(device.id)} onClick={(e) => toggleFavorite(device.id, e)} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 상세 패널 */}
          <DetailPanel device={selected} carrier={carrier} navigate={navigate} key={selected.id} />

        </div>
      </div>
    </div>
  );
}

const CARRIER_LABELS: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };

function DetailPanel({ device, carrier, navigate }: {
  device: Device;
  carrier: string;
  navigate: (s: ConsultingStep, label?: string) => void;
}) {
  const [colorIdx, setColorIdx] = useState(0);
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const color = device.colors[colorIdx];
  const deviceImage = DEVICE_IMAGES[device.id];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-[344px] h-[660px] shrink-0 rounded-xl border-2 border-input-border bg-white flex flex-col justify-between items-center py-6 px-5">

      {/* Frame 649: 이미지 + 기기명 */}
      <div className="w-full flex flex-col items-center gap-4">
        {deviceImage ? (
          <img src={deviceImage} alt={device.name} className="w-[220px] h-[220px] rounded-xl object-contain" />
        ) : (
          <div className="w-[220px] h-[220px] rounded-xl bg-[#F0F1F3] flex items-center justify-center">
            <PhoneOutlineIcon fill={color.hex} />
          </div>
        )}
        <span className="text-lg font-semibold text-text-dark text-center">{device.name}</span>
      </div>

      {/* Frame 693: 컬러 선택 드롭다운 */}
      <div ref={colorRef} className="relative w-full">
        <button
          onClick={() => setColorOpen(o => !o)}
          className="w-full h-12 flex items-center justify-between py-2 pl-3 pr-2 shrink-0 rounded-lg bg-white border border-input-border cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
            <div className="w-px h-5 bg-input-border shrink-0" />
            <span className="text-sm font-medium text-[#111827]">{color.name}</span>
          </div>
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" className="shrink-0">
            <path d="M1 1l3 2 3-2" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {colorOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-input-border rounded-lg shadow-md z-50 overflow-hidden">
            {device.colors.map((c, i) => (
              <button
                key={c.name}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left cursor-pointer border-none
                  ${i === colorIdx ? 'bg-[#E8F2FF]' : 'bg-white'}`}
                onClick={() => { setColorIdx(i); setColorOpen(false); }}
              >
                <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                <div className="w-px h-5 bg-input-border shrink-0" />
                <span className="text-sm font-medium text-[#111827]">{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Frame 684: 스펙 + 상담진행 */}
      <div className="w-full flex flex-col gap-5">
        {/* Frame 652: 스펙 테이블 */}
        <div className="w-full flex flex-col items-center py-3 px-2 gap-1 border-t border-b border-[#E2E8F0] bg-[#F8F9FA]">
          {SPEC_LABELS.map(({ key, label }) => (
            <div key={key} className="w-full flex items-start gap-2">
              <span className="w-[64px] shrink-0 text-[13px] font-normal text-[#111827] leading-[16px]">{label}</span>
              <span className="flex-1 text-[13px] font-normal text-[#6B7280] leading-[16px] break-words whitespace-pre-line">{device.specs[key]}</span>
            </div>
          ))}
        </div>
        <button
          className="w-full h-[52px] flex items-center justify-center px-3 bg-primary text-white text-base font-medium rounded-lg border-none cursor-pointer"
          onClick={() => navigate(
            { name: 'wireless-consulting', carrier, deviceId: device.id },
            `${CARRIER_LABELS[carrier] ?? carrier.toUpperCase()}_${device.name} ${device.specs.storage}`
          )}
        >
          상담 진행
        </button>
      </div>

    </div>
  );
}

function WiredCarrierStep() {
  return (
    <div className="flex flex-col items-center pt-[60px] gap-10">
      <h2 className="text-2xl font-semibold text-text-dark">통신사를 선택해 주세요</h2>
      <div className="flex gap-6">
        {CARRIERS.map(carrier => (
          <button
            key={carrier.key}
            className="w-[280px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center justify-center gap-3 cursor-pointer"
            onClick={() => {}}
          >
            <img src={carrier.logo} alt={carrier.label} className="w-[140px] h-[140px] object-contain" />
            <span className="text-xl font-semibold text-text-dark">{carrier.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StarIcon({ favorited, onClick }: { favorited: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 shrink-0"
    >
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
        <path
          d="M8.50098 0.5C8.64763 0.500065 8.79061 0.541055 8.91309 0.617188C9.03545 0.693265 9.13187 0.801101 9.19238 0.926758L9.19629 0.935547L11.125 4.75098L11.1367 4.77246C11.1374 4.77375 11.138 4.77509 11.1387 4.77637L11.2549 5.00977L11.5137 5.04785C11.5152 5.04808 11.517 5.04852 11.5186 5.04883L11.542 5.05273L15.7881 5.66992L15.7998 5.6709L15.8125 5.67285C15.9598 5.68705 16.0984 5.74252 16.2129 5.83105C16.3273 5.91953 16.4124 6.03682 16.459 6.16895C16.5055 6.3011 16.513 6.44353 16.4795 6.5791C16.446 6.71471 16.3725 6.83916 16.2676 6.9375L16.2656 6.93945L13.1777 9.8623L13.165 9.87305L13.1523 9.88477C13.0851 9.94779 13.0346 10.0276 13.0068 10.1172L13.0029 10.1289L13 10.1416C12.9953 10.1599 12.9859 10.1987 12.9834 10.248C12.983 10.2568 12.9852 10.2683 12.9854 10.2822H12.9844V10.3281L12.9922 10.3711L13.7324 14.6221L13.7334 14.624C13.7576 14.7603 13.7418 14.9005 13.6885 15.0293C13.6351 15.1583 13.5452 15.2711 13.4277 15.3545C13.3102 15.4379 13.1701 15.4882 13.0234 15.498C12.877 15.5078 12.731 15.4773 12.6025 15.4102L12.6006 15.4092L8.77441 13.4277L8.75879 13.4189L8.74121 13.4121L8.62402 13.375C8.58368 13.3667 8.54228 13.3623 8.50098 13.3623C8.4186 13.3623 8.33683 13.3796 8.26074 13.4121L8.24414 13.4189L8.22754 13.4277L4.40137 15.4102C4.27254 15.477 4.1261 15.5082 3.97949 15.498C3.83299 15.4879 3.69351 15.437 3.57617 15.3535C3.45885 15.2701 3.36884 15.1572 3.31543 15.0283C3.2622 14.8998 3.24647 14.7585 3.27051 14.6221V14.6211L4.01172 10.3721L4.01953 10.3301V10.2822H4.01855C4.01903 10.2439 4.01651 10.2056 4.00879 10.168L3.99121 10.1035L3.96582 10.041C3.93652 9.9809 3.89556 9.92691 3.84668 9.88184L3.84473 9.87988L0.735352 6.94043L0.733398 6.93848L0.660156 6.86035C0.593677 6.77753 0.546793 6.68176 0.521484 6.58008C0.487825 6.4444 0.494452 6.30123 0.541016 6.16895C0.587649 6.03677 0.672645 5.91855 0.787109 5.83008C0.901746 5.74158 1.04109 5.68688 1.18848 5.67285L1.20117 5.67188L1.21289 5.66992L5.45996 5.05273L5.47168 5.05078L5.48438 5.04883C5.48571 5.04857 5.48697 5.04805 5.48828 5.04785L5.74707 5.00977L5.86328 4.77637C5.86393 4.77506 5.86546 4.77379 5.86621 4.77246L5.87207 4.76172L5.87695 4.75098L7.80566 0.935547L7.80957 0.926758C7.87003 0.801203 7.96664 0.693254 8.08887 0.617188C8.18078 0.560055 8.2847 0.522909 8.39258 0.507812L8.50098 0.5Z"
          fill={favorited ? '#fcd34d' : 'white'}
          stroke={favorited ? 'none' : '#E2E8F0'}
        />
      </svg>
    </button>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="px-3 py-1 rounded-full text-base text-primary bg-[#EBF3FF]">{label}</span>;
}

function PhoneOutlineIcon({ fill = '#D1D5DB' }: { fill?: string }) {
  return (
    <svg width="56" height="88" viewBox="0 0 56 88" fill="none">
      <rect x="2" y="2" width="52" height="84" rx="8" stroke="#D1D5DB" strokeWidth="2" fill={fill} fillOpacity="0.3" />
      <rect x="8" y="10" width="40" height="60" rx="3" fill={fill} fillOpacity="0.2" />
      <circle cx="28" cy="80" r="3.5" fill="#D1D5DB" />
    </svg>
  );
}
