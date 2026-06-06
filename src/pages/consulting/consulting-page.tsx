import { useNavigate } from 'react-router-dom';
import ConsultingLayout from '../../components/ConsultingLayout';

export default function ConsultingPage() {
  const navigate = useNavigate();

  return (
    <ConsultingLayout>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h2 className="text-2xl font-semibold text-text-dark">상담 유형을 선택해 주세요</h2>

        <div className="flex gap-6">
          <button
            className="w-[360px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
            onClick={() => navigate('/consulting/wireless')}
          >
            <div className="w-[88px] h-[88px] rounded-full bg-[#EBF3FF] flex items-center justify-center">
              <MobileIcon />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-semibold text-text-dark">무선상담</span>
              <div className="flex gap-1.5">
                <Tag label="# 휴대폰 개통" />
              </div>
            </div>
          </button>

          <button
            className="w-[360px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
            onClick={() => navigate('/consulting/wired')}
          >
            <div className="w-[88px] h-[88px] rounded-full bg-[#EBF3FF] flex items-center justify-center">
              <WifiIcon />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-semibold text-text-dark">유선상담</span>
              <div className="flex gap-1.5">
                <Tag label="# 인터넷" />
                <Tag label="# TV" />
                <Tag label="# 인터넷 전화" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </ConsultingLayout>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="px-2 py-0.5 rounded text-xs text-primary bg-[#EBF3FF]">{label}</span>;
}

function MobileIcon() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
      <rect x="7" y="2" width="26" height="40" rx="4" fill="#C8DCFF" />
      <rect x="10" y="5" width="20" height="31" rx="2" fill="#EBF3FF" />
      <rect x="15" y="38" width="10" height="2" rx="1" fill="#7AACFF" />
      <rect x="12" y="8" width="16" height="10" rx="1.5" fill="#7AACFF" opacity="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
      <circle cx="22" cy="32" r="4" fill="#7AACFF" />
      <path d="M12 22c2.667-2.667 6-4 10-4s7.333 1.333 10 4" stroke="#7AACFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M5 15c4.667-4.667 10.333-7 17-7s12.333 2.333 17 7" stroke="#C8DCFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
