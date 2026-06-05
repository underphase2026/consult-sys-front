import { useState, useRef, useEffect, ReactNode } from 'react';
import { ConsultingStep } from '../contexts/ConsultingTabsContext';
import Iphone17eImg from '../images/Iphone17e.svg';
import BadgeApplePay   from '../images/badge-applepay.svg';
import BadgeFaceId     from '../images/badge-faceid.svg';
import BadgeWaterproof from '../images/badge-waterproof.svg';
import WiredChargeIcon from '../images/wired_charge.svg';
import UsimIcon        from '../images/usim.svg';

interface DeviceColor { name: string; hex: string; }
interface Device { id: string; brand: string; name: string; model: string; price: string; colors: DeviceColor[]; }

const DEVICES: Device[] = [
  {
    id: 'iphone-17e', brand: 'Apple', name: '아이폰 17e', model: 'IP17E_256GB', price: '990,000원',
    colors: [
      { name: '소프트핑크', hex: '#F2B8C6' },
      { name: '화이트',     hex: '#F5F5F0' },
      { name: '블랙',       hex: '#1C1C1E' },
    ],
  },
];

const CARRIER_LABELS: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };
const APPLY_OPTIONS = ['미적용', '적용'];

interface Props { carrier: string; deviceId: string; navigate: (s: ConsultingStep, label?: string) => void; }

