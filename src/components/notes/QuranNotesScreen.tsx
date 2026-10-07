"use client";

import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { 
  Search, 
  Plus, 
  Pin, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  BookOpen, 
  Filter, 
  Tag, 
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { QuranNote, QuranNoteCategory } from "@/types";
import { QuranNoteModal } from "@/components/quran/QuranNoteModal";

export const QuranNotesScreen: React.FC = () => {
  const { 
    setActiveTab,
    quranNotes, 
    addQuranNote, 
    updateQuranNote, 
    deleteQuranNote, 
    togglePinNote,
    paras,
    toggleWeakArea
  } = useIslamicApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedParaFilter, setSelectedParaFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<QuranNote | null>(null);
  const [targetParaForNote, setTargetParaForNote] = useState<number | undefined>(undefined);

  const weakParas = paras.filter(p => p.isWeakArea);

  const filteredNotes = quranNotes
    .filter((note) => {
      if (selectedCategory !== "all" && note.category !== selectedCategory) return false;
      if (selectedParaFilter !== "all" && String(note.paraNumber) !== selectedParaFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        (note.surahName && note.surahName.toLowerCase().includes(q)) ||
        (note.paraNumber && String(note.paraNumber) === q) ||
        (note.ayahNumber && String(note.ayahNumber).includes(q))
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const getCategoryBadge = (category: QuranNoteCategory) => {
    switch (category) {
      case "hifz":
        return { label: "Hifz & Mutashabihat", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", icon: "🎯" };
      case "tajweed":
        return { label: "Tajweed Rule", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", icon: "🎙️" };
      case "tafseer":
        return { label: "Tafseer & Meaning", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: "📖" };
      case "reflection":
        return { label: "Tadabbur", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "✨" };
      case "revision":
        return { label: "Daur Revision", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: "🔁" };
      case "weakness":
        return { label: "Weak Area", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "⚠️" };
      default:
        return { label: "Note", bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "📝" };
    }
  };

  const openNewNote = (paraNum?: number) => {
    setEditingNote(null);
    setTargetParaForNote(paraNum);
    setIsModalOpen(true);
  };

  const openEditNote = (note: QuranNote) => {
    setEditingNote(note);
    setTargetParaForNote(note.paraNumber);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 pt-5 pb-28 space-y-4 bg-[#F2F7F4]">
      {/* Top Header with Back Arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("daur")}
            className="w-9 h-9 rounded-2xl bg-white border border-[#DDE7E2] text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            aria-label="Back to Daur Dashboard"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-emerald-950 tracking-tight flex items-center gap-2 leading-tight font-heading">
              <span>Quran Notes</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {quranNotes.length}
              </span>
            </h1>
            <p className="text-[11px] text-emerald-800/70 font-medium">
              Mutashabihat, Tajweed &amp; Daur logs
            </p>
          </div>
        </div>

        <button
          onClick={() => openNewNote()}
          className="px-3 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-emerald-700 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Weak Areas Quick Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#DDE7E2] shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-rose-600 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Flagged Weak Paras ({weakParas.length})</span>
          </span>
          <span className="text-[10px] text-emerald-800/60 font-medium">Tap to toggle flag</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {paras.map((p) => (
            <button
              key={p.paraNumber}
              onClick={() => toggleWeakArea(p.paraNumber)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                p.isWeakArea
                  ? "bg-rose-50 border-rose-400 text-rose-600 shadow-2xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
              }`}
            >
              Para {p.paraNumber} {p.isWeakArea ? "⚠️" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic, Surah, Para, Ayah or keyword..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#111827] placeholder-[#6B7280]/70 focus:outline-none focus:border-[#2563EB] shadow-2xs"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: "All Notes" },
          { id: "hifz", label: "🎯 Hifz & Mutashabihat" },
          { id: "tajweed", label: "🎙️ Tajweed" },
          { id: "tafseer", label: "📖 Tafseer" },
          { id: "reflection", label: "✨ Tadabbur" },
          { id: "revision", label: "🔁 Revision Goals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === tab.id
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-2xs font-bold"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F3F4F6] font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto text-xl">
            📝
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">No notes found</h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Start recording your Hifz checkpoints, Tajweed corrections, and Ayah reflections.
            </p>
          </div>
          <button
            onClick={() => openNewNote()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-xs hover:bg-[#1D4ED8] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => {
            const badge = getCategoryBadge(note.category);
            return (
              <div
                key={note.id}
                className={`bg-white rounded-3xl p-4 border transition-all shadow-2xs relative ${
                  note.pinned ? "border-[#2563EB]/40 bg-[#FAFDFB]" : "border-[#E5E7EB]"
                }`}
              >
                {/* Header of Note */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border} flex items-center gap-1`}>
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>

                    {note.paraNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        Para {note.paraNumber}
                      </span>
                    )}

                    {note.surahName && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-[#111827]">
                        {note.surahName} {note.ayahNumber ? `:${note.ayahNumber}` : ""}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      title={note.pinned ? "Unpin note" : "Pin note to top"}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        note.pinned
                          ? "bg-amber-100 text-amber-700"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-amber-600 text-amber-600" : ""}`} />
                    </button>

                    <button
                      onClick={() => openEditNote(note)}
                      title="Edit note"
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-emerald-950 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteQuranNote(note.id)}
                      title="Delete note"
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-emerald-950 leading-snug mb-1.5 font-heading">
                  {note.title}
                </h3>

                {/* Content */}
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>

                {/* Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Logged: {note.date}</span>
                  {note.pinned && (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5 fill-amber-600 text-amber-600" /> Pinned
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      <QuranNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
          setTargetParaForNote(undefined);
        }}
        onSave={addQuranNote}
        onUpdate={updateQuranNote}
        editingNote={editingNote}
        initialParaNumber={targetParaForNote}
      />
    </div>
  );
};
