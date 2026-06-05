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
        throw new Error(errorData.message || '인증번호 발송에 실패했습니다.');
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
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '인증번호가 일치하지 않습니다.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  return {
    login,
    sendVerificationCode,
    verifyCode,
    isLoading,
    errorMsg,
  };
}
