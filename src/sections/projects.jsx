import projects from "../data/projects";
import ScrollReveal from "../components/ui/scroll-reveal";

export default function Projects() {
  return (
    <section
      id="projects"
      className="portfolio-section flex-col items-stretch justify-center"
    >
      <ScrollReveal className="w-full">
        <span className="section-label"> 01 / Work</span>
        <h2 className="section-title">Selected Projects</h2>
      </ScrollReveal>
      <div className="mt-10 w-full">
        {projects.map((project, index) => (
          <ScrollReveal
            key={index}
            className="mb-8 rounded-lg border border-muted bg-card p-6 transition-transform hover:-translate-y-1"
            delay={Math.min(index * 0.1, 0.3)}
          >
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-muted px-2 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
