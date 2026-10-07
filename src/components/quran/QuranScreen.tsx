"use client";

import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { SURAH_LIST } from "@/data/islamicData";
import { 
  Search, 
  BookOpen, 
  Check, 
  Plus, 
  AlertTriangle, 
  ChevronRight, 
  ArrowLeft,
  Sparkles, 
  TrendingUp, 
  Clock 
} from "lucide-react";
import { ParaQuarter, QuranNote } from "@/types";
import { QuranNoteModal } from "./QuranNoteModal";
import { QuranPdfReader } from "@/components/reader/QuranPdfReader";

export const QuranScreen: React.FC = () => {
  const { 
    setActiveTab,
    paras, 
    updateParaQuarter, 
    toggleWeakArea,
    quranNotes,
    addQuranNote,
    updateQuranNote,
    daurSession,
    setIsPlanSetupOpen
  } = useIslamicApp();

  const [search, setSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"paras" | "surahs">("paras");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedParaForNote, setSelectedParaForNote] = useState<number | undefined>(undefined);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [readerStartPage, setReaderStartPage] = useState<number>(1);

  // Filter Paras based on search query
  const filteredParas = paras.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.nameUrdu.toLowerCase().includes(q) ||
      p.nameArabic.includes(search) ||
      p.startSurah.toLowerCase().includes(q) ||
      p.endSurah.toLowerCase().includes(q) ||
      String(p.paraNumber) === q
    );
  });

  const filteredSurahs = SURAH_LIST.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(search) ||
      String(s.number) === q
    );
  });

  const completedCount = paras.filter(p => p.completedQuarter === "aek").length;

  const openNoteForPara = (paraNum: number) => {
    setSelectedParaForNote(paraNum);
    setIsNoteModalOpen(true);
  };

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F5F8F7]">
      {/* Header with Top-Left Back Arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("daur")}
            className="w-9 h-9 rounded-2xl bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            aria-label="Back to Daur Dashboard"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#111827] tracking-tight leading-tight">
              Daur Plan &amp; 30 Paras
            </h1>
            <p className="text-[11px] text-[#6B7280]">
              Quarter progress &amp; revision tracker
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPlanSetupOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold hover:bg-[#DBEAFE] cursor-pointer shadow-2xs"
        >
          ⚙️ Change Plan
        </button>
      </div>

      {/* Daur Plan Summary Card with Hero Artwork */}
      <div className="bg-white rounded-3xl border border-[#BAE6FD] shadow-2xs overflow-hidden space-y-0">
        <div className="relative p-4 text-[#0F2942] min-h-[90px] flex flex-col justify-center border-b border-[#BAE6FD]/60">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{ backgroundImage: "url('/images/hero_banner.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#93C5FD]/90 via-[#BFDBFE]/80 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1D4ED8] bg-white/80 px-2 py-0.5 rounded-full border border-white">
                30 Paras Overview
              </span>
              <h2 className="text-base font-extrabold text-[#0B2545] mt-1">
                {daurSession.planConfig?.planName || "Full Quran Daur"}
              </h2>
            </div>
            <span className="text-xs font-extrabold text-[#1D4ED8] bg-white/90 px-3 py-1 rounded-full border border-[#BFDBFE] shadow-2xs">
              {completedCount} / 30 Finished
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-500"
              style={{ width: `${Math.round((completedCount / 30) * 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px]">
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6B7280] font-medium block">Pace Target</span>
              <span className="font-extrabold text-[#111827]">{daurSession.parasPerDay} Para/Day</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6B7280] font-medium block">Target End</span>
              <span className="font-extrabold text-[#111827]">{daurSession.estimatedEnd}</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6B7280] font-medium block">Flagged Weak</span>
              <span className="font-extrabold text-[#DC2626]">
                {paras.filter(p => p.isWeakArea).length} Paras
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Para number, name, or Surah..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#111827] placeholder-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] shadow-2xs"
        />
      </div>

      {/* Sub-tabs: 30 Paras vs Surahs */}
      <div className="flex bg-[#E5E7EB] p-1 rounded-2xl border border-[#D1D5DB]">
        <button
          onClick={() => setActiveSubTab("paras")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "paras"
              ? "bg-[#2563EB] text-white shadow-xs"
              : "text-[#4B5563] hover:text-[#111827]"
          }`}
        >
          30 Paras (Quarter Tracker)
        </button>
        <button
          onClick={() => setActiveSubTab("surahs")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "surahs"
              ? "bg-[#2563EB] text-white shadow-xs"
              : "text-[#4B5563] hover:text-[#111827]"
          }`}
        >
          Surahs (114)
        </button>
      </div>

      {/* 30 Paras List */}
      {activeSubTab === "paras" ? (
        <div className="space-y-3">
          {filteredParas.map((para) => {
            const notesForThisPara = quranNotes.filter(n => n.paraNumber === para.paraNumber);

            return (
              <div
                key={para.paraNumber}
                className={`bg-white rounded-3xl p-4 border transition-all shadow-2xs ${
                  para.isWeakArea
                    ? "border-[#EF4444] bg-[#FEF2F2]/20"
                    : para.completedQuarter === "aek"
                    ? "border-[#10B981]/50 bg-[#F0FDF4]/30"
                    : "border-[#E5E7EB]"
                }`}
              >
                {/* Top Row: Number, Name, Range, Note + Flag Buttons */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                      {para.paraNumber}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                        <span>Para {para.paraNumber}</span>
                        <span className="font-arabic text-sm text-[#2563EB]">{para.nameArabic}</span>
                      </h3>
                      <p className="text-[10px] text-[#6B7280]">
                        {para.nameUrdu} • Pages {para.startPage}–{para.endPage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Read Para in PDF Button */}
                    <button
                      onClick={() => {
                        setReaderStartPage(para.startPage);
                        setIsReaderOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#172554] hover:to-[#1D4ED8] text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <BookOpen className="w-3 h-3 text-[#93C5FD]" />
                      <span>Read</span>
                    </button>

                    {/* Weak Area Flag Toggle */}
                    <button
                      onClick={() => toggleWeakArea(para.paraNumber)}
                      title={para.isWeakArea ? "Flagged as Weak Area" : "Mark as Weak Area"}
                      className={`p-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        para.isWeakArea
                          ? "bg-[#FEF2F2] border-[#EF4444] text-[#DC2626]"
                          : "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] hover:text-[#DC2626]"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {para.isWeakArea ? "Weak" : "Flag"}
                    </button>

                    {/* Note Button */}
                    <button
                      onClick={() => openNoteForPara(para.paraNumber)}
                      className="px-2 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>📝</span>
                      <span>{notesForThisPara.length > 0 ? `${notesForThisPara.length}` : "+ Note"}</span>
                    </button>
                  </div>
                </div>

                {/* Quarter Selection Buttons: Pav, Aadha, Paun, Aek */}
                <div className="bg-[#F9FAFB] p-2 rounded-2xl border border-[#E5E7EB] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#6B7280]">
                    <span>Quarter Breakdown:</span>
                    <span className="text-[10px] font-extrabold text-[#2563EB]">
                      {para.percentCompleted}% Done
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => updateParaQuarter(para.paraNumber, para.completedQuarter === "pav" ? "none" : "pav")}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        para.completedQuarter === "pav" || para.completedQuarter === "aadha" || para.completedQuarter === "paun" || para.completedQuarter === "aek"
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-neutral-50"
                      }`}
                    >
                      <span>پاؤ (1/4)</span>
                    </button>

                    <button
                      onClick={() => updateParaQuarter(para.paraNumber, para.completedQuarter === "aadha" ? "none" : "aadha")}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        para.completedQuarter === "aadha" || para.completedQuarter === "paun" || para.completedQuarter === "aek"
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-neutral-50"
                      }`}
                    >
                      <span>آدھا (1/2)</span>
                    </button>

                    <button
                      onClick={() => updateParaQuarter(para.paraNumber, para.completedQuarter === "paun" ? "none" : "paun")}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        para.completedQuarter === "paun" || para.completedQuarter === "aek"
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-neutral-50"
                      }`}
                    >
                      <span>پون (3/4)</span>
                    </button>

                    <button
                      onClick={() => updateParaQuarter(para.paraNumber, para.completedQuarter === "aek" ? "none" : "aek")}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        para.completedQuarter === "aek"
                          ? "bg-[#10B981] text-white border-[#10B981]"
                          : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-neutral-50"
                      }`}
                    >
                      <span>ایک (Full)</span>
                    </button>
                  </div>
                </div>

                {/* Notes preview list for this Para */}
                {notesForThisPara.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {notesForThisPara.slice(0, 2).map(n => (
                      <div key={n.id} className="text-[10px] text-[#4B5563] bg-[#EFF6FF]/60 px-2.5 py-1 rounded-xl flex items-center justify-between">
                        <span className="truncate font-medium">📝 {n.title}</span>
                        <span className="text-[9px] text-[#2563EB] font-bold shrink-0">{n.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Surahs List */
        <div className="space-y-2">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="bg-white p-3 rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB]/40 transition-all flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  {surah.number}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">
                    {surah.nameEnglish}
                  </h4>
                  <span className="text-[10px] text-[#6B7280]">
                    {surah.totalVerses} verses
                  </span>
                </div>
              </div>
              <span className="font-arabic text-base font-bold text-[#2563EB]">
                {surah.nameArabic}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      <QuranNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedParaForNote(undefined);
        }}
        onSave={addQuranNote}
        onUpdate={updateQuranNote}
        initialParaNumber={selectedParaForNote}
      />

      {/* Offline Quran PDF Reader */}
      {isReaderOpen && (
        <QuranPdfReader
          initialPage={readerStartPage}
          onClose={() => setIsReaderOpen(false)}
        />
      )}
    </div>
  );
};
