import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import HeroSection from "./HeroSection";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { BADGES, PUBLIC_HOLIDAYS } from "./constants";

export { BADGES };

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function dateToStr(d) {
  if (!d) return "null";
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function strToDate(s) {
  if (!s || s === "null") return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m, d);
}

// covers currentYear ±5 so past/future navigation still shows holidays
function buildHolidayNotes() {
  const notes    = {};
  const baseYear = new Date().getFullYear();
  for (let offset = -5; offset <= 5; offset++) {
    const year = baseYear + offset;
    PUBLIC_HOLIDAYS.forEach(({ month, day, name }) => {
      const key = `${year}-${month}-${day}_${year}-${month}-${day}`;
      notes[key] = { text: name, badges: ["holiday"], readonly: true };
    });
  }
  return notes;
}

const HOLIDAY_NOTES = buildHolidayNotes();

const DEFAULT_RANGE_NOTES = {
  "2026-3-15_2026-3-15": { text: "Google Mock Interview.", badges: ["interview"] },
  "2026-3-20_2026-3-22": { text: "Build GenAI component.", badges: ["project", "deadline"] },
  "2026-3-5_2026-3-5":   { text: "TakeUForward SWE Assignment Due!", badges: ["deadline"] },
  "2026-4-10_2026-4-10": { text: "Systems Design Chapter 3 review", badges: ["study"] },
  "2026-3-18_2026-3-18": { text: "Codeforces Div 2", badges: ["contest"] },
};

