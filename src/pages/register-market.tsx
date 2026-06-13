import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';
import marketIcon from '../images/market.svg';

const DUMMY_ADDRESS = { zip: '47513', address: '부산광역시 연제구 중앙대로 1001', detail: '' };

export default function RegisterMarket() {
  const navigate = useNavigate();

  const [bizNumber, setBizNumber] = useState('');
  const [bizVerified, setBizVerified] = useState(false);

  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const handleBizVerify = () => {
    if (bizNumber.replace(/[^0-9]/g, '').length >= 10) {
      setBizVerified(true);
    }
  };

  const handleAddressSearch = () => {
    setZip(DUMMY_ADDRESS.zip);
    setAddress(DUMMY_ADDRESS.address);
  };

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
            <span className="block text-base font-normal text-text-gray leading-7">매장 정보를 입력해주세요</span>
          </div>

          <form
            className="w-full flex flex-col"
            onSubmit={(e) => { e.preventDefault(); navigate('/my-market'); }}
          >
            <div className="field-group">
              <label className="field-label">사업자 상호명</label>
              <input
                type="text"
                placeholder="사업자등록증 상 상호명을 입력해주세요"
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">매장명</label>
              <input
                type="text"
                placeholder="운영 중인 매장명을 입력해 주세요"
                className="form-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">사업자등록번호</label>
              <div className={bizVerified ? 'input-wrap-gray' : 'input-wrap'}>
                <input
                  type="text"
                  placeholder="-없이 숫자만 입력해 주세요"
                  value={bizNumber}
                  onChange={(e) => { setBizNumber(e.target.value); setBizVerified(false); }}
                  readOnly={bizVerified}
                  className={bizVerified ? 'inner-input-gray' : 'inner-input'}
                />
                {bizVerified ? (
                  <span className="text-sm text-text-muted shrink-0">인증 완료</span>
                ) : (
                  <button type="button" className="action-btn" onClick={handleBizVerify}>인증</button>
                )}
              </div>
              {bizVerified && (
                <span className="text-[13px] text-primary leading-5">사업자등록번호가 확인되었어요</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label">매장 주소</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="우편번호"
                  value={zip}
                  readOnly
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover"
                  onClick={handleAddressSearch}
                >
                  검색
                </button>
              </div>
              {address && (
                <input
                  type="text"
                  value={address}
                  readOnly
                  className="form-input"
                />
              )}
              <input
                type="text"
                placeholder="상세주소"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="field-group">
              <div className="label-row">
                <label className="field-label">매장 연락처</label>
                <span className="label-optional">(선택)</span>
              </div>
              <input
                type="tel"
                placeholder="-없이 숫자만 입력해주세요"
                className="form-input"
              />
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
