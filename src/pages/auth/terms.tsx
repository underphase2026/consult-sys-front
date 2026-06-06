import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';

const TERMS = [
  {
    title: '이용약관',
    body: `요정 서비스 이용약관에 오신 것을 환영합니다. 본 약관은 언더페이즈(이하 "회사")가 제공하는 요정 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정합니다.\n\n제1조 (목적)\n본 약관은 회사가 제공하는 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리·의무·책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n"서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 요정 관련 제반 서비스를 의미합니다.`,
  },
  {
    title: '개인정보 수집 및 이용',
    body: `(주)언더페이즈(이하 '언더페이즈')은 이용자의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.\n\n이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.\n\n수집 항목: 이름, 휴대폰 번호, 이메일 주소\n수집 목적: 서비스 제공 및 회원 관리\n보유 기간: 회원 탈퇴 시까지`,
  },
  {
    title: '마케팅 수신 동의 (선택)',
    body: `서비스와 관련된 신규 기능, 이벤트, 프로모션 등의 마케팅 정보를 이메일 또는 SMS로 수신하는 것에 동의합니다.\n\n본 동의는 선택 사항이며, 동의하지 않으셔도 서비스 이용에 불이익은 없습니다. 수신 동의 후에도 언제든지 마이페이지에서 수신 여부를 변경할 수 있습니다.`,
  },
];

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="app-page">
      <PublicHeader />
      <main className="flex-1 px-6 py-[60px]">
        <div className="max-w-content mx-auto">
          <button
            className="inline-flex items-center gap-1.5 text-sm text-text-gray bg-transparent border-none cursor-pointer mb-6 p-0"
            onClick={() => navigate(-1)}
          >
            ← 뒤로가기
          </button>
          <h1 className="text-xl font-semibold text-text-dark mb-6">약관 및 정책</h1>
          {TERMS.map((t) => (
            <div key={t.title} className="mb-10">
              <h2 className="text-lg font-semibold text-text-dark mb-3 pb-2 border-b border-input-border">
                {t.title}
              </h2>
              <p className="text-sm text-text-gray leading-relaxed">
                {t.body.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}