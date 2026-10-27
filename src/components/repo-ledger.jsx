import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { GITHUB_USERNAME, githubFetch, githubRoutes } from "@/lib/github";
import { cn } from "@/lib/utils";

const VISIBLE = 8;
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function ago(iso) {
  const days = Math.round((new Date(iso) - Date.now()) / 864e5);
  if (days > -30) return rtf.format(days, "day");
  if (days > -365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

function SkeletonRows() {
  return Array.from({ length: 4 }, (_, i) => (
    <li
      key={i}
      aria-hidden
      className="grid animate-pulse gap-3 border-t border-border py-7 sm:grid-cols-[4.5rem_1fr_auto]"
    >
      <span className="h-3 w-10 rounded bg-muted" />
      <span className="space-y-3">
        <span className="block h-7 w-2/3 rounded bg-muted" />
        <span className="block h-3 w-full max-w-md rounded bg-muted" />
      </span>
      <span className="h-3 w-24 rounded bg-muted" />
    </li>
  ));
}

function Row({ repo }) {
  return (
    <li className="border-t border-border">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="group grid gap-x-6 gap-y-3 px-1 py-7 outline-none transition-colors duration-300 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-accent sm:grid-cols-[4.5rem_1fr_auto] sm:px-3"
      >
        <span className="pt-2 font-mono text-xs tabular-nums text-muted-foreground">
          {new Date(repo.pushed_at).getFullYear()}
        </span>

        <span className="min-w-0">
          <span className="flex items-start gap-2">
            <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat font-serif text-2xl leading-tight tracking-tight transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [overflow-wrap:anywhere] group-hover:bg-[length:100%_2px] group-focus-visible:bg-[length:100%_2px] sm:text-3xl">
              {repo.name}
            </span>
            <ArrowUpRight
              aria-hidden
              className="mt-1.5 size-5 shrink-0 -translate-x-1 translate-y-1 text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            />
          </span>
          <span className="mt-2 block max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            {repo.description ?? "No description yet."}
          </span>
        </span>

        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 font-mono text-xs tabular-nums text-muted-foreground sm:flex-col sm:items-end sm:gap-y-2">
          {repo.language && (
            <span className="text-foreground">{repo.language}</span>
          )}
          <span className="flex items-center gap-3">
            {repo.stargazers_count > 0 && (
              <span className="flex items-center gap-1">
                <Star aria-label="stars" className="size-3" />
                {repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span className="flex items-center gap-1">
                <GitFork aria-label="forks" className="size-3" />
                {repo.forks_count}
              </span>
            )}
          </span>
          <span>pushed {ago(repo.pushed_at)}</span>
        </span>
      </a>
    </li>
  );
}

export default function RepoLedger() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    githubFetch(githubRoutes.repos(undefined, { perPage: 100 }), ctrl.signal)
      .then((all) =>
        setRepos(
          all
            .filter((r) => !r.fork && !r.archived)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)),
        ),
      )
      .catch((e) => e.name !== "AbortError" && setError(e.message));
    return () => ctrl.abort();
  }, [attempt]);

  const retry = () => {
    setError(null);
    setRepos(null);
    setAttempt((n) => n + 1);
  };

  const languages = useMemo(() => {
    const counts = {};
    repos?.forEach((r) => r.language && (counts[r.language] = (counts[r.language] ?? 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  const filtered = repos?.filter((r) => lang === "All" || r.language === lang);
  const shown = showAll ? filtered : filtered?.slice(0, VISIBLE);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <h3 className="font-serif text-3xl tracking-tight sm:text-4xl">
          Everything I&apos;ve pushed
          <span className="ml-3 font-mono text-sm tabular-nums text-muted-foreground">
            {repos ? repos.length : "…"} repos
          </span>
        </h3>

        {languages.length > 0 && (
          <div role="group" aria-label="Filter by language" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            {[["All", repos.length], ...languages].map(([name, n]) => (
              <button
                key={name}
                type="button"
                aria-pressed={lang === name}
                onClick={() => {
                  setLang(name);
                  setShowAll(false);
                }}
                className={cn(
                  "py-1 text-xs font-normal underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent",
                  lang === name
                    ? "text-foreground decoration-accent"
                    : "text-muted-foreground",
                )}
              >
                {name} <span className="tabular-nums opacity-60">{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="mt-8 border-b border-border" aria-busy={!repos && !error}>
        {error ? (
          <li className="border-t border-border py-10 text-sm text-muted-foreground">
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
          </li>
        ) : !repos ? (
          <SkeletonRows />
        ) : shown.length === 0 ? (
          <li className="border-t border-border py-10 text-sm text-muted-foreground">
            No public repositories match.
          </li>
        ) : (
          shown.map((repo) => <Row key={repo.id} repo={repo} />)
        )}
      </ul>

      {filtered && filtered.length > VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-foreground"
        >
          {showAll ? "Show fewer" : `Show all ${filtered.length}`}
        </button>
      )}
    </div>
  );
}
