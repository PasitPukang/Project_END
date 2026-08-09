'use client';
import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function Header({ currentUser }) {
  const getRoleDisplayName = (role, dept, position) => {
    if (position) return position;
    switch (role) {
      case 'ADMIN':
        return `ผู้บริหารคณะ (${dept || 'สำนักงานคณบดี'})`;
      case 'DEPT_HEAD':
        return `หัวหน้าภาควิชา/งาน (${dept || 'วิทยาการคอมพิวเตอร์'})`;
      case 'LECTURER':
        return `อาจารย์ประจำ (${dept || 'วิทยาการคอมพิวเตอร์'})`;
      case 'STAFF':
        return `เจ้าหน้าที่ (${dept || 'สำนักงานเลขานุการ'})`;
      default:
        return dept || 'บุคลากร FLAS KPS';
    }
  };

  return (
    <header className="bg-[#00b074] text-white px-8 py-4 flex items-center justify-between shadow-sm select-none">
      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight">FLAS KPS E-Office System</h2>

      {/* Right Controls & User Info */}
      <div className="flex items-center gap-6">
        {/* Action Icons */}
        <div className="flex items-center gap-3 border-r border-emerald-400/40 pr-6">
          <button className="p-1.5 hover:bg-emerald-600/50 rounded-full transition-colors relative" title="การแจ้งเตือน">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-300 rounded-full"></span>
          </button>
          <button className="p-1.5 hover:bg-emerald-600/50 rounded-full transition-colors" title="ตั้งค่า">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Info Pill */}
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-100">
                {getRoleDisplayName(currentUser.role, currentUser.department, currentUser.positionTitle)}
              </div>
              <div className="text-sm font-extrabold text-white">
                {currentUser.name}
              </div>
            </div>

            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white/80 overflow-hidden flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.name?.substring(0, 2) || 'KU'}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
