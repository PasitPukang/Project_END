'use client';
import React from 'react';
import { Plus, Mail, FileText, Shield, LogOut, Layers, Sparkles } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreateDoc,
  onLogout,
  unreadCount = 16,
}) {
  return (
    <aside className="w-64 glass-dark text-slate-300 flex flex-col justify-between min-h-screen shrink-0 border-r border-slate-800/80 select-none z-20 sticky top-0 h-screen">
      <div>
        {/* Top Logo Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00b074] shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-wider block leading-none flex items-center gap-1.5">
                E-OFFICE <span className="text-[#00b074]">+</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                FLAS KPS KU
              </span>
            </div>
          </div>
        </div>

        {/* Main Action Button: Create Circular Letter */}
        <div className="p-5">
          <button
            onClick={onOpenCreateDoc}
            className="w-full bg-gradient-to-r from-[#00b074] to-[#008f5d] hover:from-[#00c885] hover:to-[#00a36a] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-950/50 hover-lift cursor-pointer active:scale-95 group border border-emerald-400/20"
          >
            <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
            <span>สร้างจดหมายเวียน</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-1 space-y-1.5 px-3">
          {/* Tab 1: Circular Letters Sent */}
          <button
            onClick={() => setActiveTab('CIRCULAR_LETTERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
              activeTab === 'CIRCULAR_LETTERS'
                ? 'bg-[#00b074] text-white shadow-md shadow-emerald-900/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'CIRCULAR_LETTERS' ? 'text-white' : 'text-slate-400'}`} />
            <span>จดหมายเวียนที่ส่งแล้ว</span>
          </button>

          {/* Tab 2: Messages / Documents */}
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
              activeTab === 'DOCUMENTS'
                ? 'bg-[#00b074] text-white shadow-md shadow-emerald-900/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'DOCUMENTS' ? 'text-white' : 'text-slate-400'}`} />
              <span>จดหมาย</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Tab 3: Admin Portal (Admin Only) */}
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                activeTab === 'ADMIN'
                  ? 'bg-[#00b074] text-white shadow-md shadow-emerald-900/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'ADMIN' ? 'text-white' : 'text-amber-400'}`} />
                <span>ผู้ดูแลระบบ</span>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                ADMIN
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:text-white hover:bg-rose-500/15 transition-all cursor-pointer group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>ออกจากระบบ (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}
