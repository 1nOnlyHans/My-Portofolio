// Theme switch plays the loading screen's exit: a curtain wipes down the page (same 0.8s
// expo ease-out) led by a gold hairline. The wipe itself is CSS (::view-transition-new(root)
// in index.css); this runs the DOM change inside it and drives the gold line.
const DURATION = 800;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function switchTheme(apply) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !document.startViewTransition) return apply();

  const root = document.documentElement;
  // no per-element colour fades underneath the wipe
  root.classList.add("theme-wipe");
  const transition = document.startViewTransition(apply);

  const line = document.createElement("div");
  line.setAttribute("aria-hidden", "true");
  line.style.cssText =
    "position:fixed;inset:0 0 auto 0;height:1px;background:#d4a853;z-index:10000;pointer-events:none";
  document.body.append(line);
  transition.ready
    .then(() => line.animate({ transform: ["translateY(0)", "translateY(100vh)"] }, { duration: DURATION, easing: EASE }))
    .catch(() => {});
  transition.finished.finally(() => {
    line.remove();
    root.classList.remove("theme-wipe");
  });
}
