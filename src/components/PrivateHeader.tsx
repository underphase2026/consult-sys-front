import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import yojeongLogo from '../images/logos/yojeong_Logo2.png';
import personalImg from '../images/icons/personal.svg';

interface PrivateHeaderProps {
  activePage?: 'my-market' | 'my-page';
}

export default function PrivateHeader({ activePage: _ }: PrivateHeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner px-0">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center cursor-pointer pr-3 h-10"
            onClick={() => navigate('/my-market')}
          >
            <img src={yojeongLogo} alt="요정" className="h-[34px] w-[70px] object-contain" />
          </div>
          <nav className="flex items-center gap-2">
            {['서비스 소개', '이용요금', '고객지원'].map((label) => (
              <button key={label} className="nav-btn">{label}</button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="nav-btn"
            onClick={() => navigate('/my-market')}
          >
            내매장
          </button>
          {open && (
            <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          )}
          <div className="relative w-10 h-10 cursor-pointer z-[200]" onClick={() => setOpen((v) => !v)}>
            <img
              src={personalImg}
              alt="프로필"
              className="w-9 h-9 rounded-full absolute top-0.5 left-0.5 block"
            />
            {open && (
              <div className="avatar-dropdown" onClick={(e) => e.stopPropagation()}>
                {/* 프로필 */}
                <div className="flex items-center gap-3 px-4 py-5">
                  <img src={personalImg} alt="" className="w-[52px] h-[52px] rounded-full shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base font-medium text-text-dark leading-6">홍길동</span>
                    <span className="text-[13px] font-normal text-text-muted leading-4">010-1234-5678</span>
                  </div>
                </div>

                <hr className="border-t border-input-border" />

                <button
                  className="avatar-dropdown-item"
                  onClick={() => { navigate('/my-page'); setOpen(false); }}
                >
                  마이페이지
                </button>
                <button
                  className="avatar-dropdown-item"
                  onClick={() => { navigate('/sign-in'); setOpen(false); }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}