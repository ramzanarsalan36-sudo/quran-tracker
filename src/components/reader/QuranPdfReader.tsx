"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck,
  Search,
  SlidersHorizontal,
  Moon,
  Sun,
  AlertCircle
} from "lucide-react";
import { 
  isQuranPdfCached, 
  cacheQuranPdf, 
  getQuranPdfUrl, 
  getCurrentReadingPosition, 
  setCurrentReadingPosition, 
  getLastSavedProgressPage, 
  setLastSavedProgressPage,
  getLastSavedJuz,
  QURAN_PDF_PATH
} from "@/lib/quranPdfCache";
import { getParaForPage } from "@/lib/quranPortionUtils";
import { SaveReadingSessionModal } from "./SaveReadingSessionModal";
import { useIslamicApp } from "@/context/IslamicAppContext";

interface QuranPdfReaderProps {
  onClose: () => void;
  initialPage?: number;
}

export const QuranPdfReader: React.FC<QuranPdfReaderProps> = ({
  onClose,
  initialPage
}) => {
  const { showToast, auth, daurSession, setDaurSession, paras, updateParaQuarter } = useIslamicApp();

  // Reading state
  const [currentPage, setCurrentPage] = useState<number>(() => {
    return initialPage || getCurrentReadingPosition() || getLastSavedProgressPage() || 1;
  });
  const [startSessionPage, setStartSessionPage] = useState<number>(() => {
    return getLastSavedProgressPage() || 1;
  });

  // Offline cache status
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheProgress, setCacheProgress] = useState<number>(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>(QURAN_PDF_PATH);

  // View settings
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isJumpInputOpen, setIsJumpInputOpen] = useState<boolean>(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>(String(currentPage));

  // Initialize and check offline caching
  useEffect(() => {
    let isMounted = true;

    async function initCache() {
      const cached = await isQuranPdfCached();
      if (isMounted) {
        setIsCached(cached);
      }

      if (!cached) {
        if (isMounted) setIsCaching(true);
        const success = await cacheQuranPdf((p) => {
          if (isMounted) setCacheProgress(p);
        });
        if (isMounted) {
          setIsCached(success);
          setIsCaching(false);
          if (success) {
            showToast("Quran available offline ✓");
          }
        }
      }

      const blobUrl = await getQuranPdfUrl();
      if (isMounted) {
        setPdfBlobUrl(blobUrl);
      }
    }

    initCache();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update local current reading position on page change
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(604, newPage));
    setCurrentPage(clamped);
    setCurrentReadingPosition(clamped);
    setJumpPageInput(String(clamped));
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed)) {
      handlePageChange(parsed);
      setIsJumpInputOpen(false);
    }
  };

  // Exit trigger: check if user read new pages
  const handleAttemptExit = () => {
    if (currentPage !== startSessionPage) {
      setIsSaveModalOpen(true);
    } else {
      onClose();
    }
  };

  // Handle Confirmed Save Progress
  const handleConfirmSaveProgress = (fromPage: number, toPage: number, juz: number) => {
    // 1. Update official saved Daur progress locally
    setLastSavedProgressPage(toPage, juz);
    
    // 2. Also keep current reading position
    setCurrentReadingPosition(toPage);

    // 3. Update active Daur session target and pages
    const pagesReadInSession = Math.max(1, toPage - fromPage + 1);
    const updatedTodayPages = daurSession.todayPagesRead + pagesReadInSession;
    
    // Check if Para is completed
    const paraInfo = getParaForPage(toPage);
    if (toPage >= paraInfo.endPage) {
      updateParaQuarter(paraInfo.paraNumber, "aek");
    }

    setDaurSession({
      ...daurSession,
      todayPagesRead: updatedTodayPages,
      todayEndPage: Math.max(daurSession.todayEndPage, toPage),
      isTodayDone: updatedTodayPages >= daurSession.todayTargetPages
    });

    setIsSaveModalOpen(false);
    showToast(`✓ Progress saved: Page ${fromPage} ➔ ${toPage}`);
    onClose();
  };

  // Handle Casual reading (Don't Save to official progress)
  const handleCasualReadingExit = () => {
    // Current position stays updated locally, but official Daur progress remains untouched
    setCurrentReadingPosition(currentPage);
    setIsSaveModalOpen(false);
    onClose();
  };

  const currentPara = getParaForPage(currentPage);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? "bg-[#0B1120] text-white" : "bg-[#F3F4F6] text-[#0F172A]"}`}>
      {/* 1. TOP APP BAR */}
      <header className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
        isDarkMode ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-[#E5E7EB] shadow-2xs"
      }`}>
        {/* Left: Back / Exit with Confirmation */}
        <button
          onClick={handleAttemptExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1E3A8A] font-bold text-xs cursor-pointer transition-all active:scale-95"
          aria-label="Exit Reader"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Exit / Save</span>
        </button>

        {/* Center: Page & Juz Badge */}
        <div 
          onClick={() => setIsJumpInputOpen(true)}
          className="flex flex-col items-center cursor-pointer group"
          title="Tap to jump to page"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#2563EB]">
              Page {currentPage} of 604
            </span>
            <span className="text-[10px] text-[#64748B] group-hover:text-[#2563EB]">
              (Juz {currentPara.paraNumber}) ▾
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8] font-arabic">
            {currentPara.nameArabic} • {currentPara.nameUrdu}
          </span>
        </div>

        {/* Right: Offline Indicator & View Controls */}
        <div className="flex items-center gap-1.5">
          {/* Offline Pill */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            <span>{isCached ? "Offline Ready" : "Downloading..."}</span>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] cursor-pointer"
            aria-label="Toggle Night Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#FDE047]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. JUMP TO PAGE DRAWER / POPUP */}
      {isJumpInputOpen && (
        <div className="bg-white border-b border-[#E5E7EB] p-3 flex items-center justify-between gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
          <span className="text-[#64748B] shrink-0">Jump to Page (1 - 604):</span>
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2 flex-1 max-w-xs">
            <input
              type="number"
              min={1}
              max={604}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-center text-xs font-bold focus:outline-none focus:border-[#2563EB]"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setIsJumpInputOpen(false)}
              className="px-2 py-1.5 rounded-xl bg-neutral-100 text-[#64748B] text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* 3. MAIN PDF VIEWER CANVAS / EMBED CONTAINER */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 relative select-none">
        {/* PDF Frame / Render */}
        <div className={`w-full max-w-2xl h-full rounded-2xl overflow-hidden shadow-lg border relative flex flex-col items-center justify-center ${
          isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#CBD5E1]"
        }`}>
          <iframe
            src={`${pdfBlobUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-0 rounded-2xl"
            title={`Holy Quran - Page ${currentPage}`}
          />

          {/* Quick Page Info Overlay Watermark */}
          <div className="absolute top-2 left-3 pointer-events-none opacity-40 text-[10px] font-mono">
            Juz {currentPara.paraNumber} • Page {currentPage}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM FLOATING CONTROLS */}
      <footer className={`px-4 py-3 border-t flex items-center justify-between shrink-0 ${
        isDarkMode ? "bg-[#0F172A] border-[#1E293B]" : "bg-white border-[#E5E7EB] shadow-lg"
      }`}>
        {/* Previous Page Button (In Quran Right-to-Left or standard order) */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1E3A8A] font-bold text-xs border border-[#CBD5E1] disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Prev Page</span>
        </button>

        {/* Center: Save Reading Session Quick Action */}
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Save Progress ({startSessionPage} ➔ {currentPage})</span>
        </button>

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= 604}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1E3A8A] font-bold text-xs border border-[#CBD5E1] disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-2xs"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </footer>

      {/* 5. CONFIRMATION SAVE SESSION MODAL */}
      <SaveReadingSessionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        previousSavedPage={startSessionPage}
        currentReachedPage={currentPage}
        onSaveProgress={handleConfirmSaveProgress}
        onCasualReadingExit={handleCasualReadingExit}
        onContinueReading={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
};
