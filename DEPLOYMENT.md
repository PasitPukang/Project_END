# 🚀 คู่มือการติดตั้งและ Deploy ระบบ FLAS KPS KU E-Office (Production Runbook)

ระบบจดหมายเวียนและบันทึกข้อความ คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน

---

## 🏗️ 1. สถาปัตยกรรมระบบ (Architecture Overview)

```
                       ┌────────────────────────────────────────┐
                       │     Client Browser (Mobile/Desktop)    │
                       └───────────────────┬────────────────────┘
                                           │ HTTPS (Port 443/3000)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │   Next.js 14 Web App (Port 3000)       │
                       │   - App Router Server Components       │
                       │   - Real-time 2FA OTP Service          │
                       │   - Google Calendar (.ics) Generator   │
                       └──────┬──────────────────────────┬──────┘
                              │                          │
           Database Query (Prisma)               SMTP Auth (Port 587)
                              ▼                          ▼
               ┌────────────────────────┐     ┌───────────────────────┐
               │ PostgreSQL 16 (E-office│     │ Gmail SMTP Server     │
               │ Local / On-Premise DB  │     │ Real Email OTP & Creds│
               └────────────────────────┘     └───────────────────────┘
```

---

## 🐳 2. วิธีการ Deploy ผ่าน Docker Compose (แนะนำสำหรับ On-Premise Server)

### ข้อกำหนดก่อนติดตั้ง:
* Docker Engine 24.0+ และ Docker Compose v2.20+
* พอร์ต `3000` (Web) และ `5432` (PostgreSQL) ว่าง

### ขั้นตอนที่ 1: เตรียม Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env` และกรอกข้อมูลจริง:
```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_db_password
POSTGRES_DB=E-office

JWT_SECRET=your_super_secret_jwt_key_2026

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pasitpukang0@gmail.com
SMTP_PASS=zoer svml mxwg jkti
SMTP_FROM=FLAS E-Office <pasitpukang0@gmail.com>
```

### ขั้นตอนที่ 2: สั่ง Build และรันทั้งระบบด้วยคำสั่งเดียว
```bash
# รัน Containers ในโหมด Background
docker compose up -d --build
```

### ขั้นตอนที่ 3: ตรวจสอบสถานะการทำงาน
```bash
# ตรวจสอบว่า Containers ทำงานสมบูรณ์
docker compose ps

# ดู Log การทำงานแบบ Real-time
docker compose logs -f app
```

---

## ⚙️ 3. วิธีการ Deploy ด้วย PM2 (Node.js Process Manager)

สำหรับติดตั้งบน Linux Server (Ubuntu/Debian) หรือ Windows Server:

```bash
# 1. ติดตั้ง Dependencies และ Generate Prisma Client
npm ci
npx prisma generate

# 2. ทำการ Migrate ฐานข้อมูล PostgreSQL
npx prisma db push
node prisma/seed.js

# 3. Build Production Bundle
npm run build

# 4. ติดตั้ง PM2 และเริ่มการทำงาน
npm install -g pm2
pm2 start npm --name "flas-eoffice" -- start -- -p 3000

# 5. บันทึก Process ให้ Auto-start เมื่อรีบูตเครื่อง
pm2 save
pm2 startup
```

---

## 💾 4. การสำรองข้อมูลและกู้คืน (Backup & Disaster Recovery)

### การ Backup ฐานข้อมูล PostgreSQL:
```bash
# Backup ฐานข้อมูล E-office ออกมาเป็นไฟล์ .sql
docker exec -t eoffice_postgres pg_dump -U postgres -d E-office > backup_$(date +%Y%m%d_%H%M%S).sql
```

### การ Restore ฐานข้อมูล:
```bash
# นำเข้าข้อมูลจากไฟล์สำรอง
cat backup_file.sql | docker exec -i eoffice_postgres psql -U postgres -d E-office
```

---

## 🔍 5. การตรวจสอบความสมบูรณ์และ Health Check

| Endpoint / Command | วัตถุประสงค์ | ผลลัพธ์ที่คาดหวัง |
| :--- | :--- | :--- |
| `GET http://localhost:3000/` | ตรวจสอบหน้า Web Portal | `HTTP 200 OK` |
| `POST http://localhost:3000/api/auth/login` | ตรวจสอบระบบยืนยันตัวตน | `HTTP 200` + User Payload |
| `docker inspect --format='{{json .State.Health}}' eoffice_postgres` | เช็คความสมบูรณ์ของ PostgreSQL | `"Status": "healthy"` |

---

## 🛡️ 6. มาตรการความปลอดภัยในการใช้งานจริง (Security Hardening)
1. **Non-Root Execution:** Container รันภายใต้ User `nextjs` (UID: 1001) ป้องกัน Privilege Escalation
2. **On-Premise PII Protection:** เอกสารลับ รายชื่อ และประวัติการอ่าน ถูกจัดเก็บเฉพาะใน Local Database เท่านั้น
3. **Strict 2FA OTP:** รหัสผ่านแบบใช้ครั้งเดียวหมดอายุใน 2 นาที และถูกใช้งานได้เพียงครั้งเดียว (Anti-Replay Attack)
