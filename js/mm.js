/**
 * mm.js
 * ─────────────────────────────────────────
 * MM — Materials Management module.
 * Handles vendors and purchase orders.
 *
 *   addVendor()       → add to master data
 *   removeVendor()    → delete row + refresh DD
 *   refreshVendorDD() → sync PO vendor dropdown
 *   createPO()        → post purchase order + FI entry
 */

function addVendor() {
  const name = document.getElementById("vn-name").value.trim();
  if (!name) {
    toast("Enter vendor name", false);
    return;
  }

  const id = S.vc++;
  const city = document.getElementById("vn-city").value.trim() || "Delhi";
  const type = document.getElementById("vn-type").value;

  S.vendors.push({ id, name, city, type });

  const tb = document.getElementById("vend-tbl");
  tb.innerHTML = tb.innerHTML.replace(/<tr><td colspan.*?<\/tr>/s, "");
  tb.innerHTML += `
    <tr>
      <td class="mono">${id}</td>
      <td>${name}</td>
      <td>${city}</td>
      <td><span class="badge b-blue">${type}</span></td>
      <td><button class="btn btn-red" onclick="removeVendor(${id},this)">✕</button></td>
    </tr>`;

  refreshVendorDD();
  updateAll();
  toast(`Vendor ${id} added`);

  document.getElementById("vn-name").value = "";
  document.getElementById("vn-city").value = "";
}

function removeVendor(id, btn) {
  S.vendors = S.vendors.filter((v) => v.id !== id);
  btn.closest("tr").remove();

  const tb = document.getElementById("vend-tbl");
  if (tb.rows.length === 0)
    tb.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:20px;font-style:italic;">No vendors.</td></tr>';

  refreshVendorDD();
  updateAll();
}

function refreshVendorDD() {
  const sel = document.getElementById("po-vend");
  sel.innerHTML = '<option value="">— Select Vendor —</option>';
  S.vendors.forEach((v) => {
    const o = document.createElement("option");
    o.value = v.id;
    o.textContent = `${v.id} — ${v.name}`;
    sel.appendChild(o);
  });
}

function createPO() {
  const vid = document.getElementById("po-vend").value;
  const mat = document.getElementById("po-mat").value.trim() || "ROH-001";
  const qty = parseInt(document.getElementById("po-qty").value) || 1;
  const price = parseFloat(document.getElementById("po-price").value) || 0;

  if (!vid) {
    toast("Select a vendor", false);
    return;
  }
  if (price <= 0) {
    toast("Enter a unit price", false);
    return;
  }

  const vend = S.vendors.find((v) => v.id == vid);
  const net = qty * price;
  const no = S.poc++;

  S.expenses += net;
  S.ap += net;
  S.pos.push({ id: no, vendor: vend.name, mat, qty, net, status: "Open" });

  const tb = document.getElementById("po-tbl");
  tb.innerHTML = tb.innerHTML.replace(/<tr><td colspan.*?<\/tr>/s, "");
  tb.innerHTML += `
    <tr>
      <td class="mono">${no}</td>
      <td>${vend.name}</td>
      <td>${mat}</td>
      <td>${qty}</td>
      <td class="mono" style="color:var(--orange)">${fmt(net)}</td>
      <td><span class="badge b-yellow">Open</span></td>
    </tr>`;

  // FI double-entry
  addJournal(`Dr Inventory (${mat}) — ${vend.name}`, net, 0, "MM");
  addJournal(`Cr GR/IR Clearing — ${vend.name}`, 0, net, "MM");

  updateAll();
  toast(`PO ${no} created — ${fmt(net)}`);

  document.getElementById("po-mat").value = "";
  document.getElementById("po-qty").value = "";
  document.getElementById("po-price").value = "";
}
