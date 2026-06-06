import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import completePasswordImg from '../../images/illustrations/complete_password.svg';

export default function CompleteFindPassword() {
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <PublicHeader />
      <main className="main-center">
        <div className="form-card">
          <div className="w-full h-20 flex items-center justify-center">
            <img src={completePasswordImg} alt="비밀번호 설정" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center">
            <span className="block text-xl font-semibold text-text-dark leading-7">새 비밀번호 설정</span>
            <span className="block text-base font-normal text-text-gray leading-7">새 비밀번호를 입력해주세요</span>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={(e) => { e.preventDefault(); navigate('/sign-in'); }}
          >
            <div className="field-group">
              <label className="field-label">새 비밀번호</label>
              <input
                type="password"
                placeholder="영문, 숫자 포함 8~20자"
                className="form-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">새 비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호를 한 번 더 입력해 주세요"
                className="form-input"
              />
            </div>
            <div className="submit-wrap">
              <button type="submit" className="btn-primary">비밀번호 변경</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}