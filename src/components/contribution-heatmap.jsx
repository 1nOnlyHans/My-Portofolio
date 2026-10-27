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

export default function ContributionHeatmap({ onTotal }) {
  const [days, setDays] = useState(null);
  const scroller = useRef(null);

  useEffect(() => {
    const ctrl = new AbortController();
    githubFetch(githubRoutes.contributions(), ctrl.signal)
      .then((d) => {
        setDays(d.contributions);
        onTotal?.(d.contributions.reduce((s, c) => s + c.count, 0));
      })
      .catch(() => {}); // decorative-plus-data; the log below still stands without it
    return () => ctrl.abort();
  }, [onTotal]);

  // Start scrolled to today on narrow screens.
  useEffect(() => {
    if (days && scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [days]);

  if (!days?.length) return null;

  const weeks = toWeeks(days);
  const total = days.reduce((s, c) => s + c.count, 0);

  return (
    <figure className="w-full">
      <div ref={scroller} className="overflow-x-auto pb-3">
        <div
          role="img"
          aria-label={`${total} contributions over the last year, shown as a daily heatmap`}
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
        <span className="tabular-nums">{total.toLocaleString()} contributions in the last year</span>
        <span aria-hidden className="flex items-center gap-1.5">
          less
          {LEVELS.map((l) => (
            <span key={l} className={`size-3 rounded-[3px] ${l}`} />
          ))}
          more
        </span>
      </figcaption>
    </figure>
  );
}
