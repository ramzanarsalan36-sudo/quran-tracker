"use client";

import React from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { BookOpen } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const { setActiveTab } = useIslamicApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center text-white bg-[#0A1F33]">
      <div className="w-16 h-16 rounded-3xl bg-[#2563EB] flex items-center justify-center text-3xl shadow-xl mb-4">
        📖
      </div>
      <h1 className="text-2xl font-bold">Daur</h1>
      <p className="text-sm text-[#93C5FD] mt-1">Hifz &amp; Daur Tracker</p>
      <button
        onClick={() => setActiveTab("daur")}
        className="mt-8 px-6 py-3 rounded-2xl bg-[#2563EB] text-white text-sm font-bold shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
};
