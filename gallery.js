/* simple lightbox for the Moments photo wall */
(() => {
  const imgs = [...document.querySelectorAll(".shot img")];
  if (!imgs.length) return;
  const lb = document.createElement("div");
  lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = '<img alt=""><button class="x" aria-label="Close">&times;</button><button class="p" aria-label="Previous">&lsaquo;</button><button class="n" aria-label="Next">&rsaquo;</button>';
  document.body.append(lb);
  const big = lb.querySelector("img");
  let i = 0, opener = null;
  const show = n => { i = (n + imgs.length) % imgs.length; big.src = imgs[i].src; big.alt = imgs[i].alt; };
  const open = n => { opener = document.activeElement; show(n); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".x").focus(); };
  const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; opener && opener.focus(); };
  imgs.forEach((im, n) => im.closest("button").addEventListener("click", () => open(n)));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  lb.querySelector(".x").onclick = close;
  lb.querySelector(".p").onclick = () => show(i - 1);
  lb.querySelector(".n").onclick = () => show(i + 1);
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
})();
