import ScrollReveal from "../components/ui/scroll-reveal";

function SkillBar({ name, level }) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-sm"
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
          style={{ width: `${level}%`, background: "var(--foreground)" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const skills = [
    {
      frontend: [
        {
          ReactJS: 80,
          VueJS: 90,
          HTML: 95,
          CSS: 90,
          JavaScript: 85,
        },
      ],
    },
    {
      backend: [
        {
          PHP: 85,
          Laravel: 80,
          MySQL: 90,
          "Restful APIs": 85,
        },
      ],
    },
    {
      databases: [
        {
          MySQL: 90,
          PostgreSQL: 85,
        },
      ],
    },
  ];
  return (
    <section
      id="skills"
      className="portfolio-section flex-col items-stretch justify-center"
    >
      <ScrollReveal className="w-full">
        <span className="section-label">03 / Skills</span>
        <h2 className="section-title">My Technical Expertise</h2>
      </ScrollReveal>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((category, index) => {
          const categoryName = Object.keys(category)[0];
          const skillSet = category[categoryName][0];
          return (
            <ScrollReveal key={index} delay={index * 0.12}>
              <h3
                className="mb-4 text-sm uppercase text-muted-foreground tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {categoryName}
              </h3>
              {Object.entries(skillSet).map(([skill, level], idx) => (
                <SkillBar key={idx} name={skill} level={level} />
              ))}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
