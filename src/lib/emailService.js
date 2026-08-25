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

/**
 * Send OTP Code via Real Email
 */
export async function sendOtpEmail(targetEmail, otpCode, type = 'LOGIN_2FA') {
  const subjectMap = {
    LOGIN_2FA: '🔑 รหัส OTP สำหรับยืนยันตัวตนเข้าสู่ระบบ FLAS E-Office',
    FORGOT_PASSWORD: '🔐 รหัส OTP สำหรับตั้งรหัสผ่านใหม่ FLAS E-Office',
  };

  const subject = subjectMap[type] || '🔑 รหัส OTP ยืนยันตัวตน FLAS E-Office';

  const htmlContent = `
    <div style="font-family: Arial, 'Sarabun', sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #006653; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #006653; margin: 0; font-size: 20px;">🏛️ คณะศิลปศาสตร์และวิทยาศาสตร์</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU)</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
      <p style="font-size: 15px; color: #1e293b;">สวัสดีครับ/ค่ะ,</p>
      <p style="font-size: 14px; color: #334155;">รหัสยืนยัน OTP สำหรับ <strong>${type === 'LOGIN_2FA' ? 'เข้าสู่ระบบ (2-Factor Authentication)' : 'ตั้งรหัสผ่านใหม่'}</strong> คือ:</p>
      
      <div style="background-color: #f0fdf4; border: 2px dashed #006653; text-align: center; padding: 18px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #006653; margin: 20px 0;">
        ${otpCode}
      </div>

      <p style="font-size: 13px; color: #dc2626; text-align: center; font-weight: bold;">⏱️ รหัสนี้มีอายุการใช้งาน 2 นาที (120 วินาที) โปรดอย่าเปิดเผยรหัสนี้แก่ผู้อื่น</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">อีเมลนี้ถูกส่งอัตโนมัติจากระบบ FLAS E-Office กรุณาอย่าตอบกลับอีเมลนี้</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - OTP] To: ${targetEmail} | Code: ${otpCode}\n`);
      return { success: true, simulated: true, code: otpCode };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"FLAS E-Office" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject,
      html: htmlContent,
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
  const subject = `🎉 บัญชีผู้ใช้งานระบบ FLAS E-Office (รหัสพนักงาน: ${employeeId})`;

  const htmlContent = `
    <div style="font-family: Arial, 'Sarabun', sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #006653; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #006653; margin: 0; font-size: 20px;">🏛️ คณะศิลปศาสตร์และวิทยาศาสตร์</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU)</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
      
      <p style="font-size: 15px; color: #1e293b;">เรียน คุณ <strong>${employeeName}</strong>,</p>
      <p style="font-size: 14px; color: #334155;">ผู้ดูแลระบบ (Admin) ได้สร้างบัญชีผู้ใช้งานระบบจดหมายเวียนสำหรับท่านเรียบร้อยแล้ว ด้านล่างนี้คือข้อมูลสำหรับการเข้าใช้งาน:</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 18px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">🆔 <strong>รหัสประจำตัวพนักงาน (ID):</strong> <span style="font-family: monospace; font-size: 16px; color: #006653; font-weight: bold;">${employeeId}</span></p>
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">📧 <strong>อีเมล (Email):</strong> ${targetEmail}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #0f172a;">🔑 <strong>รหัสผ่านชั่วคราว:</strong> <span style="font-family: monospace; font-size: 16px; color: #059669; font-weight: bold;">${tempPassword}</span></p>
      </div>

      <p style="font-size: 13px; color: #b45309; background-color: #fef3c7; padding: 10px; border-radius: 8px;">⚠️ <strong>หมายเหตุ:</strong> ในการเข้าใช้งานครั้งแรก ระบบจะบังคับให้ท่านเปลี่ยนรหัสผ่านใหม่เพื่อความปลอดภัย</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">อีเมลนี้ถูกส่งอัตโนมัติจากระบบ FLAS E-Office กรุณาอย่าตอบกลับอีเมลนี้</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION - CREDS] To: ${targetEmail} | EmployeeID: ${employeeId} | Pass: ${tempPassword}\n`);
      return { success: true, simulated: true, employeeId, tempPassword };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"FLAS E-Office" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [REAL CREDENTIALS EMAIL SENT] Employee ${employeeId} to ${targetEmail} | MessageId: ${info.messageId}\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [REAL CREDENTIALS EMAIL FAILED]:', error.message);
    return { success: false, error: error.message };
  }
}
