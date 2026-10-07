"use client";

import React, { useState } from "react";
import { useIslamicApp } from "@/context/IslamicAppContext";
import { 
  BookOpen, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Globe
} from "lucide-react";

export const AuthScreen: React.FC = () => {
  const { setAuth, showToast, syncWithCloud } = useIslamicApp();
  const [mode, setMode] = useState<"signin" | "signup" | "guest">("signin");
  
  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Makkah");
  const [country, setCountry] = useState("Saudi Arabia");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = (username || email.split("@")[0] || "hafiz").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanUsername) {
      setError("Please enter your username or email");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const userAuth = {
        isLoggedIn: true,
        name: name || cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        email: email || `${cleanUsername}@daur.app`,
        username: cleanUsername,
        city: city || "Makkah",
        country: country || "Saudi Arabia"
      };

      setAuth(userAuth);
      localStorage.setItem("daur_app_auth", JSON.stringify(userAuth));
      showToast(`Welcome back, ${userAuth.name}! 🌙`);
      setIsLoading(false);
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, "_")).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanUsername) {
      setError("Please enter a valid username");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const userAuth = {
        isLoggedIn: true,
        name: name.trim(),
        email: email.trim() || `${cleanUsername}@daur.app`,
        username: cleanUsername,
        city: city || "Makkah",
        country: country || "Saudi Arabia"
      };

      setAuth(userAuth);
      localStorage.setItem("daur_app_auth", JSON.stringify(userAuth));
      showToast(`Account created! May Allah bless your Daur journey 🤲`);
      setIsLoading(false);
    }, 400);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestAuth = {
        isLoggedIn: true,
        name: "Hafiz Guest",
        email: "guest@daur.app",
        username: "guest_" + Math.floor(Math.random() * 10000),
        city: "Medina",
        country: "Saudi Arabia"
      };

      setAuth(guestAuth);
      localStorage.setItem("daur_app_auth", JSON.stringify(guestAuth));
      showToast("Started in Guest Mode 📖");
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#071326] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Islamic Geometry & Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10 pt-4 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-xl shadow-blue-900/40">
          <div className="w-full h-full bg-[#091A33] rounded-[22px] flex items-center justify-center text-2xl">
            📖
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>Quran Daur Tracker</span>
          </h1>
          <p className="text-xs font-light text-sky-200/80">
            Hifz Revision • Daily Paras • Offline Reader &amp; Cloud Sync
          </p>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto bg-[#0C1F3D]/90 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#061224] rounded-2xl border border-sky-900/50">
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(null); }}
            className={`py-2 text-xs font-medium rounded-xl transition-all ${
              mode === "signin" 
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-semibold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`py-2 text-xs font-medium rounded-xl transition-all ${
              mode === "signup" 
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-semibold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-light text-center">
            {error}
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-light text-sky-200 flex items-center gap-1">
                <User className="w-3 h-3 text-sky-400" />
                <span>Username or Email</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. hafiz_hamza or hamza@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061224]/80 border border-sky-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-light text-sky-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-sky-400" />
                <span>Password / PIN</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061224]/80 border border-sky-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 active:scale-[0.98] text-white text-xs font-semibold shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Daur</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* CREATE ACCOUNT FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-light text-sky-200 flex items-center gap-1">
                <User className="w-3 h-3 text-sky-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hafiz Hamza"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061224]/80 border border-sky-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-light text-sky-200 flex items-center gap-1">
                <Mail className="w-3 h-3 text-sky-400" />
                <span>Email (Optional for Sync)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hamza@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061224]/80 border border-sky-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-light text-sky-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>City / Region</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Makkah..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061224]/80 border border-sky-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 active:scale-[0.98] text-white text-xs font-semibold shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Start Daur</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* GUEST ACCESS OPTION */}
        <div className="pt-2 border-t border-sky-900/40 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="text-[11px] font-light text-sky-300 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
          >
            Or continue as Guest (No sign up required) ➔
          </button>
        </div>
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 py-2 flex items-center justify-center gap-4 text-[10px] font-light text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Offline Quran Reader</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-sky-400" />
          <span>Firebase Cloud Sync</span>
        </span>
      </div>
    </div>
  );
};
