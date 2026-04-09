import { useMemo } from "react";
import { BADGES, MONTH_NAMES } from "./constants";

function formatDateRange(start, end) {
  if (!start) return "";
  const fmt = (d) => `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

const BADGE_THEME = {
  deadline:  { border: "#ef4444", bg: "rgba(239,68,68,0.06)",   dateColor: "#ef4444", textColor: "rgba(185,28,28,0.85)",  darkText: "rgba(252,165,165,0.8)"  },
  study:     { border: "#3b82f6", bg: "rgba(59,130,246,0.06)",  dateColor: "#3b82f6", textColor: "rgba(29,78,216,0.85)",  darkText: "rgba(147,197,253,0.8)"  },
  interview: { border: "#22c55e", bg: "rgba(34,197,94,0.06)",   dateColor: "#22c55e", textColor: "rgba(21,128,61,0.85)",  darkText: "rgba(134,239,172,0.8)"  },
  contest:   { border: "#eab308", bg: "rgba(234,179,8,0.06)",   dateColor: "#ca8a04", textColor: "rgba(161,98,7,0.85)",   darkText: "rgba(253,224,71,0.8)"   },
  project:   { border: "#a855f7", bg: "rgba(168,85,247,0.06)",  dateColor: "#a855f7", textColor: "rgba(126,34,206,0.85)", darkText: "rgba(216,180,254,0.8)"  },
  holiday:   { border: "#fb7185", bg: "rgba(251,113,133,0.06)", dateColor: "#fb7185", textColor: "rgba(190,18,60,0.85)",  darkText: "rgba(253,164,175,0.8)"  },
};

export default function NotesPanel({
  selectedRange,
  rangeData,
  onRangeDataChange,
  onArchive,
  currentMonthEvents,
  onEventSelect,
  slideDirection,
  animating,
}) {
  const { start, end } = selectedRange;
  const { text = "", badges = [] } = rangeData || {};
  const hasRange = start !== null;

  const activeKey = start
    ? `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}_${
        end
          ? `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`
          : `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`
      }`
    : null;

  const handleTextChange = (e) => onRangeDataChange({ text: e.target.value, badges });

  const toggleBadge = (bId) => {
    const next = badges.includes(bId) ? badges.filter((id) => id !== bId) : [...badges, bId];
    onRangeDataChange({ text, badges: next });
  };

  const handleTextKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const activeEventIsHoliday = currentMonthEvents?.find(
    (ev) => ev.dateKey === activeKey && ev.readonly
  );
  const canDelete = hasRange && !activeEventIsHoliday;

  const contentAnimClass = useMemo(() => {
    if (animating) return slideDirection === "left" ? "animate-slide-out-left" : "animate-slide-out-right";
    if (slideDirection === "left") return "animate-slide-in-left";
    if (slideDirection === "right") return "animate-slide-in-right";
    return "";
  }, [animating, slideDirection]);

  return (
    <div id="notes-panel" className="flex flex-col gap-3 md:gap-4 h-full">
      {hasRange ? (
        <div className="glass-panel rounded-xl p-3 border-l-4 border-primary shadow-md paper-texture flex flex-col gap-2 h-[200px] shrink-0 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <div className="text-[10px] font-bold text-primary tracking-widest uppercase leading-none mb-0.5">
                {end ? "Range Note" : "Date Note"}
              </div>
              <div className="text-xs text-on-surface-variant font-medium">
                {formatDateRange(start, end)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEventSelect?.(activeKey)}
                title="Deselect"
                className="p-1.5 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Deselect date"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <button
                onClick={onArchive}
                title="Delete this note"
                className="p-1.5 rounded-full text-on-surface-variant/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Delete note"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {BADGES.map((b) => {
              const active = badges.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBadge(b.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all duration-150 ${
                    active
                      ? b.color + " border-transparent shadow-sm"
                      : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest/30"
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>

          <textarea
            id="range-note-input"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleTextKeyDown}
            placeholder="Add a note for this date… (Enter to save, Shift+Enter for new line)"
            className="flex-1 w-full bg-surface-container-lowest/50 dark:bg-surface-container-lowest/20 rounded-lg p-2.5 text-on-surface dark:text-on-surface text-sm leading-relaxed resize-none border border-outline-variant/20 outline-none placeholder:text-outline/60 focus:ring-1 focus:ring-primary/40 custom-scrollbar transition-shadow"
          />
        </div>
      ) : (
        <div className="glass-panel rounded-xl shadow-md paper-texture flex flex-col items-center justify-center text-center gap-1.5 h-[200px] shrink-0">
          <span className="material-symbols-outlined text-3xl text-outline-variant/40">date_range</span>
          <p className="text-on-surface-variant/60 text-sm font-medium">Select a date or range</p>
          <p className="text-on-surface-variant/35 text-xs">Click a day · click again to set end date</p>
        </div>
      )}

      <div className="glass-panel rounded-xl p-3 shadow-[0px_20px_50px_rgba(25,28,29,0.06)] dark:shadow-[0px_20px_50px_rgba(0,0,0,0.2)] flex flex-col gap-2 paper-texture h-[260px] shrink-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2 shrink-0">
          <h3 className="text-base font-bold tracking-tight text-on-surface">Monthly Notes</h3>
          {canDelete && (
            <button
              onClick={onArchive}
              title="Delete selected note"
              className="p-1 rounded-full transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              aria-label="Delete selected note"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
          {hasRange && !canDelete && (
            <span
              className="material-symbols-outlined text-[16px] text-rose-400/50"
              title="Holiday — cannot delete"
            >
              lock
            </span>
          )}
        </div>

        {currentMonthEvents?.length > 0 ? (
          <div
            key={`events-${slideDirection}-${animating}`}
            className={`space-y-1 overflow-y-auto custom-scrollbar flex-1 min-h-0 ${contentAnimClass}`}
          >
            {currentMonthEvents.every((ev) => ev.readonly) && (
              <p className="text-[10px] text-on-surface-variant/35 italic px-1 pb-1">
                Only holidays this month. Select a date to add your own event.
              </p>
            )}
            {currentMonthEvents.map((ev, i) => {
              const isActive    = ev.dateKey === activeKey;
              const primaryBadge = ev.badges[0] || (ev.readonly ? "holiday" : null);
              const theme       = BADGE_THEME[primaryBadge] || null;

              const rowStyle  = isActive ? {} : theme ? { borderLeftColor: theme.border, backgroundColor: theme.bg } : {};
              const dateStyle = isActive ? {} : theme ? { color: theme.dateColor } : {};
              const textStyle = isActive ? {} : theme ? { color: theme.textColor } : {};

              return (
                <button
                  key={i}
                  onClick={() => onEventSelect?.(ev.dateKey)}
                  style={rowStyle}
                  className={`w-full text-left flex flex-col gap-0.5 pl-2 pr-1 py-1 rounded-lg border-l-2 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/8 dark:bg-primary/15"
                      : "border-outline-variant/25 hover:brightness-95 dark:hover:brightness-110"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Select event on ${ev.dateStr}`}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      style={dateStyle}
                      className={`text-[10px] font-bold shrink-0 w-8 ${isActive ? "text-primary" : ""}`}
                    >
                      {ev.dateStr}
                    </span>
                    {ev.badges.map((bId) => {
                      const info = BADGES.find((b) => b.id === bId);
                      if (!info) return null;
                      return (
                        <span key={bId} className={`px-1.5 py-0.5 text-[9px] rounded font-semibold text-white ${info.dot}`}>
                          {info.label}
                        </span>
                      );
                    })}
                    {ev.readonly && (
                      <span
                        className="material-symbols-outlined text-[10px] ml-auto"
                        style={{ color: theme?.dateColor, opacity: 0.5 }}
                      >
                        lock
                      </span>
                    )}
                  </div>
                  {ev.text && (
                    <p
                      style={isActive ? {} : textStyle}
                      className={`text-[11px] leading-snug truncate italic ${isActive ? "text-on-surface font-medium not-italic" : ""}`}
                    >
                      {ev.text}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className={`text-[11px] text-on-surface-variant/40 italic shrink-0 ${contentAnimClass}`}>
            No events this month. Select a date to add one.
          </p>
        )}
      </div>
    </div>
  );
}
