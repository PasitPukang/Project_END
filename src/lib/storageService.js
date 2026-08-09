import { INITIAL_USERS, INITIAL_DOCUMENTS, INITIAL_READ_LOGS, INITIAL_REPLIES } from './mockDatabase';

const KEYS = {
  USERS: 'loki_hr_users',
  DOCUMENTS: 'loki_hr_documents',
  READ_LOGS: 'loki_hr_read_logs',
  REPLIES: 'loki_hr_replies',
  OTPS: 'loki_hr_otps',
  CURRENT_USER: 'loki_hr_current_user',
};

// Initialize LocalStorage if empty
export const initStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.DOCUMENTS)) {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(KEYS.READ_LOGS)) {
    localStorage.setItem(KEYS.READ_LOGS, JSON.stringify(INITIAL_READ_LOGS));
  }
  if (!localStorage.getItem(KEYS.REPLIES)) {
    localStorage.setItem(KEYS.REPLIES, JSON.stringify(INITIAL_REPLIES));
  }
  if (!localStorage.getItem(KEYS.OTPS)) {
    localStorage.setItem(KEYS.OTPS, JSON.stringify([]));
  }
};

// Helper getters
export const getUsers = () => {
  initStorage();
  if (typeof window === 'undefined') return INITIAL_USERS;
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};

export const getDocuments = () => {
  initStorage();
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  return JSON.parse(localStorage.getItem(KEYS.DOCUMENTS) || '[]');
};

export const getReadLogs = (docId) => {
  initStorage();
  if (typeof window === 'undefined') return INITIAL_READ_LOGS;
  const logs = JSON.parse(localStorage.getItem(KEYS.READ_LOGS) || '[]');
  return docId ? logs.filter(l => l.documentId === docId) : logs;
};

export const getReplies = (docId) => {
  initStorage();
  if (typeof window === 'undefined') return INITIAL_REPLIES;
  const replies = JSON.parse(localStorage.getItem(KEYS.REPLIES) || '[]');
  return docId ? replies.filter(r => r.documentId === docId) : replies;
};

// Auth and User Operations
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const generateRandomCredentials = () => {
  const users = getUsers();
  let employeeId;
  let isDuplicate = true;

  while (isDuplicate) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    employeeId = `EMP-${randomNum}`;
    isDuplicate = users.some(u => u.employeeId === employeeId);
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return { employeeId, password };
};

export const createNewUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: `usr_${Date.now()}`,
    ...userData,
    isFirstLogin: true, // Force password change on first login
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUserPassword = (userId, newPassword) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].password = newPassword;
    users[index].isFirstLogin = false;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    
    const current = getCurrentUser();
    if (current && current.id === userId) {
      setCurrentUser(users[index]);
    }
    return users[index];
  }
  return null;
};

// 2FA OTP Engine (2 Minute Expiration)
export const generateOtp = (userId, type = 'LOGIN_2FA') => {
  const otps = JSON.parse(localStorage.getItem(KEYS.OTPS) || '[]');
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 1000).toISOString(); // 2 minutes (120s)

  const newOtp = {
    id: `otp_${Date.now()}`,
    userId,
    code,
    type,
    expiresAt,
    isUsed: false,
    createdAt: now.toISOString()
  };

  otps.push(newOtp);
  localStorage.setItem(KEYS.OTPS, JSON.stringify(otps));
  return newOtp;
};

export const verifyOtp = (userId, code, type = 'LOGIN_2FA') => {
  const otps = JSON.parse(localStorage.getItem(KEYS.OTPS) || '[]');
  const now = new Date();

  const otpIndex = otps.findIndex(o => 
    o.userId === userId && 
    o.type === type && 
    !o.isUsed && 
    new Date(o.expiresAt) > now
  );

  if (otpIndex !== -1) {
    // For ease of testing, accept code matching OR master demo code "123456"
    if (otps[otpIndex].code === code || code === "123456") {
      otps[otpIndex].isUsed = true;
      localStorage.setItem(KEYS.OTPS, JSON.stringify(otps));
      return { success: true };
    }
  }

  // Master code bypass check for demo/test mode
  if (code === "123456") {
    return { success: true };
  }

  return { success: false, error: 'รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว (กรุณาขอรหัสใหม่)' };
};

// Document operations
export const createDocument = (docData, author) => {
  const docs = getDocuments();
  const newDoc = {
    id: `doc_${Date.now()}`,
    ...docData,
    authorId: author.id,
    authorName: author.name,
    authorRole: author.role,
    isEdited: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  docs.unshift(newDoc);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  return newDoc;
};

export const updateDocument = (docId, updateData) => {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === docId);
  if (index !== -1) {
    docs[index] = {
      ...docs[index],
      ...updateData,
      isEdited: true, // Tag with (แก้ไขแล้ว)
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
    return docs[index];
  }
  return null;
};

// Read Log Tracker
export const markDocumentAsRead = (docId, user) => {
  if (!user || !docId) return;
  const logs = JSON.parse(localStorage.getItem(KEYS.READ_LOGS) || '[]');
  const exists = logs.some(l => l.documentId === docId && l.userId === user.id);

  if (!exists) {
    const newLog = {
      id: `rl_${Date.now()}`,
      documentId: docId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      readAt: new Date().toISOString()
    };
    logs.push(newLog);
    localStorage.setItem(KEYS.READ_LOGS, JSON.stringify(logs));
  }
};

// Replies & Comments
export const addReply = (replyData, user) => {
  const replies = JSON.parse(localStorage.getItem(KEYS.REPLIES) || '[]');
  const newReply = {
    id: `rep_${Date.now()}`,
    ...replyData,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    createdAt: new Date().toISOString()
  };
  replies.push(newReply);
  localStorage.setItem(KEYS.REPLIES, JSON.stringify(replies));
  return newReply;
};
