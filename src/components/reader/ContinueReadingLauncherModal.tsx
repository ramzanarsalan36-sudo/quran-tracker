"use client";

import React, { useState, useEffect } from "react";
import { X, BookOpen, ArrowRight, CheckCircle2, History } from "lucide-react";
import { 
  getCurrentReadingPosition, 
  getLastSavedProgressPage, 
  getLastSavedJuz,
  isQuranPdfCached 
} from "@/lib/quranPdfCache";
import { getParaForPage } from "@/lib/quranPortionUtils";

interface ContinueReadingLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchReader: (targetPage: number) => void;
}

export const ContinueReadingLauncherModal: React.FC<ContinueReadingLauncherModalProps> = ({
  isOpen,
  onClose,
  onLaunchReader
}) => {
  const [currentPositionPage, setCurrentPositionPage] = useState<number>(1);
  const [lastSavedPage, setLastSavedPage] = useState<number>(1);
  const [lastSavedJuz, setLastSavedJuz] = useState<number>(1);
  const [customPage, setCustomPage] = useState<string>("");
  const [isCached, setIsCached] = useState<boolean>(true);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const curr = getCurrentReadingPosition();
      const saved = getLastSavedProgressPage();
      const juz = getLastSavedJuz();
      setCurrentPositionPage(curr);
      setLastSavedPage(saved);
      setLastSavedJuz(juz);
      setCustomPage(String(curr || saved || 1));
      isQuranPdfCached().then(setIsCached);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetResumePage = currentPositionPage || lastSavedPage || 1;
  const currentPara = getParaForPage(targetResumePage);

  const handleLaunchResume = () => {
    onLaunchReader(targetResumePage);
    onClose();
  };

  const handleLaunchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 604) {
      onLaunchReader(parsed);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[90vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200 text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm shadow-2xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Quran Reader
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                Offline PDF Reader &amp; Progress Tracker
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
          {/* Offline Badge */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[10px] font-medium text-[#065F46]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Quran available offline ✓</span>
            </div>
            <span className="opacity-75 font-light">Cache Storage Active</span>
          </div>

          {/* Continue Reading Primary Card */}
          <div className="bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] p-4 rounded-2xl border border-[#BFDBFE] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1E3A8A] flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Continue Reading</span>
              </span>
              <span className="text-[10px] font-medium text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                Juz {currentPara.paraNumber}
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Page {targetResumePage}
              </div>
              <p className="text-[11px] font-light text-[#475569] mt-0.5">
                Last saved official progress: <span className="font-medium text-[#1E3A8A]">Page {lastSavedPage}</span> (Juz {lastSavedJuz})
              </p>
            </div>

            <button
              onClick={handleLaunchResume}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue from Page {targetResumePage}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Start from another page */}
          {!isCustomMode ? (
            <button
              onClick={() => setIsCustomMode(true)}
              className="w-full py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#2563EB] text-xs font-medium transition-all border border-[#E2E8F0] cursor-pointer"
            >
              Start from another page
            </button>
          ) : (
            <form onSubmit={handleLaunchCustom} className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2.5">
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider">
                Enter Target Page (1 - 604):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={customPage}
                  onChange={(e) => setCustomPage(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#CBD5E1] text-xs font-medium text-center focus:outline-none focus:border-[#2563EB]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer shrink-0 active:scale-95"
                >
                  Open
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
