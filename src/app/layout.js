import './globals.css';

export const metadata = {
  title: 'Kasetsart University E-OFFICE + | ระบบจดหมายเวียนอิเล็กทรอนิกส์',
  description: 'ระบบจัดการเอกสาร บันทึกข้อความ และจดหมายเวียน มหาวิทยาลัยเกษตรศาสตร์',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  );
}
