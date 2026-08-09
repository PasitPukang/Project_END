import './globals.css';

export const metadata = {
  title: 'FLAS KPS E-OFFICE + | มหาวิทยาลัยเกษตรศาสตร์',
  description: 'ระบบจดหมายเวียน และจัดการเอกสารอิเล็กทรอนิกส์ คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased text-slate-800 bg-[#f4f6f8] selection:bg-[#00b074] selection:text-white">
        {children}
      </body>
    </html>
  );
}
