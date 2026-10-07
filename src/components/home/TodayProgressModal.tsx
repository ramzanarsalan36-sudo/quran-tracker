"use client";

import React from "react";
import { X, Check, Minus, Plus, AlertCircle, Sparkles } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E5E7EB] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <h2 className="text-base font-extrabold text-[#111827]">
              Today&apos;s Reading Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steppers */}
        <div className="space-y-3">
          {/* Pages Read */}
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#111827] block">Pages Read Today</span>
              <span className="text-[11px] text-[#6B7280]">Daily Target: {targetPages} Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdatePages(pagesRead - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-bold text-[#334155] cursor-pointer active:scale-90"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-black text-[#0F172A] w-10 text-center">
                {pagesRead}
              </span>
              <button
                onClick={() => onUpdatePages(pagesRead + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-bold text-[#334155] cursor-pointer active:scale-90"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quality Picker */}
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-xs font-bold text-[#111827] block">Recitation Quality</span>
            <div className="grid grid-cols-2 gap-1.5">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateQuality(q)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    quality === q
                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                      : "bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Mistakes Counter */}
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#111827] block">Mistakes / Hesitations</span>
              <span className="text-[11px] text-[#DC2626] font-semibold">Flag for revision</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDecrementMistakes}
                className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-bold text-[#334155] cursor-pointer active:scale-90"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-black text-[#DC2626] w-8 text-center">
                {mistakes}
              </span>
              <button
                onClick={onIncrementMistakes}
                className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-xs font-bold text-[#334155] cursor-pointer active:scale-90"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Complete button */}
        <button
          onClick={() => {
            onMarkDone();
            onClose();
          }}
          className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            isTodayDone
              ? "bg-[#10B981] hover:bg-[#059669] text-white"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{isTodayDone ? "Save Reading & Keep Marked" : "Mark Today's Quota Complete"}</span>
        </button>
      </div>
    </div>
  );
};
