# Agent Execution Workflow: Loki Task & Document Management System

This workflow defines the precise execution order and specifications for building the Loki Task & Document Management System.

## Phase Overview

1. **Phase 1: Project Setup & UI Design System**
   - Initialize Vite + React
   - Install `lucide-react`
   - Setup `src/index.css` with sleek dark/light theme, custom CSS variables, cards, modals, tags.

2. **Phase 2: Mock Engine & Storage Architecture**
   - Create `src/services/mockData.js` with initial users (Admin, Department Head, Lecturer, Staff), sample documents, and read logs.
   - Create `src/services/storageService.js` for LocalStorage sync.
   - Create `src/services/authService.js` handling 2FA OTP (2-min expiry timer), random ID/password generation, and password change policies.

3. **Phase 3: Auth & 2FA Components**
   - `LoginPage.jsx`: ID/Password input.
   - `OtpModal.jsx`: 6-digit OTP code, 2-minute countdown timer (120s), Resend OTP button.
   - `FirstTimePasswordModal.jsx`: Mandatory password update on first login.
   - `ForgotPasswordModal.jsx`: Email input -> 2-min OTP -> Password reset.

4. **Phase 4: Admin Portal (User Management)**
   - `UserManagement.jsx`: Visible to Admin role only.
   - Form to add new employee (Name, Email, Role, Department).
   - Auto-generate unique ID & secure Password.
   - Pop-up modal displaying generated credentials with a "Send Information" button (simulating email delivery).

5. **Phase 5: Task Boards & Search Engine**
   - `Dashboard.jsx`: Tab switcher for:
     - Global Board (กระดานงานรวม)
     - Department Board (กระดานงานในฝ่ายตัวเอง)
     - Personal Board (กระดานงานส่วนตัว)
   - Search & Date Range Filter (Text search & Day/Month/Year date filtering).
   - Document Cards: Priority badges (`ปกติ`, `ด่วน`, `ด่วนที่สุด`), **Bold text** for unread, `(แก้ไขแล้ว)` badge for edited items.

6. **Phase 6: Circular Letter Creator & Routing**
   - `CreateDocumentModal.jsx`: Title, rich content, priority selection, file attachments upload.
   - Target recipient routing options:
     - Individual (ส่งรายบุคคล)
     - Department (ส่งตามสายงาน/ฝ่าย)
     - Hierarchical Order (สั่งการตามลำดับขั้น)
     - Faculty-wide (เวียนแจ้งทั้งคณะ)
   - Edit document feature with automatic `(แก้ไขแล้ว)` badge updating.

7. **Phase 7: Document Detail, Replies & Read Tracking**
   - `DocumentDetailModal.jsx`: Full text view, attachment file download.
   - Reply/Comment section: Text reply + File attachment (for leave requests or report attachments).
   - Status Tracking section (Sender/Creator only): List of recipients with exact Date/Time stamps of when each recipient opened and read the document.

8. **Phase 8: Role-Based Access Control (RBAC)**
   - `AuthContext.jsx`: User state management & role switching toolbar for testing all personas (`Admin`, `หัวหน้าสาขา`, `อาจารย์`, `เจ้าหน้าที่`).
   - Dynamic UI rendering according to user role permissions.
