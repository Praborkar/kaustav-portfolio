(() => {
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- loader ---------- */
document.body.classList.add("loading");
const loader = $(".loader");
const MIN = reduce ? 0 : 2400;
// jagged torn edge under the loader (what you see as it rips upward)
{
  const t = $(".loader-tear"), edge = [];
  for (let x = 0; x <= 100; x += 2) edge.push(`${x}% ${(35 + Math.random() * 65).toFixed(0)}%`);
  t.style.clipPath = `polygon(0 0,100% 0,${edge.reverse().join(",")})`;
}
// floating notes inside loader
{
  const box = $(".ld-notes"), G = ["\u266A", "\u266B", "\u266C", "\u2669"];
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.textContent = G[i % 4];
    s.style.left = Math.random() * 96 + "%";
    s.style.fontSize = 18 + Math.random() * 30 + "px";
    s.style.setProperty("--d", 3 + Math.random() * 3 + "s");
    s.style.setProperty("--dl", -Math.random() * 5 + "s");
    s.style.setProperty("--r", Math.random() * 80 - 40 + "deg");
    box.append(s);
  }
}
// equalizer meter that fills as it "loads"
const eq = $(".ld-eq"), bars = [];
{
  const n = innerWidth < 500 ? 22 : 34;
  for (let i = 0; i < n; i++) {
    const b = document.createElement("i");
    const env = .35 + .65 * Math.abs(Math.sin((i / n) * Math.PI * 2.2 + .6));
    b.style.setProperty("--h", Math.round(14 + env * 42) + "px");
    b.style.setProperty("--t", (.35 + Math.random() * .5).toFixed(2) + "s");
    b.style.animationDelay = (-Math.random()).toFixed(2) + "s";
    eq.append(b); bars.push(b);
  }
}
const pctEl = $(".ld-pct"), msgEl = $(".ld-msg");
const MSGS = [[0, "tuning in"], [28, "warming up the mic"], [58, "dropping the needle"], [88, "almost live"], [100, "let us go"]];
let pct = 0, finished = false, isLoaded = false;
(document.readyState === "complete" ? Promise.resolve() : new Promise(r => addEventListener("load", r))).then(() => isLoaded = true);
const t0 = performance.now();
function openSite() {
  loader.classList.add("done");
  document.body.classList.remove("loading");
  document.body.classList.add("ready");
}
(function step(now) {
  const target = Math.min(1, (now - t0) / MIN);
  // never reach 100 until the page has really finished loading
  pct = Math.max(pct, Math.min(Math.round(target * 100), isLoaded ? 100 : 96));
  pctEl.textContent = String(pct).padStart(3, "0");
  const on = Math.round(pct / 100 * bars.length);
  bars.forEach((b, i) => b.classList.toggle("on", i < on));
  msgEl.textContent = MSGS.filter(m => pct >= m[0]).pop()[1];
  if (pct >= 100 && !finished) { finished = true; setTimeout(openSite, 450); }
  if (!finished) requestAnimationFrame(step);
})(t0);
setTimeout(openSite, 7000); // safety

/* ---------- stagger ransom letters ---------- */
$$("[data-ransom]").forEach(el => $$(".rn:not(.sp)", el).forEach((l, i) => l.style.setProperty("--i", i)));
$$("[data-ransom]").forEach(el => el.classList.add("rn-host"));
// titles animate when they scroll into view (reveal adds .in)
$$(".title,.cta,.sub-title,.spread,.roles-grid h3").forEach(el => el.classList.add("reveal"));
$$(".hero-name").forEach(el => el.classList.add("in"));
const titleIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); titleIO.unobserve(e.target); } }), { threshold: .2 });
$$(".sub-title,.spread,.roles-grid h3").forEach(el => titleIO.observe(el));

/* ---------- staggered reveal delays ---------- */
$$(".roles-grid article,.venues li,.rec").forEach((el, i) => el.style.setProperty("--dl", (i % 4) * 110 + "ms"));

/* ---------- torn strips wipe in ---------- */
const tearIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.style.clipPath = e.target.dataset.clip; setTimeout(() => e.target.classList.add("wiped"), 1100); tearIO.unobserve(e.target); }
}), { threshold: .1 });
$$(".tear").forEach(t => {
  t.dataset.clip = t.style.clipPath;
  if (!reduce) { t.style.clipPath = "inset(0 100% 0 0)"; tearIO.observe(t); }
});

/* ---------- scroll progress ---------- */
const bar = $(".progress");
const prog = () => { const h = document.documentElement; bar.style.transform = `scaleX(${scrollY / (h.scrollHeight - innerHeight || 1)})`; };
addEventListener("scroll", prog, { passive: true }); prog();

