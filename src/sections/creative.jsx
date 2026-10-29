import { useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useContent } from "../lib/content";
import ScrollReveal from "../components/ui/scroll-reveal";
import CreativeModal from "../components/creative-modal";
import { embedUrl, formatDate, publishedWorks } from "../lib/creative";

const mono = { fontFamily: "'DM Mono', monospace" };
const ALL = "All Works";
const PAGE = 9;

function Card({ project, onOpen }) {
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  // muted hover preview only for self-hosted video; embeds stay lazy until opened
  const preview = project.media.find((m) => m.type === "video" && !embedUrl(m.url));

  const toggle = (on) => {
    setHovering(on);
    if (!preview) return;
    // the <video> mounts on first hover, so play once it exists
    requestAnimationFrame(() => (on ? videoRef.current?.play().catch(() => {}) : videoRef.current?.pause()));
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      onMouseEnter={() => toggle(true)}
      onMouseLeave={() => toggle(false)}
      aria-label={`Open ${project.title}`}
      className={`group relative block size-full overflow-hidden border border-border bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        project.featured ? "min-h-72 sm:row-span-2" : "aspect-[4/3]"
      }`}
    >
      <img
        src={project.coverImage}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
      {preview && hovering && (
        <video
          ref={videoRef}
          src={preview.url}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {project.media.some((m) => m.type === "video") && (
        <Play
          size={16}
          aria-hidden="true"
          className="absolute right-3 top-3 text-white drop-shadow transition-opacity group-hover:opacity-0"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-16 text-white">
        <span
          className="inline-block border border-white/40 px-2 py-0.5 text-[0.65rem] uppercase tracking-widest transition-colors duration-300 group-hover:border-accent group-hover:text-accent"
          style={mono}
        >
          {project.category}
        </span>
        <h3
          className={`text-balance leading-tight ${project.featured ? "text-2xl sm:text-3xl" : "text-lg"}`}
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.01em" }}
        >
          {project.title}
        </h3>
        <p className="text-[0.65rem] uppercase tracking-widest text-white/70" style={mono}>
          {formatDate(project.createdAt)}
          {project.tools.length > 0 && ` · ${project.tools.slice(0, 3).join(" / ")}`}
        </p>
        {project.featured && (
          <p className="line-clamp-2 max-w-[50ch] text-sm text-white/80" style={{ fontWeight: 300 }}>
            {project.description}
          </p>
        )}
      </div>
    </button>
  );
}

export default function Creative() {
  const all = useContent("creative");
  const [active, setActive] = useState(ALL);
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(null);

  const projects = useMemo(() => publishedWorks(all), [all]);

  // tabs come from the data; "Others" always last
  const categories = useMemo(() => {
    const counts = new Map();
    projects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    const names = [...counts.keys()].sort((a, b) => (a === "Others") - (b === "Others"));
    return [[ALL, projects.length], ...names.map((n) => [n, counts.get(n)])];
  }, [projects]);

  if (!projects.length) return null;

  const visible = projects.filter((p) => active === ALL || p.category === active);
  const select = (name) => {
    setActive(name);
    setShown(PAGE);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="creative"
        aria-labelledby="creative-title"
        className="portfolio-section flex-col items-stretch justify-center"
      >
        <ScrollReveal className="w-full">
          <span className="section-label">03 / Creative</span>
          <h2 id="creative-title" className="section-title">
            Beyond the <em>Code</em>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
            Exploring creativity beyond development — from visual design and motion graphics to AI-powered content
            and digital experiences.
          </p>
        </ScrollReveal>

        <div role="group" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2">
          {categories.map(([name, count]) => (
            <button
              key={name}
              type="button"
              aria-pressed={active === name}
              onClick={() => select(name)}
              className={`border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                active === name
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
              style={mono}
            >
              {name} <span className="opacity-60">{String(count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-12 border border-dashed border-border py-16 text-center text-sm text-muted-foreground" style={mono}>
            Nothing in {active} yet — check back soon.
          </p>
        ) : (
          <ul aria-live="polite" className="mt-8 grid w-full grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.slice(0, shown).map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={p.featured ? "sm:col-span-2 sm:row-span-2" : ""}
                >
                  <Card project={p} onOpen={setOpen} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {visible.length > shown && (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="mt-10 w-fit border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={mono}
          >
            Load more ({visible.length - shown})
          </button>
        )}

        {open && <CreativeModal project={open} onClose={() => setOpen(null)} />}
      </section>
    </MotionConfig>
  );
}
