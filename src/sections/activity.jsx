import { useCallback, useEffect, useMemo, useState } from "react";
import ScrollReveal from "../components/ui/scroll-reveal";
import ContributionHeatmap from "../components/contribution-heatmap";
import { GITHUB_USERNAME, githubFetch, githubRoutes } from "@/lib/github";

const DAYS_VISIBLE = 5;
const dayKey = (d) => d.toLocaleDateString("en-CA");
const timeFmt = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false });
const dateFmt = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" });

function dayLabel(d) {
  const diff = Math.round((new Date(dayKey(new Date())) - new Date(dayKey(d))) / 864e5);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return dateFmt.format(d);
}

// Map a raw GitHub event to a verb + optional detail lines.
function describe(e) {
  const p = e.payload;
  switch (e.type) {
    case "PushEvent": {
      const n = p.size ?? p.commits?.length ?? 1;
      return {
        verb: `pushed ${n} commit${n === 1 ? "" : "s"}`,
        lines: (p.commits ?? []).slice(-3).reverse().map((c) => c.message.split("\n")[0]),
      };
    }
    case "CreateEvent":
      return { verb: `created ${p.ref_type}${p.ref_type === "repository" ? "" : ` ${p.ref}`}` };
    case "DeleteEvent":
      return { verb: `deleted ${p.ref_type} ${p.ref}` };
    case "WatchEvent":
      return { verb: "starred" };
    case "ForkEvent":
      return { verb: "forked" };
    case "PullRequestEvent":
      return { verb: `${p.action} pull request`, lines: [p.pull_request?.title] };
    case "IssuesEvent":
      return { verb: `${p.action} issue`, lines: [p.issue?.title] };
    case "IssueCommentEvent":
      return { verb: "commented on", lines: [p.issue?.title] };
    case "ReleaseEvent":
      return { verb: `${p.action} release`, lines: [p.release?.name || p.release?.tag_name] };
    case "PublicEvent":
      return { verb: "open-sourced" };
    default:
      return { verb: e.type.replace(/Event$/, "").toLowerCase() };
  }
}

// One day's events → merged entries (consecutive pushes to one repo collapse).
function groupByDay(events) {
  const days = new Map();
  for (const e of events) {
    const at = new Date(e.created_at);
    const key = dayKey(at);
    if (!days.has(key)) days.set(key, { at, entries: [] });
    days.get(key).entries.push({ ...describe(e), repo: e.repo.name, at, type: e.type, size: e.payload.size ?? 1 });
  }
  for (const day of days.values()) {
    const merged = [];
    for (const en of day.entries) {
      const prev = merged.find((m) => m.type === "PushEvent" && en.type === "PushEvent" && m.repo === en.repo);
      if (prev) {
        prev.size += en.size;
        prev.verb = `pushed ${prev.size} commits`;
        prev.lines = [...(prev.lines ?? []), ...(en.lines ?? [])].slice(0, 3);
      } else merged.push(en);
    }
    day.entries = merged;
  }
  return [...days.values()];
}

function Skeleton() {
  return Array.from({ length: 3 }, (_, i) => (
    <div key={i} aria-hidden className="grid animate-pulse gap-3 border-t border-border py-8 sm:grid-cols-[9rem_1fr]">
      <span className="h-3 w-20 rounded bg-muted" />
      <span className="space-y-3">
        <span className="block h-6 w-1/2 rounded bg-muted" />
        <span className="block h-3 w-2/3 rounded bg-muted" />
      </span>
    </div>
  ));
}

