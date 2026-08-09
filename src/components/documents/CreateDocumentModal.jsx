'use client';
import React, { useState } from 'react';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, UploadCloud, Info, Send, Check } from 'lucide-react';
import { createDocument, updateDocument } from '@/lib/apiClient';

export default function CreateDocumentModal({ currentUser, editDoc, onClose, onDocSaved }) {
  const [title, setTitle] = useState(editDoc ? editDoc.title : '');
  const [content, setContent] = useState(editDoc ? editDoc.content : '');
  const [priority, setPriority] = useState(editDoc ? editDoc.priority : 'URGENT');
  const [isConfidential, setIsConfidential] = useState(editDoc ? !!editDoc.isConfidential : false);
  const [targetGroup, setTargetGroup] = useState('ALL'); // ALL, EXEC, REGIONAL, CUSTOM
  const [fileName, setFileName] = useState(editDoc ? editDoc.fileName || '' : '');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('กรุณากรอกหัวข้อเรื่องจดหมายเวียน');
      return;
    }

    setIsLoading(true);
    try {
      if (editDoc) {
        await updateDocument(editDoc.id, {
          title: title.trim(),
          content: content.trim(),
          priority,
          isConfidential,
          fileName,
        });
      } else {
        await createDocument({
          title: title.trim(),
          content: content.trim(),
          priority,
          isConfidential,
          fileName: fileName || 'Q4_Operational_Workflow.pdf',
          boardType: 'GLOBAL',
        });
      }

      if (onDocSaved) onDocSaved();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกเอกสาร');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in select-none">
      {/* Top Action Header */}
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
            {editDoc ? 'แก้ไขจดหมายเวียน' : 'สร้างจดหมายเวียนฉบับใหม่'}
          </h1>
          <p className="text-xs text-slate-400">เขียนและส่งประกาศแจ้งเตือนอย่างเป็นทางการขององค์กร</p>
        </div>

        {/* Action Buttons: Save Draft & Send */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-200 transition-colors"
          >
            บันทึกร่าง
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#00b074] hover:bg-[#009663] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'กำลังส่ง...' : 'ส่งจดหมายเวียน'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Grid: Form Left vs Settings Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Drag-Drop Attachment */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
            
            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">หัวข้อเรื่อง</label>
              <input
                type="text"
                placeholder="การปรับปรุงกลยุทธ์การดำเนินงาน - ไตรมาส 4/2567"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm font-bold px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#00b074]"
              />
            </div>

            {/* Rich Content Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">เนื้อหาข้อความ</label>
              
              {/* Rich Text Toolbar */}
              <div className="bg-slate-50 rounded-t-2xl border border-slate-200 px-4 py-2 flex items-center gap-4 text-slate-500 border-b-0">
                <button type="button" className="hover:text-slate-800 p-1"><Bold className="w-4 h-4" /></button>
                <button type="button" className="hover:text-slate-800 p-1"><Italic className="w-4 h-4" /></button>
                <button type="button" className="hover:text-slate-800 p-1"><Underline className="w-4 h-4" /></button>
                <div className="h-4 w-px bg-slate-300"></div>
                <button type="button" className="hover:text-slate-800 p-1"><List className="w-4 h-4" /></button>
                <button type="button" className="hover:text-slate-800 p-1"><ListOrdered className="w-4 h-4" /></button>
                <div className="h-4 w-px bg-slate-300"></div>
                <button type="button" className="hover:text-slate-800 p-1"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" className="hover:text-slate-800 p-1"><ImageIcon className="w-4 h-4" /></button>
              </div>

              <textarea
                rows={10}
                placeholder="เรียน คณะผู้บริหารและบุคลากรทุกท่าน..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs p-4 rounded-b-2xl border border-slate-200 focus:outline-none focus:border-[#00b074] leading-relaxed resize-y"
              />
            </div>

          </div>

          {/* Drag & Drop File Upload Box */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00b074] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm">ลากและวางไฟล์เพื่อแนบเอกสาร</h4>
              <p className="text-xs text-slate-400 mt-1">ไฟล์ PDF, DOCX หรือ Excel ขนาดไม่เกิน 25MB ต่อไฟล์</p>
            </div>

            {fileName && (
              <div className="bg-emerald-50 text-[#00b074] px-4 py-2 rounded-xl text-xs font-bold inline-block">
                📎 แนบแล้ว: {fileName}
              </div>
            )}

            <div>
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer inline-block transition-colors">
                เลือกไฟล์จากเครื่อง
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Settings Sidebar Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
              การตั้งค่าการส่ง
            </h3>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">ระดับความสำคัญ</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 font-bold text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#00b074]"
              >
                <option value="URGENT">ด่วน</option>
                <option value="VERY_URGENT">ด่วนที่สุด</option>
                <option value="NORMAL">ปกติ</option>
              </select>

              <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold mt-2">
                <Info className="w-3.5 h-3.5" />
                <span>จดหมายด่วนจะแจ้งเตือนผู้ใช้ทันที</span>
              </div>
            </div>

            {/* Target Group Selection (FLAS KPS KU Hierarchical Routing) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600">ขอบเขตการส่งตามลำดับชั้น (Hierarchical Scope)</label>

              {/* Scope 1: Faculty-wide */}
              <div
                onClick={() => setTargetGroup('ALL')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetGroup === 'ALL'
                    ? 'border-[#00b074] bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs">🏛️ เวียนแจ้งทั้งคณะศิลปศาสตร์และวิทยาศาสตร์</div>
                  <div className="text-[11px] text-slate-400">บุคลากรทุกระดับ ( Tier 1 - Tier 4 )</div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${targetGroup === 'ALL' ? 'bg-[#00b074] text-white' : 'border border-slate-300'}`}>
                  {targetGroup === 'ALL' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Scope 2: Dept & Division Heads */}
              <div
                onClick={() => setTargetGroup('DEPT_HEADS')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetGroup === 'DEPT_HEADS'
                    ? 'border-[#00b074] bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs">👔 เฉพาะหัวหน้าภาควิชา & หัวหน้างาน (Tier 2)</div>
                  <div className="text-[11px] text-slate-400">หัวหน้าภาควิชาวิทยาการคอมฯ, เคมี, ชีววิทยา ฯลฯ</div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${targetGroup === 'DEPT_HEADS' ? 'bg-[#00b074] text-white' : 'border border-slate-300'}`}>
                  {targetGroup === 'DEPT_HEADS' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Scope 3: Within Department */}
              <div
                onClick={() => setTargetGroup('DEPARTMENT')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetGroup === 'DEPARTMENT'
                    ? 'border-[#00b074] bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs">📂 สั่งการเฉพาะภายในภาควิชาตนเอง</div>
                  <div className="text-[11px] text-slate-400">อาจารย์และเจ้าหน้าที่ในสังกัดภาควิชา</div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${targetGroup === 'DEPARTMENT' ? 'bg-[#00b074] text-white' : 'border border-slate-300'}`}>
                  {targetGroup === 'DEPARTMENT' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Scope 4: Upward Routing */}
              <div
                onClick={() => setTargetGroup('UPWARD')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetGroup === 'UPWARD'
                    ? 'border-[#00b074] bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs">⬆️ เสนอบันทึกขึ้นตามลำดับชั้นบังคับบัญชา</div>
                  <div className="text-[11px] text-slate-400">เสนอเรื่องถึงหัวหน้าภาควิชา ➔ คณบดี</div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${targetGroup === 'UPWARD' ? 'bg-[#00b074] text-white' : 'border border-slate-300'}`}>
                  {targetGroup === 'UPWARD' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Confidentiality Toggle Switch */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 text-xs">ต้องการให้เอกสารเป็นความลับ</div>
                <div className="text-[10px] text-slate-400 mt-0.5">ผู้รับจะสามารถรับรู้ว่า จดหมายเป็นความลับ</div>
              </div>

              <button
                type="button"
                onClick={() => setIsConfidential(!isConfidential)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  isConfidential ? 'bg-[#00b074]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  isConfidential ? 'left-6' : 'left-0.5'
                }`} />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
