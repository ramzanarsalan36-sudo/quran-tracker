"use client";

import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { 
  User, 
  Settings, 
  Bell, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  HelpCircle, 
  Info, 
  ChevronRight,
  Edit2,
  Check,
  X,
  FileText,
  BookOpen,
  ArrowLeft,
  LogOut
} from "lucide-react";

export const ProfileScreen: React.FC = () => {
  const { auth, setAuth, setActiveTab, paras, quranNotes, daurSession, showToast, syncWithCloud, isCloudSynced, logout } = useIslamicApp();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [name, setName] = useState<string>(auth.name);
  const [city, setCity] = useState<string>(auth.city);

  const completedParas = paras.filter(p => p.completedQuarter === "aek").length;
  const weakCount = paras.filter(p => p.isWeakArea).length;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setIsSyncing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth({
      ...auth,
      name,
      city,
      username: `@${name.toLowerCase().replace(/\s+/g, "_")}`
    });
    setIsEditing(false);
    showToast("Profile updated successfully!");
  };

  const menuItems = [
    {
      id: "daur-plan",
      label: "Daur Plan & Paras Breakdown",
      icon: BookOpen,
      badge: `${completedParas}/30`,
      onClick: () => setActiveTab("plan")
    },
    {
      id: "notes",
      label: "My Quran Notes & Reflections",
      icon: FileText,
      badge: `${quranNotes.length}`,
      onClick: () => setActiveTab("notes")
    },
    {
      id: "weak-areas",
      label: "Flagged Weak Areas",
      icon: Flame,
      badge: `${weakCount} Paras`,
      onClick: () => setActiveTab("notes")
    },
    {
      id: "notifications",
      label: "Daily Daur Reminders",
      icon: Bell,
      badge: "Enabled",
      onClick: () => showToast("Daily 7:00 PM Daur reminder is enabled")
    },
    {
      id: "offline-quran",
      label: "Offline Quran PDF Cache",
      icon: BookOpen,
      badge: "Manage Storage",
      onClick: async () => {
        const confirmed = window.confirm("Clear offline cached Quran PDF and re-download fresh copy?");
        if (confirmed) {
          const { clearOfflineQuranPdf, cacheQuranPdf } = await import("@/lib/quranPdfCache");
          await clearOfflineQuranPdf();
          showToast("Offline Quran cache cleared. Re-caching...");
          await cacheQuranPdf();
          showToast("Quran re-downloaded for offline use ✓");
        }
      }
    },
    {
      id: "logout",
      label: "Sign Out / Switch Account",
      icon: LogOut,
      badge: "Account",
      onClick: () => {
        if (window.confirm("Are you sure you want to sign out?")) {
          logout();
        }
      }
    }
  ];

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F5F8F7]">
      {/* Top Header with Back Arrow */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab("daur")}
          className="w-9 h-9 rounded-2xl bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          aria-label="Back to Daur Dashboard"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#111827] tracking-tight leading-tight">
            Profile &amp; Settings
          </h1>
          <p className="text-[11px] text-[#6B7280]">
            Manage account &amp; Daur preferences
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-2xs">
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7280] mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl bg-neutral-100 text-xs font-bold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                {auth.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  {auth.name}
                </h2>
                <p className="text-xs text-[#6B7280]">
                  {auth.username} • {auth.city}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    Daur Tracker
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                    🔥 {daurSession.streakDays} Day Streak
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#4B5563] cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Daur Stats Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-[10px] text-[#6B7280] font-medium block">Completed</span>
          <span className="text-sm font-extrabold text-[#111827]">{completedParas}</span>
          <span className="text-[9px] text-[#10B981] font-semibold">Paras</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-[10px] text-[#6B7280] font-medium block">Weak Flags</span>
          <span className="text-sm font-extrabold text-[#DC2626]">{weakCount}</span>
          <span className="text-[9px] text-[#DC2626] font-semibold">Need Review</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-[10px] text-[#6B7280] font-medium block">Notes Saved</span>
          <span className="text-sm font-extrabold text-[#2563EB]">{quranNotes.length}</span>
          <span className="text-[9px] text-[#2563EB] font-semibold">Total Notes</span>
        </div>
      </div>

      {/* Firebase Cloud Sync Status Card */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-3xl p-4 border border-[#334155] shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCloudSynced ? "bg-[#10B981] animate-pulse" : "bg-[#F59E0B]"}`}></span>
            <span className="text-xs font-bold text-white tracking-wide">Firebase Cloud Sync</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#334155] text-[#93C5FD]">
            hifz-bf01b
          </span>
        </div>
        <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
          Aapka Daur schedule, reading progress, aur Quran notes realtime Firebase database mein auto-backup ho rahe hain.
        </p>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
          {isSyncing ? "Syncing with Cloud..." : "Sync Data Now with Cloud"}
        </button>
      </div>

      {/* Menu Navigation */}
      <div className="bg-white rounded-3xl p-2 border border-[#E5E7EB] shadow-2xs divide-y divide-[#F3F4F6]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full p-3 flex items-center justify-between hover:bg-[#F9FAFB] rounded-2xl transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F9FAFB] text-[#2563EB] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#111827]">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-semibold text-[#6B7280]">
          Daur • Hifz &amp; Daur Tracker v1.2
        </p>
        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
          &ldquo;Small Steps, Big Rewards&rdquo;
        </p>
      </div>
    </div>
  );
};
