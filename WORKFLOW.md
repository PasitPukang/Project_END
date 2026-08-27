# 🛠️ WORKFLOW: ขั้นตอนการพัฒนาระบบ Loki Task Manager & Document Management System

เอกสารนี้ระบุสถานะขั้นตอนการทำงาน (Workflow & Implementation Status) ที่ได้รับการอัปเดตล่าสุดให้สอดคล้องกับ Codebase ปัจจุบัน

---

## 📊 สรุปภาพรวมสถานะการพัฒนา (Current Development Summary)

- ✅ **สถานะการทำงาน:** เสร็จสิ้นการพัฒนาระบบ E-Office เต็มรูปแบบ พร้อมระบบส่งเอกสารตามลำดับชั้น, ฐานข้อมูล PostgreSQL, ความปลอดภัยระดับองค์กร, สถาปัตยกรรมคอนเทนเนอร์ (Docker) และระบบ CI/CD Pipeline อัตโนมัติ
- 🔄 **เทคโนโลยีหลักและโครงสร้างองค์กรที่ใช้งาน (Real Stack & FLAS KPS KU Integration):**
  - **Organization Model:** อ้างอิงโครงสร้างบุคลากร **คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU - https://flas.kps.ku.ac.th/)**
  - **4-Tier Hierarchy Architecture:**
    - `Tier 1`: ผู้บริหารระดับคณะ (คณบดี, รองคณบดีฝ่ายวิชาการ, ฝ่ายบริหาร ฯลฯ)
    - `Tier 2`: หัวหน้าภาควิชา & หัวหน้างาน (หัวหน้าภาควิชา CS/IT, วิทยาศาสตร์กายภาพ, ชีววิทยา, สำนักงานเลขานุการคณะ)
    - `Tier 3`: อาจารย์ประจำภาควิชา (อาจารย์สาขา CS, IT, เคมี ฯลฯ)
    - `Tier 4`: บุคลากรสายสนับสนุน (เจ้าหน้าที่งานบริหาร/สารบรรณ, การเงินและพัสดุ, บริการการศึกษา)
  - **Framework & Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide Icons (รองรับ Responsive, Glassmorphism และ Micro-animations)
  - **Authentication & Database:** 
    - **PostgreSQL 16** (รันผ่าน Local Docker Container และรองรับ Supabase Cloud PostgreSQL)
    - **Prisma ORM** (`@prisma/client`) จัดการ Data Schema และ Migrations
    - **Serverless Resilient Fallback:** มีระบบ In-memory & LocalStorage Fallback ใน API Routes เพื่อความเสถียรสูงสุดกรณีรันบน Serverless (เช่น Vercel)
  - **Email Gateway:** Nodemailer SMTP Transport ส่ง 2FA OTP 6 หลัก และส่งข้อมูล Employee ID (`EMP-XXXX`) เข้าอีเมลพนักงานจริง
  - **Calendar Sync:** Google Calendar API Links & iCal (.ics Export)
  - **DevOps & CI/CD:** Multi-stage Dockerfile (`node:20-alpine`, `standalone`), `docker-compose.yml`, GitHub Actions CI/CD Pipeline (`ci-cd.yml`)

---

## 📌 Phase 1: การติดตั้งโปรเจกต์และระบบดีไซน์ (Project Initialization & Design System)

- [x] **Step 1.1:** สร้างโปรเจกต์ Next.js 14 App Router ใน `d:\HR_project`
- [x] **Step 1.2:** ติดตั้ง Icon Library (`lucide-react`) และ dependencies เช่น `@supabase/supabase-js`, `nodemailer`, `@prisma/client`, `prisma`, `tailwindcss`
- [x] **Step 1.3:** วางโครงสร้าง CSS Design System ใน `src/app/globals.css` และ `tailwind.config.js`
  - ออกแบบ Theme (Modern Light/Dark, Custom Tokens, Badges, Typography, Animations, Modals)
- [x] **Step 1.4:** ปรับปรุง UX/UI Redesign: เพิ่ม Micro-animations, Glassmorphism, Modern Cards, และจัดระบบ Layout รองรับทั้งหน้าจอเดสก์ท็อปและสมาร์ทโฟน

---

## 📌 Phase 2: โครงสร้างข้อมูลบุคลากร FLAS KPS KU (Data Models & Services)

