import { ArrowRight } from "lucide-react";
import { useContent } from "../lib/content";
import ScrollReveal from "../components/ui/scroll-reveal";

const mono = { fontFamily: "'DM Mono', monospace" };
const FEATURED = 4;

// full = standalone /journey page: every milestone, no teaser limit
export default function Journey({ full = false }) {
  const all = useContent("journey");
  if (!all.length) return null;

  const items = full ? all : all.slice(0, FEATURED);
  const Heading = full ? "h1" : "h2";

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className={full ? "flex flex-col" : "portfolio-section flex-col items-stretch justify-center"}
    >
      <ScrollReveal className="w-full">
        {!full && <span className="section-label">Journey</span>}
        <Heading id="journey-title" className="section-title">
          The <em>Journey</em>
        </Heading>
        <p className="mt-4 max-w-2xl text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
          The milestones that shaped how I build, from my first lines of code to developing full-stack systems and exploring creative technologies.
        </p>
      </ScrollReveal>

      {/* the rail is the list's left border; each dot straddles it */}
      <ol className="mt-12 ml-1.5 w-full border-l border-border">
        {items.map((it, i) => (
          <li key={it.title + i} className="relative pb-10 pl-8 last:pb-0 sm:pl-10">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-accent bg-background"
            />
            <ScrollReveal delay={Math.min(i * 0.06, 0.24)}>
              <p className="text-xs uppercase tracking-widest text-accent" style={mono}>
                {it.period}
              </p>
              <h3
                className="mt-2 text-balance text-xl leading-tight sm:text-2xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                {it.title}
              </h3>
              {it.kind && (
                <p className="mt-2 text-[0.7rem] uppercase tracking-widest text-foreground" style={mono}>
                  {it.kind}
                </p>
              )}
              {it.place && (
                <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-muted-foreground" style={mono}>
                  {it.place}
                </p>
              )}
              {it.description && (
                <p className="mt-3 max-w-[60ch] text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
                  {it.description}
                </p>
              )}
            </ScrollReveal>
          </li>
        ))}
      </ol>

      {!full && all.length > FEATURED && (
        <a
          href="/journey"
          className="group mt-10 inline-flex w-fit items-center gap-3 text-xs uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          style={mono}
        >
          See full journey ({String(all.length).padStart(2, "0")})
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </a>
      )}
    </section>
  );
}
