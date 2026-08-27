'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Shield,
  User,
  Building2,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Database,
  Trash2,
  AlertTriangle,
  X,
  AlertCircle
} from 'lucide-react';
import { getUsers, deleteUser } from '@/lib/apiClient';
import AdminBackendModal from './AdminBackendModal';

export default function AdminView({ onOpenAddUser }) {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Deletion States
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

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

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteUser(userToDelete.id);
      const deletedName = userToDelete.name;
      const deletedId = userToDelete.employeeId;
      setUserToDelete(null);
      setToastMessage(`ลบผู้ใช้งาน ${deletedName} (${deletedId}) ออกจากระบบเรียบร้อยแล้ว`);
      setTimeout(() => setToastMessage(''), 5000);
      loadUsers();
    } catch (err) {
      setDeleteError(err.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    } finally {
      setIsDeleting(false);
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsBackendModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md cursor-pointer hover:border-emerald-500/50"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>จัดการระบบหลังบ้าน & ทดสอบ API</span>
          </button>

          <button
            onClick={onOpenAddUser}
            className="bg-[#006653] hover:bg-[#004d3d] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#b5c721]" />
            <span>เพิ่มผู้ใช้ใหม่ (ขอรับบัญชี)</span>
          </button>
        </div>
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
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    กำลังโหลดข้อมูลบุคลากร...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
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
                    <td className="py-3 px-4 text-center">
                      {user.employeeId === 'EMP-D007' ? (
                        <span
                          className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                          title="บัญชีผู้ดูแลระบบหลัก ห้ามลบ"
                        >
                          Admin หลัก
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteError('');
                            setUserToDelete(user);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                          title={`ลบผู้ใช้งาน ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Delete Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-slate-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">ยืนยันการลบบัญชีผู้ใช้งาน</h3>
                  <p className="text-xs text-slate-500">การกระทำนี้จะลบผู้ใช้ออกจากฐานข้อมูลถาวร</p>
                </div>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">ชื่อ-นามสกุล:</span>
                <span className="font-bold text-slate-900">{userToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">รหัสพนักงาน:</span>
                <span className="font-mono font-bold text-[#006653]">{userToDelete.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">อีเมล:</span>
                <span className="font-mono text-slate-700">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">บทบาท (Role):</span>
                <span>{getRoleBadge(userToDelete.role)}</span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>
                เมื่อลบแล้ว เอกสารหรือบันทึกการอ่าน (Read Logs) ที่เกี่ยวข้องกับผู้ใช้งานนี้จะถูกลบออกจากระบบ (Cascade Delete) และไม่สามารถกู้คืนได้
              </span>
            </div>

            {/* Error Display */}
            {deleteError && (
              <div className="bg-rose-100 text-rose-700 p-2.5 rounded-lg text-xs font-bold mb-4">
                {deleteError}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-950/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'กำลังลบ...' : 'ยืนยันลบบัญชีนี้'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Backend Inspector Modal */}
      <AdminBackendModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}
