# 📑 FLAS KPS KU E-OFFICE + (ระบบหนังสือเวียนและจัดการงานสารบรรณ)
> ระบบสารบรรณอิเล็กทรอนิกส์และจัดการหนังสือเวียน คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน  
> พัฒนาด้วย **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL** และ **Nodemailer (Gmail SMTP)**

---

## 🌟 จุดเด่นและฟังก์ชันหลักของระบบ (Core Features)

1. **🔐 ระบบรักษาความปลอดภัยและการยืนยันตัวตน 2 ชั้น (2FA OTP via Email):**
   - ยืนยันตัวตน 2 ขั้นตอน (Password + รหัส OTP 6 หลัก ส่งตรงเข้า Email ผู้รับจริง)
   - มีปุ่ม **"คลิกเพื่อกรอกอัตโนมัติ ⚡"** ในหน้าต่าง OTP สำหรับความสะดวกในการทดสอบโหมด Development
   - **Smart Login Flow:** 
     - บัญชีที่เคยเปลี่ยนรหัสแล้ว (`isFirstLogin: false`): ยืนยันแค่ 2FA OTP เข้า Dashboard ได้ทันที
     - บัญชีใหม่ที่ไม่เคยเปลี่ยนรหัส (`isFirstLogin: true`): ยืนยัน OTP และส่งต่อไปบังคับตั้งรหัสผ่านใหม่ (Step 3) ตามลำดับ

2. **📜 ระบบหนังสือเวียนและติดตามการเปิดอ่าน (Circular Letters & Real-time Read Logs):**
   - สร้างและจัดส่งหนังสือเวียน กำหนดระดับความสำคัญ (ปกติ, ด่วน, ด่วนที่สุด)
   - กำหนดกลุ่มเป้าหมายผู้รับ: ทั้งคณะ (Global) หรือเฉพาะภาควิชา (Department)
   - แนบไฟล์เอกสารประกอบ (PDF, รูปภาพ)
   - **ระบบบันทึกการเปิดอ่านอัตโนมัติ (Read Logs):** แสดงชื่อ ตำแหน่ง และเวลาที่เปิดอ่านแบบ Real-time
   - ระบบกระดานตอบกลับ (Discussion Thread) และส่งแบบฟอร์มการลาพร้อมแนบหลักฐาน

3. **👥 ระบบทำเนียบบุคลากรและจัดการสิทธิ์ (Admin Portal & User Management):**
   - ออกรหัสพนักงาน (`EMP-XXXX`) และรหัสผ่านชั่วคราวแบบสุ่มอัตโนมัติ พร้อมส่งข้อมูลเข้าอีเมล
   - **🛡️ ระบบป้องกันการใช้อีเมลซ้ำ (Duplicate Email Protection):** ตรวจสอบแบบ Real-time บน UI ทันทีที่พิมพ์ หากซ้ำจะขึ้นแจ้งเตือนสีแดงและล็อกปุ่มบันทึก พร้อมตรวจสอบซ้ำที่ Backend API
   - **🗑️ ระบบลบผู้ใช้งาน (User Deletion):** มีปุ่มถังขยะพร้อมหน้าต่างยืนยันความปลอดภัย (Cascade Delete) และล็อกไม่ให้ลบ Master Admin (`EMP-D007`)
   - เครื่องมือตรวจสถานะฐานข้อมูลและ API Inspector สำหรับผู้ดูแลระบบ

---

## 🚀 การติดตั้งและรันระบบสำหรับเพื่อนในทีม (Getting Started)

### 1. ดึงซอร์สโค้ดจาก Branch `develop` (Clone Repository)
> ⚠️ **ข้อกำหนดสำคัญ:** โค้ดเวอร์ชันล่าสุดของทีมจะอยู่ที่ Branch **`develop`** เสมอ

```bash
git clone -b develop https://github.com/PasitPukang/Project_END.git
cd Project_END
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables (`.env`)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```
*(หรือสร้างไฟล์ `.env` ในโฟลเดอร์ราก ตรวจสอบค่า `DATABASE_URL` และรหัสผ่านเชื่อมต่อ PostgreSQL ให้ตรงกับเครื่องของคุณ)*

### 4. อัปเดตโครงสร้างฐานข้อมูลและสร้างข้อมูลทดสอบ (Database Setup & Seed)
```bash
# ตรวจสอบและสร้างตารางลง PostgreSQL
npx prisma db push

# สคริปต์สร้าง 5 บัญชีเริ่มต้นและเอกสารตัวอย่าง
node prisma/seed.js
```

