import { useNavigate, useParams } from 'react-router-dom';
import ConsultingLayout from '../../components/ConsultingLayout';

const CARRIER_LABEL: Record<string, string> = {
  skt: 'SKT',
  kt: 'KT',
  lgu: 'LG U+',
};

const PRODUCTS = [
  {
    key: 'internet',
    label: '인터넷',
    desc: '초고속 광랜 인터넷',
    tags: ['기가 인터넷', '안심 인터넷'],
    icon: <InternetIcon />,
  },
  {
    key: 'tv',
    label: 'TV',
    desc: 'IPTV / 케이블 TV',
    tags: ['UHD', '4K', 'VOD'],
    icon: <TvIcon />,
  },
  {
    key: 'phone',
    label: '인터넷 전화',
    desc: '기업용 / 가정용 인터넷 전화',
    tags: ['070 인터넷 전화', 'KT BizCall'],
    icon: <PhoneIcon />,
  },
] as const;

export default function ConsultingWiredProductPage() {
  const navigate = useNavigate();
  const { carrier } = useParams<{ carrier: string }>();
  const carrierLabel = CARRIER_LABEL[carrier ?? ''] ?? carrier?.toUpperCase();

  return (
    <ConsultingLayout>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-semibold text-text-dark">상품을 선택해 주세요</h2>
          <span className="text-sm text-text-muted">{carrierLabel} 유선 상품</span>
        </div>

        <div className="flex gap-6">
          {PRODUCTS.map((product) => (
            <button
              key={product.key}
              className="w-[280px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-5 cursor-pointer hover:shadow-md hover:border-primary transition-all"
              onClick={() => navigate(`/consulting/wired/${carrier}/${product.key}`)}
            >
              <div className="w-[88px] h-[88px] rounded-full bg-[#EBF3FF] flex items-center justify-center">
                {product.icon}
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold text-text-dark">{product.label}</span>
                <span className="text-sm text-text-muted">{product.desc}</span>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs text-primary bg-[#EBF3FF]">
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          className="text-sm text-text-muted hover:text-text-gray bg-transparent border-none cursor-pointer underline"
          onClick={() => navigate('/consulting/wired')}
        >
          ← 이전으로
        </button>
      </div>
    </ConsultingLayout>
  );
}

function InternetIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="8" width="32" height="22" rx="3" fill="#C8DCFF" />
      <rect x="8" y="12" width="24" height="14" rx="1.5" fill="#EBF3FF" />
      <path d="M12 30h16l2 4H10l2-4z" fill="#7AACFF" />
      <path d="M14 22l6-6 6 6" stroke="#7AACFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
      <rect x="4" y="6" width="36" height="26" rx="3" fill="#C8DCFF" />
      <rect x="8" y="10" width="28" height="18" rx="1.5" fill="#EBF3FF" />
      <rect x="14" y="33" width="16" height="3" rx="1.5" fill="#7AACFF" />
      <path d="M18 19l7-4v8l-7-4z" fill="#7AACFF" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="4" width="24" height="32" rx="4" fill="#C8DCFF" />
      <rect x="12" y="8" width="16" height="20" rx="2" fill="#EBF3FF" />
      <circle cx="20" cy="32" r="2" fill="#7AACFF" />
      <path d="M16 14h8M16 17h6" stroke="#7AACFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
