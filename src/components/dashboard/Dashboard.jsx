'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Filter,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Trash2,
  CalendarPlus,
  Building2,
  Globe,
  User,
  Inbox,
  Send,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  Sparkles,
  Download
} from 'lucide-react';
import { getDocuments } from '@/lib/apiClient';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendarUtils';

export default function Dashboard({ currentUser, activeTab = 'INBOX', onOpenDocDetail, onOpenCreateDoc }) {
  const [documents, setDocuments] = useState([]);
  const [hiddenDocIds, setHiddenDocIds] = useState([]); // Soft delete in-memory tracking
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // ALL, NORMAL, URGENT, VERY_URGENT
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  // Helper: check if currentUser has read this document
  const isDocRead = (doc) => {
    if (!currentUser || !doc.readLogs) return false;
    return doc.readLogs.some((log) => log.userId === currentUser.id);
  };

  // Soft Delete Handler (Hides from UI immediately while preserving backend data)
  const handleSoftDelete = (docId, e) => {
    e.stopPropagation();
    if (window.confirm('คุณต้องการซ่อนเอกสารนี้จากหน้ารายการของคุณใช่หรือไม่? (Soft Delete)')) {
      setHiddenDocIds((prev) => [...prev, docId]);
    }
  };

  // Filter Pipeline based on PDF Requirements
  const filteredDocs = documents.filter((doc) => {
    // 1. Soft delete filter
    if (hiddenDocIds.includes(doc.id)) return false;

    // 2. Active Tab filter
    if (activeTab === 'GLOBAL' && doc.boardType !== 'GLOBAL') return false;
    if (activeTab === 'DEPARTMENT' && doc.boardType !== 'DEPARTMENT') return false;
    if (activeTab === 'PERSONAL' && doc.boardType !== 'PERSONAL') return false;
    if (activeTab === 'SENT') {
      if (doc.authorId !== currentUser?.id) return false;
    }
    if (activeTab === 'INBOX') {
      // Inbox contains circulars sent to user or global/department relevant
      if (doc.authorId === currentUser?.id) return false;
    }

    // 3. Search Term filter (Title & Author)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = doc.title?.toLowerCase().includes(term);
      const matchAuthor = doc.authorName?.toLowerCase().includes(term);
      const matchDept = doc.targetScope?.toLowerCase().includes(term);
      if (!matchTitle && !matchAuthor && !matchDept) return false;
    }

    // 4. Priority filter
    if (priorityFilter !== 'ALL' && doc.priority !== priorityFilter) return false;

    // 5. Date Range filter (วัน/เดือน/ปี)
    if (startDate) {
      const docDate = new Date(doc.createdAt).setHours(0, 0, 0, 0);
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      if (docDate < start) return false;
    }
    if (endDate) {
      const docDate = new Date(doc.createdAt).setHours(23, 59, 59, 999);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      if (docDate > end) return false;
    }

    return true;
  });

  const getUrgencyBadge = (priority) => {
    switch (priority) {
      case 'VERY_URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            <span>ด่วนที่สุด</span>
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
            <span>ด่วน</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-[#006653] border border-emerald-200">
            <span>ปกติ</span>
          </span>
        );
    }
  };

  const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    }) + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  // Stats Counters
  const unreadCount = documents.filter((d) => !isDocRead(d) && d.authorId !== currentUser?.id).length;
  const urgentCount = documents.filter((d) => d.priority === 'URGENT' || d.priority === 'VERY_URGENT').length;
  const sentCount = documents.filter((d) => d.authorId === currentUser?.id).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up select-none">
      {/* 📊 KU Bento Grid Quick Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Circulars */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">เอกสารทั้งหมด</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006653] flex items-center justify-center border border-emerald-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#006653]">{documents.length}</span>
            <span className="text-xs text-slate-400">ฉบับ</span>
          </div>
        </div>

        {/* Card 2: Unread Inbox */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-200/80 hover-lift bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">จดหมายรอรับทราบ</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006653] flex items-center justify-center border border-emerald-200">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a86b]">{unreadCount}</span>
            <span className="text-xs text-emerald-600">ฉบับ</span>
          </div>
        </div>

        {/* Card 3: Urgent Tasks */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-rose-100 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">งานด่วน / ด่วนที่สุด</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{urgentCount}</span>
            <span className="text-xs text-rose-400">ฉบับ</span>
          </div>
        </div>

        {/* Card 4: Sent Outbox */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ที่คุณส่งเวียนแล้ว</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">{sentCount}</span>
            <span className="text-xs text-slate-400">ฉบับ</span>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Date Filter Bar (PDF Requirement) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="ค้นหาตามหัวข้อ, ผู้ส่ง หรือกลุ่มเป้าหมาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] focus:bg-white transition-all"
            />
          </div>

          {/* Date Range Filters (วัน/เดือน/ปี) */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="w-1/2 relative">
              <input
                type="date"
                title="ตั้งแต่วันที่"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653]"
              />
            </div>
            <span className="text-xs text-slate-400">-</span>
            <div className="w-1/2 relative">
              <input
                type="date"
                title="ถึงวันที่"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653]"
              />
            </div>
          </div>

          {/* Priority Selector */}
          <div className="md:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] cursor-pointer"
            >
              <option value="ALL">ความสำคัญ: ทั้งหมด</option>
              <option value="NORMAL">ปกติ (Normal)</option>
              <option value="URGENT">ด่วน (Urgent)</option>
              <option value="VERY_URGENT">ด่วนที่สุด (Very Urgent)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button (If any active) */}
        {(searchTerm || startDate || endDate || priorityFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>พบผลลัพธ์การค้นหา {filteredDocs.length} รายการ</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStartDate('');
                setEndDate('');
                setPriorityFilter('ALL');
              }}
              className="text-[#006653] font-bold hover:underline cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* 📑 Document List (Cards) */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-[#006653] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลจดหมายเวียน...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Inbox className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-700">ไม่พบจดหมายเวียนในหมวดหมู่นี้</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              ยังไม่มีเอกสารที่ตรงกับเงื่อนไขการค้นหาของคุณ หรือยังไม่มีการส่งเอกสารในหมวดหมู่นี้
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isRead = isDocRead(doc);
            const isAuthor = doc.authorId === currentUser?.id;
            const calendarUrl = generateGoogleCalendarUrl(doc);

            return (
              <div
                key={doc.id}
                onClick={() => onOpenDocDetail(doc)}
                className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer hover-lift ${
                  !isRead && !isAuthor
                    ? 'border-emerald-300 shadow-sm bg-gradient-to-r from-emerald-50/40 via-white to-white'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Content */}
                  <div className="space-y-2 flex-1">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Urgency Badge */}
                      {getUrgencyBadge(doc.priority)}

                      {/* Board Scope Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.boardType === 'GLOBAL' && <Globe className="w-3 h-3 text-[#006653]" />}
                        {doc.boardType === 'DEPARTMENT' && <Building2 className="w-3 h-3 text-sky-600" />}
                        {doc.boardType === 'PERSONAL' && <User className="w-3 h-3 text-purple-600" />}
                        <span>
                          {doc.boardType === 'GLOBAL' ? 'เวียนทั้งคณะ' : doc.boardType === 'DEPARTMENT' ? 'เฉพาะฝ่าย' : 'ส่งรายบุคคล'}
                        </span>
                      </span>

                      {/* Edited Tag (Requirement Page 2) */}
                      {doc.isEdited && (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          (แก้ไขแล้ว)
                        </span>
                      )}

                      {/* Unread Indicator (Requirement Page 3: ตัวหนา / จุดแจ้งเตือน) */}
                      {!isRead && !isAuthor ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>ยังไม่ได้อ่าน</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>รับทราบแล้ว</span>
                        </span>
                      )}
                    </div>

                    {/* Title (Bold if unread) */}
                    <h3
                      className={`text-sm sm:text-base leading-snug group-hover:text-[#006653] transition-colors ${
                        !isRead && !isAuthor ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'
                      }`}
                    >
                      {doc.title}
                    </h3>

                    {/* Metadata snippet */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 pt-0.5">
                      <span>ผู้ส่ง: <strong className="text-slate-700">{doc.authorName}</strong> ({doc.authorRole})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatThaiDate(doc.createdAt)}
                      </span>
                      {doc.fileName && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {doc.fileName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Calendar */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    {/* Add to Google Calendar (Requirement Page 2) */}
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#006653] border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="เพิ่มลงใน Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Add to Calendar</span>
                    </a>

                    {/* Soft Delete Button (Requirement Page 3) */}
                    <button
                      onClick={(e) => handleSoftDelete(doc.id, e)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="ซ่อนเอกสารจากหน้ารายการ (Soft Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
