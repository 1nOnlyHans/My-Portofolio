import { ArrowUpRight } from "lucide-react";
import { isVideo, mediaItem, slugify } from "../lib/content";
import TechIcon from "./tech-icon";

const mono = { fontFamily: "'DM Mono', monospace" };

// first image wins; a video's first frame is the fallback
function Cover({ media }) {
  const urls = (media ?? []).map((m) => mediaItem(m).url);
  const url = urls.find((u) => !isVideo(u)) ?? urls[0];
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-secondary">
      {url &&
        (isVideo(url) ? (
          <video src={`${url}#t=0.1`} muted playsInline preload="metadata" className="size-full object-cover" />
        ) : (
          <img
            src={url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        ))}
      {!url && (
        <span
          className="absolute inset-0 grid place-items-center text-xs uppercase tracking-widest text-muted-foreground"
          style={mono}
        >
          No media yet
        </span>
      )}
    </div>
  );
}

export default function ProjectCard({ project, index }) {
  return (
    <article className="group relative grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
      {/* alternate the cover side so the list reads as a spread, not a feed */}
      <div className={`md:col-span-7 ${index % 2 ? "md:order-2" : ""}`}>
        <Cover media={project.media} />
      </div>

      <div className="space-y-4 md:col-span-5">
        <div className="flex items-baseline gap-3 text-xs uppercase tracking-widest" style={mono}>
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-muted-foreground">{project.year}</span>
        </div>

        <h3
          className="text-balance text-3xl leading-tight text-foreground transition-colors duration-300 group-hover:text-accent lg:text-4xl"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.02em" }}
        >
          {/* stretched link: the whole article opens the project page */}
          <a
            href={`/projects/${slugify(project.title)}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {project.title}
          </a>
        </h3>

        <p
          className="line-clamp-4 max-w-[60ch] text-sm text-muted-foreground"
          style={{ fontWeight: 300, lineHeight: 1.75 }}
        >
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="flex items-center gap-1.5 border border-border px-2.5 py-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground"
              style={mono}
            >
              <TechIcon name={tech} size={13} />
              {tech}
            </li>
          ))}
        </ul>

        <span
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-foreground transition-colors group-hover:text-accent"
          style={mono}
        >
          View project
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </article>
  );
}
