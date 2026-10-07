"use client";

import React from "react";
import { IslamicAppProvider, useIslamicApp } from "@/context/IslamicAppContext";
import { AppShell } from "@/components/layout/AppShell";
import { HomeScreen } from "@/components/home/HomeScreen";
import { QuranScreen } from "@/components/quran/QuranScreen";
import { QuranNotesScreen } from "@/components/notes/QuranNotesScreen";
import { CalendarScreen } from "@/components/calendar/CalendarScreen";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";

const MainContent: React.FC = () => {
  const { activeTab, auth } = useIslamicApp();

  if (!auth.isLoggedIn) {
    return <AuthScreen />;
  }

  switch (activeTab) {
    case "daur":
      return <HomeScreen />;
    case "plan":
      return <QuranScreen />;
    case "notes":
      return <QuranNotesScreen />;
    case "calendar":
      return <CalendarScreen />;
    case "profile":
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function Page() {
  return (
    <IslamicAppProvider>
      <AppShell>
        <MainContent />
      </AppShell>
    </IslamicAppProvider>
  );
}
