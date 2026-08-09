'use client';
import React from 'react';
import { Plus, Mail, FileText, Shield, LogOut, Menu, Layers } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreateDoc,
  onLogout,
  unreadCount = 16,
}) {
  return (
    <aside className="w-64 bg-[#24292e] text-slate-300 flex flex-col justify-between min-h-screen shrink-0 border-r border-slate-800 select-none">
      <div>
        {/* Top Logo Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#00b074]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-wide block leading-none">
                E-OFFICE
              </span>
            </div>
          </div>

          <button className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Action Button: Create Circular Letter */}
        <div className="p-5">
          <button
            onClick={onOpenCreateDoc}
            className="w-full bg-[#00b074] hover:bg-[#009663] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>สร้างจดหมายเวียน</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-2 space-y-1 px-3">
          {/* Tab 1: Circular Letters Sent */}
          <button
            onClick={() => setActiveTab('CIRCULAR_LETTERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'CIRCULAR_LETTERS'
                ? 'bg-[#00b074] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>จดหมายเวียนที่ส่งแล้ว</span>
          </button>

          {/* Tab 2: Messages / Documents */}
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'DOCUMENTS'
                ? 'bg-[#00b074] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>จดหมาย</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Tab 3: Admin Portal (Admin Only) */}
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'ADMIN'
                  ? 'bg-[#00b074] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>ผู้ดูแล</span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
