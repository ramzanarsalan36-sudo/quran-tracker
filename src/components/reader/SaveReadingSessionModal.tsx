"use client";

import React, { useState, useEffect } from "react";
import { X, Check, BookOpen } from "lucide-react";
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
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
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
                Save today&apos;s reading?
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                Record this session to your official Daur progress
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
          {/* Previous vs Session Summary Card */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-3.5 rounded-2xl border border-[#DBEAFE] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="font-light">Previous saved progress</span>
              <span className="font-semibold text-[#1E3A8A]">Page {previousSavedPage}</span>
            </div>
            
            <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#1E3A8A]">You read in this session</span>
              <span className="text-xs font-semibold text-[#2563EB] bg-white px-2.5 py-0.5 rounded-full border border-[#BFDBFE] shadow-2xs">
                Page {fromPage} ➔ {toPage} ({pagesCount} pgs)
              </span>
            </div>
          </div>

          {/* Editable Inputs */}
          <div className="grid grid-cols-3 gap-2">
            {/* From Page */}
            <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1 text-center">
                From Page
              </label>
              <input
                type="number"
                min={1}
                max={604}
                value={fromPage}
                onChange={(e) => handleFromPageChange(parseInt(e.target.value, 10) || 1)}
                className="w-full text-center text-sm font-semibold text-[#0F172A] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* To Page */}
            <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1 text-center">
                To Page
              </label>
              <input
                type="number"
                min={1}
                max={604}
                value={toPage}
                onChange={(e) => handleToPageChange(parseInt(e.target.value, 10) || 1)}
                className="w-full text-center text-sm font-semibold text-[#0F172A] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Juz */}
            <div className="bg-[#F8FAFC] p-2.5 rounded-2xl border border-[#E2E8F0]">
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1 text-center">
                Juz (Para)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={juzNumber}
                onChange={(e) => setJuzNumber(Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 1)))}
                className="w-full text-center text-sm font-semibold text-[#2563EB] bg-white rounded-xl py-1.5 border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1 shrink-0">
          <button
            onClick={() => onSaveProgress(fromPage, toPage, juzNumber)}
            className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save Progress (Page {fromPage} ➔ {toPage})</span>
          </button>

          <button
            onClick={onContinueReading}
            className="w-full py-2.5 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#BFDBFE]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue Reading</span>
          </button>

          <button
            onClick={onCasualReadingExit}
            className="w-full py-2 rounded-2xl bg-transparent hover:bg-slate-100 text-[#64748B] text-xs font-light transition-all cursor-pointer text-center"
          >
            I was just reading — Don&apos;t Save
          </button>
        </div>
      </div>
    </div>
  );
};
