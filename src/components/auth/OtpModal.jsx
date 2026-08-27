'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertCircle, MailCheck, Sparkles, KeyRound } from 'lucide-react';
import StepWizardLayout from './StepWizardLayout';
import { sendOtp, verifyOtp } from '@/lib/apiClient';

export default function OtpModal({ user, onVerifySuccess }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('ระบบได้ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว');
  const [devCode, setDevCode] = useState(null);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (user && !hasRequestedRef.current) {
      hasRequestedRef.current = true;
      requestOtp();
    }
  }, [user]);

  const requestOtp = async () => {
    try {
      const result = await sendOtp(user.id, 'LOGIN_2FA');
      if (result.email) {
        setSentMessage(`ระบบได้ส่งรหัส OTP ไปยังอีเมล ${result.email} แล้ว`);
      }
      if (result.devOtp) {
        setDevCode(result.devOtp);
      }
      setTimeLeft(120);
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

  const handleAutoFillDev = () => {
    if (!devCode || devCode.length !== 6) return;
    setDigits(devCode.split(''));
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      setError('คุณขอรหัส OTP ครบโควต้า 3 ครั้งแล้ว กรุณารอสักครู่');
      return;
    }
    try {
      const result = await sendOtp(user.id, 'LOGIN_2FA');
      if (result.email) {
        setSentMessage(`ส่งรหัสใหม่ไปยัง ${result.email} เรียบร้อยแล้ว`);
      }
      if (result.devOtp) {
        setDevCode(result.devOtp);
      }
      setTimeLeft(120);
      setDigits(['', '', '', '', '', '']);
      setResendCount((prev) => prev + 1);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setError('กรุณากรอกรหัส OTP ให้ครบทั้ง 6 หลัก');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(user.id, fullCode, 'LOGIN_2FA');
      onVerifySuccess();
    } catch (err) {
      setError(err.message || 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
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
    <StepWizardLayout currentStep={2} isFirstLogin={user?.isFirstLogin}>
      <div>
        {/* Title Header */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Step-2 ยืนยันรหัส OTP (2FA)
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mb-4">
          กรอกรหัสยืนยัน 6 หลักที่ส่งไปยังกล่องจดหมายอีเมลของคุณ
        </p>

        {/* Real Email Info Badge */}
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-left">
          <MailCheck className="w-5 h-5 text-[#006653] shrink-0" />
          <div className="text-xs text-emerald-950 font-medium">
            <div>{sentMessage}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              (ตรวจสอบกล่องข้อความ Inbox หรือ Junk/Spam)
            </div>
          </div>
        </div>

        {/* Development Helper Badge */}
        {devCode && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300/80 rounded-xl p-3 text-left space-y-1.5 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>รหัส OTP ทดสอบ (หรือดูจากอีเมลจริงของคุณ):</span>
              </span>
              <button
                type="button"
                onClick={handleAutoFillDev}
                className="text-[11px] font-bold text-[#006653] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
              >
                คลิกเพื่อกรอกอัตโนมัติ ⚡
              </button>
            </div>
            <div className="font-mono text-lg font-extrabold text-[#006653] tracking-widest bg-white p-1.5 rounded-lg border border-emerald-200 text-center">
              {devCode}
            </div>
            <p className="text-[10px] text-slate-500">
              📧 ระบบได้ส่งอีเมลรหัสนี้ไปยังกล่องจดหมายจริงของคุณเรียบร้อยแล้วเช่นกัน
            </p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Input Boxes */}
          <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-full h-12 text-center font-bold text-xl rounded-xl border ${
                  digit
                    ? 'bg-[#006653] text-white border-[#006653] ring-2 ring-emerald-400'
                    : error
                    ? 'border-rose-400 text-rose-600 bg-rose-50/50'
                    : 'border-slate-300 bg-white text-slate-800'
                } focus:outline-none focus:border-[#006653] transition-all`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold tracking-wider">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Timer & Resend Link */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <div>
              <span>รหัสจะหมดอายุในอีก </span>
              <strong className="text-rose-600 font-mono font-bold">{formatTimer(timeLeft)}</strong>
              <span> นาที</span>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCount >= 3 || timeLeft > 90}
              className={`font-semibold underline transition-colors cursor-pointer ${
                resendCount >= 3 || timeLeft > 90
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-[#006653] hover:text-[#004d3d]'
              }`}
            >
              ขอรหัสใหม่ {resendCount > 0 ? `(${resendCount}/3)` : ''}
            </button>
          </div>

          {/* Verify Code Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#006653] hover:bg-[#004d3d] active:bg-[#00382c] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส OTP'}</span>
            <ShieldCheck className="w-4 h-4 text-[#b5c721]" />
          </button>
        </form>
      </div>
    </StepWizardLayout>
  );
}
