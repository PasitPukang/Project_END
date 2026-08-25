'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Menu, ShieldCheck, Sparkles, Clock, Calendar, CheckCircle2, FileText, ChevronDown } from 'lucide-react';

export default function Header({ currentUser, onToggleSidebar, isSidebarCollapsed, unreadDocs = [], onSelectDoc }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role, dept, position) => {
    if (position) return { title: position, color: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/40' };
    switch (role) {
      case 'ADMIN':
        return { title: `ผู้บริหารคณะ (${dept || 'สำนักงานคณบดี'})`, color: 'bg-amber-500/20 text-amber-200 border-amber-400/40' };
      case 'DEPT_HEAD':
        return { title: `หัวหน้าภาค/ฝ่าย (${dept || 'วิทยาการคอมพิวเตอร์'})`, color: 'bg-sky-500/20 text-sky-200 border-sky-400/40' };
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
    <header className="glass-ku-header text-white px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-md sticky top-0 z-30 select-none transition-all">
      {/* Left: Sidebar Toggle & Faculty Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white cursor-pointer focus:outline-none"
          title={isSidebarCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* KU Brand Emblems */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center font-black text-amber-300 tracking-tighter text-base shadow-sm">
            KU
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1.5">
                <span>FLAS E-Office</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#b5c721] text-[#004d3d] tracking-wider shadow-xs">
                  KU PORTAL
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-emerald-100/80 font-medium hidden sm:block">
              ระบบจดหมายเวียน คณะศิลปศาสตร์และวิทยาศาสตร์ กำแพงแสน
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Clock, Notifications & User Info */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live Date & Clock Pill */}
        <div className="hidden xl:flex items-center gap-3 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-emerald-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#b5c721]" />
            <span>{currentDate}</span>
          </div>
          <div className="h-3 w-px bg-white/20"></div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 hover:bg-white/15 rounded-xl transition-all relative group text-emerald-100"
            title="แจ้งเตือนจดหมายเวียน"
          >
            <Bell className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {unreadDocs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse-glow"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 text-slate-800 p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#006653]" />
                  <span>จดหมายเวียนที่ยังไม่อ่าน</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006653]">
                  {unreadDocs.length} ฉบับ
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {unreadDocs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <span>คุณได้อ่านจดหมายเวียนครบทุกฉบับแล้ว</span>
                  </div>
                ) : (
                  unreadDocs.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (onSelectDoc) onSelectDoc(doc);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {doc.title}
                        </span>
                        {doc.priority === 'VERY_URGENT' && (
                          <span className="shrink-0 text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-bold">
                            ด่วนที่สุด
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        จาก: {doc.authorName} ({doc.authorRole})
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        {currentUser && (
          <div className="flex items-center gap-2.5 sm:gap-3 bg-black/20 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-2xl border border-white/15 shadow-xs">
            <div className="text-right hidden sm:block">
              <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border text-right inline-block ${badgeInfo?.color}`}>
                {badgeInfo?.title}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide mt-0.5">
                {currentUser.name}
              </div>
            </div>

            {/* Avatar Badge */}
            <div className="w-9 h-9 rounded-xl bg-[#004d3d] border-2 border-[#b5c721] overflow-hidden flex items-center justify-center font-bold text-white shadow-xs shrink-0 relative">
              <span className="text-xs tracking-wider text-emerald-200">
                {currentUser.name?.substring(0, 2) || 'KU'}
              </span>
              {currentUser.role === 'ADMIN' && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-amber-400 text-slate-900 p-0.5 rounded-full border border-white" title="Admin User">
                  <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
