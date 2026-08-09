// d:\HR_project\src\app\api\admin\routes-list\route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const routes = [
    {
      category: 'Authentication API',
      endpoints: [
        { method: 'POST', path: '/api/auth/login', desc: 'ตรวจสอบรหัสผ่าน & สร้าง OTP 6 หลัก' },
        { method: 'POST', path: '/api/auth/otp/verify', desc: 'ยืนยันรหัส 2FA OTP หมดอายุใน 120s' },
        { method: 'POST', path: '/api/auth/password/change', desc: 'บังคับเปลี่ยนรหัสผ่านสำหรับการเข้าใช้งานครั้งแรก' },
        { method: 'POST', path: '/api/auth/password/forgot', desc: 'ส่ง OTP กู้คืนรหัสผ่านผ่าน Email' },
        { method: 'GET', path: '/api/auth/me', desc: 'ดึงข้อมูลพนักงานปัจจุบันผ่าน Session Cookie' },
        { method: 'POST', path: '/api/auth/logout', desc: 'ออกจากระบบและลบ Session Cookie' },
      ],
    },
    {
      category: 'User Management API',
      endpoints: [
        { method: 'GET', path: '/api/users', desc: 'ดึงรายชื่อพนักงานและกรองตามสังกัด/สิทธิ์' },
        { method: 'POST', path: '/api/users', desc: 'เพิ่มพนักงานใหม่ สุ่มรหัสผ่าน & ID อัตโนมัติ' },
        { method: 'DELETE', path: '/api/users?id={id}', desc: 'ลบบัญชีผู้ใช้งานออกจากระบบ PostgreSQL' },
      ],
    },
    {
      category: 'Document Management API',
      endpoints: [
        { method: 'GET', path: '/api/documents', desc: 'ดึงรายการเอกสารเวียน กรองตาม Board / Search / Date' },
        { method: 'POST', path: '/api/documents', desc: 'สร้างเอกสารเวียนใหม่ แนบไฟล์ กำหนดกลุ่มผู้รับ' },
        { method: 'GET', path: '/api/documents/[id]', desc: 'ดึงรายละเอียดเอกสารเวียนฉบับเต็ม' },
        { method: 'PUT', path: '/api/documents/[id]', desc: 'แก้ไขรายละเอียดเอกสาร พร้อมติดป้าย (แก้ไขแล้ว)' },
        { method: 'DELETE', path: '/api/documents/[id]', desc: 'ลบเอกสารเวียนออกจากระบบ' },
      ],
    },
    {
      category: 'Tracking & Reply API',
      endpoints: [
        { method: 'POST', path: '/api/documents/[id]/read', desc: 'ประทับเวลา (Timestamp) การกดเปิดอ่านเอกสาร' },
        { method: 'GET', path: '/api/documents/[id]/replies', desc: 'ดึงประวัติการตอบกลับ / ใบลา / รายงาน' },
        { method: 'POST', path: '/api/documents/[id]/replies', desc: 'ส่งการตอบกลับพร้อมไฟล์แนบรายงาน' },
      ],
    },
    {
      category: 'System & Admin API',
      endpoints: [
        { method: 'GET', path: '/api/admin/stats', desc: 'ดึงสถิติรวมของระบบและ PostgreSQL Database' },
        { method: 'POST', path: '/api/seed', desc: 'จำลองข้อมูลทดสอบ (Seed Data 5-10 Personas)' },
      ],
    },
  ];

  return NextResponse.json({ routes });
}
