"use client";

import React from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { Home, BookOpen, FileText, Calendar, User } from "lucide-react";
import { AppTab } from "@/types";

export const BottomNavbar: React.FC = () => {
  const { activeTab, setActiveTab, quranNotes } = useIslamicApp();

  const navItems = [
    { id: "daur" as AppTab, label: "Daur", icon: Home },
    { id: "plan" as AppTab, label: "Plan", icon: BookOpen },
    { id: "notes" as AppTab, label: "Notes", icon: FileText, badge: quranNotes.length },
    { id: "calendar" as AppTab, label: "Stats", icon: Calendar },
    { id: "profile" as AppTab, label: "Profile", icon: User }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] safe-bottom max-w-[420px] mx-auto shadow-lg"
      aria-label="Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive ? "text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#111827]"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all relative ${
                  isActive ? "bg-[#EFF6FF] text-[#2563EB]" : ""
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"}`} />
                {item.badge !== undefined && item.badge > 0 && item.id === "notes" && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute -top-0.5 -right-0.5"></span>
                )}
              </div>
              <span 
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? "font-bold text-[#2563EB]" : "font-medium text-[#9CA3AF]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] absolute bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
