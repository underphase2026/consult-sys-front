import { useState, useRef, useEffect, ReactNode, Fragment } from 'react';
import { useConsulting, getCachedDevices, type DeviceData } from '../hooks/useConsulting';
import { ConsultingStep } from '../contexts/ConsultingTabsContext';
import Iphone17eImg from '../images/devices/Iphone17e.svg';
import BadgeApplePay   from '../images/badges/badge-applepay.svg';
import BadgeFaceId     from '../images/badges/badge-faceid.svg';
import BadgeWaterproof from '../images/badges/badge-waterproof.svg';
import WiredChargeIcon from '../images/badges/wired_charge.svg';
import UsimIcon        from '../images/badges/usim.svg';

const CARRIER_LABELS: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };

const DEVICE_IMAGES: Record<string, string> = {
  'iphone-17e': Iphone17eImg,
};

interface Props { carrier: string; deviceId: string; navigate: (s: ConsultingStep, label?: string) => void; }

export default function PaymentInfo(props: Props) {
  const { fetchDevices } = useConsulting();
  const [device, setDevice] = useState<DeviceData | null>(() => {
    const cached = getCachedDevices(props.carrier);
    return cached?.find(d => d.id === props.deviceId) || null;
  });

  useEffect(() => {
    if (!device) {
      fetchDevices(props.carrier).then(data => {
        const found = data.find(d => d.id === props.deviceId);
        if (found) setDevice(found);
        else if (data.length > 0) setDevice(data[0]);
      });
    }
  }, [props.carrier, props.deviceId, fetchDevices, device]);

  if (!device) {
    return <div className="py-[60px] flex justify-center w-full">데이터를 불러오는 중입니다...</div>;
  }

  return <PaymentInfoContent {...props} device={device} />;
}

