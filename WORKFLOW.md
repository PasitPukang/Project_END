# 🛠️ WORKFLOW: ขั้นตอนการพัฒนาระบบ Loki Task Manager & Document Management System

เอกสารนี้ระบุขั้นตอนการทำงาน (Workflow & Implementation Checklist) ที่เรียงลำดับทีละขั้นตอน เพื่อให้ AI Agent หรือผู้พัฒนาสามารถอ่านและดำเนินงานตามลำดับได้อย่างเป็นระบบ

---

## 📌 Phase 1: การติดตั้งโปรเจกต์และระบบดีไซน์ (Project Initialization & Design System)
- [ ] **Step 1.1:** สร้างโปรเจกต์ Vite + React ใน `d:\HR_project`
  * คำสั่ง: `npx -y create-vite@latest ./ --template react`
- [ ] **Step 1.2:** ติดตั้ง Icon Library (`lucide-react`) และ dependencies ที่จำเป็น
  * คำสั่ง: `npm install lucide-react`
- [ ] **Step 1.3:** วางโครงสร้าง CSS Design System ใน `src/index.css`
  * ออกแบบ Theme (Sleek Dark / Modern Light, Custom Color Tokens, Badges, Typography, Animations, Modals)

---

## 📌 Phase 2: โครงสร้างข้อมูลและ Mock Database Engine (Data Models & Mock Services)
- [ ] **Step 2.1:** สร้าง `src/services/mockData.js` กำหนด Seed Data สำหรับทดสอบ 5-10 Personas
  * Roles: `Admin`, `Department Head (หัวหน้าสาขา)`, `Lecturer (อาจารย์)`, `Staff (เจ้าหน้าที่)`
  * ตัวอย่าง Users, Departments, Initial Circular Letters, Read Logs
- [ ] **Step 2.2:** สร้าง `src/services/storageService.js` จัดเก็บข้อมูลลง Browser LocalStorage
  * ฟังก์ชัน CRUD สำหรับ Users, Documents, Replies, Read Logs
- [ ] **Step 2.3:** สร้าง `src/services/authService.js` สำหรับจัดการระบบสมาชิก & OTP Engine
  * ระบบสุ่ม ID (ไม่ซ้ำ), สุ่ม Password อัตโนมัติ
  * ระบบสร้างและตรวจสอบ OTP (หมดอายุภายใน 2 นาที / 120 วินาที)

---

## 📌 Phase 3: ระบบยืนยันตัวตนและการเข้าสู่ระบบ (Authentication & 2FA Module)
- [ ] **Step 3.1:** สร้างส่วนประกอบ `src/components/auth/LoginPage.jsx`
  * ฟอร์มระบุ ID & Password
- [ ] **Step 3.2:** สร้างส่วนประกอบ `src/components/auth/OtpModal.jsx`
  * Modal กรอก OTP 6 หลัก
  * ตัวนับถอยหลัง Timer 120s (2 นาที)
  * ปุ่ม Resend OTP เมื่อรหัสหมดอายุ
- [ ] **Step 3.3:** สร้างส่วนประกอบ `src/components/auth/FirstTimePasswordModal.jsx`
  * บังคับเปลี่ยนรหัสผ่านทันทีเมื่อล็อกอินบัญชีใหม่ครั้งแรก
- [ ] **Step 3.4:** สร้างส่วนประกอบ `src/components/auth/ForgotPasswordModal.jsx`
  * กรอก Email -> ส่ง OTP (2 นาที) -> กรอก OTP -> ตั้ง Password ใหม่

---

## 📌 Phase 4: ระบบจัดการผู้ใช้งานสำหรับ Admin (User Management Module)
- [ ] **Step 4.1:** สร้างหน้า `src/components/admin/UserManagement.jsx` (เข้าได้เฉพาะ Admin)
- [ ] **Step 4.2:** สร้างฟอร์ม "เพิ่มผู้ใช้ใหม่" (Add New User Form)
  * ระบุชื่อ, นามสกุล, อีเมล, สังกัด/สาขา, เลือก Role
- [ ] **Step 4.3:** ระบบสุ่ม ID & Password อัตโนมัติ
- [ ] **Step 4.4:** Pop-up Modal แสดง ID & Password พร้อม "ปุ่มส่งข้อมูล"
  * แสดงข้อมูลบัญชีที่เพิ่งสร้าง
  * ปุ่มกดเพื่อจำลองการส่งข้อมูล ID/Password แจ้งเตือนไปยัง Email ของพนักงาน

---

## 📌 Phase 5: ระบบกระดานงานและจดหมายเวียน (Task Boards & Circular Letters Module)
- [ ] **Step 5.1:** สร้างหน้าแดชบอร์ดหลัก `src/components/dashboard/Dashboard.jsx`
- [ ] **Step 5.2:** สร้างระบบสลับ 3 กระดานงาน (Tab Navigation):
  1. `กระดานงานรวม (Global Board)` - ประกาศทั่วไปถึงทุกคน
  2. `กระดานงานฝ่าย (Department Board)` - เอกสารเฉพาะฝ่าย/สาขาตนเอง
  3. `กระดานงานส่วนตัว (Personal Board)` - เอกสารส่งตรง หรือสร้างเอง
