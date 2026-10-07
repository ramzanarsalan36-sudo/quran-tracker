export type AppTab = "daur" | "plan" | "notes" | "calendar" | "profile";

export type ParaQuarter = "pav" | "aadha" | "paun" | "aek"; // Pav (1/4), Aadha (1/2), Paun (3/4), Aek (Full)

export interface ParaProgress {
  paraNumber: number;
  nameArabic: string;
  nameUrdu: string;
  startSurah: string;
  startAyah: number;
  endSurah: string;
  endAyah: number;
  startPage: number;
  endPage: number;
  completedQuarter: "none" | "pav" | "aadha" | "paun" | "aek";
  percentCompleted: number;
  lastRevisedDate?: string;
  isWeakArea?: boolean;
  mistakesCount?: number;
  notes?: string;
}

export type QuranNoteCategory = "hifz" | "tajweed" | "tafseer" | "reflection" | "revision" | "weakness";

export interface QuranNote {
  id: string;
  paraNumber?: number;
  surahNumber?: number;
  surahName?: string;
  ayahNumber?: number | string;
  title: string;
  content: string;
  category: QuranNoteCategory;
  date: string;
  pinned?: boolean;
  mistakeTag?: string;
}

export interface UserAuth {
  isLoggedIn: boolean;
  name: string;
  email: string;
  username: string;
  city: string;
  country: string;
}

export interface DailySlot {
  id: string;
  name: string;
  timeLabel: string;
  targetPages: number;
  completed: boolean;
  startPage?: number;
  endPage?: number;
  portionLabel?: string; // e.g. "پاؤ پارہ (Pav Para • 1/4)"
  paraName?: string;    // e.g. "Para 1 (الم)"
}

export interface DaurPlanConfig {
  planDurationDays: number; // e.g. 30, 15, 10, 60
  planName: string;
  parasPerDay: number;
  pagesPerDay: number;
  breakdownType: "prayers" | "two_slots" | "single_slot" | "custom";
  dailySlots: DailySlot[];
  startingPara: number;
  startingPage: number;
  startDate: string;
  isConfigured: boolean;
}

export interface DaurSession {
  currentDay: number;
  totalDays: number;
  completedParas: number;
  totalParas: number;
  estimatedEnd: string;
  todayStartPage: number;
  todayEndPage: number;
  todayTargetPages: number;
  todayPagesRead: number;
  todayQuality: "Excellent" | "Good" | "Average" | "Poor";
  todayMistakes: number;
  isTodayDone: boolean;
  streakDays: number;
  monthlyCompleted: number;
  parasPerDay: number;
  planConfig: DaurPlanConfig;
}

export interface HeatmapDay {
  day: number;
  level: "none" | "poor" | "low" | "good" | "excellent"; // 0 to 4
  dateStr: string;
  pagesRead: number;
}

export interface ReadingSessionRecord {
  id: string;
  date: string;
  pageFrom: number;
  pageTo: number;
  juz: number;
  currentPage: number;
  timestamp: string;
  status: "completed" | "casual";
}

export interface QuranReaderState {
  currentReadingPosition: number; // Where the user currently is in the PDF (local)
  lastSavedProgressPage: number;  // Confirmed official Daur progress page
  lastSavedJuz: number;
  isOfflineCached: boolean;
  cacheSizeMB?: number;
  readingSessions: ReadingSessionRecord[];
}

