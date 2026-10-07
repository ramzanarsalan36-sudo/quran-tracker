"use client";

import React, { useState } from "react";
import { DaurPlanConfig, DailySlot } from "@/types";
import { 
  X, 
  Check, 
  Sparkles, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Sun, 
  Moon, 
  Zap, 
  Target,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { calculatePortionBreakdown, getParaForPage } from "@/lib/quranPortionUtils";

interface PlanSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (config: DaurPlanConfig) => void;
  currentConfig?: DaurPlanConfig;
  isFirstTime?: boolean;
}

const PRESET_PLANS = [
  {
    days: 30,
    name: "30 Days Complete Daur",
    badge: "Most Popular 🌟",
    parasPerDay: 1,
    pagesPerDay: 20,
    portionText: "1 Full Para / Day (ایک پارہ)",
    desc: "20 pages daily • Classic 1-month Ramadan schedule"
  },
  {
    days: 15,
    name: "15 Days Intensive Daur",
    badge: "Intensive ⚡",
    parasPerDay: 2,
    pagesPerDay: 40,
    portionText: "2 Full Paras / Day (دو پارے)",
    desc: "40 pages daily • High retention Hifz revision"
  },
  {
    days: 10,
    name: "10 Days Speed Daur",
    badge: "Speed 🚀",
    parasPerDay: 3,
    pagesPerDay: 60,
    portionText: "3 Full Paras / Day (تین پارے)",
    desc: "60 pages daily • Rapid exam / Taraweeh preparation"
  },
  {
    days: 60,
    name: "60 Days Steady Pace",
    badge: "Relaxed 🌿",
    parasPerDay: 0.5,
    pagesPerDay: 10,
    portionText: "Aadha Para / Day (آدھا پارہ)",
    desc: "10 pages daily • Light sustainable habit"
  }
];

