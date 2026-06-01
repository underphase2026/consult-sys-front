import { useState, useRef, useEffect, ReactNode } from 'react';
import { ConsultingStep } from '../contexts/ConsultingTabsContext';

interface DeviceColor {
  name: string;
  hex: string;
}

interface Device {
  id: string;
  brand: string;
  name: string;
  model: string;
  price: string;
  colors: DeviceColor[];
}

const DEVICES: Device[] = [
  {
    id: 'iphone-17e',
    brand: 'Apple',
    name: '아이폰 17e',
    model: 'IP17E_256GB',
    price: '990,000원',
    colors: [
      { name: '소프트핑크', hex: '#F2B8C6' },
      { name: '화이트',     hex: '#F5F5F0' },
      { name: '블랙',       hex: '#1C1C1E' },
    ],
  },
];

const CARRIER_LABELS: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };
const APPLY_OPTIONS = ['미적용', '적용'];

interface Props {
  carrier: string;
  deviceId: string;
  navigate: (s: ConsultingStep, label?: string) => void;
}

export default function PaymentInfo({ carrier, deviceId, navigate }: Props) {
  const device = DEVICES.find(d => d.id === deviceId) ?? DEVICES[0];

  const [colorIdx, setColorIdx] = useState(0);
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const selectedColor = device.colors[colorIdx];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [planTab, setPlanTab] = useState<'공통지원금' | '선택약정할인'>('공통지원금');
  const [가입유형, set가입유형] = useState('번호이동');
  const [약정기간, set약정기간] = useState('24개월');
  const [할부개월, set할부개월] = useState('24개월');
  const [추가지원금, set추가지원금] = useState('미적용');
  const [현금납부, set현금납부] = useState('미적용');
  const [선카드할인, set선카드할인] = useState('미적용');
  const [포인트할인, set포인트할인] = useState('미적용');
  const [결합할인, set결합할인] = useState('미적용');
  const [복지할인, set복지할인] = useState('미적용');
  const [히어로할인, set히어로할인] = useState('미적용');
  const [청구할인카드, set청구할인카드] = useState('미적용');
  const [프로모션, set프로모션] = useState('미적용');
  const [보험, set보험] = useState('미적용');
  const [부가서비스1, set부가서비스1] = useState('미적용');

  const carrierLabel = CARRIER_LABELS[carrier] ?? carrier.toUpperCase();
  void carrierLabel; // used for future label display

  return (
    <div className="flex flex-col items-start gap-[31px] flex-[1_0_0] self-stretch pt-[88px] pr-[388px] pb-[182px] pl-5">

        {/* A/B 패널 */}
        <div className="bg-white border border-input-border rounded-xl overflow-hidden">

          {/* 섹션 탭 헤더 */}
          <div className="flex">
            {/* Frame 707 - 단말기 정보 (A) */}
            <div className="flex items-center gap-1 w-[356px] h-11 py-2 px-3 bg-[#F8F9FA] border-t border-r border-b border-[#E8ECF2]">
              <span className="text-base font-semibold text-text-dark">단말기 정보</span>
              <span className="text-base font-semibold text-primary">(A)</span>
            </div>
            {/* Frame 717 - 요금제 정보 (B) */}
            <div className="flex items-center gap-1 w-[356px] h-11 py-2 px-3 bg-[#F8F9FA] border-t border-b border-[#E2E8F0]">
              <span className="text-base font-semibold text-text-dark">요금제 정보</span>
              <span className="text-base font-semibold text-primary">(B)</span>
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="flex border-b border-[#E8ECF2]">
            {/* Frame 722 - 단말기 */}
            <div className="flex flex-col justify-end items-end gap-4 w-[356px] py-5 px-3 self-stretch border-r border-[#E8ECF2] bg-white">
              {/* Frame 740 */}
              <div className="flex flex-col items-end gap-2 w-full">
                {/* Frame 735 - 단말기 행 (332x44) */}
                <div className="flex items-center w-full h-11">
                  <span className="w-[84px] shrink-0 text-sm text-text-dark">단말기</span>
                  <div ref={colorRef} className="relative flex-1">
                    <button
                      onClick={() => setColorOpen(o => !o)}
                      className="w-full h-11 flex items-center justify-between bg-transparent border-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                        <div className="w-px h-5 bg-input-border shrink-0" />
                        <span className="text-sm font-medium text-text-dark truncate">{device.model}</span>
                      </div>
                      <ChevronIcon />
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
                            <span className="text-sm font-medium text-text-dark">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Frame 720 - 가격행 (240x44) */}
                <div className="w-[240px] h-11 flex items-center justify-end">
                  <span className="text-base font-semibold text-text-dark">{device.price}</span>
                </div>
              </div>
            </div>
            {/* Frame 723 - 요금제 */}
            <div className="flex flex-col justify-end items-end gap-4 w-[356px] py-5 px-3 self-stretch border-r border-[#E8ECF2] bg-white">
              <div className="flex items-center w-full h-11">
                <span className="w-[84px] shrink-0 text-sm text-text-dark">요금제</span>
                <span className="flex-1 text-sm font-medium text-text-dark">5GX 프라임플러스(T우주)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#6B7280]">월</span>
                <span className="text-base font-semibold text-text-dark ml-1">99,000원</span>
              </div>
            </div>
          </div>

          {/* 공통지원금 / 선택약정할인 필터 */}
          <div className="border-b border-input-border">
            <div className="flex h-11 px-5 gap-6 border-b border-input-border">
              {(['공통지원금', '선택약정할인'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPlanTab(tab)}
                  className={`h-full flex items-center text-sm font-medium bg-transparent border-none cursor-pointer border-b-2
                    ${planTab === tab ? 'text-primary border-b-primary' : 'text-[#6B7280] border-b-transparent'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-6 px-5 py-3">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center h-11 gap-2">
                  <span className="w-[84px] shrink-0 text-sm text-text-dark">가입유형</span>
                  <Dropdown value={가입유형} options={['번호이동', '신규가입', '기기변경']} onChange={set가입유형} />
                </div>
                <div className="flex justify-end pr-1">
                  <span className="text-sm font-semibold text-[#EF4444]">-500,000원</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center h-11 gap-2">
                  <span className="w-[84px] shrink-0 text-sm text-text-dark">약정기간</span>
                  <Dropdown value={약정기간} options={['12개월', '24개월']} onChange={set약정기간} />
                </div>
                <div className="flex justify-end pr-1">
                  <span className="text-sm font-semibold text-text-dark">0원</span>
                </div>
              </div>
            </div>
          </div>

          {/* A/B 폼 컬럼 */}
          <div className="flex">
            {/* 컬럼 A - 단말기 정보 */}
            <div className="flex-1 border-r border-input-border px-3 py-3 flex flex-col gap-1">
              <FormRow label="할부개월">
                <Dropdown value={할부개월} options={['12개월', '24개월', '36개월']} onChange={set할부개월} />
              </FormRow>
              <FormRow label="추가지원금">
                <Dropdown value={추가지원금} options={APPLY_OPTIONS} onChange={set추가지원금} />
              </FormRow>
              <FormRow label="현금납부">
                <Dropdown value={현금납부} options={APPLY_OPTIONS} onChange={set현금납부} />
              </FormRow>
              <FormRow label="선카드할인">
                <Dropdown value={선카드할인} options={APPLY_OPTIONS} onChange={set선카드할인} />
              </FormRow>
              <FormRow label="포인트할인">
                <Dropdown value={포인트할인} options={APPLY_OPTIONS} onChange={set포인트할인} />
              </FormRow>
              <div className="mt-2 py-3 px-2 bg-[#F8F9FA] rounded-lg flex flex-col gap-1.5">
                <SummaryRow label="할부원금" value="500,000원" />
                <SummaryRow label="할부수수료" value="54,849원" showInfo />
                <SummaryRow label="월 단말 할부금" value="38,780원" primary />
              </div>
            </div>

            {/* 컬럼 B - 요금제 정보 */}
            <div className="flex-1 px-3 py-3 flex flex-col gap-1">
              <FormRow label="결합할인">
                <Dropdown value={결합할인} options={APPLY_OPTIONS} onChange={set결합할인} />
              </FormRow>
              <FormRow label="복지할인">
                <Dropdown value={복지할인} options={APPLY_OPTIONS} onChange={set복지할인} />
              </FormRow>
              <FormRow label="0히어로할인">
                <Dropdown value={히어로할인} options={APPLY_OPTIONS} onChange={set히어로할인} />
              </FormRow>
              <FormRow label="청구할인카드">
                <Dropdown value={청구할인카드} options={APPLY_OPTIONS} onChange={set청구할인카드} />
              </FormRow>
              <FormRow label="프로모션">
                <Dropdown value={프로모션} options={APPLY_OPTIONS} onChange={set프로모션} />
              </FormRow>
              <div className="mt-2 py-3 px-2 bg-[#F8F9FA] rounded-lg flex flex-col gap-1.5">
                <SummaryRow label="월 요금" value="99,000원" primary />
              </div>
            </div>
          </div>

        </div>

        {/* Section C - 유심/보험/부가서비스 */}
        <div className="bg-white border border-input-border rounded-xl overflow-hidden">
          <div className="h-11 flex items-center px-5 border-b border-input-border">
            <span className="text-base font-semibold text-text-dark">유심/보험/부가서비스</span>
            <span className="text-base font-semibold text-primary ml-1">(C)</span>
          </div>
          <div className="px-3 py-3 flex flex-col gap-1">
            {/* 유심 테이블 헤더 */}
            <div className="flex items-center h-11">
              <span className="w-[84px] shrink-0 text-sm text-text-dark">유심</span>
              <div className="flex-1 flex items-center">
                {['상품', '가격', '해지가능날짜', '삭제'].map(col => (
                  <span key={col} className="flex-1 text-sm text-[#6B7280]">{col}</span>
                ))}
              </div>
            </div>
            <FormRow label="보험">
              <Dropdown value={보험} options={APPLY_OPTIONS} onChange={set보험} />
            </FormRow>
            <FormRow label="부가서비스_1">
              <Dropdown value={부가서비스1} options={APPLY_OPTIONS} onChange={set부가서비스1} />
            </FormRow>
          </div>
        </div>

    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        className="w-full h-11 flex items-center justify-between px-3 bg-white border border-input-border rounded-lg text-sm cursor-pointer"
        style={{ color: value === '미적용' ? '#9CA3AF' : '#111827' }}
        onClick={() => setOpen(o => !o)}
      >
        <span>{value}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-input-border rounded-lg shadow-md z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt}
              className={`w-full px-3 py-2.5 text-left text-sm cursor-pointer border-none
                ${value === opt ? 'bg-[#E8F2FF]' : 'bg-white'}`}
              style={{ color: opt === '미적용' ? '#9CA3AF' : '#111827' }}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center h-11 gap-2">
      <span className="w-[84px] shrink-0 text-sm text-text-dark">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  showInfo = false,
  primary = false,
}: {
  label: string;
  value: string;
  showInfo?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className={`text-sm ${primary ? 'font-semibold text-text-dark' : 'text-text-dark'}`}>{label}</span>
        {showInfo && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6" stroke="#9CA3AF" strokeWidth="1.2" />
            <path d="M7 6.5v3.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.7" fill="#9CA3AF" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-semibold ${primary ? 'text-primary' : 'text-text-dark'}`}>{value}</span>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