export default function PaymentInfo({ carrier, deviceId, navigate: _navigate }: Props) {
  const device = DEVICES.find(d => d.id === deviceId) ?? DEVICES[0];

  const [colorIdx, setColorIdx]     = useState(0);
  const [colorOpen, setColorOpen]   = useState(false);
  const colorRef                    = useRef<HTMLDivElement>(null);
  const selectedColor               = device.colors[colorIdx];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const [planTab, setPlanTab]           = useState<'공통지원금' | '선택약정할인'>('공통지원금');
  const [가입유형, set가입유형]           = useState('번호이동');
  const [약정기간, set약정기간]           = useState('24개월');
  const [할부개월, set할부개월]           = useState('24개월');
  const [보험, set보험]                   = useState('미적용');
  const [부가서비스1, set부가서비스1]     = useState('미적용');
  const [변경요금제, set변경요금제]       = useState('변경할 요금제');

  // 요금제 선택 모달
  const [planModalOpen, setPlanModalOpen]   = useState(false);
  const [selectedPlan, setSelectedPlan]     = useState('5GX 프리미엄(유튜브 프리미엄)');
  const [planSearch, setPlanSearch]         = useState('');
  const [planCategory, setPlanCategory]     = useState('전체');
  const [planSortOpen, setPlanSortOpen]     = useState(false);
  const [planSort, setPlanSort]             = useState('가격높은순');
  const planSortRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (planSortRef.current && !planSortRef.current.contains(e.target as Node)) setPlanSortOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // 변경 가능일자: 오늘로부터 6개월 뒤
  const changeableDateStr = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  })();

  const carrierLabel = CARRIER_LABELS[carrier] ?? carrier.toUpperCase();
  void carrierLabel;

  return (
    <>
    {/* Frame 821: flex, padding: 60px 0, justify-content: center, align-items: flex-start, gap: 24px */}
    <div className="flex py-[60px] justify-center items-start gap-6 w-full">

      {/* ── Frame 820: 좌측 컬럼 712px ── */}
      <div className="w-[712px] flex flex-col gap-6">

        {/* Frame 806: 기기 요약 헤더 (712x264) */}
        <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
          {/* Frame 707: 타이틀 헤더 */}
          <div className="h-11 flex items-center justify-between py-2 px-3 self-stretch bg-[#F8F9FA] border-r border-b border-[#E8ECF2]">
            <span className="text-lg font-semibold text-[#111827]">{device.name} 256GB</span>
            <button className="flex items-center gap-1 text-sm text-[#9CA3AF] bg-transparent border-none cursor-pointer p-0">
              <span>상세보기</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {/* Frame 736 */}
          <div className="flex py-5 px-3 justify-center items-start gap-5 self-stretch bg-white border-b border-[#E2E8F0]">
            {/* Frame 772: 180x180, aspect-ratio:1/1, bg:cover */}
            <img
              src={Iphone17eImg}
              alt={device.name}
              className="shrink-0 object-cover"
              style={{ width: 180, height: 180, aspectRatio: '1/1' }}
            />
            {/* Frame 787: flex-col items-start gap-4 flex-[1_0_0] */}
            <div className="flex flex-col items-start gap-4 flex-[1_0_0]">
              {/* Frame 802: Frame 795 오토레이아웃 기능 배지 */}
              <div className="flex flex-wrap gap-2">
                <img src={BadgeApplePay}   alt="애플페이" className="h-6" />
                <img src={BadgeFaceId}     alt="Face ID"  className="h-6" />
                <img src={BadgeWaterproof} alt="방수/방진" className="h-6" />
                <span className="flex items-center gap-1 px-2 h-6 rounded-full bg-[#E8F2FF] text-sm text-[#111827]">
                  <img src={WiredChargeIcon} alt="" className="w-[9px] h-3 object-contain" />
                  무선충전
                </span>
                <span className="flex items-center gap-1 px-2 h-6 rounded-full bg-[#E8F2FF] text-sm text-[#111827]">
                  <img src={UsimIcon} alt="" className="w-[10px] h-3 object-contain" />
                  eSIM
                </span>
              </div>
              {/* Frame 652: py-3 px-2 flex-col justify-center items-start gap-3 self-stretch border-t border-b #E2E8F0 bg:#F8F9FA */}
              <div className="flex py-3 px-2 flex-col justify-center items-start gap-3 self-stretch border-t border-b border-[#E2E8F0] bg-[#F8F9FA]">
                {/* Frame 783~785: 일반 행 — 열(234px) · 라벨(60px) · 값(166px) 고정 */}
                {([
                  [['CPU','A19칩'],['배터리','4005mah']],
                  [['RAM','8GB'],['무게','200g']],
                  [['저장공간','256GB'],['디스플레이','6.1인치']],
                ] as [string,string][][]).map((row, i) => (
                  <div key={i} className="flex gap-1 items-start">
                    {row.map(([label, val]) => (
                      <div key={label} className="flex gap-2 w-[234px] shrink-0">
                        <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">{label}</span>
                        <span className="w-[166px] text-[13px] text-[#6B7280] leading-4">{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {/* Frame 786: 카메라 행 — 값이 2줄(Frame 807: 166x32) */}
                <div className="flex gap-1 items-start">
                  <div className="flex gap-2 w-[234px] shrink-0">
                    <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">카메라</span>
                    <div className="flex flex-col w-[166px]">
                      <span className="text-[13px] text-[#6B7280] leading-4">전면: 1,200만</span>
                      <span className="text-[13px] text-[#6B7280] leading-4">후면: 4,800만</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-[234px] shrink-0">
                    <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">출시일</span>
                    <span className="w-[166px] text-[13px] text-[#6B7280] leading-4">2026년 3월 11일</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 734: A/B 패널 */}
        <div className="flex flex-col items-start self-stretch rounded-xl border border-[#E2E8F0]">
          {/* Frame 733: 섹션 탭 헤더 */}
          <div className="flex">
            {/* Frame 707 */}
            <div className="flex w-[356px] h-11 py-2 px-3 items-center gap-1 border-r border-b border-[#E8ECF2] bg-[#F8F9FA]">
              <span className="text-base font-semibold text-text-dark">단말기 정보</span>
              <span className="text-base font-semibold text-primary">(A)</span>
            </div>
            {/* Frame 717 */}
            <div className="flex w-[356px] h-11 py-2 px-3 items-center gap-1 border-r border-b border-[#E8ECF2] bg-[#F8F9FA]">
              <span className="text-base font-semibold text-text-dark">요금제 정보</span>
              <span className="text-base font-semibold text-primary">(B)</span>
            </div>
          </div>

          {/* Frame 735: 요약 카드 */}
          <div className="flex border-b border-[#E8ECF2]">

            {/* Frame 722: 단말기 정보 A */}
            <div className="flex w-[356px] py-5 px-3 flex-col items-start gap-4 self-stretch border-r border-[#E8ECF2] bg-white">
              {/* 단말기 — 고정 표시 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">단말기</span>
                <div className="w-[236px] h-11 flex items-center px-3 border border-[#E2E8F0] rounded-lg bg-white">
                  <span className="text-[14px] text-[#111827] flex-1 truncate">{device.model}</span>
                </div>
              </div>
              {/* 색상 — 드롭다운 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">색상</span>
                <div ref={colorRef} className="relative w-[236px]">
                  <button
                    onClick={() => setColorOpen(o => !o)}
                    className="w-full h-11 flex items-center justify-between px-3 rounded-lg bg-white cursor-pointer border-none"
                    style={{ border: '1px solid #E2E8F0' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                      <div className="w-px h-5 bg-[#E8ECF2] shrink-0" />
                      <span className="text-[14px] text-[#111827]">{selectedColor.name}</span>
                    </div>
                    <ChevronIcon />
                  </button>
                  {colorOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-md z-50 overflow-hidden">
                      {device.colors.map((c, i) => (
                        <button key={c.name} className={`w-full flex items-center gap-2 px-3 py-2.5 text-left cursor-pointer border-none ${i === colorIdx ? 'bg-[#E8F2FF]' : 'bg-white'}`} onClick={() => { setColorIdx(i); setColorOpen(false); }}>
                          <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                          <div className="w-px h-5 bg-[#E2E8F0] shrink-0" />
                          <span className="text-[14px] text-[#111827]">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 출고가 — 고정값 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">출고가</span>
                <div className="w-[236px] h-11 flex items-center justify-end gap-1 px-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-[14px] text-[#111827]">1,250,000</span>
                  <span className="text-[12px] text-[#111827]">원</span>
                </div>
              </div>
            </div>

            {/* Frame 723: 요금제 정보 B */}
            <div className="flex w-[356px] py-5 px-3 flex-col items-start gap-4 self-stretch border-r border-[#E8ECF2] bg-white">
              {/* 가입 요금제 — 연필아이콘 클릭 → 모달 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">가입 요금제</span>
                <button
                  onClick={() => setPlanModalOpen(true)}
                  className="w-[236px] h-11 flex items-center justify-between px-3 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
                  style={{ border: '1px solid #E2E8F0' }}
                >
                  <span className="text-[14px] text-[#111827] flex-1 truncate text-left">{selectedPlan}</span>
                  {/* Frame 643: 연필 아이콘 */}
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" className="shrink-0 ml-1">
                    <path d="M7.5 1.5L9.5 3.5L3 10H1V8L7.5 1.5Z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2.5L8.5 4.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {/* 변경 가능일자 — 오늘로부터 6개월 뒤 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">변경 가능일자</span>
                <div className="w-[236px] h-11 flex items-center justify-between px-3 border border-[#E2E8F0] rounded-lg bg-white" style={{ border: '1px solid #E2E8F0' }}>
                  <span className="text-[14px] text-[#111827]">{changeableDateStr}</span>
                  {/* Frame 643: 캘린더 아이콘 */}
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" className="shrink-0">
                    <rect x="0.5" y="1.5" width="11" height="11" rx="1.5" stroke="#9CA3AF" strokeWidth="1"/>
                    <path d="M0.5 5.5H11.5" stroke="#9CA3AF" strokeWidth="1"/>
                    <path d="M3.5 0.5V2.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M8.5 0.5V2.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              {/* 월 기본료 — 고정값 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">월 기본료</span>
                <div className="w-[236px] h-11 flex items-center justify-end gap-1 px-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-[14px] text-[#111827]">99,000</span>
                  <span className="text-[12px] text-[#111827]">원</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frame 720: 공통지원금 / 선택약정할인 */}
          <div className="flex flex-col items-start self-stretch gap-4 py-5 px-3 border-t border-b border-[#E8ECF2] bg-[#F8F9FA]">
            {/* Frame 704: cornerRadius=8, bg=white, border — 탭 버튼 */}
            <div className="flex h-11 self-stretch bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              {(['공통지원금', '선택약정할인'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPlanTab(tab)}
                  className={`flex-1 flex justify-center items-center self-stretch rounded-lg border-none cursor-pointer text-sm font-medium
                    ${planTab === tab ? 'bg-[#1A80FF] text-white' : 'bg-transparent text-[#6B7280]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Frame 742: HORIZONTAL SPACE_BETWEEN gap=24 — 두 컬럼 */}
            <div className="flex justify-between gap-6 self-stretch">
              {/* Frame 740: VERTICAL MAX gap=16 — 공통지원금 컬럼 */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">가입유형</span>
                  <Dropdown value={가입유형} options={['번호이동', '신규가입', '기기변경']} onChange={set가입유형} disabled={planTab !== '공통지원금'} />
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">프로그램</span>
                  <div className={`flex-1 min-w-0 h-11 flex items-center justify-between pl-3 pr-2 rounded-lg border border-[#E2E8F0] overflow-hidden ${planTab === '공통지원금' ? 'bg-white' : 'bg-[#F8F9FA]'}`}>
                    <span className={`text-[14px] whitespace-nowrap overflow-hidden truncate ${planTab === '공통지원금' ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>프리미엄패스</span>
                    <span className="text-[12px] text-[#9CA3AF] whitespace-nowrap shrink-0 ml-2">자동가입</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">공통지원금</span>
                  <div className={`flex-1 min-w-0 h-11 flex items-center justify-end px-3 gap-1 rounded-lg border border-[#E2E8F0] ${planTab === '공통지원금' ? 'bg-white' : 'bg-[#F8F9FA]'}`}>
                    <span className={`text-[14px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>-</span>
                    <span className={`text-[14px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>500,000</span>
                    <span className={`text-[12px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>원</span>
                  </div>
                </div>
              </div>
              {/* Frame 741: VERTICAL MAX gap=16 — 선택약정할인 컬럼 */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">가입유형</span>
                  <Dropdown value={가입유형} options={['번호이동', '신규가입', '기기변경']} onChange={set가입유형} disabled={planTab !== '선택약정할인'} />
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">약정기간</span>
                  <Dropdown value={약정기간} options={['12개월', '24개월']} onChange={set약정기간} disabled={planTab !== '선택약정할인'} />
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">선택약정할인</span>
                  <div className={`flex-1 min-w-0 h-11 flex items-center justify-end px-3 gap-1 rounded-lg border border-[#E2E8F0] ${planTab === '선택약정할인' ? 'bg-white' : 'bg-[#F8F9FA]'}`}>
                    <span className={`text-[14px] ${planTab === '선택약정할인' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>-</span>
                    <span className={`text-[14px] ${planTab === '선택약정할인' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frame 731: A/B 폼 컬럼 — FILL horizontal, CENTER vertical */}
          <div className="flex self-stretch items-center">
            {/* Frame 721: FIXED 356px, FILL vertical, py-5 px-3 gap-4 */}
            <div className="flex-1 self-stretch bg-white border-r border-input-border px-3 py-5 flex flex-col gap-4">
              <FormRow label="할부개월"><Dropdown value={할부개월} options={['12개월', '24개월', '36개월']} onChange={set할부개월} /></FormRow>
              <FormRow label="추가지원금"><StaticField /></FormRow>
              <FormRow label="현금납부"><StaticField /></FormRow>
              <FormRow label="선카드할인"><StaticField /></FormRow>
              <FormRow label="포인트할인"><StaticField /></FormRow>
              {/* Frame 750: pad=16/12, gap=12, bg=#F8F9FA, border */}
              <div className="py-4 px-3 bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col gap-3">
                <SummaryRow label="할부원금" value="500,000원" />
                <SummaryRow label="할부수수료" value="54,849원" showInfo />
                <SummaryRow label="월 단말 할부금" value="38,780원" primary />
              </div>
            </div>
            {/* Frame 722: FIXED 356px, FILL vertical, py-5 px-3 gap-4 */}
            <div className="flex-1 self-stretch bg-white px-3 py-5 flex flex-col gap-4">
              <FormRow label="결합할인"><StaticField /></FormRow>
              <FormRow label="복지할인"><StaticField /></FormRow>
              <FormRow label="0히어로할인"><StaticField /></FormRow>
              <FormRow label="청구할인카드"><StaticField /></FormRow>
              <FormRow label="프로모션"><StaticField /></FormRow>
              {/* Frame 750: flex:1 0 0, pad=16/12, gap=12, justify-end, items-start, border-t/b only */}
              <div className="flex-[1_0_0] py-4 px-3 bg-[#F8F9FA] border-t border-b border-[#E2E8F0] flex flex-col justify-end items-start gap-3">
                <SummaryRow label="월 요금" value="99,000원" primary />
              </div>
            </div>
          </div>
        </div>

        {/* Frame 734 (C): 유심/보험/부가서비스 */}
        <div className="bg-white border border-input-border rounded-xl overflow-hidden">
          <div className="h-11 flex items-center px-5 border-b border-input-border">
            <span className="text-base font-semibold text-text-dark">유심/보험/부가서비스</span>
            <span className="text-base font-semibold text-primary ml-1">(C)</span>
          </div>
          <div className="px-3 py-3 flex flex-col gap-1">
            <div className="flex items-center h-11">
              <span className="w-[84px] shrink-0 text-sm text-text-dark">유심</span>
              <div className="flex-1 flex items-center">
                {['상품', '가격', '해지가능날짜', '삭제'].map(col => (
                  <span key={col} className="flex-1 text-sm text-[#6B7280]">{col}</span>
                ))}
              </div>
            </div>
            <FormRow label="보험"><Dropdown value={보험} options={APPLY_OPTIONS} onChange={set보험} /></FormRow>
            <FormRow label="부가서비스_1"><Dropdown value={부가서비스1} options={APPLY_OPTIONS} onChange={set부가서비스1} /></FormRow>
          </div>
        </div>

      </div>

      {/* ── Frame 819: 우측 컬럼 344px ── */}
      <div className="w-[344px] flex flex-col gap-6">

        {/* Frame 818: 개통 진행 + 초기화 */}
        <div className="flex flex-col gap-3">
          {/* Frame 807: 개통 진행 카드 */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="h-11 flex items-center px-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
              <span className="text-base font-semibold text-[#111827]">개통 진행</span>
            </div>
            <div className="flex flex-col gap-5 p-5 bg-white">
              <button className="w-full h-[52px] flex items-center justify-center bg-primary text-white text-base font-medium rounded-lg border-none cursor-pointer">
                견적서/개통안내서
              </button>
              <button className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#E8F2FF] text-[#5AAAFF] text-base font-medium rounded-lg border-none cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M15 11v3.5A1.5 1.5 0 0113.5 16h-9A1.5 1.5 0 013 14.5V11M9 2v9M6 5l3-3 3 3" stroke="#5AAAFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                서식지 출력
              </button>
            </div>
          </div>
          {/* 초기화 버튼 */}
          <button className="w-full h-11 flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#9CA3AF] cursor-pointer">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
              <path d="M1.5 9A7.5 7.5 0 1016.5 9M1.5 3v6h6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            초기화
          </button>
        </div>

        {/* Frame 783: 월 납부요금 정보 (344x248) */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="h-11 flex items-center px-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
            <span className="text-base font-semibold text-[#111827]">월 납부요금 정보</span>
          </div>
          <div className="flex flex-col gap-5 p-5 bg-white">
            {/* Frame 774: 4 아이콘 행 */}
            <UsageIconRow />
            {/* Frame 752: 요금 요약 */}
            <div className="flex flex-col gap-3 py-3 px-4 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">당월 예상금액</span>
                <span className="text-sm text-[#6B7280]">54,000원</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">월별 예상 청구 금액</span>
                <span className="text-sm font-semibold text-[#EF4444]">99,000원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 758: 요금제 변경 시 청구금액 (344x408) */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="h-11 flex items-center justify-between px-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
            <span className="text-base font-semibold text-[#111827]">요금제 변경 시 청구금액</span>
            <span className="text-sm text-[#9CA3AF]">2026-12-01 기준</span>
          </div>
          <div className="flex flex-col gap-5 p-5 bg-white">
            {/* Frame 778: 변경 요금제 + 월 기본료 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 h-11">
                <span className="w-[76px] shrink-0 text-sm text-[#6B7280]">변경 요금제</span>
                <Dropdown value={변경요금제} options={['5GX 프라임', '5GX 프라임플러스', '5G 스탠다드']} onChange={set변경요금제} />
              </div>
              <div className="flex items-center gap-2 h-11">
                <span className="w-[76px] shrink-0 text-sm text-[#6B7280]">월 기본료</span>
                <div className="flex-1 h-11 flex items-center px-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-sm text-[#111827]">-원</span>
                </div>
              </div>
            </div>
            {/* Frame 774: 4 아이콘 행 */}
            <UsageIconRow />
            {/* Frame 750: 요약 */}
            <div className="flex flex-col gap-3 py-3 px-4 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">공통차액정산금</span>
                <span className="text-sm text-[#111827]">-원</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">선택약정 위약금</span>
                <span className="text-sm text-[#111827]">-원</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">요금제 변경시 예상요금</span>
                <span className="text-sm font-semibold text-[#EF4444]">-원</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* ── 요금제 선택 모달 ── */}
    {planModalOpen && (
      <PlanSelectModal
        selectedPlan={selectedPlan}
        onSelect={(plan) => { setSelectedPlan(plan); setPlanModalOpen(false); }}
        onClose={() => setPlanModalOpen(false)}
        search={planSearch}
        onSearch={setPlanSearch}
        category={planCategory}
        onCategory={setPlanCategory}
        sortLabel={planSort}
        sortOpen={planSortOpen}
        setSortOpen={setPlanSortOpen}
        onSort={setPlanSort}
        sortRef={planSortRef}
      />
    )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 요금제 목록 데이터 (Figma 기준 컬럼)
// ─────────────────────────────────────────────────────────────
const PLAN_CATEGORIES = ['전체','일반','키즈','청소년(유쓰)','시니어','외국인','외국인(유쓰)','복지','LTE','태블릿/스마트워치','듀얼넘버플러스'];
const PLAN_SORT_OPTIONS = ['가격높은순','가격낮은순','이름순'];

// ── 요금제 타입 (서버 API 응답 구조에 맞춰 교체 예정) ──
export interface PlanItem {
  id: string;
  name: string;       // 요금제명
  monthly: string;    // 월정액 (표시용 문자열, e.g. "79,000원")
  support: string;    // 이통사지원금
  call: string;       // 통화
  sms: string;        // 문자
  addCall: string;    // 부가통화
  data: string;       // 데이터
}

// TODO: 실제 서버 API 호출로 교체 — fetchPlans(carrier, category)
const MOCK_PLANS: PlanItem[] = [
  { id: 'skt-01', name: '5GX 프리미엄(유튜브 프리미엄)',    monthly: '79,000원',  support: '0원',       call: '무제한', sms: '무제한', addCall: '300분', data: '150GB + 데이터충전 150GB + 5Mbps' },
  { id: 'skt-02', name: '5GX 프라임플러스(T우주)',           monthly: '99,000원',  support: '0원',       call: '무제한', sms: '무제한', addCall: '300분', data: '무제한' },
  { id: 'skt-03', name: '5G 스탠다드',                       monthly: '69,000원',  support: '0원',       call: '무제한', sms: '무제한', addCall: '300분', data: '100GB + 데이터충전 100GB + 3Mbps' },
  { id: 'skt-04', name: '유튜브 프리미엄 플러스 플랜 105',  monthly: '125,000원', support: '999,999원', call: '무제한', sms: '무제한', addCall: '300분', data: '36GB + 데이터충전 36GB + 1Mbps' },
  { id: 'skt-05', name: '5GX 프리미엄(T우주)',               monthly: '89,000원',  support: '0원',       call: '무제한', sms: '무제한', addCall: '300분', data: '200GB + 데이터충전 200GB + 5Mbps' },
  { id: 'skt-06', name: '5G 베이직',                         monthly: '55,000원',  support: '0원',       call: '무제한', sms: '무제한', addCall: '200분', data: '12GB + 데이터충전 12GB + 1Mbps' },
];

function PlanSelectModal({
  selectedPlan, onSelect, onClose,
  search, onSearch, category, onCategory,
  sortLabel, sortOpen, setSortOpen, onSort, sortRef,
}: {
  selectedPlan: string;
  onSelect: (plan: string) => void;
  onClose: () => void;
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  sortLabel: string;
  sortOpen: boolean;
  setSortOpen: (v: boolean) => void;
  onSort: (v: string) => void;
  sortRef: React.RefObject<HTMLDivElement>;
}) {
  // 카테고리 필터는 서버 API 호출 시 파라미터로 전달 예정 — 현재는 검색어만 적용
  const filtered = MOCK_PLANS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="w-[900px] bg-white rounded-xl p-7 flex flex-col gap-5" onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <span className="text-xl font-semibold text-[#111827]">요금제 선택</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 검색 + 정렬 */}
        <div className="flex gap-4">
          <div className="flex-1 h-11 flex items-center gap-2 px-3 border border-[#E2E8F0] rounded-lg bg-white">
            <input
              type="text"
              placeholder="요금제 검색"
              value={search}
              onChange={e => onSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
            />
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#9CA3AF" strokeWidth="1.3"/>
              <path d="M9 9l3 3" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div ref={sortRef} className="relative w-[236px]">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full h-11 flex items-center justify-between px-3 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer border-none"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <span className="text-[14px] text-[#9CA3AF]">{sortLabel}</span>
              <svg width="8" height="4" viewBox="0 0 8 4" fill="none"><path d="M1 1l3 2 3-2" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {sortOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-md z-10 overflow-hidden">
                {PLAN_SORT_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => { onSort(opt); setSortOpen(false); }} className={`w-full px-3 py-2.5 text-left text-[14px] border-none cursor-pointer ${sortLabel === opt ? 'bg-[#E8F2FF] text-[#111827]' : 'bg-white text-[#111827]'}`}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex bg-[#F8F9FA] overflow-x-auto">
          {PLAN_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategory(cat)}
              className={`h-11 px-3 shrink-0 text-[14px] font-medium border-none cursor-pointer whitespace-nowrap
                ${category === cat ? 'bg-primary text-white' : 'bg-transparent text-[#111827]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 테이블 헤더 — Figma Frame 835 기준 컬럼 너비 */}
        <div className="flex items-center h-12 px-5 bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg">
          <span className="w-[200px] shrink-0 text-[14px] text-[#9CA3AF]">요금제명</span>
          <span className="w-[68px] shrink-0 text-[14px] text-[#9CA3AF]">월정액</span>
          <span className="w-[78px] shrink-0 text-[14px] text-[#9CA3AF]">이통사지원금</span>
          <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF]">통화</span>
          <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF]">문자</span>
          <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF]">부가통화</span>
          <span className="flex-1 text-[14px] text-[#9CA3AF]">데이터</span>
          <span className="w-6 shrink-0" />
        </div>

        {/* 요금제 목록 — API 연동 시 filtered → server 응답 데이터로 교체 */}
        <div className="flex flex-col max-h-[320px] overflow-y-auto border border-[#E2E8F0] rounded-lg">
          {filtered.map(plan => (
            <div
              key={plan.id}
              onClick={() => onSelect(plan.name)}
              className={`flex items-center min-h-[64px] px-5 cursor-pointer border-b border-[#E2E8F0] last:border-b-0
                ${selectedPlan === plan.name ? 'bg-[#E8F2FF]' : 'bg-white'}`}
            >
              <span className="w-[200px] shrink-0 text-[14px] font-medium text-[#111827] truncate">{plan.name}</span>
              <span className="w-[68px] shrink-0 text-[14px] text-[#6B7280]">{plan.monthly}</span>
              <span className="w-[78px] shrink-0 text-[14px] text-[#6B7280]">{plan.support}</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#6B7280]">{plan.call}</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#6B7280]">{plan.sms}</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#6B7280]">{plan.addCall}</span>
              <span className="flex-1 text-[14px] text-[#6B7280] break-words">{plan.data}</span>
              <span className="w-6 shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Frame 774: 4개 아이콘(데이터·음성·문자·영상) + "-" 값, 구분선 포함
function UsageIconRow() {
  const icons = [
    // 데이터 (파란 원형)
    <svg key="data" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#1A80FF"/><path d="M5 9h8M9 5v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    // 음성 (전화기)
    <svg key="call" width="18" height="15" viewBox="0 0 18 15" fill="none"><path d="M16.5 11.3c0 .3-.1.6-.2.9-.1.3-.3.5-.5.7-.4.4-.8.6-1.3.6-.3 0-.7-.1-1-.2-1-.4-2-.9-2.9-1.6-1.3-1-2.4-2.2-3.2-3.5-.7-1-.9-1.9-1-2.7 0-.5.1-.9.3-1.3.2-.4.5-.7.9-.9L8.6 3c.4-.1.7.1.9.5L11 6c.1.4 0 .8-.3 1l-.9.6c.6 1.1 1.5 2 2.6 2.6l.6-.9c.2-.3.6-.4 1-.3l2.5 1.5c.3.2.5.5.5.8h-.5z" stroke="#6B7280" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    // 문자 (말풍선)
    <svg key="sms" width="18" height="16" viewBox="0 0 18 16" fill="none"><path d="M15 1H3a2 2 0 00-2 2v8a2 2 0 002 2h9l3 2V3a2 2 0 00-2-2z" stroke="#6B7280" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    // 영상 (비디오카메라)
    <svg key="video" width="18" height="13" viewBox="0 0 18 13" fill="none"><path d="M11 1H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V2a1 1 0 00-1-1zM12 5l5-3v9l-5-3V5z" stroke="#6B7280" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  ];

  return (
    <div className="flex items-center justify-between border border-[#E2E8F0] rounded-lg px-4 py-3 bg-white">
      {icons.map((icon, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <div className="w-px h-9 bg-[#E2E8F0] mr-2" />}
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
            <span className="text-sm text-[#111827]">-</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dropdown({ value, options, onChange, disabled }: { value: string; options: string[]; onChange: (v: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative flex-1">
      <button
        className="w-full h-11 flex items-center justify-between px-3 border border-input-border rounded-lg text-sm cursor-pointer"
        style={{
          backgroundColor: disabled ? '#F8F9FA' : 'white',
          color: disabled ? '#9CA3AF' : (value === '미적용' || value === '변경할 요금제' ? '#9CA3AF' : '#111827'),
        }}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
      >
        <span>{value}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-input-border rounded-lg shadow-md z-50 overflow-hidden">
          {options.map(opt => (
            <button key={opt} className={`w-full px-3 py-2.5 text-left text-sm cursor-pointer border-none ${value === opt ? 'bg-[#E8F2FF]' : 'bg-white'}`} style={{ color: opt === '미적용' ? '#9CA3AF' : '#111827' }} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
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

function SummaryRow({ label, value, showInfo = false, primary = false }: { label: string; value: string; showInfo?: boolean; primary?: boolean; }) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-sm text-[#6B7280]">{label}</span>
        {showInfo && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path d="M10 4C13.3132 4.00034 15.9998 6.68678 16 10C15.9999 13.3133 13.3132 15.9997 10 16C6.6865 16 4.00013 13.3135 4 10C4.00018 6.68657 6.68653 4 10 4ZM10 5C7.23881 5 5.00018 7.23885 5 10C5.00013 12.7612 7.23878 15 10 15C12.7609 14.9997 14.9999 12.761 15 10C14.9998 7.23907 12.7609 5.00034 10 5ZM10.0059 12.251C10.282 12.251 10.5059 12.4748 10.5059 12.751C10.5058 13.027 10.2819 13.251 10.0059 13.251H9.99902C9.72305 13.2508 9.49911 13.027 9.49902 12.751C9.49902 12.4749 9.72299 12.2511 9.99902 12.251H10.0059ZM8.86621 7.04297C9.30387 6.78585 9.81903 6.69153 10.3193 6.77734C10.8196 6.86324 11.2737 7.12339 11.6006 7.51172C11.9273 7.89987 12.106 8.39114 12.1055 8.89844C12.1055 9.71343 11.5012 10.2565 11.0586 10.5518C10.8223 10.7093 10.5888 10.8259 10.417 10.9023C10.3306 10.9407 10.2575 10.9703 10.2051 10.9902C10.179 11.0002 10.157 11.0072 10.1416 11.0127C10.1341 11.0153 10.1277 11.0179 10.123 11.0195C10.1209 11.0203 10.1187 11.021 10.1172 11.0215L10.1152 11.0225H10.1143C9.85229 11.1098 9.56877 10.968 9.48145 10.7061C9.39447 10.4442 9.53605 10.1615 9.79785 10.0742L9.80664 10.0713C9.81543 10.0682 9.83009 10.0627 9.84863 10.0557C9.88645 10.0413 9.94291 10.0184 10.0107 9.98828C10.1482 9.92719 10.3282 9.83687 10.5039 9.71973C10.8858 9.46499 11.1055 9.18281 11.1055 8.89844V8.89746C11.1058 8.6261 11.0107 8.3629 10.8359 8.15527C10.6611 7.94762 10.4179 7.80868 10.1504 7.7627C9.88286 7.71681 9.6071 7.76685 9.37305 7.9043C9.13899 8.04185 8.96124 8.25857 8.87109 8.51465C8.77941 8.77494 8.49377 8.91177 8.2334 8.82031C7.97294 8.72866 7.83612 8.44309 7.92773 8.18262C8.09619 7.70392 8.42877 7.30019 8.86621 7.04297Z" fill="#9CA3AF"/>
          </svg>
        )}
      </div>
      <span className={`text-sm ${primary ? 'font-semibold text-[#EF4444]' : 'text-text-dark'}`}>{value}</span>
    </div>
  );
}

function StaticField() {
  return (
    <div className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white">
      <span className="text-sm text-[#9CA3AF]">미적용</span>
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
