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
// Active 아이콘 (피그마 active 속성: #B8D4FF 연파랑, #1A80FF 파랑)
// ─────────────────────────────────────────────────────────────
const MeetingActiveIcon = () => (
  <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 shrink-0" style={{ height: '36px' }}>
    <rect width="40" height="36" rx="4" fill="#EEEEF4"/>
    <path d="M13.8394 13.1784C13.8394 12.7522 14.0087 12.3434 14.3101 12.042C14.6115 11.7406 15.0203 11.5713 15.4465 11.5713H24.5536C24.9799 11.5713 25.3887 11.7406 25.6901 12.042C25.9915 12.3434 26.1608 12.7522 26.1608 13.1784V23.8927C26.1608 24.319 25.9915 24.7277 25.6901 25.0291C25.3887 25.3305 24.9799 25.4999 24.5536 25.4999H15.4465C15.0203 25.4999 14.6115 25.3305 14.3101 25.0291C14.0087 24.7277 13.8394 24.319 13.8394 23.8927V13.1784Z" fill="#B8D4FF"/>
    <path d="M17.3215 11.5714C17.3215 11.2873 17.4344 11.0147 17.6353 10.8138C17.8363 10.6129 18.1088 10.5 18.393 10.5H21.6072C21.8914 10.5 22.1639 10.6129 22.3649 10.8138C22.5658 11.0147 22.6787 11.2873 22.6787 11.5714V12.1071C22.6787 12.3913 22.5658 12.6638 22.3649 12.8648C22.1639 13.0657 21.8914 13.1786 21.6072 13.1786H18.393C18.1088 13.1786 17.8363 13.0657 17.6353 12.8648C17.4344 12.6638 17.3215 12.3913 17.3215 12.1071V11.5714Z" fill="#1A80FF"/>
  </svg>
);

const CustomerActiveIcon = () => (
  <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 shrink-0" style={{ height: '36px' }}>
    <rect width="40" height="36" rx="4" fill="#EEEEF4"/>
    <path d="M20.0002 17.6802C21.0186 17.6802 21.9953 17.2756 22.7154 16.5555C23.4356 15.8353 23.8402 14.8586 23.8402 13.8401C23.8402 12.8216 23.4356 11.8449 22.7154 11.1247C21.9953 10.4046 21.0186 10 20.0002 10C18.9817 10 18.005 10.4046 17.2849 11.1247C16.5647 11.8449 16.1602 12.8216 16.1602 13.8401C16.1602 14.8586 16.5647 15.8353 17.2849 16.5555C18.005 17.2756 18.9817 17.6802 20.0002 17.6802Z" fill="#1A80FF"/>
    <path d="M13.6001 25.3601C13.6001 23.6627 14.2744 22.0348 15.4746 20.8345C16.6748 19.6343 18.3027 18.96 20.0001 18.96C21.6975 18.96 23.3253 19.6343 24.5256 20.8345C25.7258 22.0348 26.4001 23.6627 26.4001 25.3601C26.4001 25.5299 26.3327 25.6927 26.2126 25.8127C26.0926 25.9327 25.9298 26.0002 25.7601 26.0002H14.2401C14.0704 26.0002 13.9076 25.9327 13.7875 25.8127C13.6675 25.6927 13.6001 25.5299 13.6001 25.3601Z" fill="#1A80FF"/>
  </svg>
);