/* ---------- hero text scramble ---------- */
function scramble(el, delay = 0) {
  const final = el.textContent, chars = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOP";
  let f = 0; const total = 28;
  setTimeout(() => {
    const t = setInterval(() => {
      el.textContent = [...final].map((c, i) => c === " " ? " " : (i < f / total * final.length ? c : chars[Math.random() * chars.length | 0])).join("");
      if (++f > total) { clearInterval(t); el.textContent = final; }
    }, 40);
  }, delay);
}
if (!reduce) { scramble($(".hero-tag"), 1700); }
// hero sub: word by word
const sub = $(".hero-sub");
if (sub && !reduce) {
  sub.innerHTML = sub.textContent.split(" ").map((w, i) => `<span class="w" style="animation-delay:${1.8 + i * .12}s">${w}</span>`).join(" ");
}

/* ---------- sparkles around headings ---------- */
const SPARK = ["#ef476f", "#c6d34a", "#d63a63", "#a8c43a", "#c24a2c", "#e8508a"];
const STAR = '<svg viewBox="-10 -10 20 20"><path class="st" d="M0-10C1.4-3.6 3.6-1.4 10 0 3.6 1.4 1.4 3.6 0 10-1.4 3.6-3.6 1.4-10 0-3.6-1.4-1.4-3.6 0-10Z"/></svg>';
const DOT = '<svg viewBox="-10 -10 20 20"><circle class="dot" r="6"/></svg>';
$$("[data-ransom]").forEach((el, k) => {
  const small = el.matches("h3"), n = el.classList.contains("hero-name") ? 9 : small ? 2 : 5, f = small ? .45 : innerWidth < 600 ? .7 : 1;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span"), dot = i % 4 === 3;
    s.className = "sp4";
    s.innerHTML = dot ? DOT : STAR;
    s.style.setProperty("--c", SPARK[(i + k) % SPARK.length]);
    s.style.setProperty("--s", ((dot ? 9 + Math.random() * 7 : 16 + Math.random() * 26) * f) + "px");
    s.style.setProperty("--x", (Math.random() * 110 - 5) + "%");
    s.style.setProperty("--y", (Math.random() * 130 - 20) + "%");
    s.style.setProperty("--t", (1.6 + Math.random() * 2) + "s");
    s.style.setProperty("--dl", (-Math.random() * 3) + "s");
    el.append(s);
  }
});

