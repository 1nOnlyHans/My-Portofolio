import ScrollReveal from "../components/ui/scroll-reveal";
import { useContent } from "../lib/content";

function SkillBar({ name, level }) {
  return (
    <div className="group border-b border-border py-3 last:border-0">
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-sm transition-colors group-hover:text-accent"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            color: "var(--foreground)",
          }}
        >
          {name}
        </span>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {level}%
        </span>
      </div>
      <div className="h-px bg-border w-full relative overflow-hidden">
        <div
          className="h-full absolute top-0 left-0"
          style={{ width: `${level}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const skills = useContent("skills");
  return (
    <section
      id="skills"
      className="portfolio-section flex-col items-stretch justify-center"
    >
      <ScrollReveal className="w-full">
        <span className="section-label">04 / Skills</span>
        <h2 className="section-title">
          My Technical <em>Expertise</em>
        </h2>
      </ScrollReveal>
      <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
        {skills.map((category, index) => {
          return (
            <ScrollReveal
              key={index}
              delay={index * 0.12}
              className="border-t border-border pt-5"
            >
              <span
                className="text-xs tracking-widest text-accent"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className="mb-5 mt-2 text-3xl capitalize text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.02em",
                }}
              >
                {category.category}
              </h3>
              {category.items.map(({ name, level }, idx) => (
                <SkillBar key={idx} name={name} level={level} />
              ))}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
