// common.js
// Shared Supabase client + small helper functions used by all pages.
// Loads after the UMD supabase script on every page.

const SUPABASE_URL = 'https://aisuwbgwhvbikdvoming.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OZ2XcYvyUC3cpTUPUXhTig_bH_U1QO7';

// create client (UMD exposes global `supabase`)
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth redirect helper
window.redirectToHome = async function() {
  const { data: { user } } = await window.supabaseClient.auth.getUser();
  if (user) {
    location.href = 'home.html';
  } else {
    location.href = 'login.html';
  }
};

// Simple check used on pages: if not logged in -> redirect to login
window.ensureAuthOrRedirect = async function() {
  const { data: { user } } = await window.supabaseClient.auth.getUser();
  if (!user) location.href = 'login.html';
  return user;
};

// Sign out helper used by pages:
window.doSignOut = async function() {
  await window.supabaseClient.auth.signOut();
  location.href = 'login.html';
};
