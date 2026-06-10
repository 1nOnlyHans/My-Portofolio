import { useState, useRef, useEffect } from "react";

const finalCommand = 'echo "Ready to build something great."';

function HeroName() {
  return (
    <div className="max-w-3xl space-y-6">
      <span className="block text-sm text-mono uppercase text-muted-foreground font-light tracking-widest">
        FULL-STACK DEVELOPER &bull; CAVITE
      </span>

      <div className="flex items-center gap-5 sm:gap-7">
        <h1
          className="shrink-0"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          Hans
          <br />
          <span
            style={{ fontStyle: "italic", color: "var(--muted-foreground)" }}
          >
            Diaz
          </span>
        </h1>
      </div>

      <p
        className="text-muted-foreground"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          lineHeight: 1.75,
          fontSize: "1rem",
          maxWidth: "420px",
        }}
      >
        I build web applications that are not only functional but also visually
        appealing. With a strong foundation in both front-end and back-end
        technologies, I am passionate about creating seamless user experiences
        and efficient solutions. Whether it's crafting responsive interfaces or
        optimizing server-side performance, I am dedicated to delivering
        high-quality results that exceed expectations.
      </p>
      <div className="flex flex-center gap-3 items-center">
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
      </div>
    </div>
  );
}

function HeroTerminal() {
  const commandLines = [
    { prompt: "hans@portfolio:~", command: "whoami" },
    { output: "Hans Diaz — Full-Stack Web Developer" },
    { prompt: "hans@portfolio:~", command: "role.txt" },
    { output: "Full-Stack Developer" },
    { prompt: "hans@portfolio:~", command: "ls skills" },
    { output: "Web Development · UI/UX Design · Video Editing" },
    { prompt: "hans@portfolio:~", command: "pwd" },
    { output: "/Cavite/Philippines" },
  ];

  const [visibleLines, setVisibleLines] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");

  const intervalRef = useRef(setTimeout(() => {}, 0));

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i++;
      setVisibleLines(i);
      if (i < commandLines.length) {
        intervalRef.current = setTimeout(tick, i % 2 === 0 ? 300 : 80);
      }
    };
    intervalRef.current = setTimeout(tick, 500);
    return () => clearTimeout(intervalRef.current);
  }, [commandLines.length]);

  useEffect(() => {
    if (visibleLines < commandLines.length) return;

    let characterIndex = 0;
    const typingInterval = setInterval(() => {
      characterIndex++;
      setTypedCommand(finalCommand.slice(0, characterIndex));

      if (characterIndex === finalCommand.length) {
        clearInterval(typingInterval);
      }
    }, 55);

    return () => clearInterval(typingInterval);
  }, [visibleLines, commandLines.length]);

  return (
    <div
      className="rounded-sm border border-border overflow-hidden"
      style={{ background: "var(--card)" }}
    >
      {/* Terminal title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-border"
        style={{ background: "var(--secondary)" }}
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#FF5F57" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#FEBC2E" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#28C840" }}
        />
        <span
          className="ml-auto text-xs text-muted-foreground"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          zsh — 80×24
        </span>
      </div>
      {/* Terminal body */}
      <div
        className="p-5 min-h-64"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.82rem",
          lineHeight: 1.8,
        }}
      >
        {commandLines.map((line, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${
              index < visibleLines ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          >
            {line.prompt && (
              <span className="text-green-500">{line.prompt} </span>
            )}
            {line.command && <span>{line.command}</span>}
            {line.output && (
              <div className="ml-4 text-muted-foreground">{line.output}</div>
            )}
          </div>
        ))}
        <div
          className={`whitespace-pre-wrap transition-opacity duration-300 ${
            visibleLines === commandLines.length ? "opacity-100" : "opacity-0"
          }`}
          aria-label={`Terminal prompt ${typedCommand}`}
        >
          <span className="text-green-500">hans@portfolio:~ </span>
          <span>{typedCommand}</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
export default function Hero() {
  return (
    <section
      id="home"
      className="portfolio-section"
    >
      <div className="grid w-full gap-10 md:grid-cols-2 md:items-center lg:gap-16">
        <HeroName />
        <HeroTerminal />
      </div>
    </section>
  );
}
