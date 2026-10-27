import { useState, useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import ScrollReveal from "../components/ui/scroll-reveal";
import { useContent } from "../lib/content";
import heroLight from "../assets/images/hans hero light.jpg";
import heroDark from "../assets/images/hans hero dark.jpg";

function HeroName() {
  const p = useContent("profile");
  return (
    <div className="space-y-8">
      <span
        className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <span className="h-px w-10 bg-accent" />
        {p.tagline}
      </span>

      <h1
        aria-label={`${p.firstName} ${p.lastName}`}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(4rem, 11vw, 8.5rem)",
          fontWeight: 400,
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          color: "var(--foreground)",
        }}
      >
        <span className="block">{p.firstName}</span>
        <span
          className="block pl-[0.55em]"
          style={{ fontStyle: "italic", color: "var(--accent)" }}
        >
          {p.lastName}
        </span>
      </h1>

      <p
        className="text-muted-foreground"
        style={{
          fontWeight: 300,
          lineHeight: 1.75,
          maxWidth: "26rem",
        }}
      >
        {p.intro}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="px-5 py-2.5 bg-foreground text-background text-sm hover:opacity-80 transition-opacity"
        >
          View My Works
        </a>
        <a
          href="#contact"
          className="px-5 py-2.5 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          Get in touch
        </a>
        <a
          href="#about"
          className="ml-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          <ArrowDown size={13} />
          About me
        </a>
      </div>
    </div>
  );
}

function HeroPortrait() {
  const p = useContent("profile");
  const corner = "absolute h-5 w-5 border-accent";
  return (
    <figure className="relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {/* theme-reactive: only the visible one is fetched (lazy + display:none) */}
        {[
          [p.heroLight || heroLight, "block dark:hidden", `${p.firstName} ${p.lastName}`],
          [p.heroDark || heroDark, "hidden dark:block", ""],
        ].map(([src, show, alt]) => (
          <img
            key={src}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`${show} h-full w-full object-cover`}
            style={{ objectPosition: "50% 30%" }}
          />
        ))}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10,16,28,0.75), transparent 45%)",
          }}
        />
      </div>
      {/* crop marks */}
      <span className={`${corner} -left-3 -top-3 border-l border-t`} />
      <span className={`${corner} -right-3 -top-3 border-r border-t`} />
      <span className={`${corner} -right-3 -bottom-3 border-b border-r`} />
      <figcaption
        className="mt-4 flex justify-between text-[0.7rem] uppercase tracking-widest text-muted-foreground lg:justify-end lg:gap-6"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <span>Fig. 01 — Hans Diaz</span>
        <span>14.28°N 120.87°E</span>
      </figcaption>
    </figure>
  );
}

const PROMPT = "hans@portfolio:~";

// computed built-ins; everything else comes from the editable `commands` content
const builtins = {
  date: () => new Date().toString(),
  echo: (arg) => arg.replace(/^["']|["']$/g, ""),
};

function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return `Scrolling to ${id}...`;
}

function HeroTerminal({ onClose, commands }) {
  const names = [...commands.map((c) => c.name), "help", "echo", "date", "clear"];
  const [lines, setLines] = useState([
    { output: 'Welcome. Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    // scroll the terminal body only, not the page
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw) => {
    const [name, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    if (name === "clear") return setLines([]);
    // full line first so multi-word commands ("ls skills") win over their first word
    const custom =
      commands.find((c) => c.name === raw.trim()) ?? commands.find((c) => c.name === name);
    const output = !name
      ? null
      : custom
        ? custom.scrollTo
          ? go(custom.scrollTo)
          : custom.output
        : name === "help"
          ? `Commands: ${[...commands.map((c) => c.name), "echo <text>", "date", "clear"].join(", ")}`
          : builtins[name]
            ? builtins[name](arg)
            : `command not found: ${name}. Type "help".`;
    setLines((l) => [...l, { command: raw }, ...(output ? [{ output }] : [])]);
  };

  // skip the auto-typed intro when the admin removed `whoami`
  const [typing, setTyping] = useState(commands.some((c) => c.name === "whoami"));

  useEffect(() => {
    // intro: auto-type one command, then hand over to the visitor
    const intro = "whoami";
    if (!typing) return;
    let n = 0;
    const id = setInterval(() => {
      n++;
      setInput(intro.slice(0, n));
      if (n === intro.length) {
        clearInterval(id);
        setTimeout(() => {
          run(intro);
          setInput("");
          setTyping(false);
        }, 300);
      }
    }, 90);
    return () => clearInterval(id);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const hits = names.filter(
        (c) => input && c.startsWith(input),
      );
      if (hits.length === 1) setInput(hits[0]);
    } else if (e.key === "Enter") {
      run(input);
      if (input.trim()) setHistory((h) => [...h, input]);
      setInput("");
      setCursor(-1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(
        -1,
        Math.min(history.length - 1, cursor + (e.key === "ArrowUp" ? 1 : -1)),
      );
      setCursor(next);
      setInput(next < 0 ? "" : history[history.length - 1 - next]);
    }
  };

  return (
    <div
      className="rounded-sm border border-border overflow-hidden"
      style={{ background: "var(--card)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-border"
        style={{ background: "var(--secondary)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close terminal"
          className="w-3 h-3 rounded-full"
          style={{ background: "#FF5F57" }}
        />
        <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        <span
          className="ml-auto text-xs text-muted-foreground"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          zsh — 80×24
        </span>
      </div>
      <div
        ref={bodyRef}
        className="p-5 h-[min(26rem,60vh)] overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.92rem",
          lineHeight: 1.8,
        }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line.command !== undefined && (
              <>
                <span className="text-green-500">{PROMPT} </span>
                <span>{line.command}</span>
              </>
            )}
            {line.output && (
              <div className="ml-4 text-muted-foreground">{line.output}</div>
            )}
          </div>
        ))}
        <label className="flex gap-2">
          <span className="text-green-500 shrink-0">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={typing}
            autoFocus
            aria-label="Terminal command input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent outline-none caret-foreground"
            style={{ font: "inherit" }}
          />
        </label>
      </div>
    </div>
  );
}
function TerminalModal() {
  const commands = useContent("commands");
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="group flex items-center gap-3 border border-border bg-background/80 px-4 py-3 text-xs uppercase tracking-widest text-foreground backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <span className="text-green-500">&gt;_</span>
        Open terminal
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[min(44rem,94vw)] bg-transparent p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        {/* mount only while open so the intro replays each time */}
        {open && <HeroTerminal onClose={close} commands={commands} />}
      </dialog>
    </>
  );
}

export default function Hero() {
  return (
    <section id="home" className="portfolio-section">
      <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-0">
        <div className="lg:col-span-7">
          <ScrollReveal direction="right">
            <HeroName />
          </ScrollReveal>
        </div>
        <div className="relative lg:col-span-5">
          <ScrollReveal direction="left" delay={0.15}>
            <HeroPortrait />
            <div className="mt-8 lg:absolute lg:bottom-16 lg:-left-16 lg:z-10 lg:mt-0">
              <TerminalModal />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
