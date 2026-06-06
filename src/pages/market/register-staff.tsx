import { useNavigate } from 'react-router-dom';
import PrivateHeader from '../../components/PrivateHeader';
import Footer from '../../components/Footer';
import marketIcon from '../../images/icons/market.svg';

export default function RegisterStaff() {
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <PrivateHeader />
      <main className="main-top">
        <div className="form-card">
          <div className="w-full h-20 flex items-center justify-center mb-2">
            <img src={marketIcon} alt="매장등록" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center mb-5">
            <span className="block text-xl font-semibold text-text-dark leading-7">매장등록</span>
            <span className="block text-base font-normal text-text-gray leading-7">소속 매장의 코드를 입력해주세요</span>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={(e) => { e.preventDefault(); navigate('/my-market'); }}
          >
            <div className="field-group">
              <label className="field-label">매장 코드</label>
              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="매장 코드를 입력해 주세요"
                  className="inner-input"
                />
                <button type="button" className="action-btn">인증</button>
              </div>
            </div>

            <div className="submit-wrap pb-5">
              <button type="submit" className="btn-primary">등록</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}