/* Dark / light toggle. Dark is the default for this invitation.
 * The theme is applied by an inline script in <head> before first paint,
 * so there is never a flash of the wrong theme. This module only wires up
 * the button and remembers the guest's choice. */

const KEY = "kr-theme";

export function initTheme() {
  const btn = document.querySelector("#theme-toggle");
  if (!btn) return;

  const get = () => document.documentElement.getAttribute("data-theme") || "dark";

  const paint = () => {
    const dark = get() === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    btn.title = dark ? "Light theme" : "Dark theme";
  };

  const set = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch {}
    paint();
  };

  btn.addEventListener("click", () => set(get() === "dark" ? "light" : "dark"));
  paint();
}
