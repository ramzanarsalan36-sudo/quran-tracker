"use client";

import React, { useState, useEffect } from "react";
import { QuranNote, QuranNoteCategory } from "@/types";
import { X, Pin, BookOpen } from "lucide-react";
import { SURAH_LIST } from "@/data/islamicData";

interface QuranNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<QuranNote, "id" | "date">) => void;
  onUpdate?: (id: string, note: Partial<QuranNote>) => void;
  editingNote?: QuranNote | null;
  initialParaNumber?: number;
}

const CATEGORIES: { id: QuranNoteCategory; label: string; icon: string; color: string; bg: string; border: string }[] = [
  { id: "reflection", label: "Tadabbur (Reflection)", icon: "✨", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "tafseer", label: "Tafseer & Meaning", icon: "📖", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { id: "hifz", label: "Hifz & Mutashabihat", icon: "🎯", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { id: "tajweed", label: "Tajweed Rule", icon: "🎙️", color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  { id: "revision", label: "Daur Revision Goal", icon: "🔁", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
];

export const QuranNoteModal: React.FC<QuranNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingNote,
  initialParaNumber
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<QuranNoteCategory>("reflection");
  const [paraNumber, setParaNumber] = useState<number | undefined>(initialParaNumber);
  const [surahName, setSurahName] = useState("");
  const [ayahNumber, setAyahNumber] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategory(editingNote.category);
      setParaNumber(editingNote.paraNumber);
      setSurahName(editingNote.surahName || "");
      setAyahNumber(editingNote.ayahNumber ? String(editingNote.ayahNumber) : "");
      setPinned(!!editingNote.pinned);
    } else {
      setTitle("");
      setContent("");
      setCategory("reflection");
      setParaNumber(initialParaNumber || undefined);
      setSurahName("");
      setAyahNumber("");
      setPinned(false);
    }
  }, [editingNote, initialParaNumber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote && onUpdate) {
      onUpdate(editingNote.id, {
        title: title.trim(),
        content: content.trim(),
        category,
        paraNumber: paraNumber ? Number(paraNumber) : undefined,
        surahName: surahName.trim() || undefined,
        ayahNumber: ayahNumber.trim() || undefined,
        pinned
      });
    } else {
      onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        paraNumber: paraNumber ? Number(paraNumber) : undefined,
        surahName: surahName.trim() || undefined,
        ayahNumber: ayahNumber.trim() || undefined,
        pinned
      });
    }
    onClose();
  };

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
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm shadow-2xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">
                {editingNote ? "Edit Quran Note" : "New Quran Note"}
              </h3>
              <p className="text-[11px] font-light text-[#64748B]">
                Save reflections, Hifz pointers, Tajweed notes &amp; reminders
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3.5 pr-0.5 flex-1">
          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all text-left cursor-pointer ${
                    category === cat.id
                      ? `${cat.bg} ${cat.color} ${cat.border} ring-1 ring-blue-500/30 font-semibold shadow-2xs`
                      : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ayat-ul-Kursi Tafseer key lesson"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-normal text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Reference Meta: Para, Surah, Ayah */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
                Para (1–30)
              </label>
              <select
                value={paraNumber || ""}
                onChange={(e) => setParaNumber(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-2 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-normal text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">None</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Para {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
                Surah Name
              </label>
              <input
                type="text"
                list="surah-suggestions"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="e.g. Al-Baqarah"
                className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-normal text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
              />
              <datalist id="surah-suggestions">
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.nameEnglish} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
                Ayah #
              </label>
              <input
                type="text"
                value={ayahNumber}
                onChange={(e) => setAyahNumber(e.target.value)}
                placeholder="e.g. 255"
                className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-normal text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">
              Note &amp; Reflection *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your personal understanding, Tajweed reminders, or Hifz checkpoint details here..."
              className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-normal text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white resize-none"
            />
          </div>

          {/* Pin to top toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Pin className={`w-4 h-4 ${pinned ? "text-blue-600 fill-blue-600" : "text-[#64748B]"}`} />
              <span className="text-xs font-medium text-[#0F172A]">Pin note to top</span>
            </div>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                pinned ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                  pinned ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Sticky Actions Footer */}
          <div className="flex items-center gap-2.5 pt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              {editingNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
