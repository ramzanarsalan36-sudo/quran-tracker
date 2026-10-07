"use client";

import React from "react";
import { X, Bell, Flame, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
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
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      id: "notif-2",
      icon: "🔥",
      title: `${daurSession.streakDays}-Day Streak Active!`,
      desc: "Alhamdulillah, keep up the consistency for maximum Hifz retention.",
      time: "2 hours ago",
      color: "bg-amber-50 border-amber-200 text-amber-800"
    },
    {
      id: "notif-3",
      icon: "⚠️",
      title: "Weak Areas Reminder",
      desc: `${weakCount} Paras marked as needing revision. Check your Quran Notes.`,
      time: "Yesterday",
      color: "bg-red-50 border-red-200 text-red-800"
    },
    {
      id: "notif-4",
      icon: "🕌",
      title: "Daily Prayer Slots",
      desc: "Your Daur pages are divided across daily prayer times. Tap slots to mark done.",
      time: "2 days ago",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E5E7EB] max-h-[85vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                Notifications &amp; Reminders
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Daily Daur alerts, streak tracking &amp; milestones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border ${n.color} space-y-1 transition-all shadow-2xs`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </div>
                <span className="text-[10px] opacity-75 font-semibold">{n.time}</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed pl-5">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] text-xs font-bold transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
