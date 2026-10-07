"use client";

import React, { useState, useRef } from "react";
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
  LogOut,
  Camera,
  Image as ImageIcon,
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award
} from "lucide-react";

const PRESET_AVATARS = [
  { id: "mosque", icon: "🕌", label: "Mosque", color: "from-emerald-600 to-teal-700" },
  { id: "quran", icon: "📖", label: "Holy Quran", color: "from-amber-500 to-emerald-700" },
  { id: "kaaba", icon: "🕋", label: "Kaaba", color: "from-stone-800 to-emerald-900" },
  { id: "crescent", icon: "🌙", label: "Crescent", color: "from-teal-600 to-emerald-800" },
  { id: "star", icon: "⭐", label: "Noor", color: "from-amber-600 to-amber-800" },
  { id: "rehal", icon: "✨", label: "Barakah", color: "from-emerald-700 to-teal-900" }
];

const PRESET_BANNERS = [
  { id: "banner1", url: "/images/hero_banner.jpg", label: "Dawn Mosque Sky" },
  { id: "banner2", url: "/images/quran_banner.jpg", label: "Golden Quran Glow" },
  { id: "banner3", url: "/images/quran_rehal.jpg", label: "Quran on Rehal" },
  { id: "banner4", url: "/images/welcome.jpg", label: "Medina Green Dome" }
];

