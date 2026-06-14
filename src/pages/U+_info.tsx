import { useState, useRef, useEffect, ReactNode, Fragment } from 'react';
import { ConsultingStep } from '../contexts/ConsultingTabsContext';
import Iphone17eImg from '../images/Iphone17e.svg';
import KBCardImg    from '../images/KB Card.svg';
import QRCardImg    from '../images/qr-card.svg';
import BadgeApplePay   from '../images/badge-applepay.svg';
import BadgeFaceId     from '../images/badge-faceid.svg';
import BadgeWaterproof from '../images/badge-waterproof.svg';
import WiredChargeIcon from '../images/wired_charge.svg';
import UsimIcon        from '../images/usim.svg';
import ExampleImg      from '../images/example.png';

interface DeviceColor { name: string; hex: string; }
interface Device { id: string; brand: string; name: string; model: string; price: string; colors: DeviceColor[]; }

const DEVICES: Device[] = [
  { id: 'iphone-17e',        brand: 'Apple',   name: '아이폰 17e',         model: 'IP17E_256GB',        price: '990,000원',
    colors: [{ name: '소프트핑크', hex: '#F2B8C6' }, { name: '화이트', hex: '#F5F5F0' }, { name: '블랙', hex: '#1C1C1E' }] },
  { id: 'iphone-17-pro-max', brand: 'Apple',   name: '아이폰 17 Pro Max',  model: 'IP17PROMAX_256GB',   price: '1,890,000원',
    colors: [{ name: '네추럴 티타늄', hex: '#C5B9A8' }, { name: '블랙 티타늄', hex: '#4A4A4C' }, { name: '화이트 티타늄', hex: '#F5F5EF' }] },
  { id: 'iphone-17-pro',     brand: 'Apple',   name: '아이폰 17 Pro',      model: 'IP17PRO_256GB',      price: '1,690,000원',
    colors: [{ name: '네추럴 티타늄', hex: '#C5B9A8' }, { name: '블랙 티타늄', hex: '#4A4A4C' }, { name: '화이트 티타늄', hex: '#F5F5EF' }] },
  { id: 'iphone-17',         brand: 'Apple',   name: '아이폰 17',          model: 'IP17_128GB',         price: '1,390,000원',
    colors: [{ name: '울트라마린', hex: '#5B7EB5' }, { name: '화이트', hex: '#FAFAFA' }, { name: '블랙', hex: '#1C1C1E' }, { name: '핑크', hex: '#F5BDD2' }] },
  { id: 'iphone-16-pro-max', brand: 'Apple',   name: '아이폰 16 Pro Max',  model: 'IP16PROMAX_256GB',   price: '1,750,000원',
    colors: [{ name: '내추럴 티타늄', hex: '#C5B9A8' }, { name: '블랙 티타늄', hex: '#4A4A4C' }, { name: '사막 티타늄', hex: '#C8A882' }] },
  { id: 'iphone-16-pro',     brand: 'Apple',   name: '아이폰 16 Pro',      model: 'IP16PRO_128GB',      price: '1,550,000원',
    colors: [{ name: '내추럴 티타늄', hex: '#C5B9A8' }, { name: '블랙 티타늄', hex: '#4A4A4C' }, { name: '화이트 티타늄', hex: '#F5F5EF' }] },
  { id: 'galaxy-s25-ultra',  brand: 'Samsung', name: '갤럭시 S25 Ultra',   model: 'SM-S938N_256GB',     price: '1,900,000원',
    colors: [{ name: '티타늄 실버블루', hex: '#A8B8CC' }, { name: '티타늄 블랙', hex: '#3A3A3C' }, { name: '티타늄 화이트', hex: '#E8E8E0' }] },
  { id: 'galaxy-s25-plus',   brand: 'Samsung', name: '갤럭시 S25+',        model: 'SM-S936N_256GB',     price: '1,500,000원',
    colors: [{ name: '아이시 블루', hex: '#B8CAD8' }, { name: '민트', hex: '#B8D4CC' }, { name: '블랙', hex: '#1C1C1E' }] },
  { id: 'galaxy-s25',        brand: 'Samsung', name: '갤럭시 S25',         model: 'SM-S931N_256GB',     price: '1,200,000원',
    colors: [{ name: '아이시 블루', hex: '#B8CAD8' }, { name: '민트', hex: '#B8D4CC' }, { name: '블랙', hex: '#1C1C1E' }, { name: '실버 섀도우', hex: '#C8C8D0' }] },
  { id: 'galaxy-z-fold7',    brand: 'Samsung', name: '갤럭시 Z Fold7',     model: 'SM-F966N_256GB',     price: '2,200,000원',
    colors: [{ name: '크림 화이트', hex: '#F5F0E8' }, { name: '블랙', hex: '#1C1C1E' }, { name: '실버 블루', hex: '#A8B8CC' }] },
  { id: 'galaxy-z-flip7',    brand: 'Samsung', name: '갤럭시 Z Flip7',     model: 'SM-F747N_256GB',     price: '1,400,000원',
    colors: [{ name: '블루 민트', hex: '#A0C8C0' }, { name: '화이트', hex: '#F5F5F0' }, { name: '블랙', hex: '#1C1C1E' }, { name: '핑크', hex: '#F2B8C6' }] },
  { id: 'galaxy-s24-fe',     brand: 'Samsung', name: '갤럭시 S24 FE',      model: 'SM-S721N_128GB',     price: '900,000원',
    colors: [{ name: '블루', hex: '#7090C0' }, { name: '화이트', hex: '#F5F5F0' }, { name: '그래파이트', hex: '#5C5C64' }, { name: '민트', hex: '#B8D4CC' }] },
];

