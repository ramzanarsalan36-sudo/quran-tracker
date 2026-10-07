"use client";

import React from "react";
import { X, Check, Minus, Plus, Sparkles, BookOpen } from "lucide-react";

interface TodayProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagesRead: number;
  targetPages: number;
  quality: "Excellent" | "Good" | "Average" | "Poor";
  mistakes: number;
  onUpdatePages: (pages: number) => void;
  onUpdateQuality: (q: "Excellent" | "Good" | "Average" | "Poor") => void;
  onIncrementMistakes: () => void;
  onDecrementMistakes: () => void;
  onMarkDone: () => void;
  isTodayDone: boolean;
}

export const TodayProgressModal: React.FC<TodayProgressModalProps> = ({
  isOpen,
  onClose,
  pagesRead,
  targetPages,
  quality,
  mistakes,
  onUpdatePages,
  onUpdateQuality,
  onIncrementMistakes,
  onDecrementMistakes,
  onMarkDone,
  isTodayDone
}) => {
  if (!isOpen) return null;

  const qualities: ("Excellent" | "Good" | "Average" | "Poor")[] = ["Excellent", "Good", "Average", "Poor"];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[90vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Today&apos;s Reading Progress
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                Review quality, pages recited &amp; flags
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-3.5 pr-0.5 flex-1">
          {/* Pages Read Stepper */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#0F172A] block">Pages Recited Today</span>
              <span className="text-[11px] font-light text-[#64748B]">Daily Target: {targetPages} Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdatePages(pagesRead - 1)}
                className="w-8 h-8 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-semibold text-[#334155] cursor-pointer active:scale-90 shadow-2xs"
                aria-label="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-bold text-[#0F172A] w-9 text-center font-mono">
                {pagesRead}
              </span>
              <button
                onClick={() => onUpdatePages(pagesRead + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-semibold text-[#334155] cursor-pointer active:scale-90 shadow-2xs"
                aria-label="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Recitation Quality */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-xs font-medium text-[#0F172A] block">Recitation Quality</span>
            <div className="grid grid-cols-2 gap-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateQuality(q)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    quality === q
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold"
                      : "bg-white text-[#475569] border-[#E2E8F0] hover:bg-emerald-50/50"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Mistakes Counter */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#0F172A] block">Mistakes / Hesitations</span>
              <span className="text-[11px] font-light text-rose-500">Auto-logged for revision</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDecrementMistakes}
                className="w-8 h-8 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-semibold text-[#334155] cursor-pointer active:scale-90 shadow-2xs"
                aria-label="Decrease mistakes"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-bold text-rose-600 w-8 text-center font-mono">
                {mistakes}
              </span>
              <button
                onClick={onIncrementMistakes}
                className="w-8 h-8 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-semibold text-[#334155] cursor-pointer active:scale-90 shadow-2xs"
                aria-label="Increase mistakes"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 shrink-0">
          <button
            onClick={() => {
              onMarkDone();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{isTodayDone ? "Save & Keep Marked Done" : "Confirm & Mark Today Complete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
