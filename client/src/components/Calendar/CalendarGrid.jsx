import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { MONTH_NAMES } from "./constants";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth()    === d2.getMonth()    &&
    d1.getDate()     === d2.getDate()
  );
}

function isInRange(date, start, end) {
  if (!start || !end) return false;
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}

function isToday(date) {
  return isSameDay(date, new Date());
}

const DOT_COLOR = {
  deadline:  "bg-red-500",
  study:     "bg-blue-500",
  interview: "bg-green-500",
  contest:   "bg-yellow-500",
  project:   "bg-purple-500",
  holiday:   "bg-rose-400",
  text_only: "bg-on-surface-variant/50",
};

// seasonal / festival themed emojis per month
// format: [emoji, top%, left%, sizePx, rotateDeg, opacity]
const MONTH_BG_EMOJIS = {
  0:  [["❄️","8%","5%",52,-15,0.07],["🎉","20%","88%",44,20,0.06],["🌟","65%","10%",38,8,0.07],["🥂","80%","80%",48,-20,0.06],["❄️","45%","50%",60,5,0.04],["🎊","90%","40%",36,30,0.06],["🌟","35%","70%",32,-10,0.05]],
  1:  [["💝","10%","8%",52,15,0.07],["🌸","25%","85%",48,-18,0.07],["💻","70%","12%",44,10,0.06],["📚","82%","78%",40,-8,0.06],["💕","50%","55%",56,0,0.04],["🌸","40%","30%",36,25,0.06],["💝","88%","20%",32,-15,0.05]],
  2:  [["🌈","8%","6%",56,-12,0.07],["🎨","22%","84%",44,22,0.07],["🌺","68%","8%",48,8,0.07],["🐇","85%","82%",40,-20,0.06],["🌈","48%","48%",64,0,0.04],["🌸","38%","68%",34,18,0.06],["🎨","90%","35%",30,-8,0.05]],
  3:  [["🌧️","9%","7%",52,10,0.07],["💼","24%","86%",44,-15,0.06],["📝","66%","9%",40,20,0.07],["🌱","83%","80%",48,-10,0.06],["🌧️","46%","52%",60,5,0.04],["💼","36%","28%",34,-22,0.06],["🌱","91%","42%",32,12,0.05]],
  4:  [["☀️","7%","6%",56,-8,0.07],["🏆","23%","87%",44,18,0.07],["💡","67%","7%",40,12,0.07],["🔥","84%","81%",48,-15,0.06],["☀️","47%","50%",68,0,0.04],["🏆","37%","67%",34,-20,0.06],["💡","89%","33%",30,25,0.05]],
  5:  [["🏢","8%","5%",52,12,0.07],["💻","21%","85%",48,-18,0.06],["🚀","69%","10%",44,8,0.07],["🌙","81%","79%",40,-12,0.06],["🚀","49%","53%",60,0,0.04],["🏢","39%","29%",36,22,0.06],["🌙","90%","44%",32,-8,0.05]],
  6:  [["⛈️","9%","7%",52,-10,0.07],["🌊","22%","86%",48,20,0.07],["🛠️","68%","8%",44,15,0.07],["📊","83%","80%",40,-18,0.06],["🌊","47%","51%",64,0,0.04],["⛈️","37%","68%",34,-25,0.06],["🛠️","91%","36%",30,10,0.05]],
  7:  [["🎋","8%","6%",52,15,0.07],["🌙","24%","87%",48,-20,0.07],["🧠","67%","9%",44,10,0.07],["📖","82%","81%",40,-8,0.06],["🌙","48%","52%",62,0,0.04],["🎋","38%","30%",36,22,0.06],["🧠","90%","43%",32,-15,0.05]],
  8:  [["🐘","7%","5%",56,-12,0.07],["🪔","23%","86%",48,18,0.07],["🎓","68%","8%",44,8,0.07],["📋","84%","80%",40,-20,0.06],["🪔","47%","50%",66,0,0.04],["🐘","37%","68%",34,-10,0.06],["🎓","89%","35%",30,25,0.05]],
  9:  [["🎃","8%","6%",56,12,0.07],["🪔","22%","85%",52,-18,0.07],["🏹","67%","7%",44,20,0.07],["🍂","83%","82%",48,-8,0.06],["🎃","47%","51%",68,0,0.04],["🪔","37%","29%",36,15,0.06],["🍂","90%","44%",32,-22,0.05]],
  10: [["✉️","9%","7%",52,-10,0.07],["🍁","23%","86%",48,20,0.07],["🤝","68%","9%",44,8,0.07],["🌟","82%","80%",40,-15,0.06],["🍁","48%","52%",62,0,0.04],["✉️","38%","68%",34,-20,0.06],["🌟","91%","36%",30,12,0.05]],
  11: [["🎄","8%","5%",56,10,0.07],["❄️","22%","87%",52,-18,0.07],["🎁","67%","8%",48,15,0.07],["🌙","83%","81%",44,-10,0.06],["🎄","47%","50%",70,0,0.04],["❄️","37%","28%",36,22,0.06],["🎁","90%","43%",32,-15,0.05]],
};

