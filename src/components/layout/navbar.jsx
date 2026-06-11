import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const menus = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-18 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="#"
          className="font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:text-base"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {
            "<hansDev />"
          }
        </a>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-5 md:flex">
            {menus.map((menu) => (
              <li key={menu.name}>
                <a
                  href={menu.link}
                  aria-current={
                    activeSection === menu.link.slice(1) ? "page" : undefined
                  }
                  onClick={() => setActiveSection(menu.link.slice(1))}
                  className={`relative font-mono transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-accent after:transition-all hover:text-foreground ${
                    activeSection === menu.link.slice(1)
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground after:w-0"
                  }`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {menu.name}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={() => setIsDark((currentTheme) => !currentTheme)}
            className="relative flex h-7 w-14 items-center rounded-full bg-secondary p-1 text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Sun className="absolute left-1.5 size-3.5" aria-hidden="true" />
            <Moon className="absolute right-1.5 size-3.5" aria-hidden="true" />
            <span
              className={`z-10 size-5 rounded-full bg-foreground shadow-sm transition-transform duration-200 ${
                isDark ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
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
        className={`overflow-hidden border-border bg-background/95 transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-72 border-t opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mx-auto flex w-full max-w-5xl flex-col px-4 py-3 sm:px-6">
          {menus.map((menu) => (
            <li key={menu.name}>
              <a
                href={menu.link}
                aria-current={
                  activeSection === menu.link.slice(1) ? "page" : undefined
                }
                onClick={() => {
                  setActiveSection(menu.link.slice(1));
                  setIsMenuOpen(false);
                }}
                className={`block rounded-md border-l-2 px-3 py-3 font-mono transition-colors hover:bg-secondary hover:text-foreground ${
                  activeSection === menu.link.slice(1)
                    ? "border-accent bg-secondary text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {menu.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