### 5. รันระบบ (Run Development Server)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ การเปิดดูและจัดการฐานข้อมูล (Prisma Studio & Docker)

### วิธีเปิด Prisma Studio (Database GUI Web Interface)
เปิดแท็บ Terminal ใหม่แล้วรันคำสั่ง:
```bash
npx prisma studio
```
เปิดเบราว์เซอร์ไปที่: **[http://localhost:5555](http://localhost:5555)**  
*(สามารถดู/แก้ไข/ลบ ตาราง User, Document, ReadLog, Reply, Otp ได้โดยตรงผ่านหน้าเว็บ)*

### วิธีรันด้วย Docker Compose (Full Stack with PostgreSQL)
หากในเครื่องมี Docker Desktop สามารถสั่งรันทั้ง Database และ Web App ได้ในคำสั่งเดียว:
```bash
docker compose up -d
```

---

## 🔑 บัญชีทดสอบระบบหลัก 5 บทบาท (Official Test Accounts)

ระบบมี 5 บัญชีตั้งต้น ครอบคลุมทุกสิทธิ์การใช้งานตามโครงสร้างคณะฯ:

| บทบาท / สิทธิ์ (Role) | ชื่อ-ตำแหน่ง | Email (ใช้ล็อกอิน) | รหัสพนักงาน (ID) | รหัสผ่านเริ่มต้น | สถานะล็อกอิน |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Admin (IT Master)** | นายพสิษฐ์ ภูฆัง | `pasitpukang0@gmail.com` | `EMP-D007` | `Flas#AdminBest2026!` | เคยเปลี่ยนแล้ว |
| **Admin (คณบดี)** | รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์ | `pasitpukang1234567@gmail.com` | `EMP-D01` | `Flas#Dean2026!kps` | เคยเปลี่ยนแล้ว |
| **Dept Head (หัวหน้าภาค)** | ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ | `bestpasit2547@gmail.com` | `EMP-H01` | `Flas#HeadCS2026!kps` | เคยเปลี่ยนแล้ว |
| **Lecturer (อาจารย์)** | อ. วรวุฒิ สุวรรณโชติ | `bgee7242@gmail.com` | `EMP-L01` | `Flas#LcsWora2026!kps` | เคยเปลี่ยนแล้ว |
| **Staff (สายสนับสนุน)** | คุณ ปรียาภรณ์ สารบรรณดี | `pasit.pu@ku.th` | `EMP-S01` | `Flas#StaffAdmin2026!` | เคยเปลี่ยนแล้ว |

> 💡 **Trick สำหรับการทดสอบ:** ในหน้าเข้าสู่ระบบ มีปุ่ม Quick Select เลือกคลิกสลับบัญชีทดสอบด้านล่างได้ทันทีโดยไม่ต้องพิมพ์เอง

---

## 🧪 แนะนำการทดลองเล่นฟีเจอร์สำคัญ (Feature Testing Walkthrough)

### 1. ทดสอบการล็อกอิน และ 2FA OTP
- เลือกล็อกอินด้วยบัญชีใดก็ได้ใน 5 บัญชีด้านบน
- ในหน้า Step 2 (ยืนยัน OTP): ระบบจะส่ง OTP 6 หลักเข้าอีเมลจริง และจะมีปุ่มสีเหลือง **"คลิกเพื่อกรอกอัตโนมัติ ⚡"** แสดงรหัส OTP สำหรับความเร็วในการพัฒนา
- กดปุ่ม **"ยืนยันรหัส OTP (2FA)"** เพื่อเข้าสู่ Dashboard ทันที

### 2. ทดสอบระบบบังคับเปลี่ยนรหัสผ่านครั้งแรก (First-Time Password Change)
- เข้าสู่ระบบด้วยบัญชีแอดมิน (`EMP-D007`) -> ไปที่เมนู **"ผู้ดูแลระบบ"** ด้านซ้าย
- กดปุ่ม **"+ เพิ่มผู้ใช้ใหม่ (ขอรับบัญชี)"** -> กรอกข้อมูลพนักงานใหม่
- นำรหัสพนักงานและรหัสผ่านชั่วคราวที่ได้ ไปทดลองเข้าสู่ระบบ
- หลังกรอก OTP เสร็จสิ้น ระบบจะนำเข้าสู่ **Step 3 (แก้ไขรหัสผ่าน)** บังคับให้ตั้งรหัสผ่านใหม่ก่อนเข้าใช้งาน เมื่อเปลี่ยนแล้วครั้งต่อไปจะยืนยันแค่ OTP

### 3. ทดสอบการป้องกันอีเมลซ้ำ (Duplicate Email Validation)
- ในหน้าต่าง **"+ เพิ่มผู้ใช้ใหม่"** ลองพิมพ์อีเมลที่มีอยู่แล้ว เช่น `pasitpukang0@gmail.com`
- สังเกตแถบเตือนสีแดง: `⚠️ อีเมลนี้ถูกใช้งานแล้วในระบบ (...) ไม่สามารถใช้อีเมลซ้ำได้` และปุ่มกดสร้างจะถูกล็อกทันที

### 4. ทดสอบหนังสือเวียนและบันทึกการเปิดอ่าน (Read Tracking)
- กดปุ่ม **"+ สร้างจดหมายเวียน"** ที่มุมซ้ายบน -> กรอกหัวข้อ เนื้อหา และแนบไฟล์
- ลองเปิดอ่านเอกสาร -> สังเกตตัวเลขนับจำนวนผู้เปิดอ่าน และคลิกดูรายชื่อผู้ที่เปิดอ่านแล้วพร้อมเวลาที่บันทึก
- ทดลองพิมพ์ข้อความในกล่องตอบกลับ หรือแนบใบลา

---

## 🌿 กฎเกณฑ์การจัดการ Git Branches สำหรับทีม (Git Rules & Workflow)

```text
  main (ห้าม Push ตรง - รวมโค้ดผ่าน PR ที่ผ่าน CI/CD แล้วเท่านั้น)
   ▲
   │ (Pull Request & GitHub Actions Approved)
   │
 develop (Branch หลักในการรวมโค้ดที่เพื่อนๆ ทำงานร่วมกัน)
   ▲
   ├── feature/xxx  (แตกกิ่งออกมาพัฒนาฟีเจอร์ของตนเอง)
   └── fix/xxx      (สำหรับแก้บักเฉพาะจุด)
```

1. **ห้าม Push ขึ้น `main` โดยเด็ดขาด** (มี Branch Protection Rules ควบคุม)
2. **ก่อนเริ่มทำงานทุกครั้ง:** ดึงโค้ดล่าสุดจาก `develop`
   ```bash
   git checkout develop
   git pull origin develop
   ```
3. **เมื่อต้องการทำฟีเจอร์ใหม่:** แตก branch ย่อยจาก `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **เมื่อพัฒนาเสร็จ:** Push branch ของตนเองขึ้น GitHub แล้วกดสร้าง **Pull Request** เข้าสู่ `develop`

---

## 🛠️ โครงสร้างไฟล์สำคัญในโปรเจกต์ (Directory Structure)

```text
├── prisma/
│   ├── schema.prisma       # สกีมาฐานข้อมูล PostgreSQL (User, Document, ReadLog, Reply, Otp)
│   └── seed.js             # สคริปต์สร้าง 5 บัญชีเริ่มต้นและข้อมูลหนังสือเวียน
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── api/            # Backend REST API Routes (/api/auth, /api/documents, /api/users)
│   │   ├── layout.js       # Root Layout & Metadata
│   │   └── page.js         # State Machine จัดการ Login, OTP, Change Password, Dashboard
│   ├── components/         # React Components
│   │   ├── admin/          # ผู้ดูแลระบบ: ทำเนียบบุคลากร, ลบผู้ใช้, ตรวจสอบ Backend
│   │   ├── auth/           # เข้าสู่ระบบ, ยืนยัน OTP, แก้ไขรหัสผ่านครั้งแรก
│   │   ├── dashboard/      # หน้าแสดงรายการหนังสือเวียนตามหมวดหมู่ (Inbox, Global, Dept, Sent)
│   │   ├── documents/      # รายละเอียดเอกสาร, อ่านแล้ว, แบบฟอร์มสร้างหนังสือเวียน
│   │   └── layout/         # เมนูด้านข้าง (Sidebar), แถบด้านบน (Header)
│   └── lib/                # Client Helpers (apiClient.js, emailService.js, prisma.js)
├── docker-compose.yml       # คอนฟิก Docker สำหรับ PostgreSQL และ Next.js Web App
├── Dockerfile              # Multi-stage build สำหรับรัน Production Container
├── WORKFLOW.md             # รายละเอียดการพัฒนาครบทุก Phase
└── README.md               # เอกสารคู่มือสำหรับทีมพัฒนา
```

---

*จัดทำขึ้นสำหรับการพัฒนาและส่งมอบโครงการ E-Office คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน*
