import ScrollReveal from "../ui/scroll-reveal";

export default function Footer() {
  return (
    <ScrollReveal
      as="footer"
      className="flex w-full flex-col items-center gap-3 px-4 py-8 text-center font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 sm:text-left"
    >
      <p>
        © 2026 Hans Diaz
      </p>
      <p>
        Built with React · Deployed on Vercel
      </p>
    </ScrollReveal>
  );
}
