import { useContent } from "../lib/content";
import ScrollReveal from "../components/ui/scroll-reveal";
import RepoLedger from "../components/repo-ledger";

const mono = { fontFamily: "'DM Mono', monospace" };

export default function Projects() {
  const projects = useContent("projects");
  return (
    <section
      id="projects"
      className="portfolio-section flex-col items-stretch justify-center"
    >
      <ScrollReveal className="flex w-full items-end justify-between gap-6">
        <div>
          <span className="section-label"> 02 / Work</span>
          <h2 className="section-title">
            Selected{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              Projects
            </span>
          </h2>
        </div>
        <span
          className="hidden pb-2 text-xs uppercase tracking-widest text-muted-foreground sm:block"
          style={mono}
        >
          {String(projects.length).padStart(2, "0")} entries &middot; index
        </span>
      </ScrollReveal>

      <div className="mt-12 w-full border-b border-border">
        {projects.map((project, index) => (
          <ScrollReveal
            key={project.title}
            delay={Math.min(index * 0.1, 0.3)}
            className="group border-t border-border"
          >
            <div
              tabIndex={0}
              className="grid gap-x-6 gap-y-3 py-7 outline-none transition-colors duration-300 focus-visible:bg-secondary/40 md:grid-cols-[4.5rem_1fr_auto] md:items-start md:hover:bg-secondary/40"
            >
              <span
                className="text-xs tracking-widest text-accent md:pt-3"
                style={mono}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3
                  className="text-2xl leading-tight text-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent group-focus-within:translate-x-2 group-focus-within:text-accent motion-reduce:transition-none sm:text-3xl lg:text-4xl"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {project.title}
                </h3>
                {/* always open on touch; expands on hover/focus from md up */}
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr] motion-reduce:transition-none">
                  <p
                    className="max-w-2xl overflow-hidden pt-3 text-sm text-muted-foreground"
                    style={{ fontWeight: 300, lineHeight: 1.75 }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>

              <div
                className="flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-widest text-muted-foreground md:flex-col md:items-end md:pt-3 md:text-right"
                style={mono}
              >
                <span className="text-foreground">{project.year}</span>
                <span>{project.technologies.join(" / ")}</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="mt-16 w-full">
        <RepoLedger />
      </ScrollReveal>
    </section>
  );
}
