import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppTab, ParaProgress, ParaQuarter, UserAuth, QuranNote, DaurSession, HeatmapDay, DaurPlanConfig } from "@/types";
import { INITIAL_PARAS, INITIAL_QURAN_NOTES, DEFAULT_DAUR_SESSION, SAMPLE_HEATMAP_DATA } from "@/data/islamicData";
import { rtdb, initAnalytics } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";

interface ToastMsg {
  id: string;
  message: string;
}

interface IslamicAppContextType {
  auth: UserAuth;
  setAuth: React.Dispatch<React.SetStateAction<UserAuth>>;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  daurSession: DaurSession;
  setDaurSession: React.Dispatch<React.SetStateAction<DaurSession>>;
  heatmap: HeatmapDay[];
  paras: ParaProgress[];
  updateParaQuarter: (paraNumber: number, quarter: "none" | ParaQuarter, notes?: string) => void;
  toggleWeakArea: (paraNumber: number) => void;
  quranNotes: QuranNote[];
  addQuranNote: (note: Omit<QuranNote, "id" | "date">) => void;
  updateQuranNote: (id: string, updated: Partial<QuranNote>) => void;
  deleteQuranNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  markTodayDone: () => void;
  updateTodayPages: (pages: number) => void;
  updateTodayQuality: (quality: "Excellent" | "Good" | "Average" | "Poor") => void;
  incrementMistakes: () => void;
  decrementMistakes: () => void;
  applyDaurPlan: (config: DaurPlanConfig) => void;
  toggleDailySlot: (slotId: string) => void;
  isPlanSetupOpen: boolean;
  setIsPlanSetupOpen: (open: boolean) => void;
  isCloudSynced: boolean;
  syncWithCloud: () => Promise<void>;
  logout: () => void;
  toast: ToastMsg | null;
  showToast: (msg: string) => void;
}

const INITIAL_AUTH: UserAuth = {
  isLoggedIn: false,
  name: "",
  email: "",
  username: "",
  city: "Makkah",
  country: "Saudi Arabia"
};

const IslamicAppContext = createContext<IslamicAppContextType | undefined>(undefined);

