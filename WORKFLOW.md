# 🛠️ WORKFLOW: ขั้นตอนการพัฒนาระบบ Loki Task Manager & Document Management System

เอกสารนี้ระบุสถานะขั้นตอนการทำงาน (Workflow & Implementation Status) ที่ได้รับการอัปเดตล่าสุด

---

## 📊 สรุปภาพรวมสถานะการพัฒนา (Current Development Summary)
- ✅ **สถานะการทำงาน:** เสร็จสิ้นฟีเจอร์หลักทั้งหมด (MVP Core Features Completed 100%)
- 🔄 **เทคโนโลยีที่ปรับเปลี่ยนจากแผนเดิม (Technology Stack Adjustments):**
  - **Framework:** เปลี่ยนจาก `Vite + React` ➔ เป็น `Next.js 14 (App Router)` เพื่อรองรับทั้ง Frontend และ Backend REST API
  - **Styling:** เปลี่ยนจาก Vanilla CSS ➔ เป็น `Tailwind CSS v3` + `src/app/globals.css`
  - **Database & Storage:** เปลี่ยนจาก LocalStorage อย่างเดียว ➔ เป็น `Hybrid Architecture` (Prisma ORM + SQLite DB ร่วมกับ LocalStorage Fallback ใน `src/lib/apiClient.js`)
  - **Folder Structure:** ปรับจาก `src/services/` ➔ ย้ายมาจัดหมวดหมู่ใน `src/lib/` และ `src/app/api/` ตามมาตรฐาน Next.js

---

## 📌 Phase 1: การติดตั้งโปรเจกต์และระบบดีไซน์ (Project Initialization & Design System)
- [x] **Step 1.1:** สร้างโปรเจกต์ (ปรับเปลี่ยนจาก Vite เป็น Next.js 14 App Router) ใน `d:\HR_project`
- [x] **Step 1.2:** ติดตั้ง Icon Library (`lucide-react`) และ dependencies เช่น `@prisma/client`, `prisma`, `tailwindcss`
- [x] **Step 1.3:** วางโครงสร้าง CSS Design System ใน `src/app/globals.css` และ `tailwind.config.js`
  * ออกแบบ Theme (Modern Light/Dark, Custom Tokens, Badges, Typography, Animations, Modals)

---

## 📌 Phase 2: โครงสร้างข้อมูลและ Database Engine (Data Models & Services)
- [x] **Step 2.1:** สร้าง `src/lib/mockDatabase.js` และ `prisma/seed.js` สำหรับ Seed Data (Admin, หัวหน้าสาขา, อาจารย์, เจ้าหน้าที่)
- [x] **Step 2.2:** สร้าง `src/lib/storageService.js` (LocalStorage CRUD) และ `src/lib/apiClient.js` (เชื่อมต่อ Next.js API Routes + LocalStorage Fallback)
- [x] **Step 2.3:** สร้างระบบ OTP Engine (OTP 6 หลัก หมดอายุภายใน 2 นาที / 120 วินาที) & Random Password Generation

---

## 📌 Phase 3: ระบบยืนยันตัวตนและการเข้าสู่ระบบ (Authentication & 2FA Module)
- [x] **Step 3.1:** `src/components/auth/LoginPage.jsx` (ฟอร์มระบุ ID & Password)
- [x] **Step 3.2:** `src/components/auth/OtpModal.jsx` (Modal กรอก OTP 6 หลัก, นับถอยหลัง 120s, ปุ่ม Resend OTP)
- [x] **Step 3.3:** `src/components/auth/FirstTimePasswordModal.jsx` (บังคับเปลี่ยนรหัสผ่านทันทีเมื่อล็อกอินครั้งแรก)
- [x] **Step 3.4:** `src/components/auth/ForgotPasswordModal.jsx` (กรอก Email -> ส่ง OTP -> ตั้ง Password ใหม่)
- [x] **[เพิ่มใหม่]:** `src/components/auth/StepWizardLayout.jsx` จัดระเบียบ Flow การล็อกอินให้อ่านง่ายและสวยงาม

---

## 📌 Phase 4: ระบบจัดการผู้ใช้งานสำหรับ Admin (User Management Module)
- [x] **Step 4.1:** `src/components/admin/UserManagementModal.jsx` & `AdminView.jsx` (เข้าได้เฉพาะ Admin)
- [x] **Step 4.2:** สร้างฟอร์ม "เพิ่มผู้ใช้ใหม่" (ระบุชื่อ, นามสกุล, อีเมล, สังกัด/สาขา, Role)
- [x] **Step 4.3:** ระบบสุ่ม ID & Password อัตโนมัติ
- [x] **Step 4.4:** Pop-up Modal แสดง ID & Password พร้อม "ปุ่มจำลองส่งอีเมลแจ้งเตือน"
- [x] **[เพิ่มใหม่]:** `src/components/admin/AdminBackendModal.jsx` (ตรวจสอบสถิติระบบและ API Routes)

---

## 📌 Phase 5: ระบบกระดานงานและจดหมายเวียน (Task Boards & Circular Letters Module)
- [x] **Step 5.1:** หน้าแดชบอร์ดหลัก `src/components/dashboard/Dashboard.jsx`
- [x] **Step 5.2:** ระบบสลับ 3 กระดานงาน (Global Board, Department Board, Personal Board)
- [x] **Step 5.3:** ระบบค้นหาคำค้น (Text Search) และตัวกรองช่วงเวลา (Date Range Filter)
- [x] **Step 5.4:** แสดงการ์ดเอกสาร (`DocumentCard`):
  * ป้ายระดับความสำคัญ (`ปกติ`, `ด่วน`, `ด่วนที่สุด`, `ลับ`)
  * สถานะการอ่าน: ยังไม่อ่าน -> **ตัวหนา (Bold)** + สัญลักษณ์ Unread / อ่านแล้ว -> ตัวปกติ
  * สถานะการแก้ไข: แสดงป้าย `(แก้ไขแล้ว)` หากถูกอัปเดต

