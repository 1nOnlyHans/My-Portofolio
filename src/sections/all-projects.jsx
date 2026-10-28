import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useContent } from "@/lib/content";
import useSavedTheme from "@/lib/use-saved-theme";
import ProjectCard from "@/components/project-card";

const mono = { fontFamily: "'DM Mono', monospace" };

const PAGE_SIZE = 4;
const href = (n) => (n === 1 ? "/projects" : `/projects?page=${n}`);

// plain links: each page is a real URL, so it can be shared and the back button works
function PageLink({ to, disabled, label, children }) {
  const cls = "inline-flex items-center gap-2 transition-colors";
  return disabled ? (
    <span aria-disabled="true" className={`${cls} opacity-40`}>{children}</span>
  ) : (
    <a href={href(to)} aria-label={label} className={`${cls} hover:text-accent`}>{children}</a>
  );
}

export default function AllProjects() {
  const projects = useContent("projects");
  const pages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const requested = Number(new URLSearchParams(window.location.search).get("page")) || 1;
  const page = Math.min(Math.max(1, requested), pages);
  const start = (page - 1) * PAGE_SIZE;
  useSavedTheme();
  useEffect(() => {
    document.title = "All projects — Hans Diaz";
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 text-foreground">
      <a
        href="/#projects"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        style={mono}
      >
        <ArrowLeft size={14} /> Back home
      </a>

      <header className="mt-10 flex items-end justify-between gap-6">
        <h1 className="section-title">
          All <em>Projects</em>
        </h1>
        <span className="pb-2 text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
          {String(projects.length).padStart(2, "0")} entries
        </span>
      </header>

      <div className="mt-12 space-y-16 sm:space-y-20">
        {projects.slice(start, start + PAGE_SIZE).map((project, i) => (
          <ProjectCard key={project.title} project={project} index={start + i} />
        ))}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-20 flex items-center justify-between gap-4 border-t border-border pt-8 text-xs uppercase tracking-widest" style={mono}>
          <PageLink to={page - 1} disabled={page === 1} label="Previous page">
            <ArrowLeft size={14} /> Prev
          </PageLink>
          <ul className="flex items-center gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <a
                  href={href(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Page ${n}`}
                  className={`grid size-9 place-items-center border transition-colors ${
                    n === page
                      ? "border-accent text-accent"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {n}
                </a>
              </li>
            ))}
          </ul>
          <PageLink to={page + 1} disabled={page === pages} label="Next page">
            Next <ArrowRight size={14} />
          </PageLink>
        </nav>
      )}
    </div>
  );
}
