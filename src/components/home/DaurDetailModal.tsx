"use client";

import React from "react";
import { DaurSession, ParaProgress } from "@/types";
import { X, CheckCircle2, Flame, Clock, Calendar, TrendingUp } from "lucide-react";

interface DaurDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  daurSession: DaurSession;
  paras: ParaProgress[];
  onOpenPlanSetup: () => void;
}

export const DaurDetailModal: React.FC<DaurDetailModalProps> = ({
  isOpen,
  onClose,
  daurSession,
  paras,
  onOpenPlanSetup
}) => {
  if (!isOpen) return null;

  const percentDaur = Math.round((daurSession.completedParas / daurSession.totalParas) * 100);
  const remainingParas = Math.max(0, daurSession.totalParas - daurSession.completedParas);
  const weakCount = paras.filter(p => p.isWeakArea).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E5E7EB] space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-lg font-bold border border-[#BFDBFE]">
              📊
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#111827]">
                Daur Insights &amp; Milestones
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                {daurSession.planConfig?.planName || "Full Quran Daur"}
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

        {/* Hero Progress Gauge */}
        <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] p-4 rounded-2xl border border-[#BFDBFE] text-center space-y-2">
          <div className="text-3xl font-black text-[#1E3A8A]">
            {percentDaur}% <span className="text-sm font-bold text-[#2563EB]">Completed</span>
          </div>
          <p className="text-xs text-[#1E3A8A] font-semibold">
            {daurSession.completedParas} of {daurSession.totalParas} Paras Done • {remainingParas} Paras Left
          </p>
          <div className="w-full h-3 rounded-full bg-white overflow-hidden shadow-inner p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-500"
              style={{ width: `${percentDaur}%` }}
            />
          </div>
        </div>

        {/* Milestone Checkpoints */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
            Milestone Roadmap
          </h3>
          <div className="space-y-1.5">
            {[
              { label: "1/4 Quran (Para 7)", target: 7, isDone: daurSession.completedParas >= 7 },
              { label: "Halfway Mark 🌓 (Para 15)", target: 15, isDone: daurSession.completedParas >= 15 },
              { label: "3/4 Quran (Para 22)", target: 22, isDone: daurSession.completedParas >= 22 },
              { label: "Full Khatam 👑 (Para 30)", target: 30, isDone: daurSession.completedParas >= 30 }
            ].map((m, idx) => (
              <div 
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  m.isDone 
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]" 
                    : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${m.isDone ? "text-[#10B981]" : "text-[#CBD5E1]"}`} />
                  <span>{m.label}</span>
                </div>
                <span className="text-[11px]">
                  {m.isDone ? "Achieved 🎉" : `${Math.max(0, m.target - daurSession.completedParas)} paras left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pace & Consistency Stats */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
            <Flame className="w-5 h-5 text-[#EF4444] mx-auto mb-1" />
            <span className="text-[10px] text-[#6B7280] font-medium block">Current Streak</span>
            <span className="text-sm font-black text-[#111827]">{daurSession.streakDays} Days</span>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
            <Calendar className="w-5 h-5 text-[#2563EB] mx-auto mb-1" />
            <span className="text-[10px] text-[#6B7280] font-medium block">Target Khatam</span>
            <span className="text-xs font-black text-[#111827]">{daurSession.estimatedEnd}</span>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
            <Clock className="w-5 h-5 text-[#9333EA] mx-auto mb-1" />
            <span className="text-[10px] text-[#6B7280] font-medium block">Daily Target</span>
            <span className="text-xs font-black text-[#111827]">{daurSession.parasPerDay} Para/Day</span>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
            <TrendingUp className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
            <span className="text-[10px] text-[#6B7280] font-medium block">Flagged Weak</span>
            <span className="text-xs font-black text-[#DC2626]">{weakCount} Paras</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onOpenPlanSetup();
          }}
          className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Change Daur Schedule &amp; Target</span>
        </button>
      </div>
    </div>
  );
};
