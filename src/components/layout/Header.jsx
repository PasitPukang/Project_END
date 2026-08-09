'use client';
import React from 'react';
import { Bell, Settings, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header({ currentUser }) {
  const getRoleBadge = (role, dept, position) => {
    if (position) return { title: position, color: 'bg-emerald-950/60 text-emerald-200 border-emerald-400/30' };
    switch (role) {
      case 'ADMIN':
        return { title: `ผู้บริหารคณะ (${dept || 'สำนักงานคณบดี'})`, color: 'bg-amber-500/20 text-amber-200 border-amber-400/40' };
      case 'DEPT_HEAD':
        return { title: `หัวหน้าภาควิชา/งาน (${dept || 'วิทยาการคอมพิวเตอร์'})`, color: 'bg-sky-500/20 text-sky-200 border-sky-400/40' };
      case 'LECTURER':
        return { title: `อาจารย์ประจำ (${dept || 'วิทยาการคอมพิวเตอร์'})`, color: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/40' };
      case 'STAFF':
        return { title: `เจ้าหน้าที่ (${dept || 'สำนักงานเลขานุการ'})`, color: 'bg-slate-700/60 text-slate-200 border-slate-500/40' };
      default:
        return { title: dept || 'บุคลากร FLAS KPS', color: 'bg-emerald-900/40 text-emerald-100 border-emerald-500/30' };
    }
  };

  const badgeInfo = currentUser ? getRoleBadge(currentUser.role, currentUser.department, currentUser.positionTitle) : null;

  return (
    <header className="glass-emerald text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-30 select-none transition-all">
      {/* System Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>FLAS KPS E-Office System</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 tracking-wider">
              ONLINE
            </span>
          </h2>
          <p className="text-xs text-emerald-100/80 font-medium">
            ระบบจดหมายเวียนอิเล็กทรอนิกส์ คณะศิลปศาสตร์และวิทยาศาสตร์
          </p>
        </div>
      </div>

      {/* Right Controls & User Info */}
      <div className="flex items-center gap-6">
        {/* Action Icons */}
        <div className="flex items-center gap-2 border-r border-white/20 pr-6">
          <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative group" title="การแจ้งเตือน">
            <Bell className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse-glow"></span>
          </button>
          <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all group" title="ตั้งค่าระบบ">
            <Settings className="w-5 h-5 text-emerald-100 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>

        {/* User Profile Pill */}
        {currentUser && (
          <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 shadow-sm">
            <div className="text-right">
              <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border text-right inline-block ${badgeInfo?.color}`}>
                {badgeInfo?.title}
              </div>
              <div className="text-sm font-extrabold text-white tracking-wide mt-0.5">
                {currentUser.name}
              </div>
            </div>

            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-emerald-300/80 overflow-hidden flex items-center justify-center font-bold text-white shadow-md shrink-0 relative group">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <span className="text-xs tracking-wider text-emerald-200">
                  {currentUser.name?.substring(0, 2) || 'KU'}
                </span>
              )}
              {currentUser.role === 'ADMIN' && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-amber-400 text-slate-900 p-0.5 rounded-full border border-white" title="Admin User">
                  <ShieldCheck className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
