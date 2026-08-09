'use client';
import React from 'react';
import { UserPlus, LogOut, Shield, FileText, UserCheck, RefreshCw } from 'lucide-react';
import { getUsers } from '@/lib/storageService';

export default function Navbar({ currentUser, onSwitchUser, onOpenUserManagement, onLogout, onOpenCreateDoc }) {
  const users = getUsers();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>;
      case 'DEPT_HEAD':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><UserCheck className="w-3 h-3" /> หัวหน้าสาขา</span>;
      case 'LECTURER':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs px-2.5 py-1 rounded-full font-medium">อาจารย์</span>;
      case 'STAFF':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-medium">เจ้าหน้าที่</span>;
      default:
        return null;
    }
  };

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-700/50 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-2">
              E-Office
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">v2.0 Real-time</span>
            </h1>
            <p className="text-xs text-slate-400">ระบบหนังสือเวียนและบันทึกข้อความอิเล็กทรอนิกส์</p>
          </div>
        </div>

        {/* User Role Switcher & Action Buttons */}
        {currentUser && (
          <div className="flex items-center flex-wrap gap-3">
            
            {/* Quick Role Switcher for Testing Persona Scope */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>สลับมุมมอง User:</span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const targetUser = users.find(u => u.id === e.target.value);
                  if (targetUser && typeof onSwitchUser === 'function') onSwitchUser(targetUser);
                }}
                className="bg-slate-900 text-white font-medium px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    [{u.role}] {u.name} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Create Document Action */}
            <button
              onClick={onOpenCreateDoc}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <FileText className="w-4 h-4" />
              ออกจดหมายเวียนใหม่
            </button>

            {/* Admin Only: เพิ่มผู้ใช้ใหม่ */}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={onOpenUserManagement}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
              >
                <UserPlus className="w-4 h-4" />
                เพิ่มผู้ใช้ใหม่ (Admin)
              </button>
            )}

            {/* Current Active User Info */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <div className="text-right">
                <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </header>
  );
}
