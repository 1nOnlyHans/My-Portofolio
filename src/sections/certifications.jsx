import { ArrowRight } from "lucide-react";
import { useContent } from "../lib/content";
import ScrollReveal from "../components/ui/scroll-reveal";
import CertificateRow from "../components/certificate-row";

const mono = { fontFamily: "'DM Mono', monospace" };
const FEATURED = 4;

export default function Certifications() {
  const certs = useContent("certifications");
  if (!certs.length) return null;

  return (
    <section id="certifications" className="portfolio-section flex-col items-stretch justify-center">
      <ScrollReveal className="flex w-full items-end justify-between gap-6">
        <div>
          <span className="section-label">05 / Credentials</span>
          <h2 className="section-title">
            Licenses &amp; <em>Certifications</em>
          </h2>
        </div>
        <span className="hidden pb-2 text-xs uppercase tracking-widest text-muted-foreground sm:block" style={mono}>
          {String(certs.length).padStart(2, "0")} entries
        </span>
      </ScrollReveal>

      <div className="mt-12 w-full border-b border-border">
        {certs.slice(0, FEATURED).map((cert, i) => (
          <ScrollReveal key={cert.title + i} delay={Math.min(i * 0.08, 0.24)}>
            <CertificateRow cert={cert} />
          </ScrollReveal>
        ))}
      </div>

      {certs.length > FEATURED && (
        <ScrollReveal className="mt-10 w-full">
          <a
            href="/certifications"
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-widest text-foreground transition-colors hover:text-accent"
            style={mono}
          >
            See all certifications ({String(certs.length).padStart(2, "0")})
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </a>
        </ScrollReveal>
      )}
    </section>
  );
}
