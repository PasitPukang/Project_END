'use client';
import React, { useState, useEffect } from 'react';
import { Mail, Clock, KeyRound, AlertCircle, CheckCircle2, MailCheck } from 'lucide-react';
import { forgotPasswordRequest, sendOtp, verifyOtp, resetPassword } from '@/lib/apiClient';

export default function ForgotPasswordModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [targetUserId, setTargetUserId] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await forgotPasswordRequest(email);
      setTargetUserId(result.userId);
      setTimeLeft(120);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!targetUserId) return;
    try {
      await sendOtp(targetUserId, 'FORGOT_PASSWORD');
      setTimeLeft(120);
      setOtpCode('');
      setMessage('ส่งรหัส OTP ใหม่ไปยัง Email ของคุณเรียบร้อยแล้ว');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyOtp(targetUserId, otpCode, 'FORGOT_PASSWORD');
      setStep(3);
    } catch (err) {
      setError(err.message || 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(targetUserId, newPassword);
      onSuccess('กู้คืนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วย Password ใหม่');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md p-6 lg:p-8 bg-white rounded-xl border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#006653]/10 text-[#006653] border border-[#006653]/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">ระบบกู้คืนรหัสผ่าน (Reset Password)</h3>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1 && 'กรอก Email เพื่อรับรหัส OTP 6 หลักเข้ากล่องจดหมาย'}
            {step === 2 && `กรอก OTP 6 หลักที่ส่งไปที่ ${email}`}
            {step === 3 && 'กำหนด Password ใหม่สำหรับบัญชีของคุณ'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* STEP 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email พนักงาน</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="เช่น pasitpukang1234567@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white text-slate-800 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-400 focus:outline-none focus:border-[#006653]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-2.5 rounded-lg text-xs font-bold shadow-none disabled:opacity-60"
              >
                {isLoading ? 'กำลังส่ง...' : 'ส่ง OTP กู้คืนรหัสผ่าน'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2.5 text-left">
              <MailCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-800 font-medium">
                ส่งรหัส OTP 6 หลักเข้ากล่องจดหมายอีเมลของคุณแล้ว
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 text-center mb-1">กรอกรหัส OTP 6 หลัก</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="w-full bg-white text-center font-mono text-xl font-bold tracking-[0.4em] text-[#006653] py-2.5 rounded-lg border border-slate-400 focus:outline-none focus:border-[#006653]"
              />
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                หมดอายุใน: <strong className="text-amber-600 font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</strong>
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timeLeft > 0}
                className={timeLeft > 0 ? 'text-slate-400' : 'text-[#0066cc] underline hover:text-[#004499]'}
              >
                ขอรหัสใหม่
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="w-2/3 bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-2.5 rounded-lg text-xs font-bold disabled:opacity-60"
              >
                {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยัน OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">กำหนด Password ใหม่</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-white text-slate-800 text-sm px-4 py-2.5 rounded-lg border border-slate-400 focus:outline-none focus:border-[#006653]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-2.5 rounded-lg text-xs font-bold shadow-none disabled:opacity-60"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
