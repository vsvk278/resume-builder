// common.js
// Put this file alongside your html pages (same folder).
// Uses the UMD supabase global (loaded in each HTML via CDN) and initializes client.

const SUPABASE_URL = 'https://aisuwbgwhvbikdvoming.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OZ2XcYvyUC3cpTUPUXhTig_bH_U1QO7';

let supabaseClient = null;

function initSupabase() {
  if (!window.supabase) {
    console.error('Supabase global not found. Make sure you loaded the UMD bundle.');
    return;
  }
  if (!supabaseClient) {
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

function getUser() {
  initSupabase();
  return supabaseClient.auth.getUser().then(r => r.data?.user || null).catch(()=>null);
}

async function requireAuthRedirect(redirectTo = 'login.html') {
  initSupabase();
  const { data } = await supabaseClient.auth.getUser();
  if (!data?.user) {
    window.location.href = redirectTo;
    return null;
  }
  return data.user;
}

function signOutAndRedirect(redirectTo = 'login.html') {
  initSupabase();
  supabaseClient.auth.signOut().then(() => {
    window.location.href = redirectTo;
  });
}

// small helper to show toast text (simple)
function showStatus(targetEl, msg, ok=true) {
  if (!targetEl) return;
  targetEl.innerText = msg;
  targetEl.style.color = ok ? '#0ea5a4' : '#ef4444';
  setTimeout(()=>{ if(targetEl.innerText === msg) targetEl.innerText = '' }, 3500);
}

// export for pages that run in modules? Not necessary for plain script tags but set on window.
window.appCommon = {
  initSupabase, getUser, requireAuthRedirect, signOutAndRedirect, showStatus, supabaseClientRef: () => supabaseClient
};
