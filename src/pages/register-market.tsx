import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateHeader from '../components/PrivateHeader';
import Footer from '../components/Footer';
import marketIcon from '../images/market.svg';
import PostcodeModal from '../components/PostcodeModal';
import { useStore } from '../hooks/useStore';

export default function RegisterMarket() {
  const navigate = useNavigate();
  const { verifyBusinessNumber, createStore } = useStore();
  const detailedAddressInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    storeBusinessName: '',
    storeName: '',
    businessRegistrationNumber: '',
    postcode: '',
    roadAddress: '',
    detailedAddress: '',
    storePhonenumber: '',
  });

  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'none' | 'success' | 'error'>('none');
  const [verifyMessage, setVerifyMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyBusinessNumber = async () => {
    if (!formData.businessRegistrationNumber) {
      setVerifyStatus('error');
      setVerifyMessage('사업자등록번호를 입력해주세요.');
      return;
    }
    try {
      await verifyBusinessNumber(formData.businessRegistrationNumber);
      setIsVerified(true);
      setVerifyStatus('success');
      setVerifyMessage('사업자등록번호 인증이 완료되었습니다.');
    } catch (e: any) {
      setIsVerified(false);
      setVerifyStatus('error');
      setVerifyMessage(e.message || '인증에 실패했습니다.');
    }
  };

  const handlePostcodeComplete = (data: { zonecode: string; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      postcode: data.zonecode,
      roadAddress: data.address,
    }));
    
    // Allow React state to batch and update DOM before focusing
    setTimeout(() => {
      detailedAddressInputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setVerifyStatus('error');
      setVerifyMessage('사업자등록번호 인증을 완료해주세요.');
      return;
    }
    
    if (!formData.postcode || !formData.roadAddress) {
      alert('매장 주소를 검색하여 입력해주세요.');
      return;
    }

    try {
      const payload = {
        storeBusinessName: formData.storeBusinessName,
        storeName: formData.storeName,
        businessRegistrationNumber: formData.businessRegistrationNumber.replace(/-/g, ''),
        postcode: formData.postcode,
        roadAddress: formData.roadAddress,
        detailedAddress: formData.detailedAddress,
        lat: 37.5665, // 임시 위도
        lng: 126.9780, // 임시 경도
        ...(formData.storePhonenumber ? { storePhonenumber: formData.storePhonenumber.replace(/-/g, '') } : {}),
      };

      await createStore(payload);
      alert('매장이 성공적으로 등록되었습니다.');
      navigate('/my-market');
    } catch (e: any) {
      alert(e.message || '매장 등록에 실패했습니다.');
    }
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

          <form className="w-full flex flex-col" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">사업자 상호명</label>
              <input
                type="text"
                name="storeBusinessName"
                value={formData.storeBusinessName}
                onChange={handleChange}
                placeholder="사업자등록증 상 상호명을 입력해주세요"
                className="form-input"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">매장명</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="운영 중인 매장명을 입력해 주세요"
                className="form-input"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">사업자등록번호</label>
              <div className="flex flex-col gap-1.5">
                <div className="input-wrap">
                  <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => {
                      handleChange(e);
                      setIsVerified(false);
                      setVerifyStatus('none');
                      setVerifyMessage('');
                    }}
                    placeholder="-없이 숫자만 입력해 주세요"
                    className="inner-input"
                    required
                  />
                  <button
                    type="button"
                    className="action-btn disabled:bg-input-disabled-bg disabled:text-text-muted disabled:border-input-border disabled:cursor-not-allowed"
                    onClick={handleVerifyBusinessNumber}
                    disabled={isVerified}
                  >
                    {isVerified ? '인증완료' : '인증'}
                  </button>
                </div>
                {verifyStatus !== 'none' && (
                  <span className={`text-[13px] ml-1 font-medium ${verifyStatus === 'success' ? 'text-primary' : 'text-[#EF4444]'}`}>
                    {verifyMessage}
                  </span>
                )}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">매장 주소</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  readOnly
                  placeholder="우편번호"
                  className="form-input flex-1 bg-gray-50 cursor-not-allowed text-text-gray"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPostcodeModalOpen(true)}
                  className="w-[100px] h-input shrink-0 text-base font-semibold text-link bg-secondary-bg border-none rounded-lg cursor-pointer hover:bg-secondary-hover"
                >
                  검색
                </button>
              </div>
              <input
                type="text"
                name="roadAddress"
                value={formData.roadAddress}
                readOnly
                placeholder="기본 주소"
                className="form-input mt-2 bg-gray-50 cursor-not-allowed text-text-gray"
                required
              />
              <input
                type="text"
                name="detailedAddress"
                ref={detailedAddressInputRef}
                value={formData.detailedAddress}
                onChange={handleChange}
                placeholder="상세 주소를 입력해주세요"
                className="form-input mt-2"
                required
              />
            </div>

            <div className="field-group">
              <div className="label-row">
                <label className="field-label">매장 연락처</label>
                <span className="label-optional">(선택)</span>
              </div>
              <input
                type="tel"
                name="storePhonenumber"
                value={formData.storePhonenumber}
                onChange={handleChange}
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
      
      <PostcodeModal 
        isOpen={isPostcodeModalOpen} 
        onClose={() => setIsPostcodeModalOpen(false)} 
        onComplete={handlePostcodeComplete} 
      />
    </div>
  );
}