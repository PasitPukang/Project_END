# 🛠️ WORKFLOW: ขั้นตอนการพัฒนาระบบ Loki Task Manager & Document Management System

เอกสารนี้ระบุสถานะขั้นตอนการทำงาน (Workflow & Implementation Status) ที่ได้รับการอัปเดตล่าสุด

---

## 📊 สรุปภาพรวมสถานะการพัฒนา (Current Development Summary)

- ✅ **สถานะการทำงาน:** เสร็จสิ้นการจัดทำฐานข้อมูลบุคลากรและระบบส่งเอกสารตามลำดับชั้นเรียบร้อยแล้ว (FLAS KPS KU Database & Hierarchical Routing Completed)
- 🔄 **เทคโนโลยีหลักและโครงสร้างองค์กรที่ใช้งาน (Real Stack & FLAS KPS KU Integration):**
  - **Organization Model:** อ้างอิงโครงสร้างบุคลากร **คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU - https://flas.kps.ku.ac.th/)**
  - **4-Tier Hierarchy Architecture:**
    - `Tier 1`: ผู้บริหารระดับคณะ (คณบดี, รองคณบดีฝ่ายวิชาการ, ฝ่ายบริหาร ฯลฯ)
    - `Tier 2`: หัวหน้าภาควิชา & หัวหน้างาน (หัวหน้าภาควิชา CS/IT, วิทยาศาสตร์กายภาพ, ชีววิทยา, สำนักงานเลขานุการคณะ)
    - `Tier 3`: อาจารย์ประจำภาควิชา (อาจารย์สาขา CS, IT, เคมี ฯลฯ)
    - `Tier 4`: บุคลากรสายสนับสนุน (เจ้าหน้าที่งานบริหาร/สารบรรณ, การเงินและพัสดุ, บริการการศึกษา)
  - **Framework:** Next.js 14 (App Router) + React 18
  - **Authentication & Database:** **Supabase** (`@supabase/supabase-js`) + Prisma ORM (SQLite Local DB)
  - **Email Gateway:** Nodemailer Transport ส่ง OTP และส่งข้อมูล Employee ID (`EMP-XXXX`) เข้าอีเมลพนักงานจริง
  - **Calendar Sync:** Google Calendar API Links & iCal (.ics Export)

---

## 📌 Phase 1: การติดตั้งโปรเจกต์และระบบดีไซน์ (Project Initialization & Design System)

- [x] **Step 1.1:** สร้างโปรเจกต์ Next.js 14 App Router ใน `d:\HR_project`
- [x] **Step 1.2:** ติดตั้ง Icon Library (`lucide-react`) และ dependencies เช่น `@supabase/supabase-js`, `nodemailer`, `@prisma/client`, `prisma`, `tailwindcss`
- [x] **Step 1.3:** วางโครงสร้าง CSS Design System ใน `src/app/globals.css` และ `tailwind.config.js`
  - ออกแบบ Theme (Modern Light/Dark, Custom Tokens, Badges, Typography, Animations, Modals)

---

## 📌 Phase 2: โครงสร้างข้อมูลบุคลากร FLAS KPS KU (Data Models & Services)

- [x] **Step 2.1:** อัปเดต `prisma/schema.prisma` เพิ่มฟิลด์ `tierLevel`, `positionTitle`, `division` ใน User Model
- [x] **Step 2.2:** สร้าง `src/lib/mockDatabase.js` และ `prisma/seed.js` บรรจุข้อมูลบุคลากรตัวอย่าง 12 Personas อ้างอิง FLAS KPS KU ครบทั้ง 4 Tiers
- [x] **Step 2.3:** สร้าง `src/lib/storageService.js` (LocalStorage CRUD) และ `src/lib/apiClient.js` (เชื่อมต่อ Next.js API Routes + LocalStorage Fallback)
- [x] **Step 2.4:** สร้างระบบ OTP Engine & Random Employee ID (`EMP-XXXX`) Generation

---

## 📌 Phase 3: ระบบยืนยันตัวตนและการเข้าสู่ระบบด้วย Real Email (Authentication & 2FA Module)

