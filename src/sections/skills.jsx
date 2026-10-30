import ScrollReveal from "../components/ui/scroll-reveal";
import TechIcon from "../components/tech-icon";
import { useContent } from "../lib/content";

const mono = { fontFamily: "'DM Mono', monospace" };

function Skill({ name, level }) {
  return (
    <li className="group relative flex flex-col justify-between gap-6 bg-background p-4 sm:p-5">
      <TechIcon
        name={name}
        size={28}
        className="text-muted-foreground transition-colors duration-300 group-hover:text-accent"
      />
      <div>
        <p className="text-sm text-foreground">{name}</p>
        <p className="mt-1 text-xs tabular-nums text-muted-foreground" style={mono}>
          {level}%
        </p>
      </div>
      {/* proficiency as a hairline along the tile's base */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px bg-accent/60 transition-[height,background-color] duration-300 group-hover:h-0.5 group-hover:bg-accent motion-reduce:transition-none"
        style={{ width: `${level}%` }}
      />
    </li>
  );
}

export default function Skills() {
  const skills = useContent("skills");
  return (
    <section id="skills" className="portfolio-section flex-col items-stretch justify-center">
      <ScrollReveal className="w-full">
        <span className="section-label">Skills</span>
        <h2 className="section-title">
          My Technical <em>Expertise</em>
        </h2>
      </ScrollReveal>

      <div className="mt-12 space-y-12">
        {skills.map((category, index) => (
          <ScrollReveal
            key={index}
            delay={index * 0.1}
            className="grid gap-5 border-t border-border pt-5 md:grid-cols-[11rem_1fr] md:gap-10"
          >
            <div>
              <h3
                className="text-3xl capitalize text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.02em",
                }}
              >
                {category.category}
              </h3>
              <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
                {category.items.length} tools
              </span>
            </div>

            {/* gap-px over a border-coloured ground draws the hairlines between tiles */}
            <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
              {category.items.map(({ name, level }) => (
                <Skill key={name} name={name} level={level} />
              ))}
            </ul>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