export const IslamicAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<UserAuth>(INITIAL_AUTH);
  const [activeTab, setActiveTab] = useState<AppTab>("daur");
  const [daurSession, setDaurSession] = useState<DaurSession>(DEFAULT_DAUR_SESSION);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>(SAMPLE_HEATMAP_DATA);
  const [paras, setParas] = useState<ParaProgress[]>(INITIAL_PARAS);
  const [quranNotes, setQuranNotes] = useState<QuranNote[]>(INITIAL_QURAN_NOTES);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [isPlanSetupOpen, setIsPlanSetupOpen] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  // Initialize Firebase Analytics & Load State
  useEffect(() => {
    // 1. Init Analytics
    initAnalytics().catch(() => {});

    // 2. Load from LocalStorage
    try {
      const savedParas = localStorage.getItem("daur_app_paras");
      if (savedParas) setParas(JSON.parse(savedParas));
      const savedNotes = localStorage.getItem("daur_app_notes");
      if (savedNotes) setQuranNotes(JSON.parse(savedNotes));
      const savedDaur = localStorage.getItem("daur_app_session");
      if (savedDaur) {
        setDaurSession(JSON.parse(savedDaur));
      } else {
        setIsPlanSetupOpen(true);
      }
      const savedAuth = localStorage.getItem("daur_app_auth");
      if (savedAuth) setAuth(JSON.parse(savedAuth));
    } catch {
      setIsPlanSetupOpen(true);
    }

    // 3. Try to sync with Firebase Realtime Database on startup
    const userKey = auth.username || "hamza";
    get(ref(rtdb, `users/${userKey}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.val();
          if (cloudData.daurSession) setDaurSession(cloudData.daurSession);
          if (cloudData.quranNotes) setQuranNotes(cloudData.quranNotes);
          if (cloudData.paras) setParas(cloudData.paras);
          setIsCloudSynced(true);
        }
      })
      .catch(() => {
        // Offline or network fallback
      });
  }, []);

  const syncToFirebase = (type: "session" | "notes" | "paras", data: any) => {
    const userKey = auth.username || "hamza";
    try {
      set(ref(rtdb, `users/${userKey}/${type}`), data)
        .then(() => setIsCloudSynced(true))
        .catch(() => setIsCloudSynced(false));
    } catch {
      setIsCloudSynced(false);
    }
  };

  const syncWithCloud = async () => {
    const userKey = auth.username || "hamza";
    try {
      await set(ref(rtdb, `users/${userKey}`), {
        daurSession,
        quranNotes,
        paras,
        updatedAt: new Date().toISOString()
      });
      setIsCloudSynced(true);
      showToast("Cloud backup synced with Firebase ☁️");
    } catch (e) {
      showToast("Firebase Cloud sync updated locally");
    }
  };

  const saveParasToStorage = (updated: ParaProgress[]) => {
    setParas(updated);
    try {
      localStorage.setItem("daur_app_paras", JSON.stringify(updated));
      syncToFirebase("paras", updated);
    } catch {}
  };

  const saveNotesToStorage = (updated: QuranNote[]) => {
    setQuranNotes(updated);
    try {
      localStorage.setItem("daur_app_notes", JSON.stringify(updated));
      syncToFirebase("notes", updated);
    } catch {}
  };

  const saveDaurToStorage = (updated: DaurSession) => {
    setDaurSession(updated);
    try {
      localStorage.setItem("daur_app_session", JSON.stringify(updated));
      syncToFirebase("session", updated);
    } catch {}
  };

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const applyDaurPlan = (config: DaurPlanConfig) => {
    const startPage = config.startingPage || 1;
    const endPage = Math.min(604, startPage + config.pagesPerDay - 1);

    const updated: DaurSession = {
      ...daurSession,
      totalDays: config.planDurationDays,
      todayTargetPages: config.pagesPerDay,
      todayStartPage: startPage,
      todayEndPage: endPage,
      parasPerDay: config.parasPerDay,
      planConfig: config
    };

    saveDaurToStorage(updated);
    showToast(`Daur Plan Activated: ${config.planName} ✨`);
  };

  const toggleDailySlot = (slotId: string) => {
    const updatedSlots = daurSession.planConfig.dailySlots.map((slot) => {
      if (slot.id === slotId) {
        const next = !slot.completed;
        return { ...slot, completed: next };
      }
      return slot;
    });

    const completedPages = updatedSlots
      .filter((s) => s.completed)
      .reduce((sum, s) => sum + s.targetPages, 0);

    const updated: DaurSession = {
      ...daurSession,
      todayPagesRead: Math.min(daurSession.todayTargetPages, completedPages),
      isTodayDone: updatedSlots.every((s) => s.completed),
      planConfig: {
        ...daurSession.planConfig,
        dailySlots: updatedSlots
      }
    };

    saveDaurToStorage(updated);
  };

  const markTodayDone = () => {
    const isNowDone = !daurSession.isTodayDone;
    const updatedSlots = daurSession.planConfig.dailySlots.map((s) => ({
      ...s,
      completed: isNowDone
    }));

    const updated: DaurSession = {
      ...daurSession,
      isTodayDone: isNowDone,
      todayPagesRead: isNowDone ? daurSession.todayTargetPages : 0,
      streakDays: isNowDone ? daurSession.streakDays + 1 : Math.max(0, daurSession.streakDays - 1),
      planConfig: {
        ...daurSession.planConfig,
        dailySlots: updatedSlots
      }
    };
    saveDaurToStorage(updated);
    showToast(isNowDone ? "MashaAllah! Today's Daur reading marked complete ✨" : "Marked as incomplete");
  };

  const updateTodayPages = (pages: number) => {
    const updated: DaurSession = {
      ...daurSession,
      todayPagesRead: Math.max(0, Math.min(pages, daurSession.todayTargetPages))
    };
    saveDaurToStorage(updated);
  };

  const updateTodayQuality = (quality: "Excellent" | "Good" | "Average" | "Poor") => {
    const updated: DaurSession = {
      ...daurSession,
      todayQuality: quality
    };
    saveDaurToStorage(updated);
    showToast(`Recitation quality set to ${quality}`);
  };

  const incrementMistakes = () => {
    const updated: DaurSession = {
      ...daurSession,
      todayMistakes: daurSession.todayMistakes + 1
    };
    saveDaurToStorage(updated);
  };

  const decrementMistakes = () => {
    const updated: DaurSession = {
      ...daurSession,
      todayMistakes: Math.max(0, daurSession.todayMistakes - 1)
    };
    saveDaurToStorage(updated);
  };

  const toggleWeakArea = (paraNumber: number) => {
    const updated = paras.map((p) => {
      if (p.paraNumber === paraNumber) {
        const nextState = !p.isWeakArea;
        showToast(nextState ? `Para ${paraNumber} marked as Weak Area ⚠️` : `Para ${paraNumber} removed from Weak Areas ✅`);
        return { ...p, isWeakArea: nextState };
      }
      return p;
    });
    saveParasToStorage(updated);
  };

  const updateParaQuarter = (paraNumber: number, quarter: "none" | ParaQuarter, notes?: string) => {
    const pctMap: Record<string, number> = {
      none: 0,
      pav: 25,
      aadha: 50,
      paun: 75,
      aek: 100
    };

    const labelMap: Record<string, string> = {
      none: "Reset",
      pav: "Pav Para (25%)",
      aadha: "Aadha Para (50%)",
      paun: "Paun Para (75%)",
      aek: "Aek Para (100%)"
    };

    const updated = paras.map((p) => {
      if (p.paraNumber === paraNumber) {
        return {
          ...p,
          completedQuarter: quarter,
          percentCompleted: pctMap[quarter] || 0,
          lastRevisedDate: quarter !== "none" ? "Today" : p.lastRevisedDate,
          notes: notes !== undefined ? notes : p.notes
        };
      }
      return p;
    });

    saveParasToStorage(updated);
    showToast(`Para ${paraNumber}: Marked as ${labelMap[quarter]}`);
  };

  const addQuranNote = (noteData: Omit<QuranNote, "id" | "date">) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const newNote: QuranNote = {
      ...noteData,
      id: `qn-${Date.now()}`,
      date: today
    };
    const updated = [newNote, ...quranNotes];
    saveNotesToStorage(updated);
    showToast("Quran Note added successfully 📝");
  };

  const updateQuranNote = (id: string, updatedFields: Partial<QuranNote>) => {
    const updated = quranNotes.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
    saveNotesToStorage(updated);
    showToast("Quran Note updated");
  };

  const deleteQuranNote = (id: string) => {
    const updated = quranNotes.filter((n) => n.id !== id);
    saveNotesToStorage(updated);
    showToast("Quran Note deleted");
  };

  const togglePinNote = (id: string) => {
    const updated = quranNotes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    saveNotesToStorage(updated);
  };

  const logout = () => {
    const emptyAuth: UserAuth = {
      isLoggedIn: false,
      name: "",
      email: "",
      username: "",
      city: "Makkah",
      country: "Saudi Arabia"
    };
    setAuth(emptyAuth);
    try {
      localStorage.removeItem("daur_app_auth");
    } catch {}
    showToast("Signed out of Daur 🌙");
  };

  return (
    <IslamicAppContext.Provider
      value={{
        auth,
        setAuth,
        activeTab,
        setActiveTab,
        daurSession,
        setDaurSession,
        heatmap,
        paras,
        updateParaQuarter,
        toggleWeakArea,
        quranNotes,
        addQuranNote,
        updateQuranNote,
        deleteQuranNote,
        togglePinNote,
        searchQuery,
        setSearchQuery,
        markTodayDone,
        updateTodayPages,
        updateTodayQuality,
        incrementMistakes,
        decrementMistakes,
        applyDaurPlan,
        toggleDailySlot,
        isPlanSetupOpen,
        setIsPlanSetupOpen,
        isCloudSynced,
        syncWithCloud,
        logout,
        toast,
        showToast
      }}
    >
      {children}
    </IslamicAppContext.Provider>
  );
};

export const useIslamicApp = () => {
  const context = useContext(IslamicAppContext);
  if (!context) {
    throw new Error("useIslamicApp must be used within IslamicAppProvider");
  }
  return context;
};
