// ===== FRONTEND: API Client =====
// ไฟล์นี้ใช้ใน Client Components เพื่อเรียก Next.js API Routes
// แทนที่ storageService.js ที่ใช้ LocalStorage โดยตรง

const BASE = '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ส่ง cookie ไปด้วยทุก request
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

// ========================
// AUTH
// ========================

/** Login ด้วย email/employeeId + password */
export async function login(userId, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { userId, password },
  });
}

/** Logout */
export async function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

/** ดึง current user จาก session */
export async function getMe() {
  return request('/api/auth/me');
}

// ========================
// OTP
// ========================

/** ขอรับ OTP (LOGIN_2FA หรือ FORGOT_PASSWORD) */
export async function sendOtp(userId = null, type = 'LOGIN_2FA') {
  return request('/api/auth/otp/send', {
    method: 'POST',
    body: { userId, type },
  });
}

/** ยืนยัน OTP */
export async function verifyOtp(userId = null, code, type = 'LOGIN_2FA') {
  return request('/api/auth/otp/verify', {
    method: 'POST',
    body: { userId, code, type },
  });
}

// ========================
// PASSWORD
// ========================

/** เปลี่ยน password (first login) */
export async function changePassword(newPassword) {
  return request('/api/auth/password/change', {
    method: 'POST',
    body: { newPassword },
  });
}

/** ขอ reset password (forgot) → step 1: ส่ง OTP ไป email */
export async function forgotPasswordRequest(email) {
  return request('/api/auth/password/forgot', {
    method: 'POST',
    body: { email },
  });
}

/** reset password จริง → step 3 */
export async function resetPassword(userId, newPassword) {
  return request('/api/auth/password/reset', {
    method: 'POST',
    body: { userId, newPassword },
  });
}

// ========================
// USERS (Admin)
// ========================

/** ดึง users ทั้งหมด */
export async function getUsers() {
  const data = await request('/api/users');
  return data.users;
}

/** สร้าง user ใหม่ */
export async function createUser(userData) {
  return request('/api/users', {
    method: 'POST',
    body: userData,
  });
}

// ========================
// DOCUMENTS
// ========================

/** ดึง documents ที่ user มีสิทธิ์ดู */
export async function getDocuments() {
  const data = await request('/api/documents');
  return data.documents;
}

/** สร้าง document ใหม่ */
export async function createDocument(docData) {
  const data = await request('/api/documents', {
    method: 'POST',
    body: docData,
  });
  return data.document;
}

/** ดูเอกสาร + บันทึก read log */
export async function getDocument(id) {
  const data = await request(`/api/documents/${id}`);
  return data.document;
}

/** แก้ไขเอกสาร */
export async function updateDocument(id, updateData) {
  const data = await request(`/api/documents/${id}`, {
    method: 'PUT',
    body: updateData,
  });
  return data.document;
}

/** ลบเอกสาร */
export async function deleteDocument(id) {
  return request(`/api/documents/${id}`, { method: 'DELETE' });
}

// ========================
// REPLIES
// ========================

/** ดึง replies ของเอกสาร */
export async function getReplies(documentId) {
  const data = await request(`/api/documents/${documentId}/replies`);
  return data.replies;
}

/** เพิ่ม reply */
export async function addReply(documentId, replyData) {
  const data = await request(`/api/documents/${documentId}/replies`, {
    method: 'POST',
    body: replyData,
  });
  return data.reply;
}