- [x] **Step 2.1:** ออกแบบ `prisma/schema.prisma` รองรับ PostgreSQL พร้อมโมเดล `User`, `Otp`, `Document`, `ReadLog`, `Reply`
- [x] **Step 2.2:** สร้าง `src/lib/mockDatabase.js` และ `prisma/seed.js` บรรจุข้อมูลบุคลากรตัวอย่าง 12 Personas อ้างอิง FLAS KPS KU ครบทั้ง 4 Tiers พร้อมรหัสผ่านเฉพาะบุคคลที่มีความปลอดภัยสูง (High-Entropy Passwords)
- [x] **Step 2.3:** สร้างระบบ Resilient Storage ใน `src/lib/storageService.js` และ Next.js API Routes พร้อม Fallback อัตโนมัติเมื่อทำงานในสภาวะ Serverless
- [x] **Step 2.4:** สร้างระบบ OTP Engine & Random Employee ID (`EMP-XXXX`) Generation

---

## 📌 Phase 3: ระบบยืนยันตัวตนและการเข้าสู่ระบบด้วย Real Email (Authentication & 2FA Module)

- [x] **Step 3.1:** `src/components/auth/LoginPage.jsx` (ฟอร์มระบุ ID & Password ตาม Mockup FLAS KPS KU พร้อมปุ่มแสดง/ซ่อนรหัสผ่าน)
- [x] **Step 3.2:** `src/components/auth/OtpModal.jsx` (Modal กรอก OTP 6 หลัก, นับถอยหลัง 120s, ปุ่ม Resend OTP สูงสุด 3 ครั้ง)
- [x] **Step 3.3:** **Real Email OTP Dispatching:** เชื่อมต่อ `sendOtpEmail` ใน `src/app/api/auth/otp/send/route.js` ส่ง OTP เข้าอีเมลจริงของผู้ใช้
- [x] **Step 3.4:** `src/components/auth/FirstTimePasswordModal.jsx` (บังคับเปลี่ยนรหัสผ่านทันทีเมื่อล็อกอินครั้งแรก)
- [x] **Step 3.5:** `src/components/auth/ForgotPasswordModal.jsx` (กรอก Email -> ส่ง Real OTP เข้าอีเมลจริง -> ตั้ง Password ใหม่)

---

## 📌 Phase 4: ระบบจัดการผู้ใช้งานสำหรับ Admin & ส่ง ID เข้าอีเมลจริง (User Management Module)

- [x] **Step 4.1:** `src/components/admin/UserManagementModal.jsx` & `AdminView.jsx` (เข้าได้เฉพาะสิทธิ์ Admin)
- [x] **Step 4.2:** ฟอร์มเพิ่มผู้ใช้ใหม่ (ระบุชื่อ, นามสกุล, อีเมล, สังกัด/สาขา, ตำแหน่ง, Tier, Role)
- [x] **Step 4.3:** ระบบสุ่ม Employee ID (`EMP-XXXX`) & Password อัตโนมัติ พร้อมซิงค์ลง PostgreSQL / Supabase
- [x] **Step 4.4:** **Real Credentials Email Dispatching:** ส่งอีเมลแจ้งสิทธิ์, Employee ID และรหัสผ่านชั่วคราว ไปยังอีเมลจริงของพนักงานที่เพิ่งถูกเพิ่มทันที
- [x] **Step 4.5:** `src/components/admin/AdminBackendModal.jsx` (ตรวจสอบสถานะระบบ, สถิติผู้ใช้งาน และ API Routes)

---

## 📌 Phase 5: ระบบกระดานงานและปฏิทิน (Task Boards, Circular Letters & Calendar Integration)

- [x] **Step 5.1:** หน้าแดชบอร์ดหลัก `src/components/dashboard/Dashboard.jsx`
- [x] **Step 5.2:** ระบบสลับ 3 กระดานงาน (Global Board, Department Board, Personal Board)
- [x] **Step 5.3:** **Google Calendar & iCal Integration:**
  - ปุ่ม **"📅 Google"** บนการ์ดเอกสารในกระดานงาน เพื่อเปิดหน้าบันทึกกิจกรรมใน Google Calendar โดยตรง
  - ปุ่ม **"📥 iCal"** บนการ์ดเอกสาร เพื่อดาวน์โหลดไฟล์ `.ics` นำเข้า Apple Calendar / Outlook / Windows Calendar
- [x] **Step 5.4:** ระบบค้นหาคำค้น (Text Search) และตัวกรองช่วงเวลา (Date Range Filter: วัน/เดือน/ปี)
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
- [x] **Step 7.3:** ระบบตอบกลับเอกสาร / ส่งคำขอลา (Reply & Comment System) พร้อมแนบไฟล์และแสดง Timeline
- [x] **Step 7.4:** ระบบติดตามสถานะการเปิดอ่าน `FullReadTrackingModal.jsx` (แสดงรายชื่อผู้รับ + บันทึก วัน/เดือน/ปี เวลา Stamp ที่เปิดอ่านจริง)

