'use client';
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, User, Building2, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getUsers } from '@/lib/apiClient';

export default function AdminView({ onOpenAddUser }) {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsersList(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = usersList.filter((u) => {
    if (deptFilter !== 'ALL' && !u.department?.includes(deptFilter)) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(term);
      const matchId = u.employeeId?.toLowerCase().includes(term);
      const matchEmail = u.email?.toLowerCase().includes(term);
      if (!matchName && !matchId && !matchEmail) return false;
    }
    return true;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">ADMIN (Tier 1)</span>;
      case 'DEPT_HEAD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">DEPT_HEAD (Tier 2)</span>;
      case 'LECTURER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#006653] border border-emerald-300">LECTURER (Tier 3)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">STAFF (Tier 4)</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up select-none">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-bold mb-1">
            Admin Portal &gt; <span className="text-[#006653]">Personnel Directory</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>ทำเนียบบุคลากรและจัดการสิทธิ์ (User Management)</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006653]">
              {usersList.length} ท่าน
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            คณะศิลปศาสตร์และวิทยาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
          </p>
        </div>

        {/* Add User Button (ปุ่ม "ขอรับบัญชีใหม่") */}
        <button
          onClick={onOpenAddUser}
          className="bg-[#006653] hover:bg-[#004d3d] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-[#b5c721]" />
          <span>เพิ่มผู้ใช้ใหม่ (ขอรับบัญชี)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, ID พนักงาน หรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] cursor-pointer"
          >
            <option value="ALL">สิทธิ์: ทั้งหมด (All Roles)</option>
            <option value="ADMIN">ผู้บริหาร (ADMIN)</option>
            <option value="DEPT_HEAD">หัวหน้าภาค/ฝ่าย (DEPT_HEAD)</option>
            <option value="LECTURER">อาจารย์ประจำ (LECTURER)</option>
            <option value="STAFF">เจ้าหน้าที่ (STAFF)</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006653] cursor-pointer"
          >
            <option value="ALL">ภาควิชา: ทั้งหมด</option>
            <option value="วิทยาการคอมพิวเตอร์">ภาควิชาวิทยาการคอมพิวเตอร์ฯ</option>
            <option value="วิทยาศาสตร์กายภาพ">ภาควิชาวิทยาศาสตร์กายภาพฯ</option>
            <option value="สำนักงานเลขานุการ">สำนักงานเลขานุการคณะ</option>
            <option value="สำนักงานคณบดี">สำนักงานคณบดี</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">รหัสพนักงาน (ID)</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล บุคลากร</th>
                <th className="py-3 px-4">อีเมลองค์กร (Email)</th>
                <th className="py-3 px-4">ตำแหน่ง / ภาควิชา</th>
                <th className="py-3 px-4">สิทธิ์ในระบบ</th>
                <th className="py-3 px-4 text-center">สถานะ Login ครั้งแรก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    กำลังโหลดข้อมูลบุคลากร...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    ไม่พบบุคลากรที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#006653]">
                      {user.employeeId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{user.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{user.email}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{user.positionTitle || user.role}</div>
                      <div className="text-[11px] text-slate-400">{user.department}</div>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4 text-center">
                      {user.isFirstLogin ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          รอเปลี่ยนรหัส
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-50 text-[#006653] px-2 py-0.5 rounded border border-emerald-200">
                          เปิดใช้งานแล้ว
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
