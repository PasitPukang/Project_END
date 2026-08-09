'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import StepWizardLayout from './StepWizardLayout';
import { sendOtp, verifyOtp } from '@/lib/apiClient';

export default function OtpModal({ user, onVerifySuccess }) {
  const [demoCode, setDemoCode] = useState(null);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(119);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (user) {
      requestOtp();
    }
  }, [user]);

  const requestOtp = async () => {
    try {
      const result = await sendOtp(user.id, 'LOGIN_2FA');
      if (result.demoCode) setDemoCode(result.demoCode);
      setTimeLeft(119);
    } catch (err) {
      console.error('OTP send error:', err);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError('');
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      setError('คุณรีรหัส OTP ครบโควต้า 3 ครั้งแล้ว');
      return;
    }
    try {
      const result = await sendOtp(user.id, 'LOGIN_2FA');
      if (result.demoCode) setDemoCode(result.demoCode);
      setTimeLeft(119);
      setDigits(['', '', '', '', '', '']);
      setResendCount((prev) => prev + 1);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setError('INCORRECT PASSWORD. PLEASE TRY AGAIN.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(user.id, fullCode, 'LOGIN_2FA');
      onVerifySuccess();
    } catch (err) {
      setError('INCORRECT PASSWORD. PLEASE TRY AGAIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <StepWizardLayout currentStep={2}>
      <div>

        {/* Title Header */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Step-2 การตรวจสอบยืนยัน
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          กรอกรหัส 6 หลักที่ส่งไปยังอีเมลที่คุณลงทะเบียนไว้
        </p>

        {/* Demo OTP Helper Box */}
        {demoCode && (
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
            <span className="text-[11px] text-slate-500 block">🔑 OTP สำหรับทดสอบ (Demo Code):</span>
            <span className="text-lg font-mono font-bold text-[#006653] tracking-widest">{demoCode}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">(หรือพิมพ์รหัสทดสอบ: <span className="font-mono text-slate-700">123456</span>)</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">

          {/* 6 Digit Input Boxes */}
          <div className="grid grid-cols-6 gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-full h-12 text-center font-bold text-xl rounded-lg border ${
                  digit ? 'bg-[#00a86b] text-white border-[#00a86b]' : error ? 'border-red-500 text-red-500 bg-white' : 'border-slate-400 bg-white text-slate-800'
                } focus:outline-none focus:border-[#006653] transition-colors`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold tracking-wider">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Timer & Resend Link */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <div>
              <span>รหัสจะหมดอายุในอีก </span>
              <strong className="text-red-500 font-mono font-bold">{formatTimer(timeLeft)}</strong>
              <span> นาที</span>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCount >= 3}
              className={`font-semibold underline transition-colors ${
                resendCount >= 3
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-[#0066cc] hover:text-[#004499]'
              }`}
            >
              Resend OTP {resendCount > 0 ? `(${resendCount}/3)` : ''}
            </button>
          </div>

          {/* Verify Code Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-3 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-none transition-colors disabled:opacity-60"
          >
            <span>{isLoading ? 'กำลังตรวจสอบ...' : 'Verify Code'}</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        </form>

      </div>
    </StepWizardLayout>
  );
}
