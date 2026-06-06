import { useState } from 'react';

interface LoginResponseDto {
  accessToken: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const login = async (phoneNumber: string, password: string, keepLogin: boolean) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        const msg = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message;
        throw new Error(msg || '로그인에 실패했습니다.');
      }

      const resData: { success: boolean; data: LoginResponseDto } = await response.json();
      if (keepLogin) {
        localStorage.setItem('accessToken', resData.data.accessToken);
        sessionStorage.removeItem('accessToken');
      } else {
        sessionStorage.setItem('accessToken', resData.data.accessToken);
        localStorage.removeItem('accessToken');
      }
      
      // Clear temporary consulting tabs so they don't leak between accounts
      sessionStorage.removeItem('consulting-tabs');
      sessionStorage.removeItem('consulting-active-tab-id');
      
      return true;
    } catch (err: any) {
      setErrorMsg(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      const response = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        const msg = errorData.error?.message || errorData.message;
        throw new Error(msg || '인증번호 발송에 실패했습니다.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const verifyCode = async (phoneNumber: string, verificationCode: string) => {
    try {
      const response = await fetch('/api/auth/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });

      if (response.ok) {
        const resData = await response.json();
        // 백엔드가 { success: true, data: { phoneVerifyToken: ... } } 형식으로 반환한다고 가정
        return resData.data;
      } else {
        const errorData = await response.json();
        const msg = errorData.error?.message || errorData.message;
        throw new Error(msg || '인증번호가 일치하지 않습니다.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const issueResetToken = async (phoneNumber: string) => {
    try {
      const response = await fetch('/api/auth/reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        const resData = await response.json();
        return resData.data.resetToken; // { success: true, data: { resetToken: '...' } }
      } else {
        const errorData = await response.json();
        const msg = errorData.error?.message || errorData.message;
        throw new Error(msg || '비밀번호 재설정 토큰 발급에 실패했습니다.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const forgotPassword = async (resetToken: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        const msg = errorData.error?.message || (Array.isArray(errorData.message) ? errorData.message[0] : errorData.message);
        throw new Error(msg || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (role: 'owner' | 'staff', data: any, phoneVerifyToken: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/auth/register/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${phoneVerifyToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.error?.message || (Array.isArray(errorData.message) ? errorData.message[0] : errorData.message);
        throw new Error(msg || '회원가입에 실패했습니다.');
      }

      const resData = await response.json();
      return resData;
    } catch (err: any) {
      setErrorMsg(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    sendVerificationCode,
    verifyCode,
    issueResetToken,
    forgotPassword,
    isLoading,
    errorMsg,
  };
}
