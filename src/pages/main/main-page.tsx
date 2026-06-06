import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-text-gray mb-4">메인 페이지</p>
        <button
          onClick={() => navigate('/my-market')}
          className="px-6 py-3 bg-primary text-white border-none rounded-lg cursor-pointer hover:bg-primary-hover"
        >
          내 매장으로 이동
        </button>
      </div>
    </div>
  );
}