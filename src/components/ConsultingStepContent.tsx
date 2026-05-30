import { useState } from 'react';
import { useConsultingTabs, ConsultingStep } from '../contexts/ConsultingTabsContext';
import SKT from '../images/SKT.svg';
import KT from '../images/KT.svg';
import UPlus from '../images/U+.svg';
import WirelessIcon from '../images/whireless.svg';
import WiredIcon from '../images/wired.svg';
import Iphone17eImg from '../images/Iphone17e.svg';
import UnionImg from '../images/Union.svg';

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
      { name: '민트',       hex: '#B2D8D8' },
    ],
    specs: {
      cpu: 'A19칩', ram: '8GB', storage: '256GB', display: '6.1인치',
      camera: '전면: 1,200만\n후면: 4,800만', battery: '4005mah',
      weight: '200g', released: '2026년 3월 11일',
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

export default function ConsultingStepContent() {
  const { activeTab, navigateStep } = useConsultingTabs();
  const { step } = activeTab;

  switch (step.name) {
    case 'type-select':      return <TypeSelectStep navigate={navigateStep} />;
    case 'wireless-carrier': return <WirelessCarrierStep navigate={navigateStep} />;
    case 'wireless-device':  return <WirelessDeviceStep carrier={step.carrier} navigate={navigateStep} />;
    case 'wired-carrier':    return <WiredCarrierStep />;
    default:                 return null;
  }
}

function TypeSelectStep({ navigate }: { navigate: (s: ConsultingStep) => void }) {
  return (
    <div className="flex flex-col items-center pt-[60px] gap-10">
      <h2 className="text-2xl font-semibold text-text-dark">상담 유형을 선택해 주세요</h2>
      <div className="flex gap-6">
        <button
          className="w-[360px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center pt-9 pb-5 cursor-pointer hover:border-primary transition-colors"
          onClick={() => navigate({ name: 'wireless-carrier' })}
        >
          <img src={WirelessIcon} alt="무선상담" className="w-[120px] h-[120px]" />
          <span className="text-lg font-semibold text-text-dark mt-3">무선상담</span>
          <div className="flex gap-1.5 mt-2"><Tag label="# 휴대폰 개통" /></div>
        </button>
        <button
          className="w-[360px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center pt-9 pb-5 cursor-pointer hover:border-primary transition-colors"
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
            className="w-[280px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-colors"
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

function WirelessDeviceStep(_: { carrier: string; navigate: (s: ConsultingStep) => void }) {
  const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(DEVICES[0].id);

  const filtered = DEVICES.filter(d => {
    const matchBrand =
      brandFilter === 'all'     ? true :
      brandFilter === 'samsung' ? d.brand === 'Samsung' :
      brandFilter === 'apple'   ? d.brand === 'Apple' :
      (d.brand !== 'Samsung' && d.brand !== 'Apple');
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.model.toLowerCase().includes(q);
    return matchBrand && matchSearch;
  });

  const selected = DEVICES.find(d => d.id === selectedId) ?? DEVICES[0];

  return (
    <div className="pt-[60px] pb-[60px] flex flex-col items-center">
      <div className="w-[1080px] flex flex-col gap-6">

        {/* 필터 바 */}
        <div className="flex items-center gap-6 h-11">
          <div className="flex p-1 rounded-lg bg-white border border-input-border shrink-0">
            {BRAND_FILTERS.map(b => (
              <button
                key={b.key}
                onClick={() => setBrandFilter(b.key)}
                className={`w-16 h-9 rounded-lg text-sm font-medium border-none cursor-pointer transition-colors
                  ${brandFilter === b.key
                    ? 'bg-primary text-white'
                    : 'bg-transparent text-text-dark hover:bg-[#F0F1F3]'
                  }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="flex gap-6 flex-1 min-w-0">
            <button className="w-[280px] h-11 shrink-0 flex items-center justify-between px-3 rounded-lg bg-white border border-input-border text-sm text-text-dark cursor-pointer hover:bg-[#F8F9FA]">
              <span>단말기 유형</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 h-11 flex items-center gap-2 px-3 rounded-lg bg-[#F8F9FA] border border-input-border">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="단말기 검색"
                className="flex-1 bg-transparent text-sm text-text-dark outline-none placeholder:text-muted"
              />
            </div>
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
            </div>

            {/* 바디 */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map(device => (
                <div
                  key={device.id}
                  onClick={() => setSelectedId(device.id)}
                  className={`flex justify-between items-center h-16 py-4 px-5 shrink-0 cursor-pointer border-b border-input-border transition-colors text-base
                    ${selectedId === device.id ? 'bg-[#E8F2FF]' : 'bg-white hover:bg-[#F8F9FA]'}`}
                >
                  <span className="w-[156px] shrink-0 font-medium text-text-dark truncate">{device.name}</span>
                  <span className="w-[124px] shrink-0 font-medium text-text-gray truncate">{device.model}</span>
                  <span className="w-[92px] shrink-0 font-medium text-text-gray text-right">{device.price}</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">{device.support}</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">{device.remaining}</span>
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={UnionImg} alt="" className="w-6 h-6" />
                  </span>
                </div>
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={`ph-${i}`}
                  className="flex justify-between items-center h-16 py-4 px-5 shrink-0 border-b border-input-border last:border-b-0 text-base"
                >
                  <span className="w-[156px] shrink-0 font-medium text-text-dark">기기명</span>
                  <span className="w-[124px] shrink-0 font-medium text-text-gray">모델명</span>
                  <span className="w-[92px] shrink-0 font-medium text-text-gray text-right">1,254,000원</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">700,000원</span>
                  <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">554,000원</span>
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={UnionImg} alt="" className="w-6 h-6" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 상세 패널 */}
          <DetailPanel device={selected} key={selected.id} />

        </div>
      </div>
    </div>
  );
}

function DetailPanel({ device }: { device: Device }) {
  const [colorIdx, setColorIdx] = useState(0);
  const color = device.colors[colorIdx];
  const deviceImage = DEVICE_IMAGES[device.id];
  const nextColor = () => setColorIdx(i => (i + 1) % device.colors.length);

  return (
    <div className="w-[344px] h-[660px] shrink-0 rounded-xl border border-input-border bg-white flex flex-col justify-between items-center py-6 px-5 overflow-y-auto">

      {/* 이미지 + 기기명 */}
      <div className="w-full flex flex-col items-center gap-4">
        {deviceImage ? (
          <img src={deviceImage} alt={device.name} className="w-[220px] h-[220px] rounded-xl object-contain" />
        ) : (
          <div className="w-[220px] h-[220px] rounded-xl bg-[#F0F1F3] flex items-center justify-center">
            <PhoneOutlineIcon fill={color.hex} />
          </div>
        )}
        <span className="text-lg font-semibold text-text-dark">{device.name}</span>
      </div>

      {/* 컬러 선택 */}
      <button
        onClick={nextColor}
        className="w-full h-12 flex items-center justify-between pl-3 pr-2 rounded-lg bg-white border border-input-border cursor-pointer hover:bg-[#F8F9FA]"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
          <div className="w-px h-5 bg-input-border shrink-0" />
          <span className="text-sm font-medium text-text-dark">{color.name}</span>
        </div>
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" className="shrink-0">
          <path d="M1 1l3 2 3-2" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 스펙 + 상담진행 */}
      <div className="w-full flex flex-col gap-5">
        <div className="rounded-lg bg-[#F7F8FA] p-3 flex flex-col gap-[6px]">
          {SPEC_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-start gap-2">
              <span className="w-[64px] shrink-0 text-[13px] font-normal text-[#718096]">{label}</span>
              <span className="flex-1 text-[13px] font-normal text-[#2D3748] leading-normal break-words whitespace-pre-line">{device.specs[key]}</span>
            </div>
          ))}
        </div>
        <button className="w-full h-[52px] bg-primary text-white text-base font-medium rounded-lg border-none cursor-pointer hover:bg-primary-hover">
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
            className="w-[280px] h-[280px] bg-white rounded-xl border border-input-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-colors"
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
