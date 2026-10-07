import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { 
  Bell, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Calendar, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Minus,
  Sparkles,
  FileText,
  Clock,
  Settings,
  CheckCircle2,
  Bookmark,
  SlidersHorizontal
} from "lucide-react";
import { PlanSetupModal } from "@/components/plan/PlanSetupModal";
import { NotificationsModal } from "@/components/notifications/NotificationsModal";
import { DaurDetailModal } from "@/components/home/DaurDetailModal";
import { TodayProgressModal } from "@/components/home/TodayProgressModal";
import { QuranPdfReader } from "@/components/reader/QuranPdfReader";
import { ContinueReadingLauncherModal } from "@/components/reader/ContinueReadingLauncherModal";
import { calculatePortionBreakdown, getParaForPage } from "@/lib/quranPortionUtils";

export const HomeScreen: React.FC = () => {
  const { 
    auth, 
    setActiveTab, 
    daurSession, 
    markTodayDone,
    updateTodayPages,
    updateTodayQuality,
    incrementMistakes,
    decrementMistakes,
    heatmap,
    paras,
    toggleDailySlot,
    isPlanSetupOpen,
    setIsPlanSetupOpen,
    applyDaurPlan
  } = useIslamicApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDaurDetailOpen, setIsDaurDetailOpen] = useState(false);
  const [isTodayProgressOpen, setIsTodayProgressOpen] = useState(false);
  const [isQuranReaderOpen, setIsQuranReaderOpen] = useState(false);
  const [isContinueLauncherOpen, setIsContinueLauncherOpen] = useState(false);
  const [targetReaderPage, setTargetReaderPage] = useState<number>(daurSession.todayStartPage || 1);

  const weakParas = paras.filter(p => p.isWeakArea);
  const percentDaur = Math.round((daurSession.completedParas / daurSession.totalParas) * 100);
  const todayPercent = Math.min(100, Math.round((daurSession.todayPagesRead / daurSession.todayTargetPages) * 100));

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "bg-[#1E7B58]";
      case "good":
        return "bg-[#38A169]";
      case "low":
        return "bg-[#86EFAC]";
      case "poor":
        return "bg-[#FCA5A5]";
      default:
        return "bg-[#E5E7EB]";
    }
  };

  // Calculate today's overall portion breakdown (Pav, Aadha, Paun, Full)
  const todayPortion = calculatePortionBreakdown(daurSession.todayTargetPages);
  const todayParaInfo = getParaForPage(daurSession.todayStartPage);

  // Compute dynamic start/end pages and portion for each slot
  let slotRunningPage = daurSession.todayStartPage;
  const renderedSlots = (daurSession.planConfig?.dailySlots || []).map((slot) => {
    const sPage = slot.startPage || slotRunningPage;
    const ePage = slot.endPage || Math.min(604, slotRunningPage + slot.targetPages - 1);
    slotRunningPage = ePage + 1;

    const portion = calculatePortionBreakdown(slot.targetPages);
    const pInfo = getParaForPage(sPage);

    return {
      ...slot,
      startPage: sPage,
      endPage: ePage,
      portionLabel: slot.portionLabel || `${portion.portionNameUrdu} (${portion.fractionLabel})`,
      paraName: slot.paraName || `Para ${pInfo.paraNumber} (${pInfo.nameArabic})`,
      portionBadgeColor: portion.badgeColor
    };
  });

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F5F8F7]">
      {/* 1. TOP HEADER: Greeting + Avatar (Profile) + Plan Button + Notification */}
      <header className="flex items-center justify-between">
        <div 
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 cursor-pointer group"
          title="Open Profile & Settings"
        >
          <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
            {auth.name.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] text-[#6B7280] font-medium block leading-none">
              Assalamu Alaikum,
            </span>
            <h1 className="text-base font-bold text-[#111827] mt-0.5 group-hover:text-[#2563EB] transition-colors">
              {auth.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlanSetupOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-[#2563EB] text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-[#EFF6FF] cursor-pointer active:scale-95"
          >
            <span>🎯 Plan</span>
          </button>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] text-[#4B5563] flex items-center justify-center shadow-2xs hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE] cursor-pointer transition-all active:scale-95 relative"
            aria-label="View Notifications & Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#2563EB] absolute top-2 right-2"></span>
          </button>
        </div>
      </header>

      {/* 2 & 3. CLEAN UNIFIED HERO & CURRENT DAUR CARD (Simple, Visual, Tap for popup) */}
      <div 
        onClick={() => setIsDaurDetailOpen(true)}
        className="bg-white rounded-3xl border border-[#BAE6FD] shadow-xs overflow-hidden cursor-pointer group hover:border-[#2563EB]/50 transition-all"
        title="Tap to see Daur milestones & breakdown"
      >
        {/* Top Header: Islamic Verse Banner with Mosque Artwork */}
        <div className="relative overflow-hidden text-[#0F2942] p-5 min-h-[135px] flex flex-col justify-center border-b border-[#BAE6FD]/60">
          {/* HD Background Banner */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/hero_banner.jpg')" }}
          />

          {/* Soft daylight gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8EC5F7]/95 via-[#A8D5F9]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 text-left max-w-[75%] py-0.5 space-y-1.5">
            <p className="font-arabic text-2xl font-bold tracking-wide text-[#0B2545] leading-relaxed drop-shadow-xs">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </p>
            <p className="text-xs text-[#1E3A8A] font-semibold italic leading-normal drop-shadow-xs">
              &ldquo;And say: &lsquo;My Lord, increase me in knowledge.&rsquo;&rdquo;
            </p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#1D4ED8] bg-white/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/80 shadow-2xs">
                <BookOpen className="w-3 h-3 text-[#2563EB]" />
                (Taha 20:114)
              </span>
            </div>
          </div>
        </div>

        {/* Clean, Simple Current Daur Progress Row */}
        <div className="p-4 space-y-3 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-extrabold text-[#0F172A]">
                {daurSession.planConfig?.planName || "Full Quran Daur"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#2563EB]">
                {percentDaur}%
              </span>
              <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                Day {daurSession.currentDay}/{daurSession.totalDays}
              </span>
            </div>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-500"
              style={{ width: `${percentDaur}%` }}
            />
          </div>

          {/* 3 Clean Stat Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-[#F8FAFC] py-2 px-1.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[9px] text-[#64748B] font-bold block leading-none">Completed</span>
              <span className="text-xs font-extrabold text-[#0F172A] mt-1 block">{daurSession.completedParas} Paras</span>
            </div>

            <div className="bg-[#F8FAFC] py-2 px-1.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[9px] text-[#64748B] font-bold block leading-none">Remaining</span>
              <span className="text-xs font-extrabold text-[#0F172A] mt-1 block">
                {Math.max(0, daurSession.totalParas - daurSession.completedParas)} Paras
              </span>
            </div>

            <div className="bg-[#F8FAFC] py-2 px-1.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[9px] text-[#64748B] font-bold block leading-none">Estimated End</span>
              <span className="text-xs font-extrabold text-[#2563EB] mt-1 block leading-tight">{daurSession.estimatedEnd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CLEAN & TACTILE TODAY'S READING CARD (Simple, Clear, Fast Action) */}
      <div className="bg-gradient-to-b from-[#EFF8FF] to-[#E5F2FF] rounded-3xl p-4 border border-[#BAE6FD] shadow-xs space-y-3 relative overflow-hidden">
        {/* Subtle Watermark Mosque Art in background */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <svg width="150" height="90" viewBox="0 0 150 90" fill="#2563EB">
            <path d="M75 10 C65 10 60 25 60 45 L60 90 L90 90 L90 45 C90 25 85 10 75 10 Z" />
            <path d="M35 35 C30 35 25 45 25 60 L25 90 L45 90 L45 60 C45 45 40 35 35 35 Z" />
            <path d="M115 35 C110 35 105 45 105 60 L105 90 L125 90 L125 60 C125 45 120 35 115 35 Z" />
          </svg>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>Today&apos;s Reading</span>
          </div>
          <span className="text-[10px] font-extrabold text-[#1D4ED8] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#BFDBFE] shadow-2xs">
            {daurSession.todayPagesRead}/{daurSession.todayTargetPages} Pages Done ({todayPercent}%)
          </span>
        </div>

        {/* Target & Action Row */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-white shadow-2xs space-y-2.5 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-1.5">
                <span>Page {daurSession.todayStartPage}</span>
                <span className="text-sm font-bold text-[#3B82F6]">➔</span>
                <span>{daurSession.todayEndPage}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-[#2563EB]">
                  {daurSession.todayTargetPages} Pages Daily Target
                </span>
              </div>
            </div>

            {/* Mark Today Button */}
            <button
              onClick={markTodayDone}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                daurSession.isTodayDone
                  ? "bg-[#10B981] text-white hover:bg-[#059669]"
                  : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{daurSession.isTodayDone ? "All Done" : "Mark Today"}</span>
            </button>
          </div>

          {/* Portion terms & Quick Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${todayPortion.badgeColor} shadow-2xs`}>
                {todayPortion.portionNameUrdu} ({todayPortion.portionNameEnglish})
              </span>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white text-[#1E3A8A] border border-[#CBD5E1]">
                Para {todayParaInfo.paraNumber}
              </span>
            </div>

            {/* Quick +/- Stepper */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-[#F1F5F9] rounded-xl p-0.5 border border-[#E2E8F0]">
                <button
                  onClick={() => updateTodayPages(daurSession.todayPagesRead - 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-xs text-[#334155] cursor-pointer shadow-2xs active:scale-90"
                  aria-label="Decrease pages"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-xs font-black text-[#0F172A] px-2">
                  {daurSession.todayPagesRead}
                </span>
                <button
                  onClick={() => updateTodayPages(daurSession.todayPagesRead + 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-xs text-[#334155] cursor-pointer shadow-2xs active:scale-90"
                  aria-label="Increase pages"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Open Quran PDF Button */}
          <button
            onClick={() => {
              setTargetReaderPage(daurSession.todayStartPage);
              setIsQuranReaderOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#172554] hover:to-[#1D4ED8] active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-[#93C5FD]" />
            <span>Open Quran PDF (Read Page {daurSession.todayStartPage} ➔ {daurSession.todayEndPage})</span>
          </button>
        </div>
      </div>

      {/* 5. DAILY TIMINGS / SLOTS BREAKDOWN CHECKLIST */}
      {renderedSlots.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-[#1E3A8A]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="uppercase tracking-wider">Daily Timing Slots &amp; Page Breakdown</span>
            </div>
            <span className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
              Tap to check off ➔
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {renderedSlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => toggleDailySlot(slot.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-2xs relative ${
                  slot.completed
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                    : "bg-white border-[#E5E7EB] text-[#111827] hover:border-[#2563EB]/40 hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox button */}
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all ${
                      slot.completed
                        ? "bg-[#10B981] border-[#10B981] text-white shadow-xs"
                        : "bg-white border-[#CBD5E1]"
                    }`}
                  >
                    {slot.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    {/* Slot Name & Time */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold leading-tight">
                        {slot.name}
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        {slot.timeLabel}
                      </span>
                    </div>

                    {/* Highlighted Page Range & Portion Term (Pav Para, Aadha Para, etc.) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {/* Exact Page Range */}
                      <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                        Pages {slot.startPage} — {slot.endPage} ({slot.targetPages} Pages)
                      </span>

                      {/* Portion Term */}
                      <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                        {slot.portionLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points / Status Pill */}
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                    slot.completed
                      ? "bg-[#10B981] text-white shadow-2xs"
                      : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                  }`}
                >
                  {slot.completed ? "Done ✓" : "6 pts"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. QUICK ACTIONS (4 Square Tiles) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setIsContinueLauncherOpen(true)}
          className="bg-white p-2.5 rounded-2xl border border-[#E5E7EB] hover:border-[#10B981] hover:bg-[#F0FDF4] transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📖
          </div>
          <span className="text-[11px] font-bold text-[#111827] leading-tight">Quran Daur</span>
        </button>

        <button
          onClick={() => setIsPlanSetupOpen(true)}
          className="bg-white p-2.5 rounded-2xl border border-[#E5E7EB] hover:border-[#9333EA] hover:bg-[#FAF5FF] transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            🎯
          </div>
          <span className="text-[11px] font-bold text-[#111827] leading-tight">Daur Plan</span>
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className="bg-white p-2.5 rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📊
          </div>
          <span className="text-[11px] font-bold text-[#111827] leading-tight">Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className="bg-white p-2.5 rounded-2xl border border-[#E5E7EB] hover:border-[#D97706] hover:bg-[#FFFBEB] transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📝
          </div>
          <span className="text-[11px] font-bold text-[#111827] leading-tight">Quran Notes</span>
        </button>
      </div>

      {/* 7. DAUR CALENDAR / HEATMAP GRID */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#111827]">
            Daur Calendar
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563]">
            <ChevronLeft className="w-3.5 h-3.5 text-[#9CA3AF] cursor-pointer" />
            <span>Oct 2026</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] cursor-pointer" />
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[9px] font-semibold text-[#9CA3AF]">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.slice(0, 35).map((item) => (
              <div
                key={item.day}
                title={`${item.dateStr}: ${item.pagesRead} pages (${item.level})`}
                className={`h-5 rounded-md ${getHeatmapColor(item.level)} flex items-center justify-center text-[8px] font-bold text-white/90 transition-transform hover:scale-110 cursor-pointer`}
              >
                {item.day <= 31 ? item.day : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-[9px] text-[#6B7280]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-[#E5E7EB]" />
            <span>Not Done</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-[#FCA5A5]" />
            <span>Poor</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-[#86EFAC]" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-[#38A169]" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-[#1E7B58]" />
            <span>Excellent</span>
          </div>
        </div>
      </div>

      {/* 8. WEAK AREAS WIDGET */}
      <div 
        onClick={() => setActiveTab("notes")}
        className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-2xs flex items-center justify-between hover:border-[#DC2626]/40 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold text-base">
            ⚠️
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">
              Weak Areas &amp; Revision Flagged
            </h4>
            <p className="text-[11px] text-[#6B7280]">
              {weakParas.length} Paras needing review • Tap to see notes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#2563EB]">
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 9. QUICK STATS */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xs font-extrabold text-[#111827]">{daurSession.streakDays} Day</div>
          <span className="text-[10px] text-[#6B7280]">Streak</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xs font-extrabold text-[#111827]">{daurSession.monthlyCompleted}/{daurSession.totalParas}</div>
          <span className="text-[10px] text-[#6B7280]">This Month</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs font-extrabold text-[#111827]">{daurSession.parasPerDay}</div>
          <span className="text-[10px] text-[#6B7280]">Paras/Day</span>
        </div>
      </div>

      {/* Plan Setup / First-Time Popup */}
      <PlanSetupModal
        isOpen={isPlanSetupOpen}
        onClose={() => setIsPlanSetupOpen(false)}
        onSavePlan={applyDaurPlan}
        currentConfig={daurSession.planConfig}
        isFirstTime={!daurSession.planConfig?.isConfigured}
      />

      {/* Daur Milestones & Insights Detail Modal (Opens on Tap) */}
      <DaurDetailModal
        isOpen={isDaurDetailOpen}
        onClose={() => setIsDaurDetailOpen(false)}
        daurSession={daurSession}
        paras={paras}
        onOpenPlanSetup={() => setIsPlanSetupOpen(true)}
      />

      {/* Today's Reading Detailed Progress Modal (Opens on Tap) */}
      <TodayProgressModal
        isOpen={isTodayProgressOpen}
        onClose={() => setIsTodayProgressOpen(false)}
        pagesRead={daurSession.todayPagesRead}
        targetPages={daurSession.todayTargetPages}
        quality={daurSession.todayQuality}
        mistakes={daurSession.todayMistakes}
        onUpdatePages={updateTodayPages}
        onUpdateQuality={updateTodayQuality}
        onIncrementMistakes={incrementMistakes}
        onDecrementMistakes={decrementMistakes}
        onMarkDone={markTodayDone}
        isTodayDone={daurSession.isTodayDone}
      />

      {/* Quran PDF Offline Reader Full Screen Overlay */}
      {isQuranReaderOpen && (
        <QuranPdfReader
          initialPage={targetReaderPage}
          onClose={() => setIsQuranReaderOpen(false)}
        />
      )}

      {/* Continue Reading Launcher Modal */}
      <ContinueReadingLauncherModal
        isOpen={isContinueLauncherOpen}
        onClose={() => setIsContinueLauncherOpen(false)}
        onLaunchReader={(page) => {
          setTargetReaderPage(page);
          setIsQuranReaderOpen(true);
        }}
      />

      {/* Notifications & Reminders Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};
