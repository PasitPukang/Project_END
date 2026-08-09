# 📑 Loki Task Manager & Document Management System

ระบบจัดการภาระงานและเอกสารเวียน (Circular Letters) สำหรับองค์กร พัฒนาด้วย **Next.js 14 (App Router)**, **Tailwind CSS** และ **Prisma ORM (SQLite)**

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)

### 1. ดึงซอร์สโค้ด (Clone Repository)
```bash
git clone https://github.com/PasitPukang/Project_END.git
cd Project_END
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Database & สร้างข้อมูลทดสอบ (Seed Data)
```bash
# สร้างโครงสร้างฐานข้อมูล SQLite
npx prisma db push

# สรรสร้างข้อมูลทดสอบเริ่มต้น (Seed Users, Documents)
node prisma/seed.js
```

### 4. เปิดใช้งานระบบในเครื่อง (Run Development Server)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 🌿 โครงสร้าง Git Branches & แนวทางการทำงานร่วมกัน (Git Team Workflow)

### โครงสร้าง Branch ใน GitHub
* 🔴 **`main`**: โค้ดเสถียรสำหรับใช้งานจริง (Production) - *ไม่อนุญาตให้ `git push` ตรง*
* 🔵 **`develop`**: Branch หลักสำหรับรวมงานของทีมทั้งหมด ก่อนทดสอบขึ้น main
* 🟢 **`feature/*`**: Branch ย่อยสำหรับแยกย้ายกันพัฒนาฟีเจอร์เฉพาะด้าน:
  * `feature/cloud-storage`: สำหรับพัฒนาระบบอัปโหลดไฟล์ไปที่ Cloud (S3/Cloudinary)
  * `feature/notification-system`: สำหรับพัฒนาระบบส่ง SMS/Email OTP จริง และ Real-time Notifications
  * `feature/reports-analytics`: สำหรับพัฒนาระบบออกรายงานสรุปสถิติ PDF/Excel

---

## 🔄 ขั้นตอนการทำงานประจำวันสำหรับนักพัฒนา (Daily Workflow)

### ขั้นตอนที่ 1: ดึงโค้ดล่าสุดจาก `develop` ทุกครั้งก่อนเริ่มงาน
```bash
git checkout develop
git pull origin develop
```

### ขั้นตอนที่ 2: สลับไปทำงานใน Feature Branch ของตนเอง
```bash
git checkout feature/cloud-storage  # ตัวอย่างสลับไป branch ของตนเอง
git merge develop                    # อัปเดตโค้ดล่าสุดจาก develop เข้ามา
```

*(หากต้องการสร้าง Branch ฟีเจอร์ใหม่)*:
```bash
git checkout -b feature/your-feature-name
```

### ขั้นตอนที่ 3: บันทึกงาน (Commit & Push)
```bash
git add .
git commit -m "feat: เพิ่มระบบอัปโหลดไฟล์แบบ drag-and-drop"
git push origin feature/your-feature-name
```

### ขั้นตอนที่ 4: ส่ง Pull Request (PR) เข้า `develop`
1. ไปที่ GitHub Repository: https://github.com/PasitPukang/Project_END
2. กดปุ่ม **Compare & pull request**
3. เลือก **base: `develop`** ⬅️ **compare: `feature/your-feature-name`**
4. แจ้งเพื่อนในทีมมาร่วมตรวจทาน (Code Review) และกด Merge เข้า `develop`

---

## 🔑 บัญชีสำหรับทดสอบระบบ (Test Accounts & Passwords)

สามารถใช้บัญชีทดสอบตาม Role ต่างๆ ได้ทันที (ทุกบัญชีรหัสผ่านเริ่มต้นคือ `password123`):

| Role | Username / ID | Password | สิทธิ์การใช้งาน |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin01` | `password123` | จัดการผู้ใช้ทั้งหมด, ดู API Stats Backend, สร้างเอกสารได้ทุกระดับ |
| **หัวหน้าสาขา (Department Head)** | `head01` | `password123` | จัดการเอกสารเวียนในฝ่ายตนเอง, สั่งการตามลำดับขั้น, ดูสถิติการอ่าน |
| **อาจารย์ (Lecturer)** | `lec01` | `password123` | ดูและอ่านเอกสารเวียน, ตอบกลับเอกสาร, แนบใบลา/รายงาน |
| **เจ้าหน้าที่ (Staff)** | `staff01` | `password123` | อ่านเอกสารทั่วไป, ตอบกลับเอกสารเวียน |

---

## 🛠️ โครงสร้างไฟล์ในโปรเจกต์ (Project Structure)

```text
├── prisma/
│   ├── schema.prisma       # ฐานข้อมูล Prisma Schema (Users, Documents, Replies, Logs)
│   └── seed.js             # สคริปต์สร้างข้อมูลทดสอบ
├── src/
│   ├── app/                # Next.js App Router (Pages & API Routes)
│   │   ├── api/            # Backend REST API Routes (/api/auth, /api/documents, /api/users)
│   │   └── page.js         # หน้าเว็บหลัก
│   ├── components/         # React Components
│   │   ├── admin/          # UI สำหรับ Admin (User Management, Backend Stats)
│   │   ├── auth/           # UI สำหรับการล็อกอิน & 2FA OTP Modal
│   │   ├── dashboard/      # แดชบอร์ดหลัก & กระดานงาน (Global, Dept, Personal)
│   │   ├── documents/      # Modal สร้าง/แก้ไข/รายละเอียด/ติดตามการเปิดอ่าน
│   │   └── layout/         # Header & Sidebar & Role Switcher Toolbar
│   └── lib/                # Utility Services (apiClient.js, storageService.js, mockDatabase.js)
├── WORKFLOW.md             # สถานะและแผนการพัฒนาระบบ
└── README.md               # คู่มือเริ่มต้นสำหรับนักพัฒนา
```