- [x] **Step 3.1:** `src/components/auth/LoginPage.jsx` (ฟอร์มระบุ ID & Password)
- [x] **Step 3.2:** `src/components/auth/OtpModal.jsx` (Modal กรอก OTP 6 หลัก, นับถอยหลัง 120s, ปุ่ม Resend OTP)
- [x] **Step 3.3:** **Real Email OTP Dispatching:** เชื่อมต่อ `sendOtpEmail` ใน `src/app/api/auth/otp/send/route.js` ส่ง OTP เข้าอีเมลจริงของผู้ใช้
- [x] **Step 3.4:** `src/components/auth/FirstTimePasswordModal.jsx` (บังคับเปลี่ยนรหัสผ่านทันทีเมื่อล็อกอินครั้งแรก)
- [x] **Step 3.5:** `src/components/auth/ForgotPasswordModal.jsx` (กรอก Email -> ส่ง Real OTP เข้าอีเมลจริง -> ตั้ง Password ใหม่)

---

## 📌 Phase 4: ระบบจัดการผู้ใช้งานสำหรับ Admin & ส่ง ID เข้าอีเมลจริง (User Management Module)

- [x] **Step 4.1:** `src/components/admin/UserManagementModal.jsx` & `AdminView.jsx` (เข้าได้เฉพาะ Admin)
- [x] **Step 4.2:** ฟอร์มเพิ่มผู้ใช้ใหม่ (ระบุชื่อ, นามสกุล, อีเมล, สังกัด/สาขา, Role)
- [x] **Step 4.3:** ระบบสุ่ม Employee ID (`EMP-XXXX`) & Password อัตโนมัติ พร้อมซิงค์ลง Supabase
- [x] **Step 4.4:** **Real Credentials Email Dispatching:** ส่งอีเมลแจ้งสิทธิ์, Employee ID และรหัสผ่านชั่วคราว ไปยังอีเมลจริงของพนักงานที่เพิ่งถูกเพิ่มทันที
- [x] **Step 4.5:** `src/components/admin/AdminBackendModal.jsx` (ตรวจสอบสถิติระบบและ API Routes)

---

## 📌 Phase 5: ระบบกระดานงานและปฏิทิน (Task Boards, Circular Letters & Calendar Integration)

- [x] **Step 5.1:** หน้าแดชบอร์ดหลัก `src/components/dashboard/Dashboard.jsx`
- [x] **Step 5.2:** ระบบสลับ 3 กระดานงาน (Global Board, Department Board, Personal Board)
- [x] **Step 5.3:** **Google Calendar & iCal Integration:**
  - ปุ่ม **"📅 Google"** บนการ์ดเอกสารในกระดานงาน เพื่อเปิดหน้าบันทึกกิจกรรมใน Google Calendar โดยตรง
  - ปุ่ม **"📥 iCal"** บนการ์ดเอกสาร เพื่อดาวน์โหลดไฟล์ `.ics` นำเข้า Apple Calendar / Outlook / Windows Calendar
- [x] **Step 5.4:** ระบบค้นหาคำค้น (Text Search) และตัวกรองช่วงเวลา (Date Range Filter)
- [x] **Step 5.5:** แสดงการ์ดเอกสาร (`DocumentCard`):
  - ป้ายระดับความสำคัญ (`ปกติ`, `ด่วน`, `ด่วนที่สุด`, `ลับ`)
  - สถานะการอ่าน: ยังไม่อ่าน -> **ตัวหนา (Bold)** + สัญลักษณ์ Unread / อ่านแล้ว -> ตัวปกติ
  - สถานะการแก้ไข: แสดงป้าย `(แก้ไขแล้ว)` หากถูกอัปเดต

---

## 📌 Phase 6: ระบบสร้างเอกสารตามลำดับชั้นสั่งการ (Create / Edit Circular Letter & Hierarchical Routing)

