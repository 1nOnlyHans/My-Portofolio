import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { defaults, fetchContent, isVideo, mediaItem, slugify } from "@/lib/content";
import useSavedTheme from "@/lib/use-saved-theme";

const mono = { fontFamily: "'DM Mono', monospace" };

export default function ProjectPage({ slug }) {
  // db === null while loading: a project added in /admin isn't in the bundled defaults,
  // so don't call it "not found" until the real content has arrived
  const [db, setDb] = useState(null);
  useEffect(() => {
    fetchContent().then(setDb);
  }, []);
  const projects = db?.projects ?? defaults.projects;
  const project = projects.find((p) => slugify(p.title) === slug);
  const media = (project?.media ?? []).map(mediaItem);

  useSavedTheme();

  useEffect(() => {
    if (project) document.title = `${project.title} — Hans Diaz`;
  }, [project]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 text-foreground">
      <a
        href="/projects"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        style={mono}
      >
        <ArrowLeft size={14} /> All projects
      </a>

      {!project ? (
        db && <p className="mt-16 text-muted-foreground">Project not found.</p>
      ) : (
        <article className="mt-10 space-y-10">
          <header className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-accent" style={mono}>
              {project.year} &middot; {project.technologies.join(" / ")}
            </span>
            <h1
              className="text-4xl leading-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              {project.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground" style={{ fontWeight: 300, lineHeight: 1.75 }}>
              {project.description}
            </p>
            {project.details && (
              <p className="max-w-2xl whitespace-pre-line" style={{ fontWeight: 300, lineHeight: 1.75 }}>
                {project.details}
              </p>
            )}
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-accent hover:underline"
                style={mono}
              >
                Visit project <ArrowUpRight size={14} />
              </a>
            )}
          </header>

          {/* media comes from the admin project editor, in the order saved there */}
          <section aria-labelledby="project-media" className="space-y-6 border-t border-border pt-8">
            <div className="flex items-baseline justify-between">
              <h2
                id="project-media"
                className="text-2xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic" }}
              >
                Media
              </h2>
              <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
                {String(media.length).padStart(2, "0")} items
              </span>
            </div>

            {media.length === 0 && (
              <p className="text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
                Screenshots and videos for this project are coming soon.
              </p>
            )}

            {media.map(({ url, caption }) => (
              <figure key={url} className="space-y-2">
                {isVideo(url) ? (
                  <video src={url} controls preload="metadata" className="w-full border border-border" />
                ) : (
                  <img src={url} alt={caption} loading="lazy" className="w-full border border-border" />
                )}
                {caption && (
                  <figcaption className="text-xs text-muted-foreground" style={mono}>
                    {caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        </article>
      )}
    </div>
  );
}
