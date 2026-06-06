import asset1 from '../images/logos/Asset1.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="flex items-center gap-5 mb-5">
          <img src={asset1} alt="UNDERPHASE" className="h-5 object-contain" />
          <a href="/terms" className="footer-link">이용약관</a>
          <a href="#" className="footer-link">개인정보처리방침</a>
          <a href="#" className="footer-link">사업자정보확인</a>
        </div>

        <div className="flex justify-between items-start py-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-dark">언더페이즈 </span>
            <span className="text-[13px] font-normal text-text-gray leading-4">대표 김도현</span>
            <span className="text-[13px] font-normal text-text-gray leading-4">주소 (47340) 부산광역시 부산진구 엄광로176, 23번 307호</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="text-[13px] text-text-gray leading-4">고객센터</span>
              <span className="text-[13px] font-medium text-text-dark leading-4">070-1234-5678</span>
              <span className="text-[13px] text-text-gray leading-4">(유료)</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[13px] text-text-gray leading-4">도입문의</span>
              <span className="text-[13px] font-medium text-text-dark leading-4">help@yo-jeong.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-input-border pt-3 mt-2">
          <p className="text-[13px] text-text-muted leading-4">© 2026 UNDERPHASE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}