export default function CalendarGrid({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onJumpToMonth,
  selectedRange,
  hoverDate,
  onDateClick,
  onDateHover,
  onGridMouseLeave,
  dateIndicatorMap,
  holidayMap,
  hiddenCategories,
  onToggleCategory,
  slideDirection,
  animating,
}) {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  const pickerRef = useRef(null);

  const openPicker = useCallback(() => {
    setPickerYear(year);
    setPickerOpen(true);
  }, [year]);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const handlePickerSelect = useCallback((m) => {
    setPickerOpen(false);
    onJumpToMonth?.(pickerYear, m);
  }, [pickerYear, onJumpToMonth]);

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  const calendarDays = useMemo(() => {
    const daysInMonth  = getDaysInMonth(year, month);
    const firstDay     = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
    }
    const toFill = 42 - days.length;
    for (let d = 1; d <= toFill; d++) {
      days.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) });
    }
    return days;
  }, [year, month]);

  const { start, end } = selectedRange;
  const previewEnd = end || (start && hoverDate && hoverDate.getTime() !== start.getTime() ? hoverDate : null);

  const gridAnimClass = animating
    ? slideDirection === "left" ? "animate-slide-out-left" : "animate-slide-out-right"
    : slideDirection === "left"
    ? "animate-slide-in-left"
    : slideDirection === "right"
    ? "animate-slide-in-right"
    : "";

  return (
    <div
      id="calendar-grid-panel"
      className="glass-panel rounded-xl p-3 md:p-4 shadow-[0px_20px_50px_rgba(25,28,29,0.1)] dark:shadow-[0px_20px_50px_rgba(0,0,0,0.3)] paper-texture flex flex-col h-full relative overflow-hidden"
    >
      {/* header */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            id="prev-month-btn"
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-surface-container-high/50 rounded-full transition-all duration-200 active:scale-90"
            aria-label="Previous month"
          >
            <span className="material-symbols-outlined text-outline text-[20px]">chevron_left</span>
          </button>

          <div className="relative" ref={pickerRef}>
            <div className="text-center min-w-[120px] flex flex-col items-center">
              <button
                onClick={openPicker}
                className="text-lg md:text-xl font-bold tracking-tight text-on-surface leading-none hover:text-primary transition-colors"
                aria-label="Open month picker"
              >
                {MONTH_NAMES[month]}
              </button>
              <button
                onClick={openPicker}
                className="text-[10px] text-on-surface-variant/50 font-medium tracking-widest hover:text-primary/60 transition-colors"
                aria-label="Open year picker"
              >
                {year}
              </button>
            </div>

            {pickerOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 w-56 glass-panel rounded-xl shadow-xl p-3 flex flex-col gap-2 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="p-1 hover:bg-surface-container-high/50 rounded-full transition-colors"
                    aria-label="Previous year"
                  >
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_left</span>
                  </button>
                  <span className="text-sm font-bold text-on-surface">{pickerYear}</span>
                  <button
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="p-1 hover:bg-surface-container-high/50 rounded-full transition-colors"
                    aria-label="Next year"
                  >
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {MONTH_NAMES.map((name, m) => {
                    const isCurrent = m === month && pickerYear === year;
                    const isTodayMonth = m === now.getMonth() && pickerYear === now.getFullYear();
                    return (
                      <button
                        key={m}
                        onClick={() => handlePickerSelect(m)}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                          isCurrent
                            ? "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-sm"
                            : isTodayMonth
                            ? "ring-1 ring-primary/40 text-primary hover:bg-primary/10"
                            : "text-on-surface-variant hover:bg-surface-container-high/50"
                        }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            id="next-month-btn"
            onClick={onNextMonth}
            className="p-1.5 hover:bg-surface-container-high/50 rounded-full transition-all duration-200 active:scale-90"
            aria-label="Next month"
          >
            <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentMonth && (
            <button
              onClick={onGoToToday}
              className="px-2.5 py-1 text-[10px] font-semibold rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all duration-150"
              aria-label="Go to today"
            >
              Today
            </button>
          )}
          <div className="text-[10px] text-on-surface-variant/40 font-medium tracking-wide hidden sm:block">
            {!start ? "Click to select" : !end ? "Click end date" : "Click to reset"}
          </div>
        </div>
      </div>

      {/* day labels */}
      <div className="calendar-grid mb-1 border-b border-outline-variant/20">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[9px] md:text-[10px] text-on-surface-variant/60 font-semibold tracking-widest pb-1.5"
          >
            {label}
          </div>
        ))}
      </div>

      {/* days */}
      <div className="flex-1 overflow-hidden relative">
        <div
          key={`${year}-${month}`}
          className={`calendar-grid gap-y-0.5 h-full relative ${gridAnimClass}`}
          onMouseLeave={onGridMouseLeave}
          role="grid"
          aria-label="Calendar days"
        >
          {(MONTH_BG_EMOJIS[month] || []).map(([emoji, top, left, size, rotate, opacity], i) => (
            <span
              key={`emoji-${i}`}
              aria-hidden="true"
              style={{
                position: "absolute",
                top, left,
                fontSize: `clamp(20px, ${size}px, 5vw)`,
                transform: `rotate(${rotate}deg)`,
                opacity,
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              {emoji}
            </span>
          ))}

          {calendarDays.map((dayObj, idx) => {
            const { day, currentMonth, date } = dayObj;

            if (!currentMonth) {
              return (
                <div
                  key={`ghost-${idx}`}
                  className="h-8 md:h-9 w-full flex items-center justify-center text-outline-variant/25 text-xs"
                >
                  {day}
                </div>
              );
            }

            const isStart   = isSameDay(date, start);
            const isEnd     = isSameDay(date, end);
            const inRange   = isInRange(date, start, previewEnd);
            const isHoverEnd = !end && isSameDay(date, hoverDate) && start && date.getTime() > start.getTime();
            const today     = isToday(date);

            const eventKey   = `${year}-${month}-${day}`;
            const badgeSet   = dateIndicatorMap?.get(eventKey);
            const activeBadges = badgeSet ? Array.from(badgeSet) : [];
            const holidayName  = holidayMap?.get(eventKey);

            let cellClass = "h-8 md:h-9 w-full flex items-center justify-center text-xs rounded-lg cursor-pointer relative select-none ";

            if (isStart || isEnd) {
              cellClass += "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-md shadow-primary/30 z-10 scale-105 ";
            } else if (isHoverEnd) {
              cellClass += "bg-primary/30 text-primary font-semibold rounded-xl ring-1 ring-primary/40 z-10 scale-105 ";
            } else if (inRange) {
              cellClass += "in-range bg-secondary-container/50 text-on-secondary-container rounded-none ";
            } else {
              cellClass += "calendar-cell text-on-surface-variant ";
              if (today) cellClass += "ring-2 ring-outline/40 ring-inset font-semibold ";
              if (holidayName) cellClass += "text-rose-500 dark:text-rose-400 ";
            }

            return (
              <div
                key={`day-${day}-${month}`}
                className={cellClass}
                onClick={() => onDateClick(date)}
                onMouseEnter={() => onDateHover?.(date)}
                role="button"
                tabIndex={0}
                aria-label={`${MONTH_NAMES[month]} ${day}, ${year}${holidayName ? ` — ${holidayName}` : ""}`}
                title={holidayName || undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onDateClick(date);
                  }
                  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    const cells = Array.from(e.currentTarget.closest('[role="grid"]').querySelectorAll('[role="button"]'));
                    const i     = cells.indexOf(e.currentTarget);
                    const delta = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" ? -7 : 7;
                    cells[i + delta]?.focus();
                  }
                }}
              >
                {day}
                {activeBadges.length > 0 && (
                  <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                    {activeBadges.slice(0, 3).map((bId) => (
                      <div key={bId} className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${DOT_COLOR[bId] || "bg-primary"}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* legend — click to toggle category visibility */}
      <div className="mt-3 pt-2 border-t border-outline-variant/15 flex flex-wrap gap-x-2 gap-y-1.5">
        {[
          { id: "holiday",   label: "Holiday",   dot: "bg-rose-400"   },
          { id: "deadline",  label: "Deadline",  dot: "bg-red-500"    },
          { id: "study",     label: "Study",     dot: "bg-blue-500"   },
          { id: "interview", label: "Interview", dot: "bg-green-500"  },
          { id: "contest",   label: "Contest",   dot: "bg-yellow-500" },
          { id: "project",   label: "Project",   dot: "bg-purple-500" },
        ].map(({ id, label, dot }) => {
          const hidden = hiddenCategories?.has(id);
          return (
            <button
              key={id}
              onClick={() => onToggleCategory?.(id)}
              title={hidden ? `Show ${label}` : `Hide ${label}`}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150 border ${
                hidden
                  ? "border-outline-variant/20 text-on-surface-variant/30 line-through opacity-50"
                  : "border-outline-variant/20 text-on-surface-variant/60 hover:border-outline-variant/50 hover:text-on-surface-variant"
              }`}
              aria-pressed={!hidden}
              aria-label={`${hidden ? "Show" : "Hide"} ${label}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hidden ? "bg-on-surface-variant/20" : dot}`} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
