'use client';
import React from 'react';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { getUsers } from '@/lib/storageService';

export default function Header({ currentUser, onSwitchUser }) {
  const users = getUsers();

  const getRoleDisplayName = (role, dept) => {
    switch (role) {
      case 'ADMIN':
        return `ผู้ดูแลระบบ (${dept || 'IT'})`;
      case 'DEPT_HEAD':
        return `หัวหน้าสาขา (${dept || 'วิทยาการคอมพิวเตอร์'})`;
      case 'LECTURER':
        return `อาจารย์ผู้สอน (${dept || 'วิทยาการคอมพิวเตอร์'})`;
      case 'STAFF':
        return `เจ้าหน้าที่ (${dept || 'สารบรรณ'})`;
      default:
        return dept || 'บุคลากร';
    }
  };

  return (
    <header className="bg-[#00b074] text-white px-8 py-4 flex items-center justify-between shadow-sm select-none">
      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      {/* Right Controls & User Info */}
      <div className="flex items-center gap-6">
        {/* Quick User Switcher for Demo */}
        {currentUser && (
          <div className="hidden lg:flex items-center gap-2 bg-emerald-700/50 px-3 py-1.5 rounded-lg text-xs border border-emerald-400/30">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">สลับ User:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const targetUser = users.find((u) => u.id === e.target.value);
                if (targetUser && typeof onSwitchUser === 'function') onSwitchUser(targetUser);
              }}
              className="bg-emerald-900/80 text-white font-semibold px-2 py-1 rounded border border-emerald-500/40 focus:outline-none cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  [{u.role}] {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
                {getRoleDisplayName(currentUser.role, currentUser.department)}
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
