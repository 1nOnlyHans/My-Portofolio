import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import useSavedTheme from "@/lib/use-saved-theme";
import Journey from "@/sections/journey";

const mono = { fontFamily: "'DM Mono', monospace" };

export default function AllJourney() {
  useSavedTheme();
  useEffect(() => {
    document.title = "Journey — Hans Diaz";
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 text-foreground">
      <a
        href="/#journey"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        style={mono}
      >
        <ArrowLeft size={14} /> Back home
      </a>
      <Journey full />
    </div>
  );
}
