/*
 * DEMO / STATIC MODE CONFIGURATION
 *
 * This site is designed for GitHub Pages, which hosts static files only.
 * In demo mode, data is stored in this browser's localStorage and is NOT
 * shared with other visitors or devices.
 *
 * For a real public shared log with secure admin login, connect a backend
 * such as Supabase. Do not put an admin password or secret API key here:
 * JavaScript files on GitHub Pages are public.
 */
window.MEAL_APP_CONFIG = {
  mode: "local",
  // Demo credentials only. Change them before local testing.
  // This is NOT secure authentication and must not be used for a public site.
  demoAdminId: "admin",
  demoAdminPassword: "meal123"
};