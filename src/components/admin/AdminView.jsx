'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, RotateCcw, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Demo fallback users matching wireframe if db empty
  const demoUsers = [
    { id: 'u1', name: 'อนันต์ มุ่งมั่น', email: 'anan.m@eoffice.com', employeeId: 'EMP-00124', department: 'ไอที (IT)', role: 'Senior Developer', salary: '28000' },
    { id: 'u2', name: 'พัชรา ช่วยคิด', email: 'patchara.c@eoffice.com', employeeId: 'EMP-00145', department: 'การเงิน (Finance)', role: 'Accountant', salary: '15000' },
    { id: 'u3', name: 'สมชาย ใจดี', email: 'somchai.j@eoffice.com', employeeId: 'EMP-00098', department: 'บริหารทั่วไป', role: 'Officer', salary: '14000' },
    { id: 'u4', name: 'วิศวะ นำไทย', email: 'wisawa.n@eoffice.com', employeeId: 'EMP-00189', department: 'ไอที (IT)', role: 'System Admin', salary: '18000' },
    { id: 'u5', name: 'สุปราณี มาดี', email: 'supranee.m@eoffice.com', employeeId: 'EMP-00210', department: 'ทรัพยากรบุคคล (HR)', role: 'HR Manager', salary: '30000' },
  ];

  const displayUsers = usersList.length > 0
    ? usersList.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        employeeId: u.employeeId,
        department: u.department || 'วิทยาการคอมพิวเตอร์',
        role: u.role || 'STAFF',
        salary: '25000',
      }))
    : demoUsers;

  const filtered = displayUsers.filter(u => {
    if (deptFilter !== 'ALL' && !u.department.includes(deptFilter)) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(term);
      const matchId = u.employeeId.toLowerCase().includes(term);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in select-none">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-bold mb-1">
            Admin &gt; <span className="text-[#00b074]">User Management</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
            จัดการผู้ใช้ (User Management)
          </h1>
        </div>

        {/* Add User Button */}
        <button
          onClick={onOpenAddUser}
          className="bg-[#002b49] hover:bg-[#001f35] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้ใหม่</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ หรือ ID พนักงาน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00b074]"
          />
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold shrink-0">หน่วยงาน:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ไอที">ไอที (IT)</option>
              <option value="การเงิน">การเงิน (Finance)</option>
              <option value="วิทยาการคอมพิวเตอร์">วิทยาการคอมพิวเตอร์</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold shrink-0">ตำแหน่ง:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DEPT_HEAD">DEPT_HEAD</option>
              <option value="LECTURER">LECTURER</option>
              <option value="STAFF">STAFF</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-1 text-right">
          <button
            onClick={() => { setSearch(''); setDeptFilter('ALL'); setRoleFilter('ALL'); }}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors inline-flex items-center justify-center"
            title="รีเซ็ต"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* User Table Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 pb-3">
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4">ID พนักงาน</th>
                <th className="py-3 px-4">หน่วยงาน</th>
                <th className="py-3 px-4">ตำแหน่ง</th>
                <th className="py-3 px-4 text-center">เงินเดือน</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((user) => (
                <tr key={user.id} className="table-row-hover">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                        {user.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-800">
                    {user.employeeId}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-700">
                    {user.department}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-700">
                    {user.role}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-800">
                    {user.salary}
                  </td>

                  <td className="py-4 px-4 text-right space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching wireframe Admin.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>แสดงผล {filtered.length} จาก 50 รายการ (หน้า 1 จาก 10)</span>

          <div className="flex items-center gap-1.5 self-center">
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#002b49] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
