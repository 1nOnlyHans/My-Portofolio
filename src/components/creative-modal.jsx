import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { embedUrl, formatDate } from "../lib/creative";

const mono = { fontFamily: "'DM Mono', monospace" };
const serif = { fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.02em" };

function Video({ item, title }) {
  const embed = embedUrl(item.url);
  return embed ? (
    <iframe
      src={embed}
      title={title}
      loading="lazy"
      allow="fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      className="aspect-video w-full"
    />
  ) : (
    <video
      src={item.url}
      poster={item.thumbnail}
      controls
      playsInline
      preload="none"
      aria-label={title}
      className="max-h-[70vh] w-full bg-black"
    />
  );
}

function Lightbox({ items, index, onIndex, title, onClose }) {
  const step = (d) => onIndex((index + d + items.length) % items.length);
  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/95" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
          }}
          className="fixed inset-0 z-[70] grid place-items-center p-4 outline-none sm:p-10"
        >
          <Dialog.Title className="sr-only">{title} — fullscreen image</Dialog.Title>
          <img
            src={items[index].url}
            alt={`${title}, image ${index + 1} of ${items.length}`}
            className="max-h-full max-w-full object-contain"
          />
          <Dialog.Close
            aria-label="Close fullscreen"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} aria-hidden="true" />
          </Dialog.Close>
          {items.length > 1 && (
            <>
              <NavButton side="left" label="Previous image" onClick={() => step(-1)} />
              <NavButton side="right" label="Next image" onClick={() => step(1)} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function NavButton({ side, label, onClick }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-white ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}

export default function CreativeModal({ project, onClose }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const items = project.media;
  const item = items[index];
  const images = items.filter((m) => m.type === "image");
  const step = (d) => setIndex((index + d + items.length) % items.length);

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="creative-desc"
          onKeyDown={(e) => {
            if (items.length > 1 && !zoom && e.target.tagName !== "IFRAME") {
              if (e.key === "ArrowLeft") step(-1);
              if (e.key === "ArrowRight") step(1);
            }
          }}
          className="fixed inset-x-0 bottom-0 top-8 z-[60] flex flex-col overflow-y-auto border border-border bg-background outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 sm:inset-x-6 sm:top-6 sm:bottom-6 lg:left-[calc(15rem+1.5rem)] lg:mx-auto lg:max-w-4xl motion-reduce:animate-none"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
            <span className="text-xs uppercase tracking-widest text-accent" style={mono}>
              {project.category}
            </span>
            <Dialog.Close
              aria-label="Close project"
              className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {/* media stage */}
          {item && (
            <div className="relative bg-secondary">
              {item.type === "video" ? (
                <Video key={item.url} item={item} title={project.title} />
              ) : (
                <button
                  type="button"
                  aria-label="View fullscreen"
                  onClick={() => setZoom(true)}
                  className="group relative block w-full cursor-zoom-in"
                >
                  <img
                    src={item.url}
                    alt={`${project.title}, image ${index + 1} of ${items.length}`}
                    className="mx-auto max-h-[70vh] w-full object-contain"
                  />
                  <Maximize2
                    size={18}
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </button>
              )}
              {items.length > 1 && (
                <>
                  <NavButton side="left" label="Previous media" onClick={() => step(-1)} />
                  <NavButton side="right" label="Next media" onClick={() => step(1)} />
                </>
              )}
            </div>
          )}

          {items.length > 1 && (
            <ul className="flex gap-2 overflow-x-auto border-b border-border p-3" aria-label="Project media">
              {items.map((m, i) => (
                <li key={m.url} className="shrink-0">
                  <button
                    type="button"
                    aria-label={`Show ${m.type} ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    className={`relative block h-16 w-24 overflow-hidden border bg-secondary ${
                      i === index ? "border-accent" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    {(m.type === "image" || m.thumbnail) && (
                      <img src={m.thumbnail ?? m.url} alt="" loading="lazy" className="size-full object-cover" />
                    )}
                    {m.type === "video" && (
                      <Play size={16} aria-hidden="true" className="absolute inset-0 m-auto text-white drop-shadow" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-5 p-6 sm:p-8">
            <Dialog.Title className="text-balance text-3xl leading-tight sm:text-4xl" style={serif}>
              {project.title}
            </Dialog.Title>
            <p className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
              {formatDate(project.createdAt)}
            </p>
            <p
              id="creative-desc"
              className="max-w-2xl whitespace-pre-line text-muted-foreground"
              style={{ fontWeight: 300, lineHeight: 1.75 }}
            >
              {project.description}
            </p>
            {project.tools.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Tools used">
                {project.tools.map((tool) => (
                  <li
                    key={tool}
                    className="border border-border px-2.5 py-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground"
                    style={mono}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            )}
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-accent hover:underline"
                style={mono}
              >
                View original <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {zoom && (
        <Lightbox
          items={images}
          index={images.indexOf(item)}
          onIndex={(i) => setIndex(items.indexOf(images[i]))}
          title={project.title}
          onClose={() => setZoom(false)}
        />
      )}
    </Dialog.Root>
  );
}