export const PlanSetupModal: React.FC<PlanSetupModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
  currentConfig,
  isFirstTime = false
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(currentConfig?.planDurationDays || 30);
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customDays, setCustomDays] = useState<number>(20);
  const [breakdownType, setBreakdownType] = useState<"prayers" | "two_slots" | "single_slot">("prayers");
  const [startingPara, setStartingPara] = useState<number>(currentConfig?.startingPara || 1);

  if (!isOpen) return null;

  const effectiveDays = isCustomDuration ? customDays : selectedDuration;
  const totalPages = 604;
  const calculatedPagesPerDay = Math.ceil(totalPages / Math.max(1, effectiveDays));
  const calculatedParasPerDay = Number((30 / effectiveDays).toFixed(1));
  const overallPortion = calculatePortionBreakdown(calculatedPagesPerDay);

  const startPageOverall = (startingPara - 1) * 20 + 1;

  // Generate Slots based on breakdown type with accurate page ranges and portion labels
  const generateSlots = (): DailySlot[] => {
    let rawSlots: { id: string; name: string; timeLabel: string; pages: number }[] = [];

    if (breakdownType === "prayers") {
      const base = Math.floor(calculatedPagesPerDay / 5);
      const remainder = calculatedPagesPerDay % 5;
      const counts = [
        base + (remainder > 0 ? 1 : 0),
        base + (remainder > 1 ? 1 : 0),
        base + (remainder > 2 ? 1 : 0),
        base + (remainder > 3 ? 1 : 0),
        base
      ];
      rawSlots = [
        { id: "slot-1", name: "After Fajr", timeLabel: "05:30 AM", pages: counts[0] },
        { id: "slot-2", name: "After Dhuhr", timeLabel: "01:15 PM", pages: counts[1] },
        { id: "slot-3", name: "After Asr", timeLabel: "04:45 PM", pages: counts[2] },
        { id: "slot-4", name: "After Maghrib", timeLabel: "07:00 PM", pages: counts[3] },
        { id: "slot-5", name: "After Isha", timeLabel: "08:45 PM", pages: counts[4] },
      ];
    } else if (breakdownType === "two_slots") {
      const half1 = Math.ceil(calculatedPagesPerDay / 2);
      const half2 = calculatedPagesPerDay - half1;
      rawSlots = [
        { id: "slot-1", name: "Morning Session (Fajr / Ishraq)", timeLabel: "06:00 AM", pages: half1 },
        { id: "slot-2", name: "Night Session (Isha / Tahajjud)", timeLabel: "09:30 PM", pages: half2 },
      ];
    } else {
      rawSlots = [
        { id: "slot-1", name: "Dedicated Daily Session", timeLabel: "Flexible / Fajr", pages: calculatedPagesPerDay },
      ];
    }

    let runningPage = startPageOverall;
    return rawSlots.map((raw) => {
      const sPage = runningPage;
      const ePage = Math.min(604, runningPage + raw.pages - 1);
      runningPage = ePage + 1;

      const pInfo = getParaForPage(sPage);
      const portion = calculatePortionBreakdown(raw.pages);

      return {
        id: raw.id,
        name: raw.name,
        timeLabel: raw.timeLabel,
        targetPages: raw.pages,
        completed: false,
        startPage: sPage,
        endPage: ePage,
        portionLabel: `${portion.portionNameUrdu} (${portion.fractionLabel})`,
        paraName: `Para ${pInfo.paraNumber} (${pInfo.nameArabic})`
      };
    });
  };

  const handleSave = () => {
    const today = new Date();
    const endDate = new Date(today.getTime() + effectiveDays * 24 * 60 * 60 * 1000);
    const endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const startStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const selectedPreset = PRESET_PLANS.find(p => p.days === effectiveDays);
    const planName = isCustomDuration 
      ? `${effectiveDays} Days Custom Daur (${calculatedPagesPerDay} pgs/day)`
      : selectedPreset?.name || `${effectiveDays} Days Daur`;

    const config: DaurPlanConfig = {
      planDurationDays: effectiveDays,
      planName,
      parasPerDay: calculatedParasPerDay,
      pagesPerDay: calculatedPagesPerDay,
      breakdownType,
      dailySlots: generateSlots(),
      startingPara,
      startingPage: startPageOverall,
      startDate: startStr,
      isConfigured: true
    };

    onSavePlan(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[90vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center text-base shadow-xs shrink-0">
              🎯
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">
                {isFirstTime ? "Choose Your Daur Plan" : "Customize Daur Plan"}
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                Select completion timeframe &amp; daily portion breakdown
              </p>
            </div>
          </div>

          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] cursor-pointer active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto space-y-4 pr-0.5 flex-1">

        {/* Quran Rehal 3D Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] border border-[#BFDBFE] p-3 flex items-center gap-3 shadow-2xs">
          <img 
            src="/images/quran_rehal.jpg" 
            alt="Holy Quran on Rehal"
            className="w-16 h-16 rounded-xl object-cover shadow-xs border border-white shrink-0"
          />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#93C5FD]">
              Hifz &amp; Daur Routine
            </span>
            <p className="text-xs font-bold text-[#1E3A8A] mt-1 leading-snug">
              &ldquo;Establish a consistent daily portion for strong retention.&rdquo;
            </p>
          </div>
        </div>

        {/* STEP 1: Choose Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <span>1. How many days to complete?</span>
            </label>
            <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              {calculatedPagesPerDay} Pgs/Day • {overallPortion.portionNameUrdu}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_PLANS.map((plan) => {
              const isSelected = !isCustomDuration && selectedDuration === plan.days;
              return (
                <button
                  type="button"
                  key={plan.days}
                  onClick={() => {
                    setSelectedDuration(plan.days);
                    setIsCustomDuration(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs"
                      : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200">
                      {plan.badge}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#111827]">{plan.name}</h4>
                  <div className="text-[10px] font-bold text-emerald-700 mt-0.5">{plan.portionText}</div>
                  <p className="text-[9px] text-[#6B7280] mt-0.5">{plan.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Custom Days Option */}
          <div 
            onClick={() => setIsCustomDuration(true)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isCustomDuration
                ? "bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/20"
                : "bg-[#F9FAFB] border-[#E5E7EB]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111827] block">
                  🎯 Custom Target Days
                </span>
                <span className="text-[10px] text-[#6B7280]">
                  Enter any custom duration
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={365}
                value={customDays}
                onChange={(e) => {
                  setCustomDays(Number(e.target.value));
                  setIsCustomDuration(true);
                }}
                className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#111827] text-center focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            {isCustomDuration && (
              <p className="text-[10px] text-[#2563EB] font-semibold mt-1.5">
                {customDays} days = {calculatedPagesPerDay} pages/day ({overallPortion.portionNameUrdu} • {overallPortion.fractionLabel})
              </p>
            )}
          </div>
        </div>

        {/* STEP 2: Choose Daily Timing / Slot Breakdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
            2. Divide Daily Reading Timings
          </label>

          <div className="space-y-1.5">
            {/* Split by 5 Prayers */}
            <button
              type="button"
              onClick={() => setBreakdownType("prayers")}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                breakdownType === "prayers"
                  ? "bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#10B981]/20 shadow-xs"
                  : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold text-sm">
                  🕌
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">
                    After 5 Daily Prayers (Recommended)
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">
                    ~{Math.ceil(calculatedPagesPerDay / 5)} pages after each Salah (Fajr, Dhuhr, Asr, Maghrib, Isha)
                  </p>
                </div>
              </div>
              {breakdownType === "prayers" && (
                <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Split into 2 Slots */}
            <button
              type="button"
              onClick={() => setBreakdownType("two_slots")}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                breakdownType === "two_slots"
                  ? "bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs"
                  : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm">
                  🌅
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">
                    2 Daily Slots (Morning &amp; Night)
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">
                    {Math.ceil(calculatedPagesPerDay / 2)} pages after Fajr + {Math.floor(calculatedPagesPerDay / 2)} pages after Isha
                  </p>
                </div>
              </div>
              {breakdownType === "two_slots" && (
                <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Single Slot */}
            <button
              type="button"
              onClick={() => setBreakdownType("single_slot")}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                breakdownType === "single_slot"
                  ? "bg-[#FAF5FF] border-[#9333EA] ring-2 ring-[#9333EA]/20 shadow-xs"
                  : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center font-bold text-sm">
                  ⏱️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">
                    Single Dedicated Session
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">
                    All {calculatedPagesPerDay} pages in one focus session (e.g. Fajr/Tahajjud)
                  </p>
                </div>
              </div>
              {breakdownType === "single_slot" && (
                <div className="w-5 h-5 rounded-full bg-[#9333EA] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* STEP 3: Starting Para */}
        <div className="bg-[#F9FAFB] p-3 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-[#111827] block">
              Starting From
            </label>
            <span className="text-[10px] text-[#6B7280]">
              Beginning page: Page {startPageOverall}
            </span>
          </div>

          <select
            value={startingPara}
            onChange={(e) => setStartingPara(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#111827] focus:outline-none focus:border-[#2563EB]"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                Para {p}
              </option>
            ))}
          </select>
        </div>

        </div>

        {/* Save & Activate Button Footer */}
        <div className="pt-2 shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>{isFirstTime ? "Start My Daur Journey" : "Apply & Update Plan"}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
