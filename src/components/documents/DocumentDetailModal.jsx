'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, LockKeyhole, Paperclip, Send, AtSign, ThumbsUp, MessageCircle, Calendar, Download } from 'lucide-react';
import { getDocument, getReplies, addReply } from '@/lib/apiClient';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendarUtils';
import FullReadTrackingModal from './FullReadTrackingModal';

export default function DocumentDetailModal({ doc, currentUser, onClose, onEditDoc }) {
  const [document, setDocument] = useState(doc);
  const [replies, setReplies] = useState([]);
  const [newReplyText, setNewReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullTrackingOpen, setIsFullTrackingOpen] = useState(false);

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

  // Demo fallback recipients matching wireframe if readLogs empty
  const recipients = document?.readLogs?.length
    ? document.readLogs.map((l) => ({
        name: l.userName || 'พนักงาน',
        role: l.userRole || 'เจ้าหน้าที่',
        isRead: true,
        readAt: new Date(l.readAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      }))
    : [
        { name: 'สมชัย นะจะ', role: 'รองประธานฝ่ายปฏิบัติการ', isRead: true, readAt: '10:42 AM' },
        { name: 'สมจิตร จิตหลุด', role: 'ประธานฝ่ายปฏิบัติการ', isRead: true, readAt: '11:15 AM' },
        { name: 'สมชาย ชาย', role: 'Compliance Officer', isRead: false, readAt: '--:--' },
        { name: 'ชัยแก้ว นำแสง', role: 'Regional Head', isRead: false, readAt: '--:--' },
        { name: 'ชาตชาย หมายหญิง', role: 'IT Support', isRead: true, readAt: '01:05 PM' },
      ];

  const readCount = recipients.filter((r) => r.isRead).length;
  const readPercentage = Math.round((readCount / recipients.length) * 100);

  const isAuthorOrAdmin =
    currentUser?.role === 'ADMIN' || currentUser?.id === document?.authorId;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Bar: Back Link & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#00b074] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าจดหมายเวียนที่ส่งแล้ว</span>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
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
            className="bg-emerald-50 hover:bg-emerald-100 text-[#00b074] border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="เพิ่มบันทึกกิจกรรมลงใน Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>บันทึกลง Google Calendar</span>
          </a>

          <button
            onClick={() => downloadIcsFile({
              title: `[เอกสารเวียน] ${document.title}`,
              description: document.content || document.title,
              startDate: document.createdAt,
            })}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="ดาวน์โหลดไฟล์ .ics สำหรับ Outlook / Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด .ics</span>
          </button>

          {document.priority === 'VERY_URGENT' && (
            <span className="font-extrabold text-red-600 text-sm">ด่วนที่สุด</span>
          )}
          {document.priority === 'URGENT' && (
            <span className="font-extrabold text-amber-500 text-sm">ด่วน</span>
          )}
          {document.isConfidential && (
            <span className="flex items-center gap-1 font-bold text-slate-600 text-xs bg-slate-200 px-3 py-1.5 rounded-full">
              <LockKeyhole className="w-3.5 h-3.5" /> ความลับ
            </span>
          )}

          {isAuthorOrAdmin && (
            <button
              onClick={() => onEditDoc(document)}
              className="bg-[#00b074] hover:bg-[#009663] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>แก้ไข</span>
            </button>
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
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00b074] flex items-center justify-center font-bold">
                  📄
                </div>
                <div>
                  <div className="font-bold text-slate-800">ข้อมูลเอกสาร</div>
                  <div className="text-slate-400">Ref ID: {document.id || 'EOP-STR-2023-0892'}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-400 text-[11px]">วันที่ออกจดหมาย</div>
                <div className="font-bold text-slate-800">
                  {new Date(document.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4">
                <div className="text-slate-400 text-[11px]">ผู้ส่ง</div>
                <div className="font-bold text-slate-800">{document.authorName || 'ดร. ภานุพงศ์ จีระคร'}</div>
              </div>
            </div>

            {/* Document Body Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 pt-2">
              <p className="font-bold text-slate-800">ถึงหัวหน้าภูมิภาคและผู้อำนวยการบริหารทุกท่าน</p>

              <p>
                {document.content || `ภายหลังการทบทวนกระบวนการทำงานเมื่อเร็วๆ นี้ เราได้ข้อสรุปเกี่ยวกับการกำหนดกลยุทธ์สำหรับไตรมาสที่ 4 โดยมุ่งเน้นไปที่แนวคิด "Effortless Authority" (การสร้างอำนาจหน้าที่เกิดขึ้นอย่างเป็นธรรมชาติและราบรื่น)`}
              </p>

              <p>
                ภายในโครงสร้างพื้นฐานทางดิจิทัลของเรา ถึงการเปลี่ยนแปลงสำคัญที่จำเป็นเพื่อปรับแนวทางของบุคลากรให้สอดคล้องกับปรัชญาการบริหารจัดการของ Plush Ultra
              </p>

              <div className="space-y-2 pt-2">
                <p className="font-bold text-slate-800">วัตถุประสงค์หลัก</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>การบูรณาการการวิเคราะห์ความรู้สึกด้วย AI เข้ากับการสื่อสารภายในองค์กรแบบหมุนเวียน</li>
                  <li>ลดระยะเวลาในการรออนุมัติข้ามแผนกลง 45%</li>
                  <li>การกำหนดมาตรฐานรูปแบบความสวยงามสไตล์ 'Plush' ให้เป็นไปในทิศทางเดียวกันสำหรับพอร์ทัลที่รองรับการใช้งานระดับองค์กร</li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 pt-2">
                โปรดตรวจสอบบันทึกการติดตามตามงานฉบับนี้เพื่อทำให้แน่ใจว่าหน่วยงานของท่านได้รับทราบการแก้ไขเหล่านี้แล้ว หากไม่มีการยืนยันรับทราบภายใน 48 ชั่วโมง สถานะของเอกสารจะถูกปรับเป็น 'Urgent Review' (ต้องตรวจสอบโดยเร่งด่วน) สำหรับศูนย์ต้นทุน (Cost Center) ของท่าน
              </p>
            </div>

            {/* Attachment Box Card */}
            {document.fileName ? (
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 text-xs">{document.fileName}</div>
                      <div className="text-[11px] text-slate-400">4.2 MB</div>
                    </div>
                  </div>

                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    อนุมัติ
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-blue-600 text-xs">Q4_Operational_Workflow.pdf (4.2 MB)</span>
                  </div>
                  <span className="bg-emerald-100 text-[#00b074] text-xs font-bold px-3 py-1 rounded-full">
                    อนุมัติ
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Read Tracking Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span>📊 บันทึกการติดตาม</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                อ่านแล้ว <strong className="text-[#00b074] font-extrabold">{readPercentage}%</strong>
              </span>
            </div>

            {/* Sub-Header Columns */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>ผู้รับ</span>
              <span>สถานะ</span>
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

            {/* Action Link: View All Read Tracking */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={() => setIsFullTrackingOpen(true)}
                className="text-xs font-bold text-[#00b074] hover:underline"
              >
                ดูทั้งหมด
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Reply / Comment Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>↩️</span> เพิ่มการตอบรับหรือการตอบกลับ
        </h3>

        {/* Existing Comments Timeline */}
        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                  คุณ
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">คุณวรินธร สถาพร</div>
                  <div className="text-[10px] text-slate-400">2 ชั่วโมงที่แล้ว</div>
                </div>
              </div>
              <p className="pl-10 text-xs">
                รับทราบค่ะ ในส่วนของฝ่ายทรัพยากรบุคคล พร้อมดำเนินการปรับใช้ตามแนวทางปฏิบัติที่แจ้งมาค่ะ @สมชาย รักไทย
              </p>
              <div className="pl-10 flex items-center gap-4 text-[11px] font-bold text-slate-400">
                <button className="hover:text-slate-600">ถูกใจ</button>
                <button className="hover:text-slate-600">ตอบกลับ</button>
              </div>

              {/* Nested Reply */}
              <div className="ml-10 mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-300 shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-700">
                  คุณ
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">คุณธนพล มีสุข</div>
                  <div className="text-[10px] text-slate-400 mb-1">1 ชั่วโมงที่แล้ว</div>
                  <p className="text-xs text-slate-600">
                    ฝ่ายไอทีจะจัดส่งคู่มือการใช้งานเพิ่มเติมสำหรับระบบเซ็นเอกสารทางเมลช่วงบ่ายนี้นะครับ
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mt-2">
                    <button className="hover:text-slate-600">ถูกใจ</button>
                    <button className="hover:text-slate-600">ตอบกลับ</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-xs space-y-2">
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
                <p className="pl-10 text-xs text-slate-700">{reply.content}</p>
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
            placeholder="พิมพ์คำตอบของคุณที่นี่... (ใช้ @ เพื่อกล่าวถึงเพื่อนร่วมงาน)"
            className="w-full bg-transparent text-slate-800 text-xs focus:outline-none resize-none placeholder:text-slate-400"
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
              className="bg-[#00b074] hover:bg-[#009663] disabled:opacity-50 text-white p-2 rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
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
