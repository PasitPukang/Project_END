'use client';
import React from 'react';
import { Plus, Inbox, Globe, Building2, User, Send, Shield, LogOut, ChevronLeft, ChevronRight, Layers, FileText } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCreateDoc,
  onLogout,
  unreadCount = 0,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const menuItems = [
    {
      id: 'INBOX',
      label: 'กล่องจดหมายขาเข้า',
      shortLabel: 'ขาเข้า',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'GLOBAL',
      label: 'งานรวมทั้งคณะ',
      shortLabel: 'งานรวม',
      icon: Globe,
    },
    {
      id: 'DEPARTMENT',
      label: 'งานในฝ่ายตัวเอง',
      shortLabel: 'ในฝ่าย',
      icon: Building2,
    },
    {
      id: 'PERSONAL',
      label: 'งานส่วนตัว',
      shortLabel: 'ส่วนตัว',
      icon: User,
    },
    {
      id: 'SENT',
      label: 'จดหมายที่ส่งไปแล้ว',
      shortLabel: 'ส่งแล้ว',
      icon: Send,
    },
  ];

  return (
    <aside
      className={`glass-ku-sidebar text-slate-300 flex flex-col justify-between shrink-0 select-none z-20 sticky top-0 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Top Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-[#b5c721] font-bold text-sm">
                KU
              </div>
              <div className="truncate">
                <span className="font-extrabold text-sm text-white tracking-wider block leading-none">
                  E-OFFICE <span className="text-[#b5c721]">+</span>
                </span>
                <span className="text-[10px] text-emerald-300/70 font-medium tracking-wider uppercase">
                  FLAS KPS
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-[#b5c721] font-bold text-sm">
                KU
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer hidden md:flex items-center justify-center"
            title={isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Action Button: Create Circular Letter */}
        <div className="p-3">
          <button
            onClick={onOpenCreateDoc}
            className={`w-full bg-gradient-to-r from-[#00a86b] to-[#006653] hover:from-[#00c885] hover:to-[#008766] text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-950/60 hover-lift cursor-pointer active:scale-95 group border border-emerald-400/20 flex items-center justify-center ${
              isCollapsed ? 'p-3' : 'py-3 px-3.5 gap-2 text-xs sm:text-sm'
            }`}
            title="สร้างจดหมายเวียน"
          >
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300 shrink-0" />
            {!isCollapsed && <span className="truncate">สร้างจดหมายเวียน</span>}
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="mt-2 space-y-1 px-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#00a86b] text-white shadow-md shadow-emerald-900/50 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-emerald-300/80'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[11px] font-black px-2 py-0.2 rounded-full shadow-xs ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Section (For ADMIN Role) */}
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group cursor-pointer ${
                isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                activeTab === 'ADMIN'
                  ? 'bg-[#00a86b] text-white shadow-md shadow-emerald-900/50 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="ผู้ดูแลระบบ (Admin)"
            >
              <div className="flex items-center gap-3 truncate">
                <Shield className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'ADMIN' ? 'text-white' : 'text-amber-400'}`} />
                {!isCollapsed && <span className="truncate">ผู้ดูแลระบบ</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  ADMIN
                </span>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-bold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all cursor-pointer group ${
            isCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3.5 py-2.5'
          }`}
          title="ออกจากระบบ (Sign Out)"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform text-rose-400" />
          {!isCollapsed && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
}
