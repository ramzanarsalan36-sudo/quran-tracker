"use client";

import React, { useState, useEffect } from "react";
import { X, BookOpen, ArrowRight, Sparkles, CheckCircle2, Clock, History } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E5E7EB] space-y-4 text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-lg shadow-2xs border border-[#BFDBFE]">
              📖
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#111827]">
                Quran Reader
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Offline PDF Reader &amp; Progress Tracker
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

        {/* Offline Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[10px] font-bold text-[#065F46]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Quran available offline ✓</span>
          </div>
          <span className="opacity-75">PDF Storage Active</span>
        </div>

        {/* Continue Reading Primary Card */}
        <div className="bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] p-4 rounded-2xl border border-[#BFDBFE] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#1E3A8A] flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-[#2563EB]" />
              Continue Reading
            </span>
            <span className="text-[10px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#BFDBFE]">
              Juz {currentPara.paraNumber}
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-[#0F172A] tracking-tight">
              Page {targetResumePage}
            </div>
            <p className="text-[11px] text-[#475569] font-medium mt-0.5">
              Last saved official progress: <strong>Page {lastSavedPage}</strong> (Juz {lastSavedJuz})
            </p>
          </div>

          <button
            onClick={handleLaunchResume}
            className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Continue from Page {targetResumePage}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Start from another page */}
        {!isCustomMode ? (
          <button
            onClick={() => setIsCustomMode(true)}
            className="w-full py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#2563EB] text-xs font-bold transition-all border border-[#E2E8F0] cursor-pointer"
          >
            Start from another page
          </button>
        ) : (
          <form onSubmit={handleLaunchCustom} className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Enter Target Page (1 - 604):
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={604}
                value={customPage}
                onChange={(e) => setCustomPage(e.target.value)}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-[#CBD5E1] text-xs font-bold text-center focus:outline-none focus:border-[#2563EB]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                Open
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