const BusinessActiveIcon = () => (
  <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 shrink-0" style={{ height: '36px' }}>
    <rect width="40" height="36" rx="4" fill="#EEEEF4"/>
    <path d="M27.75 15.0196V24.5576C27.75 24.8738 27.6244 25.1771 27.4008 25.4008C27.1771 25.6244 26.8738 25.75 26.5576 25.75H13.4424C13.1262 25.75 12.8229 25.6244 12.5992 25.4008C12.3756 25.1771 12.25 24.8738 12.25 24.5576V15.0196L14.038 11.573C14.2344 11.1872 14.5304 10.861 14.8955 10.6283C15.2606 10.3957 15.6813 10.265 16.1139 10.25H23.8883C24.331 10.2546 24.7639 10.3804 25.1402 10.6136C25.5165 10.8469 25.8217 11.1787 26.0229 11.573L27.75 15.0196Z" fill="#B8D4FF"/>
    <path d="M14.038 11.573L12.25 15.0196H27.75L26.0206 11.573C25.8196 11.1788 25.5145 10.8471 25.1385 10.6139C24.7624 10.3807 24.3297 10.2548 23.8872 10.25H16.1128C15.6804 10.2652 15.2599 10.3959 14.895 10.6286C14.5302 10.8613 14.2343 11.1874 14.038 11.573Z" fill="#1A80FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.3081 15.0196V10.25H20.692V15.0196H19.3081Z" fill="#B8D4FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.9479 17.3077C19.7644 17.3077 19.5884 17.3807 19.4586 17.5104C19.3288 17.6402 19.2559 17.8162 19.2559 17.9997V20.6624H18.3137C18.1982 20.6622 18.0853 20.6964 17.9892 20.7605C17.8931 20.8246 17.8182 20.9158 17.7739 21.0225C17.7297 21.1292 17.7182 21.2466 17.7407 21.3599C17.7633 21.4732 17.819 21.5772 17.9008 21.6588L19.5349 23.2919C19.763 23.5199 20.1328 23.5199 20.3609 23.2919L21.995 21.6577C22.0768 21.5761 22.1324 21.4721 22.155 21.3588C22.1776 21.2455 22.166 21.1281 22.1218 21.0214C22.0776 20.9146 22.0027 20.8235 21.9066 20.7594C21.8105 20.6953 21.6975 20.6611 21.582 20.6613H20.6399V17.9986C20.6399 17.8151 20.5669 17.6391 20.4372 17.5093C20.3074 17.3795 20.1314 17.3077 19.9479 17.3077Z" fill="#1A80FF"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────
// 네비게이션 구조 (피그마 기준)
// ─────────────────────────────────────────────────────────────
interface SubItem {
  label: string;
  path: string;
}

interface NavItemDef {
  key: string;
  label: string;
  path: string;
  icon: string;
  ActiveIcon?: React.ComponentType;
  hasArrow: boolean;
  subItems?: SubItem[];
}

interface NavSection {
  label?: string;
  items: NavItemDef[];
}

const NAV_SECTIONS: NavSection[] = [
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
      {
        key: 'consulting', label: '상담', path: '/consulting', icon: MeetingIcon, ActiveIcon: MeetingActiveIcon, hasArrow: true,
        subItems: [
          { label: '고객상담',  path: '/consulting' },
          { label: '상담 내역', path: '/consulting/history' },
        ],
      },
      {
        key: 'customer', label: '고객', path: '/customer', icon: CustomerIcon, ActiveIcon: CustomerActiveIcon, hasArrow: true,
        subItems: [
          { label: '고객 목록', path: '/customer/list' },
          { label: '사후 관리', path: '/customer/aftercare' },
        ],
      },
    ],
  },
  {
    label: '운영',
    items: [
      {
        key: 'partner', label: '거래처', path: '/partner', icon: BusinessIcon, ActiveIcon: BusinessActiveIcon, hasArrow: true,
        subItems: [
          { label: '개통 정책 관리', path: '/partner/policy' },
          { label: '정책 조회',      path: '/partner/policy-search' },
          { label: '정산',           path: '/partner/settlement' },
        ],
      },
      { key: 'inventory', label: '재고', path: '/inventory', icon: InventoryIcon, hasArrow: false },
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
  const [expanded, setExpanded]           = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const toggleSidebar = () => {
    if (expanded) setOpenDropdowns([]);
    setExpanded(prev => !prev);
  };

  // 접힌 상태: 어떤 항목이든 클릭하면 사이드바만 펼침 (페이지 이동 없음)
  const handleNavClick = (item: NavItemDef) => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    if (item.hasArrow && item.subItems) {
      setOpenDropdowns(prev =>
        prev.includes(item.key) ? prev.filter(k => k !== item.key) : [...prev, item.key]
      );
    } else {
      navigate(item.path);
    }
  };

  // 하단 메뉴도 접힌 상태에서는 사이드바 펼침
  const handleBottomClick = (path: string) => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    navigate(path);
  };

  return (
    // 항상 80px 공간 확보 (flex 레이아웃 밀림 방지)
    <aside className="relative w-[80px] h-screen shrink-0">
      {/* 오버레이 사이드바: 확장 시 콘텐츠 위로 덮어씌움 */}
      <div
        className={`
          absolute left-0 top-0 h-full bg-[#EEEEF4] z-50
          ${expanded ? 'w-64' : 'w-[80px]'}
          flex flex-col transition-[width] duration-200 ease-in-out overflow-hidden
        `}
      >
        {/* ── 프로필 (클릭으로 열기/닫기) ── */}
        <div
          onClick={toggleSidebar}
          className={`flex items-center h-16 border-b border-[#E2E4EC] shrink-0 gap-3 cursor-pointer
            ${expanded ? 'px-5' : 'justify-center px-0'}`}
        >
          <img src={KDH} alt="프로필" className="w-9 h-9 rounded-full shrink-0 object-cover" />
          {expanded && (
            <>
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-[11px] text-[#9CA3AF] truncate leading-tight">{storeName}</span>
                <span className="text-sm font-semibold text-[#111827] truncate leading-snug">{userName}</span>
              </div>
              {/* 피그마 << 이중 화살표: 좌측 #6B7280(진), 우측 #C4C4D0(연), sw=2 */}
              <svg className="ml-auto shrink-0" width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path d="M5 1L1 6L5 11" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 1L8 6L12 11" stroke="#C4C4D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                    ActiveIcon={item.ActiveIcon}
                    label={item.label}
                    expanded={expanded}
                    active={isActive(item.path)}
                    hasArrow={item.hasArrow}
                    subItems={item.subItems}
                    isOpen={openDropdowns.includes(item.key)}
                    onClick={() => handleNavClick(item)}
                    onSubItemClick={(path) => navigate(path)}
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
              onClick={() => handleBottomClick(item.path)}
              onSubItemClick={() => {}}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// NavItem — 피그마 아이콘 원본 크기 40×36 사용
// ─────────────────────────────────────────────────────────────
function NavItem({
  icon, ActiveIcon, label, expanded, active, hasArrow, subItems, isOpen, onClick, onSubItemClick,
}: {
  icon: string;
  ActiveIcon?: React.ComponentType;
  label: string;
  expanded: boolean;
  active: boolean;
  hasArrow: boolean;
  subItems?: SubItem[];
  isOpen?: boolean;
  onClick: () => void;
  onSubItemClick: (path: string) => void;
}) {
  return (
    <div>
      <div
        className={`
          flex items-center rounded-lg transition-colors duration-150
          ${expanded
            ? 'w-[calc(100%-40px)] mx-5 h-9 gap-2'
            : 'w-10 h-9 justify-center mx-auto'
          }
          ${isOpen
            ? 'bg-transparent'
            : active
              ? 'bg-white shadow-sm'
              : 'bg-transparent hover:bg-[#E5E5ED]'
          }
        `}
      >
        {/* 메인 클릭 영역: 드롭다운 열린 상태면 클릭 비활성 */}
        <div
          onClick={!isOpen ? onClick : undefined}
          title={!expanded ? label : undefined}
          className={`flex items-center gap-2 flex-1 h-full min-w-0
            ${!expanded ? 'justify-center' : ''}
            ${!isOpen ? 'cursor-pointer' : 'cursor-default'}
          `}
        >
          {(isOpen && expanded && ActiveIcon)
            ? <ActiveIcon />
            : <img src={icon} alt={label} className="w-10 shrink-0 object-contain" style={{ height: '36px' }} />
          }
          {expanded && (
            <span className={`flex-1 text-sm text-left truncate
              ${active ? 'text-primary font-semibold' : 'text-[#374151]'}`}
            >
              {label}
            </span>
          )}
        </div>

        {/* 화살표: 드롭다운 열린/닫힌 상태 모두 클릭 가능 (유일한 토글 수단) */}
        {hasArrow && expanded && (
          <button
            onClick={onClick}
            className="shrink-0 cursor-pointer bg-transparent border-none p-0 flex items-center outline-none"
          >
            <svg
              className={`text-[#9CA3AF] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* 드롭다운 서브메뉴 — 호버: 배경 #E5E5ED만 변경 */}
      {expanded && isOpen && subItems && subItems.length > 0 && (
        <div className="mx-5 mt-0.5 mb-1">
          {subItems.map(sub => (
            <button
              key={sub.path}
              onClick={() => onSubItemClick(sub.path)}
              className="w-full text-sm text-[#6B7280] text-left py-2 pl-[52px] pr-2 hover:bg-[#E5E5ED] bg-transparent border-none cursor-pointer rounded-md"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
