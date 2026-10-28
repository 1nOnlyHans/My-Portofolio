import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useContent } from "@/lib/content";
import useSavedTheme from "@/lib/use-saved-theme";
import CertificateRow from "@/components/certificate-row";

const mono = { fontFamily: "'DM Mono', monospace" };

export default function AllCertifications() {
  const certs = useContent("certifications");
  useSavedTheme();
  useEffect(() => {
    document.title = "Certifications — Hans Diaz";
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 text-foreground">
      <a
        href="/#certifications"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        style={mono}
      >
        <ArrowLeft size={14} /> Back home
      </a>

      <header className="mt-10 flex items-end justify-between gap-6">
        <h1 className="section-title">
          Licenses &amp; <em>Certifications</em>
        </h1>
        <span className="pb-2 text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
          {String(certs.length).padStart(2, "0")} entries
        </span>
      </header>

      <div className="mt-12 border-b border-border">
        {certs.length === 0 && (
          <p className="border-t border-border py-10 text-sm text-muted-foreground">
            No certifications listed yet.
          </p>
        )}
        {certs.map((cert, i) => (
          <CertificateRow key={cert.title + i} cert={cert} />
        ))}
      </div>
    </div>
  );
}
