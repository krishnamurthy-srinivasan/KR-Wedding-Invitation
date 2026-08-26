/* Real-time countdown to the muhurtham. Uses a fixed IST offset so the
   target is the same instant for a guest in Chennai or abroad. */

const UNITS = [
  { key: "days",    label: "Days",    ms: 864e5 },
  { key: "hours",   label: "Hours",   ms: 36e5  },
  { key: "minutes", label: "Minutes", ms: 6e4   },
  { key: "seconds", label: "Seconds", ms: 1e3   },
];

export function initCountdown(root, targetISO) {
  if (!root) return;
  const target = new Date(targetISO).getTime();
  if (Number.isNaN(target)) return;

  const grid = root.querySelector(".countdown__grid");
  const note = root.querySelector(".countdown__note");
  if (!grid) return;

  const cells = UNITS.map(({ key, label }) => {
    const cell = document.createElement("div");
    cell.className = "cd";
    cell.innerHTML =
      `<span class="cd__num" data-unit="${key}">--</span>` +
      `<span class="cd__label">${label}</span>`;
    grid.appendChild(cell);
    return cell.querySelector(".cd__num");
  });

  const live = document.createElement("p");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  root.appendChild(live);

  let timer = null;
  let lastAnnounced = -1;

  const finish = () => {
    if (timer) clearInterval(timer);
    grid.remove();
    if (note) {
      note.className = "countdown__passed";
      note.textContent =
        "With the blessings of our elders, Krishnamurthy and Roshini are now married.";
    }
    live.textContent = "The wedding has taken place.";
  };

  const tick = () => {
    let remaining = target - Date.now();
    if (remaining <= 0) return finish();

    UNITS.forEach((unit, i) => {
      const value = Math.floor(remaining / unit.ms);
      remaining -= value * unit.ms;
      const text = String(value).padStart(2, "0");
      if (cells[i].textContent !== text) cells[i].textContent = text;
    });

    // Announce once a day rather than every second
    const days = Math.floor((target - Date.now()) / 864e5);
    if (days !== lastAnnounced) {
      lastAnnounced = days;
      live.textContent = `${days} days until the wedding.`;
    }
  };

  tick();
  timer = setInterval(tick, 1000);

  // Resync after the tab has been backgrounded
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
}
