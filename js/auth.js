/**
 * auth.js
 * ─────────────────────────────────────────
 * Authentication — login & logout only.
 * Credentials are hardcoded for this demo.
 *   doLogin()   → validate and show app
 *   doLogout()  → hide app, show login screen
 */

function doLogin() {
  const user = document.getElementById("lu").value.trim();
  const pass = document.getElementById("lp").value.trim();

  if (user === "admin" && pass === "admin") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    updateAll();
  } else {
    document.getElementById("lerr").style.display = "block";
  }
}

function doLogout() {
  document.getElementById("app").style.display = "none";
  document.getElementById("login").style.display = "flex";
}