---

## 📌 Phase 8: ระบบสิทธิ์การใช้งานและความปลอดภัยขั้นสูง (RBAC & Security Hardening)

- [x] **Step 8.1:** ควบคุม State ล็อกอินและ Role/Tier ปัจจุบันผ่าน `apiClient.js` และ Page State
- [x] **Step 8.2:** **Strict RBAC Enforcement (Security Audit Hardening):** ถอด Quick User Switcher Dropdown ออก เพื่อบังคับใช้การตรวจสอบสิทธิ์ผ่านการเข้าสู่ระบบและยืนยันตัวตน 2FA OTP จริงตามมาตรฐาน Zero-Trust
- [x] **Step 8.3:** UI แสดงผลเฉพาะปุ่ม/เมนูตามสิทธิ์ของตำแหน่งนั้นๆ (เช่น เมนูสร้างผู้ใช้/เข้าหน้าระบบหลังบ้านเปิดเฉพาะ Admin)
- [x] **Step 8.4:** กำหนดรหัสผ่านเริ่มต้นของบุคลากรตัวอย่างแบบ High-Entropy Enterprise Passwords ใน Seed Database แทนรหัสผ่านทั่วไป

---

## 📌 Phase 9: การสอบทานและส่งมอบงาน (Verification & Testing)

- [x] **Step 9.1:** ทดสอบระบบ Build (`npm run build`) ผ่านสมบูรณ์ (14 Pages & API Routes Validated)
- [x] **Step 9.2:** ทดสอบ Flow ทั้งหมดแบบ End-to-End:
  - สร้าง User โดย Admin ➔ ซิงค์ Database ➔ ส่ง Employee ID + Pass เข้าอีเมลจริง
  - ล็อกอินด้วย Employee ID ➔ ส่ง OTP 6 หลักเข้าอีเมลจริง ➔ ยืนยัน 2FA ➔ บังคับเปลี่ยน Pass ครั้งแรก
  - กระดานงาน ➔ บันทึกลง Google Calendar ➔ เปิดอ่านติดตามเวลา ➔ ตอบกลับพร้อมแนบไฟล์

---

## 📌 Phase 10: สถาปัตยกรรมคอนเทนเนอร์และการติดตั้ง Production (Containerization & Deployment)

