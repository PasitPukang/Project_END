# 📑 Loki Task Manager & Document Management System

ระบบจัดการภาระงานและเอกสารเวียน (Circular Letters) สำหรับองค์กร พัฒนาด้วย **Next.js 14 (App Router)**, **Tailwind CSS** และ **Prisma ORM (SQLite)**

---

## 🚀 การติดตั้งและเริ่มต้นใช้งานสำหรับผู้พัฒนา (Getting Started)

### 1. ดึงซอร์สโค้ดจาก Branch `develop` (Clone Repository)
> ⚠️ **สำคัญ:** โค้ดเวอร์ชันล่าสุดที่ใช้ในการพัฒนาจะอยู่ที่ Branch **`develop`** 

```bash
# โคลนพร้อมสลับไปที่ branch develop ทันที
git clone -b develop https://github.com/PasitPukang/Project_END.git
cd Project_END
```

*(หรือหากโคลนแบบปกติมา ให้สลับ branch ด้วย `git checkout develop`)*

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Database & สร้างข้อมูลทดสอบ (Seed Data)
```bash
# สร้าง Prisma Client
npx prisma generate

# สร้างและปรับปรุงโครงสร้างฐานข้อมูล SQLite
npx prisma db push

# สร้างข้อมูลเริ่มต้นสำหรับทดสอบระบบ (Seed Accounts, Sample Documents)
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

## 🔑 บัญชีสำหรับทดสอบระบบ (FLAS KPS KU Test Accounts & Secure Passwords)

สามารถใช้บัญชีตามลำดับชั้น 4 Tiers โดยแต่ละบัญชีถูกกำหนดรหัสผ่านความปลอดภัยสูง (High-Entropy Enterprise Password) แยกตามตำแหน่งดังนี้:

| Tier / Role | ชื่อ-ตำแหน่ง | Email (ใช้ล็อกอิน) | Employee ID | Secure Password |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Admin)** | รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์ (คณบดี) | `dean.flas@kps.ku.ac.th` | `EMP-D01` | `Flas#Dean2026!kps` |
| **Tier 1 (Admin)** | ผศ.ดร. อรพินท์ กิจพัฒนา (รองคณบดีฝ่ายวิชาการ) | `vdean.academic@kps.ku.ac.th` | `EMP-VD01` | `Flas#VdeanAcad2026!` |
| **Tier 2 (Dept Head)** | ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ (หัวหน้าภาค CS/IT) | `head.cs@kps.ku.ac.th` | `EMP-HCS01` | `Flas#HeadCS2026!kps` |
| **Tier 3 (Lecturer)** | อ. วรวุฒิ สุวรรณโชติ (อาจารย์ CS) | `worawoot.s@kps.ku.ac.th` | `EMP-LCS01` | `Flas#LcsWora2026!kps` |
| **Tier 4 (Staff)** | คุณ ปรียาภรณ์ สารบรรณดี (เจ้าหน้าที่ธุรการสารบรรณ) | `staff.admin@kps.ku.ac.th` | `EMP-STF01` | `Flas#StaffAdmin2026!` |

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
