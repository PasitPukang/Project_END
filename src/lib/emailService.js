import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer Transporter based on .env SMTP settings
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || user.includes('your-email')) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

// 🌐 ปลดล็อคระบบส่งอีเมล: ส่งตรงถึงผู้รับตามอีเมลจริงที่ระบุทุกประการ (Live Delivery Unlocked)
export function getSafeRecipient(email) {
  if (email && typeof email === 'string' && email.trim()) {
    return email.trim().toLowerCase();
  }
  return 'pasitpukang0@gmail.com';
}

/**
 * Send OTP Code via Real Email with Full User Details (Name, Role, Position, ID)
 */
export async function sendOtpEmail(targetEmail, otpCode, type = 'LOGIN_2FA', user = null) {
  const destination = getSafeRecipient(targetEmail || user?.email);
  const userName = user?.name || 'บุคลากรคณะศิลปศาสตร์และวิทยาศาสตร์';
  const userRole = user?.role || 'STAFF';
  const userPosition = user?.positionTitle || 'บุคลากร';
  const employeeId = user?.employeeId || '-';
  const userDepartment = user?.department || user?.division || 'คณะศิลปศาสตร์และวิทยาศาสตร์';

  const typeTitle = type === 'LOGIN_2FA' ? 'เข้าสู่ระบบ (2FA)' : 'ตั้งรหัสผ่านใหม่ (Reset Password)';

  // หัวข้ออีเมลระบุชื่อ, ตำแหน่ง, รหัสพนักงาน และ OTP ชัดเจนใน Inbox
  const subject = `[FLAS E-Office OTP: ${otpCode}] สำหรับคุณ ${userName} (${userPosition} • ${employeeId})`;

  const htmlContent = `
    <div style="font-family: Arial, 'Sarabun', sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #006653; border-radius: 16px; background-color: #ffffff;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="color: #006653; margin: 0; font-size: 20px;">🏛️ คณะศิลปศาสตร์และวิทยาศาสตร์</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU)</p>
      </div>

      <!-- Identity Card (ระบุชื่อ บทบาท ตำแหน่ง สังกัด รหัสพนักงาน ชัดเจน) -->
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 5px solid #006653; padding: 14px 16px; border-radius: 10px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #006653; text-transform: uppercase;">
          👤 ข้อมูลผู้ขอรับรหัส OTP (${typeTitle})
        </p>
        <table style="width: 100%; font-size: 13px; color: #1e293b; border-collapse: collapse;">
          <tr>
            <td style="padding: 3px 0; width: 130px; color: #64748b;"><strong>ชื่อ-นามสกุล:</strong></td>
            <td style="padding: 3px 0; font-weight: bold; color: #0f172a;">${userName}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>รหัสพนักงาน:</strong></td>
            <td style="padding: 3px 0;"><span style="font-family: monospace; font-weight: bold; color: #006653; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">${employeeId}</span></td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>ตำแหน่ง (Position):</strong></td>
            <td style="padding: 3px 0;">${userPosition}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>บทบาทสิทธิ์ (Role):</strong></td>
            <td style="padding: 3px 0;"><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${userRole}</span></td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>สังกัด / ฝ่าย:</strong></td>
            <td style="padding: 3px 0;">${userDepartment}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>อีเมลผู้รับ:</strong></td>
            <td style="padding: 3px 0; color: #0369a1; font-weight: bold;">${destination}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #334155; margin: 10px 0;">รหัสยืนยัน OTP สำหรับเข้าใช้งานระบบของท่านคือ:</p>
      
      <!-- OTP Big Code Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #006653; text-align: center; padding: 18px; border-radius: 12px; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #006653; margin: 16px 0;">
        ${otpCode}
      </div>

      <p style="font-size: 12px; color: #dc2626; text-align: center; font-weight: bold; margin: 8px 0;">
        ⏱️ รหัสนี้มีอายุการใช้งาน 2 นาที (120 วินาที)
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        ระบบจดหมายเวียนอิเล็กทรอนิกส์ FLAS KPS KU • คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์
      </p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - OTP] To: ${destination} | User: ${userName} (${employeeId}) | Code: ${otpCode}\n`);
      return { success: true, simulated: true, code: otpCode };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"FLAS E-Office" <${process.env.SMTP_USER}>`,
      to: destination,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [REAL EMAIL SENT] OTP for ${userName} (${employeeId}) sent to: ${destination} | MessageId: ${info.messageId}\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [REAL EMAIL FAILED]:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Employee Credentials via Real Email with Full User Details
 */
export async function sendEmployeeCredentialsEmail(targetEmail, employeeName, employeeId, tempPassword, extraDetails = {}) {
  const destination = getSafeRecipient(targetEmail);
  const position = extraDetails.positionTitle || extraDetails.role || 'บุคลากรใหม่';
  const role = extraDetails.role || 'STAFF';
  const department = extraDetails.department || extraDetails.division || 'คณะศิลปศาสตร์และวิทยาศาสตร์';

  const subject = `[FLAS E-Office] 🎉 บัญชีผู้ใช้งานใหม่: คุณ ${employeeName} (${position} • ID: ${employeeId})`;

  const htmlContent = `
    <div style="font-family: Arial, 'Sarabun', sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #006653; border-radius: 16px; background-color: #ffffff;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="color: #006653; margin: 0; font-size: 20px;">🏛️ คณะศิลปศาสตร์และวิทยาศาสตร์</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU)</p>
      </div>

      <!-- Identity Card -->
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 5px solid #006653; padding: 14px 16px; border-radius: 10px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #006653; text-transform: uppercase;">
          🎉 ยินดีต้อนรับบุคลากรใหม่
        </p>
        <table style="width: 100%; font-size: 13px; color: #1e293b; border-collapse: collapse;">
          <tr>
            <td style="padding: 3px 0; width: 130px; color: #64748b;"><strong>ชื่อ-นามสกุล:</strong></td>
            <td style="padding: 3px 0; font-weight: bold; color: #0f172a;">${employeeName}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>ตำแหน่ง (Position):</strong></td>
            <td style="padding: 3px 0;">${position}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>ระดับสิทธิ์ (Role):</strong></td>
            <td style="padding: 3px 0;"><span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${role}</span></td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>หน่วยงาน / สังกัด:</strong></td>
            <td style="padding: 3px 0;">${department}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;"><strong>อีเมลผู้รับ:</strong></td>
            <td style="padding: 3px 0; color: #0369a1; font-weight: bold;">${destination}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #334155;">ผู้ดูแลระบบ (Admin) ได้สร้างบัญชีผู้ใช้งานระบบจดหมายเวียนสำหรับท่านเรียบร้อยแล้ว รายละเอียดการเข้าใช้งานมีดังนี้:</p>
      
      <!-- Credentials Card -->
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 18px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">
          🆔 <strong>รหัสประจำตัวพนักงาน (ID):</strong> 
          <span style="font-family: monospace; font-size: 16px; color: #006653; font-weight: bold; background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid #bbf7d0;">${employeeId}</span>
        </p>
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">
          📧 <strong>อีเมลเข้าสู่ระบบ:</strong> <code>${destination}</code>
        </p>
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">
          🔑 <strong>รหัสผ่านชั่วคราว:</strong> 
          <span style="font-family: monospace; font-size: 16px; color: #059669; font-weight: bold; background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid #bbf7d0;">${tempPassword}</span>
        </p>
      </div>

      <p style="font-size: 13px; color: #b45309; background-color: #fef3c7; padding: 10px 14px; border-radius: 8px; margin: 14px 0;">
        ⚠️ <strong>หมายเหตุ:</strong> ในการเข้าใช้งานครั้งแรก ระบบจะบังคับให้ท่านเปลี่ยนรหัสผ่านใหม่ทันทีเพื่อความปลอดภัย
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        ระบบจดหมายเวียนอิเล็กทรอนิกส์ FLAS KPS KU • คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์
      </p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - CREDS] To: ${destination} | Employee: ${employeeName} (${employeeId}) | Pass: ${tempPassword}\n`);
      return { success: true, simulated: true, employeeId, tempPassword };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"FLAS E-Office" <${process.env.SMTP_USER}>`,
      to: destination,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [REAL CREDENTIALS EMAIL SENT] For ${employeeName} (${employeeId}) to: ${destination} | MessageId: ${info.messageId}\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [REAL CREDENTIALS EMAIL FAILED]:', error.message);
    return { success: false, error: error.message };
  }
}
