const LANGS = [
  ["en","English"],["es","Español"],["hi","हिन्दी"],["ur","اردو"],
  ["pa","ਪੰਜਾਬੀ"],["tl","Tagalog"],["th","ไทย"]
];

const sel = document.getElementById("lang");
LANGS.forEach(([c,n]) => {
  const o = document.createElement("option");
  o.value = c; o.textContent = n; sel.appendChild(o);
});

function applyLang(code) {
  const t = I18N[code] || I18N.en;
  document.documentElement.lang = code;
  document.documentElement.dir = code === "ur" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i]").forEach(el => {
    const k = el.getAttribute("data-i");
    if (k === "h1") { el.innerHTML = t.h1HTML; return; }
    if (t[k]) el.textContent = t[k];
  });
}
sel.addEventListener("change", e => applyLang(e.target.value));

const filters = document.getElementById("regionFilters");
if (filters) {
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-region]");
    if (!btn) return;
    const region = btn.getAttribute("data-region");
    document.querySelectorAll("#regionFilters .chip").forEach(c => c.classList.toggle("on", c === btn));
    document.querySelectorAll("#obdBody tr").forEach(row => {
      row.style.display = (region === "all" || row.getAttribute("data-region") === region) ? "" : "none";
    });
  });
}

const log = document.getElementById("shiftLog");
let gear = 3, rpm = 2140, spd = 38, trip = 42;
const events = [];

function row(from, to, pts, grade) {
  const cls = pts >= 12 ? "ok" : pts >= 6 ? "mid" : "bad";
  return `<div class="shift"><span class="mono">${from}→${to}</span><span>${grade}</span><span class="pill ${cls}">${pts>0?"+":""}${pts}</span></div>`;
}

function tick() {
  if (!document.getElementById("clock")) return;
  const now = new Date();
  document.getElementById("clock").textContent = now.toTimeString().slice(0,5);
  rpm += Math.round((Math.random() - 0.42) * 180);
  rpm = Math.max(900, Math.min(4200, rpm));
  spd += (Math.random() - 0.48) * 1.4;
  spd = Math.max(8, Math.min(62, spd));
  if (Math.random() < 0.18) {
    const from = gear;
    if (spd > 45 && gear < 5) gear++;
    else if (spd < 22 && gear > 2) gear--;
    else if (Math.random() < 0.35 && gear < 5) gear++;
    else if (gear > 1 && Math.random() < 0.25) gear--;
    if (gear !== from) {
      const smooth = Math.random();
      const pts = smooth > 0.72 ? 14 : smooth > 0.4 ? 8 : -12;
      const grade = pts > 10 ? "smooth" : pts > 0 ? "ok" : "harsh";
      events.unshift({from, to: gear, pts, grade});
      if (events.length > 4) events.pop();
      trip += pts;
      rpm = gear === from + 1 ? rpm - 700 : rpm + 550;
    }
  }
  document.getElementById("gear").textContent = gear;
  document.getElementById("rpm").textContent = Math.round(rpm).toLocaleString();
  document.getElementById("spd").textContent = Math.round(spd);
  document.getElementById("tripScore").textContent = (trip>=0?"+":"") + trip;
  document.getElementById("qShift").textContent = 86 + (trip % 9);
  document.getElementById("qLane").textContent = 84 + ((trip * 3) % 10);
  document.getElementById("qBrake").textContent = 88 + ((trip * 2) % 8);
  if (log) log.innerHTML = events.map(e => row(e.from, e.to, e.pts, e.grade)).join("") ||
    row(2,3,12,"smooth") + row(3,4,8,"ok") + row(4,3,16,"rev-match");
}
if (document.getElementById("gear")) {
  setInterval(tick, 900);
  tick();
}

const planBtn = document.getElementById("planBtn");
if (planBtn) planBtn.addEventListener("click", () => {
  const t = I18N[sel.value] || I18N.en;
  const arrive = document.getElementById("arrive").value || "08:30";
  const [h,m] = arrive.split(":").map(Number);
  let leaveM = h * 60 + m - 32;
  if (leaveM < 0) leaveM += 24*60;
  const lh = String(Math.floor(leaveM/60)%24).padStart(2,"0");
  const lm = String(leaveM%60).padStart(2,"0");
  const earlyH = String(h).padStart(2,"0");
  const earlyM = String(Math.max(0,m-6)).padStart(2,"0");
  document.getElementById("etaText").textContent =
    `${t.etaPrefix} ${lh}:${lm} · ${earlyH}:${earlyM}–${arrive}`;
});

const waitBtn = document.getElementById("waitlistBtn");
if (waitBtn) waitBtn.addEventListener("click", () => {
  const t = I18N[sel.value] || I18N.en;
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = t.toast;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2400);
});
