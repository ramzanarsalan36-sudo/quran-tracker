"use client";

import React, { ReactNode } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { BottomNavbar } from "@/components/layout/BottomNavbar";
import { Check } from "lucide-react";

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useIslamicApp();

  return (
    <div className="min-h-screen bg-[#E5ECE9] flex justify-center items-start lg:py-6 lg:px-4">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#111827] text-white text-xs font-semibold shadow-2xl border border-blue-400/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90%]">
          <div className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Mobile Screen Canvas */}
      <div className="w-full max-w-[420px] min-h-screen bg-[#F5F8F7] lg:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden border border-[#D1D5DB]">
        {children}

        {/* Safe-Area Bottom Navbar */}
        <BottomNavbar />
      </div>
    </div>
  );
};
