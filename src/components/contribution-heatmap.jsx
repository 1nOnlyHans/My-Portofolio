import { useEffect, useRef, useState } from "react";
import { githubFetch, githubRoutes } from "@/lib/github";

const LEVELS = ["bg-muted", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
const monthFmt = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const dayFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Pad the start to a Sunday, then chunk into week columns.
function toWeeks(days) {
  const cells = [...Array(new Date(days[0].date).getUTCDay()).fill(null), ...days];
  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

export default function ContributionHeatmap({ onTotal, onYear }) {
  const [days, setDays] = useState(null);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("last");
  const scroller = useRef(null);
  const cache = useRef(new Map()); // year -> response, so revisiting a year is instant

  useEffect(() => {
    const apply = (d) => {
      setDays(d.contributions);
      setYears((prev) => (prev.length ? prev : Object.keys(d.total).filter((k) => /^\d{4}$/.test(k)).sort().reverse()));
      if (year === "last") onTotal?.(d.contributions.reduce((s, c) => s + c.count, 0));
      onYear?.(year, d.contributions);
    };
    if (cache.current.has(year)) return apply(cache.current.get(year));
    const ctrl = new AbortController();
    githubFetch(githubRoutes.contributions(undefined, year), ctrl.signal)
      .then((d) => {
        cache.current.set(year, d);
        apply(d);
      })
      .catch(() => {}); // decorative-plus-data; the log below still stands without it
    return () => ctrl.abort();
  }, [onTotal, onYear, year]);

  // Latest view starts scrolled to today on narrow screens; a past year starts in January.
  useEffect(() => {
    if (days && scroller.current) scroller.current.scrollLeft = year === "last" ? scroller.current.scrollWidth : 0;
  }, [days, year]);

  if (!days?.length) return null;

  const weeks = toWeeks(days);
  const total = days.reduce((s, c) => s + c.count, 0);
  const period = year === "last" ? "the last year" : year;

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <figure className="min-w-0 flex-1">
      <div ref={scroller} className="overflow-x-auto pb-3">
        <div
          role="img"
          aria-label={`${total} contributions in ${period}, shown as a daily heatmap`}
          className="flex w-max gap-[3px]"
        >
          {weeks.map((week, wi) => {
            const first = week.find(Boolean);
            const month = new Date(first.date).getUTCMonth();
            const prev = wi > 0 && new Date(weeks[wi - 1].find(Boolean).date).getUTCMonth();
            const next = weeks[wi + 1]?.find(Boolean);
            // Skip the label when the next column starts a new month (partial edge week) or it's the last column.
            const crowded = next && new Date(next.date).getUTCMonth() !== month;
            const label = month !== prev && next && !crowded ? monthFmt.format(new Date(first.date)) : "";
            return (
              <div key={wi} className="flex flex-col gap-[3px]">
                <span aria-hidden className="mb-1 h-4 w-0 overflow-visible whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {label}
                </span>
                {Array.from({ length: 7 }, (_, di) => {
                  const c = week[di];
                  return c ? (
                    <span
                      key={di}
                      title={`${c.count} contribution${c.count === 1 ? "" : "s"} on ${dayFmt.format(new Date(c.date))}`}
                      className={`size-3 rounded-[3px] ${LEVELS[c.level]} transition-transform hover:scale-125`}
                    />
                  ) : (
                    <span key={di} className="size-3" />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span className="tabular-nums">{total.toLocaleString()} contributions in {period}</span>
        <span aria-hidden className="flex items-center gap-1.5">
          less
          {LEVELS.map((l) => (
            <span key={l} className={`size-3 rounded-[3px] ${l}`} />
          ))}
          more
        </span>
      </figcaption>
      </figure>
      {years.length > 0 && (
        <div role="group" aria-label="Contribution year" className="flex flex-wrap gap-2 font-mono text-xs lg:w-24 lg:flex-col lg:gap-1">
          {["last", ...years].map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={year === y}
              onClick={() => setYear(y)}
              className={`rounded-md px-3 py-2 text-left transition-colors ${
                year === y ? "bg-accent text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {y === "last" ? "Latest" : y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
