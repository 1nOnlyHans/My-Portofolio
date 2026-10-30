import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { switchTheme } from "../../lib/theme-transition";
import { Menu, Moon, Sun, X } from "lucide-react";
import Logo from "../logo";
import { useContent } from "../../lib/content";
import { publishedWorks } from "../../lib/creative";

const baseMenus = [
  { name: "Projects", link: "#projects" },
  { name: "Skills", link: "#skills" },
  { name: "About", link: "#about" },
  { name: "Journey", link: "#journey" },
  { name: "Certifications", link: "#certifications" },
  { name: "Beyond the Code", link: "#creative" },
  { name: "Activity", link: "#activity" },
  { name: "Contact", link: "#contact" },
];

const mono = { fontFamily: "'DM Mono', monospace" };

function ThemeSwitch({ isDark, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={onToggle}
      style={{ viewTransitionName: "theme-switch" }}
      className="group relative flex h-8 w-14 shrink-0 items-center rounded-full bg-secondary/70 p-1 text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Sun className="absolute left-1.5 size-3.5" aria-hidden="true" />
      <Moon className="absolute right-1.5 size-3.5" aria-hidden="true" />
      {/* knob: expo ease-out slide (the loader's curve) that stretches slightly on press */}
      <span
        className={`z-10 h-6 w-6 rounded-full bg-foreground shadow-sm transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:w-7 motion-reduce:transition-none ${
          isDark ? "translate-x-6 group-active:translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Navbar() {
  // the section only renders once at least one certification exists
  const hasCerts = useContent("certifications").length > 0;
  const hasCreative = publishedWorks(useContent("creative")).length > 0;
  const hasJourney = useContent("journey").length > 0;
  const menus = baseMenus.filter(
    ({ link }) =>
      (hasCerts || link !== "#certifications") &&
      (hasCreative || link !== "#creative") &&
      (hasJourney || link !== "#journey"),
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- menus only changes with hasCerts
  }, [hasCerts, hasCreative, hasJourney]);

  const toggleTheme = () =>
    switchTheme(() => {
      // the transition snapshots right after this callback, so flip the class now
      document.documentElement.classList.toggle("dark", !isDark);
      flushSync(() => setIsDark(!isDark));
    });

  return (
    <>
      {/* desktop: fixed left sidebar */}
      <aside
        aria-label="Primary"
        className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-background px-7 py-8 lg:flex"
      >
        <a
          href="#"
          aria-label="Hans Diaz, back to top"
          onClick={() => setActiveSection("home")}
          className="w-fit text-accent transition-opacity hover:opacity-70"
        >
          <Logo className="h-6 w-auto" />
        </a>
        <p className="mt-5 font-serif text-xl leading-tight tracking-tight">
          Hans <em className="text-accent">Diaz</em>
        </p>
        <p
          className="mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground"
          style={mono}
        >
          Full-stack developer
        </p>

        <nav aria-label="Sections" className="my-auto">
          <ul className="flex flex-col gap-1">
            {menus.map((menu) => {
              const active = activeSection === menu.link.slice(1);
              return (
                <li key={menu.name}>
                  <a
                    href={menu.link}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setActiveSection(menu.link.slice(1))}
                    className={`group flex items-center gap-3 py-2 text-sm transition-colors duration-300 hover:text-foreground ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                    style={mono}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-px bg-accent transition-all duration-300 ${
                        active ? "w-6" : "w-2 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                    {menu.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
      </aside>

      {/* mobile and tablet: floating pill with dropdown */}
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4 lg:hidden">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          <nav className="flex h-13 items-center justify-between rounded-full border border-border bg-background/55 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <a
              href="#"
              aria-label="Hans Diaz, back to top"
              className="text-accent transition-opacity hover:opacity-70"
            >
              <Logo className="h-4 w-auto" />
            </a>

            <div className="flex items-center gap-2">
              <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
            className={`mt-2 origin-top overflow-hidden rounded-3xl border border-border bg-background/70 backdrop-blur-xl transition-all duration-300 ${
              isMenuOpen
                ? "max-h-96 scale-100 opacity-100"
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
                      className={`block rounded-full px-3.5 py-2.5 text-sm transition-colors duration-300 hover:text-foreground ${
                        active
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground"
                      }`}
                      style={mono}
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
    </>
  );
}