---

## 📌 Phase 6: ระบบสร้างและแก้ไขเอกสารเวียน (Create / Edit Circular Letter Module)
- [x] **Step 6.1:** สร้างฟอร์ม `src/components/documents/CreateDocumentModal.jsx` (หัวข้อเรื่อง, เนื้อหาบันทึกข้อความ, ระดับความสำคัญ: ปกติ/ด่วน/ด่วนที่สุด/ลับ, อัปโหลดแนบไฟล์)
- [x] **Step 6.2:** การเลือกกลุ่มเป้าหมายผู้รับ (Routing Scope: Individual, Department, Hierarchical Order, Faculty-wide)
- [x] **Step 6.3:** ระบบแก้ไขเอกสาร (Edit Document) พร้อมติดป้าย `(แก้ไขแล้ว)` อัตโนมัติ

---

## 📌 Phase 7: หน้ารายละเอียดเอกสาร การตอบกลับ และติดตามสถานะ (Document Detail, Reply & Tracking)
- [x] **Step 7.1:** `src/components/documents/DocumentDetailModal.jsx` (แสดงเนื้อหาฉบับเต็ม + ปุ่มดาวน์โหลดไฟล์แนบ)
- [x] **Step 7.2:** ระบบตอบกลับเอกสาร / การลา (Reply & Comment System) พร้อมแนบไฟล์และ Timeline
- [x] **Step 7.3:** ระบบติดตามสถานะการเปิดอ่าน `FullReadTrackingModal.jsx` (แสดงรายชื่อผู้รับ + บันทึก วัน/เดือน/ปี เวลา Stamp)

---

## 📌 Phase 8: ระบบสิทธิ์การใช้งาน (Role-Based Access Control & UI Scope)
- [x] **Step 8.1:** ควบคุม State ล็อกอินและ Role ปัจจุบันผ่าน `apiClient.js` / Page State
- [x] **Step 8.2:** ระบบสลับ Role จำลอง (User/Role Switcher Toolbar) ใน `Header.jsx` สำหรับทดสอบมุมมอง Admin, หัวหน้าสาขา, อาจารย์, เจ้าหน้าที่
- [x] **Step 8.3:** UI แสดงผลเฉพาะปุ่ม/เมนูตามสิทธิ์ของตำแหน่งนั้นๆ

---

## 📌 Phase 9: การสอบทานและส่งมอบงาน (Verification & Testing)
- [x] **Step 9.1:** ทดสอบระบบ Build (`npm run build`) ผ่านสมบูรณ์
- [x] **Step 9.2:** ทดสอบ Flow ทั้งหมดแบบ End-to-End (สร้าง User -> 2FA OTP -> เปลี่ยน Pass -> สร้างเอกสารเวียน -> เปิดอ่านติดตามเวลา -> ตอบกลับพร้อมแนบไฟล์)

---

## ❌ สิ่งที่ไม่ได้ใช้ / ยกเลิก / ปรับเปลี่ยนแนวทาง (Deprecated & Unused Components)
1. **🚫 `create-vite` / Pure Client-side SPA:** ไม่ได้ใช้ Vite ตามแผนแรก เปลี่ยนมาใช้ Next.js 14 เพื่อให้ได้ทั้ง SSR และ API Routes ในโปรเจกต์เดียว
2. **🚫 LocalStorage Pure Engine (`src/services/`):** โครงสร้างไดเรกทอรี `src/services/` เดิมถูกยกเลิก โดยย้ายและปรับปรุงเป็น `src/lib/` และ `src/app/api/` เพื่อแยกแยะ Layer ให้สะอาดขึ้น
3. **🚫 Vanilla CSS Pure File (`src/index.css`):** ยกเลิกการใช้ไฟล์ CSS แบบเขียนมือล้วน หันมาใช้ Tailwind CSS v3 เพื่อความรวดเร็วและเป็นมาตรฐานในการปรับแต่ง UI

---

## 🚀 สิ่งที่เหลือสำหรับแผนพัฒนาเฟสถัดไป (Future Improvements / Post-MVP Roadmap)
- [ ] **Real Cloud File Storage:** พัฒนาระบบอัปโหลดไฟล์ไปที่ Cloud Provider จริง (เช่น AWS S3 / Cloudinary) แทนการแปลงเป็น Base64/Blob ในปัจจุบัน
- [ ] **Real Email / SMS Gateway Integration:** เชื่อมต่อกับบริการส่ง SMS / Email จริง (เช่น Twilio, Resend, SendGrid) เพื่อส่ง OTP และการแจ้งเตือนไปยังผู้ใช้จริง
- [ ] **Real-time Notification:** เพิ่มระบบ WebSockets / Server-Sent Events (SSE) เพื่อแจ้งเตือนเอกสารด่วน/ลับ เข้ามือถือหรือหน้าจอทันทีแบบ Real-time
- [ ] **Export & Analytics Reports:** ระบบออกรายงานการเปิดอ่านและสรุปสถิติเอกสารเวียนประจำเดือนในรูปแบบ PDF หรือ Excel
