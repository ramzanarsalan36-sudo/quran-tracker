import { DaurSession, HeatmapDay, ParaProgress, QuranNote } from "@/types";

export const INITIAL_PARAS: ParaProgress[] = [
  { paraNumber: 1, nameArabic: "الم", nameUrdu: "الم (Alif Lam Meem)", startSurah: "Al-Fatiha", startAyah: 1, endSurah: "Al-Baqarah", endAyah: 141, startPage: 1, endPage: 21, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 2, nameArabic: "سَيَقُولُ", nameUrdu: "سیقول (Sayaqool)", startSurah: "Al-Baqarah", startAyah: 142, endSurah: "Al-Baqarah", endAyah: 252, startPage: 22, endPage: 41, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 3, nameArabic: "تِلْكَ الرُّسُلُ", nameUrdu: "تلک الرسل (Tilkar Rusul)", startSurah: "Al-Baqarah", startAyah: 253, endSurah: "Aal-e-Imran", endAyah: 92, startPage: 42, endPage: 61, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 4, nameArabic: "لَنْ تَنَالُوا", nameUrdu: "لن تنالوا (Lan Tanaloo)", startSurah: "Aal-e-Imran", startAyah: 93, endSurah: "An-Nisa", endAyah: 23, startPage: 62, endPage: 81, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 5, nameArabic: "وَالْمُحْصَنَاتُ", nameUrdu: "والمحصنت (Wal Muhsanat)", startSurah: "An-Nisa", startAyah: 24, endSurah: "An-Nisa", endAyah: 147, startPage: 82, endPage: 101, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 6, nameArabic: "لَا يُحِبُّ اللَّهُ", nameUrdu: "لا یحب اللہ (La Yuhibbullah)", startSurah: "An-Nisa", startAyah: 148, endSurah: "Al-Ma'idah", endAyah: 81, startPage: 102, endPage: 121, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 7, nameArabic: "وَإِذَا سَمِعُوا", nameUrdu: "واذا سمعوا (Wa Iza Sami'oo)", startSurah: "Al-Ma'idah", startAyah: 82, endSurah: "Al-An'am", endAyah: 110, startPage: 122, endPage: 141, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 8, nameArabic: "وَلَوْ أَنَّنَا", nameUrdu: "ولو اننا (Wa Lau Annana)", startSurah: "Al-An'am", startAyah: 111, endSurah: "Al-A'raf", endAyah: 87, startPage: 142, endPage: 161, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 9, nameArabic: "قَالَ الْمَلَأُ", nameUrdu: "قال الملا (Qalal Mala'o)", startSurah: "Al-A'raf", startAyah: 88, endSurah: "Al-Anfal", endAyah: 40, startPage: 162, endPage: 181, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 10, nameArabic: "وَاعْلَمُوا", nameUrdu: "واعلموا (Wa'lamoo)", startSurah: "Al-Anfal", startAyah: 41, endSurah: "At-Tawbah", endAyah: 92, startPage: 182, endPage: 201, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 11, nameArabic: "يَعْتَذِرُونَ", nameUrdu: "یعتذرون (Ya'taziroon)", startSurah: "At-Tawbah", startAyah: 93, endSurah: "Hud", endAyah: 5, startPage: 202, endPage: 221, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 12, nameArabic: "وَمَا مِنْ دَابَّةٍ", nameUrdu: "وما من دابۃ (Wa Mamin Dabbatin)", startSurah: "Hud", startAyah: 6, endSurah: "Yusuf", endAyah: 52, startPage: 222, endPage: 241, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 13, nameArabic: "وَمَا أُبَرِّئُ", nameUrdu: "وما ابری (Wa Ma Ubarri'u)", startSurah: "Yusuf", startAyah: 53, endSurah: "Ibrahim", endAyah: 52, startPage: 242, endPage: 261, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 14, nameArabic: "رُبَمَا", nameUrdu: "ربما (Rubama)", startSurah: "Al-Hijr", startAyah: 1, endSurah: "An-Nahl", endAyah: 128, startPage: 262, endPage: 281, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 15, nameArabic: "سُبْحَانَ الَّذِي", nameUrdu: "سبحن الذی (Subhanallazi)", startSurah: "Al-Isra", startAyah: 1, endSurah: "Al-Kahf", endAyah: 74, startPage: 282, endPage: 301, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 16, nameArabic: "قَالَ أَلَمْ", nameUrdu: "قال الم (Qala Alam)", startSurah: "Al-Kahf", startAyah: 75, endSurah: "Ta-Ha", endAyah: 135, startPage: 302, endPage: 321, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 17, nameArabic: "اقْتَرَبَ", nameUrdu: "اقترب (Iqtaraba)", startSurah: "Al-Anbiya", startAyah: 1, endSurah: "Al-Hajj", endAyah: 78, startPage: 322, endPage: 341, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 18, nameArabic: "قَدْ أَفْلَحَ", nameUrdu: "قد افلح (Qad Aflaha)", startSurah: "Al-Mu'minoon", startAyah: 1, endSurah: "Al-Furqan", endAyah: 20, startPage: 342, endPage: 361, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 19, nameArabic: "وَقَالَ الَّذِينَ", nameUrdu: "وقال الذین (Wa Qalallazina)", startSurah: "Al-Furqan", startAyah: 21, endSurah: "An-Naml", endAyah: 55, startPage: 362, endPage: 381, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 20, nameArabic: "أَمَّنْ خَلَقَ", nameUrdu: "امن خلق (Amman Khalaqa)", startSurah: "An-Naml", startAyah: 56, endSurah: "Al-Ankaboot", endAyah: 45, startPage: 382, endPage: 401, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 21, nameArabic: "اتْلُ مَا أُوحِيَ", nameUrdu: "اتل ما اوحی (Utlu Ma Oohiya)", startSurah: "Al-Ankaboot", startAyah: 46, endSurah: "Al-Ahzab", endAyah: 30, startPage: 402, endPage: 421, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 22, nameArabic: "وَمَنْ يَقْنُتْ", nameUrdu: "ومن یقنت (Wa Manyaqnut)", startSurah: "Al-Ahzab", startAyah: 31, endSurah: "Ya-Sin", endAyah: 27, startPage: 422, endPage: 441, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 23, nameArabic: "وَمَا لِيَ", nameUrdu: "وما لی (Wa Maliya)", startSurah: "Ya-Sin", startAyah: 28, endSurah: "Az-Zumar", endAyah: 31, startPage: 442, endPage: 461, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 24, nameArabic: "فَمَنْ أَظْلَمُ", nameUrdu: "فمن اظلم (Faman Azlamu)", startSurah: "Az-Zumar", startAyah: 32, endSurah: "Fussilat", endAyah: 46, startPage: 462, endPage: 481, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 25, nameArabic: "إِلَيْهِ يُرَدُّ", nameUrdu: "الیہ یرد (Ilaihi Yuraddu)", startSurah: "Fussilat", startAyah: 47, endSurah: "Al-Jathiyah", endAyah: 37, startPage: 482, endPage: 501, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 26, nameArabic: "حم", nameUrdu: "حم (Ha'a Meem)", startSurah: "Al-Ahqaf", startAyah: 1, endSurah: "Adh-Dhariyat", endAyah: 30, startPage: 502, endPage: 521, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 27, nameArabic: "قَالَ فَمَا خَطْبُكُمْ", nameUrdu: "قال فما خطبکم (Qala Fama Khatbukum)", startSurah: "Adh-Dhariyat", startAyah: 31, endSurah: "Al-Hadid", endAyah: 29, startPage: 522, endPage: 541, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 28, nameArabic: "قَدْ سَمِعَ اللَّهُ", nameUrdu: "قد سمع اللہ (Qadd Sami'Allahu)", startSurah: "Al-Mujadila", startAyah: 1, endSurah: "At-Tahrim", endAyah: 12, startPage: 542, endPage: 561, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 29, nameArabic: "تَبَارَكَ الَّذِي", nameUrdu: "تبارک الذی (Tabarakallazi)", startSurah: "Al-Mulk", startAyah: 1, endSurah: "Al-Mursalat", endAyah: 50, startPage: 562, endPage: 581, completedQuarter: "none", percentCompleted: 0 },
  { paraNumber: 30, nameArabic: "عَمَّ", nameUrdu: "عم (Amma)", startSurah: "An-Naba", startAyah: 1, endSurah: "An-Nas", endAyah: 6, startPage: 582, endPage: 604, completedQuarter: "none", percentCompleted: 0 }
];