function Day({ day }) {
  return (
    <div className="grid gap-x-8 gap-y-4 border-t border-border py-8 sm:grid-cols-[9rem_1fr]">
      <h3 className="font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground sm:pt-2">
        {dayLabel(day.at)}
      </h3>
      <ul className="relative space-y-7 border-l border-border pl-6">
        {day.entries.map((en, i) => (
          <li key={i} className="relative">
            <span aria-hidden className="absolute -left-[1.85rem] top-2.5 size-2 rounded-full bg-accent ring-4 ring-background" />
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {timeFmt.format(en.at)}
              </span>
              <span className="text-sm text-muted-foreground">{en.verb}</span>
              <a
                href={`https://github.com/${en.repo}`}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-xl tracking-tight underline decoration-accent/0 decoration-2 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-accent focus-visible:decoration-accent focus-visible:outline-none"
              >
                {en.repo.split("/").pop()}
              </a>
            </p>
            {en.lines?.filter(Boolean).length > 0 && (
              <ul className="mt-2 max-w-[65ch] space-y-1 text-sm text-muted-foreground">
                {en.lines.filter(Boolean).map((l, j) => (
                  <li key={j} className="truncate">{l}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Activity() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [heatTotal, setHeatTotal] = useState(0);
  const [view, setView] = useState({ year: "last", days: [] });
  const onYear = useCallback((year, days) => {
    setView({ year, days });
    setShowAll(false);
  }, []);
  // Past years: the events API only covers ~90 days, so list that year's active days from the heatmap data.
  const pastDays = useMemo(
    () => (view.year === "last" ? [] : view.days.filter((c) => c.count > 0).reverse()),
    [view],
  );
  const past = view.year !== "last";

  useEffect(() => {
    const ctrl = new AbortController();
    githubFetch(githubRoutes.events(), ctrl.signal)
      .then(setEvents)
      .catch((e) => e.name !== "AbortError" && setError(e.message));
    return () => ctrl.abort();
  }, [attempt]);

  const days = useMemo(() => (events ? groupByDay(events) : []), [events]);
  const shown = showAll ? days : days.slice(0, DAYS_VISIBLE);
  const repoCount = useMemo(() => new Set(events?.map((e) => e.repo.name)).size, [events]);

  const retry = () => {
    setError(null);
    setEvents(null);
    setAttempt((n) => n + 1);
  };

  return (
    <section id="activity" className="portfolio-section flex-col items-stretch justify-center">
      <ScrollReveal className="w-full">
        <span className="section-label">04 / Activity</span>
        <h2 className="section-title">Lately, in the <em>commit log</em></h2>
        {past && (
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            {pastDays.length} active days in {view.year}. GitHub only exposes commit-level detail for recent weeks.
          </p>
        )}
        {!past && events && days.length > 0 && (
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            {events.length} public events across {repoCount} {repoCount === 1 ? "repository" : "repositories"} since{" "}
            {dateFmt.format(new Date(events.at(-1).created_at))}. Straight from GitHub, nothing curated.
          </p>
        )}
      </ScrollReveal>

      <ScrollReveal className="mt-10 w-full" delay={0.1}>
        <ContributionHeatmap onTotal={setHeatTotal} onYear={onYear} />
        <div aria-busy={!past && !events && !error} className="mt-10 border-b border-border">
          {past ? (
            pastDays.length === 0 ? (
              <p className="border-t border-border py-10 text-sm text-muted-foreground">No contributions in {view.year}.</p>
            ) : (
              pastDays.slice(0, showAll ? undefined : DAYS_VISIBLE).map((c) => (
                <div key={c.date} className="grid gap-x-8 gap-y-2 border-t border-border py-6 sm:grid-cols-[9rem_1fr]">
                  <h3 className="font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground">
                    {dateFmt.format(new Date(`${c.date}T12:00`))}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-serif text-xl tracking-tight text-foreground">{c.count}</span>{" "}
                    contribution{c.count === 1 ? "" : "s"}
                  </p>
                </div>
              ))
            )
          ) : error ? (
            <p className="border-t border-border py-10 text-sm text-muted-foreground">
              Couldn&apos;t reach GitHub ({error}).{" "}
              <button
                type="button"
                onClick={retry}
                className="font-normal text-foreground underline decoration-accent decoration-2 underline-offset-4"
              >
                Try again
              </button>{" "}
              or{" "}
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                className="text-foreground underline decoration-accent decoration-2 underline-offset-4"
              >
                browse the profile
              </a>
              .
            </p>
          ) : !events ? (
            <Skeleton />
          ) : days.length === 0 ? (
            <p className="border-t border-border py-10 text-sm text-muted-foreground">
              {heatTotal > 0
                ? "Recent work lives in private repositories, so there's no public log to show. The heatmap above counts it."
                : "No public activity in the last 90 days."}
            </p>
          ) : (
            shown.map((day) => <Day key={dayKey(day.at)} day={day} />)
          )}
        </div>

        {(past ? pastDays : days).length > DAYS_VISIBLE && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-6 font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-foreground"
          >
            {showAll ? "Show fewer days" : `Show all ${(past ? pastDays : days).length} days`}
          </button>
        )}
      </ScrollReveal>
    </section>
  );
}
