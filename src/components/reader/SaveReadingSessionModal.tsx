"use client";

import React, { useState, useEffect } from "react";
import { X, Check, BookOpen, BookmarkCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { getParaForPage } from "@/lib/quranPortionUtils";

interface SaveReadingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousSavedPage: number;
  currentReachedPage: number;
  onSaveProgress: (fromPage: number, toPage: number, juz: number) => void;
  onCasualReadingExit: () => void;
  onContinueReading: () => void;
}

export const SaveReadingSessionModal: React.FC<SaveReadingSessionModalProps> = ({
  isOpen,
  onClose,
  previousSavedPage,
  currentReachedPage,
  onSaveProgress,
  onCasualReadingExit,
  onContinueReading
}) => {
  const [fromPage, setFromPage] = useState<number>(previousSavedPage || 1);
  const [toPage, setToPage] = useState<number>(currentReachedPage || previousSavedPage || 1);
  const [juzNumber, setJuzNumber] = useState<number>(1);

  // Sync default smart values on open
  useEffect(() => {
    if (isOpen) {
      const initialFrom = previousSavedPage || 1;
      const initialTo = Math.max(initialFrom, currentReachedPage || initialFrom);
      setFromPage(initialFrom);
      setToPage(initialTo);
      const paraInfo = getParaForPage(initialTo);
      setJuzNumber(paraInfo.paraNumber);
    }
  }, [isOpen, previousSavedPage, currentReachedPage]);

  // Update juz when toPage changes
  const handleToPageChange = (val: number) => {
    const clamped = Math.max(1, Math.min(604, val));
    setToPage(clamped);
    const pInfo = getParaForPage(clamped);
    setJuzNumber(pInfo.paraNumber);
  };

  const handleFromPageChange = (val: number) => {
    const clamped = Math.max(1, Math.min(604, val));
    setFromPage(clamped);
  };

  if (!isOpen) return null;

  const pagesCount = Math.max(0, toPage - fromPage + 1);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E5E7EB] space-y-4 text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-lg shadow-2xs border border-[#BFDBFE]">
              📖
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827] tracking-tight leading-snug">
                Save today&apos;s reading?
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Record this session to your official Daur progress
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

        {/* Previous vs Session Summary Card */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-3.5 rounded-2xl border border-[#DBEAFE] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="font-semibold">Previous saved progress</span>
            <span className="font-extrabold text-[#1E3A8A]">Page {previousSavedPage}</span>
          </div>
          
          <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#1E3A8A]">You read in this session</span>
            <span className="text-xs font-black text-[#2563EB] bg-white px-2.5 py-0.5 rounded-full border border-[#BFDBFE] shadow-2xs">
              Page {fromPage} ➔ {toPage} ({pagesCount} pgs)
            </span>
          </div>
        </div>

        {/* Editable Inputs for user fine-tuning */}
        <div className="grid grid-cols-3 gap-2">
          {/* From Page */}
          <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              From Page
            </label>
            <input
              type="number"
              min={1}
              max={604}
              value={fromPage}
              onChange={(e) => handleFromPageChange(parseInt(e.target.value, 10) || 1)}
              className="w-full text-center text-sm font-black text-[#0F172A] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* To Page */}
          <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              To Page
            </label>
            <input
              type="number"
              min={1}
              max={604}
              value={toPage}
              onChange={(e) => handleToPageChange(parseInt(e.target.value, 10) || 1)}
              className="w-full text-center text-sm font-black text-[#0F172A] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Juz (Auto / Editable) */}
          <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              Juz (Para)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={juzNumber}
              onChange={(e) => setJuzNumber(Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 1)))}
              className="w-full text-center text-sm font-black text-[#2563EB] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Action Buttons with clear distinction */}
        <div className="space-y-2 pt-1">
          {/* 1. Save Progress */}
          <button
            onClick={() => onSaveProgress(fromPage, toPage, juzNumber)}
            className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save Progress (Page {fromPage} ➔ {toPage})</span>
          </button>

          {/* 2. Continue Reading */}
          <button
            onClick={onContinueReading}
            className="w-full py-2.5 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#BFDBFE]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue Reading</span>
          </button>

          {/* 3. Don't Save (Casual reading) */}
          <button
            onClick={onCasualReadingExit}
            className="w-full py-2 rounded-2xl bg-transparent hover:bg-neutral-100 text-[#64748B] text-xs font-semibold transition-all cursor-pointer text-center"
          >
            I was just reading — Don&apos;t Save
          </button>
        </div>
      </div>
    </div>
  );
};