/* ---------- ransom letter flicker (random letter re-cuts itself) ---------- */
const letters = $$(".hero-name .rn:not(.sp)");
const variants = ["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "a0", "a1", "a2", "a3"];
if (!reduce) setInterval(() => {
  if (document.hidden || !letters.length) return;
  const l = letters[Math.random() * letters.length | 0];
  l.classList.remove("flip"); void l.offsetWidth; l.classList.add("flip");
  setTimeout(() => {
    l.className = "rn flip " + ["f0", "f1", "f2", "f3"][Math.random() * 4 | 0];
    l.style.transform = window.chunk(Math.random);
  }, 220);
}, 1600);

/* ---------- floating music icons ---------- */
const ICONS = [
  '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',                      // note
  '<svg viewBox="0 0 24 24"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/></svg>', // headphones
  '<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></svg>',              // mic
  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>',                // vinyl
  '<svg viewBox="0 0 24 24"><path d="M3 12h2l2-6 3 12 3-16 3 14 2-4h3"/></svg>',                                                                      // pulse
  '<svg viewBox="0 0 24 24"><path d="M20 3 11 12M14 6l4 4M11 12a4 4 0 1 0-5 5 4 4 0 0 0 5-5zM6 17l-3 3"/></svg>'                                     // guitar-ish
];
const GLYPHS = ["♪", "♫", "♬", "♩", "✶"];
const layer = $(".float-layer");
function spawn() {
  if (document.hidden || reduce) return;
  const el = document.createElement("span");
  const glyph = Math.random() < .4, size = 18 + Math.random() * 30;
  el.className = "fi" + (glyph ? " g" : "");
  if (glyph) { el.textContent = GLYPHS[Math.random() * GLYPHS.length | 0]; el.style.fontSize = size * 1.3 + "px"; }
  else { el.innerHTML = ICONS[Math.random() * ICONS.length | 0]; el.style.width = el.style.height = size + "px"; }
  el.style.left = Math.random() * 96 + "vw";
  el.style.setProperty("--d", 9 + Math.random() * 8 + "s");
  el.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
  el.style.setProperty("--r", (Math.random() * 120 - 60) + "deg");
  el.style.setProperty("--o", (.08 + Math.random() * .16).toFixed(2));
  layer.append(el);
  el.addEventListener("animationend", () => el.remove());
}
if (!reduce) { for (let i = 0; i < 6; i++) setTimeout(spawn, i * 500); setInterval(spawn, 1400); }

/* ---------- custom cursor ---------- */
if (fine && !reduce) {
  document.body.classList.add("has-cursor");
  const dot = $(".cursor-dot"), ring = $(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
  (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", e => ring.classList.toggle("hot", !!e.target.closest("a,button,.rec,.roles-grid article,.rn")));
}

/* ---------- hero mouse parallax ---------- */
const collage = $(".hero-collage");
if (collage && fine && !reduce) {
  const stick = $$(".sticker,.doodle", collage);
  addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    stick.forEach((s, i) => { s.style.marginLeft = x * (14 + i * 10) + "px"; s.style.marginTop = y * (10 + i * 8) + "px"; });
  });
}

/* ---------- 3D tilt + magnetic ---------- */
if (fine && !reduce) {
  $$(".roles-grid article,.polaroid,.bio-photo-wrap").forEach(c => {
    c.addEventListener("mousemove", e => {
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.style.transform = `perspective(700px) rotateY(${(x - .5) * 12}deg) rotateX(${(.5 - y) * 12}deg) translateY(-6px)`;
      c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
    });
    c.addEventListener("mouseleave", () => c.style.transform = "");
  });
  $$(".btn,.contact a,.logo,.vibe").forEach(b => {
    b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .35}px`; });
    b.addEventListener("mouseleave", () => b.style.translate = "");
  });
}

/* ---------- scroll parallax ---------- */
const wm = $(".watermark"), vinyls = $$(".loader-vinyl");
addEventListener("scroll", () => {
  if (reduce) return;
  if (collage) collage.style.translate = `0 ${scrollY * .12}px`;
  if (wm) wm.style.translate = `0 ${-scrollY * .05}px`;
}, { passive: true });

/* ---------- waveform divider ---------- */
const wave = $(".wave");
if (wave) {
  const n = Math.min(70, Math.floor(innerWidth / 14));
  for (let i = 0; i < n; i++) {
    const b = document.createElement("i");
    const env = Math.sin((i / n) * Math.PI);           // taller in the middle
    b.style.setProperty("--h", (.15 + env * (.4 + Math.random() * .45)).toFixed(2));
    b.style.setProperty("--t", (.5 + Math.random() * .9).toFixed(2) + "s");
    b.style.setProperty("--dl", (-Math.random() * 1.5).toFixed(2) + "s");
    wave.append(b);
  }
}

/* ---------- vibe: lo-fi track (synthesised in the browser, user-triggered) ---------- */
const vibe = $(".vibe"), label = $(".vibe-label");
let ac, master, delayBus, schedTimer, nextT = 0, step = 0, barN = 0, fileAudio = null, crackle;
const BPM = 78, S16 = 60 / BPM / 4, SWING = S16 * .22;
const mf = m => 440 * Math.pow(2, (m - 69) / 12);
// A minor lo-fi loop: Am9 - Fmaj9 - Cmaj7 - G13   (midi note numbers)
const PROG = [
  { root: 45, chord: [57, 60, 64, 67, 71] },   // Am9
  { root: 41, chord: [53, 57, 60, 64, 67] },   // Fmaj9
  { root: 48, chord: [60, 64, 67, 71, 74] },   // Cmaj7(9)
  { root: 43, chord: [53, 59, 62, 64, 69] }    // G13
];
const PENTA = [69, 72, 74, 76, 79, 81];        // A C D E G A  (melody pool)

function buildGraph() {
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = .85;
  const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7500;
  master.connect(lp).connect(ac.destination);
  // echo for chords + melody
  delayBus = ac.createGain(); delayBus.gain.value = .5;
  const dl = ac.createDelay(1); dl.delayTime.value = 60 / BPM * .75;
  const fb = ac.createGain(); fb.gain.value = .38;
  const dlp = ac.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2200;
  delayBus.connect(dl); dl.connect(dlp).connect(fb).connect(dl); dlp.connect(master);
  // vinyl crackle bed
  const len = ac.sampleRate * 4, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() < .0009 ? (Math.random() * 2 - 1) : 0) + (Math.random() * 2 - 1) * .012;
  crackle = ac.createBufferSource(); crackle.buffer = buf; crackle.loop = true;
  const cg = ac.createGain(); cg.gain.value = .5;
  const chp = ac.createBiquadFilter(); chp.type = "highpass"; chp.frequency.value = 1200;
  crackle.connect(chp).connect(cg).connect(master); crackle.start();
}
function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + a + dec); }
function kick(t, v = 1) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + .13);
  g.gain.setValueAtTime(.6 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + .3);
  o.connect(g).connect(master); o.start(t); o.stop(t + .32);
}
function noiseHit(t, dur, vol, type, freq) {
  const buf = ac.createBuffer(1, Math.max(1, ac.sampleRate * dur), ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = buf; f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f).connect(g).connect(master); s.start(t);
}
function snare(t) { noiseHit(t, .2, .26, "bandpass", 1800); const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(120, t + .08); g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); o.connect(g).connect(master); o.start(t); o.stop(t + .13); }
function bassNote(t, m, len = .5) {
  const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
  o.type = "sine"; o.frequency.value = mf(m); f.type = "lowpass"; f.frequency.value = 420;
  env(g, t, .01, .42, len); o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + len + .05);
}
function rhodes(t, notes, len, vel = .09) {
  notes.forEach((m, i) => {
    [0, 5].forEach(det => {
      const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = det ? "triangle" : "sine"; o.frequency.value = mf(m); o.detune.value = det + (i % 2 ? 3 : -3);
      f.type = "lowpass"; f.frequency.value = 1700;
      env(g, t + i * .018, .02, vel / (det ? 2 : 1), len);
      o.connect(f); f.connect(g); g.connect(master); g.connect(delayBus);
      o.start(t + i * .018); o.stop(t + len + .1);
    });
  });
}
function lead(t, m, len = .5) {
  const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = mf(m); f.type = "lowpass"; f.frequency.value = 2400;
  const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5; lg.gain.value = 4; lfo.connect(lg).connect(o.detune);
  env(g, t, .015, .11, len); o.connect(f).connect(g); g.connect(master); g.connect(delayBus);
  o.start(t); lfo.start(t); o.stop(t + len + .1); lfo.stop(t + len + .1);
}
let motif = [0, 2, 3, 2, 4, 3, 1, 0];
function playStep(s, t) {
  const p = PROG[barN % 4];
  if (s === 0) { rhodes(t, p.chord, 2.6); bassNote(t, p.root, .9); }
  if (s === 10) { rhodes(t, p.chord.slice(1, 4), 1.2, .07); bassNote(t, p.root + (barN % 2 ? 7 : 12), .45); }
  if (s === 6) bassNote(t, p.root, .3);
  if ([0, 7, 10].includes(s)) kick(t, s === 0 ? 1 : .8);
  if (s === 4 || s === 12) snare(t);
  if (s % 2 === 0) noiseHit(t, .045, s % 4 === 0 ? .08 : .045, "highpass", 7500);
  if (s % 4 === 3 && Math.random() < .5) noiseHit(t, .03, .03, "highpass", 8500);   // ghost hat
  // sparse melody, from the pentatonic pool, rests are part of the vibe
  if ([2, 5, 8, 11, 14].includes(s) && Math.random() < (barN % 4 === 3 ? .35 : .5)) {
    const idx = motif[(Math.random() * motif.length) | 0];
    lead(t, PENTA[idx] + (Math.random() < .12 ? 12 : 0), .4 + Math.random() * .5);
  }
}
function scheduler() {
  while (nextT < ac.currentTime + .15) {
    const s = step % 16, swing = s % 2 ? SWING : 0;
    playStep(s, nextT + swing);
    nextT += S16; step++;
    if (step % 16 === 0) barN++;
  }
}
async function startBeat() {
  // a real file wins if you provide one in CONFIG.music
  if (typeof CONFIG !== "undefined" && CONFIG.music) {
    fileAudio = fileAudio || Object.assign(new Audio(CONFIG.music), { loop: true, volume: .7 });
    try { await fileAudio.play(); } catch (e) { console.warn("Audio file could not play:", e); }
    return;
  }
  if (!ac) buildGraph();
  await ac.resume();
  step = 0; barN = 0; nextT = ac.currentTime + .08;
  schedTimer = setInterval(scheduler, 25);
}
function stopBeat() {
  if (fileAudio) fileAudio.pause();
  clearInterval(schedTimer);
  if (ac) { master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(0, ac.currentTime, .05); setTimeout(() => { master.gain.value = .85; ac.suspend(); }, 400); }
}
vibe.addEventListener("click", () => {
  const on = vibe.getAttribute("aria-pressed") !== "true";
  vibe.setAttribute("aria-pressed", on);
  label.textContent = on ? "Vibe on" : "Vibe off";
  document.body.classList.toggle("beat", on);
  on ? startBeat() : stopBeat();
});
})();
