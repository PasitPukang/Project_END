'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import StepWizardLayout from './StepWizardLayout';
import { changePassword } from '@/lib/apiClient';

export default function FirstTimePasswordModal({ user, onPasswordChanged }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setIsLoading(true);
    try {
      const { user: updated } = await changePassword(newPassword);
      setUpdatedUser(updated);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StepWizardLayout currentStep={3}>
      {isSuccess ? (
        /* SUCCESS SCREEN */
        <div className="text-center py-4 space-y-6">
          <div className="w-16 h-16 bg-[#00c885] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              อัปเดตรหัสผ่านสำเร็จเรียบร้อยแล้ว!
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              อัปเดตรหัสผ่านของคุณเรียบร้อยแล้ว คุณสามารถเข้าใช้งานระบบได้ทันที
            </p>
          </div>

          <button
            type="button"
            onClick={() => onPasswordChanged(updatedUser)}
            className="w-full bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-3 rounded-lg font-bold text-sm tracking-wide shadow-none transition-colors"
          >
            เข้าสู่หน้าหลัก (เข้าใช้งานระบบ)
          </button>
        </div>
      ) : (
        /* FORM SCREEN */
        <div>

          {/* FIRST-TIME LOGIN divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">การเข้าสู่ระบบครั้งแรก</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">
            แก้ไขรหัสผ่าน
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            เพื่อความปลอดภัยของบัญชีผู้ใช้ กรุณากำหนดรหัสผ่านใหม่สำหรับการใช้งานครั้งแรก
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                รหัสผ่านใหม่ (New Password)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm px-3.5 py-2.5 pr-10 border border-slate-400 rounded-lg focus:outline-none focus:border-[#006653] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                ยืนยันรหัสผ่านใหม่ (Confirm Password)
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm px-3.5 py-2.5 pr-10 border border-slate-400 rounded-lg focus:outline-none focus:border-[#006653] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Blue Info Box */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>รหัสผ่านควรมีความยาวอย่างน้อย 6 ตัวอักษรขึ้นไป เพื่อความปลอดภัยของบัญชีผู้ใช้</span>
            </div>

            {/* Update & Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-3 rounded-lg font-bold text-sm tracking-wide shadow-none transition-colors disabled:opacity-60"
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่และเข้าสู่ระบบ'}
            </button>
          </form>

        </div>
      )}
    </StepWizardLayout>
  );
}
