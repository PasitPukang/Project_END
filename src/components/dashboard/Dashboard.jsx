'use client';
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, LockKeyhole, FileText, ChevronLeft, ChevronRight, Calendar, Download, AlertTriangle, Layers, Building, Eye, Clock } from 'lucide-react';
import { getDocuments } from '@/lib/apiClient';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendarUtils';

export default function Dashboard({ currentUser, onOpenDocDetail }) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, DEPARTMENT, PERSONAL
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === 'DEPARTMENT' && doc.boardType !== 'DEPARTMENT') return false;
    if (activeTab === 'PERSONAL' && doc.boardType !== 'PERSONAL') return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = doc.title?.toLowerCase().includes(term);
      const matchAuthor = doc.authorName?.toLowerCase().includes(term);
      if (!matchTitle && !matchAuthor) return false;
    }

    return true;
  });

  const getUrgencyBadge = (priority) => {
    switch (priority) {
      case 'VERY_URGENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-200 shadow-sm animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ด่วนที่สุด</span>
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-300">
            <span>ด่วน</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-[#00b074] border border-emerald-200">
            <span>ปกติ</span>
          </span>
        );
    }
  };

  const formatTimeDisplay = (dateString) => {
    if (!dateString) return '10:45 AM';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const urgentCount = documents.filter((d) => d.priority === 'URGENT' || d.priority === 'VERY_URGENT').length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      
      {/* 📊 Bento Grid Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Documents */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm hover-lift border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">จดหมายเวียนทั้งหมด</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{documents.length} <span className="text-xs font-normal text-slate-400">ฉบับ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00b074] flex items-center justify-center border border-emerald-100 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Urgent Documents */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm hover-lift border border-rose-100/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">เอกสารด่วน / ด่วนที่สุด</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{urgentCount} <span className="text-xs font-normal text-rose-400">ฉบับ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-inner">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* Card 3: Scope Distribution */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm hover-lift border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ระดับคำสั่งการ</p>
            <h3 className="text-sm font-bold text-slate-700 mt-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Hierarchical 4-Tiers</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-inner">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: My Department Info */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm hover-lift border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">สังกัดหน่วยงาน</p>
            <h3 className="text-sm font-bold text-[#00b074] mt-2 truncate max-w-[140px]" title={currentUser?.department}>
              {currentUser?.department || 'สำนักงานคณบดี'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 📄 Main Table Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
        
        {/* Card Header: Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>กล่องจดหมายเวียนที่ส่งแล้ว</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00b074]">
                {filteredDocs.length} รายการ
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              แสดงรายการจดหมายเวียนที่ได้รับตามสิทธิ์และลำดับขั้นของบุคลากร FLAS KPS
            </p>
          </div>

          {/* Search Input & Action Icons */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาหัวข้อเรื่อง หรือ ชื่อผู้ส่ง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00b074] focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              onClick={() => setSearchTerm('')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors active:scale-95"
              title="ล้างตัวค้นหา"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={loadData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors active:scale-95 group"
              title="รีเฟรชข้อมูล"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Navigation Filter Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3.5 transition-all relative font-bold ${
              activeTab === 'ALL' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            ทั้งหมด ({documents.length})
            {activeTab === 'ALL' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full shadow-sm"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('DEPARTMENT')}
            className={`pb-3.5 transition-all relative font-bold ${
              activeTab === 'DEPARTMENT' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            ระดับภาควิชา/หน่วยงาน
            {activeTab === 'DEPARTMENT' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full shadow-sm"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('PERSONAL')}
            className={`pb-3.5 transition-all relative font-bold ${
              activeTab === 'PERSONAL' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            คำสั่งเฉพาะตัวบุคคล
            {activeTab === 'PERSONAL' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full shadow-sm"></div>
            )}
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="py-3.5 px-4 w-32">ความเร่งด่วน</th>
                <th className="py-3.5 px-4 w-20">ความลับ</th>
                <th className="py-3.5 px-4">หัวข้อจดหมายเวียน</th>
                <th className="py-3.5 px-4 w-48">ผู้ส่ง / สังกัด</th>
                <th className="py-3.5 px-4 text-center w-40">บันทึกปฏิทิน</th>
                <th className="py-3.5 px-4 text-right w-36">วัน-เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                      <span className="font-semibold text-slate-500">กำลังโหลดรายการจดหมายเวียน...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-medium">
                    ไม่พบรายการจดหมายเวียนในหมวดหมู่นี้
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    {/* 1. ความเร่งด่วน */}
                    <td className="py-4 px-4 font-bold" onClick={() => onOpenDocDetail(doc)}>
                      {getUrgencyBadge(doc.priority)}
                    </td>

                    {/* 2. ความลับ */}
                    <td className="py-4 px-4" onClick={() => onOpenDocDetail(doc)}>
                      {doc.isConfidential ? (
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center" title="เอกสารลับเฉพาะ">
                          <LockKeyhole className="w-4 h-4" />
                        </div>
                      ) : null}
                    </td>

                    {/* 3. หัวข้อ */}
                    <td className="py-4 px-4 font-bold text-slate-800 group-hover:text-[#00b074] transition-colors" onClick={() => onOpenDocDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00b074] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="line-clamp-1 block text-slate-800 group-hover:text-[#00b074] font-bold">
                            {doc.title}
                          </span>
                          <span className="text-[11px] font-normal text-slate-400 block mt-0.5 truncate max-w-md">
                            {doc.content}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. ผู้ส่ง */}
                    <td className="py-4 px-4" onClick={() => onOpenDocDetail(doc)}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-300 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.authorName ? doc.authorName.substring(0, 2) : 'KU'}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-800 text-xs block truncate">
                            {doc.authorName || 'สำนักงานคณบดี'}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {doc.authorRole || 'ผู้บริหาร'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 5. ปุ่มเพิ่มลง Google Calendar / iCal */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={generateGoogleCalendarUrl({
                            title: `[เอกสารเวียน] ${doc.title}`,
                            description: doc.content || doc.title,
                            startDate: doc.createdAt,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00b074] rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold border border-emerald-200/60 active:scale-95 shadow-2xs"
                          title="เพิ่มลง Google Calendar"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Google</span>
                        </a>
                        <button
                          onClick={() => downloadIcsFile({
                            title: `[เอกสารเวียน] ${doc.title}`,
                            description: doc.content || doc.title,
                            startDate: doc.createdAt,
                          })}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold border border-slate-200 active:scale-95 shadow-2xs"
                          title="ดาวน์โหลดไฟล์ .ics สำหรับ Outlook / Apple Calendar"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>iCal</span>
                        </button>
                      </div>
                    </td>

                    {/* 6. วันที่ / เวลา */}
                    <td className="py-4 px-4 text-right font-bold text-slate-600 text-xs" onClick={() => onOpenDocDetail(doc)}>
                      {formatTimeDisplay(doc.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>แสดง {filteredDocs.length} รายการจดหมายเวียน</span>

          <div className="flex items-center gap-1.5 self-center">
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#00b074] text-white font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