- [x] **Step 10.1:** **Multi-stage Dockerfile:**
  - สร้าง [Dockerfile](file:///d:/HR_project/Dockerfile) แบบ Multi-stage (`deps` ➔ `builder` ➔ `runner`) บน `node:20-alpine`
  - กำหนด `output: 'standalone'` ใน [next.config.mjs](file:///d:/HR_project/next.config.mjs) เพื่อลดขนาด Image
  - รันแอปพลิเคชันด้วย Non-root user (`nextjs:nodejs` UID/GID 1001)
  - กำหนด [.dockerignore](file:///d:/HR_project/.dockerignore) กรองไฟล์และแคชที่ไม่จำเป็น
- [x] **Step 10.2:** **Docker Compose Orchestration:**
  - สร้าง [docker-compose.yml](file:///d:/HR_project/docker-compose.yml) จัดการ Container สำหรับ PostgreSQL 16 Alpine (`postgres-db`) พร้อม Healthcheck และ Volume Persistence
  - จัดการ Container Web Application (`web-app`) ให้เชื่อมต่อและรันหลังจาก Database พร้อมทำงานสมบูรณ์
- [x] **Step 10.3:** **Deployment Runbook:**
  - จัดทำเอกสาร [DEPLOYMENT.md](file:///d:/HR_project/DEPLOYMENT.md) อธิบายขั้นตอนการ Deploy ทั้งแบบ Docker Compose, Manual Setup, Database Migrations และแนวทาง Troubleshooting

---

## 📌 Phase 11: ระบบ CI/CD อัตโนมัติด้วย GitHub Actions (Automated CI/CD Pipeline)

- [x] **Step 11.1:** **Workflow Configuration:**
  - สร้าง [.github/workflows/ci-cd.yml](file:///d:/HR_project/.github/workflows/ci-cd.yml) รองรับ Event `push` และ `pull_request` บน Branch `main`, `develop`, และ `feature/**`
- [x] **Step 11.2:** **Stage 1 (Code Quality, Schema Validation & Build Check):**
  - ติดตั้ง Node.js 20.x พร้อม Cache Dependencies
  - ตรวจสอบความถูกต้องของ Prisma Schema (`npx prisma validate`)
  - สร้าง Prisma Client (`npx prisma generate`)
  - ตรวจสอบ Next.js Production Build (`npm run build`)
- [x] **Step 11.3:** **Stage 2 (Docker Container Build & Security Sanity):**
  - ติดตั้ง Docker Buildx
  - ดำเนินการทดสอบประกอบ Docker Container Image (Dry Run Build) พร้อมระบบ Cache อัตโนมัติ

---

---

## 📌 Phase 12: การจัดการความปลอดภัยและปรับปรุงระบบตามความต้องการ (User Management & Security Hardening)

- [x] **Step 12.1:** **ฐานข้อมูล 5 บัญชีเริ่มต้นตามบทบาท (Role-Based 5 Test Accounts):**
  - ปรับปรุงและซิงค์บัญชีผู้ใช้ในระบบให้เหลือ 5 บัญชีหลักตามสิทธิ์ (Admin, คณบดี, หัวหน้าภาค, อาจารย์, สายสนับสนุน)
- [x] **Step 12.2:** **ระบบส่งอีเมลจริงตรงถึงผู้รับ (Live Unlocked Email Delivery):**
  - ปลดล็อคระบบการส่งอีเมลจริงผ่าน Gmail SMTP ให้ส่งตรงถึงผู้รับทุกคนตามที่ระบุในแบบฟอร์ม
- [x] **Step 12.3:** **ระบบลบผู้ใช้งาน (User Deletion & Cascade Clean):**
  - เพิ่มปุ่มลบผู้ใช้ (Trash Icon) พร้อมหน้าต่างยืนยัน และล็อกป้องกันการลบ Master Admin (`EMP-D007`)
  - รองรับ API `DELETE /api/users/[id]` พร้อมล้างข้อมูลที่เกี่ยวข้องแบบ Cascade
- [x] **Step 12.4:** **ระบบป้องกันการใช้อีเมลซ้ำ (Duplicate Email Protection):**
  - ตรวจสอบอีเมลซ้ำแบบ Real-time บน UI หน้าต่างเพิ่มผู้ใช้ พร้อมแจ้งเตือนขอบแดงและปิดกั้นปุ่มสร้าง
  - ตรวจสอบระดับ Backend API ป้องกันการแทรกข้อมูลอีเมลซ้ำลงในฐานข้อมูล
- [x] **Step 12.5:** **การเข้าสู่ระบบแบบตามลำดับความปลอดภัย (Sequential 2FA & Password Policy):**
  - สำหรับผู้ใช้ที่เคยเปลี่ยนรหัสผ่านแล้ว (`isFirstLogin: false`): ยืนยันเพียงรหัสผ่านสองชั้น (2FA OTP) เข้าสู่หน้าหลักทันที ไม่ต้องเปลี่ยนรหัสผ่านซ้ำ
  - สำหรับผู้ใช้ใหม่ที่ยังไม่เคยเปลี่ยนรหัสผ่าน (`isFirstLogin: true`): ยืนยัน OTP ทางอีเมล แล้วนำส่งเข้าสู่หน้าต่างบังคับเปลี่ยนรหัสผ่านตามลำดับ
- [x] **Step 12.6:** **การทดสอบระบบแบบอัตโนมัติครบวงจร (Playwright E2E Verification):**
  - ผ่านการทดสอบด้วยชุดทดสอบ Playwright ครบทุกขั้นตอน 7 Scenario ตั้งแต่ Login, สร้างจดหมาย, ตอบกลับ, อ่านเอกสาร, จัดการสิทธิ์ ยันลบเอกสาร

---

## 🛡️ การจัดการ Git Branches (Strict Branching Policy)

- 🚫 **`main` Branch:** **ห้าม Push ขึ้น `main` โดยเด็ดขาดตามนโยบาย**
- 🟢 **`develop` & `feature/*` Branches:** งานพัฒนาทั้งหมดถูกบันทึกและ Push ไปยัง branch `develop` (ปัจจุบัน Up to date กับ `origin/develop`)
- 🔒 **Merge Requirement:** การรวมโค้ดเข้าสู่ `main` ต้องผ่าน Pull Request และผ่านการตรวจสอบของ GitHub Actions CI/CD Pipeline ครบทุก Stage เท่านั้น

