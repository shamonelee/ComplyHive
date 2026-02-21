// ====== Utility: smooth mobile menu ======
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("isOpen");
  navToggle.setAttribute("aria-expanded", String(open));
});

navMenu?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navMenu.classList.remove("isOpen");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = String(new Date().getFullYear());

// ====== Lead form: mailto (static-site friendly) ======
const leadForm = document.getElementById("leadForm");
leadForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(leadForm);
  const name = String(fd.get("name") || "");
  const company = String(fd.get("company") || "");
  const email = String(fd.get("email") || "");
  const msg = String(fd.get("message") || "");

  const subject = encodeURIComponent(`ComplyHive enquiry — ${company}`);
  const body = encodeURIComponent(
`Name: ${name}
Company: ${company}
Email: ${email}

Brief:
${msg}

(Submitted via complyhive.net site)`
  );

  // Change destination email here if needed
  window.location.href = `mailto:info@complyhive.net?subject=${subject}&body=${body}`;
});

// ====== Canvas: animated hexfield ======
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function resize() {
  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// Hex grid parameters
const hexRadius = 26;
const hexGap = 12;
const speed = prefersReducedMotion ? 0 : 0.18;

function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function drawHex(cx, cy, r, strokeStyle, alpha) {
  const pts = hexPoints(cx, cy, r);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

let t = 0;

function frame() {
  t += speed;

  // Clear with slight fade for softness
  ctx.clearRect(0, 0, w, h);

  // Vignette
  const vg = ctx.createRadialGradient(w*0.5, h*0.2, 120, w*0.5, h*0.2, Math.max(w,h));
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // Right-side emphasis area (pattern stronger on right quarter)
  const rightStart = w * 0.65;

  // Hex grid drawing
  const dx = (hexRadius * 1.8) + hexGap;
  const dy = (Math.sqrt(3) * hexRadius) + hexGap;

  for (let row = -2; row < Math.ceil(h / dy) + 2; row++) {
    for (let col = -2; col < Math.ceil(w / dx) + 2; col++) {
      const offset = (row % 2) * (dx / 2);
      let x = col * dx + offset;
      let y = row * dy;

      // gentle drift
      x += Math.sin((row * 0.7) + t * 0.8) * 4;
      y += Math.cos((col * 0.6) + t * 0.7) * 3;

      // fade left side (keep hero copy area cleaner)
      const emphasis = Math.min(1, Math.max(0, (x - rightStart) / (w - rightStart)));
      const alpha = 0.03 + emphasis * 0.10;

      // color blend gold <-> cyan across Y
      const mix = (y / h);
      const gold = `rgba(216,179,90,${alpha})`;
      const cyan = `rgba(77,212,255,${alpha})`;
      const stroke = mix < 0.5 ? gold : cyan;

      // draw only some hexes for “air”
      const noise = Math.abs(Math.sin((row * 12.9898 + col * 78.233) * 0.01));
      if (noise > 0.35) drawHex(x, y, hexRadius, stroke, alpha);
    }
  }

  if (!prefersReducedMotion) requestAnimationFrame(frame);
}
frame();
