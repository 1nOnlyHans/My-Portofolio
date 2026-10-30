import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import photo1 from "../assets/images/hans.jpg";
import photo2 from "../assets/images/hans about.jpg";
import photo3 from "../assets/images/hans about 2.jpg";
import photo4 from "../assets/images/hans about 3.jpg";
import photo5 from "../assets/images/hans hero dark.jpg";
import ScrollReveal from "../components/ui/scroll-reveal";
import { useContent } from "../lib/content";

const bundledPhotos = [photo1, photo2, photo3, photo4, photo5];
const mono = { fontFamily: "'DM Mono', monospace" };
// photo card deck hidden for now; flip to true to bring it back
const SHOW_PHOTOS = false;

function CardDeck({ photos, onOpen }) {
  const mid = (photos.length - 1) / 2;
  const [hover, setHover] = useState(null);
  const scroller = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  useEffect(() => {
    const el = scroller.current;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const scrollBy = (dir) =>
    scroller.current.scrollBy({ left: dir * 280, behavior: "smooth" });

  // touch scrolls natively; this gives mouse users drag-to-scroll
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = {
      down: true,
      x: e.clientX,
      left: scroller.current.scrollLeft,
      moved: false,
    };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    scroller.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => (drag.current.down = false);
  const swallowDragClick = (e) => {
    if (!drag.current.moved) return;
    e.stopPropagation();
    e.preventDefault();
    drag.current.moved = false;
  };

  const arrow =
    "border border-border bg-background/80 p-2 text-foreground transition-colors hover:border-accent hover:text-accent";

  return (
    <>
    <div
      ref={scroller}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={swallowDragClick}
      className="overflow-x-auto px-6 py-14 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div className="mx-auto flex w-max items-end">
        {photos.map((src, i) => {
          const offset = i - mid;
          const lifted = hover === i;
          return (
            <button
              key={src}
              type="button"
              onClick={() => onOpen(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="relative -ml-14 w-40 shrink-0 cursor-pointer border border-border bg-card p-2 text-left shadow-xl transition-[transform,box-shadow] duration-300 ease-out first:ml-0 focus-visible:outline-2 focus-visible:outline-accent sm:w-48 motion-reduce:transition-none"
              style={{
                zIndex: lifted ? 50 : i,
                transform: lifted
                  ? "translateY(-1.5rem) scale(1.12) rotate(0deg)"
                  : `translateY(${Math.abs(offset) * 0.5}rem) rotate(${offset * 5}deg)`,
                boxShadow: lifted
                  ? "0 30px 60px -12px rgba(0,0,0,0.55)"
                  : undefined,
              }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover"
              />
              <span
                className="mt-2 flex justify-between text-[0.65rem] uppercase tracking-widest text-muted-foreground"
                style={mono}
              >
                <span>No. {String(i + 1).padStart(2, "0")}</span>
                <span>Hans</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
    <div className="flex items-center justify-center gap-4">
      <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll cards left" className={arrow}>
        <ChevronLeft size={16} />
      </button>
      <span
        className="text-[0.7rem] uppercase tracking-widest text-muted-foreground"
        style={mono}
      >
        Drag, swipe or use arrows &middot; click a card to open
      </span>
      <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll cards right" className={arrow}>
        <ChevronRight size={16} />
      </button>
    </div>
    </>
  );
}

function PhotoModal({ photos, index, onChange }) {
  const ref = useRef(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = (dir) => onChange((index + dir + photos.length) % photos.length);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  const nav =
    "absolute top-1/2 -translate-y-1/2 border border-border bg-background/80 p-2 text-foreground backdrop-blur-md transition-colors hover:border-accent hover:text-accent";

  return (
    <dialog
      ref={ref}
      onClose={() => onChange(null)}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      onKeyDown={onKeyDown}
      className="m-auto bg-transparent p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative border border-border bg-card p-3 shadow-2xl">
          <img
            src={photos[index]}
            alt={`Hans Diaz, photo ${index + 1}`}
            className="block max-h-[78vh] max-w-[88vw] object-contain"
          />
          <div
            className="flex items-center justify-between pt-3 text-xs uppercase tracking-widest text-muted-foreground"
            style={mono}
          >
            <span>
              No. {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <span>Hans Diaz</span>
          </div>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className={`${nav} left-2`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className={`${nav} right-2`}
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => ref.current.close()}
            aria-label="Close photo"
            className="absolute right-5 top-5 border border-border bg-background/80 p-1.5 text-foreground backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </dialog>
  );
}

export default function About() {
  const [open, setOpen] = useState(null);
  const p = useContent("profile");
  const photos = p.photos?.length ? p.photos : bundledPhotos;

  return (
    <section id="about" className="portfolio-section">
      <div className="w-full space-y-20 lg:space-y-24">
        <ScrollReveal direction="right">
          <span
            className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            style={mono}
          >
            <span className="h-px w-10 bg-accent" />
            About
          </span>
          <h2
            className="mt-8 max-w-3xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
            }}
          >
            Code is my medium,{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              the web is my canvas
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal className="space-y-12" delay={0.1}>
          <p
            className="max-w-2xl text-xl text-foreground sm:text-2xl"
            style={{ fontWeight: 300, lineHeight: 1.6 }}
          >
            {p.aboutLead}
          </p>
          <div
            className="grid gap-10 text-muted-foreground md:grid-cols-2 md:gap-16"
            style={{ fontWeight: 300, lineHeight: 1.85 }}
          >
            <p>{p.aboutLeft}</p>
            <p>{p.aboutRight}</p>
          </div>
          <dl
            className="grid gap-6 border-t border-border pt-8 text-xs uppercase tracking-widest sm:grid-cols-3"
            style={mono}
          >
            {p.facts.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-2 text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>

        {SHOW_PHOTOS && (
          <ScrollReveal delay={0.1}>
            <CardDeck photos={photos} onOpen={setOpen} />
          </ScrollReveal>
        )}
      </div>
      {SHOW_PHOTOS && <PhotoModal photos={photos} index={open} onChange={setOpen} />}
    </section>
  );
}
