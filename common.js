// common.js — Supabase client + small helpers (no UI/CSS changes)
// Put <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.min.js"></script>
// before loading this common.js in every page.

const SUPABASE_URL = 'https://aisuwbgwhvbikdvoming.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OZ2XcYvyUC3cpTUPUXhTig_bH_U1QO7';

if (!window.supabase) {
  console.warn('Supabase UMD not loaded before common.js — ensure the UMD script tag is present.');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.Common = {
  client: supabaseClient,

  // returns user object or null
  async getUser() {
    try {
      const { data } = await supabaseClient.auth.getUser();
      return data?.user || null;
    } catch (e) { console.error('getUser error', e); return null; }
  },

  // Sign up
  async signUp(email, password) {
    return await supabaseClient.auth.signUp({ email, password });
  },

  // Sign in
  async signIn(email, password) {
    return await supabaseClient.auth.signInWithPassword({ email, password });
  },

  // Sign out
  async signOut() {
    return await supabaseClient.auth.signOut();
  },

  // Reset password (send email)
  async resetPasswordForEmail(email, redirectTo) {
    return await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
  },

  // Upsert profile (profiles table must have primary key id = auth.user.id)
  async upsertProfile(profile) {
    return await supabaseClient.from('profiles').upsert(profile, { returning: 'minimal' });
  },

  async getProfileById(id) {
    return await supabaseClient.from('profiles').select('*').eq('id', id).maybeSingle();
  },

  // experiences CRUD (simple)
  async listExperiences(user_id) {
    return await supabaseClient.from('experiences').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
  },
  async insertExperiences(rows) {
    return await supabaseClient.from('experiences').insert(rows);
  },
  async replaceExperiencesForUser(user_id, rows) {
    // delete and insert (simple sync)
    await supabaseClient.from('experiences').delete().eq('user_id', user_id);
    if (rows && rows.length) return await supabaseClient.from('experiences').insert(rows);
    return { error: null };
  },

  // education CRUD (simple)
  async listEducation(user_id) {
    return await supabaseClient.from('education').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
  },
  async replaceEducationForUser(user_id, rows) {
    await supabaseClient.from('education').delete().eq('user_id', user_id);
    if (rows && rows.length) return await supabaseClient.from('education').insert(rows);
    return { error: null };
  },

  // Redirect helpers
  async requireAuthOrRedirect(redirectTo = 'login.html') {
    const u = await this.getUser();
    if (!u) {
      window.location.href = redirectTo;
      return null;
    }
    return u;
  },

  // small helper to extract user id
  async currentUserId() {
    const u = await this.getUser();
    return u?.id || null;
  }
};
