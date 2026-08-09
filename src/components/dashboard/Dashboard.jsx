'use client';
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, LockKeyhole, Mail, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDocuments } from '@/lib/apiClient';

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

  // Filter documents
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

  const getUrgencyElement = (priority) => {
    switch (priority) {
      case 'VERY_URGENT':
        return <span className="font-extrabold text-red-600 text-sm">ด่วนที่สุด</span>;
      case 'URGENT':
        return <span className="font-extrabold text-amber-500 text-sm">ด่วน</span>;
      default:
        return <span className="font-bold text-[#00b074] text-sm">ปกติ</span>;
    }
  };

  const formatTimeDisplay = (dateString) => {
    if (!dateString) return '10:45 AM';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Main Table Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
        
        {/* Card Header: Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
            กล่องจดหมายเวียนที่ส่งแล้ว
          </h2>

          {/* Search Input & Action Icons */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาหัวข้อเรื่อง หรือ ชื่อผู้ส่ง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00b074] transition-colors placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => setSearchTerm('')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="ตัวกรอง"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={loadData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'ALL' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            ทั้งหมด
            {activeTab === 'ALL' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('DEPARTMENT')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'DEPARTMENT' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            หน่วยงาน
            {activeTab === 'DEPARTMENT' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('PERSONAL')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'PERSONAL' ? 'text-[#00b074]' : 'hover:text-slate-800'
            }`}
          >
            ส่วนตัว
            {activeTab === 'PERSONAL' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00b074] rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 pb-3">
                <th className="py-3 px-4 w-32">ความเร่งด่วน</th>
                <th className="py-3 px-4 w-28">ความลับ</th>
                <th className="py-3 px-4">หัวข้อ</th>
                <th className="py-3 px-4 w-56">ผู้ส่ง</th>
                <th className="py-3 px-4 text-right w-28">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 animate-pulse text-xs">
                    กำลังโหลดรายการจดหมายเวียน...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-medium">
                    ไม่พบรายการจดหมายเวียน
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onOpenDocDetail(doc)}
                    className="table-row-hover cursor-pointer group"
                  >
                    {/* 1. ความเร่งด่วน */}
                    <td className="py-4 px-4 font-bold">
                      {getUrgencyElement(doc.priority)}
                    </td>

                    {/* 2. ความลับ */}
                    <td className="py-4 px-4">
                      {doc.isConfidential ? (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <LockKeyhole className="w-4 h-4" />
                        </div>
                      ) : null}
                    </td>

                    {/* 3. หัวข้อ */}
                    <td className="py-4 px-4 font-bold text-slate-800 group-hover:text-[#00b074] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00b074] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="line-clamp-1">{doc.title}</span>
                      </div>
                    </td>

                    {/* 4. ผู้ส่ง */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.authorName ? doc.authorName.substring(0, 2) : 'KU'}
                        </div>
                        <span className="font-bold text-slate-800 text-xs truncate">
                          {doc.authorName || 'ฝ่ายกฎหมาย'}
                        </span>
                      </div>
                    </td>

                    {/* 5. วันที่ / เวลา */}
                    <td className="py-4 px-4 text-right font-bold text-slate-800 text-xs">
                      {formatTimeDisplay(doc.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching wireframe */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>แสดง {filteredDocs.length} จากทั้งหมด 124 รายการ</span>

          <div className="flex items-center gap-1.5 self-center">
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#00b074] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">
              3
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