export const SURAH_LIST = [
  { number: 1, nameEnglish: "Al-Fatiha", nameArabic: "الفاتحة", totalVerses: 7 },
  { number: 2, nameEnglish: "Al-Baqarah", nameArabic: "البقرة", totalVerses: 286 },
  { number: 3, nameEnglish: "Aal-e-Imran", nameArabic: "آل عمران", totalVerses: 200 },
  { number: 4, nameEnglish: "An-Nisa", nameArabic: "النساء", totalVerses: 176 },
  { number: 5, nameEnglish: "Al-Ma'idah", nameArabic: "المائدة", totalVerses: 120 },
  { number: 6, nameEnglish: "Al-An'am", nameArabic: "الأنعام", totalVerses: 165 },
  { number: 7, nameEnglish: "Al-A'raf", nameArabic: "الأعراف", totalVerses: 206 },
  { number: 8, nameEnglish: "Al-Anfal", nameArabic: "الأنفال", totalVerses: 75 },
  { number: 9, nameEnglish: "At-Tawbah", nameArabic: "التوبة", totalVerses: 129 },
  { number: 10, nameEnglish: "Yunus", nameArabic: "يونس", totalVerses: 109 },
  { number: 36, nameEnglish: "Ya-Sin", nameArabic: "يس", totalVerses: 83 },
  { number: 55, nameEnglish: "Ar-Rahman", nameArabic: "الرحمن", totalVerses: 78 },
  { number: 67, nameEnglish: "Al-Mulk", nameArabic: "الملك", totalVerses: 30 },
  { number: 112, nameEnglish: "Al-Ikhlas", nameArabic: "الإخلاص", totalVerses: 4 },
  { number: 113, nameEnglish: "Al-Falaq", nameArabic: "الفلق", totalVerses: 5 },
  { number: 114, nameEnglish: "An-Nas", nameArabic: "الناس", totalVerses: 6 }
];

