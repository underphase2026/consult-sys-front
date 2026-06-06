import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import findPasswordImg from '../../images/illustrations/find_password.svg';
import PhoneVerifyModal from '../../components/PhoneVerifyModal';

export default function FindPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  return (
    <div className="app-page">
      <PublicHeader />
      <main className="main-center">
        <div className="form-card">
          <div className="w-full h-20 flex items-center justify-center">
            <img src={findPasswordImg} alt="비밀번호 찾기" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center">
            <span className="block text-xl font-semibold text-text-dark leading-7">본인 확인이 필요해요</span>
            <span className="block text-base font-normal text-text-gray leading-7">확인 후 새 비밀번호를 설정할 수 있어요</span>
          </div>

          <div className="field-group w-full">
            <label className="field-label">휴대폰 번호</label>
            <div className="input-wrap">
              <input
                type="tel"
                placeholder="-없이 숫자만 입력해주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="inner-input"
              />
              <button
                type="button"
                className="action-btn"
                onClick={() => setShowVerifyModal(true)}
              >
                인증
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showVerifyModal && (
        <PhoneVerifyModal
          phone={phone}
          onVerified={() => navigate('/complete-find-password')}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
}