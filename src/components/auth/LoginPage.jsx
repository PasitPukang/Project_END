'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { login, sendOtp } from '@/lib/apiClient';

export default function LoginPage({ onLoginSubmit, onOpenForgotPassword }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password) {
      setError('กรุณากรอก ID/Email และรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await login(userId, password);
      await sendOtp(user.id, 'LOGIN_2FA');
      onLoginSubmit(user);
    } catch (err) {
      setError(err.message || 'รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-white select-none">
      {/* LEFT PANEL: Kasetsart University Portal Identity (Inspired by my.ku.th) */}
      <div
        className="md:w-[50%] lg:w-[52%] min-h-[300px] md:min-h-screen flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #004d3d 0%, #006653 40%, #008766 80%, #b5c721 150%)',
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#b5c721]/15 blur-3xl pointer-events-none"></div>

        {/* KU Identity Crest */}
        <div className="flex flex-col items-start z-10 text-white transform scale-90 sm:scale-100">
          <div className="flex items-center text-white font-black tracking-tighter text-8xl md:text-[130px] leading-none drop-shadow-md">
            <span>K</span>
            <span className="text-[#b5c721]">U</span>
          </div>

          {/* Yellow Green KU Accent Stripe */}
          <div className="w-full h-3 md:h-3.5 bg-[#b5c721] my-3 rounded-full shadow-xs"></div>

          {/* Typography */}
          <div className="font-extrabold text-2xl md:text-[32px] tracking-[0.16em] leading-tight text-white">
            KASETSART
          </div>
          <div className="font-bold text-lg md:text-[24px] tracking-[0.24em] leading-tight text-emerald-100/90">
            UNIVERSITY
          </div>

          <div className="mt-6 pt-5 border-t border-white/20 text-xs sm:text-sm text-emerald-100/90 font-medium space-y-1">
            <p className="font-bold text-[#b5c721]">คณะศิลปศาสตร์และวิทยาศาสตร์</p>
            <p className="text-xs text-emerald-200/80">Faculty of Liberal Arts and Science • Kamphaeng Saen Campus</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form Card */}
      <div className="md:w-[50%] lg:w-[48%] flex flex-col justify-between p-6 sm:p-12 lg:p-20 bg-white">
        <div className="max-w-[420px] w-full mx-auto my-auto py-6">
          {/* Title Banner */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006653] text-xs font-bold border border-emerald-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FLAS KPS E-Office Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
              เข้าสู่ระบบจดหมายเวียน
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              โปรดป้อนบัญชีพนักงานหรืออีเมลองค์กรเพื่อเข้าใช้งาน
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                อีเมลองค์กร หรือ รหัสพนักงาน (ID)
              </label>
              <input
                type="text"
                placeholder="เช่น dean.flas@kps.ku.ac.th หรือ EMP-D01"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#006653] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  รหัสผ่าน (Password)
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs text-[#006653] font-bold hover:underline cursor-pointer"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:border-[#006653] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="mt-2.5 bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006653] hover:bg-[#004d3d] active:bg-[#00382c] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md shadow-emerald-950/20 hover-lift cursor-pointer disabled:opacity-60 mt-2"
            >
              {isLoading ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ (LOGIN)'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 py-4 border-t border-slate-100">
          <p>© 2026 คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Faculty of Liberal Arts and Science, Kasetsart University Kamphaeng Saen</p>
        </div>
      </div>
    </div>
  );
}
