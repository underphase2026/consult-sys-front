import { useState, useRef, useEffect } from 'react';
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

const DEVICE_TYPE_OPTIONS = ['5G', 'LTE', '3G', '기타'];

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

function WirelessDeviceStep({ carrier, navigate }: { carrier: string; navigate: (s: ConsultingStep) => void }) {
  const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceTypeOpen, setDeviceTypeOpen] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState('단말기 유형');
  const [searchQuery, setSearchQuery] = useState('');
  const deviceTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const apiCarrier = carrier.toUpperCase();
        const res = await fetch(`/api/api/consultations/devices?networkType=WIRELESS&carrier=${apiCarrier}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('기기 목록을 불러오지 못했습니다.');
        
        const json = await res.json();
        const dataList = Array.isArray(json) ? json : (json.data || []);
        
        const mapped: Device[] = dataList.map((d: any) => {
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
              storage: d.specs?.storage || '-',
              display: d.specs?.display || '-',
              camera: d.specs?.camera || '-',
              battery: d.specs?.battery || '-',
              weight: d.specs?.weight || '-',
              released: d.releaseDate ? new Date(d.releaseDate).toLocaleDateString('ko-KR') : '-',
            },
          };
        });
        setDevices(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [carrier]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (deviceTypeRef.current && !deviceTypeRef.current.contains(e.target as Node)) {
        setDeviceTypeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = devices.filter(d => {
    if (brandFilter === 'samsung' && d.brand !== 'Samsung') return false;
    if (brandFilter === 'apple' && d.brand !== 'Apple') return false;
    if (brandFilter === 'other' && (d.brand === 'Samsung' || d.brand === 'Apple')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchModel = d.model.toLowerCase().includes(q);
      if (!matchName && !matchModel) return false;
    }

    return true;
  });

  const selected = devices.find(d => d.id === selectedId) ?? devices[0];

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
            <div className="relative w-[280px] h-11 shrink-0">
              <input
                type="text"
                placeholder="단말기 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full flex items-center justify-between py-3 pl-3 pr-10 rounded-lg bg-white border border-input-border text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-primary transition-colors"
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none">
                <path d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              {isLoading ? (
                <div className="py-20 text-center text-text-gray">기종 목록을 불러오는 중...</div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-text-gray">조회된 기기가 없습니다.</div>
              ) : (
                <>
                  {filtered.map(device => (
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
                        <img src={UnionImg} alt="" className="w-[17px] h-[16px] shrink-0" />
                      </span>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 14 - filtered.length) }).map((_, i) => (
                    <div
                      key={`ph-${i}`}
                      className="flex justify-between items-center h-16 py-4 px-5 shrink-0 self-stretch bg-white border-b border-input-border last:border-b-0 text-base"
                    >
                      <span className="w-[156px] shrink-0 font-medium text-text-dark">기기명</span>
                      <span className="w-[124px] shrink-0 font-medium text-text-gray">모델명</span>
                      <span className="w-[92px] shrink-0 font-medium text-text-gray text-right">-</span>
                      <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">-</span>
                      <span className="w-[88px] shrink-0 font-medium text-text-gray text-right">-</span>
                      <span className="w-6 h-6 flex flex-col justify-center items-center shrink-0">
                        <img src={UnionImg} alt="" className="w-[17px] h-[16px] shrink-0" />
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 상세 패널 */}
          {selected && <DetailPanel device={selected} key={selected.id} />}

        </div>
      </div>
    </div>
  );
}

function DetailPanel({ device }: { device: Device }) {
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
        <button className="w-full h-[52px] flex items-center justify-center px-3 bg-primary text-white text-base font-medium rounded-lg border-none cursor-pointer">
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
