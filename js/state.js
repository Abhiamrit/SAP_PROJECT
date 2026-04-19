/**
 * state.js
 * ─────────────────────────────────────────
 * Single global state object.
 * All modules read/write S — no hidden state elsewhere.
 */

const S = {
  // Master data
  vendors: [],
  customers: [],

  // Transactions
  pos: [], // Purchase Orders
  sos: [], // Sales Orders

  // Financial accumulators
  revenue: 0,
  expenses: 0,
  gst: 0,
  ar: 0, // Accounts Receivable  (GL 110000)
  ap: 0, // Accounts Payable     (GL 200000)

  // Auto-increment counters
  vc: 200001, // Vendor ID
  cc: 100001, // Customer ID
  poc: 4500001, // PO number
  soc: 1000001, // SO number

  // Journal ledger (newest first)
  journal: [],
};