export const ProfileScreen: React.FC = () => {
  const { 
    auth, 
    setAuth, 
    setActiveTab, 
    paras, 
    quranNotes, 
    daurSession, 
    showToast, 
    syncWithCloud, 
    isCloudSynced, 
    logout, 
    resetAllData,
    updateUserPhoto,
    updateUserProfile
  } = useIslamicApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(auth.name);
  const [city, setCity] = useState<string>(auth.city);
  const [role, setRole] = useState<string>(auth.role || "Hafiz-ul-Quran / Admin");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedParas = paras.filter(p => p.completedQuarter === "aek").length;
  const weakCount = paras.filter(p => p.isWeakArea).length;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setIsSyncing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      city,
      role,
      username: `@${name.toLowerCase().replace(/\s+/g, "_")}`
    });
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        showToast("Image size should be less than 2.5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        updateUserPhoto(base64Url);
        setIsPhotoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDataClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset ALL Daur progress, daily checklist, and notes? This will let you start completely fresh from scratch (0% progress)."
    );
    if (confirmed) {
      resetAllData();
      setActiveTab("daur");
    }
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
      onClick: () => showToast("Daily 7:00 PM Daur reminder is active")
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
      id: "reset-data",
      label: "Reset All Progress / Start Fresh",
      icon: RotateCcw,
      badge: "New Cycle",
      danger: true,
      onClick: handleResetDataClick
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
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F2F7F4]">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header with Back Arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("daur")}
            className="w-9 h-9 rounded-2xl bg-white border border-[#DDE7E2] text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            aria-label="Back to Daur Dashboard"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-emerald-950 tracking-tight leading-tight font-heading">
              Admin &amp; Profile Panel
            </h1>
            <p className="text-[11px] text-emerald-700/70 font-medium">
              Manage account, profile photo &amp; Daur preferences
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPhotoModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-amber-300" />
          <span>Change Photo</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#DDE7E2] shadow-2xs relative overflow-hidden">
        {/* Decorative Top Emerald Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400" />

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-emerald-900 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600 bg-emerald-50/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-emerald-900 mb-1">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Hafiz-ul-Quran / Admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600 bg-emerald-50/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-emerald-900 mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600 bg-emerald-50/30"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar / Photo with click to edit */}
              <div 
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative group cursor-pointer"
                title="Click to change photo"
              >
                {auth.avatarUrl ? (
                  auth.avatarUrl.startsWith("http") || auth.avatarUrl.startsWith("data:") ? (
                    <img 
                      src={auth.avatarUrl} 
                      alt={auth.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-md group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-emerald-600 group-hover:scale-105 transition-transform">
                      {auth.avatarUrl}
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-emerald-600 group-hover:scale-105 transition-transform">
                    {auth.name ? auth.name.charAt(0).toUpperCase() : "H"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-emerald-950 font-heading">
                    {auth.name || "Hafiz Hamza"}
                  </h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-emerald-800/70 font-medium">
                  {auth.username || "@hafiz"} • {auth.city || "Makkah"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {auth.role || "Hafiz-ul-Quran"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    🔥 {daurSession.streakDays} Day Streak
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer transition-colors"
              title="Edit Profile Info"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Daur Stats Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] shadow-2xs">
          <span className="text-[10px] text-emerald-800/70 font-bold block">Completed</span>
          <span className="text-sm font-black text-emerald-950">{completedParas}</span>
          <span className="text-[9px] text-emerald-600 font-bold">Paras / 30</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] shadow-2xs">
          <span className="text-[10px] text-emerald-800/70 font-bold block">Weak Flags</span>
          <span className="text-sm font-black text-rose-600">{weakCount}</span>
          <span className="text-[9px] text-rose-600 font-bold">Need Review</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] shadow-2xs">
          <span className="text-[10px] text-emerald-800/70 font-bold block">Notes Saved</span>
          <span className="text-sm font-black text-emerald-700">{quranNotes.length}</span>
          <span className="text-[9px] text-emerald-700 font-bold">Total Notes</span>
        </div>
      </div>

      {/* Firebase Cloud Sync Status Card */}
      <div className="bg-gradient-to-br from-[#063327] to-[#031E16] text-white rounded-3xl p-4 border border-emerald-800/50 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCloudSynced ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            <span className="text-xs font-bold text-white tracking-wide">Firebase Cloud Database</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-900/80 text-amber-300 border border-emerald-700/50">
            Realtime Sync
          </span>
        </div>
        <p className="text-[11px] text-emerald-200/75 leading-relaxed mb-3">
          Aapka Daur schedule, reading progress, aur Quran notes Firebase cloud database par securely synchronized hain.
        </p>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          {isSyncing ? "Syncing with Cloud..." : "Sync Data Now with Cloud"}
        </button>
      </div>

      {/* Menu Navigation */}
      <div className="bg-white rounded-3xl p-2 border border-[#DDE7E2] shadow-2xs divide-y divide-[#F0F5F2]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full p-3 flex items-center justify-between hover:bg-emerald-50/50 rounded-2xl transition-colors text-left cursor-pointer ${
                item.danger ? "hover:bg-red-50/60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  item.danger 
                    ? "bg-red-50 text-red-600" 
                    : "bg-emerald-50 text-emerald-700"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold ${
                  item.danger ? "text-red-600" : "text-emerald-950"
                }`}>
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.danger 
                      ? "bg-red-100 text-red-700" 
                      : "text-emerald-800 bg-emerald-50 border border-emerald-200"
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-emerald-800/40" />
              </div>
            </button>
          );
        })}
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-bold text-emerald-900">
          Quran Daur Tracker • v2.0
        </p>
        <p className="text-[10px] text-emerald-700/60 mt-0.5 font-medium">
          &ldquo;And We have indeed made the Quran easy to understand and remember&rdquo;
        </p>
      </div>

      {/* PHOTO & BANNER CUSTOMIZATION MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-emerald-200 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-emerald-950">
                  Profile &amp; Banner Photo
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Upload Custom Image from Phone / Computer */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-emerald-900 block">
                1. Upload from Device (Gallery / Files)
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-amber-300" />
                <span>Upload Custom Photo from Device</span>
              </button>
            </div>

            {/* 2. Choose Preset Avatar Icons */}
            <div className="space-y-2 pt-2 border-t border-emerald-100">
              <span className="text-[11px] font-extrabold text-emerald-900 block">
                2. Or Pick a Preset Islamic Avatar
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      updateUserPhoto(avatar.icon);
                      setIsPhotoModalOpen(false);
                    }}
                    className="p-2.5 rounded-2xl border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span className="text-2xl">{avatar.icon}</span>
                    <span className="text-[10px] font-bold text-emerald-950">{avatar.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Choose Dashboard Top Hero Banner Photo */}
            <div className="space-y-2 pt-2 border-t border-emerald-100">
              <span className="text-[11px] font-extrabold text-emerald-900 block">
                3. Dashboard Top Banner Photo
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BANNERS.map((banner) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => {
                      updateUserPhoto(auth.avatarUrl, banner.url);
                      setIsPhotoModalOpen(false);
                      showToast(`Banner changed to ${banner.label} 🖼️`);
                    }}
                    className={`p-1.5 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                      auth.bannerUrl === banner.url
                        ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                        : "border-slate-200 hover:border-emerald-400"
                    }`}
                  >
                    <img 
                      src={banner.url} 
                      alt={banner.label} 
                      className="w-10 h-7 rounded-md object-cover" 
                    />
                    <span className="text-[10px] font-bold text-slate-800 leading-tight">
                      {banner.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

