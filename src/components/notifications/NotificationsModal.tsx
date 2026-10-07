"use client";

import React from "react";
import { X, Bell, Flame, AlertTriangle, Clock } from "lucide-react";
import { useIslamicApp } from "@/context/IslamicAppContext";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { daurSession, paras } = useIslamicApp();

  if (!isOpen) return null;

  const weakCount = paras.filter(p => p.isWeakArea).length;

  const notifications = [
    {
      id: "notif-1",
      icon: "📖",
      title: "Today's Daur Target",
      desc: `Page ${daurSession.todayStartPage} ➔ ${daurSession.todayEndPage} (${daurSession.todayTargetPages} pages scheduled today)`,
      time: "Today",
      color: "bg-blue-50/80 border-blue-200/80 text-blue-900"
    },
    {
      id: "notif-2",
      icon: "🔥",
      title: `${daurSession.streakDays}-Day Streak Active!`,
      desc: "Alhamdulillah, keep up the consistency for maximum Hifz retention.",
      time: "2 hours ago",
      color: "bg-amber-50/80 border-amber-200/80 text-amber-900"
    },
    {
      id: "notif-3",
      icon: "⚠️",
      title: "Weak Areas Reminder",
      desc: `${weakCount} Paras marked as needing revision. Check your Quran Notes.`,
      time: "Yesterday",
      color: "bg-rose-50/80 border-rose-200/80 text-rose-900"
    },
    {
      id: "notif-4",
      icon: "🕌",
      title: "Daily Prayer Slots",
      desc: "Your Daur pages are divided across daily prayer times. Tap slots to mark done.",
      time: "2 days ago",
      color: "bg-emerald-50/80 border-emerald-200/80 text-emerald-900"
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[88vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Notifications &amp; Reminders
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                Daily Daur alerts, streak tracking &amp; milestones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] cursor-pointer active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Notifications List */}
        <div className="overflow-y-auto space-y-2.5 pr-0.5 flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border ${n.color} space-y-1 transition-all shadow-2xs`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-xs">
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </div>
                <span className="text-[10px] opacity-75 font-light">{n.time}</span>
              </div>
              <p className="text-[11px] opacity-90 font-light leading-relaxed pl-5">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="pt-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-[0.98] text-[#475569] text-xs font-medium transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
