'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Trash2, LockKeyhole, Paperclip, Send, AtSign, Calendar, Download, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { getDocument, getReplies, addReply, deleteDocument } from '@/lib/apiClient';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendarUtils';
import FullReadTrackingModal from './FullReadTrackingModal';

export default function DocumentDetailModal({ doc, currentUser, onClose, onEditDoc }) {
  const [document, setDocument] = useState(doc);
  const [replies, setReplies] = useState([]);
  const [newReplyText, setNewReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullTrackingOpen, setIsFullTrackingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (doc?.id) {
      loadDocumentDetails(doc.id);
    }
  }, [doc?.id]);

  const loadDocumentDetails = async (docId) => {
    try {
      const updatedDoc = await getDocument(docId);
      setDocument(updatedDoc);
      const docReplies = await getReplies(docId);
      setReplies(docReplies || []);
    } catch (err) {
      console.error('Failed to load document details:', err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newReplyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const added = await addReply(document.id, { content: newReplyText.trim() });
      setReplies([...replies, added]);
      setNewReplyText('');
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณต้องการลบเอกสารนี้ใช่หรือไม่? (คำเตือน: การลบไม่สามารถย้อนกลับได้)')) return;
    setIsDeleting(true);
    try {
      await deleteDocument(document.id);
      onClose();
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบเอกสาร');
    } finally {
      setIsDeleting(false);
    }
  };

  const recipients = document?.readLogs?.length
    ? document.readLogs.map((l) => ({
        name: l.userName || 'พนักงาน',
        role: l.userRole || 'เจ้าหน้าที่',
        isRead: true,
        readAt: new Date(l.readAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      }))
    : [
        { name: 'รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์', role: 'คณบดี FLAS KPS', isRead: true, readAt: '10:42 AM' },
        { name: 'ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์', role: 'หัวหน้าภาควิชา CS/IT', isRead: true, readAt: '11:15 AM' },
        { name: 'อ. วรวุฒิ สุวรรณโชติ', role: 'อาจารย์ประจำภาค CS', isRead: true, readAt: '01:05 PM' },
        { name: 'คุณ ปรียาภรณ์ สารบรรณดี', role: 'เจ้าหน้าที่ธุรการสารบรรณ', isRead: false, readAt: '--:--' },
      ];

  const readCount = recipients.filter((r) => r.isRead).length;
  const readPercentage = Math.round((readCount / recipients.length) * 100);

  const isAuthorOrAdmin =
    currentUser?.role === 'ADMIN' || currentUser?.id === document?.authorId;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up select-none">
      
      {/* Executive Workflow Step Indicator Header */}
      <div className="bg-white/90 backdrop-blur-md p-4 px-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-[#00b074]" />
          <span>ลำดับขั้นตอนการดำเนินการบันทึกข้อความ (FLAS KPS Workflow)</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1. ออกบันทึกข้อความ
          </span>
          <span className="text-slate-300">➔</span>
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 2. หัวหน้าภาคพิจารณา
          </span>
          <span className="text-slate-300">➔</span>
          <span className="flex items-center gap-1 text-[#00b074] bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> 3. คณบดีอนุมัติเวียนแจ้ง
          </span>
        </div>
      </div>

      {/* Top Bar: Back Link & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00b074] hover:underline mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>กลับสู่หน้าจดหมายเวียนที่ส่งแล้ว</span>
          </button>
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
            {document.title}
          </h1>
        </div>

        {/* Action Badges, Calendar Sync & Edit Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={generateGoogleCalendarUrl({
              title: `[เอกสารเวียน] ${document.title}`,
              description: document.content || document.title,
              startDate: document.createdAt,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-50 hover:bg-emerald-100 text-[#00b074] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            title="เพิ่มบันทึกกิจกรรมลงใน Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Google Calendar</span>
          </a>

          <button
            onClick={() => downloadIcsFile({
              title: `[เอกสารเวียน] ${document.title}`,
              description: document.content || document.title,
              startDate: document.createdAt,
            })}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            title="ดาวน์โหลดไฟล์ .ics สำหรับ Outlook / Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>iCal (.ics)</span>
          </button>

          {document.priority === 'VERY_URGENT' && (
            <span className="font-extrabold text-rose-600 text-xs bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full">ด่วนที่สุด</span>
          )}
          {document.priority === 'URGENT' && (
            <span className="font-extrabold text-amber-600 text-xs bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">ด่วน</span>
          )}
          {document.isConfidential && (
            <span className="flex items-center gap-1 font-bold text-slate-700 text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
              <LockKeyhole className="w-3.5 h-3.5" /> ความลับ
            </span>
          )}

          {isAuthorOrAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditDoc(document)}
                className="bg-[#00b074] hover:bg-[#009663] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไข</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="ลบเอกสาร"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'กำลังลบ...' : 'ลบ'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Document Content vs Right Read Tracking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ref Header, Body Content & Attachment Box */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
            
            {/* Meta Ref ID Card Header */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-200/60 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00b074] flex items-center justify-center font-black text-sm border border-emerald-200 shadow-2xs">
                  📄
                </div>
                <div>
                  <div className="font-bold text-slate-800">ข้อมูลเอกสารคำสั่งการ</div>
                  <div className="text-slate-400 font-mono text-[11px]">Ref ID: {document.id || 'EOP-FLAS-2026-001'}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-400 text-[11px]">วันที่ออกจดหมาย</div>
                <div className="font-bold text-slate-800">
                  {new Date(document.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4">
                <div className="text-slate-400 text-[11px]">ผู้รับผิดชอบออกบันทึก</div>
                <div className="font-bold text-[#00b074]">{document.authorName || 'สำนักงานคณบดี'}</div>
              </div>
            </div>

            {/* Document Body Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 pt-2">
              <p className="font-bold text-slate-800">เรียน คณะผู้บริหาร หัวหน้าภาควิชา และบุคลากรคณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์</p>

              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 text-slate-800 font-medium">
                {document.content || `บันทึกข้อความสั่งการและแจ้งเวียนกำหนดการประชุมสภาคณะศิลปศาสตร์และวิทยาศาสตร์ ประจำปี 2569`}
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-bold text-slate-800">วัตถุประสงค์และแนวทางปฏิบัติตามคำสั่ง</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
                  <li>ให้หัวหน้าภาควิชาและหัวหน้างานส่งรายชื่อตัวแทนเข้าร่วมประชุมสภาคณะฯ ภายในวันศุกร์นี้</li>
                  <li>ขอความร่วมมือบุคลากรสายวิชาการและสายสนับสนุนตรวจสอบระเบียบวาระการประชุมล่วงหน้า</li>
                  <li>ผลการดำเนินงานจะถูกบันทึกเข้าระบบ E-OFFICE + เพื่อติดตามผลการปฏิบัติตามลำดับชั้น</li>
                </ul>
              </div>
            </div>

            {/* Attachment Box Card */}
            {document.fileName ? (
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00b074] flex items-center justify-center font-bold">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#00b074] text-xs">{document.fileName}</div>
                      <div className="text-[11px] text-slate-400">เอกสารแนบประกอบคำสั่งการ (PDF)</div>
                    </div>
                  </div>

                  <span className="bg-emerald-100 text-[#00b074] text-xs font-bold px-3 py-1 rounded-full">
                    แนบแล้ว
                  </span>
                </div>
              </div>
            ) : null}

          </div>
        </div>

        {/* Right Column: Read Tracking Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span>📊 บันทึกการเปิดอ่าน</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                อ่านแล้ว <strong className="text-[#00b074] font-extrabold">{readPercentage}%</strong>
              </span>
            </div>

            {/* Sub-Header Columns */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>ผู้รับ</span>
              <span>สถานะการอ่าน</span>
            </div>

            {/* Recipient List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {recipients.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00b074] font-bold text-xs flex items-center justify-center shrink-0">
                      {r.name.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-xs truncate">{r.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{r.role}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {r.isRead ? (
                      <div>
                        <span className="bg-emerald-100 text-[#00b074] text-[10px] font-bold px-2 py-0.5 rounded">
                          อ่านแล้ว
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">{r.readAt}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          ยังไม่อ่าน
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">--:--</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Link */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={() => setIsFullTrackingOpen(true)}
                className="text-xs font-bold text-[#00b074] hover:underline"
              >
                ดูสถิติการเปิดอ่านทั้งหมด
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Reply / Comment Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <span>↩️</span> ส่งข้อความตอบรับหรือรายงานผลการปฏิบัติตามสั่งการ
        </h3>

        {/* Existing Comments Timeline */}
        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs space-y-3 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00b074] overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs">
                  CS
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ (หัวหน้าภาค CS/IT)</div>
                  <div className="text-[10px] text-slate-400">10 นาทีที่แล้ว</div>
                </div>
              </div>
              <p className="pl-10 text-xs text-slate-700 font-medium">
                รับทราบและแจ้งอาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์เข้าประชุมสภาคณะฯ เรียบร้อยครับ
              </p>
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs space-y-2 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00b074] font-bold text-xs flex items-center justify-center shrink-0">
                    {reply.userName?.substring(0, 2) || 'KU'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{reply.userName}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(reply.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <p className="pl-10 text-xs text-slate-700 font-medium">{reply.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Box */}
        <form onSubmit={handleSendReply} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <textarea
            rows={3}
            value={newReplyText}
            onChange={(e) => setNewReplyText(e.target.value)}
            placeholder="พิมพ์ข้อความรายงานผลการปฏิบัติหรือตอบรับเอกสารที่นี่..."
            className="w-full bg-transparent text-slate-800 text-xs focus:outline-none resize-none placeholder:text-slate-400 font-medium"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
            <div className="flex items-center gap-3 text-slate-400">
              <button type="button" className="hover:text-slate-600 p-1" title="@ กล่าวถึง">
                <AtSign className="w-4 h-4" />
              </button>
              <button type="button" className="hover:text-slate-600 p-1" title="แนบไฟล์">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newReplyText.trim()}
              className="bg-[#00b074] hover:bg-[#009663] disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'กำลังส่ง...' : 'ส่งคำตอบรับ'}</span>
            </button>
          </div>
        </form>

      </div>

      {/* Full Read Tracking Modal */}
      {isFullTrackingOpen && (
        <FullReadTrackingModal
          onClose={() => setIsFullTrackingOpen(false)}
          readLogs={document.readLogs}
        />
      )}

    </div>
  );
}
