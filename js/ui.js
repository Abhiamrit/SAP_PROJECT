/**
 * ui.js
 * ─────────────────────────────────────────
 * DOM update functions.
 *   updateAll()      → sync every KPI & GL cell with state
 *   addJournal()     → push a new journal entry & re-render
 *   refreshJournal() → re-render a specific journal <tbody>
 */

/** Re-render every KPI card and GL balance from state S */
function updateAll() {
  const profit = S.revenue - S.expenses;

  // ── Dashboard: Financial KPIs ──────────────────────
  document.getElementById("k-rev").textContent = fmt(S.revenue);
  document.getElementById("k-exp").textContent = fmt(S.expenses);

  const pk = document.getElementById("k-profit");
  pk.textContent = fmt(Math.abs(profit));
  pk.style.color = profit >= 0 ? "var(--green)" : "var(--red)";

  document.getElementById("k-ar").textContent = fmt(S.ar);
  document.getElementById("k-ap").textContent = fmt(S.ap);

  // ── Dashboard: Operational KPIs ────────────────────
  document.getElementById("k-cust").textContent = S.customers.length;
  document.getElementById("k-vend").textContent = S.vendors.length;
  document.getElementById("k-so").textContent = S.sos.length;
  document.getElementById("k-po").textContent = S.pos.length;

  // ── FI page ────────────────────────────────────────
  document.getElementById("fi-k-rev").textContent = fmt(S.revenue);
  document.getElementById("fi-k-exp").textContent = fmt(S.expenses);

  const fip = document.getElementById("fi-k-profit");
  fip.textContent = fmt(Math.abs(profit));
  fip.style.color = profit >= 0 ? "var(--green)" : "var(--red)";

  document.getElementById("fi-k-gst").textContent = fmt(S.gst);

  // GL account balances
  document.getElementById("gl-110000").textContent = fmt(S.ar);
  document.getElementById("gl-200000").textContent = fmt(S.ap);
  document.getElementById("gl-300000").textContent = fmt(S.revenue);
  document.getElementById("gl-600200").textContent = fmt(S.gst);
  document.getElementById("gl-800000").textContent = fmt(S.expenses);
  document.getElementById("gl-850000").textContent = fmt(S.ap);

  // ── MM page ────────────────────────────────────────
  document.getElementById("mm-k-po").textContent = S.pos.length;
  document.getElementById("mm-k-spend").textContent = fmt(S.expenses);
  document.getElementById("mm-k-vend").textContent = S.vendors.length;

  // ── SD page ────────────────────────────────────────
  document.getElementById("sd-k-so").textContent = S.sos.length;
  document.getElementById("sd-k-rev").textContent = fmt(S.revenue);
  document.getElementById("sd-k-cust").textContent = S.customers.length;
}

/** Push a journal entry into state and re-render all journal tables */
function addJournal(desc, debit, credit, module) {
  S.journal.unshift({ date: today(), desc, debit, credit, module });
  refreshJournal("journal-tbl", false); // Dashboard
  refreshJournal("fi-journal-tbl", true); // FI compact
  refreshJournal("fi-all-journal", false); // FI full
}

/** Re-render a journal <tbody> — compact hides date & module badge */
function refreshJournal(tbId, compact) {
  const tb = document.getElementById(tbId);
  if (!tb) return;
  tb.innerHTML = "";

  if (S.journal.length === 0) {
    tb.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:24px;font-style:italic;">No entries yet.</td></tr>';
    return;
  }

  S.journal.forEach((e) => {
    const modBadge =
      e.module === "SD" ? "b-purple" : e.module === "MM" ? "b-blue" : "b-green";
    const dr = e.debit > 0 ? fmt(e.debit) : "—";
    const cr = e.credit > 0 ? fmt(e.credit) : "—";

    tb.innerHTML += compact
      ? `<tr class="journal-row">
           <td>${e.desc}</td>
           <td>${dr}</td>
           <td>${cr}</td>
         </tr>`
      : `<tr class="journal-row">
           <td class="mono" style="color:var(--text3);font-size:11px">${e.date}</td>
           <td>${e.desc}</td>
           <td>${dr}</td>
           <td>${cr}</td>
           <td><span class="badge ${modBadge}">${e.module}</span></td>
         </tr>`;
  });
}
