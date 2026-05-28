import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

// ── 프로필 ──────────────────────────────────────
import KDH from '../images/KDH.svg';

// ── 상단 ────────────────────────────────────────
import BellIcon    from '../images/bell.svg';
import VisitIcon   from '../images/visit.svg';

// ── 홈 ──────────────────────────────────────────
import HomeIcon    from '../images/home.svg';

// ── 영업 ────────────────────────────────────────
import MeetingIcon   from '../images/meeting.svg';
import CustomerIcon  from '../images/customer.svg';

// ── 운영 ────────────────────────────────────────
import BusinessIcon  from '../images/Business.svg';
import InventoryIcon from '../images/재고.svg';

// ── 관리 ────────────────────────────────────────
import MyMarketIcon  from '../images/mangement.svg';
import OrgIcon       from '../images/organization.svg';

// ── 하단 ────────────────────────────────────────
import SettingIcon   from '../images/setting.svg';
import PayIcon       from '../images/pay.svg';
import SignOutIcon   from '../images/sign-out.svg';

// ─────────────────────────────────────────────────────────────
// 네비게이션 구조 (피그마 기준)
// ─────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    items: [
      { key: 'bell',  label: '알림',    path: '/notifications', icon: BellIcon,  hasArrow: false },
      { key: 'visit', label: '방문예정', path: '/visits',        icon: VisitIcon, hasArrow: false },
    ],
  },
  {
    items: [
      { key: 'home', label: '홈', path: '/main', icon: HomeIcon, hasArrow: false },
    ],
  },
  {
    label: '영업',
    items: [
      { key: 'consulting', label: '상담', path: '/consulting', icon: MeetingIcon,  hasArrow: true  },
      { key: 'customer',   label: '고객', path: '/customer',   icon: CustomerIcon, hasArrow: true  },
    ],
  },
  {
    label: '운영',
    items: [
      { key: 'partner',   label: '거래처', path: '/partner',   icon: BusinessIcon,  hasArrow: true  },
      { key: 'inventory', label: '재고',   path: '/inventory', icon: InventoryIcon, hasArrow: false },
    ],
  },
  {
    label: '관리',
    items: [
      { key: 'store', label: '매장관리', path: '/my-market', icon: MyMarketIcon, hasArrow: false },
      { key: 'org',   label: '조직관리', path: '/org',       icon: OrgIcon,      hasArrow: false },
    ],
  },
];

const BOTTOM_ITEMS = [
  { key: 'settings', label: '환경설정', path: '/settings', icon: SettingIcon },
  { key: 'payment',  label: '결제',     path: '/payment',  icon: PayIcon     },
  { key: 'logout',   label: '로그아웃', path: '/sign-in',  icon: SignOutIcon },
];

// ─────────────────────────────────────────────────────────────
interface SidebarProps {
  storeName?: string;
  userName?: string;
}

export default function Sidebar({
  storeName = '요정폰 가야 동의대점',
  userName  = '홍길동',
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        ${expanded ? 'w-64' : 'w-[80px]'}
        h-screen flex flex-col shrink-0 bg-[#EEEEF4]
        transition-[width] duration-200 ease-in-out overflow-hidden
      `}
    >
      {/* ── 프로필 ── */}
      <div
        className={`flex items-center h-16 border-b border-[#E2E4EC] shrink-0 gap-3
          ${expanded ? 'px-5' : 'justify-center px-0'}`}
      >
        <img src={KDH} alt="프로필" className="w-9 h-9 rounded-full shrink-0 object-cover" />
        {expanded && (
          <>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-[11px] text-[#9CA3AF] truncate leading-tight">{storeName}</span>
              <span className="text-sm font-semibold text-[#111827] truncate leading-snug">{userName}</span>
            </div>
            {/* 접기 화살표 */}
            <svg className="ml-auto shrink-0 text-[#9CA3AF]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </div>

      {/* ── 메인 내비게이션 ── */}
      <div className="flex-1 overflow-y-auto py-2 overflow-x-hidden">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className={si > 0 ? 'border-t border-[#E2E4EC] mt-1 pt-1' : ''}>
            {expanded && section.label && (
              <span className="block px-5 pt-2 pb-1 text-[11px] font-medium text-[#9CA3AF] tracking-wide">
                {section.label}
              </span>
            )}
            <div className="py-0.5 space-y-1">
              {section.items.map(item => (
                <NavItem
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  expanded={expanded}
                  active={isActive(item.path)}
                  hasArrow={item.hasArrow}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── 하단 메뉴 ── */}
      <div className="border-t border-[#E2E4EC] py-2 shrink-0">
        {BOTTOM_ITEMS.map(item => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
            active={false}
            hasArrow={false}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// NavItem — 피그마 아이콘 원본 크기 40×36 사용
// ─────────────────────────────────────────────────────────────
function NavItem({
  icon, label, expanded, active, hasArrow, onClick,
}: {
  icon: string;
  label: string;
  expanded: boolean;
  active: boolean;
  hasArrow: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={`
        flex items-center border-none cursor-pointer outline-none
        transition-colors duration-150 rounded-lg
        ${expanded
          ? 'w-[calc(100%-40px)] mx-5 h-9 gap-2'
          : 'w-10 h-9 justify-center mx-auto'
        }
        ${active
          ? 'bg-white shadow-sm'
          : 'bg-transparent hover:bg-white/70'
        }
      `}
    >
      {/* 아이콘: 피그마 원본 40×36 */}
      <img
        src={icon}
        alt={label}
        className="w-10 shrink-0 object-contain"
        style={{ height: '36px' }}
      />

      {/* 레이블 + 화살표 (확장 시) */}
      {expanded && (
        <>
          <span className={`flex-1 text-sm text-left truncate
            ${active ? 'text-primary font-semibold' : 'text-[#374151]'}`}
          >
            {label}
          </span>
          {hasArrow && (
            <svg className="shrink-0 text-[#9CA3AF]" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </>
      )}
    </button>
  );
}
