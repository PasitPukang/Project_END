'use client';
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Building2,
  Globe,
  MessageSquare,
  Send,
  Paperclip,
  UploadCloud,
  Edit3,
  Trash2,
  Eye,
  ShieldCheck,
  PlaneTakeoff,
  X,
} from 'lucide-react';
import { getDocument, getReplies, addReply, deleteDocument } from '@/lib/apiClient';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendarUtils';

export default function DocumentDetailModal({ doc, currentUser, onClose, onEditDoc, onDocDeleted }) {
  const [document, setDocument] = useState(doc);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFile, setReplyFile] = useState(null);
  const [isLeaveRequest, setIsLeaveRequest] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('REPLIES'); // REPLIES, READ_LOGS

  useEffect(() => {
    if (doc?.id) {
      loadDocumentAndReplies(doc.id);
    }
  }, [doc?.id]);

  const loadDocumentAndReplies = async (docId) => {
    try {
      const updatedDoc = await getDocument(docId);
      if (updatedDoc) setDocument(updatedDoc);
      const resReplies = await getReplies(docId);
      if (resReplies) setReplies(resReplies);
    } catch (err) {
      console.error('Failed to load document details:', err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() && !replyFile) return;

    setIsSubmittingReply(true);
    try {
      const newRep = await addReply(document.id, {
        message: replyMessage.trim(),
        isLeaveRequest,
        fileName: replyFile ? replyFile.name : null,
        fileSize: replyFile ? `${(replyFile.size / (1024 * 1024)).toFixed(1)} MB` : null,
        fileUrl: replyFile ? '#' : null,
      });

      setReplies((prev) => [...prev, newRep]);
      setReplyMessage('');
      setReplyFile(null);
      setIsLeaveRequest(false);
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการส่งข้อความตอบกลับ');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณต้องการลบเอกสารนี้ใช่หรือไม่? ข้อมูลจะถูกลบออกจากระบบ')) return;
    setIsDeleting(true);
    try {
      await deleteDocument(document.id);
      if (onDocDeleted) onDocDeleted();
      onClose();
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบเอกสาร');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthorOrAdmin =
    currentUser?.role === 'ADMIN' || currentUser?.id === document?.authorId;

  const calendarUrl = generateGoogleCalendarUrl(document);

  const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-slide-up select-none">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006653] hover:underline mb-1 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>กลับสู่หน้ารายการจดหมายเวียน</span>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>รายละเอียดบันทึกข้อความ / จดหมายเวียน</span>
            {document?.isEdited && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                (แก้ไขแล้ว)
              </span>
            )}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Add to Google Calendar */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006653] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="เพิ่มลงใน Google Calendar"
          >
            <CalendarPlus className="w-4 h-4 text-emerald-600" />
            <span>Add to Calendar</span>
          </a>

          {/* Edit Button (For Author / Admin) */}
          {isAuthorOrAdmin && (
            <button
              onClick={() => onEditDoc(document)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="แก้ไขเอกสาร"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button (For Author / Admin) */}
          {isAuthorOrAdmin && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="ลบเอกสาร"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Document Details Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Document Header Badges & Author Metadata */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            {document?.priority === 'VERY_URGENT' && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
                ด่วนที่สุด
              </span>
            )}
            {document?.priority === 'URGENT' && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                ด่วน
              </span>
            )}
            {document?.priority === 'NORMAL' && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-[#006653] border border-emerald-200">
                ปกติ
              </span>
            )}

            {/* Scope Badge */}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              {document?.boardType === 'GLOBAL' && <Globe className="w-3 h-3 text-[#006653]" />}
              {document?.boardType === 'DEPARTMENT' && <Building2 className="w-3 h-3 text-sky-600" />}
              {document?.boardType === 'PERSONAL' && <User className="w-3 h-3 text-purple-600" />}
              <span>
                {document?.boardType === 'GLOBAL' ? 'เวียนทั้งคณะ' : document?.boardType === 'DEPARTMENT' ? 'ส่งตามสายงานฝ่าย' : 'ส่งรายบุคคล'}
              </span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {document?.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-500 pt-1">
            <span>
              ผู้ส่ง: <strong className="text-slate-800">{document?.authorName}</strong> ({document?.authorRole})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatThaiDate(document?.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#006653] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              รับทราบแล้ว {document?.readLogs?.length || 0} ท่าน
            </span>
          </div>
        </div>

        {/* Document Body Content */}
        <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-normal p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
          {document?.content}
        </div>

        {/* Attachment Card (If attached) */}
        {document?.fileName && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006653] text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {document.fileName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {document.fileSize || '1.5 MB'} • เอกสารแนบอย่างเป็นทางการ
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`จำลองการดาวน์โหลดไฟล์: ${document.fileName}`)}
              className="px-4 py-2 bg-[#006653] hover:bg-[#004d3d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub-Section: Tab Navigation (Replies vs Read Receipts Tracking) */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('REPLIES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'REPLIES'
                  ? 'bg-[#006653] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ข้อความตอบกลับ / ส่งงาน ({replies.length})
            </button>
            <button
              onClick={() => setActiveSubTab('READ_LOGS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'READ_LOGS'
                  ? 'bg-[#006653] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ประวัติการเปิดอ่าน / ยืนยันรับทราบ ({document?.readLogs?.length || 0})
            </button>
          </div>
        </div>

        {/* TAB 1: REPLIES & TASK SUBMISSION */}
        {activeSubTab === 'REPLIES' && (
          <div className="space-y-4">
            {/* List of Replies */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {replies.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                  <span>ยังไม่มีข้อความตอบกลับหรือการส่งงานสำหรับจดหมายเวียนฉบับนี้</span>
                </div>
              ) : (
                replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rep.userName}</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                          {rep.userRole}
                        </span>
                        {rep.isLeaveRequest && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full border border-amber-200 flex items-center gap-1">
                            <PlaneTakeoff className="w-3 h-3" />
                            <span>ยื่นคำขอลา</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatThaiDate(rep.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {rep.message}
                    </p>

                    {rep.fileName && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{rep.fileName}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Post Reply Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <textarea
                  rows={3}
                  placeholder="พิมพ์ข้อความตอบกลับ ส่งรายงาน หรือชี้แจงความคืบหน้า..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] focus:bg-white"
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {/* Leave Request Checkbox */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLeaveRequest}
                      onChange={(e) => setIsLeaveRequest(e.target.checked)}
                      className="rounded text-[#006653] focus:ring-[#006653]"
                    />
                    <span>ยื่นคำขอลา (Leave Request)</span>
                  </label>

                  {/* Attachment Button */}
                  <label className="text-xs font-semibold text-[#006653] hover:underline flex items-center gap-1 cursor-pointer">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{replyFile ? replyFile.name : 'แนบไฟล์งาน'}</span>
                    <input
                      type="file"
                      onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReply || (!replyMessage.trim() && !replyFile)}
                  className="px-4 py-2 bg-[#00a86b] hover:bg-[#008f5d] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? 'กำลังส่ง...' : 'ส่งคำตอบกลับ'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: READ RECEIPTS / TRACKING TABLE (PDF Requirement Page 3) */}
        {activeSubTab === 'READ_LOGS' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              ระบบบันทึกเวลาที่ผู้รับเปิดอ่านเอกสารเพื่อยืนยันว่ารับทราบข้อความและคำสั่งเวียนแจ้งแล้ว
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">ชื่อ-นามสกุล บุคลากร</th>
                    <th className="py-2.5 px-4">ตำแหน่ง / สิทธิ์</th>
                    <th className="py-2.5 px-4">สถานะ</th>
                    <th className="py-2.5 px-4">วันและเวลาที่เปิดอ่าน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {document?.readLogs?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        ยังไม่มีผู้เปิดอ่านเอกสารนี้
                      </td>
                    </tr>
                  ) : (
                    document.readLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-slate-800">{log.userName}</td>
                        <td className="py-2.5 px-4 text-slate-600">{log.userRole}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>เปิดอ่านแล้ว</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono">
                          {formatThaiDate(log.readAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
