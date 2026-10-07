"use client";

import React, { useState, useEffect } from "react";
import { QuranNote, QuranNoteCategory } from "@/types";
import { X, Sparkles, Pin, BookOpen, Tag, Check, Calendar } from "lucide-react";
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
  { id: "reflection", label: "Tadabbur (Reflection)", icon: "✨", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: "tafseer", label: "Tafseer & Meaning", icon: "📖", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { id: "hifz", label: "Hifz & Mutashabihat", icon: "🎯", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { id: "tajweed", label: "Tajweed Rule", icon: "🎙️", color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#D8E8E2] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAF3F0] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#236B58]/10 text-[#236B58] flex items-center justify-center font-bold text-sm">
              📝
            </div>
            <div>
              <h3 className="text-base font-bold text-[#122620]">
                {editingNote ? "Edit Quran Note" : "New Quran Note"}
              </h3>
              <p className="text-[11px] text-[#647B73]">
                Save reflections, Hifz pointers, Tajweed notes &amp; reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F7F5] text-[#647B73] hover:text-[#122620] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#647B73] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all text-left cursor-pointer ${
                    category === cat.id
                      ? `${cat.bg} ${cat.color} ${cat.border} ring-1 ring-[#236B58]/30 font-bold shadow-2xs`
                      : "bg-[#F8FAF9] text-[#647B73] border-[#E0ECE8] hover:bg-neutral-100"
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
            <label className="block text-[11px] font-bold text-[#647B73] uppercase tracking-wider mb-1">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ayat-ul-Kursi Tafseer key lesson"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8] text-xs font-medium text-[#122620] placeholder-[#647B73]/60 focus:outline-none focus:border-[#236B58] focus:bg-white"
            />
          </div>

          {/* Reference Meta: Para, Surah, Ayah */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#647B73] uppercase tracking-wider mb-1">
                Para (1–30)
              </label>
              <select
                value={paraNumber || ""}
                onChange={(e) => setParaNumber(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8] text-xs text-[#122620] focus:outline-none focus:border-[#236B58]"
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
              <label className="block text-[10px] font-bold text-[#647B73] uppercase tracking-wider mb-1">
                Surah Name
              </label>
              <input
                type="text"
                list="surah-suggestions"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="e.g. Al-Baqarah"
                className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8] text-xs text-[#122620] placeholder-[#647B73]/60 focus:outline-none focus:border-[#236B58]"
              />
              <datalist id="surah-suggestions">
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.nameEnglish} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#647B73] uppercase tracking-wider mb-1">
                Ayah #
              </label>
              <input
                type="text"
                value={ayahNumber}
                onChange={(e) => setAyahNumber(e.target.value)}
                placeholder="e.g. 255"
                className="w-full px-2.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8] text-xs text-[#122620] placeholder-[#647B73]/60 focus:outline-none focus:border-[#236B58]"
              />
            </div>
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-[11px] font-bold text-[#647B73] uppercase tracking-wider mb-1">
              Note &amp; Reflection *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your personal understanding, Tajweed reminders, or Hifz checkpoint details here..."
              className="w-full p-3 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8] text-xs font-medium text-[#122620] placeholder-[#647B73]/60 focus:outline-none focus:border-[#236B58] focus:bg-white resize-none"
            />
          </div>

          {/* Pin to top toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E0ECE8]">
            <div className="flex items-center gap-2">
              <Pin className={`w-4 h-4 ${pinned ? "text-[#236B58] fill-[#236B58]" : "text-[#647B73]"}`} />
              <span className="text-xs font-semibold text-[#122620]">Pin note to top</span>
            </div>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                pinned ? "bg-[#236B58]" : "bg-neutral-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                  pinned ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#F3F7F5] text-[#647B73] text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#236B58] text-white text-xs font-bold hover:bg-[#1c5546] shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {editingNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
