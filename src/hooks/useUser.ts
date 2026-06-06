import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserProfileResponseDto {
  id: string;
  phoneNumber: string;
  name: string;
  email?: string;
  birthDate?: string;
  marketingAgreed?: boolean;
  role: string;
  referralCode: string;
}

export function useUser() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      if (!token) {
        navigate('/sign-in');
        return null;
      }
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/sign-in');
          return null;
        }
        throw new Error('내 정보를 불러오는데 실패했습니다.');
      }
      const resData: { success: boolean; data: UserProfileResponseDto } = await response.json();
      setProfile(resData.data);
      return resData.data;
    } catch (err: any) {
      setErrorMsg(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const updateProfile = async (payload: { email?: string; birthDate?: string; marketingAgreed?: boolean }) => {
    try {
      const token = (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('정보 수정에 실패했습니다.');
      }
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...payload } : null);
      
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    errorMsg,
    fetchProfile,
    updateProfile,
  };
}
