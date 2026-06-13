import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// ── 타입 ──────────────────────────────────────────────────────────
interface ConsultLine {
  type: '무선' | '유선';
  device: string;
  updatedAt: string;
}
interface ConsultItem {
  id: string;
  createdAt: string;
  lines: ConsultLine[];
}
interface VisitItem {
  code: string;
  time: string;
  name: string;
  phone: string;
}
interface TimeGroup<T> {
  hour: string;
  items: T[];
}

// ── Mock 데이터 ───────────────────────────────────────────────────
const MOCK_CONSULTS: TimeGroup<ConsultItem>[] = [
  {
    hour: '11시',
    items: [
      {
        id: '#20260611-7135', createdAt: '11:12 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
      {
        id: '#20260611-7136', createdAt: '11:20 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
      {
        id: '#20260611-7137', createdAt: '11:25 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
    ],
  },
  {
    hour: '12시',
    items: [
      {
        id: '#20260611-7138', createdAt: '12:05 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
      {
        id: '#20260611-7139', createdAt: '12:18 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
      {
        id: '#20260611-7140', createdAt: '12:31 생성됨',
        lines: [
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
          { type: '유선', device: '상품명',               updatedAt: '방금 전 수정' },
          { type: '무선', device: 'SKT_아이폰 17e 256GB', updatedAt: '방금 전 수정' },
        ],
      },
    ],
  },
];

const MOCK_VISITS: TimeGroup<VisitItem>[] = [
  {
    hour: '11시',
    items: [
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
    ],
  },
  {
    hour: '12시',
    items: [
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
      { code: 'CV575', time: '14:30', name: '김*현', phone: '010-5723-1548' },
    ],
  },
];


// ── 상담 카드 아이템 ──────────────────────────────────────────────
function ConsultCard({ item, onResume }: { item: ConsultItem; onResume: () => void }) {
  return (
    <div className="flex flex-col rounded-lg" style={{ background: '#F8F9FA', padding: 12, gap: 12, width: 672 }}>
      {/* 상단 행: 상담번호 + 이어서 */}
      <div className="flex items-center justify-between" style={{ height: 20 }}>
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-semibold text-[#111827]">{item.id}</span>
          <span className="text-[13px] text-[#9CA3AF]">{item.createdAt}</span>
        </div>
        <button onClick={onResume} className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0">
          <span className="text-[13px] text-[#1A80FF]">이어서</span>
          <svg width="4" height="7" viewBox="0 0 4 7" fill="none">
            <path d="M1 1L3.5 3.5L1 6" stroke="#1A80FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 상세 정보 행들 — 좌측 강조선 */}
      <div style={{ paddingLeft: 4 }}>
        <div className="flex flex-col gap-2" style={{ paddingLeft: 8, borderLeft: '1px solid #E2E8F0' }}>
          {item.lines.map((line, i) => (
            <div key={i} className="flex items-center justify-between" style={{ height: 16 }}>
              <div className="flex items-center gap-1">
                <span
                  className="text-[14px]"
                  style={{ color: line.type === '무선' ? '#1A80FF' : '#2E9E5E' }}
                >
                  {line.type}
                </span>
                <span className="text-[14px] font-medium text-[#6B7280]">{line.device}</span>
              </div>
              <span className="text-[13px] text-[#9CA3AF]">{line.updatedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 방문 예정 카드 아이템 ─────────────────────────────────────────
function VisitCard({ item }: { item: VisitItem }) {
  return (
    <div className="flex flex-col rounded-lg" style={{ background: '#F8F9FA', padding: 12, gap: 12, width: 304 }}>
      {/* 상단: 코드 + 시간 / 이름 + 전화 */}
      <div className="flex flex-col gap-1" style={{ width: 280 }}>
        <div className="flex items-center justify-between" style={{ height: 20 }}>
          <span className="text-[16px] font-semibold text-[#111827]">{item.code}</span>
          <span className="text-[13px] text-[#1A80FF]">{item.time}</span>
        </div>
        <div className="flex items-center gap-1" style={{ height: 16 }}>
          <span className="text-[13px] text-[#9CA3AF]">{item.name}</span>
          <span className="text-[13px] text-[#9CA3AF]">{item.phone}</span>
        </div>
      </div>

      {/* 태그 행 — 좌측 강조선 */}
      <div style={{ paddingLeft: 4 }}>
        <div className="flex items-center gap-1" style={{ paddingLeft: 8, borderLeft: '1px solid #E2E8F0', height: 16 }}>
          <span className="text-[14px] text-[#1A80FF]">무선</span>
          <span className="text-[14px] font-medium text-[#6B7280]">SKT_아이폰 17e 256GB</span>
        </div>
      </div>
    </div>
  );
}

// ── 시간 그룹 헤더 ────────────────────────────────────────────────
function TimeHeader({ hour }: { hour: string }) {
  return (
    <div
      className="flex items-center"
      style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 8, gap: 10 }}
    >
      <span className="text-[13px] text-[#9CA3AF]">{hour}</span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────
export default function ConsultingMain() {
  const navigate = useNavigate();
  const [visitDate, setVisitDate]   = useState('6월 12일');
  const [visitSearch, setVisitSearch] = useState('');

  const handlePrevDate = () => setVisitDate(prev => prev); // TODO: 날짜 이동 구현
  const handleNextDate = () => setVisitDate(prev => prev);

  return (
    <div
      style={{
        display:    'flex',
        width:      1920,
        height:     1080,
        minWidth:   1200,
        maxWidth:   1920,
        maxHeight:  1080,
        background: '#F5F5F8',
        overflow:   'hidden',
      }}
    >
      {/* ── 사이드바 ── */}
      <Sidebar />

      {/* ── 우측 컨텐츠 영역 ── */}
      <div className="flex flex-col" style={{ flex: 1, height: 1080, minWidth: 0 }}>

        {/* ── 헤더 ── */}
        <header
          className="flex items-center justify-between shrink-0"
          style={{ height: 56, paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}
        >
          <span className="text-[18px] font-semibold text-[#111827]">고객상담</span>
          <button
            onClick={() => navigate('/consulting/session')}
            className="flex items-center justify-center text-white text-[16px] font-semibold rounded-lg border-none cursor-pointer"
            style={{ width: 200, height: 40, background: '#1A80FF' }}
          >
            + 새 상담 시작
          </button>
        </header>

        {/* ── 콘텐츠 영역 ── */}
        <div
          className="flex flex-col items-center"
          style={{ flex: '1 0 0', alignSelf: 'stretch', padding: '60px 20px' }}
        >
          {/* 1080px 카드 그룹 (712 + 24gap + 344 = 1080) */}
          <div className="flex" style={{ gap: 24, width: 1080, alignItems: 'flex-start' }}>

            {/* ── 좌측 카드: 금일 진행 중 상담 ── */}
            <div
              className="flex flex-col rounded-xl"
              style={{ width: 712, height: 680, background: '#FFFFFF', border: '1px solid #E2E8F0', padding: 20, gap: 24, overflow: 'hidden' }}
            >
              {/* 카드 헤더 */}
              <div className="flex items-center gap-1 shrink-0" style={{ height: 24 }}>
                <span className="text-[16px] font-semibold text-[#111827]">금일 진행 중 상담</span>
                <span
                  className="text-[13px] text-[#1A80FF] flex items-center"
                  style={{ background: '#E8F2FF', borderRadius: 100, paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, height: 20 }}
                >
                  총 6건
                </span>
              </div>

              {/* 상담 목록 (스크롤) */}
              <div className="flex flex-col overflow-y-auto" style={{ flex: 1, gap: 24 }}>
                {MOCK_CONSULTS.map((group, gi) => (
                  <div key={gi} className="flex flex-col" style={{ gap: 12 }}>
                    <TimeHeader hour={group.hour} />
                    <div className="flex flex-col" style={{ gap: 8 }}>
                      {group.items.map((item, ii) => (
                        <ConsultCard key={ii} item={item} onResume={() => navigate('/consulting/session')} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 우측 카드: 방문 예정 ── */}
            <div
              className="flex flex-col rounded-xl"
              style={{ width: 344, height: 680, background: '#FFFFFF', border: '1px solid #E2E8F0', padding: 20, gap: 24, overflow: 'hidden' }}
            >
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between shrink-0" style={{ height: 24 }}>
                {/* 제목 + 배지 */}
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#111827]">방문 예정</span>
                  <span
                    className="text-[13px] text-[#1A80FF] flex items-center"
                    style={{ background: '#E8F2FF', borderRadius: 100, paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, height: 20 }}
                  >
                    총 6건
                  </span>
                </div>
                {/* 날짜 내비게이터 */}
                <div className="flex items-center" style={{ gap: 0, height: 24 }}>
                  <button
                    onClick={handlePrevDate}
                    className="flex items-center justify-center bg-transparent border-none cursor-pointer"
                    style={{ width: 24, height: 24 }}
                  >
                    <svg width="4" height="7" viewBox="0 0 4 7" fill="none">
                      <path d="M3 1L0.5 3.5L3 6" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-[14px] text-[#1A80FF]">{visitDate}</span>
                  <button
                    onClick={handleNextDate}
                    className="flex items-center justify-center bg-transparent border-none cursor-pointer"
                    style={{ width: 24, height: 24 }}
                  >
                    <svg width="4" height="7" viewBox="0 0 4 7" fill="none">
                      <path d="M1 1L3.5 3.5L1 6" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* 검색 입력 */}
              <div
                className="flex items-center justify-between shrink-0 rounded-lg"
                style={{ height: 44, paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 8, background: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <input
                  type="text"
                  value={visitSearch}
                  onChange={e => setVisitSearch(e.target.value)}
                  placeholder="고객명 또는 견적코드 입력"
                  className="text-[14px] bg-transparent border-none outline-none text-[#111827] placeholder:text-[#9CA3AF]"
                  style={{ flex: 1 }}
                />
                <div className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#9CA3AF" strokeWidth="1.3"/>
                    <path d="M10 10L13 13" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* 방문 목록 (스크롤) */}
              <div className="flex flex-col overflow-y-auto" style={{ flex: 1, gap: 24 }}>
                {MOCK_VISITS.map((group, gi) => (
                  <div key={gi} className="flex flex-col" style={{ gap: 12 }}>
                    <TimeHeader hour={group.hour} />
                    <div className="flex flex-col" style={{ gap: 12 }}>
                      {group.items.map((item, ii) => (
                        <VisitCard key={ii} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