export default function TUFCalendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    const saved = loadJSON("tuf-current-date", null);
    if (saved) return new Date(saved.year, saved.month, 1);
    return new Date();
  });

  useEffect(() => {
    saveJSON("tuf-current-date", {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    });
  }, [currentDate]);

  const [selectedRange, setSelectedRange] = useState(() => {
    const saved = loadJSON("tuf-selected-range", null);
    if (saved) return { start: strToDate(saved.start), end: strToDate(saved.end) };
    return { start: null, end: null };
  });

  useEffect(() => {
    saveJSON("tuf-selected-range", {
      start: dateToStr(selectedRange.start),
      end:   dateToStr(selectedRange.end),
    });
  }, [selectedRange]);

  const [hoverDate, setHoverDate] = useState(null);

  const [allRangeNotes, setAllRangeNotes] = useState(() =>
    loadJSON("tuf-range-notes", DEFAULT_RANGE_NOTES)
  );

  const rangeKey = selectedRange.start
    ? `${dateToStr(selectedRange.start)}_${
        selectedRange.end
          ? dateToStr(selectedRange.end)
          : dateToStr(selectedRange.start)
      }`
    : null;

  const rangeNote = rangeKey && allRangeNotes[rangeKey] ? allRangeNotes[rangeKey] : null;

  const setRangeNote = useCallback(
    (dataUpdates) => {
      if (!rangeKey) return;
      setAllRangeNotes((prev) => {
        const next = { ...prev, [rangeKey]: dataUpdates };
        saveJSON("tuf-range-notes", next);
        return next;
      });
    },
    [rangeKey]
  );

  const handleArchiveNote = useCallback(() => {
    if (!rangeKey) return;
    setAllRangeNotes((prev) => {
      const next = { ...prev };
      delete next[rangeKey];
      saveJSON("tuf-range-notes", next);
      return next;
    });
    setSelectedRange({ start: null, end: null });
  }, [rangeKey]);

  const [hiddenCategories, setHiddenCategories] = useState(() =>
    new Set(loadJSON("tuf-hidden-categories", []))
  );

  const toggleCategory = useCallback((catId) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      saveJSON("tuf-hidden-categories", Array.from(next));
      return next;
    });
  }, []);

  const dateIndicatorMap = useMemo(() => {
    const map = new Map();

    Object.entries(allRangeNotes).forEach(([key, data]) => {
      const txt = typeof data === "string" ? data : data.text || "";
      const bgs = (data.badges || []).filter((b) => !hiddenCategories.has(b));
      if (!txt.trim() && bgs.length === 0) return;

      const [sStr, eStr] = key.split("_");
      const s = strToDate(sStr);
      const e = strToDate(eStr) || s;
      if (!s || !e) return;

      let curr  = new Date(s);
      let count = 0;
      while (curr <= e && count < 1000) {
        const ds = dateToStr(curr);
        if (!map.has(ds)) map.set(ds, new Set());
        bgs.forEach((bId) => map.get(ds).add(bId));
        if (txt.trim() && bgs.length === 0) map.get(ds).add("text_only");
        curr.setDate(curr.getDate() + 1);
        count++;
      }
    });

    if (!hiddenCategories.has("holiday")) {
      const year = currentDate.getFullYear();
      PUBLIC_HOLIDAYS.forEach(({ month, day }) => {
        const ds = `${year}-${month}-${day}`;
        if (!map.has(ds)) map.set(ds, new Set());
        map.get(ds).add("holiday");
      });
    }

    return map;
  }, [allRangeNotes, currentDate, hiddenCategories]);

  const holidayMap = useMemo(() => {
    if (hiddenCategories.has("holiday")) return new Map();
    const m    = new Map();
    const year = currentDate.getFullYear();
    PUBLIC_HOLIDAYS.forEach(({ month, day, name }) => {
      if (month === currentDate.getMonth()) {
        m.set(`${year}-${month}-${day}`, name);
      }
    });
    return m;
  }, [currentDate, hiddenCategories]);

  const currentMonthEvents = useMemo(() => {
    const events  = [];
    const targetY = currentDate.getFullYear();
    const targetM = currentDate.getMonth();
    const merged  = { ...HOLIDAY_NOTES, ...allRangeNotes };

    Object.entries(merged).forEach(([key, data]) => {
      const txt  = typeof data === "string" ? data : data.text || "";
      const bgs  = data.badges || [];
      if (!txt.trim() && bgs.length === 0) return;

      const visibleBadges = bgs.filter((b) => !hiddenCategories.has(b));
      if (bgs.length > 0 && visibleBadges.length === 0) return;

      const [sStr] = key.split("_");
      const s = strToDate(sStr);
      if (!s || s.getFullYear() !== targetY || s.getMonth() !== targetM) return;

      const [, eStr] = key.split("_");
      const eDate = strToDate(eStr);
      events.push({
        dateKey: key,
        dateStr: s.getDate() + (eDate && sStr !== eStr ? ` – ${eDate.getDate()}` : ""),
        badges:  visibleBadges,
        text:    txt,
        readonly: data.readonly || false,
      });
    });

    events.sort(
      (a, b) =>
        parseInt(a.dateKey.split("_")[0].split("-")[2]) -
        parseInt(b.dateKey.split("_")[0].split("-")[2])
    );
    return events;
  }, [allRangeNotes, currentDate, hiddenCategories]);

  const [slideDirection, setSlideDirection] = useState(null);
  const [animating, setAnimating]           = useState(false);
  const animTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(animTimerRef.current), []);

  const handleGoToToday = useCallback(() => {
    if (animating) return;
    const now    = new Date();
    const targetY = now.getFullYear();
    const targetM = now.getMonth();
    const curY   = currentDate.getFullYear();
    const curM   = currentDate.getMonth();
    if (targetY === curY && targetM === curM) return;
    const dir = targetY > curY || (targetY === curY && targetM > curM) ? "left" : "right";
    setSlideDirection(dir);
    setAnimating(true);
    animTimerRef.current = setTimeout(() => {
      setCurrentDate(new Date(targetY, targetM, 1));
      setAnimating(false);
    }, 320);
  }, [animating, currentDate]);

  const handleJumpToMonth = useCallback((targetY, targetM) => {
    if (animating) return;
    const curY = currentDate.getFullYear();
    const curM = currentDate.getMonth();
    if (targetY === curY && targetM === curM) return;
    const dir = targetY > curY || (targetY === curY && targetM > curM) ? "left" : "right";
    setSlideDirection(dir);
    setAnimating(true);
    animTimerRef.current = setTimeout(() => {
      setCurrentDate(new Date(targetY, targetM, 1));
      setAnimating(false);
    }, 320);
  }, [animating, currentDate]);

  const handlePrevMonth = useCallback(() => {
    if (animating) return;
    setSlideDirection("right");
    setAnimating(true);
    animTimerRef.current = setTimeout(() => {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      setAnimating(false);
    }, 320);
  }, [animating]);

  const handleNextMonth = useCallback(() => {
    if (animating) return;
    setSlideDirection("left");
    setAnimating(true);
    animTimerRef.current = setTimeout(() => {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      setAnimating(false);
    }, 320);
  }, [animating]);

  const handleDateClick = useCallback(
    (date) => {
      const { start, end } = selectedRange;

      if (!start || (start && end)) {
        setSelectedRange({ start: date, end: null });
      } else {
        if (date.getTime() > start.getTime()) {
          setSelectedRange({ start, end: date });
          setHoverDate(null);
        } else if (date.getTime() < start.getTime()) {
          setSelectedRange({ start: date, end: null });
        } else {
          // same day — deselect
          setSelectedRange({ start: null, end: null });
          setHoverDate(null);
        }
      }
    },
    [selectedRange]
  );

  const handleDateHover = useCallback(
    (date) => {
      if (selectedRange.start && !selectedRange.end) setHoverDate(date);
    },
    [selectedRange]
  );

  const handleGridMouseLeave = useCallback(() => setHoverDate(null), []);

  const touchStartX = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) handleNextMonth();
    else handlePrevMonth();
  }, [handleNextMonth, handlePrevMonth]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      document.querySelectorAll(".parallax-bg").forEach((el) => {
        el.style.transform = `translateY(${scrollY * 0.15}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body antialiased rounded-3xl relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-outline-variant/30 max-w-[1000px] mx-auto">
      <div className="p-3 md:p-4 space-y-3 relative z-10 w-full">
        <HeroSection currentDate={currentDate} slideDirection={slideDirection} animating={animating} />

        <div
          className="flex flex-col xl:grid xl:grid-cols-12 gap-4 xl:items-stretch relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="xl:col-span-8">
            <CalendarGrid
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToToday={handleGoToToday}
              onJumpToMonth={handleJumpToMonth}
              selectedRange={selectedRange}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={handleDateHover}
              onGridMouseLeave={handleGridMouseLeave}
              dateIndicatorMap={dateIndicatorMap}
              holidayMap={holidayMap}
              hiddenCategories={hiddenCategories}
              onToggleCategory={toggleCategory}
              slideDirection={slideDirection}
              animating={animating}
            />
          </div>

          <div className="xl:col-span-4">
            <NotesPanel
              selectedRange={selectedRange}
              rangeData={rangeNote}
              onRangeDataChange={setRangeNote}
              onArchive={handleArchiveNote}
              currentMonthEvents={currentMonthEvents}
              slideDirection={slideDirection}
              animating={animating}
              onEventSelect={(dateKey) => {
                const [sStr, eStr] = dateKey.split("_");
                const s = strToDate(sStr);
                const e = strToDate(eStr);
                const currentKey = selectedRange.start
                  ? `${dateToStr(selectedRange.start)}_${selectedRange.end ? dateToStr(selectedRange.end) : dateToStr(selectedRange.start)}`
                  : null;
                if (currentKey === dateKey) {
                  setSelectedRange({ start: null, end: null });
                } else {
                  setSelectedRange({ start: s, end: sStr === eStr ? null : e });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
