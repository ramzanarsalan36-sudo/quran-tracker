"use client";

import React, { ReactNode } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { BottomNavbar } from "@/components/layout/BottomNavbar";
import { Check } from "lucide-react";

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast, auth } = useIslamicApp();

  return (
    <div className="min-h-screen bg-[#D5E3DC] flex justify-center items-start lg:py-6 lg:px-4">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#063327] text-white text-xs font-semibold shadow-2xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90%]">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Mobile Screen Canvas */}
      <div className="w-full max-w-[425px] min-h-screen bg-[#F4F7F5] lg:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden border border-[#CAD8D1]">
        {children}

        {/* Safe-Area Bottom Navbar (Only when logged in) */}
        {auth.isLoggedIn && <BottomNavbar />}
      </div>
    </div>
  );
};

