import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import CompleteSignUp from './pages/auth/complete-sign-up';
import FindPassword from './pages/auth/find-password';
import CompleteFindPassword from './pages/auth/complete-find-password';
import MainPage from './pages/main/main-page';
import Terms from './pages/auth/terms';
import MyPage from './pages/user/my-page';
import MyMarket from './pages/market/my-market';
import RegisterMarket from './pages/market/register-market';
import RegisterStaff from './pages/market/register-staff';
import PaymentPage from './pages/consulting/payment-page';
import ConsultingLayout from './components/ConsultingLayout';
import { ConsultingTabsProvider } from './contexts/ConsultingTabsContext';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<MyMarket />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/complete-sign-up" element={<CompleteSignUp />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/complete-find-password" element={<CompleteFindPassword />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/my-market" element={<MyMarket />} />
          <Route path="/register-market" element={<RegisterMarket />} />
          <Route path="/register-staff" element={<RegisterStaff />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* 컨설팅 전체를 단일 라우트로 — URL 변경 없이 탭별 독립 step 상태로 관리 */}
          <Route
            path="/consulting/*"
            element={
              <ConsultingTabsProvider>
                <ConsultingLayout />
              </ConsultingTabsProvider>
            }
          />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
