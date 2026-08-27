// Central Mock Database for HR & Document Management System
// อ้างอิงโครงสร้างบุคลากรและภาควิชา คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (FLAS KPS KU - https://flas.kps.ku.ac.th/)

export const FLAS_DIVISIONS = [
  "สำนักงานคณบดี",
  "สำนักงานเลขานุการคณะ",
  "ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
  "ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม",
  "ภาควิชาชีววิทยา",
  "ภาควิชาภาษาต่างประเทศ",
  "ภาควิชาภาษาไทย",
  "ภาควิชาสังคมศาสตร์และมนุษยศาสตร์"
];

export const INITIAL_USERS = [
  // 1. คณบดีคณะศิลปศาสตร์และวิทยาศาสตร์ (Executive Dean / ADMIN)
  {
    id: "usr_dean01",
    employeeId: "EMP-D01",
    name: "รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์",
    email: "pasitpukang1234567@gmail.com",
    password: "Flas#Dean2026!kps",
    role: "ADMIN",
    tierLevel: 1,
    positionTitle: "คณบดีคณะศิลปศาสตร์และวิทยาศาสตร์",
    department: "สำนักงานคณบดี",
    division: "สำนักงานคณบดี",
    isFirstLogin: false,
    createdAt: "2026-01-01T08:00:00.000Z"
  },

  // 2. ผู้ดูแลระบบ IT (Admin เพียงเมลเดียว)
  {
    id: "usr_admin_best",
    employeeId: "EMP-D007",
    name: "นายพสิษฐ์ ภูฆัง",
    email: "pasitpukang0@gmail.com",
    password: "Flas#AdminBest2026!",
    role: "ADMIN",
    tierLevel: 1,
    positionTitle: "ผู้ดูแลระบบ IT (Admin)",
    department: "สำนักงานคณบดี (ฝ่าย IT)",
    division: "สำนักงานคณบดี",
    isFirstLogin: false,
    createdAt: "2026-08-25T08:00:00.000Z"
  },

  // 3. หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และ IT (Department Head)
  {
    id: "usr_head_cs",
    employeeId: "EMP-H01",
    name: "ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์",
    email: "bestpasit2547@gmail.com",
    password: "Flas#HeadCS2026!kps",
    role: "DEPT_HEAD",
    tierLevel: 2,
    positionTitle: "หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และ IT",
    department: "ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
    division: "ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
    isFirstLogin: false,
    createdAt: "2026-01-10T08:30:00.000Z"
  },

  // 4. อาจารย์ประจำภาควิชา (Lecturer)
  {
    id: "usr_lec_cs01",
    employeeId: "EMP-L01",
    name: "อ. วรวุฒิ สุวรรณโชติ",
    email: "bgee7242@gmail.com",
    password: "Flas#LcsWora2026!kps",
    role: "LECTURER",
    tierLevel: 3,
    positionTitle: "อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์",
    department: "ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
    division: "ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
    isFirstLogin: false,
    createdAt: "2026-01-15T09:00:00.000Z"
  },

  // 5. บุคลากรสายสนับสนุน (Support Staff)
  {
    id: "usr_stf_admin",
    employeeId: "EMP-S01",
    name: "คุณ ปรียาภรณ์ สารบรรณดี",
    email: "pasit.pu@ku.th",
    password: "Flas#StaffAdmin2026!",
    role: "STAFF",
    tierLevel: 4,
    positionTitle: "เจ้าหน้าที่งานบริหารและธุรการสารบรรณ",
    department: "สำนักงานเลขานุการคณะ",
    division: "สำนักงานเลขานุการคณะ",
    isFirstLogin: false,
    createdAt: "2026-02-05T11:00:00.000Z"
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: "doc_001",
    title: "บันทึกข้อความสั่งการ: กำหนดการประชุมสภาคณะศิลปศาสตร์และวิทยาศาสตร์ ครั้งที่ 1/2569",
    content: "เรียนรองคณบดี หัวหน้าภาควิชา และหัวหน้างานทุกท่าน ขอเชิญเข้าร่วมการประชุมสภาคณะฯ ในวันศุกร์ที่ 30 กรกฎาคม 2569 เวลา 09.30 น. ณ ห้องประชุมคณะ 1 ชั้น 2 อาคารบริหาร คณะศิลปศาสตร์และวิทยาศาสตร์ โดยมีวาระสำคัญเกี่ยวกับการพิจารณาปรับปรุงหลักสูตรและการจัดสรรงบประมาณปี 2570",
    priority: "URGENT",
    boardType: "GLOBAL",
    targetScope: "FACULTY", // เวียนแจ้งทั้งคณะ
    targetIds: [],
    authorId: "usr_dean01",
    authorName: "รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์ (คณบดี)",
    authorRole: "ADMIN",
    isEdited: false,
    fileName: "Agenda_FLAS_KPS_1_2569.pdf",
    fileUrl: "#",
    fileSize: "2.4 MB",
    createdAt: "2026-07-20T08:30:00.000Z",
    updatedAt: "2026-07-20T08:30:00.000Z"
  },
  {
    id: "doc_002",
    title: "บันทึกข้อความด่วนที่สุด (Tier 2 Command): คำสั่งจัดทำรายงานประเมินตนเองประกันคุณภาพการศึกษา (AUN-QA)",
    content: "ตามที่คณะศิลปศาสตร์และวิทยาศาสตร์ ได้กำหนดตรวจประเมินคุณภาพการศึกษาประจำปี ขอให้คณาจารย์ในสังกัดภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ดำเนินการรวบรวมข้อมูล มคอ.7 และเอกสารหลักฐานอ้างอิงให้แล้วเสร็จภายในวันจันทร์นี้",
    priority: "VERY_URGENT",
    boardType: "DEPARTMENT",
    targetScope: "DEPARTMENT", // สั่งการภายในภาควิชา
    targetIds: ["ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ"],
    authorId: "usr_head_cs",
    authorName: "ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ (หัวหน้าภาควิชา CS)",
    authorRole: "DEPT_HEAD",
    isEdited: true,
    fileName: "AUNQA_Report_Template_FLAS_2026.docx",
    fileUrl: "#",
    fileSize: "1.8 MB",
    createdAt: "2026-07-21T09:15:00.000Z",
    updatedAt: "2026-07-22T10:00:00.000Z"
  },
  {
    id: "doc_003",
    title: "เสนอบันทึกข้อความตามลำดับชั้น: คำร้องขออนุมัติเดินทางไปเสนอผลงานวิจัยระดับชาติ NCIT 2026",
    content: "ข้าพเจ้า อ. วรวุฒิ สุวรรณโชติ มีความประสงค์ขออนุมัติเดินทางไปเสนอผลงานวิจัยเรื่อง 'AI Task Optimization in Higher Education System' ณ มหาวิทยาลัยเชียงใหม่ ระหว่างวันที่ 5-7 สิงหาคม 2569 และขออนุมัติเบิกจ่ายค่าลงทะเบียนและค่าเดินทางตามระเบียบ",
    priority: "NORMAL",
    boardType: "PERSONAL",
    targetScope: "UPWARD", // เสนอขึ้นตามลำดับชั้น
    targetIds: ["usr_head_cs", "usr_dean01"],
    authorId: "usr_lec_cs01",
    authorName: "อ. วรวุฒิ สุวรรณโชติ (อาจารย์)",
    authorRole: "LECTURER",
    isEdited: false,
    fileName: "NCIT2026_Acceptance_Letter.pdf",
    fileUrl: "#",
    fileSize: "850 KB",
    createdAt: "2026-07-22T14:00:00.000Z",
    updatedAt: "2026-07-22T14:00:00.000Z"
  }
];

