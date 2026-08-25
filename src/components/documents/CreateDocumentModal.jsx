'use client';
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Paperclip,
  UploadCloud,
  Send,
  AlertTriangle,
  Globe,
  Building2,
  UserCheck,
  CheckSquare,
  Square,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { createDocument, updateDocument, getUsers } from '@/lib/apiClient';

export default function CreateDocumentModal({ currentUser, editDoc, onClose, onDocSaved }) {
  const [title, setTitle] = useState(editDoc ? editDoc.title : '');
  const [content, setContent] = useState(editDoc ? editDoc.content : '');
  const [priority, setPriority] = useState(editDoc ? editDoc.priority : 'NORMAL');
  const [boardType, setBoardType] = useState(editDoc ? editDoc.boardType : 'GLOBAL'); // GLOBAL, DEPARTMENT, PERSONAL
  const [targetDepartment, setTargetDepartment] = useState(
    editDoc?.targetScope || currentUser?.department || 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ'
  );
  const [selectedRecipientIds, setSelectedRecipientIds] = useState(
    editDoc?.targetIds ? (Array.isArray(editDoc.targetIds) ? editDoc.targetIds : JSON.parse(editDoc.targetIds || '[]')) : []
  );

  const [fileName, setFileName] = useState(editDoc ? editDoc.fileName || '' : '');
  const [fileSize, setFileSize] = useState(editDoc ? editDoc.fileSize || '' : '');
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load personnel list for individual checkboxes
    (async () => {
      try {
        const users = await getUsers();
        if (users) {
          // Filter out current user from recipients list
          setUsersList(users.filter((u) => u.id !== currentUser?.id));
        }
      } catch (err) {
        console.error('Failed to load users for routing:', err);
      }
    })();
  }, [currentUser?.id]);

  const handleToggleRecipient = (userId) => {
    if (selectedRecipientIds.includes(userId)) {
      setSelectedRecipientIds(selectedRecipientIds.filter((id) => id !== userId));
    } else {
      setSelectedRecipientIds([...selectedRecipientIds, userId]);
    }
  };

  const handleSelectAllRecipients = () => {
    if (selectedRecipientIds.length === usersList.length) {
      setSelectedRecipientIds([]);
    } else {
      setSelectedRecipientIds(usersList.map((u) => u.id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMB} MB`);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('กรุณาระบุหัวข้อเรื่องจดหมายเวียน');
      return;
    }
    if (!content.trim()) {
      setError('กรุณาระบุเนื้อหาบันทึกข้อความ');
      return;
    }

    if (boardType === 'PERSONAL' && selectedRecipientIds.length === 0) {
      setError('กรุณาเลือกรายชื่อผู้รับอย่างน้อย 1 ท่านสำหรับส่งรายบุคคล');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        priority,
        boardType,
        targetScope: boardType === 'DEPARTMENT' ? targetDepartment : boardType === 'GLOBAL' ? 'FACULTY' : 'INDIVIDUAL',
        targetIds: JSON.stringify(selectedRecipientIds),
        fileName: fileName || null,
        fileSize: fileSize || null,
        fileUrl: fileName ? '#' : null,
      };

      if (editDoc) {
        await updateDocument(editDoc.id, payload);
      } else {
        await createDocument(payload);
      }

      if (onDocSaved) onDocSaved();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกเอกสาร');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-slide-up select-none">
      {/* Top Breadcrumb & Actions Bar */}
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
            <span>{editDoc ? 'แก้ไขบันทึกข้อความ / จดหมายเวียน' : 'สร้างจดหมายเวียนฉบับใหม่'}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006653]">
              {currentUser?.department || 'FLAS KPS KU'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#00a86b] hover:bg-[#008f5d] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? 'กำลังส่ง...' : editDoc ? 'บันทึกการแก้ไข' : 'ส่งเวียนแจ้ง'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Body */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        {/* Row 1: Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            หัวข้อเรื่อง / ประกาศจดหมายเวียน <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="เช่น ขอเชิญเข้าร่วมการประชุมคณะกรรมการประจำคณะฯ ประจำภาคการศึกษา 1/2569"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Row 2: Priority & Routing Scope Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ระดับความสำคัญ (Priority) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'NORMAL', label: 'ปกติ', color: 'border-emerald-300 text-[#006653] bg-emerald-50/50' },
                { id: 'URGENT', label: 'ด่วน', color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
                { id: 'VERY_URGENT', label: 'ด่วนที่สุด', color: 'border-rose-300 text-rose-600 bg-rose-50/50' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    priority === p.id ? `${p.color} ring-2 ring-emerald-500 ring-offset-1` : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Board Scope (Routing) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ขอบเขตการเวียนแจ้ง (Target Audience) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'GLOBAL', label: 'เวียนทั้งคณะ', icon: Globe },
                { id: 'DEPARTMENT', label: 'ส่งในฝ่าย', icon: Building2 },
                { id: 'PERSONAL', label: 'ส่งรายบุคคล', icon: UserCheck },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBoardType(b.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      boardType === b.id
                        ? 'bg-[#006653] text-white border-[#006653] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Individual Personnel Checkbox Selection (PDF Requirement Page 2) */}
        {boardType === 'PERSONAL' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#006653]" />
                <span>ติ๊กเลือกรายชื่ออาจารย์และบุคลากรที่ต้องการส่งถึง ({selectedRecipientIds.length}/{usersList.length} ท่าน)</span>
              </span>
              <button
                type="button"
                onClick={handleSelectAllRecipients}
                className="text-xs text-[#006653] font-bold hover:underline cursor-pointer"
              >
                {selectedRecipientIds.length === usersList.length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {usersList.map((user) => {
                const isSelected = selectedRecipientIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleToggleRecipient(user.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#006653] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <div className="truncate text-xs">
                      <div className="truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {user.positionTitle || user.department}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 3: Rich Content Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            เนื้อหาบันทึกข้อความ / รายละเอียดคำสั่ง <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={7}
            placeholder="พิมพ์เนื้อหาบันทึกข้อความ รายละเอียดการดำเนินงาน หรือคำสั่งเวียนแจ้ง..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] focus:bg-white transition-all font-normal leading-relaxed"
          ></textarea>
        </div>

        {/* Row 4: File Attachment Section (PDF Requirement Page 2) */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            แนบไฟล์เอกสารประกอบ (PDF, Word, Excel, รูปภาพ)
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200">
              <UploadCloud className="w-4 h-4 text-[#006653]" />
              <span>เลือกไฟล์จากเครื่อง</span>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>

            {fileName ? (
              <div className="w-full sm:w-auto px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 truncate">
                  <FileText className="w-4 h-4 text-[#006653] shrink-0" />
                  <span className="font-bold truncate">{fileName}</span>
                  {fileSize && <span className="text-slate-400">({fileSize})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('');
                    setFileSize('');
                  }}
                  className="p-1 hover:bg-emerald-200/60 rounded text-emerald-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400">ยังไม่ได้เลือกไฟล์แนบ</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
