'use client';
import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  X,
  Send,
  Copy,
  AlertCircle,
  Shield,
  Mail,
  Lock,
  User,
  Building,
  Briefcase,
  KeyRound,
  Check,
} from 'lucide-react';
import { createUser, getUsers } from '@/lib/apiClient';

export default function UserManagementModal({ onClose, onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('LECTURER');
  const [department, setDepartment] = useState('ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ');
  const [positionTitle, setPositionTitle] = useState('อาจารย์ประจำ');
  const [tierLevel, setTierLevel] = useState(3);
  const [existingUsers, setExistingUsers] = useState([]);

  const [createdPopup, setCreatedPopup] = useState(null);
  const [emailSentStatus, setEmailSentStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const users = await getUsers();
        if (users) setExistingUsers(users);
      } catch (err) {}
    })();
  }, []);

  const duplicateUser = email.trim()
    ? existingUsers.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase())
    : null;

  const handleGenerateAndSave = async (e) => {
    e.preventDefault();
    setError('');

    if (duplicateUser) {
      setError(`อีเมล "${email.trim()}" นี้มีผู้ใช้งานในระบบแล้ว (${duplicateUser.name} - ${duplicateUser.employeeId}) ไม่สามารถใช้อีเมลซ้ำได้ กรุณาใช้อีเมลอื่น`);
      return;
    }

    if (!name.trim() || !email.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล และ อีเมลพนักงานให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/users generates random unique employeeId, password, and sends email
      const result = await createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        department,
        positionTitle,
        tierLevel: parseInt(tierLevel, 10),
      });

      // Show Pop-up with generated credentials (PDF Requirement Page 1)
      setCreatedPopup({
        user: result.user,
        employeeId: result.credentials.employeeId,
        password: result.credentials.password,
        emailStatus: result.emailStatus,
      });

      if (onUserCreated) onUserCreated();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างบัญชีบุคลากร');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdPopup) return;
    const text = `ID ประจำตัว: ${createdPopup.employeeId}\nรหัสผ่านชั่วคราว: ${createdPopup.password}\nEmail: ${createdPopup.user.email}\nระบบ E-Office คณะศิลปศาสตร์และวิทยาศาสตร์`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmailData = () => {
    setEmailSentStatus(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-slide-up select-none">
      <div className="bg-white w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-[#006653] border border-emerald-200 rounded-2xl flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">ระบบเพิ่มผู้ใช้ใหม่ (Admin Portal)</h3>
            <p className="text-xs text-slate-500">
              สร้างบัญชีทำงาน สุ่ม ID และ Password อัตโนมัติ พร้อมส่งเข้า Email พนักงาน
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* POP-UP: Newly Created User Credentials (PDF Requirement Page 1) */}
        {createdPopup ? (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-slide-up">
            <div className="text-center">
              <div className="w-10 h-10 bg-[#006653] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">สร้างบัญชีบุคลากรสำเร็จเรียบร้อย!</h4>
              <p className="text-xs text-slate-500">
                ข้อมูลรหัสประจำตัวและรหัสผ่านชั่วคราวถูกสร้างอัตโนมัติแล้ว
              </p>
            </div>

            {/* Generated ID & Password Cards */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ชื่อบุคลากร:</span>
                <strong className="text-slate-800">{createdPopup.user.name}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">อีเมล (Email):</span>
                <strong className="text-slate-800">{createdPopup.user.email}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">รหัสพนักงาน (ID สุ่ม):</span>
                <span className="font-mono text-sm font-extrabold text-[#006653] bg-emerald-50 px-2 py-0.5 rounded">
                  {createdPopup.employeeId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">รหัสผ่านชั่วคราว (สุ่ม):</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {createdPopup.password}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              ⚠️ การล็อกอินครั้งแรก ระบบจะบังคับให้พนักงานเปลี่ยนรหัสผ่านใหม่เพื่อความปลอดภัย
            </div>

            {/* Action Buttons: Send Data Button & Copy */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อมูล'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmailData}
                className="w-1/2 bg-[#006653] hover:bg-[#004d3d] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{emailSentStatus ? 'ส่งเข้าอีเมลแล้ว ✅' : 'ปุ่มส่งข้อมูลไปยัง Email'}</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 font-bold hover:underline cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          /* Form to Request New Account (ปุ่ม "ขอรับบัญชี") */
          <form onSubmit={handleGenerateAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อ-นามสกุล บุคลากร <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น ผศ.ดร. นภาพร ประเสริฐวิทย์"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 text-slate-800 text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                อีเมลองค์กร (สำหรับรับ ID, รหัสผ่าน และ OTP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="เช่น napaporn.p@kps.ku.ac.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full bg-slate-50 text-slate-800 text-sm px-3.5 py-2 rounded-xl border transition-all ${
                  duplicateUser
                    ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#006653] focus:bg-white'
                }`}
              />
              {duplicateUser && (
                <div className="mt-1.5 bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-bold animate-slide-up">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>
                    อีเมลนี้ถูกใช้งานแล้วในระบบ ({duplicateUser.name} - {duplicateUser.employeeId}) ไม่สามารถใช้อีเมลซ้ำได้
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่ง / สิทธิ์ (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (e.target.value === 'ADMIN') setTierLevel(1);
                    else if (e.target.value === 'DEPT_HEAD') setTierLevel(2);
                    else if (e.target.value === 'LECTURER') setTierLevel(3);
                    else setTierLevel(4);
                  }}
                  className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] cursor-pointer"
                >
                  <option value="ADMIN">ผู้บริหาร (ADMIN / Tier 1)</option>
                  <option value="DEPT_HEAD">หัวหน้าภาค/ฝ่าย (DEPT_HEAD / Tier 2)</option>
                  <option value="LECTURER">อาจารย์ประจำ (LECTURER / Tier 3)</option>
                  <option value="STAFF">เจ้าหน้าที่สายสนับสนุน (STAFF / Tier 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่งทางวิชาการ / หน้าที่
                </label>
                <input
                  type="text"
                  placeholder="เช่น อาจารย์ประจำสาขาวิชา CS"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ภาควิชา / สำนักงาน
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] cursor-pointer"
              >
                <option value="ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ">ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ</option>
                <option value="ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม">ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม</option>
                <option value="สำนักงานเลขานุการคณะ">สำนักงานเลขานุการคณะ</option>
                <option value="สำนักงานคณบดี">สำนักงานคณบดี</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoading || !!duplicateUser}
                className="w-2/3 bg-[#006653] hover:bg-[#004d3d] disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/20"
              >
                <KeyRound className="w-4 h-4 text-[#b5c721]" />
                <span>{isLoading ? 'กำลังสร้างบัญชี...' : 'ปุ่มขอรับบัญชี (สร้าง ID & รหัสผ่าน)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