const CARRIER_LABELS: Record<string, string> = { skt: 'SKT', kt: 'KT', lgu: 'LG U+' };

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
  const [가입유형, set가입유형]           = useState('신규가입');
  const [약정기간, set약정기간]           = useState('24개월');
  const [할부개월, set할부개월]           = useState('24개월');
  const [유심, set유심]                   = useState('미적용');
  const [프로그램, set프로그램]           = useState('식스플랜');
  const [추가지원금입력, set추가지원금입력] = useState('');
  const [현금납부입력, set현금납부입력]     = useState('');
  const [프로모션입력, set프로모션입력]     = useState('');
  const [포인트할인입력, set포인트할인입력]   = useState('');
  const [서식지ModalOpen, set서식지ModalOpen]             = useState(false);
  const [기기변경서식지ModalOpen, set기기변경서식지ModalOpen]   = useState(false);
  const [번호이동서식지ModalOpen, set번호이동서식지ModalOpen]   = useState(false);
  const [약정할인ModalOpen, set약정할인ModalOpen] = useState(false);
  const [약정할인적용, set약정할인적용]       = useState(false);
  const [가족할인ModalOpen, set가족할인ModalOpen] = useState(false);
  const [가족할인적용, set가족할인적용]       = useState(false);
  const [복지할인ModalOpen, set복지할인ModalOpen] = useState(false);
  const [복지할인선택, set복지할인선택]       = useState('미적용');
  const [현역병사ModalOpen, set현역병사ModalOpen] = useState(false);
  const [현역병사적용, set현역병사적용]       = useState(false);
  const [선할인카드ModalOpen, set선할인카드ModalOpen] = useState(false);
  const [선할인카드적용, set선할인카드적용]       = useState(false);
  const [청구할인카드ModalOpen, set청구할인카드ModalOpen] = useState(false);
  const [청구할인카드적용, set청구할인카드적용]       = useState(false);
  const [개통대기ModalOpen, set개통대기ModalOpen] = useState(false);
  const [개통대기등록됨, set개통대기등록됨] = useState(false);
  const [보험Modal, set보험Modal]         = useState('');
  const [부가서비스List, set부가서비스List] = useState<string[]>(['']);

  const add부가서비스 = () => set부가서비스List(prev => [...prev, '']);
  const remove부가서비스 = (idx: number) => set부가서비스List(prev => prev.filter((_, i) => i !== idx));
  const [보험ModalOpen, set보험ModalOpen]     = useState(false);
  const [부가서비스ModalIdx, set부가서비스ModalIdx] = useState<number | null>(null);
  const [변경요금제, set변경요금제]           = useState('변경할 요금제');
  const [변경요금제ModalOpen, set변경요금제ModalOpen] = useState(false);

  // 요금제 선택 모달
  const [planModalOpen, setPlanModalOpen]   = useState(false);
  const [selectedPlan, setSelectedPlan]     = useState('lgu-03');
  const [planSearch, setPlanSearch]         = useState('');
  const [planCategory, setPlanCategory]     = useState('전체');
  const [planSortOpen, setPlanSortOpen]     = useState(false);
  const [planSort, setPlanSort]             = useState('높은 가격 순');
  const planSortRef                         = useRef<HTMLDivElement>(null);
  const [planFavorites, setPlanFavorites]   = useState<Set<string>>(new Set());
  const togglePlanFavorite = (id: string) => setPlanFavorites(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

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

  // ─── 1단계: 단말기 할부 계산 ───────────────────────────────────────────────
  const 출고가수       = parseInt(device.price.replace(/[^0-9]/g, '')) || 0;
  const 포인트할인수   = parseInt(포인트할인입력)  || 0;
  const 유통망지원금수 = parseInt(추가지원금입력)  || 0;
  const 현금납부수     = parseInt(현금납부입력)    || 0;
  const 할부개월수     = parseInt(할부개월)        || 24;
  const 공통지원금수   = planTab === '공통지원금' ? (parseInt(MOCK_PLANS.find(p => p.id === selectedPlan)?.support?.replace(/[^0-9]/g, '') ?? '0') || 0) : 0;

  const 할부원금 = Math.max(0, 출고가수 - (공통지원금수 + 유통망지원금수 + 현금납부수 + 포인트할인수));
  const 월이자율 = 0.059 / 12;
  const 월단말할부금수 = (() => {
    if (할부개월수 <= 0 || 할부원금 <= 0) return 0;
    // 원리금 균등 공식: P × r / (1 − (1+r)^−n)  ← 부동소수점 오차 최소화
    return Math.floor(할부원금 * 월이자율 / (1 - Math.pow(1 + 월이자율, -할부개월수)));
  })();
  const 총할부수수료 = Math.max(0, 월단말할부금수 * 할부개월수 - 할부원금);

  // ─── 2단계: 통신 요금 파이프라인 (U+ 12단계) ──────────────────────────────
  const 요금제기본료수 = (() => {
    const plan = MOCK_PLANS.find(p => p.id === selectedPlan);
    return plan ? parseInt(plan.monthly.replace(/[^0-9]/g, '')) : 0;
  })();
  const 프로모션수     = parseInt(프로모션입력) || 0;

  let 계산요금 = 요금제기본료수;

  // ① 복지할인 — 기초생활(생계/의료·주거/교육), 차상위 (정액)
  if      (복지할인선택 === '기초생활수급자 (생계/의료)')  계산요금 -= 28650;
  else if (복지할인선택 === '기초생활수급자 (주거/교육)')  계산요금 -= 23650;
  else if (복지할인선택 === '차상위계층')                   계산요금 -= 23650;

  // ② 결합할인: 미구현 (0원)

  // ③ 복지할인 — 장애인·국가유공자 (기본료 × 35%, 월 최대 23,100원 한도)
  const 유공자장애인여부 = 복지할인선택 === '장애인' || 복지할인선택 === '국가유공자';
  if (유공자장애인여부)
    계산요금 -= Math.min(Math.round(요금제기본료수 * 0.35), 23100);

  // ④ 오퍼성 정률 할인: 미구현 (0원)

  // ⑤ 정액 할인 — 프로모션 입력값
  계산요금 -= 프로모션수;

  // ⑥ 프리미어 요금제 약정할인 (고정 5,250원)
  if (약정할인적용) 계산요금 -= 5250;

  // ⑦ 군인할인 (잔여요금 × 20%) — 장애인·국가유공자와 중복 불가
  if (현역병사적용 && !유공자장애인여부)
    계산요금 = Math.round(계산요금 * 0.8);

  // ⑧ 선택약정할인 — 공시지원금 미적용 시만 작동 (기본료 × 25%)
  if (planTab === '선택약정할인')
    계산요금 -= Math.round(요금제기본료수 * 0.25);

  // ⑨ 생애최초 할인: 미구현 (0원)

  // ⑩ 복지할인 — 기초연금수급자 (기본료 × 50%, 월 최대 12,100원 한도)
  if (복지할인선택 === '기초연금수급자(만 65세 이상)')
    계산요금 -= Math.min(Math.round(요금제기본료수 * 0.5), 12100);

  // ⑪ 플러스플랜130 가족할인 (고정 33,000원)
  if (가족할인적용) 계산요금 -= 33000;

  // ⑫ 장기고객할인: 미구현 (0원)

  const 월요금수 = Math.max(0, 계산요금);

  // ─── 3단계: 부가서비스 / 유심 ──────────────────────────────────────────────
  const 유심가격표: Record<string, number> = { '미적용': 0, '기존 유심 사용': 0, '후납': 7700, '선납': 7700, '대납': 7700, 'eSIM 후납': 2750 };
  const 유심가입비수       = 유심가격표[유심] ?? 0;
  const getInsPrice        = (name: string) => { const f = MOCK_INSURANCES.find(i => i.name === name); return f ? parseInt(f.monthly.replace(/[^0-9]/g, '')) : 0; };
  const 보험가격수         = getInsPrice(보험Modal);
  const 부가서비스가격합수 = 부가서비스List.reduce((s, n) => s + getInsPrice(n), 0);
  const 월청구부가서비스수 = 보험가격수 + 부가서비스가격합수;

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
              <span className="text-base font-semibold text-text-dark">단말기 할인 정보</span>
              <span className="text-base font-semibold text-primary">(A)</span>
            </div>
            {/* Frame 717 */}
            <div className="flex w-[356px] h-11 py-2 px-3 items-center gap-1 border-r border-b border-[#E8ECF2] bg-[#F8F9FA]">
              <span className="text-base font-semibold text-text-dark">요금제 할인 정보</span>
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
                  <span className="text-[14px] text-[#6B7280] flex-1 truncate">{device.model}</span>
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
                      <span className="text-[14px] text-[#6B7280]">{selectedColor.name}</span>
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
              {/* 출고가 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">출고가</span>
                <div className="w-[236px] h-11 flex items-center justify-end gap-1 px-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-[14px] text-[#111827]">{출고가수.toLocaleString()}</span>
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
                  <span className="text-[14px] text-[#6B7280] flex-1 truncate text-left">{MOCK_PLANS.find(p => p.id === selectedPlan)?.name ?? ''}</span>
                  {/* Frame 643: 연필 아이콘 */}
                  <PencilIcon />
                </button>
              </div>
              {/* 변경 가능일자 — 오늘로부터 6개월 뒤 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">변경 가능일자</span>
                <div className="w-[236px] h-11 flex items-center justify-between px-3 border border-[#E2E8F0] rounded-lg bg-white" style={{ border: '1px solid #E2E8F0' }}>
                  <span className="text-[14px] text-[#6B7280]">{changeableDateStr}</span>
                  {/* Frame 643: 캘린더 아이콘 */}
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" className="shrink-0">
                    <rect x="0.5" y="1.5" width="11" height="11" rx="1.5" stroke="#9CA3AF" strokeWidth="1"/>
                    <path d="M0.5 5.5H11.5" stroke="#9CA3AF" strokeWidth="1"/>
                    <path d="M3.5 0.5V2.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M8.5 0.5V2.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              {/* 월 기본료 */}
              <div className="flex items-center gap-2 w-full h-11">
                <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">월 기본료</span>
                <div className="w-[236px] h-11 flex items-center justify-end gap-1 px-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-[14px] text-[#111827]">{요금제기본료수.toLocaleString()}</span>
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
                  className={`flex-1 flex justify-center items-center self-stretch rounded-lg border-none cursor-pointer text-sm font-medium leading-4
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
                  <Dropdown value={프로그램} options={['식스플랜', '베이직플랜']} onChange={set프로그램} disabled={planTab !== '공통지원금'} />
                </div>
                <div className="flex items-center gap-2 h-11 min-w-0">
                  <span className="w-[88px] shrink-0 text-[14px] text-[#6B7280]">공통지원금</span>
                  <div className={`flex-1 min-w-0 h-11 flex items-center justify-end px-3 gap-1 rounded-lg border border-[#E2E8F0] ${planTab === '공통지원금' ? 'bg-white' : 'bg-[#F8F9FA]'}`}>
                    <span className={`text-[14px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>-</span>
                    <span className={`text-[14px] ${planTab === '공통지원금' ? 'text-[#5AAAFF]' : 'text-[#9CA3AF]'}`}>{공통지원금수.toLocaleString()}</span>
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
            {/* Frame 721: FIXED 356px, FILL vertical, py-5 px-3, justify-between */}
            <div className="flex-1 self-stretch bg-white border-r border-input-border px-3 py-5 flex flex-col justify-between items-center">
              <div className="flex flex-col gap-4 self-stretch">
                <FormRow label="할부개월"><Dropdown value={할부개월} options={['6개월', '12개월', '18개월', '24개월', '30개월', '36개월', '48개월']} onChange={set할부개월} /></FormRow>
                <FormRow label="유통망지원금"><NegativeInputField value={추가지원금입력} onChange={set추가지원금입력} /></FormRow>
                <FormRow label="현금납부"><NegativeInputField value={현금납부입력} onChange={set현금납부입력} /></FormRow>
                <FormRow label="선할인카드">
                  <div onClick={() => set선할인카드ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                    <span className={`text-sm ${선할인카드적용 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{선할인카드적용 ? '적용' : '미적용'}</span>
                  </div>
                </FormRow>
                <FormRow label="포인트할인"><NegativeInputField value={포인트할인입력} onChange={set포인트할인입력} /></FormRow>
              </div>
              {/* Frame 750: pad=16/12, gap=12, bg=#F8F9FA, border */}
              <div className="h-[116px] py-4 px-3 bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col items-start gap-3 self-stretch">
                <SummaryRow label="할부원금" value={`${Math.max(0, 할부원금).toLocaleString('ko-KR')}원`} />
                <SummaryRow label="할부수수료" value={`${총할부수수료.toLocaleString('ko-KR')}원`} showInfo />
                <SummaryRow label="월 단말 할부금" value={`${월단말할부금수.toLocaleString('ko-KR')}원`} primary />
              </div>
            </div>
            {/* Frame 722: FIXED 356px, FILL vertical, py-5 px-3 gap-4 */}
            <div className="flex-1 self-stretch bg-white px-3 py-5 flex flex-col gap-4">
              <FormRow label="프리미어 요금제 약정할인" labelSize="text-[13px]" labelWidth="w-[88px]">
                <div onClick={() => set약정할인ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                  <span className={`text-sm ${약정할인적용 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{약정할인적용 ? '적용' : '미적용'}</span>
                </div>
              </FormRow>
              <FormRow label="플러스플랜 130 가족 할인">
                <div onClick={() => set가족할인ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                  <span className={`text-sm ${가족할인적용 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{가족할인적용 ? '적용' : '미적용'}</span>
                </div>
              </FormRow>
              <FormRow label="결합할인"><StaticField /></FormRow>
              <FormRow label="복지할인">
                <div onClick={() => set복지할인ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                  <span className={`text-sm ${복지할인선택 === '미적용' ? 'text-[#9CA3AF]' : 'text-[#111827]'}`}>{복지할인선택}</span>
                </div>
              </FormRow>
              <FormRow label="현역병사혜택">
                <div onClick={() => set현역병사ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                  <span className={`text-sm ${현역병사적용 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{현역병사적용 ? '적용' : '미적용'}</span>
                </div>
              </FormRow>
              <FormRow label="청구할인카드">
                <div onClick={() => set청구할인카드ModalOpen(true)} className="flex-1 h-11 flex items-center justify-end px-3 rounded-lg border border-input-border bg-white cursor-pointer">
                  <span className={`text-sm ${청구할인카드적용 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{청구할인카드적용 ? '적용' : '미적용'}</span>
                </div>
              </FormRow>
              <FormRow label="프로모션"><NegativeInputField value={프로모션입력} onChange={set프로모션입력} /></FormRow>
              {/* Frame 750: pad=16/12, gap=12, bg=#F8F9FA, border-t/b only */}
              <div className="h-[116px] py-4 px-3 bg-[#F8F9FA] border-t border-b border-[#E2E8F0] flex flex-col justify-end">
                <SummaryRow label="월 요금" value={`${월요금수.toLocaleString('ko-KR')}원`} primary />
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
                <span className="text-sm text-[#111827]">{유심가입비수.toLocaleString('ko-KR')}원</span>
              </div>
            </div>

            {/* 보험: label(88px) + 버튼(236px) + 가격(136px) + 날짜(136px) */}
            <div className="flex items-center gap-2 self-stretch">
              <span className="w-[88px] shrink-0 text-sm text-[#6B7280]">보험</span>
              <button
                onClick={() => set보험ModalOpen(true)}
                className="w-[236px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
              >
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
                <button
                  onClick={() => set부가서비스ModalIdx(idx)}
                  className="w-[236px] shrink-0 h-11 flex items-center justify-between py-3 pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
                >
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
              <SummaryRow label="유심가입비" value={`${유심가입비수.toLocaleString('ko-KR')}원`} />
              <SummaryRow label="월 청구 부가서비스 요금(보험, 부가서비스)" value={`${월청구부가서비스수.toLocaleString('ko-KR')}원`} valueClassName="text-base font-semibold text-[#EF4444]" />
            </div>

          </div>
        </div>

      </div>

      {/* ── Frame 819: 우측 컬럼 344px ── */}
      <div className="w-[344px] flex flex-col gap-6">

        {/* Frame 818: 개통 진행 + 초기화 */}
        <div className="flex flex-col gap-3">
          {/* Frame 736: 진행 상태 카드 */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex flex-col gap-5 py-5 px-3 bg-white">
              {/* Frame 1041: 제목 + 상태 chips */}
              <div className="flex items-center gap-2 h-10">
                <span className="text-[16px] font-semibold text-[#111827]">진행 상태</span>
                {/* Frame 1046: status chips */}
                <div className="flex items-center gap-1 py-[2px]">
                  <div className="flex items-center px-2 py-1 bg-[#1A80FF] rounded-full">
                    <span className="text-[12px] font-medium text-white">상담</span>
                  </div>
                  <div className="w-3 h-px bg-[#9CA3AF]" />
                  <div className="flex items-center px-2 py-1 bg-[#F8F9FA] rounded-full">
                    <span className="text-[12px] text-[#6B7280]">개통 대기</span>
                  </div>
                  <div className="w-3 h-px bg-[#9CA3AF]" />
                  <div className="flex items-center px-2 py-1 bg-[#F8F9FA] rounded-full">
                    <span className="text-[12px] text-[#6B7280]">완료</span>
                  </div>
                </div>
              </div>
              {/* Frame 1047: task list */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-between px-2 py-3 bg-[#F8F9FA] rounded-lg h-11 cursor-pointer w-full border-none"
                  onClick={() => {
                    if (planTab === '선택약정할인' && 가입유형 === '기기변경') set기기변경서식지ModalOpen(true);
                    else if (planTab === '선택약정할인' && 가입유형 === '번호이동') set번호이동서식지ModalOpen(true);
                    else set서식지ModalOpen(true);
                  }}
                >
                  <span className="text-[14px] text-[#111827]">1. 서식지(통신사 서식) 출력</span>
                  <div className="flex items-center">
                    <span className="text-[12px] text-[#1A80FF]">완료</span>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                        <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </button>
                <div className="flex items-center justify-between px-2 py-3 bg-[#F8F9FA] rounded-lg h-11">
                  <span className="text-[14px] text-[#111827]">2. 개통 안내서</span>
                  <div className="flex items-center">
                    <span className="text-[12px] text-[#9CA3AF]">미완료</span>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                        <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Primary_Button: 개통 대기 등록 / 취소 */}
              <button
                onClick={() => 개통대기등록됨 ? set개통대기등록됨(false) : set개통대기ModalOpen(true)}
                className={`w-full h-12 flex items-center justify-center text-[16px] font-medium rounded-lg border-none cursor-pointer ${개통대기등록됨 ? 'bg-[#F8F9FA] text-[#9CA3AF]' : 'bg-[#E8F2FF] text-[#5AAAFF]'}`}
              >
                {개통대기등록됨 ? '개통 대기 취소' : '개통 대기 등록'}
              </button>
            </div>
          </div>
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
                  <span className="text-sm leading-4 text-[#6B7280]">{(월단말할부금수 + 월요금수 + 월청구부가서비스수 + 유심가입비수).toLocaleString()}</span>
                  <span className="text-[12px] leading-4 text-[#6B7280]">원</span>
                </span>
              </div>
              <div className="flex items-center justify-between h-5">
                <span className="text-sm leading-5 text-[#6B7280]">월별 예상 청구 금액</span>
                <span className="flex items-center">
                  <span className="text-base leading-5 font-semibold text-[#EF4444]">{(월단말할부금수 + 월요금수 + 월청구부가서비스수).toLocaleString()}</span>
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
                  <span className="text-sm flex-1 truncate text-left" style={{ color: 변경요금제 === '변경할 요금제' ? '#9CA3AF' : '#111827' }}>{MOCK_PLANS.find(p => p.id === 변경요금제)?.name ?? 변경요금제}</span>
                  <PencilIcon />
                </button>
              </div>
              <div className="flex items-center gap-2 h-11">
                <span className="w-[76px] shrink-0 text-sm text-[#6B7280]">월 기본료</span>
                <div className="w-[236px] shrink-0 h-11 flex items-center justify-end pl-3 pr-2 bg-[#F8F9FA] rounded-lg">
                  {(() => {
                    const plan = MOCK_PLANS.find(p => p.id === 변경요금제);
                    return plan ? (
                      <>
                        <span className="text-sm text-[#111827]">{plan.monthly.replace('원', '')}</span>
                        <span className="text-[12px] text-[#111827]">원</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-[#111827]">-</span>
                        <span className="text-[12px] text-[#111827]">원</span>
                      </>
                    );
                  })()}
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
        favorites={planFavorites}
        onToggleFavorite={togglePlanFavorite}
      />
    )}
    {/* ── 보험 선택 모달 ── */}
    {보험ModalOpen && (
      <InsuranceSelectModal
        title="보험"
        selectedInsurance={보험Modal}
        onSelect={(ins: string) => { set보험Modal(ins); set보험ModalOpen(false); }}
        onClose={() => set보험ModalOpen(false)}
      />
    )}
    {/* ── 부가서비스 선택 모달 ── */}
    {부가서비스ModalIdx !== null && (
      <InsuranceSelectModal
        title="부가서비스"
        selectedInsurance={부가서비스List[부가서비스ModalIdx] ?? ''}
        onSelect={(ins: string) => {
          set부가서비스List(prev => prev.map((v, i) => i === 부가서비스ModalIdx ? ins : v));
          set부가서비스ModalIdx(null);
        }}
        onClose={() => set부가서비스ModalIdx(null)}
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
        favorites={planFavorites}
        onToggleFavorite={togglePlanFavorite}
      />
    )}
    {/* ── 서식지 출력 모달 ── */}
    {서식지ModalOpen && (
      <서식지Modal
        가입유형={가입유형}
        onClose={() => set서식지ModalOpen(false)}
      />
    )}
    {/* ── 서식지 출력 모달 (선택약정할인 기기변경) ── */}
    {기기변경서식지ModalOpen && (
      <서식지Modal
        가입유형="기기변경"
        onClose={() => set기기변경서식지ModalOpen(false)}
      />
    )}
    {/* ── 서식지 출력 모달 (선택약정할인 번호이동) ── */}
    {번호이동서식지ModalOpen && (
      <서식지Modal
        가입유형="번호이동"
        onClose={() => set번호이동서식지ModalOpen(false)}
      />
    )}
    {/* ── 프리미어 요금제 약정할인 모달 ── */}
    {약정할인ModalOpen && (
      <약정할인Modal
        onApply={() => { set약정할인적용(true); set약정할인ModalOpen(false); }}
        onReset={() => { set약정할인적용(false); set약정할인ModalOpen(false); }}
        onClose={() => set약정할인ModalOpen(false)}
      />
    )}
    {/* ── 플러스플랜 130 가족할인 모달 ── */}
    {가족할인ModalOpen && (
      <가족할인Modal
        onApply={() => { set가족할인적용(true); set가족할인ModalOpen(false); }}
        onReset={() => { set가족할인적용(false); set가족할인ModalOpen(false); }}
        onClose={() => set가족할인ModalOpen(false)}
      />
    )}
    {/* ── 복지할인 모달 ── */}
    {복지할인ModalOpen && (
      <복지할인Modal
        selected={복지할인선택}
        onApply={(v) => { set복지할인선택(v); set복지할인ModalOpen(false); }}
        onClose={() => set복지할인ModalOpen(false)}
      />
    )}
    {/* ── 현역병사혜택 모달 ── */}
    {현역병사ModalOpen && (
      <현역병사Modal
        onApply={() => { set현역병사적용(true); set현역병사ModalOpen(false); }}
        onReset={() => { set현역병사적용(false); set현역병사ModalOpen(false); }}
        onClose={() => set현역병사ModalOpen(false)}
      />
    )}
    {/* ── 선할인카드 모달 ── */}
    {선할인카드ModalOpen && (
      <카드할인Modal
        title="선할인카드"
        onApply={() => { set선할인카드적용(true); set선할인카드ModalOpen(false); }}
        onReset={() => { set선할인카드적용(false); set선할인카드ModalOpen(false); }}
        onClose={() => set선할인카드ModalOpen(false)}
      />
    )}
    {/* ── 청구할인카드 모달 ── */}
    {청구할인카드ModalOpen && (
      <카드할인Modal
        title="청구할인카드"
        onApply={() => { set청구할인카드적용(true); set청구할인카드ModalOpen(false); }}
        onReset={() => { set청구할인카드적용(false); set청구할인카드ModalOpen(false); }}
        onClose={() => set청구할인카드ModalOpen(false)}
      />
    )}
    {/* ── 개통 대기 확인 모달 ── */}
    {개통대기ModalOpen && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => set개통대기ModalOpen(false)}>
        <div className="w-[400px] bg-white rounded-xl p-5 flex flex-col items-end gap-5" onClick={e => e.stopPropagation()}>
          {/* Frame 400: 텍스트 (self-stretch) */}
          <div className="flex flex-col gap-1 self-stretch">
            <span className="text-[20px] font-semibold text-[#111827]">이 상담을 개통 대기로 등록할까요?</span>
            <span className="text-[14px] text-[#6B7280]">등록하면 개통 대기 목록으로 넘어갑니다. 고객 개통이 완료된 뒤 승인하면 자동으로 기록에 남습니다.</span>
          </div>
          {/* Frame 417: 버튼 오른쪽 정렬 */}
          <div className="flex items-center gap-2">
            <button onClick={() => set개통대기ModalOpen(false)} className="text-[14px] text-[#9CA3AF] bg-transparent border-none cursor-pointer p-0">취소</button>
            <button onClick={() => { set개통대기등록됨(true); set개통대기ModalOpen(false); }} className="text-[14px] text-[#5AAAFF] bg-transparent border-none cursor-pointer p-0">등록</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 요금제 목록 데이터 (Figma 기준 컬럼)
// ─────────────────────────────────────────────────────────────
const PLAN_CATEGORIES = ['전체','일반','키즈','청소년','청년(유쓰)','시니어','외국인','외국인 청년','복지','LTE','태블릿/스마트워치','듀얼넘버'];
const PLAN_SORT_OPTIONS = ['높은 가격 순','낮은 가격 순','즐겨찾기'];

// ── 요금제 타입 (서버 API 응답 구조에 맞춰 교체 예정) ──
export interface PlanItem {
  id: string;
  name: string;       // 요금제명
  monthly: string;    // 월정액 (표시용 문자열, e.g. "79,000원")ㄱㄱ
  support: string;    // 이통사지원금
  call: string;       // 통화
  sms: string;        // 문자
  addCall: string;    // 부가통화
  data: string;       // 데이터
}

// TODO: 실제 서버 API 호출로 교체 — fetchPlans(carrier, category)
const MOCK_PLANS: PlanItem[] = [
  { id: 'lgu-01', name: '5G 프리미어 슈퍼',     monthly: '125,000원', support: '800,000원', call: '무제한', sms: '무제한', addCall: '300분', data: '무제한' },
  { id: 'lgu-02', name: '5G 프리미어 플러스',   monthly: '110,000원', support: '700,000원', call: '무제한', sms: '무제한', addCall: '300분', data: '무제한' },
  { id: 'lgu-03', name: '5G 프리미어 에센셜',   monthly: '95,000원',  support: '570,000원', call: '무제한', sms: '무제한', addCall: '300분', data: '150GB + 5Mbps' },
  { id: 'lgu-04', name: '5G 프리미어 레귤러',   monthly: '85,000원',  support: '480,000원', call: '무제한', sms: '무제한', addCall: '300분', data: '90GB + 5Mbps' },
  { id: 'lgu-05', name: '5G 스탠다드+',         monthly: '79,000원',  support: '420,000원', call: '무제한', sms: '무제한', addCall: '200분', data: '50GB + 1Mbps' },
  { id: 'lgu-06', name: '5G 스탠다드',          monthly: '75,000원',  support: '380,000원', call: '무제한', sms: '무제한', addCall: '200분', data: '35GB + 1Mbps' },
  { id: 'lgu-07', name: '5G 슬림+',             monthly: '65,000원',  support: '300,000원', call: '무제한', sms: '무제한', addCall: '100분', data: '25GB + 1Mbps' },
  { id: 'lgu-08', name: '5G 슬림',              monthly: '55,000원',  support: '200,000원', call: '무제한', sms: '무제한', addCall: '100분', data: '15GB + 1Mbps' },
  { id: 'lgu-09', name: '5G 미니',              monthly: '45,000원',  support: '150,000원', call: '200분',  sms: '기본',   addCall: '-',    data: '8GB + 1Mbps' },
  { id: 'lgu-10', name: 'LTE 완전무한 프리미엄', monthly: '79,000원',  support: '350,000원', call: '무제한', sms: '무제한', addCall: '300분', data: '무제한' },
  { id: 'lgu-11', name: 'LTE 완전무한',         monthly: '69,000원',  support: '280,000원', call: '무제한', sms: '무제한', addCall: '200분', data: '무제한' },
  { id: 'lgu-12', name: 'LTE 스탠다드',         monthly: '59,000원',  support: '200,000원', call: '무제한', sms: '무제한', addCall: '100분', data: '15GB + 1Mbps' },
  { id: 'lgu-13', name: 'LTE 슬림',             monthly: '49,000원',  support: '120,000원', call: '무제한', sms: '무제한', addCall: '-',    data: '8GB + 1Mbps' },
  { id: 'lgu-14', name: '청년 유쓰 5G',         monthly: '62,000원',  support: '260,000원', call: '무제한', sms: '무제한', addCall: '200분', data: '100GB + 1Mbps' },
  { id: 'lgu-15', name: '청년 유쓰 LTE',        monthly: '49,000원',  support: '150,000원', call: '무제한', sms: '무제한', addCall: '100분', data: '30GB + 1Mbps' },
  { id: 'lgu-16', name: '시니어 5G 프리미엄',   monthly: '55,000원',  support: '180,000원', call: '무제한', sms: '무제한', addCall: '100분', data: '25GB + 1Mbps' },
  { id: 'lgu-17', name: '시니어 LTE',           monthly: '42,000원',  support: '100,000원', call: '무제한', sms: '무제한', addCall: '-',    data: '8GB + 1Mbps' },
  { id: 'lgu-18', name: '키즈 5G',              monthly: '38,000원',  support: '80,000원',  call: '무제한', sms: '무제한', addCall: '-',    data: '6GB + 1Mbps' },
];

function PlanSelectModal({
  selectedPlan, onSelect, onClose,
  search, onSearch, category, onCategory,
  sortLabel, sortOpen, setSortOpen, onSort, sortRef,
  favorites, onToggleFavorite,
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
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}) {
  const parsePrice = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;

  const [planLoading, setPlanLoading] = useState(true);
  useEffect(() => {
    setPlanLoading(true);
    const t = setTimeout(() => setPlanLoading(false), 600);
    return () => clearTimeout(t);
  }, [category]);

  // 카테고리 필터는 서버 API 호출 시 파라미터로 전달 예정 — 현재는 검색어만 적용
  const filtered = MOCK_PLANS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  let sorted: PlanItem[];
  if (sortLabel === '즐겨찾기') {
    sorted = filtered.filter(p => favorites.has(p.id));
  } else {
    const fav  = filtered.filter(p =>  favorites.has(p.id));
    const rest = filtered.filter(p => !favorites.has(p.id));
    const byPrice = (a: PlanItem, b: PlanItem) =>
      sortLabel === '낮은 가격 순'
        ? parsePrice(a.monthly) - parsePrice(b.monthly)
        : parsePrice(b.monthly) - parsePrice(a.monthly);
    sorted = [...fav.sort(byPrice), ...rest.sort(byPrice)];
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="w-[900px] h-[720px] bg-white rounded-2xl py-7 px-6 flex flex-col"
        style={{ boxShadow: '-1px 0 4px 0 rgba(0,0,0,0.10), 1px 0 4px 0 rgba(0,0,0,0.10), 0 2px 4px 0 rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 (Frame 832) h=40 */}
        <div className="w-full h-10 shrink-0 flex items-center justify-between border-b border-[#E2E8F0]">
          <span className="text-[20px] font-semibold text-[#111827]">요금제 선택</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 본문 (Frame 952): pt=20 gap=20 flex-1 */}
        <div className="flex flex-col gap-5 pt-5 flex-1 w-full min-h-0">

          {/* 카테고리 탭 (Frame 1004) h=44 */}
          <div className="w-full flex shrink-0">
            {PLAN_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onCategory(cat)}
                className={`h-11 px-3 shrink-0 text-[14px] font-medium cursor-pointer whitespace-nowrap bg-white border-none ${category === cat ? 'text-[#111827]' : 'text-[#6B7280]'}`}
                style={{ borderBottom: category === cat ? '2px solid #1A80FF' : '2px solid transparent' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 정렬 + 검색 (Frame 1015) h=44 */}
          <div className="w-full flex items-center justify-between shrink-0">
            <div ref={sortRef} className="relative w-[140px]">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full h-11 flex items-center justify-between pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
              >
                <span className="text-[14px] text-[#111827]">{sortLabel}</span>
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
            <div className="w-[240px] h-11 flex items-center justify-between pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white">
              <input
                type="text"
                placeholder="검색"
                value={search}
                onChange={e => onSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="#9CA3AF" strokeWidth="1.3"/>
                  <path d="M9 9l3 3" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 테이블 (Frame 1016) flex-1 */}
          <div className="flex-1 border border-[#E2E8F0] flex flex-col min-h-0">
            {/* 헤더행 (Frame 1017) h=48 */}
            <div className="w-full h-12 shrink-0 flex items-center justify-between pl-3 pr-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
              <span className="w-[200px] shrink-0 text-[14px] text-[#9CA3AF]">요금제명</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">통화</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">문자</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">부가통화</span>
              <span className="w-[148px] shrink-0 text-[14px] text-[#9CA3AF] text-center">데이터</span>
              <span className="w-[80px] shrink-0 text-[14px] text-[#9CA3AF] text-center">월정액</span>
              <span className="w-[80px] shrink-0 text-[14px] text-[#9CA3AF] text-center">이통사지원금</span>
              <span className="w-6 shrink-0" />
            </div>
            {/* 데이터행 (Frame 1018) overflow-y-auto */}
            <div className="flex-1 overflow-y-auto">
              {planLoading ? (
                <div className="flex flex-col">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between min-h-[64px] pl-3 pr-3 border-b border-[#E2E8F0] animate-pulse">
                      <div className="w-[200px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[52px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[52px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[52px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[148px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[80px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-[80px] h-4 bg-[#F0F1F3] rounded" />
                      <div className="w-6 h-6 bg-[#F0F1F3] rounded-full" />
                    </div>
                  ))}
                </div>
              ) : sorted.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => onSelect(plan.id)}
                  className={`w-full flex items-center justify-between min-h-[64px] pl-3 pr-3 cursor-pointer border-b border-[#E2E8F0] last:border-b-0
                    ${selectedPlan === plan.id ? 'bg-[#E8F2FF]' : 'bg-white hover:bg-[#F8F9FA]'}`}
                >
                  <span className="w-[200px] shrink-0 text-[14px] font-medium text-[#111827]">{plan.name}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{plan.call}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{plan.sms}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{plan.addCall}</span>
                  <span className="w-[148px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center break-words">{plan.data}</span>
                  <span className="w-[80px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{plan.monthly}</span>
                  <span className="w-[80px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{plan.support}</span>
                  <div
                    className="w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer"
                    onClick={e => { e.stopPropagation(); onToggleFavorite(plan.id); }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12.001 4.5C12.1476 4.50006 12.2906 4.54105 12.4131 4.61719C12.5355 4.69326 12.6319 4.8011 12.6924 4.92676L12.6963 4.93555L14.625 8.75098L14.7549 9.00977L15.042 9.05273L19.2881 9.66992L19.3125 9.67285C19.4598 9.68705 19.5984 9.74252 19.7129 9.83105C19.8273 9.91953 19.9124 10.0368 19.959 10.1689C20.0055 10.3011 20.013 10.4435 19.9795 10.5791C19.946 10.7147 19.8725 10.8392 19.7676 10.9375L16.6777 13.8623L16.6523 13.8848C16.5851 13.9478 16.5346 14.0276 16.5068 14.1172L16.4922 14.3711L17.2324 18.6221C17.2576 18.7603 17.2418 18.9005 17.1885 19.0293C17.1351 19.1583 17.0452 19.2711 16.9277 19.3545C16.8102 19.4379 16.6701 19.4882 16.5234 19.498C16.377 19.5078 16.231 19.4773 16.1025 19.4102L12.2744 17.4277L12.001 17.3623C11.9186 17.3623 11.8368 17.3796 11.7607 17.4121L7.90137 19.4102C7.77254 19.477 7.6261 19.5082 7.47949 19.498C7.33299 19.4879 7.19351 19.437 7.07617 19.3535C6.95885 19.2701 6.86884 19.1572 6.81543 19.0283C6.7622 18.8998 6.74647 18.7585 6.77051 18.6221L7.51953 14.3301L7.34668 13.8818L4.23535 10.9404C4.09368 10.7775 4.04679 10.6818 4.02148 10.5801C3.98782 10.4444 3.99445 10.3012 4.04102 10.1689C4.08765 10.0368 4.17264 9.91855 4.28711 9.83008C4.40175 9.74158 4.54109 9.68688 4.68848 9.67285L8.98438 9.04883L9.24707 9.00977L9.37695 8.75098L11.3057 4.93555C11.37 4.8012 11.4666 4.69325 11.5889 4.61719C11.7114 4.54105 11.8544 4.50006 12.001 4.5Z"
                        fill={favorites.has(plan.id) ? '#FACC15' : 'white'}
                        stroke={favorites.has(plan.id) ? '#FACC15' : '#E2E8F0'}
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 보험 목록 데이터 (Figma 기준 컬럼)
// ─────────────────────────────────────────────────────────────
const INSURANCE_CATEGORIES = ['전체', '폰 안심패스', '폰교체 패스', '폰교체 슬림'];

interface InsuranceItem {
  id: string;
  category: string;
  name: string;
  call: string;
  sms: string;
  addCall: string;
  data: string;
  monthly: string;
  support: string;
}

const MOCK_INSURANCES: InsuranceItem[] = [
  { id: 'ins-01', category: '폰 안심패스', name: '폰 안심패스 플래티넘', call: '무제한', sms: '무제한', addCall: '300분', data: '36GB + 데이터충전 36GB + 1Mbps', monthly: '130,000원', support: '999,999원' },
  { id: 'ins-02', category: '폰 안심패스', name: '폰 안심패스 프리미엄', call: '무제한', sms: '무제한', addCall: '300분', data: '24GB + 1Mbps', monthly: '89,000원', support: '500,000원' },
  { id: 'ins-03', category: '폰 안심패스', name: '폰 안심패스 스탠다드', call: '무제한', sms: '무제한', addCall: '200분', data: '15GB + 1Mbps', monthly: '69,000원', support: '300,000원' },
  { id: 'ins-04', category: '폰교체 패스', name: '폰교체 패스 프리미엄', call: '무제한', sms: '무제한', addCall: '300분', data: '24GB + 1Mbps', monthly: '89,000원', support: '500,000원' },
  { id: 'ins-05', category: '폰교체 패스', name: '폰교체 패스 베이직', call: '무제한', sms: '무제한', addCall: '100분', data: '10GB + 1Mbps', monthly: '59,000원', support: '200,000원' },
  { id: 'ins-06', category: '폰교체 슬림', name: '폰교체 슬림 플러스', call: '무제한', sms: '무제한', addCall: '100분', data: '10GB + 1Mbps', monthly: '49,000원', support: '150,000원' },
  { id: 'ins-07', category: '폰교체 슬림', name: '폰교체 슬림 기본', call: '무제한', sms: '무제한', addCall: '-', data: '5GB + 1Mbps', monthly: '39,000원', support: '100,000원' },
];

function InsuranceSelectModal({
  title = '보험',
  selectedInsurance, onSelect, onClose,
}: {
  title?: string;
  selectedInsurance: string;
  onSelect: (ins: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('전체');
  const [sortOpen, setSortOpen]       = useState(false);
  const [sort, setSort]               = useState('높은 가격 순');
  const [favorites, setFavorites]     = useState<Set<string>>(new Set());
  const sortRef                       = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => setFavorites(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const parseMonthly = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;

  const filtered = MOCK_INSURANCES.filter(ins =>
    (category === '전체' || ins.category === category) &&
    (!search || ins.name.toLowerCase().includes(search.toLowerCase()))
  );

  let sorted: InsuranceItem[];
  if (sort === '즐겨찾기') {
    sorted = filtered.filter(ins => favorites.has(ins.id));
  } else {
    const byPrice = (a: InsuranceItem, b: InsuranceItem) =>
      sort === '낮은 가격 순'
        ? parseMonthly(a.monthly) - parseMonthly(b.monthly)
        : parseMonthly(b.monthly) - parseMonthly(a.monthly);
    const fav  = filtered.filter(ins =>  favorites.has(ins.id)).sort(byPrice);
    const rest = filtered.filter(ins => !favorites.has(ins.id)).sort(byPrice);
    sorted = [...fav, ...rest];
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="w-[900px] h-[720px] bg-white rounded-2xl py-7 px-6 flex flex-col"
        style={{ boxShadow: '-1px 0 4px 0 rgba(0,0,0,0.10), 1px 0 4px 0 rgba(0,0,0,0.10), 0 2px 4px 0 rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 (Frame 832) h=40 */}
        <div className="w-full h-10 shrink-0 flex items-center justify-between border-b border-[#E2E8F0]">
          <span className="text-[20px] font-semibold text-[#111827]">{title}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 본문 (Frame 952): pt=20 gap=20 flex-1 */}
        <div className="flex flex-col gap-5 pt-5 flex-1 w-full min-h-0">

          {/* 카테고리 탭 (Frame 1004) h=44 */}
          <div className="w-full flex shrink-0">
            {INSURANCE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`h-11 px-3 shrink-0 text-[14px] font-medium cursor-pointer whitespace-nowrap bg-white border-none ${category === cat ? 'text-[#111827]' : 'text-[#6B7280]'}`}
                style={{ borderBottom: category === cat ? '2px solid #1A80FF' : '2px solid transparent' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 정렬 + 검색 (Frame 1015) h=44 */}
          <div className="w-full flex items-center justify-between shrink-0">
            <div ref={sortRef} className="relative w-[140px]">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full h-11 flex items-center justify-between pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white cursor-pointer"
              >
                <span className="text-[14px] text-[#111827]">{sort}</span>
                <svg width="8" height="4" viewBox="0 0 8 4" fill="none"><path d="M1 1l3 2 3-2" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-md z-10 overflow-hidden">
                  {['높은 가격 순', '낮은 가격 순', '즐겨찾기'].map(opt => (
                    <button key={opt} onClick={() => { setSort(opt); setSortOpen(false); }} className={`w-full px-3 py-2.5 text-left text-[14px] border-none cursor-pointer ${sort === opt ? 'bg-[#E8F2FF] text-[#111827]' : 'bg-white text-[#111827]'}`}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-[240px] h-11 flex items-center justify-between pl-3 pr-2 border border-[#E2E8F0] rounded-lg bg-white">
              <input
                type="text"
                placeholder="검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="#9CA3AF" strokeWidth="1.3"/>
                  <path d="M9 9l3 3" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 테이블 (Frame 1016) flex-1 */}
          <div className="flex-1 border border-[#E2E8F0] flex flex-col min-h-0">
            {/* 헤더행 (Frame 1017) h=48 */}
            <div className="w-full h-12 shrink-0 flex items-center justify-between pl-3 pr-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
              <span className="w-[200px] shrink-0 text-[14px] text-[#9CA3AF]">요금제명</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">통화</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">문자</span>
              <span className="w-[52px] shrink-0 text-[14px] text-[#9CA3AF] text-center">부가통화</span>
              <span className="w-[148px] shrink-0 text-[14px] text-[#9CA3AF] text-center">데이터</span>
              <span className="w-[80px] shrink-0 text-[14px] text-[#9CA3AF] text-center">월정액</span>
              <span className="w-[80px] shrink-0 text-[14px] text-[#9CA3AF] text-center">이통사지원금</span>
              <span className="w-6 shrink-0" />
            </div>
            {/* 데이터행 overflow-y-auto */}
            <div className="flex-1 overflow-y-auto">
              {sorted.map(ins => (
                <div
                  key={ins.id}
                  onClick={() => onSelect(ins.name)}
                  className={`w-full flex items-center justify-between min-h-[64px] pl-3 pr-3 cursor-pointer border-b border-[#E2E8F0] last:border-b-0
                    ${selectedInsurance === ins.name ? 'bg-[#E8F2FF]' : 'bg-white hover:bg-[#F8F9FA]'}`}
                >
                  <span className="w-[200px] shrink-0 text-[14px] font-medium text-[#111827]">{ins.name}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{ins.call}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{ins.sms}</span>
                  <span className="w-[52px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{ins.addCall}</span>
                  <span className="w-[148px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center break-words">{ins.data}</span>
                  <span className="w-[80px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{ins.monthly}</span>
                  <span className="w-[80px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{ins.support}</span>
                  <div
                    className="w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer"
                    onClick={e => { e.stopPropagation(); toggleFavorite(ins.id); }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12.001 4.5C12.1476 4.50006 12.2906 4.54105 12.4131 4.61719C12.5355 4.69326 12.6319 4.8011 12.6924 4.92676L12.6963 4.93555L14.625 8.75098L14.7549 9.00977L15.042 9.05273L19.2881 9.66992L19.3125 9.67285C19.4598 9.68705 19.5984 9.74252 19.7129 9.83105C19.8273 9.91953 19.9124 10.0368 19.959 10.1689C20.0055 10.3011 20.013 10.4435 19.9795 10.5791C19.946 10.7147 19.8725 10.8392 19.7676 10.9375L16.6777 13.8623L16.6523 13.8848C16.5851 13.9478 16.5346 14.0276 16.5068 14.1172L16.4922 14.3711L17.2324 18.6221C17.2576 18.7603 17.2418 18.9005 17.1885 19.0293C17.1351 19.1583 17.0452 19.2711 16.9277 19.3545C16.8102 19.4379 16.6701 19.4882 16.5234 19.498C16.377 19.5078 16.231 19.4773 16.1025 19.4102L12.2744 17.4277L12.001 17.3623C11.9186 17.3623 11.8368 17.3796 11.7607 17.4121L7.90137 19.4102C7.77254 19.477 7.6261 19.5082 7.47949 19.498C7.33299 19.4879 7.19351 19.437 7.07617 19.3535C6.95885 19.2701 6.86884 19.1572 6.81543 19.0283C6.7622 18.8998 6.74647 18.7585 6.77051 18.6221L7.51953 14.3301L7.34668 13.8818L4.23535 10.9404C4.09368 10.7775 4.04679 10.6818 4.02148 10.5801C3.98782 10.4444 3.99445 10.3012 4.04102 10.1689C4.08765 10.0368 4.17264 9.91855 4.28711 9.83008C4.40175 9.74158 4.54109 9.68688 4.68848 9.67285L8.98438 9.04883L9.24707 9.00977L9.37695 8.75098L11.3057 4.93555C11.37 4.8012 11.4666 4.69325 11.5889 4.61719C11.7114 4.54105 11.8544 4.50006 12.001 4.5Z"
                        fill={favorites.has(ins.id) ? '#FACC15' : 'white'}
                        stroke={favorites.has(ins.id) ? '#FACC15' : '#E2E8F0'}
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LG U+ 할인 모달 공통 섹션 컴포넌트
// ─────────────────────────────────────────────────────────────
function LguInfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[18px] font-semibold text-[#111827]">{title}</span>
      <div className="px-3 py-3 bg-[#F8F9FA] rounded-lg flex flex-col gap-2">{children}</div>
    </div>
  );
}

function LguModalShell({ title, titleExtra, onClose, children, onApply, onReset }: {
  title: string;
  titleExtra?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="w-[900px] bg-white rounded-xl p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <span className="text-[20px] font-semibold text-[#111827]">{title}</span>
            {titleExtra}
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[540px]">{children}</div>
        <div className="flex justify-center gap-5">
          <button onClick={onReset} className="w-[200px] h-[52px] bg-[#F8F9FA] text-[#9CA3AF] text-[16px] font-medium rounded-lg border-none cursor-pointer">
            미적용
          </button>
          <button onClick={onApply} className="w-[200px] h-[52px] bg-[#1A80FF] text-white text-[16px] font-medium rounded-lg border-none cursor-pointer">
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 프리미어 요금제 약정할인 모달
// ─────────────────────────────────────────────────────────────
function 약정할인Modal({ onApply, onReset, onClose }: { onApply: () => void; onReset: () => void; onClose: () => void }) {
  const REFUND_HEADERS = ['약정기간', '~6개월', '7~12개월', '13~16개월', '17~20개월', '21~24개월'];
  const REFUND_VALUES  = ['구간 별 반환 비율', '100%', '50%', '30%', '-20%', '-40%'];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="w-[900px] bg-white rounded-2xl py-7 px-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="h-10 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-semibold text-[#111827]">프리미어 요금제 약정할인</span>
            <button className="flex items-center gap-1 text-[14px] text-[#9CA3AF] bg-transparent border-none cursor-pointer p-0">
              공식사이트
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M5 1H7V3M7 1L3 5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 3V7H5V4" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-5 pt-5 overflow-y-auto">
          <div className="flex flex-col gap-2 py-1">
            <span className="text-[18px] font-medium text-[#111827]">1. 가입대상</span>
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 flex flex-col gap-2">
              <span className="text-[16px] text-[#6B7280]">3번(가입 가능 요금제)와 같은 요금제에 가입한 고객</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 py-1">
            <span className="text-[18px] font-medium text-[#111827]">2. 서비스 내용</span>
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 flex flex-col gap-2">
              <span className="text-[16px] text-[#6B7280]">약정 기간(24개월) 동안 부가세 포함 월 5,250원 할인</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 py-1">
            <span className="text-[18px] font-medium text-[#111827]">3. 가입 가능 요금제</span>
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 flex flex-col gap-2">
              <span className="text-[16px] text-[#6B7280]">통합 요금제: 플러스플랜130, 플러스플랜115, 플러스플랜105, 플러스플랜95, 데이터플랜MAX</span>
              <span className="text-[16px] text-[#6B7280]">5G 요금제: 5G 프리미어 레귤러/에센셜</span>
              <span className="text-[16px] text-[#6B7280]">LTE 요금제: LTE 프리미어 플러스/에센셜</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 py-1">
            <span className="text-[18px] font-medium text-[#111827]">4. 유의사항(할인 반환금)</span>
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 flex flex-col gap-2">
              <span className="text-[16px] text-[#6B7280]">- 약정 기간 안에 해지하거나 다른 요금제로 변경 시 할인 반환금 발생</span>
              <div className="overflow-hidden border border-[#E2E8F0]">
                <div className="flex border-b border-[#E2E8F0]">
                  {REFUND_HEADERS.map((h, i) => (
                    <div key={h} className={`w-[138px] h-8 flex items-center justify-center bg-[#E8F2FF] ${i > 0 ? 'border-l border-[#E2E8F0]' : ''}`}>
                      <span className="text-[14px] text-[#111827]">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  {REFUND_VALUES.map((v, i) => (
                    <div key={i} className={`w-[138px] h-10 flex items-center justify-center bg-white ${i > 0 ? 'border-l border-[#E2E8F0]' : ''}`}>
                      <span className="text-[13px] text-[#6B7280]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-5 pt-6">
          <button onClick={onReset} className="w-[200px] h-[52px] bg-[#F8F9FA] text-[#9CA3AF] text-[16px] font-medium rounded-lg border-none cursor-pointer">
            미적용
          </button>
          <button onClick={onApply} className="w-[200px] h-[52px] bg-[#1A80FF] text-white text-[16px] font-medium rounded-lg border-none cursor-pointer">
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 플러스플랜 130 가족할인 모달
// ─────────────────────────────────────────────────────────────
function 가족할인Modal({ onApply, onReset, onClose }: { onApply: () => void; onReset: () => void; onClose: () => void }) {
  return (
    <LguModalShell title="플러스플랜 130 가족할인" onClose={onClose} onApply={onApply} onReset={onReset}>
      <LguInfoSection title="1. 가입대상">
        <span className="text-[16px] text-[#6B7280]">만 18세 이하 자녀 (부모 플러스플랜 130 가입 시)</span>
      </LguInfoSection>
      <LguInfoSection title="2. 서비스 내용">
        <span className="text-[16px] text-[#6B7280]">월정액에서 최대 33,000원 할인</span>
      </LguInfoSection>
      <LguInfoSection title="3. 가입 가능 요금제">
        <span className="text-[16px] text-[#6B7280]">자녀 월정액 33,000원 이상 요금제 가입 시</span>
      </LguInfoSection>
      <LguInfoSection title="4. 유의사항(할인 반환금)">
        <span className="text-[16px] text-[#6B7280]">자녀가 만 20세가 될 때까지 할인 가능</span>
        <span className="text-[16px] text-[#6B7280]">법정대리인의 플러스플랜 130 가입 회선 1개당 자녀 1회선 할인</span>
      </LguInfoSection>
    </LguModalShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 복지할인 모달
// ─────────────────────────────────────────────────────────────
const 복지할인ROWS = [
  { category: '미적용',                    desc: '-',                                                                                                                                             max: '0원'      },
  { category: '장애인',                    desc: '월정액(기본요금), 음성통화요금, 데이터 이용요금 각 35% 할인',                                                                                  max: '35%'      },
  { category: '국가유공자',                desc: '월정액(기본요금), 음성통화요금, 데이터 이용요금 각 35% 할인',                                                                                  max: '35%'      },
  { category: '기초생활수급자 (생계/의료)', desc: '월정액(기본요금) 최대 28,600원까지 할인, 음성통화요금+데이터 이용요금 합산액 50%할인(최대 36,850원)',                                         max: '28,650원' },
  { category: '기초생활수급자 (주거/교육)', desc: '월정액(기본요금) 12,100원 할인, 12,100원 초과 월정액(기본요금)+음성통화요금+데이터 이용요금 합산액 35%할인(최대 11,550원)',                   max: '23,650원' },
  { category: '차상위계층',               desc: '월정액(기본요금) 12,100원 할인, 12,100원 초과 월정액(기본요금)+음성통화요금+데이터 이용요금 합산액 35%할인(최대 11,550원)',                    max: '23,650원' },
  { category: '기초연금수급자(만 65세 이상)', desc: '월정액(기본요금)+음성통화요금+데이터 이용요금 합산액 50%할인(최대 12,100원)',                                                              max: '12,100원' },
];

function 복지할인Modal({ selected, onApply, onClose }: { selected: string; onApply: (v: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      {/* 모달: w=900 pt=28 pr=24 pb=28 pl=24 r=16 */}
      <div className="w-[900px] bg-white rounded-2xl py-7 px-6 flex flex-col" onClick={e => e.stopPropagation()}>
        {/* 헤더 (Frame 832): h=40 SPACE_BETWEEN pb=12 border-b */}
        <div className="h-10 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-semibold text-[#111827]">복지할인</span>
            <button className="flex items-center gap-1 text-[14px] text-[#9CA3AF] bg-transparent border-none cursor-pointer p-0">
              공식사이트
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M5 1H7V3M7 1L3 5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 3V7H5V4" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* 바디 (Frame 875): pt=20 */}
        <div className="pt-5">
          {/* 테이블 (Frame 1016): border stroke=#e2e8f0, no radius */}
          <div className="border border-[#E2E8F0] overflow-hidden">
            {/* 헤더행 (Frame 1017): h=48 fill=#f8f9fa pt=16 pr=12 pb=16 pl=12 gap=20 */}
            <div className="h-12 flex items-center gap-5 pl-3 pr-3 bg-[#F8F9FA] border-b border-[#E2E8F0]">
              <span className="w-[180px] shrink-0 text-[14px] text-[#9CA3AF]">요금제명</span>
              <span className="flex-1 text-[14px] text-[#9CA3AF]">월정액</span>
              <span className="w-[80px] shrink-0 text-[14px] text-[#9CA3AF] text-center">할인</span>
            </div>
            {/* 데이터행 (Frame 1019~1035): h=64 counter=CENTER gap=20 pt=8 pr=12 pb=8 pl=12 */}
            {복지할인ROWS.map(row => (
              <div
                key={row.category}
                onClick={() => onApply(row.category)}
                className={`flex items-center min-h-[64px] gap-5 pl-3 pr-3 py-2 cursor-pointer border-b border-[#E2E8F0] last:border-b-0 ${selected === row.category ? 'bg-[#E8F2FF]' : 'bg-white'}`}
              >
                <span className="w-[180px] shrink-0 text-[14px] font-medium text-[#111827]">{row.category}</span>
                <span className="flex-1 text-[12px] text-[#6B7280] break-words">{row.desc}</span>
                <span className="w-[60px] shrink-0 text-[14px] font-medium text-[#6B7280] text-center">{row.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 현역병사 요금할인 모달
// ─────────────────────────────────────────────────────────────
function 현역병사Modal({ onApply, onReset, onClose }: { onApply: () => void; onReset: () => void; onClose: () => void }) {
  return (
    <LguModalShell title="현역병사 요금할인" onClose={onClose} onApply={onApply} onReset={onReset}
      titleExtra={
        <button className="flex items-center gap-1 text-[14px] text-[#9CA3AF] bg-transparent border-none cursor-pointer p-0">
          공식사이트
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M5 1H7V3M7 1L3 5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 3V7H5V4" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      }
    >
      <LguInfoSection title="1. 가입대상">
        <span className="text-[16px] text-[#6B7280]">의무 복무중인 현역 군인(임기제 부사관, 대체복무요원, 의무경찰, 의무소방원 포함)</span>
      </LguInfoSection>
      <LguInfoSection title="2. 서비스 내용">
        <span className="text-[16px] text-[#6B7280]">현역병사임을 제출 서류로 확인한 날로부터 전역일 다음 달까지 매달 통신요금 20% 할인</span>
      </LguInfoSection>
      <LguInfoSection title="3. 가입 가능 요금제">
        <span className="text-[16px] text-[#6B7280]">플러스플랜130, 플러스플랜115, 플러스플랜105, 플러스플랜95</span>
        <span className="text-[16px] text-[#6B7280]">데이터플랜MAX/150GB/125GB/95GB/80GB/50GB/31GB/24GB/14GB/9GB/5GB/1.5GB</span>
      </LguInfoSection>
      <LguInfoSection title="4. 유의사항(필요 서류)">
        <span className="text-[16px] text-[#6B7280]">통합요금제에서는 현역병사 요금할인의 추가 데이터 미제공</span>
        <span className="text-[16px] text-[#6B7280]">현역병사 데이터 33 요금제와 중복 할인 불가</span>
      </LguInfoSection>
      <LguInfoSection title="5. 필요서류">
        <span className="text-[16px] text-[#6B7280]">현역병사: 입영 통지서, 입영(예정) 사실 확인서, 복무 확인서, 병적증명서, 주민등록표 초본 중 1개</span>
        <span className="text-[16px] text-[#6B7280]">대체 복무 요원: 병적증명서, 복무확인서, 주민등록표 초본 중 1개</span>
      </LguInfoSection>
    </LguModalShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 선할인카드 / 청구할인카드 공통 모달
// ─────────────────────────────────────────────────────────────
const 카드할인CARDS = [
  { name: '[국민] T-economy KB국민카드', amount: '12,000원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
  { name: '카드명', amount: '0원' },
];
const 카드할인TIERS = [
  { label: '30만 원 이상',  discount: '11,000원' },
  { label: '70만 원 이상',  discount: '14,000원' },
  { label: '120만 원 이상', discount: '17,000원' },
];
const CARD_INFO = { issuer: '국민카드', payment: '자동이체 필수', fee: '국내 20,000원 / 해외 20,000원', center: '전화, 온라인 발급' };

function 카드할인Modal({ title, onApply, onReset, onClose }: { title: string; onApply: () => void; onReset: () => void; onClose: () => void }) {
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedTier, setSelectedTier] = useState(0);
  const [phoneInput, setPhoneInput] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="w-[900px] bg-white rounded-xl py-7 px-6 flex flex-col gap-5" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="h-10 flex items-center justify-between border-b border-[#E2E8F0]">
          <span className="text-[20px] font-semibold text-[#111827]">{title}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* 바디: 좌(카드 목록 w=252) + 우(상세) */}
        <div className="flex overflow-y-auto max-h-[552px]">
          {/* 좌: Frame 954 — 카드 목록 */}
          <div className="w-[252px] shrink-0 flex flex-col pt-5 pb-5 pr-3">
            {카드할인CARDS.map((card, i) => (
              <div
                key={i}
                onClick={() => setSelectedCard(i)}
                className={`w-[240px] px-3 pt-5 pb-5 flex flex-col gap-1 cursor-pointer rounded-lg ${selectedCard === i ? 'bg-[#F8F9FA]' : 'bg-white'}`}
              >
                {/* Frame 956: 카드명 */}
                <span className={`text-[14px] leading-[1.4] ${selectedCard === i ? 'font-medium text-[#111827]' : 'font-normal text-[#6B7280]'}`}>{card.name}</span>
                {/* Frame 877: 월 금액 ~ */}
                <div className="flex items-center gap-1 justify-end">
                  <span className={`text-[14px] font-medium ${selectedCard === i ? 'text-[#023E8A]' : 'text-[#111827]'}`}>월</span>
                  <span className={`text-[14px] font-medium ${selectedCard === i ? 'text-[#023E8A]' : 'text-[#111827]'}`}>{card.amount}</span>
                  <span className={`text-[14px] font-medium ${selectedCard === i ? 'text-[#023E8A]' : 'text-[#111827]'}`}>~</span>
                </div>
              </div>
            ))}
          </div>
          {/* 우: Frame 955 — 상세 패널 */}
          <div className="flex-1 flex flex-col gap-5 pt-5 pb-5 pl-3">
            {/* Frame 963: 카드 이미지 + 상세정보 (gap=20) */}
            <div className="flex items-center gap-5">
              {/* Rectangle 684: KB 카드 이미지 (216×136) */}
              <img src={KBCardImg} alt="KB 카드" className="w-[216px] h-[136px] shrink-0 object-contain" />
              {/* Frame 962: 카드명 + 상세 (VERTICAL, pt=4 pb=4 gap=12) */}
              <div className="flex flex-col gap-3 py-1">
                <span className="text-[18px] font-semibold text-[#111827]">
                  {카드할인CARDS[selectedCard].name.replace(/^\[.*?\]\s*/, '')}
                </span>
                {/* Frame 964: 4개 정보 행 (VERTICAL pl=12 pr=12 gap=4) */}
                <div className="flex flex-col gap-1 pl-3 pr-3">
                  {[
                    ['카드사',   CARD_INFO.issuer],
                    ['결제구분', CARD_INFO.payment],
                    ['연회비',   CARD_INFO.fee],
                    ['발급센터', CARD_INFO.center],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2 h-5">
                      <span className="text-[14px] text-[#111827] w-[52px] shrink-0">{label}</span>
                      <span className="text-[14px] text-[#6B7280]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Frame 859: 전월 실적 구간 선택 */}
            <div className="flex flex-col gap-3 py-1">
              <span className="text-[16px] font-medium text-[#111827]">전월 실적 구간 선택</span>
              <div className="flex flex-col gap-2">
                {카드할인TIERS.map((tier, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTier(i)}
                    className={`flex items-center justify-between h-[52px] px-3 rounded-lg border cursor-pointer ${selectedTier === i ? 'border-[#1A80FF] bg-[#E8F2FF]' : 'border-[#E2E8F0] bg-white'}`}
                  >
                    <div className="flex items-center gap-2">
                      {/* radio circle */}
                      <div className={`relative w-3 h-3 rounded-full border ${selectedTier === i ? 'border-[#1A80FF] bg-white' : 'border-[#E2E8F0]'}`}>
                        {selectedTier === i && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#1A80FF]" />}
                      </div>
                      <span className="text-[14px] text-[#111827]">{tier.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[14px] font-medium text-[#111827]">{tier.discount}</span>
                      <span className="text-[14px] font-medium text-[#111827]">할인</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Frame 985: 카드 신청 방법 */}
            <div className="flex flex-col gap-3">
              <span className="text-[16px] font-medium text-[#111827]">카드 신청 방법</span>
              {/* Frame 988 (VERTICAL gap=8) */}
              <div className="flex flex-col gap-2">
                {/* Frame 972: 링크 전송 행 (h=56 bg=#F8F9FA, px=12 py=8) */}
                <div className="h-[56px] bg-[#F8F9FA] rounded-lg flex items-center px-3">
                  {/* Frame 986 (HORIZONTAL gap=8 CENTER) */}
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-[14px] text-[#6B7280] shrink-0">카드 신청 링크 전송</span>
                    {/* Frame 720: input (w=332 h=40 bg=white) */}
                    <div className="flex-1 h-[40px] bg-white rounded-lg border border-[#E2E8F0] flex items-center px-3">
                      <input
                        className="w-full text-[14px] text-[#9CA3AF] outline-none border-none bg-transparent"
                        placeholder="-없이 숫자만 입력해 주세요"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                      />
                    </div>
                    {/* Frame 721: 전송 버튼 (w=100 h=40 bg=#E8F2FF) */}
                    <button className="w-[100px] h-[40px] bg-[#E8F2FF] text-[#5AAAFF] text-[14px] rounded-lg border-none cursor-pointer shrink-0">전송</button>
                  </div>
                </div>
                {/* Frame 971: 연락 방법 (HORIZONTAL SPACE_BETWEEN px=60 py=24) */}
                <div className="flex items-center justify-between px-[60px] py-6 bg-white rounded-lg border border-[#E2E8F0]">
                  {/* Frame 976: 전화 (VERTICAL CENTER gap=4) */}
                  <div className="flex flex-col items-center gap-1">
                    {/* Frame 975 (VERTICAL CENTER gap=4) */}
                    <div className="flex flex-col items-center gap-1">
                      {/* Frame 972 (40×40 bg=#F8F9FA r=26) */}
                      <div className="w-10 h-10 bg-[#F8F9FA] rounded-[26px] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M18.9994 14.4765V17.1862C19.0005 17.4377 18.9488 17.6867 18.8479 17.9172C18.7469 18.1477 18.5988 18.3546 18.4131 18.5247C18.2273 18.6947 18.008 18.8242 17.7693 18.9048C17.5305 18.9854 17.2775 19.0153 17.0265 18.9927C14.2415 18.6907 11.5664 17.7409 9.21601 16.2197C7.02929 14.8329 5.17534 12.9827 3.7858 10.8003C2.25627 8.44389 1.30442 5.76107 1.00735 2.96915C0.98473 2.71938 1.01447 2.46764 1.09468 2.22996C1.17489 1.99229 1.30381 1.77389 1.47323 1.58866C1.64265 1.40343 1.84885 1.25544 2.07872 1.15411C2.30858 1.05278 2.55707 1.00032 2.80837 1.00009H5.52347C5.96269 0.995773 6.3885 1.151 6.72152 1.43683C7.05455 1.72267 7.27207 2.11961 7.33354 2.55366C7.44814 3.42084 7.66067 4.27229 7.96707 5.09177C8.08883 5.41507 8.11519 5.76642 8.043 6.1042C7.97082 6.44198 7.80313 6.75203 7.5598 6.99761L6.41041 8.14473C7.69877 10.406 9.57482 12.2784 11.8406 13.5642L12.99 12.4171C13.2361 12.1742 13.5467 12.0069 13.8852 11.9348C14.2236 11.8628 14.5757 11.8891 14.8996 12.0106C15.7207 12.3164 16.5739 12.5285 17.4428 12.6429C17.8824 12.7048 18.2839 12.9258 18.5709 13.2638C18.858 13.6019 19.0105 14.0335 18.9994 14.4765Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[14px] font-medium text-[#6B7280]">전화</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#111827]">1577-1234</span>
                  </div>
                  {/* 구분선 Rectangle 686 (w=1 h=100) */}
                  <div className="w-px h-[100px] bg-[#E2E8F0]" />
                  {/* Frame 981: 온라인 신청+바로가기 (VERTICAL CENTER gap=4) */}
                  <div className="flex flex-col items-center gap-1">
                    {/* Frame 974 (VERTICAL CENTER gap=4) */}
                    <div className="flex flex-col items-center gap-1">
                      {/* Frame 972 (40×40 bg=#F8F9FA r=26) */}
                      <div className="w-10 h-10 bg-[#F8F9FA] rounded-[26px] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M8.99951 0C13.9699 0 17.9998 4.02919 18 8.99951C17.9998 13.9698 13.9699 18 8.99951 18L8.99756 17.999V18L8.9956 17.999C4.0272 17.9967 0.00020388 13.9684 0 8.99951C0.000186601 4.0293 4.0293 0.000186605 8.99951 0ZM13.1379 9.99772C12.9479 11.9957 12.3069 13.9162 11.2714 15.6197C13.718 14.7802 15.552 12.6251 15.9274 9.99772H13.1379ZM2.0726 9.99772C2.44766 12.6229 4.27846 14.7768 6.7218 15.6178C5.68709 13.9148 5.04715 11.9947 4.85724 9.99772H2.0726ZM6.86733 9.99772C7.08828 11.9627 7.82319 13.8343 8.99756 15.4234C10.172 13.8343 10.9069 11.9627 11.1278 9.99772H6.86733ZM11.2714 2.37832C12.3063 4.08094 12.9465 6.00064 13.1369 7.9974H15.9264C15.5498 5.37154 13.717 3.2172 11.2714 2.37832ZM8.99756 2.57561C7.82388 4.16367 7.08973 6.03372 6.86831 7.9974H11.1268C10.9054 6.0337 10.1713 4.1637 8.99756 2.57561ZM6.7218 2.38125C4.27954 3.22172 2.44979 5.37387 2.07358 7.9974H4.85821C5.04855 6.00182 5.68791 4.08312 6.7218 2.38125Z" fill="#9CA3AF"/>
                        </svg>
                      </div>
                      <span className="text-[14px] font-medium text-[#6B7280]">온라인 신청</span>
                    </div>
                    {/* Frame 980 (HORIZONTAL CENTER gap=0) */}
                    <div className="flex items-center justify-center">
                      <span className="text-[16px] font-medium text-[#111827]">바로가기</span>
                      {/* Frame 979 (20×20) with arrow icon */}
                      <div className="w-5 h-5 flex items-center justify-center">
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                          <path d="M0.292817 11.7072C-0.0976278 11.3167 -0.0975836 10.6837 0.292817 10.2932L8.58609 1.99996L1.25856 1.99996C0.706464 1.99997 0.258875 1.55209 0.25864 1.00005C0.258686 0.447846 0.706347 0.000127751 1.25856 0.000127727L11.0009 0.000127301C11.5531 0.000172096 12.0008 0.447873 12.0008 1.00005V10.7414C12.0008 11.2937 11.5531 11.7413 11.0009 11.7414C10.4487 11.7413 10.001 11.2937 10.001 10.7414V3.41391L1.70676 11.7072C1.31626 12.0976 0.683272 12.0976 0.292817 11.7072Z" fill="#E8F2FF"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* 구분선 Rectangle 687 (w=1 h=100) */}
                  <div className="w-px h-[100px] bg-[#E2E8F0]" />
                  {/* Frame 982: QR 온라인신청 (VERTICAL SPACE_BETWEEN CENTER) */}
                  <div className="flex flex-col items-center justify-between h-[88px]">
                    <span className="text-[14px] font-medium text-[#6B7280]">온라인 신청</span>
                    {/* Rectangle 685 (60×60 QR) */}
                    <img src={QRCardImg} alt="QR" className="w-[60px] h-[60px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 버튼 */}
        <div className="flex justify-center gap-5">
          <button onClick={onReset} className="w-[200px] h-[52px] bg-[#F8F9FA] text-[#9CA3AF] text-[16px] font-medium rounded-lg border-none cursor-pointer">
            미적용
          </button>
          <button onClick={onApply} className="w-[200px] h-[52px] bg-[#1A80FF] text-white text-[16px] font-medium rounded-lg border-none cursor-pointer">
            적용
          </button>
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

function FormRow({ label, children, labelSize = 'text-[14px]', labelWidth = 'w-[84px]' }: { label: string; children: ReactNode; labelSize?: string; labelWidth?: string }) {
  return (
    <div className="flex items-center h-11 gap-2">
      <span className={`${labelWidth} shrink-0 ${labelSize} text-[#6B7280]`}>{label}</span>
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

function NegativeInputField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const num = parseInt(value) || 0;
  const displayValue = focused ? value : (num > 0 ? `-${num.toLocaleString('ko-KR')}원` : '');
  return (
    <div className="flex-1 h-11 flex items-center px-3 rounded-lg border border-input-border bg-white">
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={e => { if (focused) onChange(e.target.value.replace(/[^0-9]/g, '')); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="미적용"
        className="flex-1 bg-transparent border-none outline-none text-sm text-right placeholder:text-[#9CA3AF] text-[#111827]"
      />
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

// ─────────────────────────────────────────────────────────────
// 서식지 출력 모달 (신규가입 / 번호이동 / 기기변경)
// ─────────────────────────────────────────────────────────────
const 출력양식목록 = [
  '성인 가입신청서',
  '서비스 신청서 모바일',
  '무선표준 안내서',
  'LG 번호이동 전환지원금 확인서',
];
const 고객구분옵션 = ['성인', '청소년'];
const 통신사옵션   = ['미선택', 'SKT', 'KT', 'MVNO(알뜰폰)'];

function 서식지Modal({ 가입유형, onClose }: { 가입유형: string; onClose: () => void }) {
  const [고객구분, set고객구분]       = useState('성인');
  const [기기일련번호, set기기일련번호] = useState('');
  const [유심일련번호, set유심일련번호] = useState('');
  const [이전통신사, set이전통신사]   = useState('미선택');
  const [카드할인, set카드할인]       = useState(true);
  const [매장정보, set매장정보]       = useState(true);
  const [카드체크, set카드체크]       = useState<string[]>(['매장명', '연락처', '주소', '판매자']);
  const [선택양식, set선택양식]       = useState<string[]>(['성인 가입신청서', '서비스 신청서 모바일']);

  const toggle양식 = (item: string) =>
    set선택양식(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  const toggle카드 = (item: string) =>
    set카드체크(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const handle출력 = () => window.open(ExampleImg, '_blank');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-2xl bg-white"
        style={{ width: 900, padding: '28px 24px', gap: 20, display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── 헤더 ── */}
        <div className="flex items-center justify-between" style={{ height: 44 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="text-[20px] font-semibold text-[#111827]">서식지 출력</span>
            <span className="text-[16px] font-normal text-[#9CA3AF]">{가입유형}</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-transparent border-none cursor-pointer"
            style={{ width: 28, height: 28 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── 바디: 좌우 2컬럼 ── */}
        <div className="flex" style={{ gap: 0, background: '#FFFFFF' }}>

          {/* 좌측 400px */}
          <div className="flex flex-col" style={{ width: 400, padding: '20px 12px', gap: 20 }}>

            {/* 기본설정 */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <span className="text-[16px] font-medium text-[#111827]">기본설정</span>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {/* 고객구분 — Frame 720: 296px, bg=#FFFFFF, stroke=#E2E8F0, r=8 */}
                <FormField label="고객구분">
                  <서식지Dropdown value={고객구분} options={고객구분옵션} onChange={set고객구분} width={296} />
                </FormField>
                {/* 기기 일련번호 */}
                <FormField label="기기 일련번호">
                  <input
                    value={기기일련번호} onChange={e => set기기일련번호(e.target.value)}
                    className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[14px] text-[#111827] outline-none"
                    style={{ width: 296 }}
                  />
                </FormField>
                {/* 유심 일련번호 */}
                <FormField label="유심 일련번호">
                  <input
                    value={유심일련번호} onChange={e => set유심일련번호(e.target.value)}
                    className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[14px] text-[#111827] outline-none"
                    style={{ width: 296 }}
                  />
                </FormField>
              </div>
            </div>

            {/* 번호이동 설정 (번호이동 전용) */}
            {가입유형 === '번호이동' && (
              <div className="flex flex-col" style={{ gap: 12 }}>
                <span className="text-[16px] font-medium text-[#111827]">번호이동 설정</span>
                <FormField label="이전 통신사">
                  <서식지Dropdown value={이전통신사} options={통신사옵션} onChange={set이전통신사} width={296} />
                </FormField>
              </div>
            )}

            {/* 출력옵션 */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <span className="text-[16px] font-medium text-[#111827]">출력옵션</span>
              <div className="flex flex-col" style={{ gap: 12 }}>

                {/* Frame 994: 카드할인 토글 행 */}
                <ToggleRow
                  label="카드할인"
                  value={카드할인}
                  onChange={set카드할인}
                />

                {/* Frame 996: 매장정보 토글 + 체크박스 (카드할인과 독립) */}
                <div className="flex flex-col" style={{ gap: 4 }}>
                  {/* Frame 995: 매장정보 토글 행 */}
                  <ToggleRow
                    label="매장정보"
                    value={매장정보}
                    onChange={set매장정보}
                  />
                  {/* 카드 정보 체크박스 행 (매장정보 ON일 때만) */}
                  {매장정보 && (
                    <div className="flex items-center" style={{ gap: 8, height: 40, background: '#F8F9FA', borderRadius: 8, padding: '0 8px' }}>
                      {['매장명', '연락처', '주소', '판매자'].map(item => (
                        <button
                          key={item} type="button"
                          onClick={() => toggle카드(item)}
                          className="flex items-center bg-transparent border-none cursor-pointer"
                          style={{ gap: 4 }}
                        >
                          <div style={{
                            width: 16, height: 16, borderRadius: 3,
                            background: 카드체크.includes(item) ? '#1A80FF' : '#FFFFFF',
                            border: 카드체크.includes(item) ? 'none' : '1.5px solid #D1D5DB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {카드체크.includes(item) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[12px] text-[#6B7280]">{item}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* 우측 452px */}
          <div className="flex flex-col" style={{ width: 452, background: '#F8F9FA', padding: '20px 12px', gap: 20 }}>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <span className="text-[16px] font-medium text-[#111827]">출력 양식 선택</span>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {출력양식목록.map(item => {
                  const checked = 선택양식.includes(item);
                  return (
                    <button
                      key={item} type="button"
                      onClick={() => toggle양식(item)}
                      className="flex items-center justify-between cursor-pointer"
                      style={{
                        height: 48,
                        padding: '12px',
                        gap: 8,
                        background: checked ? '#E8F2FF' : '#FFFFFF',
                        border: checked ? '1px solid #1A80FF' : '1px solid #E2E8F0',
                        borderRadius: 8,
                      }}
                    >
                      <span className="text-[14px] text-[#111827]">{item}</span>
                      {/* Frame 936: 체크마크 항상 표시, 선택 시 파란색·미선택 시 회색 */}
                      <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4L3.94118 7L11 1" stroke={checked ? '#1A80FF' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── 푸터 ── */}
        <div className="flex items-center justify-center" style={{ gap: 20, height: 52 }}>
          <button
            type="button" onClick={onClose}
            className="flex items-center justify-center rounded-lg border-none cursor-pointer"
            style={{ width: 200, height: 52, background: '#F8F9FA' }}
          >
            <span className="text-[16px] font-medium text-[#9CA3AF]">취소</span>
          </button>
          <button
            type="button" onClick={handle출력}
            className="flex items-center justify-center rounded-lg border-none cursor-pointer"
            style={{ width: 200, height: 52, background: '#1A80FF' }}
          >
            <span className="text-[16px] font-medium text-white">출력</span>
          </button>
        </div>

      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 8, height: 44 }}>
      <span className="text-[14px] text-[#6B7280] shrink-0" style={{ width: 84 }}>{label}</span>
      {children}
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between" style={{ height: 40 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span className="text-[14px] text-[#111827]">{label}</span>
        <span
          className="text-[12px]"
          style={{
            background: value ? '#E8F2FF' : '#F3F4F6',
            color: value ? '#1A80FF' : '#9CA3AF',
            borderRadius: 4,
            padding: '2px 8px',
          }}
        >
          {value ? '반영' : '미반영'}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="flex items-center border-none cursor-pointer shrink-0"
        style={{
          width: 48, height: 24, borderRadius: 12,
          background: value ? '#1A80FF' : '#D1D5DB',
          padding: '2px',
          justifyContent: value ? 'flex-end' : 'flex-start',
          transition: 'background 0.2s',
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF' }} />
      </button>
    </div>
  );
}

function 서식지Dropdown({ value, options, onChange, width }: { value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative" style={{ width: width ?? '100%' }}>
      <button
        type="button" onClick={() => setOpen(o => !o)}
        className="w-full h-11 flex items-center justify-between px-3 rounded-lg bg-white cursor-pointer"
        style={{ border: '1px solid #E2E8F0', borderRadius: 8 }}
      >
        <span className="text-[14px] text-[#111827]">{value}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#E2E8F0] rounded-lg z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full h-11 px-3 text-left text-[14px] border-none cursor-pointer flex items-center
                ${opt === value ? 'bg-[#E8F2FF]' : 'bg-white'}`}
              style={{ color: '#111827' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
