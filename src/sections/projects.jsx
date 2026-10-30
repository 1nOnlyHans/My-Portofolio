import { ArrowRight } from "lucide-react";
import { useContent } from "../lib/content";
import ScrollReveal from "../components/ui/scroll-reveal";
import RepoLedger from "../components/repo-ledger";
import ProjectCard from "../components/project-card";

const mono = { fontFamily: "'DM Mono', monospace" };
const FEATURED = 3;

export default function Projects() {
  const projects = useContent("projects");
  return (
    <section id="projects" className="portfolio-section flex-col items-stretch justify-center">
      <ScrollReveal className="flex w-full items-end justify-between gap-6">
        <div>
          <span className="section-label">Selected work</span>
          <h2 className="section-title">
            Selected <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Projects</span>
          </h2>
        </div>
        <span
          className="hidden pb-2 text-xs uppercase tracking-widest text-muted-foreground sm:block"
          style={mono}
        >
          {String(projects.length).padStart(2, "0")} entries
        </span>
      </ScrollReveal>

      <div className="mt-12 w-full space-y-16 sm:space-y-20">
        {projects.slice(0, FEATURED).map((project, index) => (
          <ScrollReveal key={project.title} delay={Math.min(index * 0.08, 0.24)}>
            <ProjectCard project={project} index={index} />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="mt-16 w-full border-t border-border pt-8">
        <a
          href="/projects"
          className="group inline-flex items-center gap-3 text-xs uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          style={mono}
        >
          See all projects ({String(projects.length).padStart(2, "0")})
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </a>
      </ScrollReveal>

      <ScrollReveal className="mt-24 w-full">
        <RepoLedger />
      </ScrollReveal>
    </section>
  );
}
