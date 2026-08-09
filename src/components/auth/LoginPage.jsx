'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, sendOtp, getUsers } from '@/lib/apiClient';

export default function LoginPage({ onLoginSubmit, onOpenForgotPassword, onQuickLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      getUsers()
        .then((users) => setDemoUsers(users.slice(0, 4)))
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password) {
      setError('INCORRECT PASSWORD. PLEASE TRY AGAIN.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await login(userId, password);
      await sendOtp(user.id, 'LOGIN_2FA');
      onLoginSubmit(user);
    } catch (err) {
      setError(err.message || 'INCORRECT PASSWORD. PLEASE TRY AGAIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (user) => {
    setIsLoading(true);
    try {
      await login(user.email, user.password);
      await sendOtp(user.id, 'LOGIN_2FA');
      onQuickLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-white">

      {/* LEFT PANEL: Kasetsart University Branding with exact gradient background */}
      <div 
        className="md:w-[52%] min-h-[280px] md:min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4da49e 0%, #87beab 35%, #dcebe6 70%, #ffffff 100%)'
        }}
      >
        {/* KU Logo Container */}
        <div className="flex flex-col items-start z-10 select-none transform scale-90 md:scale-100">
          <div className="flex items-center text-[#006653] font-black tracking-tighter text-8xl md:text-[140px] leading-none">
            <span>K</span>
            <span>U</span>
          </div>

          {/* Yellow Green Divider Line */}
          <div className="w-full h-3 md:h-4 bg-[#b5c721] my-2"></div>

          {/* KASETSART UNIVERSITY Text */}
          <div className="text-[#006653] font-bold text-2xl md:text-[34px] tracking-[0.18em] leading-tight">
            KASETSART
          </div>
          <div className="text-[#006653] font-bold text-xl md:text-[28px] tracking-[0.22em] leading-tight">
            UNIVERSITY
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="md:w-[48%] flex flex-col justify-between p-8 md:p-16 lg:p-24 bg-white">
        
        <div className="max-w-[400px] w-full mx-auto my-auto py-4">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-[38px] font-bold text-[#006653] leading-tight tracking-tight">
              เข้าใช้งานระบบ
            </h1>
            <h2 className="text-3xl md:text-[38px] font-extrabold text-[#006653] leading-tight tracking-tight mb-3">
              E-OFFICE <span className="text-[#006653] font-bold">+</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              โปรดป้อนข้อมูลประจำตัวของคุณเพื่อเข้าถึงพื้นที่ทำงาน
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                placeholder="Abc@gmail.com"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-white text-slate-800 text-sm px-3.5 py-2.5 border border-slate-400 rounded-none focus:outline-none focus:border-[#006653] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-600">
                  รหัสผู้ใช้
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs text-[#0066cc] hover:underline font-normal"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white text-slate-800 text-sm px-3.5 py-2.5 pr-10 border ${
                    error ? 'border-red-500 text-red-500' : 'border-slate-400'
                  } rounded-none focus:outline-none focus:border-[#006653] transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-red-600 text-[11px] font-bold tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00c885] hover:bg-[#00b074] active:bg-[#009b66] text-white py-3 font-bold text-xs tracking-wider uppercase rounded-none transition-colors shadow-none mt-2 disabled:opacity-60"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'LOGIN'}
            </button>
          </form>

          {/* Quick Login for Demo Mode */}
          {demoUsers.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                ⚡ Quick Demo Login
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(u)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 p-1.5 rounded text-[11px] text-left transition-colors truncate"
                  >
                    <span className="font-bold text-[#006653]">[{u.role}]</span> {u.name}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 py-4">
          <p>© 2026 บริษัท E-Office . สงวนลิขสิทธิ์ .</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <a href="#" className="hover:underline">นโยบายความเป็นส่วนตัว</a>
            <span>•</span>
            <a href="#" className="hover:underline">สนับสนุน</a>
          </div>
        </div>

      </div>

    </div>
  );
}