export const DEFAULT_DAUR_SESSION: DaurSession = {
  currentDay: 1,
  totalDays: 30,
  completedParas: 0,
  totalParas: 30,
  estimatedEnd: "30 Days Plan",
  todayStartPage: 1,
  todayEndPage: 20,
  todayTargetPages: 20,
  todayPagesRead: 0,
  todayQuality: "Good",
  todayMistakes: 0,
  isTodayDone: false,
  streakDays: 0,
  monthlyCompleted: 0,
  parasPerDay: 1.0,
  planConfig: {
    planDurationDays: 30,
    planName: "30 Days Complete Daur (1 Para/Day)",
    parasPerDay: 1,
    pagesPerDay: 20,
    breakdownType: "prayers",
    startingPara: 1,
    startingPage: 1,
    startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    isConfigured: false,
    dailySlots: [
      { id: "slot-1", name: "After Fajr", timeLabel: "05:30 AM", targetPages: 4, completed: false },
      { id: "slot-2", name: "After Dhuhr", timeLabel: "01:15 PM", targetPages: 4, completed: false },
      { id: "slot-3", name: "After Asr", timeLabel: "04:45 PM", targetPages: 4, completed: false },
      { id: "slot-4", name: "After Maghrib", timeLabel: "07:00 PM", targetPages: 4, completed: false },
      { id: "slot-5", name: "After Isha", timeLabel: "08:45 PM", targetPages: 4, completed: false }
    ]
  }
};

export const SAMPLE_HEATMAP_DATA: HeatmapDay[] = Array.from({ length: 35 }, (_, idx) => {
  return {
    day: idx + 1,
    level: "none",
    dateStr: `Day ${idx + 1}`,
    pagesRead: 0
  };
});

export const INITIAL_QURAN_NOTES: QuranNote[] = [];

