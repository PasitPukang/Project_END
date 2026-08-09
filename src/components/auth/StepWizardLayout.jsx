'use client';
import React from 'react';
import { Lock } from 'lucide-react';

export default function StepWizardLayout({ currentStep, children }) {
  const steps = [
    { number: 1, label: 'Identity' },
    { number: 2, label: 'ยืนยันตัวตน' },
    { number: 3, label: 'เปลี่ยนรหัสผ่าน' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      
      {/* Top Navigation Header */}
      <header className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-[#006653]">
            E-OFFICE
          </div>
          <span className="font-extrabold text-xl text-[#006653] tracking-tight">E-OFFICE +</span>
        </div>
      </header>

      {/* Stepper Bar */}
      <div className="w-full max-w-md mx-auto pt-6 pb-2 px-4">
        <div className="flex items-center justify-between relative">
          
          {/* Progress Line */}
          <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0"></div>

          {steps.map((step) => {
            const isDone = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isDone || isCurrent
                      ? 'bg-[#00a86b] text-white shadow-sm'
                      : 'bg-white border-2 border-slate-300 text-slate-500'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-xs font-semibold mt-2 ${
                    isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs p-6 md:p-8">
          {children}
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span>End-to-end encrypted verification process</span>
        </div>
      </main>

    </div>
  );
}

