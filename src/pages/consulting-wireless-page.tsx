import { useNavigate } from 'react-router-dom';
import ConsultingLayout from '../components/ConsultingLayout';
import SKT from '../images/carriers/SKT.svg';
import KT from '../images/carriers/KT.svg';
import UPlus from '../images/carriers/U+.svg';

const CARRIERS = [
  { key: 'skt', label: 'SKT', logo: SKT },
  { key: 'kt', label: 'KT', logo: KT },
  { key: 'lgu', label: 'LG U+', logo: UPlus },
];

export default function ConsultingWirelessPage() {
  const navigate = useNavigate();

  return (
    <ConsultingLayout>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h2 className="text-2xl font-semibold text-text-dark">통신사를 선택해 주세요</h2>

        <div className="flex gap-6">
          {CARRIERS.map((carrier) => (
            <button
              key={carrier.key}
              className="w-[280px] h-[280px] bg-white rounded-2xl border border-[#E2E4EC] shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md hover:border-primary transition-all"
              onClick={() => navigate(`/consulting/wireless/${carrier.key}`)}
            >
              <img src={carrier.logo} alt={carrier.label} className="w-28 h-28 object-contain" />
              <span className="text-base font-semibold text-text-dark">{carrier.label}</span>
            </button>
          ))}
        </div>

        <button
          className="text-sm text-text-muted hover:text-text-gray bg-transparent border-none cursor-pointer underline"
          onClick={() => navigate('/consulting')}
        >
          ← 이전으로
        </button>
      </div>
    </ConsultingLayout>
  );
}
