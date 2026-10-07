"use client";

import React from "react";
import { DaurSession, ParaProgress } from "@/types";
import { X, CheckCircle2, Flame, Clock, Calendar, TrendingUp, BarChart2 } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t sm:border border-[#E2E8F0] max-h-[90vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm shadow-2xs">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Daur Insights &amp; Milestones
              </h2>
              <p className="text-[11px] font-light text-[#64748B]">
                {daurSession.planConfig?.planName || "Full Quran Daur"}
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
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] p-4 rounded-2xl border border-[#BAE6FD] text-center space-y-2">
            <div className="text-2xl font-bold text-[#0369A1]">
              {percentDaur}% <span className="text-xs font-normal text-[#0284C7]">Completed</span>
            </div>
            <p className="text-xs text-[#0C4A6E] font-medium">
              {daurSession.completedParas} of {daurSession.totalParas} Paras Done • {remainingParas} Paras Left
            </p>
            <div className="w-full h-2.5 rounded-full bg-white/80 overflow-hidden p-0.5 border border-sky-200">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981] transition-all duration-500"
                style={{ width: `${percentDaur}%` }}
              />
            </div>
          </div>

          {/* Milestone Checkpoints */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-[#475569] uppercase tracking-wider">
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
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
                    m.isDone 
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]" 
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${m.isDone ? "text-[#10B981]" : "text-[#CBD5E1]"}`} />
                    <span>{m.label}</span>
                  </div>
                  <span className="text-[11px] font-light">
                    {m.isDone ? "Achieved ✓" : `${Math.max(0, m.target - daurSession.completedParas)} paras left`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pace & Consistency Stats */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <Flame className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#64748B] font-light block">Current Streak</span>
              <span className="text-sm font-semibold text-[#0F172A]">{daurSession.streakDays} Days</span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <Calendar className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#64748B] font-light block">Target Khatam</span>
              <span className="text-xs font-semibold text-[#0F172A]">{daurSession.estimatedEnd}</span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <Clock className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#64748B] font-light block">Daily Target</span>
              <span className="text-xs font-semibold text-[#0F172A]">{daurSession.parasPerDay} Para/Day</span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[10px] text-[#64748B] font-light block">Flagged Weak</span>
              <span className="text-xs font-semibold text-rose-600">{weakCount} Paras</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenPlanSetup();
            }}
            className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Change Daur Schedule &amp; Target</span>
          </button>
        </div>
      </div>
    </div>
  );
};
