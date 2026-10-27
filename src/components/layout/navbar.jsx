import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const menus = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Activity", link: "#activity" },
  { name: "Skills", link: "#skills" },
  { name: "Contact", link: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const sections = ["home", ...menus.map(({ link }) => link.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let animationFrame;

    const updateActiveSection = () => {
      const readingLine = window.innerHeight * 0.45;
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const linkBase =
    "rounded-full px-3.5 py-1.5 font-mono text-sm transition-colors duration-300";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl">
        <nav className="flex h-13 items-center justify-between rounded-full border border-border bg-background/55 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <a
            href="#"
            className="font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:text-accent"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {"<hansDev />"}
          </a>

          <div className="flex items-center gap-2">
            <ul className="hidden items-center gap-1 md:flex">
              {menus.map((menu) => {
                const active = activeSection === menu.link.slice(1);
                return (
                  <li key={menu.name}>
                    <a
                      href={menu.link}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setActiveSection(menu.link.slice(1))}
                      className={`${linkBase} hover:text-foreground ${
                        active
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground"
                      }`}
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {menu.name}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              onClick={() => setIsDark((currentTheme) => !currentTheme)}
              className="relative flex h-8 w-14 items-center rounded-full bg-secondary/70 p-1 text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Sun className="absolute left-1.5 size-3.5" aria-hidden="true" />
              <Moon className="absolute right-1.5 size-3.5" aria-hidden="true" />
              <span
                className={`z-10 size-6 rounded-full bg-foreground shadow-sm transition-transform duration-200 ${
                  isDark ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
            >
              {isMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        <div
          id="mobile-navigation"
          inert={!isMenuOpen}
          className={`mt-2 origin-top overflow-hidden rounded-3xl border border-border bg-background/70 backdrop-blur-xl transition-all duration-300 md:hidden ${
            isMenuOpen
              ? "max-h-80 scale-100 opacity-100"
              : "max-h-0 scale-95 border-transparent opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 p-2">
            {menus.map((menu) => {
              const active = activeSection === menu.link.slice(1);
              return (
                <li key={menu.name}>
                  <a
                    href={menu.link}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setActiveSection(menu.link.slice(1));
                      setIsMenuOpen(false);
                    }}
                    className={`block ${linkBase} py-2.5 hover:text-foreground ${
                      active
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground"
                    }`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {menu.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