function PaymentInfoContent({ carrier, deviceId, navigate: _navigate, device }: Props & { device: DeviceData }) {

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
  const [가입유형, set가입유형]           = useState('신규가입');
  const [약정기간, set약정기간]           = useState('24개월');
  const [할부개월, set할부개월]           = useState('24개월');
  const [유심, set유심]                   = useState('미적용');
  const [보험Modal, set보험Modal]         = useState('');
  const [부가서비스List, set부가서비스List] = useState<string[]>(['']);

  const add부가서비스 = () => set부가서비스List(prev => [...prev, '']);
  const remove부가서비스 = (idx: number) => set부가서비스List(prev => prev.filter((_, i) => i !== idx));
  const [변경요금제, set변경요금제]           = useState('변경할 요금제');
  const [변경요금제ModalOpen, set변경요금제ModalOpen] = useState(false);

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
    d.setDate(d.getDate() + 183);
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
            <span className="text-lg font-semibold text-[#111827]">{device.name} {device.specs.storage.split('/')[0].trim()}</span>
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
              src={DEVICE_IMAGES[device.id] || Iphone17eImg}
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
                  [['CPU', device.specs.cpu],['배터리', device.specs.battery]],
                  [['RAM', device.specs.ram],['무게', device.specs.weight]],
                  [['저장공간', device.specs.storage],['디스플레이', device.specs.display]],
                ] as [string,string][][]).map((row, i) => (
                  <div key={i} className="flex gap-1 items-start">
                    {row.map(([label, val]) => (
                      <div key={label} className="flex gap-2 w-[234px] shrink-0">
                        <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">{label}</span>
                        <span className="w-[166px] text-[13px] text-[#6B7280] leading-4 truncate">{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {/* Frame 786: 카메라 행 — 값이 2줄(Frame 807: 166x32) */}
                <div className="flex gap-1 items-start">
                  <div className="flex gap-2 w-[234px] shrink-0">
                    <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">카메라</span>
                    <div className="flex flex-col w-[166px]">
                      <span className="text-[13px] text-[#6B7280] leading-4 whitespace-pre-line">{device.specs.camera}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-[234px] shrink-0">
                    <span className="w-[60px] shrink-0 text-[13px] text-[#111827] leading-4">출시일</span>
                    <span className="w-[166px] text-[13px] text-[#6B7280] leading-4">{device.specs.released}</span>
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
                  <span className="text-[14px] text-[#111827]">{device.price.replace('원', '')}</span>
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
                  <PencilIcon />
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
              <div className={`flex-1 min-w-0 flex flex-col gap-4 transition-all ${planTab !== '공통지원금' ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">가입유형</span>
                  <Dropdown value={가입유형} options={['신규가입', '기기변경', '번호이동']} onChange={set가입유형} disabled={planTab !== '공통지원금'} />
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
                    <span className={`text-[14px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>{device.support.replace('원', '')}</span>
                    <span className={`text-[12px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>원</span>
                  </div>
                </div>
              </div>
              {/* Frame 741: VERTICAL MAX gap=16 — 선택약정할인 컬럼 */}
              <div className={`flex-1 min-w-0 flex flex-col gap-4 transition-all ${planTab !== '선택약정할인' ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">가입유형</span>
                  <Dropdown value={가입유형} options={['신규가입', '기기변경', '번호이동']} onChange={set가입유형} disabled={planTab !== '선택약정할인'} />
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">약정기간</span>
                  <Dropdown value={약정기간} options={['24개월', '12+12개월', '12개월']} onChange={set약정기간} disabled={planTab !== '선택약정할인'} />
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
              <FormRow label="할부개월"><Dropdown value={할부개월} options={['6개월', '12개월', '18개월', '24개월', '30개월', '36개월', '48개월']} onChange={set할부개월} /></FormRow>
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
        <div className="flex flex-col items-start self-stretch rounded-xl border border-[#E2E8F0] overflow-hidden">
          {/* Frame 707: 헤더 */}
          <div className="flex h-11 py-2 px-3 items-center gap-1 self-stretch border-b border-[#E8ECF2] bg-[#F8F9FA]">
            <span className="text-base font-semibold text-[#111827]">유심/보험/부가서비스</span>
            <span className="text-base font-semibold text-[#1A80FF]">(C)</span>
          </div>

          {/* Frame 721: 내용 — py-5 px-3 flex-col items-start gap-4 flex-[1_0_0] border-r bg-white */}
          <div className="py-5 px-3 flex flex-col items-start gap-4 flex-[1_0_0] border-r border-[#E8ECF2] bg-white">

            {/* 유심: label(88px) + Dropdown(236px) + 가격(136px) */}
            <div className="flex items-center gap-2 self-stretch">
              <span className="w-[88px] shrink-0 text-sm text-[#6B7280]">유심</span>
              <Dropdown
                value={유심}
                options={['미적용', '기존 유심 사용', '후납', '선납', '대납', 'eSIM 후납']}
                optionPrices={{ '기존 유심 사용': '0원', '후납': '7,700원', '선납': '7,700원', '대납': '7,700원', 'eSIM 후납': '2,750원' }}
                onChange={set유심}
                wrapperClassName="relative w-[236px] shrink-0"
              />
              <div className="w-[136px] shrink-0 h-11 flex items-center justify-end py-3 px-3 bg-[#F8F9FA] rounded-lg">
                <span className="text-sm text-[#111827]">0원</span>
              </div>
            </div>

            {/* 보험: label(88px) + 버튼(236px) + 가격(136px) + 날짜(136px) */}
            <div className="flex items-center gap-2 self-stretch">
              <span className="w-[88px] shrink-0 text-sm text-[#6B7280]">보험</span>
              <button className="w-[236px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer">
                <span className="text-sm text-[#9CA3AF] truncate">{보험Modal || '미적용'}</span>
                <PencilIcon />
              </button>
              <div className="w-[136px] shrink-0 h-11 flex items-center justify-end py-3 pl-3 pr-2 bg-[#F8F9FA] rounded-lg">
                <span className="text-sm text-[#111827]">0원</span>
              </div>
              <div className="w-[136px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white">
                <span className="text-sm text-[#9CA3AF]">해지가능일</span>
                <CalendarIcon />
              </div>
            </div>

            {/* 부가서비스 행들 (동적) — label(88px) + 버튼(236px) + 가격(136px) + 날짜(136px) + 삭제(60px) */}
            {부가서비스List.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 self-stretch">
                <span className="w-[88px] shrink-0 text-sm text-[#6B7280]">부가서비스_{idx + 1}</span>
                <button className="w-[236px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer">
                  <span className="text-sm text-[#9CA3AF] truncate">{item || '미적용'}</span>
                  <PencilIcon />
                </button>
                <div className="w-[136px] shrink-0 h-11 flex items-center justify-end py-3 pl-3 pr-2 bg-[#F8F9FA] rounded-lg">
                  <span className="text-sm text-[#111827]">0원</span>
                </div>
                <div className="w-[136px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white">
                  <span className="text-sm text-[#111827]">{changeableDateStr}</span>
                  <CalendarIcon />
                </div>
                <button
                  onClick={() => remove부가서비스(idx)}
                  className="w-[60px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 rounded-lg cursor-pointer"
                >
                  <span className="text-sm text-[#9CA3AF]">삭제</span>
                </button>
              </div>
            ))}

            {/* 부가서비스 추가 버튼 — #E8F2FF bg, #5AAAFF text */}
            <button
              onClick={add부가서비스}
              className="flex items-center justify-center h-11 self-stretch py-3 pl-3 pr-2 rounded-lg bg-[#E8F2FF] border-none cursor-pointer"
            >
              <span className="text-sm text-[#5AAAFF]">+ 부가서비스 추가</span>
            </button>

            {/* Frame 750: 요약 */}
            <div className="py-4 px-3 flex flex-col items-start gap-3 self-stretch border-t border-b border-[#E2E8F0] bg-[#F8F9FA]">
              <SummaryRow label="유심가입비" value="500,000원" />
              <SummaryRow label="월 청구 부가서비스 요금(보험, 부가서비스)" value="38,780원" valueClassName="text-base font-semibold text-[#EF4444]" />
            </div>

          </div>
        </div>

      </div>

      {/* ── Frame 819: 우측 컬럼 344px ── */}
      <div className="w-[344px] flex flex-col gap-6">

        {/* Frame 818: 개통 진행 + 초기화 */}
        <div className="flex flex-col gap-3">
          {/* Frame 807: 개통 진행 카드 */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex h-11 px-3 items-center gap-1 self-stretch border-b border-[#E2E8F0] bg-[#F8F9FA]">
              <span className="text-base font-semibold text-[#111827]">개통 진행</span>
            </div>
            <div className="flex py-5 px-3 flex-col justify-center items-center gap-5 self-stretch border-b border-[#E2E8F0] bg-white">
              <button className="w-full h-[52px] flex items-center justify-center px-3 bg-[#1A80FF] text-white text-base font-semibold rounded-lg border-none cursor-pointer">
                견적서/개통안내서
              </button>
              <button className="w-full h-[52px] flex items-center justify-center gap-2 px-3 bg-[#E8F2FF] text-[#5AAAFF] text-base font-semibold rounded-lg border-none cursor-pointer">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="shrink-0">
                  <path d="M13.0007 0C13.5527 0.00025089 14.0006 0.448064 14.0008 1.00006V5.2503H14.4999C15.1627 5.2503 15.7987 5.5142 16.2675 5.98277C16.7363 6.45152 16.9999 7.0875 17 7.75045V11.4997C17 12.1627 16.7364 12.7985 16.2675 13.2674C15.7987 13.7362 15.1629 13.9998 14.4999 13.9998H14.0008V15.9999C14.0008 16.5521 13.5529 16.9997 13.0007 17H4.00023C3.44807 16.9998 3.00017 16.5521 3.00017 15.9999V13.9998H2.50014C1.83725 13.9997 1.20123 13.7361 0.732464 13.2674C0.263913 12.7986 0 12.1625 0 11.4997V7.75045C8.08583e-05 7.08754 0.263726 6.45152 0.732464 5.98277C1.20123 5.51403 1.83725 5.25041 2.50014 5.2503H3.00017V1.00006C3.00037 0.448021 3.44819 0.000181656 4.00023 0H13.0007ZM5.00029 14.9999H12.0007V13.0164C12.0006 13.0109 11.9997 13.0052 11.9997 12.9998C11.9997 12.9939 12.0006 12.988 12.0007 12.9822V11.0006H5.00029V14.9999ZM2.50014 7.25042C2.36768 7.25052 2.24027 7.30326 2.14661 7.39691C2.05296 7.49058 2.0002 7.61803 2.00011 7.75045V11.4997C2.00011 11.632 2.05314 11.7595 2.14661 11.8532C2.24027 11.9469 2.36767 11.9996 2.50014 11.9997H3.00017V10.0006C3.00024 9.44843 3.44811 9.0007 4.00023 9.00052H13.0007C13.5528 9.00077 14.0007 9.44847 14.0008 10.0006V11.9997H14.4999C14.6324 11.9997 14.7596 11.9469 14.8534 11.8532C14.9471 11.7595 14.9999 11.6322 14.9999 11.4997V7.75045C14.9998 7.618 14.9471 7.49058 14.8534 7.39691C14.7597 7.30345 14.6323 7.25042 14.4999 7.25042H2.50014ZM5.00029 5.2503H12.0007V2.00011H5.00029V5.2503Z" fill="#5AAAFF"/>
                </svg>
                서식지 출력
              </button>
            </div>
          </div>
          {/* 초기화 버튼 */}
          <button className="w-full h-11 flex items-center justify-center gap-2 px-3 bg-white border border-[#E2E8F0] rounded-lg text-base text-[#9CA3AF] cursor-pointer">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="shrink-0">
              <path d="M5.0553 9.14257C5.34189 9.14295 5.57481 9.37543 5.57484 9.6621C5.57484 9.94879 5.3419 10.1812 5.0553 10.1816H1.74531L4.3998 12.9264L4.41096 12.9376C5.16457 13.7669 6.09308 14.3678 7.10604 14.69C8.1184 15.012 9.18708 15.047 10.2141 14.7915C11.2415 14.5357 12.1989 13.9963 12.9944 13.2187C13.7902 12.4407 14.3984 11.4492 14.757 10.3349C14.845 10.0622 15.1376 9.9115 15.4105 9.99899C15.6832 10.0868 15.8336 10.3796 15.7463 10.6525C15.3383 11.9207 14.6427 13.0603 13.721 13.9614C12.7989 14.8628 11.6796 15.4979 10.4658 15.8001C9.25132 16.1023 7.98572 16.0606 6.79046 15.6804C5.60064 15.3018 4.52321 14.6004 3.65398 13.6479V13.6489L1.03907 10.9457V14.6504C1.03896 14.9372 0.806272 15.1698 0.519533 15.17C0.232667 15.17 0.000104419 14.9373 0 14.6504V9.65398C0.000288113 9.63629 0.00299212 9.6188 0.00507357 9.60122C0.0190377 9.48211 0.071656 9.37525 0.152207 9.29477L0.158295 9.28869C0.164374 9.28282 0.171289 9.27796 0.177575 9.27245C0.196743 9.25563 0.215935 9.23864 0.237443 9.22476C0.242274 9.22165 0.247755 9.21958 0.252664 9.21664C0.277218 9.20192 0.302812 9.18865 0.329782 9.17808C0.335063 9.17602 0.340686 9.17489 0.346017 9.17301C0.371282 9.16406 0.397261 9.15668 0.42415 9.1517C0.434891 9.14971 0.445798 9.14895 0.456621 9.14764C0.477204 9.14516 0.498281 9.14257 0.519533 9.14257H5.0553ZM7.20345 0.199899C8.4177 -0.10218 9.68266 -0.0615108 10.8777 0.31862C12.0673 0.697101 13.145 1.3989 14.0142 2.35109H14.0152L16.6291 5.05226V1.34855C16.6294 1.06192 16.862 0.829139 17.1487 0.829021C17.4352 0.829259 17.6679 1.06199 17.6682 1.34855V6.33688C17.6682 6.33808 17.6672 6.33975 17.6672 6.34094C17.667 6.35968 17.6642 6.37813 17.6621 6.39675C17.6482 6.5177 17.5943 6.62514 17.5119 6.70624C17.5109 6.70724 17.5109 6.7093 17.5099 6.7103C17.5011 6.71881 17.4897 6.72486 17.4805 6.73262C17.4648 6.7458 17.45 6.7599 17.4328 6.77118C17.4165 6.78185 17.3991 6.78993 17.382 6.79858C17.3696 6.80488 17.3575 6.81153 17.3445 6.81684C17.3246 6.82497 17.3042 6.83057 17.2836 6.83612C17.2714 6.83942 17.2596 6.84386 17.2471 6.84627C17.2229 6.85093 17.1985 6.85217 17.174 6.85337C17.1656 6.85378 17.1571 6.85641 17.1487 6.85642H12.6129C12.3261 6.8563 12.0935 6.62365 12.0934 6.33688C12.0936 6.05025 12.3262 5.81747 12.6129 5.81735H15.9229L13.2684 3.07357C13.2647 3.0697 13.2608 3.06537 13.2572 3.06139C12.5037 2.23236 11.5759 1.63122 10.5632 1.30898C9.55073 0.986895 8.48119 0.952995 7.45408 1.20852C6.42684 1.4642 5.46926 2.00286 4.67377 2.78031C3.87793 3.55829 3.26984 4.55075 2.91121 5.66514C2.82321 5.93803 2.53073 6.08776 2.25774 6C1.98464 5.91211 1.83403 5.61964 1.92187 5.34652C2.32999 4.07828 3.02543 2.93866 3.94723 2.03754C4.86939 1.1362 5.98947 0.502 7.20345 0.199899Z" fill="#9CA3AF"/>
            </svg>
            초기화
          </button>
        </div>

        {/* Frame 783: 월 납부요금 정보 (344x248) */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="h-11 flex items-center gap-1 px-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
            <span className="text-base font-semibold text-[#111827]">월 납부요금 정보</span>
          </div>
          <div className="flex flex-col gap-5 py-5 px-3 items-center bg-white">
            {/* Frame 774: 4 아이콘 행 */}
            <UsageIconRow />
            {/* Frame 752: 요금 요약 */}
            <div className="flex flex-col gap-3 py-4 px-3 bg-[#F8F9FA] border border-[#E2E8F0] self-stretch">
              <div className="flex items-center justify-between h-4">
                <span className="text-sm leading-4 text-[#6B7280]">당월 예상금액</span>
                <span className="flex items-center">
                  <span className="text-sm leading-4 text-[#6B7280]">54,000</span>
                  <span className="text-[12px] leading-4 text-[#6B7280]">원</span>
                </span>
              </div>
              <div className="flex items-center justify-between h-5">
                <span className="text-sm leading-5 text-[#6B7280]">월별 예상 청구 금액</span>
                <span className="flex items-center">
                  <span className="text-base leading-5 font-semibold text-[#EF4444]">99,000</span>
                  <span className="text-sm leading-5 font-semibold text-[#EF4444]">원</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 758: 요금제 변경 시 청구금액 (344x408) */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="h-11 flex items-center justify-between gap-1 px-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
            <span className="text-base font-semibold text-[#111827]">요금제 변경 시 청구금액</span>
            <span className="text-[12px] text-[#9CA3AF]">{changeableDateStr} 기준</span>
          </div>
          <div className="flex flex-col gap-5 py-5 px-3 bg-white">
            {/* Frame 778: 변경 요금제 + 월 기본료 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 h-11">
                <span className="w-[76px] shrink-0 text-sm text-[#6B7280]">변경 요금제</span>
                <button
                  onClick={() => set변경요금제ModalOpen(true)}
                  className="w-[236px] shrink-0 h-11 flex items-center justify-between pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
                >
                  <span className="text-sm flex-1 truncate text-left" style={{ color: 변경요금제 === '변경할 요금제' ? '#9CA3AF' : '#111827' }}>{변경요금제}</span>
                  <PencilIcon />
                </button>
              </div>
              <div className="flex items-center gap-2 h-11">
                <span className="w-[76px] shrink-0 text-sm text-[#6B7280]">월 기본료</span>
                <div className="w-[236px] shrink-0 h-11 flex items-center justify-end pl-3 pr-2 bg-[#F8F9FA] rounded-lg">
                  <span className="text-sm text-[#111827]">-</span>
                  <span className="text-[12px] text-[#111827]">원</span>
                </div>
              </div>
            </div>
            {/* Frame 774: 4 아이콘 행 */}
            <UsageIconRow />
            {/* Frame 750: 요약 */}
            <div className="flex flex-col gap-3 py-4 px-3 bg-[#F8F9FA] border border-[#E2E8F0]">
              <div className="flex items-center justify-between h-5">
                <span className="text-sm leading-5 text-[#6B7280]">공통차액정산금</span>
                <span className="flex items-center">
                  <span className="text-sm leading-5 text-[#111827]">-</span>
                  <span className="text-[12px] leading-5 text-[#111827]">원</span>
                </span>
              </div>
              <div className="flex items-center justify-between h-5">
                <span className="text-sm leading-5 text-[#6B7280]">선택약정 위약금</span>
                <span className="flex items-center">
                  <span className="text-sm leading-5 text-[#111827]">-</span>
                  <span className="text-[12px] leading-5 text-[#111827]">원</span>
                </span>
              </div>
              <div className="flex items-center justify-between h-5">
                <span className="text-sm leading-5 text-[#6B7280]">요금제 변경시 예상요금</span>
                <span className="flex items-center">
                  <span className="text-base leading-5 font-semibold text-[#EF4444]">-</span>
                  <span className="text-sm leading-5 font-semibold text-[#EF4444]">원</span>
                </span>
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
    {/* ── 변경 요금제 선택 모달 ── */}
    {변경요금제ModalOpen && (
      <PlanSelectModal
        selectedPlan={변경요금제 === '변경할 요금제' ? '' : 변경요금제}
        onSelect={(plan) => { set변경요금제(plan); set변경요금제ModalOpen(false); }}
        onClose={() => set변경요금제ModalOpen(false)}
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
    <svg key="data" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.426 17.2941C12.2767 17.8444 13.2908 18.0843 14.2975 17.9736C15.3042 17.8629 16.2421 17.4082 16.9533 16.6862L17.575 16.0769C17.8475 15.7978 18 15.4229 18 15.0326C18 14.6422 17.8475 14.2674 17.575 13.9883L14.9369 11.3729C14.6604 11.1008 14.2883 10.9484 13.9007 10.9484C13.5132 10.9484 13.1411 11.1008 12.8646 11.3729C12.5858 11.6461 12.2113 11.7991 11.8212 11.7991C11.4311 11.7991 11.0565 11.6461 10.7778 11.3729L6.63325 7.22225C6.49496 7.08573 6.38516 6.92305 6.31021 6.74365C6.23526 6.56426 6.19666 6.37174 6.19666 6.17728C6.19666 5.98282 6.23526 5.79029 6.31021 5.6109C6.38516 5.43151 6.49496 5.26883 6.63325 5.13231C6.90486 4.85543 7.05705 4.4828 7.05705 4.09466C7.05705 3.70651 6.90486 3.33389 6.63325 3.05701L4.00574 0.425625C3.72702 0.152771 3.35273 0 2.96297 0C2.5732 0 2.19892 0.152771 1.9202 0.425625L1.31181 1.04822C0.591148 1.76037 0.137274 2.69928 0.0264778 3.70711C-0.0843182 4.71495 0.154724 5.73025 0.703419 6.58236C3.56363 10.8044 7.20309 14.4402 11.426 17.2941Z" fill="#1A80FF"/></svg>,
    <svg key="call" width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.92857 0C1.41708 0 0.926543 0.203188 0.564865 0.564866C0.203188 0.926543 0 1.41708 0 1.92857L0 12.8571C0 13.3686 0.203188 13.8592 0.564865 14.2208C0.926543 14.5825 1.41708 14.7857 1.92857 14.7857H16.0714C16.5829 14.7857 17.0735 14.5825 17.4351 14.2208C17.7968 13.8592 18 13.3686 18 12.8571V1.92857C18 1.41708 17.7968 0.926543 17.4351 0.564866C17.0735 0.203188 16.5829 0 16.0714 0H1.92857Z" fill="#1A80FF"/><path fillRule="evenodd" clipRule="evenodd" d="M18 2.36816L9.49243 8.04074C9.34392 8.13011 9.1733 8.17599 9 8.17316C8.8267 8.17599 8.65608 8.13011 8.50757 8.04074L0 2.36816V4.29931L7.62043 9.38045L7.62686 9.38559C8.03186 9.64916 8.51786 9.78031 9 9.78031C9.48214 9.78031 9.96814 9.64916 10.3731 9.38559L18 4.29931V2.36816Z" fill="white"/></svg>,
    <svg key="sms" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.89069 1.72706C4.99034 1.64832 5.0735 1.55073 5.13543 1.43985C5.19736 1.32898 5.23685 1.20699 5.25164 1.08085C5.26643 0.954712 5.25622 0.826897 5.22161 0.704702C5.187 0.582508 5.12867 0.468327 5.04993 0.368678C4.97119 0.26903 4.8736 0.185866 4.76272 0.123934C4.65184 0.0620017 4.52986 0.022515 4.40372 0.00772817C4.27758 -0.0070587 4.14977 0.00314376 4.02757 0.0377532C3.90538 0.0723626 3.7912 0.130701 3.69155 0.209438C2.56191 1.11157 1.65228 2.25886 1.03152 3.56445C0.383539 4.92063 0.0318957 6.39929 0 7.90199C0.0392146 9.38806 0.392053 10.8491 1.03539 12.1892C1.65869 13.4962 2.57251 14.6433 3.70702 15.543C3.90897 15.699 4.16444 15.7689 4.41772 15.7374C4.671 15.7059 4.90156 15.5756 5.05913 15.3748C5.2167 15.174 5.2885 14.9191 5.25888 14.6656C5.22926 14.412 5.10062 14.1805 4.901 14.0215C3.99824 13.3041 3.27141 12.3898 2.77607 11.3486C2.25565 10.2623 1.96882 9.07892 1.9341 7.87491C1.97278 6.65643 2.2616 5.46889 2.7735 4.40385C3.26743 3.36278 3.99137 2.44749 4.89069 1.72706ZM7.59069 4.37548C7.69567 4.30394 7.78553 4.21243 7.85515 4.10616C7.92476 3.99989 7.97276 3.88095 7.99641 3.75613C8.02006 3.63131 8.01889 3.50305 7.99297 3.37868C7.96705 3.25431 7.91688 3.13627 7.84534 3.03129C7.7738 2.9263 7.68229 2.83644 7.57602 2.76683C7.46975 2.69721 7.35081 2.64921 7.22599 2.62557C7.10117 2.60192 6.97291 2.60309 6.84854 2.62901C6.72417 2.65493 6.60613 2.70509 6.50115 2.77663C5.66412 3.34529 4.97103 4.10107 4.47679 4.98408C3.97573 5.88092 3.70131 6.88656 3.67736 7.91359C3.71186 8.91702 3.98597 9.89762 4.47679 10.7735C4.96805 11.6516 5.66304 12.4046 6.50373 12.9745C6.71612 13.1157 6.97574 13.1674 7.22602 13.1181C7.47631 13.0688 7.69699 12.9227 7.84001 12.7115C7.98304 12.5003 8.03682 12.2411 7.98963 11.9904C7.94245 11.7397 7.79813 11.5178 7.58811 11.373C6.99985 10.976 6.51241 10.447 6.16461 9.82835C5.82977 9.23185 5.64026 8.56481 5.61146 7.88136C5.64026 7.19529 5.8302 6.52565 6.1659 5.92663C6.51396 5.30597 7.00177 4.7749 7.59069 4.37548ZM10.1553 3.03193C10.2996 2.81991 10.5222 2.67391 10.7742 2.62603C11.0262 2.57815 11.2868 2.63232 11.4989 2.77663C12.3359 3.34529 13.029 4.10107 13.5232 4.98408C14.0243 5.88092 14.2987 6.88656 14.3226 7.91359C14.2884 8.91706 14.0143 9.89773 13.5232 10.7735C13.0282 11.655 12.3341 12.4086 11.4963 12.9745C11.2839 13.1157 11.0243 13.1674 10.774 13.1181C10.5237 13.0688 10.303 12.9227 10.16 12.7115C10.017 12.5003 9.96318 12.2411 10.0104 11.9904C10.0575 11.7397 10.2019 11.5178 10.4119 11.373C11.0002 10.976 11.4876 10.447 11.8354 9.82835C12.1696 9.23157 12.359 8.5647 12.3885 7.88136C12.3597 7.19529 12.1698 6.52565 11.8341 5.92663C11.486 5.30597 10.9982 4.7749 10.4093 4.37548C10.1975 4.23097 10.0518 4.00825 10.0041 3.7563C9.95649 3.50435 10.0109 3.2438 10.1553 3.03193ZM14.3072 0.208148C14.2074 0.129412 14.0932 0.0710899 13.9709 0.0365129C13.8486 0.00193589 13.7207 -0.00821919 13.5945 0.00662754C13.4683 0.0214743 13.3463 0.061032 13.2354 0.123042C13.1245 0.185052 13.0269 0.268301 12.9481 0.368034C12.8694 0.467767 12.8111 0.582032 12.7765 0.704304C12.7419 0.826577 12.7318 0.954463 12.7466 1.08066C12.7615 1.20686 12.801 1.32889 12.863 1.4398C12.925 1.55071 13.0083 1.64832 13.108 1.72706C14.008 2.44713 14.7325 3.36248 15.2265 4.40385C15.7446 5.48988 16.03 6.67215 16.0646 7.87491C16.0303 9.07882 15.7439 10.2622 15.2239 11.3486C14.7286 12.3898 14.0018 13.3041 13.099 14.0215C12.8994 14.1805 12.7707 14.412 12.7411 14.6656C12.7115 14.9191 12.7833 15.174 12.9409 15.3748C13.0984 15.5756 13.329 15.7059 13.5823 15.7374C13.8356 15.7689 14.091 15.699 14.293 15.543C15.4273 14.6437 16.3411 13.497 16.9646 12.1905C17.6155 10.8334 17.9686 9.35268 18 7.84783C17.9605 6.36348 17.6091 4.90405 16.9685 3.56445C16.3477 2.25886 15.4381 1.11157 14.3085 0.209438L14.3072 0.208148Z" fill="#1A80FF"/><path fillRule="evenodd" clipRule="evenodd" d="M8.99993 6.26367C8.57247 6.26367 8.16252 6.43348 7.86025 6.73574C7.55799 7.038 7.38818 7.44796 7.38818 7.87542C7.38818 8.30288 7.55799 8.71284 7.86025 9.0151C8.16252 9.31736 8.57247 9.48717 8.99993 9.48717C9.42739 9.48717 9.83735 9.31736 10.1396 9.0151C10.4419 8.71284 10.6117 8.30288 10.6117 7.87542C10.6117 7.44796 10.4419 7.038 10.1396 6.73574C9.83735 6.43348 9.42739 6.26367 8.99993 6.26367Z" fill="#1A80FF"/></svg>,
    <svg key="video" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.92857 0C1.41708 0 0.926543 0.203188 0.564865 0.564865C0.203188 0.926543 0 1.41708 0 1.92857L0 10.9286C0 11.4401 0.203188 11.9306 0.564865 12.2923C0.926543 12.654 1.41708 12.8571 1.92857 12.8571H11.5714C12.0829 12.8571 12.5735 12.654 12.9351 12.2923C13.2968 11.9306 13.5 11.4401 13.5 10.9286V9.97457L16.2077 11.1356C16.4035 11.2195 16.617 11.2535 16.8291 11.2344C17.0412 11.2154 17.2453 11.144 17.423 11.0266C17.6007 10.9092 17.7465 10.7495 17.8472 10.5618C17.9479 10.3741 18.0004 10.1644 18 9.95143V2.90443C18 2.69167 17.9472 2.48224 17.8463 2.29492C17.7454 2.1076 17.5996 1.94824 17.422 1.83113C17.2443 1.71403 17.0404 1.64283 16.8285 1.62394C16.6166 1.60504 16.4033 1.63903 16.2077 1.72286L13.5 2.88386V1.92857C13.5 1.41708 13.2968 0.926543 12.9351 0.564865C12.5735 0.203188 12.0829 0 11.5714 0H1.92857Z" fill="#1A80FF"/></svg>,
  ];

  return (
    <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-5 py-3 bg-white self-stretch">
      {icons.map((icon, i) => (
        <Fragment key={i}>
          {i > 0 && <div className="w-px h-9 bg-[#E2E8F0] rounded-full" />}
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
            <span className="text-[13px] leading-4 text-[#111827]">-</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function Dropdown({ value, options, onChange, disabled, wrapperClassName, optionPrices }: { value: string; options: string[]; onChange: (v: string) => void; disabled?: boolean; wrapperClassName?: string; optionPrices?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className={wrapperClassName ?? "relative flex-1"}>
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
            <button key={opt} className={`w-full px-3 py-2.5 text-sm cursor-pointer border-none flex items-center justify-between ${value === opt ? 'bg-[#E8F2FF]' : 'bg-white'}`} onClick={() => { onChange(opt); setOpen(false); }}>
              <span style={{ color: opt === '미적용' ? '#9CA3AF' : '#111827' }}>{opt}</span>
              {optionPrices?.[opt] !== undefined && <span className="text-sm text-[#9CA3AF] shrink-0">{optionPrices[opt]}</span>}
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

function SummaryRow({ label, value, showInfo = false, primary = false, valueClassName }: { label: string; value: string; showInfo?: boolean; primary?: boolean; valueClassName?: string }) {
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
      <span className={valueClassName ?? `text-sm ${primary ? 'font-semibold text-[#EF4444]' : 'text-text-dark'}`}>{value}</span>
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

function PencilIcon() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" className="shrink-0">
      <path d="M8.82139 1.00136C8.96709 0.842407 9.14007 0.716321 9.33044 0.630298C9.52081 0.544275 9.72485 0.5 9.9309 0.5C10.137 0.5 10.341 0.544275 10.5314 0.630298C10.7217 0.716321 10.8947 0.842407 11.0404 1.00136C11.1861 1.16031 11.3017 1.34901 11.3806 1.55669C11.4594 1.76436 11.5 1.98695 11.5 2.21174C11.5 2.43653 11.4594 2.65912 11.3806 2.8668C11.3017 3.07447 11.1861 3.26317 11.0404 3.42212L3.55117 11.5922L0.5 12.5L1.33214 9.17145L8.82139 1.00136Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" className="shrink-0">
      <path d="M8.29999 0C8.57608 0 8.79993 0.224154 8.80018 0.500188V1.19967H10.1005C11.0391 1.19981 11.7999 1.96095 11.8003 2.89953V11.3001C11.8003 12.2391 11.0394 12.9999 10.1005 13H1.69986C0.761018 12.9998 0 12.239 0 11.3001V2.89953C0.00039812 1.96098 0.761263 1.19987 1.69986 1.19967H2.99917V0.500188C2.99942 0.224313 3.22349 0.000257117 3.49936 0C3.77545 0 3.9993 0.224155 3.99955 0.500188V1.19967H7.7998V0.500188C7.80005 0.22419 8.02395 5.8683e-05 8.29999 0ZM1.00038 5.80101V11.3001C1.00038 11.6865 1.31351 11.9994 1.69986 11.9996H10.1005C10.4869 11.9995 10.8 11.6866 10.8 11.3001V5.80101H1.00038ZM1.69986 2.20005C1.31376 2.20024 1.00077 2.51347 1.00038 2.89953V4.80063H10.8V2.89953C10.7996 2.51344 10.4866 2.20019 10.1005 2.20005H8.80018V2.9005C8.80005 3.17664 8.57616 3.40069 8.29999 3.40069C8.02388 3.40063 7.79993 3.1766 7.7998 2.9005V2.20005H3.99955V2.9005C3.99942 3.17664 3.77553 3.40069 3.49936 3.40069C3.22341 3.40043 2.9993 3.17648 2.99917 2.9005V2.20005H1.69986Z" fill="#9CA3AF"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
