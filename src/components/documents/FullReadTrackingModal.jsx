'use client';
import React, { useState } from 'react';
import { X, Search, CheckCircle2 } from 'lucide-react';

export default function FullReadTrackingModal({ onClose, readLogs = [], totalRecipients = 30 }) {
  const [filter, setFilter] = useState('ALL'); // ALL, READ, UNREAD
  const [search, setSearch] = useState('');

  // Demo fallback list matching wireframe names if logs list is short
  const demoRecipients = [
    { name: 'สมชัย นะจะ', role: 'รองประธานฝ่ายปฏิบัติการ', isRead: true, readAt: '10:42 AM' },
    { name: 'สมจิตร จิตหลุด', role: 'ประธานฝ่ายปฏิบัติการ', isRead: true, readAt: '11:15 AM' },
    { name: 'ชัยแก้ว นำแสง', role: 'Regional Head', isRead: false, readAt: '--:--' },
    { name: 'ชาตชาย หมายหญิง', role: 'IT Support', isRead: true, readAt: '01:05 PM' },
    { name: 'สมชาย ชาย', role: 'Compliance Officer', isRead: false, readAt: '--:--' },
    { name: 'วรินธร สถาพร', role: 'Human Resources Manager', isRead: true, readAt: '02:15 PM' },
  ];

  const recipientList = readLogs.length > 0
    ? readLogs.map(l => ({
        name: l.userName || 'พนักงาน',
        role: l.userRole || 'เจ้าหน้าที่',
        isRead: true,
        readAt: new Date(l.readAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      }))
    : demoRecipients;

  const readCount = recipientList.filter(r => r.isRead).length;
  const unreadCount = recipientList.filter(r => !r.isRead).length;
  const percentage = Math.round((readCount / recipientList.length) * 100);

  const filtered = recipientList.filter(r => {
    if (filter === 'READ' && !r.isRead) return false;
    if (filter === 'UNREAD' && r.isRead) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchName = r.name.toLowerCase().includes(term);
      const matchRole = r.role.toLowerCase().includes(term);
      if (!matchName && !matchRole) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 animate-scale-up relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00b074] flex items-center justify-center font-bold">
            📊
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">บันทึกการติดตาม</h3>
            <p className="text-xs text-slate-500">
              อ่านแล้ว <span className="font-bold text-[#00b074]">{percentage}%</span> ({readCount}/{recipientList.length} คน)
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้รับ หรือ ตำแหน่ง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00b074]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'ALL'
                ? 'bg-[#00b074] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilter('READ')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'READ'
                ? 'bg-[#00b074] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            อ่านแล้ว ({readCount})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'UNREAD'
                ? 'bg-[#00b074] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ยังไม่อ่าน ({unreadCount})
          </button>
        </div>

        {/* Recipient List */}
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
          {filtered.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#00b074] font-bold text-xs flex items-center justify-center shrink-0">
                  {item.name.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.role}</div>
                </div>
              </div>

              <div>
                {item.isRead ? (
                  <span className="bg-emerald-100 text-[#00b074] text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    อ่านแล้ว <span className="text-[10px] text-slate-500 ml-1">{item.readAt}</span>
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-400 text-[11px] font-bold px-2.5 py-1 rounded-md">
                    ยังไม่อ่าน <span className="text-[10px] text-slate-400 ml-1">--:--</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Footer Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#00b074] hover:bg-[#009663] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-950/20"
          >
            ตกลง
          </button>
        </div>

      </div>
    </div>
  );
}
