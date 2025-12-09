// common.js
// Put this file in the same folder as your HTML files.
// This exposes a global `App` object with helper functions used by each page.

// --- CONFIG: set your Supabase values (already from your project) ---
const SUPABASE_URL = 'https://aisuwbgwhvbikdvoming.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OZ2XcYvyUC3cpTUPUXhTig_bH_U1QO7';

// Initialize client (assumes supabase UMD script loaded before this file)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simple helpers exposed on App
window.App = {
  client: supabaseClient,

  // get current user (returns { user } similar to supabase)
  async getUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data?.user || null;
  },

  // on auth change (callback receives session)
  onAuthChange(cb) {
    supabaseClient.auth.onAuthStateChange((event, session) => cb(event, session));
  },

  // sign out
  async signOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  },

  // upsert profile to 'profiles' table
  async upsertProfile(payload) {
    return await supabaseClient.from('profiles').upsert(payload, { returning: 'minimal' });
  },

  // get profile row by user id
  async getProfile(userId) {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  },

  // navigate to home (used after login)
  async gotoHome() {
    window.location.href = 'home.html';
  },

  // convenience: fetch experiences list / education (basic)
  async listExperiences(userId) {
    const { data } = await supabaseClient.from('experiences').select('*').eq('user_id', userId).order('created_at', { ascending:false });
    return data || [];
  },

  async listEducation(userId) {
    const { data } = await supabaseClient.from('education').select('*').eq('user_id', userId).order('created_at', { ascending:false });
    return data || [];
  },

  // small helper to format optional string
  esc(s) { return s ? String(s) : ''; }
};
