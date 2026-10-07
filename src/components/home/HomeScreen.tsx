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
  const percentDaur = Math.round((daurSession.completedParas / Math.max(1, daurSession.totalParas)) * 100);
  const todayPercent = Math.min(100, Math.round((daurSession.todayPagesRead / Math.max(1, daurSession.todayTargetPages)) * 100));

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "bg-emerald-800 text-white";
      case "good":
        return "bg-emerald-600 text-white";
      case "low":
        return "bg-emerald-400 text-emerald-950";
      case "poor":
        return "bg-rose-300 text-rose-950";
      default:
        return "bg-slate-200/80 text-slate-500";
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

  const bannerImage = auth.bannerUrl || "/images/hero_banner.jpg";

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F2F7F4]">
      {/* 1. TOP HEADER: Greeting + Avatar (Profile) + Plan Button + Notification */}
      <header className="flex items-center justify-between">
        <div 
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 cursor-pointer group"
          title="Open Profile & Settings"
        >
          {auth.avatarUrl ? (
            auth.avatarUrl.startsWith("http") || auth.avatarUrl.startsWith("data:") ? (
              <img 
                src={auth.avatarUrl} 
                alt={auth.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600 shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold flex items-center justify-center text-lg border-2 border-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                {auth.avatarUrl}
              </div>
            )
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-white font-bold flex items-center justify-center border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
              {auth.name ? auth.name.charAt(0).toUpperCase() : "H"}
            </div>
          )}
          <div>
            <span className="text-[11px] text-emerald-800/70 font-semibold block leading-none">
              Assalamu Alaikum,
            </span>
            <h1 className="text-base font-extrabold text-emerald-950 mt-0.5 group-hover:text-emerald-700 transition-colors font-heading">
              {auth.name || "Hafiz"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlanSetupOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-emerald-50 cursor-pointer active:scale-95"
          >
            <span>🎯 Plan</span>
          </button>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-2xs hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer transition-all active:scale-95 relative"
            aria-label="View Notifications & Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2"></span>
          </button>
        </div>
      </header>

      {/* 2 & 3. CLEAN UNIFIED HERO & CURRENT DAUR CARD */}
      <div 
        onClick={() => setIsDaurDetailOpen(true)}
        className="bg-white rounded-3xl border border-emerald-200 shadow-xs overflow-hidden cursor-pointer group hover:border-emerald-400 transition-all"
        title="Tap to see Daur milestones & breakdown"
      >
        {/* Top Header: Islamic Verse Banner with Mosque Artwork */}
        <div className="relative overflow-hidden text-[#0F2942] p-5 min-h-[140px] flex flex-col justify-center border-b border-emerald-200/70">
          {/* HD Background Banner */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${bannerImage}')` }}
          />

          {/* Soft Islamic daylight/emerald gradient overlay for clear text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#042B20]/95 via-[#063B2C]/85 to-transparent pointer-events-none" />

          <div className="relative z-10 text-left max-w-[80%] py-0.5 space-y-1.5">
            <p className="font-arabic text-2xl font-bold tracking-wide text-amber-300 leading-relaxed drop-shadow-md">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </p>
            <p className="text-xs text-emerald-100 font-semibold italic leading-normal drop-shadow-xs">
              &ldquo;And say: &lsquo;My Lord, increase me in knowledge.&rsquo;&rdquo;
            </p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-amber-300 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-2xs">
                <BookOpen className="w-3 h-3 text-amber-400" />
                (Surah Taha 20:114)
              </span>
            </div>
          </div>
        </div>

        {/* Clean, Simple Current Daur Progress Row */}
        <div className="p-4 space-y-3 bg-gradient-to-b from-white to-[#F9FCFA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-extrabold text-emerald-950 font-heading">
                {daurSession.planConfig?.planName || "30 Days Complete Daur"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-700">
                {percentDaur}%
              </span>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Day {daurSession.currentDay}/{daurSession.totalDays}
              </span>
            </div>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-emerald-100/70 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 transition-all duration-500"
              style={{ width: `${Math.max(percentDaur, percentDaur === 0 ? 0 : 3)}%` }}
            />
          </div>

          {/* 3 Clean Stat Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-[#F4F8F5] py-2 px-1.5 rounded-xl border border-emerald-100">
              <span className="text-[9px] text-emerald-800/70 font-bold block leading-none">Completed</span>
              <span className="text-xs font-black text-emerald-950 mt-1 block">{daurSession.completedParas} Paras</span>
            </div>

            <div className="bg-[#F4F8F5] py-2 px-1.5 rounded-xl border border-emerald-100">
              <span className="text-[9px] text-emerald-800/70 font-bold block leading-none">Remaining</span>
              <span className="text-xs font-black text-emerald-950 mt-1 block">
                {Math.max(0, daurSession.totalParas - daurSession.completedParas)} Paras
              </span>
            </div>

            <div className="bg-[#F4F8F5] py-2 px-1.5 rounded-xl border border-emerald-100">
              <span className="text-[9px] text-emerald-800/70 font-bold block leading-none">Estimated End</span>
              <span className="text-xs font-extrabold text-emerald-700 mt-1 block leading-tight">{daurSession.estimatedEnd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CLEAN & TACTILE TODAY'S READING CARD */}
      <div className="bg-gradient-to-b from-[#EBF7F2] to-[#E2F2EB] rounded-3xl p-4 border border-emerald-200 shadow-xs space-y-3 relative overflow-hidden">
        {/* Subtle Watermark Mosque Art in background */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg width="150" height="90" viewBox="0 0 150 90" fill="#047857">
            <path d="M75 10 C65 10 60 25 60 45 L60 90 L90 90 L90 45 C90 25 85 10 75 10 Z" />
            <path d="M35 35 C30 35 25 45 25 60 L25 90 L45 90 L45 60 C45 45 40 35 35 35 Z" />
            <path d="M115 35 C110 35 105 45 105 60 L105 90 L125 90 L125 60 C125 45 120 35 115 35 Z" />
          </svg>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Today&apos;s Reading</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-800 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            {daurSession.todayPagesRead}/{daurSession.todayTargetPages} Pages Done ({todayPercent}%)
          </span>
        </div>

        {/* Target & Action Row */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-white shadow-2xs space-y-2.5 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black text-emerald-950 tracking-tight flex items-center gap-1.5 font-heading">
                <span>Page {daurSession.todayStartPage}</span>
                <span className="text-sm font-bold text-emerald-600">➔</span>
                <span>{daurSession.todayEndPage}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-emerald-700">
                  {daurSession.todayTargetPages} Pages Daily Target
                </span>
              </div>
            </div>

            {/* Mark Today Button */}
            <button
              onClick={markTodayDone}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                daurSession.isTodayDone
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500"
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{daurSession.isTodayDone ? "All Done ✓" : "Mark Today"}</span>
            </button>
          </div>

          {/* Portion terms & Quick Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${todayPortion.badgeColor} shadow-2xs`}>
                {todayPortion.portionNameUrdu} ({todayPortion.portionNameEnglish})
              </span>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white text-emerald-900 border border-emerald-200">
                Para {todayParaInfo.paraNumber}
              </span>
            </div>

            {/* Quick +/- Stepper */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-emerald-50/70 rounded-xl p-0.5 border border-emerald-200">
                <button
                  onClick={() => updateTodayPages(daurSession.todayPagesRead - 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-xs text-emerald-950 cursor-pointer shadow-2xs active:scale-90"
                  aria-label="Decrease pages"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-xs font-black text-emerald-950 px-2">
                  {daurSession.todayPagesRead}
                </span>
                <button
                  onClick={() => updateTodayPages(daurSession.todayPagesRead + 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-xs text-emerald-950 cursor-pointer shadow-2xs active:scale-90"
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
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Open Quran PDF (Read Page {daurSession.todayStartPage} ➔ {daurSession.todayEndPage})</span>
          </button>
        </div>
      </div>

      {/* 5. DAILY TIMINGS / SLOTS BREAKDOWN CHECKLIST */}
      {renderedSlots.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-[#DDE7E2] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-950">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase tracking-wider">Daily Timing Slots &amp; Page Breakdown</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">
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
                    ? "bg-emerald-50/90 border-emerald-300 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-900 hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox button */}
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all ${
                      slot.completed
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {slot.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    {/* Slot Name & Time */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold leading-tight text-emerald-950">
                        {slot.name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {slot.timeLabel}
                      </span>
                    </div>

                    {/* Highlighted Page Range & Portion Term (Pav Para, Aadha Para, etc.) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {/* Exact Page Range */}
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Pages {slot.startPage} — {slot.endPage} ({slot.targetPages} Pages)
                      </span>

                      {/* Portion Term */}
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {slot.portionLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points / Status Pill */}
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                    slot.completed
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
          className="bg-white p-2.5 rounded-2xl border border-[#DDE7E2] hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📖
          </div>
          <span className="text-[11px] font-bold text-emerald-950 leading-tight">Quran Daur</span>
        </button>

        <button
          onClick={() => setIsPlanSetupOpen(true)}
          className="bg-white p-2.5 rounded-2xl border border-[#DDE7E2] hover:border-amber-400 hover:bg-amber-50/50 transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            🎯
          </div>
          <span className="text-[11px] font-bold text-emerald-950 leading-tight">Daur Plan</span>
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className="bg-white p-2.5 rounded-2xl border border-[#DDE7E2] hover:border-teal-400 hover:bg-teal-50/50 transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📊
          </div>
          <span className="text-[11px] font-bold text-emerald-950 leading-tight">Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className="bg-white p-2.5 rounded-2xl border border-[#DDE7E2] hover:border-amber-400 hover:bg-amber-50/50 transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">
            📝
          </div>
          <span className="text-[11px] font-bold text-emerald-950 leading-tight">Quran Notes</span>
        </button>
      </div>

      {/* 7. DAUR CALENDAR / HEATMAP GRID */}
      <div className="bg-white rounded-3xl p-4 border border-[#DDE7E2] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-emerald-950 font-heading">
            Daur Habit Calendar
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
            <span>Active Cycle</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[9px] font-semibold text-slate-400">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.slice(0, 35).map((item) => (
              <div
                key={item.day}
                title={`${item.dateStr}: ${item.pagesRead} pages (${item.level})`}
                className={`h-5 rounded-md ${getHeatmapColor(item.level)} flex items-center justify-center text-[8px] font-bold transition-transform hover:scale-110 cursor-pointer`}
              >
                {item.day <= 31 ? item.day : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-slate-200" />
            <span>0 Pages</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-rose-300" />
            <span>Poor</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-400" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-600" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-800" />
            <span>Excellent</span>
          </div>
        </div>
      </div>

      {/* 8. WEAK AREAS WIDGET */}
      <div 
        onClick={() => setActiveTab("notes")}
        className="bg-white rounded-3xl p-4 border border-[#DDE7E2] shadow-2xs flex items-center justify-between hover:border-rose-300 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">
            ⚠️
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Weak Areas &amp; Revision Flagged
            </h4>
            <p className="text-[11px] text-emerald-800/70 font-medium">
              {weakParas.length} Paras flagged • Tap to see notes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 9. QUICK STATS */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xs font-black text-emerald-950">{daurSession.streakDays} Day</div>
          <span className="text-[10px] text-emerald-800/70 font-medium">Streak</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xs font-black text-emerald-950">{daurSession.completedParas}/{daurSession.totalParas}</div>
          <span className="text-[10px] text-emerald-800/70 font-medium">Paras</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#DDE7E2] text-center shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs font-black text-emerald-950">{daurSession.parasPerDay}</div>
          <span className="text-[10px] text-emerald-800/70 font-medium">Paras/Day</span>
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

      {/* Daur Milestones & Insights Detail Modal */}
      <DaurDetailModal
        isOpen={isDaurDetailOpen}
        onClose={() => setIsDaurDetailOpen(false)}
        daurSession={daurSession}
        paras={paras}
        onOpenPlanSetup={() => setIsPlanSetupOpen(true)}
      />

      {/* Today's Reading Detailed Progress Modal */}
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

