/**
 * sd.js
 * ─────────────────────────────────────────
 * SD — Sales & Distribution module.
 * Handles customers and sales orders.
 *
 *   addCustomer()       → add to master data
 *   removeCustomer()    → delete row + refresh DD
 *   refreshCustomerDD() → sync SO customer dropdown
 *   calcGST()           → live GST preview on input
 *   createSO()          → post sales order + FI entries
 */

function addCustomer() {
  const name = document.getElementById("cu-name").value.trim();
  if (!name) {
    toast("Enter customer name", false);
    return;
  }

  const id = S.cc++;
  const city = document.getElementById("cu-city").value.trim() || "Mumbai";
  const type = document.getElementById("cu-type").value;
  const cred = parseInt(document.getElementById("cu-cred").value) || 500000;

  S.customers.push({ id, name, city, type, cred });

  const tb = document.getElementById("cust-tbl");
  tb.innerHTML = tb.innerHTML.replace(/<tr><td colspan.*?<\/tr>/s, "");
  tb.innerHTML += `
    <tr>
      <td class="mono">${id}</td>
      <td>${name}</td>
      <td>${city}</td>
      <td class="mono">${fmt(cred)}</td>
      <td><button class="btn btn-red" onclick="removeCustomer(${id},this)">✕</button></td>
    </tr>`;

  refreshCustomerDD();
  updateAll();
  toast(`Customer ${id} added`);

  document.getElementById("cu-name").value = "";
  document.getElementById("cu-city").value = "";
  document.getElementById("cu-cred").value = "";
}

function removeCustomer(id, btn) {
  S.customers = S.customers.filter((c) => c.id !== id);
  btn.closest("tr").remove();

  const tb = document.getElementById("cust-tbl");
  if (tb.rows.length === 0)
    tb.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:20px;font-style:italic;">No customers.</td></tr>';

  refreshCustomerDD();
  updateAll();
}

function refreshCustomerDD() {
  const sel = document.getElementById("so-cust");
  sel.innerHTML = '<option value="">— Select Customer —</option>';
  S.customers.forEach((c) => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = `${c.id} — ${c.name}`;
    sel.appendChild(o);
  });
}

/** Live GST preview — called on qty/price input events */
function calcGST() {
  const qty = parseInt(document.getElementById("so-qty").value) || 1;
  const p = parseFloat(document.getElementById("so-price").value) || 0;
  const gst = Math.round(qty * p * 0.18);
  document.getElementById("so-gst").value =
    gst > 0 ? "₹" + gst.toLocaleString("en-IN") : "";
}

function createSO() {
  const cid = document.getElementById("so-cust").value;
  const prod = document.getElementById("so-prod").value.trim() || "FERT-001";
  const qty = parseInt(document.getElementById("so-qty").value) || 1;
  const price = parseFloat(document.getElementById("so-price").value) || 0;

  if (!cid) {
    toast("Select a customer", false);
    return;
  }
  if (price <= 0) {
    toast("Enter a unit price", false);
    return;
  }

  const cust = S.customers.find((c) => c.id == cid);
  const net = qty * price;
  const gst = Math.round(net * 0.18);
  const total = net + gst;
  const no = S.soc++;

  S.revenue += net;
  S.gst += gst;
  S.ar += total;
  S.sos.push({
    id: no,
    customer: cust.name,
    prod,
    qty,
    net,
    gst,
    total,
    status: "Pending",
  });

  const tb = document.getElementById("so-tbl");
  tb.innerHTML = tb.innerHTML.replace(/<tr><td colspan.*?<\/tr>/s, "");
  tb.innerHTML += `
    <tr>
      <td class="mono">${no}</td>
      <td>${cust.name}</td>
      <td>${prod}</td>
      <td>${qty}</td>
      <td class="mono" style="color:var(--green)">${fmt(net)}</td>
      <td class="mono" style="color:var(--yellow)">${fmt(gst)}</td>
      <td class="mono" style="color:var(--purple);font-weight:700">${fmt(total)}</td>
      <td><span class="badge b-orange">Pending</span></td>
    </tr>`;

  // FI triple-entry
  addJournal(`Dr Accounts Receivable — ${cust.name}`, total, 0, "SD");
  addJournal(`Cr Sales Revenue — ${prod}`, 0, net, "SD");
  addJournal(`Cr GST Output Tax (18%) — ${prod}`, 0, gst, "SD");

  updateAll();
  toast(`SO ${no} created — ${fmt(total)} incl. GST`);

  document.getElementById("so-prod").value = "";
  document.getElementById("so-qty").value = "";
  document.getElementById("so-price").value = "";
  document.getElementById("so-gst").value = "";
}
