/**
 * utils.js
 * ─────────────────────────────────────────
 * Pure helper functions — no DOM side effects.
 *   fmt()    → format a rupee value
 *   today()  → localised date string
 *   toast()  → show notification banner
 *   nav()    → switch active page tab
 */

/** Format a number as ₹ with Cr / L shorthand */
function fmt(n) {
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(1) + "Cr";
  if (n >= 100_000) return "₹" + (n / 100_000).toFixed(1) + "L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Return today's date formatted for Indian locale */
function today() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Show a brief toast notification */
function toast(msg, ok = true) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.borderLeftColor = ok ? "var(--green)" : "var(--red)";
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 3000);
}

/** Activate a page tab and hide the rest */
function nav(id, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  document
    .querySelectorAll(".tb-nav a")
    .forEach((a) => a.classList.remove("active"));
  if (el) el.classList.add("active");
}