- [x] **Step 6.1:** สร้างฟอร์ม `src/components/documents/CreateDocumentModal.jsx` (หัวข้อเรื่อง, เนื้อหาบันทึกข้อความ, ระดับความสำคัญ: ปกติ/ด่วน/ด่วนที่สุด/ลับ, อัปโหลดแนบไฟล์)
- [x] **Step 6.2:** **Hierarchical Document Routing:** เลือกขอบเขตการส่งตามลำดับชั้นสั่งการ FLAS KPS KU:
  - 🏛️ เวียนแจ้งทั้งคณะศิลปศาสตร์และวิทยาศาสตร์ (Faculty-wide)
  - 👔 เฉพาะหัวหน้าภาควิชา & หัวหน้างาน (Tier 2 Only)
  - 📂 สั่งการเฉพาะภายในภาควิชาตนเอง (Within Department)
  - ⬆️ เสนอบันทึกขึ้นตามลำดับชั้นบังคับบัญชา (Upward Routing)
- [x] **Step 6.3:** ระบบแก้ไขเอกสาร (Edit Document) พร้อมติดป้าย `(แก้ไขแล้ว)` อัตโนมัติ

---

## 📌 Phase 7: หน้ารายละเอียดเอกสาร การตอบกลับ และติดตามสถานะ (Document Detail, Reply & Tracking)

- [x] **Step 7.1:** `src/components/documents/DocumentDetailModal.jsx` (แสดงเนื้อหาฉบับเต็ม + ปุ่มดาวน์โหลดไฟล์แนบ)
- [x] **Step 7.2:** เพิ่มปุ่ม **"📅 บันทึกลง Google Calendar"** และ **"📥 ดาวน์โหลด .ics"** ในหน้ารายละเอียดเอกสาร
- [x] **Step 7.3:** ระบบตอบกลับเอกสาร / การลา (Reply & Comment System) พร้อมแนบไฟล์และ Timeline
- [x] **Step 7.4:** ระบบติดตามสถานะการเปิดอ่าน `FullReadTrackingModal.jsx` (แสดงรายชื่อผู้รับ + บันทึก วัน/เดือน/ปี เวลา Stamp)

---

## 📌 Phase 8: ระบบสิทธิ์การใช้งานและการสลับ Role/Tier (Role & Tier Switcher)

- [x] **Step 8.1:** ควบคุม State ล็อกอินและ Role/Tier ปัจจุบันผ่าน `apiClient.js` / Page State
- [x] **Step 8.2:** **FLAS KPS Role & Tier Switcher:** อัปเดตเมนูสลับผู้ใช้ใน `Header.jsx` ให้เลือกสลับทดสอบมุมมองระหว่าง คณบดี, รองคณบดี, หัวหน้าภาควิชา CS, หัวหน้าภาควิชา Sci, หัวหน้าสำนักงานเลขานุการ, อาจารย์ประจำ และเจ้าหน้าที่สารบรรณ ได้สะดวก
- [x] **Step 8.3:** UI แสดงผลเฉพาะปุ่ม/เมนูตามสิทธิ์ของตำแหน่งนั้นๆ

---

## 📌 Phase 9: การสอบทานและส่งมอบงาน (Verification & Testing)

- [x] **Step 9.1:** ทดสอบระบบ Build (`npm run build`) ผ่านสมบูรณ์ (14 Pages & API Routes Validated)
- [x] **Step 9.2:** ทดสอบ Flow ทั้งหมดแบบ End-to-End:
  - สร้าง User โดย Admin ➔ ซิงค์ Supabase ➔ ส่ง Employee ID + Pass เข้าอีเมลจริง
  - ล็อกอินด้วย Employee ID ➔ ส่ง OTP 6 หลักเข้าอีเมลจริง ➔ ยืนยัน 2FA ➔ บังคับเปลี่ยน Pass ครั้งแรก
  - กระดานงาน ➔ บันทึกลง Google Calendar ➔ เปิดอ่านติดตามเวลา ➔ ตอบกลับพร้อมแนบไฟล์

---

## 🛡️ การจัดการ Git Branches (Strict Branching Policy)
- 🚫 **`main` Branch:** **ห้าม Push ขึ้น `main` โดยเด็ดขาดตามนโยบาย**
- 🟢 **`develop` & `feature/*` Branches:** งานพัฒนาทั้งหมดถูกบันทึกและ Push ไปยัง branch `develop` และ `feature/hierarchical-routing`
