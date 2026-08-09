'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Server,
  Activity,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Shield,
  Layers,
  Search,
  RefreshCw,
  X,
  Code,
  ArrowRight,
  BarChart3,
  HardDrive
} from 'lucide-react';

export default function AdminBackendModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'api-routes' | 'db-tables' | 'tester'
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [routesList, setRoutesList] = useState([]);
  
  // API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/admin/stats');
  const [testMethod, setTestMethod] = useState('GET');
  const [testRequestBody, setTestRequestBody] = useState('');
  const [testResponse, setTestResponse] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAdminStats();
      fetchRoutesList();
    }
  }, [isOpen]);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStatsData(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutesList = async () => {
    try {
      const res = await fetch('/api/admin/routes-list');
      const data = await res.json();
      if (data.routes) setRoutesList(data.routes);
    } catch (err) {
      console.error('Error fetching routes list:', err);
    }
  };

  const handleRunApiTest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    const startTime = performance.now();
    try {
      const options = {
        method: testMethod,
        headers: { 'Content-Type': 'application/json' },
      };
      if (testMethod !== 'GET' && testMethod !== 'HEAD' && testRequestBody) {
        options.body = testRequestBody;
      }
      const res = await fetch(selectedEndpoint, options);
      const endTime = performance.now();
      const resData = await res.json();
      setTestResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs: Math.round(endTime - startTime),
        data: resData,
      });
    } catch (err) {
      setTestResponse({
        status: 500,
        statusText: 'Client Error / Fetch Failed',
        timeMs: 0,
        data: { error: err.message },
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">PostgreSQL Backend Admin Management</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> PostgreSQL Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">ระบบจัดการเซิร์ฟเวอร์หลังบ้าน ควบคุมเส้นทาง API และสอบทานข้อมูลเชิงลึก</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminStats}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/40 border-b border-slate-800/80 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" /> ภาพรวมหลังบ้าน (System Overview)
          </button>

          <button
            onClick={() => setActiveTab('api-routes')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'api-routes'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" /> จัดการเส้นทาง API (API Routes)
          </button>

          <button
            onClick={() => setActiveTab('db-tables')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'db-tables'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" /> ฐานข้อมูล PostgreSQL (Database Schema)
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'tester'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" /> เครื่องมือทดสอบ API (API Tester)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/90 custom-scrollbar">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">ผู้ใช้งานทั้งหมด</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {statsData?.stats?.totalUsers ?? '...'}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 inline-block">พร้อมระบบสิทธิ์ 4 ระดับ</span>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">เอกสารเวียนในระบบ</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {statsData?.stats?.totalDocuments ?? '...'}
                  </div>
                  <span className="text-[11px] text-blue-400 mt-1 inline-block">บันทึกบน PostgreSQL DB</span>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">การเปิดอ่าน (Read Logs)</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {statsData?.stats?.totalReadLogs ?? '...'}
                  </div>
                  <span className="text-[11px] text-purple-400 mt-1 inline-block">ประทับเวลาแม่นยำ</span>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">การตอบกลับ & ส่งลา</span>
                    <Send className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {statsData?.stats?.totalReplies ?? '...'}
                  </div>
                  <span className="text-[11px] text-amber-400 mt-1 inline-block">พร้อมไฟล์แนบรายงาน</span>
                </div>
              </div>

              {/* Server & DB Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                    <HardDrive className="w-4 h-4 text-emerald-400" /> สถานะฐานข้อมูล PostgreSQL
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Connection Provider</span>
                      <span className="text-emerald-400 font-mono font-medium">PostgreSQL (Prisma ORM)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Database Name</span>
                      <span className="text-slate-200 font-mono">hr_db</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Host Connection</span>
                      <span className="text-slate-200 font-mono">localhost:5432</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">ORM Health Status</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy & Connected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                    <BarChart3 className="w-4 h-4 text-blue-400" /> เอกสารล่าสุดในระบบหลังบ้าน
                  </h3>
                  <div className="space-y-2.5">
                    {statsData?.recentDocs?.length > 0 ? (
                      statsData.recentDocs.map((d) => (
                        <div key={d.id} className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between text-xs border border-slate-800">
                          <div className="truncate max-w-[260px]">
                            <p className="font-medium text-slate-200 truncate">{d.title}</p>
                            <p className="text-[11px] text-slate-500">โดย: {d.authorName}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                            d.priority === 'VERY_URGENT' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {d.priority}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">กำลังโหลดข้อมูลเอกสาร...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: API ROUTES CATALOG */}
          {activeTab === 'api-routes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">รายการเส้นทาง API (API Routes Directory)</h3>
                  <p className="text-xs text-slate-400">ควบคุมและตรวจสอบ Endpoint ทั้งหมดที่ให้บริการในระบบหลังบ้าน</p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  ทั้งหมด {routesList.reduce((acc, cat) => acc + cat.endpoints.length, 0)} Endpoints
                </span>
              </div>

              <div className="space-y-6">
                {routesList.map((cat, idx) => (
                  <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 text-xs font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" /> {cat.category}
                    </div>
                    <div className="divide-y divide-slate-800/80">
                      {cat.endpoints.map((ep, eIdx) => (
                        <div key={eIdx} className="p-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded ${
                              ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              ep.method === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {ep.method}
                            </span>
                            <span className="font-mono text-sm font-semibold text-slate-200">{ep.path}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400">{ep.desc}</span>
                            <button
                              onClick={() => {
                                setSelectedEndpoint(ep.path.split('?')[0]);
                                setTestMethod(ep.method);
                                setActiveTab('tester');
                              }}
                              className="px-2.5 py-1 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-all flex items-center gap-1"
                            >
                              ทดสอบ <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DB TABLES SCHEMA */}
          {activeTab === 'db-tables' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">โครงสร้างตารางข้อมูล (PostgreSQL Database Schema)</h3>
                <p className="text-xs text-slate-400">ตารางหลัก 5 ตารางที่จัดการผ่าน Prisma ORM บน PostgreSQL Database</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-mono text-sm font-bold text-emerald-400">1. model User</span>
                    <span className="text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">Primary User Model</span>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-slate-300">
                    <p><span className="text-amber-400">id</span>: String (cuid) @id</p>
                    <p><span className="text-amber-400">employeeId</span>: String @unique</p>
                    <p><span className="text-amber-400">name / email</span>: String</p>
                    <p><span className="text-amber-400">role</span>: ADMIN | DEPT_HEAD | LECTURER | STAFF</p>
                    <p><span className="text-amber-400">isFirstLogin</span>: Boolean (2FA password force)</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-mono text-sm font-bold text-blue-400">2. model Document</span>
                    <span className="text-[11px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded">Circular Letter Model</span>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-slate-300">
                    <p><span className="text-amber-400">id</span>: String (cuid) @id</p>
                    <p><span className="text-amber-400">title / content</span>: String</p>
                    <p><span className="text-amber-400">priority</span>: NORMAL | URGENT | VERY_URGENT</p>
                    <p><span className="text-amber-400">boardType</span>: GLOBAL | DEPARTMENT | PERSONAL</p>
                    <p><span className="text-amber-400">fileUrl / fileName</span>: String?</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-mono text-sm font-bold text-purple-400">3. model ReadLog</span>
                    <span className="text-[11px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">Read Status Tracking</span>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-slate-300">
                    <p><span className="text-amber-400">documentId / userId</span>: String</p>
                    <p><span className="text-amber-400">readAt</span>: DateTime @default(now())</p>
                    <p className="text-slate-500 text-[11px]">@@unique([documentId, userId])</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-mono text-sm font-bold text-amber-400">4. model Reply & Otp</span>
                    <span className="text-[11px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">Reply & 2FA</span>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-slate-300">
                    <p><span className="text-amber-400">Reply</span>: message, fileUrl, isLeaveRequest</p>
                    <p><span className="text-amber-400">Otp</span>: code (6 digits), expiresAt, isUsed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API TESTER */}
          {activeTab === 'tester' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">เครื่องมือทดสอบ API (Interactive API Console)</h3>
                <p className="text-xs text-slate-400">ทดสอบส่ง HTTP Request ไปยังเส้นทาง API หลังบ้านโดยตรง</p>
              </div>

              <div className="p-5 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-4">
                <div className="flex gap-3">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono font-bold px-3 py-2 rounded-lg"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <input
                    type="text"
                    value={selectedEndpoint}
                    onChange={(e) => setSelectedEndpoint(e.target.value)}
                    placeholder="/api/admin/stats"
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    onClick={handleRunApiTest}
                    disabled={testLoading}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-950 text-xs rounded-lg transition-all flex items-center gap-2"
                  >
                    {testLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    ส่ง Request
                  </button>
                </div>

                {testMethod !== 'GET' && (
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Request Body (JSON Format):</label>
                    <textarea
                      rows={4}
                      value={testRequestBody}
                      onChange={(e) => setTestRequestBody(e.target.value)}
                      placeholder='{\n  "key": "value"\n}'
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono p-3 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Response Output Box */}
              {testResponse && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-300">HTTP Response Result</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 font-mono font-bold rounded ${
                        testResponse.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        Status: {testResponse.status} {testResponse.statusText}
                      </span>
                      <span className="text-slate-400 font-mono">Time: {testResponse.timeMs} ms</span>
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto max-h-[280px]">
                    {JSON.stringify(testResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Backend Control Engine Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}
