'use client';
import React, { useState } from 'react';
import { UserPlus, CheckCircle2, X, Send, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { createUser } from '@/lib/apiClient';
import { createNewUser } from '@/lib/storageService';

export default function UserManagementModal({ onClose, onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('LECTURER');
  const [department, setDepartment] = useState('สาขาวิชาวิทยาการคอมพิวเตอร์');

  const [createdPopup, setCreatedPopup] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAndSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('กรุณากรอกชื่อ-นามสกุล และ อีเมลพนักงาน');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/users → server สร้าง employeeId และ password อัตโนมัติ (Prisma Database)
      const result = await createUser({ name, email, role, department });

      // ซิงค์ลง storageService (LocalStorage) เพื่อให้ UI ดร็อปดาวน์อัปเดตตามทันที
      createNewUser({
        id: result.user.id,
        employeeId: result.credentials.employeeId,
        name: result.user.name,
        email: result.user.email,
        password: result.credentials.password,
        role: result.user.role,
        department: result.user.department,
        isFirstLogin: true,
      });

      setCreatedPopup({
        user: result.user,
        employeeId: result.credentials.employeeId,
        password: result.credentials.password,
      });
      setEmailSent(false);

      if (onUserCreated) onUserCreated();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    // Simulate sending credentials email
    setEmailSent(true);
  };

  const handleCopy = () => {
    if (!createdPopup) return;
    const text = `ID: ${createdPopup.employeeId}\nPassword: ${createdPopup.password}\nEmail: ${createdPopup.user.email}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-xl p-6 lg:p-8 rounded-2xl border border-purple-500/40 shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-2xl flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">ระบบเพิ่มผู้ใช้ใหม่ (Admin Portal)</h3>
            <p className="text-xs text-slate-400">สร้างบัญชีพนักงาน สุ่ม ID/Password อัตโนมัติ และส่งข้อมูลเข้า Email</p>
          </div>
        </div>

        {/* POP-UP: Newly Created User Credentials */}
        {createdPopup ? (
          <div className="bg-slate-900/90 border border-purple-500/50 rounded-2xl p-6 space-y-5 animate-scale-up">

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">สร้างบัญชีพนักงานสำเร็จแล้ว!</h4>
              <p className="text-xs text-slate-400">ระบบได้สุ่ม ID และ Password อัตโนมัติสำหรับบัญชีนี้</p>
            </div>

            {/* Credential Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">ชื่อพนักงาน:</span>
                <span className="text-sm font-semibold text-white">{createdPopup.user.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">อีเมลพนักงาน:</span>
                <span className="text-sm font-semibold text-blue-300">{createdPopup.user.email}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">ID (สุ่มอัตโนมัติ):</span>
                <span className="text-base font-mono font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded border border-purple-500/40">
                  {createdPopup.employeeId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Password (สุ่มอัตโนมัติ):</span>
                <span className="text-base font-mono font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded border border-amber-500/40">
                  {createdPopup.password}
                </span>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
                title="คัดลอกข้อมูล"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
              </button>
            </div>

            {/* Email Sent Feedback */}
            {emailSent && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ส่งข้อมูล ID และ Password ไปยัง Email: <strong>{createdPopup.user.email}</strong> เรียบร้อยแล้ว!</span>
              </div>
            )}

            {/* Pop-up Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedPopup(null);
                  setName('');
                  setEmail('');
                }}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                สร้างผู้ใช้ท่านอื่นเพิ่ม
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={emailSent}
                className={`w-1/2 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  emailSent
                    ? 'bg-slate-700 text-slate-400 cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                }`}
              >
                <Send className="w-4 h-4" />
                {emailSent ? 'ส่งข้อมูลเรียบร้อยแล้ว' : 'ปุ่มส่งข้อมูล (ไปยัง Email พนักงาน)'}
              </button>
            </div>

          </div>
        ) : (
          /* FORM: Add New User */
          <form onSubmit={handleGenerateAndSave} className="space-y-4">

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อ - นามสกุล พนักงาน</label>
              <input
                type="text"
                placeholder="เช่น อ. กิตติพงษ์ วิศวกรรมศาสตร์"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">อีเมลพนักงาน (เพื่อส่ง ID & Password)</label>
              <input
                type="email"
                placeholder="เช่น employee@university.ac.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">กำหนดสิทธิ์ (Role & Permission)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="ADMIN">Admin (ผู้ดูแลระบบ)</option>
                  <option value="DEPT_HEAD">หัวหน้าสาขา / หัวหน้าฝ่าย</option>
                  <option value="LECTURER">อาจารย์</option>
                  <option value="STAFF">เจ้าหน้าที่</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">สังกัด / สายงาน</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="สาขาวิชาวิทยาการคอมพิวเตอร์">สาขาวิชาวิทยาการคอมพิวเตอร์</option>
                  <option value="สาขาวิชาวิศวกรรมซอฟต์แวร์">สาขาวิชาวิศวกรรมซอฟต์แวร์</option>
                  <option value="งานสารบรรณและบริหารทั่วไป">งานสารบรรณและบริหารทั่วไป</option>
                  <option value="สำนักงานคณบดี">สำนักงานคณบดี</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                {isLoading ? 'กำลังสร้างบัญชี...' : 'กดปุ่มขอรับบัญชี (สุ่ม ID & Password)'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
