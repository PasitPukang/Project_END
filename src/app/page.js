'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LoginPage from '@/components/auth/LoginPage';
import OtpModal from '@/components/auth/OtpModal';
import FirstTimePasswordModal from '@/components/auth/FirstTimePasswordModal';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import UserManagementModal from '@/components/admin/UserManagementModal';
import AdminView from '@/components/admin/AdminView';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateDocumentModal from '@/components/documents/CreateDocumentModal';
import DocumentDetailModal from '@/components/documents/DocumentDetailModal';
import { getMe, getDocuments, logout as apiLogout } from '@/lib/apiClient';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authStep, setAuthStep] = useState('LOGIN'); // LOGIN, OTP, FIRST_TIME_PASS, DASHBOARD
  const [pendingUser, setPendingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab & View Navigation
  const [activeTab, setActiveTab] = useState('INBOX'); // INBOX, GLOBAL, DEPARTMENT, PERSONAL, SENT, ADMIN
  const [currentView, setCurrentView] = useState('HOME'); // HOME, CREATE_DOC, DOC_DETAIL, ADMIN
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Documents & Notification State
  const [documents, setDocuments] = useState([]);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Check server session on load
  useEffect(() => {
    (async () => {
      try {
        const { user } = await getMe();
        if (user) {
          setCurrentUser(user);
          setAuthStep('DASHBOARD');
          loadDocsData(user);
        }
      } catch {
        // Default to LOGIN
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadDocsData = async (user) => {
    try {
      const docs = await getDocuments();
      if (docs) setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleLoginSubmit = (user) => {
    setPendingUser(user);
    setAuthStep('OTP');
  };

  const handleOtpVerified = async () => {
    if (!pendingUser) return;

    if (pendingUser.isFirstLogin) {
      setAuthStep('FIRST_TIME_PASS');
    } else {
      try {
        const { user } = await getMe();
        setCurrentUser(user);
        loadDocsData(user);
      } catch {
        setCurrentUser(pendingUser);
        loadDocsData(pendingUser);
      }
      setAuthStep('DASHBOARD');
    }
  };

  const handlePasswordChanged = (updatedUser) => {
    setCurrentUser(updatedUser);
    setPendingUser(null);
    setAuthStep('DASHBOARD');
    loadDocsData(updatedUser);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setPendingUser(null);
    setAuthStep('LOGIN');
  };

  // Calculate unread circulars for current user
  const unreadDocs = documents.filter((doc) => {
    if (!currentUser || !doc.readLogs) return false;
    if (doc.authorId === currentUser.id) return false; // Ignore own documents
    return !doc.readLogs.some((l) => l.userId === currentUser.id);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#006653] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-slate-600 text-sm font-bold animate-pulse">
            กำลังเข้าสู่ระบบ FLAS E-Office...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 font-sans">
      {/* 1. LOGIN STEP (KU Inspired) */}
      {authStep === 'LOGIN' && (
        <LoginPage
          onLoginSubmit={handleLoginSubmit}
          onOpenForgotPassword={() => setIsForgotPassOpen(true)}
        />
      )}

      {/* 2. OTP STEP (2FA Real Email) */}
      {authStep === 'OTP' && pendingUser && (
        <OtpModal
          user={pendingUser}
          onVerifySuccess={handleOtpVerified}
        />
      )}

      {/* 3. FIRST TIME PASSWORD STEP */}
      {authStep === 'FIRST_TIME_PASS' && pendingUser && (
        <FirstTimePasswordModal
          user={pendingUser}
          onPasswordChanged={handlePasswordChanged}
        />
      )}

      {/* 4. MAIN APPLICATION DASHBOARD LAYOUT */}
      {authStep === 'DASHBOARD' && currentUser && (
        <div className="flex min-h-screen">
          {/* Left Collapsible Dark Green Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'ADMIN') setCurrentView('ADMIN');
              else setCurrentView('HOME');
            }}
            currentUser={currentUser}
            onOpenCreateDoc={() => {
              setEditDoc(null);
              setCurrentView('CREATE_DOC');
            }}
            onLogout={handleLogout}
            unreadCount={unreadDocs.length}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top KU Portal Header */}
            <Header
              currentUser={currentUser}
              onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              isSidebarCollapsed={isSidebarCollapsed}
              unreadDocs={unreadDocs}
              onSelectDoc={(doc) => {
                setSelectedDoc(doc);
                setCurrentView('DOC_DETAIL');
              }}
            />

            {/* Dynamic View Content */}
            <main className="flex-1 overflow-y-auto">
              {currentView === 'HOME' && (
                <Dashboard
                  currentUser={currentUser}
                  activeTab={activeTab}
                  onOpenDocDetail={(doc) => {
                    setSelectedDoc(doc);
                    setCurrentView('DOC_DETAIL');
                  }}
                  onOpenCreateDoc={() => {
                    setEditDoc(null);
                    setCurrentView('CREATE_DOC');
                  }}
                />
              )}

              {currentView === 'CREATE_DOC' && (
                <CreateDocumentModal
                  currentUser={currentUser}
                  editDoc={editDoc}
                  onClose={() => {
                    setCurrentView('HOME');
                    setEditDoc(null);
                  }}
                  onDocSaved={() => {
                    setCurrentView('HOME');
                    setEditDoc(null);
                    loadDocsData(currentUser);
                  }}
                />
              )}

              {currentView === 'DOC_DETAIL' && selectedDoc && (
                <DocumentDetailModal
                  doc={selectedDoc}
                  currentUser={currentUser}
                  onClose={() => {
                    setCurrentView('HOME');
                    setSelectedDoc(null);
                    loadDocsData(currentUser);
                  }}
                  onEditDoc={(docToEdit) => {
                    setSelectedDoc(null);
                    setEditDoc(docToEdit);
                    setCurrentView('CREATE_DOC');
                  }}
                  onDocDeleted={() => {
                    setCurrentView('HOME');
                    setSelectedDoc(null);
                    loadDocsData(currentUser);
                  }}
                />
              )}

              {currentView === 'ADMIN' && (
                <AdminView
                  onOpenAddUser={() => setIsUserMgmtOpen(true)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* MODAL: Forgot Password */}
      {isForgotPassOpen && (
        <ForgotPasswordModal
          onClose={() => setIsForgotPassOpen(false)}
          onSuccess={(msg) => {
            setIsForgotPassOpen(false);
            alert(msg);
          }}
        />
      )}

      {/* MODAL: Admin Create User Popup (ปุ่มขอรับบัญชี) */}
      {isUserMgmtOpen && (
        <UserManagementModal
          onClose={() => setIsUserMgmtOpen(false)}
          onUserCreated={() => {
            if (currentUser) loadDocsData(currentUser);
          }}
        />
      )}
    </div>
  );
}
