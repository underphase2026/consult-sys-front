import { useNavigate } from 'react-router-dom';
import yojeongLogo from '../images/logos/yojeong_Logo2.png';

export default function PublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="header-inner px-6">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center cursor-pointer pr-3 h-10"
            onClick={() => navigate('/sign-in')}
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
          <button className="btn-ghost" onClick={() => navigate('/sign-in')}>로그인</button>
          <button className="btn-cta" onClick={() => navigate('/sign-up')}>무료로 도입하기</button>
        </div>
      </div>
    </header>
  );
}