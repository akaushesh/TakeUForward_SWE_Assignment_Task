import { useState, useEffect, useRef } from "react";
import TUFCalendar from "../components/Calendar/TUFCalendar";
import CalendarSkeleton from "../components/CalendarSkeleton";

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("tuf-dark-mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [loading, setLoading]   = useState(false);
  const loaderTimerRef          = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("tuf-dark-mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => () => clearTimeout(loaderTimerRef.current), []);

  const triggerLoader = () => {
    setLoading(true);
    loaderTimerRef.current = setTimeout(() => setLoading(false), 2500);
  };

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto p-4 md:px-8 md:py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold text-on-surface">
          Calender Component - Assignment Task SWE Intern
        </h1>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-end gap-0.5">
            <button
              onClick={triggerLoader}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant shadow-sm border border-outline-variant/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Simulate loading state"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
                {loading ? "progress_activity" : "play_circle"}
              </span>
              <span className="hidden sm:inline">{loading ? "Loading…" : "Use Loader"}</span>
            </button>
            <span className="text-[10px] text-on-surface-variant/40 hidden sm:block pr-1">
              Simulates backend response
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface-variant shadow-sm border border-outline-variant/20"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto p-4 md:px-8 pb-8 pt-0">
        {loading ? <CalendarSkeleton /> : <TUFCalendar />}
      </div>
    </div>
  );
}
