import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import useSavedTheme from "@/lib/use-saved-theme";
import Creative from "@/sections/creative";

const mono = { fontFamily: "'DM Mono', monospace" };

export default function AllCreative() {
  useSavedTheme();
  useEffect(() => {
    document.title = "Beyond the Code — Hans Diaz";
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 text-foreground">
      <a
        href="/#creative"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        style={mono}
      >
        <ArrowLeft size={14} /> Back home
      </a>
      <Creative full />
    </div>
  );
}
