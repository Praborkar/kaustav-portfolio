/* ===== EDIT ME: fill these in and the buttons appear automatically ===== */
const CONFIG = {
  email: "kauzmikofficial@gmail.com",
  instagram: "https://instagram.com/kauzmik",
  instagramHandle: "@KAUZMIK",
  phone: "8822920370",
  youtube: "",      // e.g. "https://youtube.com/@yourchannel"
  spotify: "",
  taaj: "https://open.spotify.com/track/1tjvV6s6cBCd6ewQYwtYkA",      // e.g. "https://open.spotify.com/artist/..."
  // Link for each live sample record, in order Pt.1, Pt.2, Pt.3
  music: "",        // optional: path to your own track, e.g. "assets/music.mp3" (replaces the built-in beat)
  samples: ["", "", ""]
};

/* seeded random so the collage looks the same every load */
function rng(seed){ return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

function chunk(r) {
  return `rotate(${(r() * 8 - 4).toFixed(1)}deg) skew(${(r() * 6 - 3).toFixed(1)}deg,${(r() * 3 - 1.5).toFixed(1)}deg) scale(${(.92 + r() * .2).toFixed(2)},${(1.05 + r() * .35).toFixed(2)}) translateY(${(r() * 8 - 4).toFixed(1)}px)`;
}
window.chunk = chunk;

/* chunky hand-cut lettering */
document.querySelectorAll("[data-ransom]").forEach((el, k) => {
  const text = el.textContent.trim(), r = rng(97 + k * 31);
  const spread = el.hasAttribute("data-spread");
  el.textContent = "";
  let prev = -1, word = null;
  [...text].forEach((ch, i) => {
    if (ch === " ") { const s = document.createElement("span"); s.className = "rn sp"; el.append(s); word = null; return; }
    if (!word) { word = document.createElement("span"); word.className = "word"; el.append(word); }
    let cls;
    // mostly black/white tiles, a rare colour tile like the reference
    if (r() < 0.13) cls = "a" + Math.floor(r() * 4);
    else { let v; do { v = Math.floor(r() * 8); } while (v === prev); prev = v; cls = "v" + v; }
    const s = document.createElement("span");
    s.className = "rn " + cls;
    s.textContent = ch;
    // hand-cut feel: each letter gets its own height, skew and tilt
    const thin = /[iljIt1!.,':;]/.test(ch);   // thin glyphs vanish in the grainy filter, keep them heavy
    s.classList.add(thin ? "f0" : ["f0", "f0", "f0", "f1", "f2", "f3"][Math.floor(r() * 6)]);
    s.style.transform = chunk(r);
    if (spread) s.style.translate = `0 ${((i % 2 ? 1 : -1) * (4 + r() * 9)).toFixed(0)}px`;
    word.append(s);
  });
});

/* torn paper edges */
document.querySelectorAll(".tear").forEach(el => {
  const r = rng(11 + Number(el.dataset.seed || 1) * 977);
  const top = [], bot = [];
  for (let x = 0; x <= 100; x += 2) {
    top.push(`${x}% ${(18 + r() * 22).toFixed(1)}%`);
    bot.push(`${100 - x}% ${(62 + r() * 24).toFixed(1)}%`);
  }
  el.style.clipPath = `polygon(${top.join(",")},${bot.join(",")})`;
});

/* contact links + sample links */
const box = document.getElementById("contact-links");
const links = [
  [CONFIG.email && `mailto:${CONFIG.email}`, "Book KAUZMIK", true],
  [CONFIG.instagram, "Instagram"],
  [CONFIG.phone && `tel:${CONFIG.phone}`, "Call"],
  [CONFIG.youtube, "YouTube"],
  [CONFIG.spotify, "Spotify"]
];
links.forEach(([href, label, primary]) => {
  if (!href) return;
  const a = document.createElement("a");
  a.href = href; a.textContent = label;
  if (primary) a.className = "primary";
  if (!href.startsWith("mailto") && !href.startsWith("tel")) { a.target = "_blank"; a.rel = "noopener"; }
  box.append(a);
});
if (!box.children.length) box.innerHTML = '<p style="font-family:\'Special Elite\',monospace;color:#777">Add your email and socials in script.js → CONFIG</p>';

/* contact slips */
const ICON = {
  ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>'
};
const slips = document.getElementById("slips");
if (slips) {
  [["Instagram", CONFIG.instagramHandle, CONFIG.instagram, "ig", "pink"],
   ["Email", CONFIG.email, CONFIG.email && `mailto:${CONFIG.email}`, "mail", "yellow"],
   ["Contact no.", CONFIG.phone, CONFIG.phone && `tel:${CONFIG.phone}`, "tel", "green"]].forEach(([k, v, href, ic, tape], i) => {
    if (!v) return;
    const a = document.createElement("a");
    a.className = "slip reveal " + tape; a.href = href; a.style.setProperty("--r", [-2.2, 1.4, -1][i] + "deg");
    if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    a.innerHTML = `<i class="tape"></i><span class="ic">${ICON[ic]}</span><small>${k}</small><b></b><em>tap to open &rarr;</em>`;
    a.querySelector("b").textContent = v;
    slips.append(a);
  });
}

document.querySelectorAll(".rec").forEach((rec, i) => {
  const href = CONFIG.samples[i];
  if (!href) return;
  const a = document.createElement("a");
  a.className = "play"; a.href = href; a.target = "_blank"; a.rel = "noopener"; a.textContent = "▶ Play";
  rec.append(a);
});

const taaj = document.getElementById("taaj-link");
if (taaj && CONFIG.taaj) { taaj.href = CONFIG.taaj; taaj.target = "_blank"; taaj.rel = "noopener"; taaj.hidden = false; }

/* nav */
const nav = document.querySelector(".nav");
const burger = document.querySelector(".burger");
const setMenu = open => { nav.classList.toggle("open", open); document.body.classList.toggle("menu-open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* nav background on scroll + active link */
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const navLinks = [...nav.querySelectorAll("ul a")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
navLinks.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

/* scroll reveal */
const targets = document.querySelectorAll(".title,.bio-right,.story-grid,.roles-grid article,.venues li,.rec,.outro,.cta,.contact,.tags,.slip,.contact-head,.shot,.cover,.rel-art,.rel-text,.sub");
targets.forEach(t => t.classList.add("reveal"));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
targets.forEach(t => io.observe(t));

document.getElementById("yr").textContent = new Date().getFullYear();
