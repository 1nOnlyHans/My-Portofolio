import { useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

const mono = { fontFamily: "'DM Mono', monospace" };

// one ledger row: date | title, issuer, id, verify link | certificate image
export default function CertificateRow({ cert }) {
  const dialog = useRef(null);
  return (
    <article className="group grid gap-x-8 gap-y-4 border-t border-border py-8 md:grid-cols-[7rem_1fr_13rem] md:items-start">
      <span className="text-xs uppercase tracking-widest text-accent md:pt-2" style={mono}>
        {cert.date}
      </span>

      <div className="space-y-2">
        <h3
          className="text-balance text-2xl leading-tight text-foreground sm:text-3xl"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.02em" }}
        >
          {cert.title}
        </h3>
        <p className="text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
          {cert.issuer}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-xs uppercase tracking-widest" style={mono}>
          {cert.credentialId && <span className="text-muted-foreground">ID {cert.credentialId}</span>}
          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-accent"
            >
              Verify <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>

      {cert.image && (
        <>
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-label={`View ${cert.title} certificate`}
            className="block cursor-zoom-in overflow-hidden border border-border"
          >
            <img
              src={cert.image}
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
            />
          </button>

          {/* native dialog: focus trap, Esc and backdrop come free */}
          <dialog
            ref={dialog}
            aria-label={cert.title}
            onClick={(e) => e.target === dialog.current && dialog.current.close()}
            className="m-auto w-[min(60rem,calc(100vw-2rem))] max-w-none border border-border bg-background p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm"
          >
            <div className="grid max-h-[calc(100svh-2rem)] overflow-y-auto md:grid-cols-[1fr_16rem]">
              <img src={cert.image} alt={`${cert.title} certificate`} className="w-full bg-secondary object-contain md:max-h-[calc(100svh-2rem)]" />
              <div className="flex flex-col gap-3 border-t border-border p-6 md:border-t-0 md:border-l">
                <span className="text-xs uppercase tracking-widest text-accent" style={mono}>
                  {cert.date}
                </span>
                <h3
                  className="text-balance text-2xl leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: "-0.02em" }}
                >
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
                  {cert.issuer}
                </p>
                {cert.credentialId && (
                  <p className="break-all text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
                    ID {cert.credentialId}
                  </p>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-foreground transition-colors hover:text-accent"
                    style={mono}
                  >
                    Verify <ArrowUpRight size={14} />
                  </a>
                )}
                <button
                  type="button"
                  autoFocus
                  onClick={() => dialog.current.close()}
                  className="mt-auto flex w-fit items-center gap-1 border border-border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
                  style={mono}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </article>
  );
}
