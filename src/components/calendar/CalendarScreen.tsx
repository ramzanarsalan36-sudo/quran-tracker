"use client";

import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  TrendingUp, 
  Calendar as CalIcon,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowLeft
} from "lucide-react";

export const CalendarScreen: React.FC = () => {
  const { setActiveTab, daurSession, heatmap, paras, quranNotes } = useIslamicApp();
  const [selectedMonth, setSelectedMonth] = useState("Oct 2026");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "bg-[#1E7B58] text-white";
      case "good":
        return "bg-[#38A169] text-white";
      case "low":
        return "bg-[#86EFAC] text-gray-800";
      case "poor":
        return "bg-[#FCA5A5] text-gray-800";
      default:
        return "bg-[#E5E7EB] text-gray-400";
    }
  };

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F5F8F7]">
      {/* Header with Top-Left Back Arrow */}
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
            Daur Stats &amp; Calendar
          </h1>
          <p className="text-[11px] text-[#6B7280]">
            Consistency heatmap &amp; Hifz retention metrics
          </p>
        </div>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-sm font-extrabold text-[#111827]">{daurSession.streakDays} Days</div>
          <span className="text-[10px] text-[#6B7280]">Current Streak</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1">
            <CalIcon className="w-4 h-4" />
          </div>
          <div className="text-sm font-extrabold text-[#111827]">{daurSession.monthlyCompleted}/30</div>
          <span className="text-[10px] text-[#6B7280]">This Month</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-sm font-extrabold text-[#111827]">{daurSession.parasPerDay}</div>
          <span className="text-[10px] text-[#6B7280]">Paras / Day</span>
        </div>
      </div>

      {/* Monthly Heatmap Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">
              Daur Activity Heatmap
            </h3>
            <p className="text-[10px] text-[#6B7280]">
              Daily reading consistency tracking
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827] bg-[#F9FAFB] px-2.5 py-1 rounded-xl border border-[#E5E7EB]">
            <ChevronLeft className="w-3.5 h-3.5 text-[#9CA3AF] cursor-pointer" />
            <span>{selectedMonth}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] cursor-pointer" />
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-bold text-[#9CA3AF]">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.map((item) => (
              <div
                key={item.day}
                title={`${item.dateStr}: ${item.pagesRead} pages (${item.level})`}
                className={`h-7 rounded-lg ${getHeatmapColor(item.level)} flex flex-col items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 cursor-pointer shadow-3xs`}
              >
                <span>{item.day <= 31 ? item.day : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-[10px] text-[#6B7280]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#E5E7EB]" />
            <span>Not Done</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FCA5A5]" />
            <span>Poor</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#86EFAC]" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38A169]" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#1E7B58]" />
            <span>Excellent</span>
          </div>
        </div>
      </div>

      {/* Daur Breakdown & Hifz Health */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-[#111827]">
          Hifz &amp; Revision Retention Health
        </h3>

        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#6B7280] font-medium">Strong Paras (100% completed)</span>
              <span className="font-bold text-[#10B981]">
                {paras.filter(p => p.completedQuarter === "aek" && !p.isWeakArea).length} Paras
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div 
                className="h-full bg-[#10B981] rounded-full" 
                style={{ width: `${(paras.filter(p => p.completedQuarter === "aek" && !p.isWeakArea).length / 30) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#6B7280] font-medium">Weak Paras (Needing Revision)</span>
              <span className="font-bold text-[#DC2626]">
                {paras.filter(p => p.isWeakArea).length} Paras
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div 
                className="h-full bg-[#DC2626] rounded-full" 
                style={{ width: `${(paras.filter(p => p.isWeakArea).length / 30) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#6B7280] font-medium">Recorded Quran Notes</span>
              <span className="font-bold text-[#2563EB]">
                {quranNotes.length} Notes
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div 
                className="h-full bg-[#2563EB] rounded-full" 
                style={{ width: `${Math.min(100, (quranNotes.length / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
