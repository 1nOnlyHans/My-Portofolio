import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, X } from "lucide-react";
import { Dialog } from "radix-ui";
import ScrollReveal from "../components/ui/scroll-reveal";
import { type, traits, areas, proof } from "../data/personality";

const mono = { fontFamily: "'DM Mono', monospace" };
const serif = { fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.01em" };

function Trait({ left, right, side, pct }) {
  const active = side === "left" ? left : right;
  // marker position from the left edge: the named side is where the % points
  const at = side === "left" ? 100 - pct : pct;
  return (
    <li className="py-4">
      <p className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-foreground">{active}</span>
        <span className="text-xs tabular-nums text-accent" style={mono}>
          {pct}%
        </span>
      </p>
      <div
        role="img"
        aria-label={`${pct}% ${active}, on a scale from ${left} to ${right}`}
        className="relative mt-3 h-px bg-border"
      >
        {/* centre tick */}
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-2 w-px -translate-y-1/2 bg-border" />
        <span
          aria-hidden="true"
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background"
          style={{ left: `${at}%` }}
        />
      </div>
      <p
        className="mt-2 flex justify-between text-[0.7rem] uppercase tracking-widest text-muted-foreground"
        style={mono}
      >
        <span>{left}</span>
        <span>{right}</span>
      </p>
    </li>
  );
}

function Column({ title, items, Icon, tone }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
        {title}
      </h4>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {items.map(([name, text]) => (
          <li key={name} className="flex gap-3 py-4">
            <Icon aria-hidden="true" className={`mt-1 size-3.5 shrink-0 ${tone}`} />
            <div>
              <p className="text-base leading-snug text-foreground" style={serif}>
                {name}
              </p>
              <p className="mt-1.5 max-w-[60ch] text-sm text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// fanned deck: cards pivot around the centre card; hover (sm+) or focus spreads them
function ProofDeck() {
  const [open, setOpen] = useState(null);
  const step = (d) => setOpen((open + d + proof.length) % proof.length);
  const mid = (proof.length - 1) / 2;

  return (
    <>
      <ul
        aria-label="Assessment screenshots"
        className="group/deck relative mx-auto mt-8 h-64 max-w-3xl [--rot:6deg] [--step:2.25rem] sm:h-80 sm:[--step:4rem] sm:hover:[--rot:3deg] sm:hover:[--step:7rem] sm:focus-within:[--rot:3deg] sm:focus-within:[--step:7rem]"
      >
        {proof.map(({ label, src }, i) => (
          <li
            key={label}
            className="absolute left-1/2 top-0 -ml-[5.5rem] w-44 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-20 focus-within:z-20 motion-reduce:transition-none sm:-ml-[7rem] sm:w-56"
            style={{
              zIndex: i,
              transform: `translateX(calc(${i - mid} * var(--step))) rotate(calc(${i - mid} * var(--rot))) translateY(var(--lift, 0px))`,
              transformOrigin: "50% 120%",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open screenshot: ${label}`}
              className="group block w-full cursor-zoom-in border border-border bg-background p-2 text-left transition-transform duration-300 hover:-translate-y-3 focus-visible:-translate-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              <span className="block aspect-[4/3] overflow-hidden bg-secondary">
                <img src={src} alt="" loading="lazy" className="size-full object-cover object-top" />
              </span>
              <span
                className="mt-2 block text-[0.7rem] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent"
                style={mono}
              >
                {String(i + 1).padStart(2, "0")} / {label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") step(-1);
              if (e.key === "ArrowRight") step(1);
            }}
            className="fixed inset-x-3 bottom-3 top-3 z-[60] flex flex-col border border-border bg-background outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 sm:inset-x-6 lg:left-[calc(15rem+1.5rem)] lg:mx-auto lg:max-w-5xl motion-reduce:animate-none"
          >
            {open !== null && (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
                  <Dialog.Title className="text-xs uppercase tracking-widest text-accent" style={mono}>
                    {String(open + 1).padStart(2, "0")} / {String(proof.length).padStart(2, "0")} · {proof[open].label}
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close screenshot"
                    className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <X size={18} aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <div className="relative min-h-0 flex-1 overflow-auto bg-secondary">
                  <img
                    src={proof[open].src}
                    alt={`16Personalities screenshot: ${proof[open].label}`}
                    className="mx-auto w-full max-w-4xl"
                  />
                </div>
                <div className="flex justify-between border-t border-border px-3 py-2">
                  {[-1, 1].map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-label={d < 0 ? "Previous screenshot" : "Next screenshot"}
                      onClick={() => step(d)}
                      className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {d < 0 ? <ChevronLeft size={20} aria-hidden="true" /> : <ChevronRight size={20} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default function Personality() {
  const [tab, setTab] = useState(0);
  const area = areas[tab];

  return (
    <section id="personality" aria-labelledby="personality-title" className="portfolio-section flex-col items-stretch justify-center">
      <ScrollReveal className="w-full">
        <span className="section-label">Personality</span>
        <h2 id="personality-title" className="section-title">
          Personality <em>Traits</em>
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
          How I work, grow and relate to people, from a 16Personalities assessment. Screenshots of the full results are below as proof.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mt-12 grid gap-10 border-t border-border pt-6 md:grid-cols-[16rem_1fr] md:gap-14">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
            Type
          </p>
          <p className="mt-2 text-5xl italic text-foreground" style={{ ...serif, letterSpacing: "-0.02em" }}>
            {type.name}
          </p>
          <p className="mt-2 text-sm tracking-widest text-accent" style={mono}>
            {type.code}
          </p>
        </div>
        <ul className="divide-y divide-border">
          {traits.map((t) => (
            <Trait key={t.left} {...t} />
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal className="mt-14">
        <div role="tablist" aria-label="Life area" className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border">
          {areas.map((a, i) => (
            <button
              key={a.name}
              type="button"
              role="tab"
              id={`personality-tab-${i}`}
              aria-selected={tab === i}
              aria-controls="personality-panel"
              onClick={() => setTab(i)}
              className={`-mb-px border-b pb-3 text-xs uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${
                tab === i ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={mono}
            >
              {a.name}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id="personality-panel"
          aria-labelledby={`personality-tab-${tab}`}
          className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12"
        >
          <Column title="Strengths" items={area.strengths} Icon={Check} tone="text-accent" />
          <Column title="Weaknesses" items={area.weaknesses} Icon={Minus} tone="text-muted-foreground" />
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-14 border-t border-border pt-6">
        <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={mono}>
          Proof / Assessment screenshots
        </h3>
        <ProofDeck />
      </ScrollReveal>    </section>
  );
}
