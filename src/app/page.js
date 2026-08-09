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
import { getMe, logout as apiLogout } from '@/lib/apiClient';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authStep, setAuthStep] = useState('LOGIN'); // LOGIN, OTP, FIRST_TIME_PASS, DASHBOARD
  const [pendingUser, setPendingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab & View Navigation
  const [activeTab, setActiveTab] = useState('CIRCULAR_LETTERS'); // CIRCULAR_LETTERS, DOCUMENTS, ADMIN
  const [currentView, setCurrentView] = useState('HOME'); // HOME, CREATE_DOC, DOC_DETAIL, ADMIN

  // Modals & State
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
        }
      } catch {
        // Default to LOGIN
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
      } catch {
        setCurrentUser(pendingUser);
      }
      setAuthStep('DASHBOARD');
    }
  };

  const handlePasswordChanged = (updatedUser) => {
    setCurrentUser(updatedUser);
    setPendingUser(null);
    setAuthStep('DASHBOARD');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm font-bold animate-pulse">กำลังโหลดระบบ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans">
      
      {/* 1. LOGIN STEP */}
      {authStep === 'LOGIN' && (
        <LoginPage
          onLoginSubmit={handleLoginSubmit}
          onOpenForgotPassword={() => setIsForgotPassOpen(true)}
        />
      )}

      {/* 2. OTP STEP */}
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
          {/* Left Dark Sidebar Navigation */}
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
            unreadCount={16}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header Banner */}
            <Header currentUser={currentUser} />

            {/* Dynamic View Content */}
            <main className="flex-1 overflow-y-auto">
              {currentView === 'HOME' && (
                <Dashboard
                  currentUser={currentUser}
                  onOpenDocDetail={(doc) => {
                    setSelectedDoc(doc);
                    setCurrentView('DOC_DETAIL');
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
                  }}
                  onEditDoc={(docToEdit) => {
                    setSelectedDoc(null);
                    setEditDoc(docToEdit);
                    setCurrentView('CREATE_DOC');
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

      {/* MODAL: Admin Create User Popup */}
      {isUserMgmtOpen && (
        <UserManagementModal
          onClose={() => setIsUserMgmtOpen(false)}
          onUserCreated={() => {}}
        />
      )}

    </div>
  );
}
