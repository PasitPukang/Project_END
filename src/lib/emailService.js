import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer Transporter based on .env SMTP settings
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || user.includes('your-email')) {
    return null; // Return null if SMTP credentials are placeholders
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
}

/**
 * Send OTP Code via Real Email
 */
export async function sendOtpEmail(targetEmail, otpCode, type = 'LOGIN_2FA') {
  const subjectMap = {
    LOGIN_2FA: '🔑 รหัส OTP สำหรับยืนยันตัวตนเข้าสู่ระบบ Loki HR',
    FORGOT_PASSWORD: '🔐 รหัส OTP สำหรับตั้งรหัสผ่านใหม่ Loki HR'
  };

  const subject = subjectMap[type] || '🔑 รหัส OTP ยืนยันตัวตน Loki HR';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2563eb; margin: 0;">🏢 Loki Task & HR System</h2>
        <p style="color: #64748b; font-size: 14px;">ระบบจัดการบันทึกข้อความและภาระงานองค์กร</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
      <p style="font-size: 16px; color: #1e293b;">สวัสดีครับ/ค่ะ,</p>
      <p style="font-size: 14px; color: #334155;">รหัสยืนยัน OTP สำหรับ <strong>${type === 'LOGIN_2FA' ? 'เข้าสู่ระบบ (2FA)' : 'ตั้งรหัสผ่านใหม่'}</strong> คือ:</p>
      
      <div style="background-color: #f1f5f9; text-align: center; padding: 15px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0f172a; margin: 20px 0;">
        ${otpCode}
      </div>

      <p style="font-size: 13px; color: #dc2626; text-align: center;">⏱️ รหัสนี้มีอายุการใช้งาน 2 นาที (120 วินาที) โปรดอย่าเปิดเผยรหัสนี้แก่ผู้อื่น</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">ข้อความนี้เป็นระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - OTP] To: ${targetEmail} | Code: ${otpCode} (Configure SMTP in .env for real inbox delivery)\n`);
      return { success: true, simulated: true, code: otpCode };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Loki HR System" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [REAL EMAIL SENT] OTP to ${targetEmail} | MessageId: ${info.messageId}\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [REAL EMAIL FAILED]:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Employee Credentials (Employee ID & Temp Password) via Real Email
 */
export async function sendEmployeeCredentialsEmail(targetEmail, employeeName, employeeId, tempPassword) {
  const subject = `🎉 ต้อนรับสู่องค์กร - ข้อมูลบัญชีผู้ใช้ของคุณ (ID: ${employeeId})`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; borderRadius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2563eb; margin: 0;">🏢 Loki Task & HR System</h2>
        <p style="color: #64748b; font-size: 14px;">ระบบจัดการบันทึกข้อความและภาระงานองค์กร</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
      
      <p style="font-size: 16px; color: #1e293b;">เรียน คุณ <strong>${employeeName}</strong>,</p>
      <p style="font-size: 14px; color: #334155;">ผู้ดูแลระบบ (Admin) ได้สร้างบัญชีผู้ใช้งานสำหรับคุณในระบบเรียบร้อยแล้ว ด้านล่างนี้คือข้อมูลสำหรับการเข้าใช้งาน:</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 18px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 6px 0; font-size: 15px; color: #0f172a;">🆔 <strong>รหัสประจำตัวพนักงาน (Employee ID):</strong> <span style="font-family: monospace; font-size: 18px; color: #2563eb; font-weight: bold;">${employeeId}</span></p>
        <p style="margin: 6px 0; font-size: 15px; color: #0f172a;">📧 <strong>อีเมล (Email):</strong> ${targetEmail}</p>
        <p style="margin: 6px 0; font-size: 15px; color: #0f172a;">🔑 <strong>รหัสผ่านชั่วคราว (Temporary Password):</strong> <span style="font-family: monospace; font-size: 16px; color: #059669; font-weight: bold;">${tempPassword}</span></p>
      </div>

      <p style="font-size: 13px; color: #475569;">⚠️ <strong>หมายเหตุ:</strong> ในการเข้าใช้งานครั้งแรก ระบบจะบังคับให้ท่านเปลี่ยนรหัสผ่านใหม่เพื่อความปลอดภัย</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">ข้อความนี้เป็นระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - CREDS] To: ${targetEmail} | EmployeeID: ${employeeId} | Pass: ${tempPassword}\n`);
      return { success: true, simulated: true, employeeId, tempPassword };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Loki HR System" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [REAL CREDENTIALS EMAIL SENT] Employee ${employeeId} to ${targetEmail} | MessageId: ${info.messageId}\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [REAL CREDENTIALS EMAIL FAILED]:', error.message);
    return { success: false, error: error.message };
  }
}