export const INITIAL_READ_LOGS = [
  {
    id: "rl_001",
    documentId: "doc_001",
    userId: "usr_head_cs",
    userName: "ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ (หัวหน้าภาควิชา CS)",
    userRole: "DEPT_HEAD",
    readAt: "2026-07-20T09:00:00.000Z"
  },
  {
    id: "rl_002",
    documentId: "doc_001",
    userId: "usr_lec_cs01",
    userName: "อ. วรวุฒิ สุวรรณโชติ (อาจารย์)",
    userRole: "LECTURER",
    readAt: "2026-07-20T10:15:00.000Z"
  },
  {
    id: "rl_003",
    documentId: "doc_002",
    userId: "usr_lec_cs01",
    userName: "อ. วรวุฒิ สุวรรณโชติ (อาจารย์)",
    userRole: "LECTURER",
    readAt: "2026-07-21T11:30:00.000Z"
  }
];

export const INITIAL_REPLIES = [
  {
    id: "rep_001",
    documentId: "doc_002",
    userId: "usr_lec_cs01",
    userName: "อ. วรวุฒิ สุวรรณโชติ (อาจารย์)",
    userRole: "LECTURER",
    message: "รับทราบคำสั่งครับ กำลังเร่งรวบรวมเล่ม มคอ.7 ของหลักสูตรวิทยาการคอมพิวเตอร์ จะจัดส่งให้หัวหน้าภาควิชาภายในวันศุกร์นี้ครับ",
    fileName: "Draft_TQF7_CS_KPS.pdf",
    fileUrl: "#",
    fileSize: "4.1 MB",
    isLeaveRequest: false,
    createdAt: "2026-07-21T11:35:00.000Z"
  },
  {
    id: "rep_002",
    documentId: "doc_003",
    userId: "usr_head_cs",
    userName: "ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์ (หัวหน้าภาควิชา CS)",
    userRole: "DEPT_HEAD",
    message: "อนุมัติในหลักการระดับภาควิชา และเห็นควรเสนอท่านคณบดี คณะศิลปศาสตร์และวิทยาศาสตร์ เพื่อพิจารณาอนุมัติงบประมาณเดินทางต่อไป",
    fileName: null,
    fileUrl: null,
    fileSize: null,
    isLeaveRequest: false,
    createdAt: "2026-07-22T15:20:00.000Z"
  }
];
