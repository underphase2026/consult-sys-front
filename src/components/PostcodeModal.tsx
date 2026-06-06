import React, { useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';

interface PostcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { zonecode: string; address: string }) => void;
}

export default function PostcodeModal({ isOpen, onClose, onComplete }: PostcodeModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onComplete({
      zonecode: data.zonecode,
      address: fullAddress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-text-dark">우편번호 검색</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-text-gray hover:text-text-dark transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="w-full max-h-[70vh] overflow-y-auto">
          <DaumPostcode onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
