import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const publicPaths = [
  '/sign-in',
  '/sign-up',
  '/complete-sign-up',
  '/find-password',
  '/complete-find-password'
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 토큰 검사 및 리다이렉트
  useEffect(() => {
    const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/sign-in', { replace: true });
    }
  }, [location, navigate]);

  // 전역 fetch 인터셉터를 통한 401 에러 감지
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          localStorage.removeItem('accessToken'); sessionStorage.removeItem('accessToken');;
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = '/sign-in';
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