- [ ] **Step 5.3:** ระบบค้นหาและตัวกรอง (Search & Filter Bar):
  * ช่องค้นหาด้วยคำค้น (Text Search)
  * ตัวกรองค้นหาตามช่วงเวลา (วัน/เดือน/ปี - Date Range Filter)
- [ ] **Step 5.4:** แสดงรายการการ์ดเอกสาร (`DocumentCard.jsx`):
  * ป้ายระดับความสำคัญ (`ปกติ`, `ด่วน`, `ด่วนที่สุด`)
  * สถานะการอ่าน: หากยังไม่อ่าน -> **ตัวหนา (Bold)** + สัญลักษณ์ Unread / อ่านแล้ว -> ตัวปกติ
  * สถานะการแก้ไข: แสดงป้าย `(แก้ไขแล้ว)` หากถูกอัปเดต

---

## 📌 Phase 6: ระบบสร้างและแก้ไขเอกสารเวียน (Create / Edit Circular Letter Module)
- [ ] **Step 6.1:** สร้างฟอร์ม `src/components/documents/CreateDocumentModal.jsx`
  * หัวข้อเรื่อง, เนื้อหาบันทึกข้อความ (Rich Text/Textarea)
  * เลือกความสำคัญ (ปกติ, ด่วน, ด่วนที่สุด)
  * อัปโหลดและแนบไฟล์เอกสาร (File Attachment)
- [ ] **Step 6.2:** การเลือกกลุ่มเป้าหมายผู้รับตามระดับชั้น (Routing Scope):
  * ส่งรายบุคคล (Individual)
  * ส่งตามสายงาน/ฝ่าย (Department)
  * สั่งการตามลำดับขั้น (Hierarchical Order)
  * เวียนแจ้งทั้งคณะ (Faculty-wide)
- [ ] **Step 6.3:** ระบบแก้ไขเอกสาร (Edit Document):
  * ผู้สร้างสามารถแก้ไขรายละเอียดได้ โดยระบบจะติดป้าย `(แก้ไขแล้ว)` อัตโนมัติ

---

## 📌 Phase 7: หน้ารายละเอียดเอกสาร การตอบกลับ และติดตามสถานะ (Document Detail, Reply & Tracking)
- [ ] **Step 7.1:** สร้างหน้าแสดงรายละเอียดเอกสาร `src/components/documents/DocumentDetailModal.jsx`
  * แสดงเนื้อหาฉบับเต็ม และปุ่มดาวน์โหลดไฟล์แนบ
- [ ] **Step 7.2:** ระบบตอบกลับเอกสาร / การลา (Reply & Comment System):
  * ช่องพิมพ์ข้อความตอบกลับ
  * ปุ่มอัปโหลดแนบไฟล์ในการตอบกลับ (เช่น ใบลา, รายงาน)
  * แสดงประวัติการตอบกลับแบบ Timeline
- [ ] **Step 7.3:** ระบบติดตามสถานะการเปิดอ่าน (Read Status Tracking - เฉพาะผู้สั่งงาน/ผู้ส่ง):
  * รายชื่อผู้รับทั้งหมด
  * บันทึก วัน/เดือน/ปี และเวลา ที่ผู้รับแต่ละคนกดเปิดอ่านเอกสาร (Date/Time Stamp)

---

## 📌 Phase 8: ระบบสิทธิ์การใช้งาน (Role-Based Access Control & UI Scope)
- [ ] **Step 8.1:** สร้าง `src/context/AuthContext.jsx` ควบคุม State การล็อกอินและ Role ปัจจุบัน
- [ ] **Step 8.2:** สร้างระบบสลับ Role จำลอง (Role Switcher Toolbar) ใน Header เพื่อให้ทดสอบเปลี่ยนมุมมองระหว่าง `Admin`, `หัวหน้าสาขา`, `อาจารย์`, `เจ้าหน้าที่` ได้สะดวก
- [ ] **Step 8.3:** ตรวจสอบให้ UI แสดงผลเฉพาะปุ่ม/เมนูตามสิทธิ์ของตำแหน่งนั้นๆ (เช่น เมนูเพิ่มผู้ใช้ใหม่เปิดได้เฉพาะ Admin)

---

## 📌 Phase 9: การสอบทานและส่งมอบงาน (Verification & Testing)
- [ ] **Step 9.1:** ทดสอบระบบ Build: `npm run build` ต้องสำเร็จโดยไม่มี Syntax/Lint Errors
- [ ] **Step 9.2:** ทดสอบ Flow ทั้งหมดตั้งแต่ 1) สร้าง User โดย Admin 2) ล็อกอิน 2FA OTP 3) บังคับเปลี่ยน Pass 4) สร้างเอกสารเวียน 5) เปิดอ่าน (ติดตามวันเวลา) 6) ตอบกลับพร้อมแนบไฟล์
