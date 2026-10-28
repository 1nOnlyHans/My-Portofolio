import { ArrowUpRight } from "lucide-react";

const mono = { fontFamily: "'DM Mono', monospace" };

// one ledger row: date | title, issuer, id, verify link | certificate image
export default function CertificateRow({ cert }) {
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
        <a
          href={cert.image}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${cert.title} certificate`}
          className="block overflow-hidden border border-border"
        >
          <img
            src={cert.image}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </a>
      )}
    </article>
  );
}
