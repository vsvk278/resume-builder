// common.js
// Drop this file in the same folder as the HTML pages.
// It creates a supabaseClient and exposes helper functions on `window`.

(function () {
  // CONFIG: your supabase project values
  const SUPABASE_URL = 'https://aisuwbgwhvbikdvoming.supabase.co'
  const SUPABASE_ANON_KEY = 'sb_publishable_OZ2XcYvyUC3cpTUPUXhTig_bH_U1QO7'

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase config missing in common.js')
    return
  }

  // supabase UMD exposes global `supabase` (when included prior)
  const { createClient } = window.supabase
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // make available globally
  window.supabaseClient = supabaseClient

  // requireAuth: returns user object if authenticated, otherwise redirects to login
  window.requireAuth = async function requireAuth(redirectTo = 'login.html') {
    try {
      const res = await supabaseClient.auth.getUser()
      const user = res?.data?.user ?? null
      if (!user) {
        // no user -> redirect to login
        window.location.href = redirectTo
        return null
      }
      return user
    } catch (err) {
      console.error('requireAuth error', err)
      window.location.href = redirectTo
      return null
    }
  }

  // helper: get current user (may be null)
  window.getCurrentUser = async function getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser()
    return data?.user ?? null
  }

  // helper: save profile to 'profiles' table (upsert by id = user.id)
  window.saveProfile = async function saveProfile(payload) {
    // payload must include id (user id)
    const { error } = await supabaseClient.from('profiles').upsert(payload, { returning: 'minimal' })
    return error
  }

  // helper: fetch profile by user id
  window.fetchProfile = async function fetchProfile(userId) {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', userId).single()
    if (error && error.code !== 'PGRST116') throw error
    return data ?? null
  }

  // experiences, education helpers (basic)
  window.fetchExperiences = async function fetchExperiences(userId) {
    const { data, error } = await supabaseClient.from('experiences').select('*').eq('user_id', userId).order('created_at', { ascending:false })
    if (error) throw error
    return data || []
  }

  window.fetchEducation = async function fetchEducation(userId) {
    const { data, error } = await supabaseClient.from('education').select('*').eq('user_id', userId).order('created_at', { ascending:false })
    if (error) throw error
    return data || []
  }

  // small util: sign user out
  window.doSignOut = async function doSignOut() {
    await supabaseClient.auth.signOut()
  }

  // export completed
  console.log('common.js loaded — supabaseClient available as window.supabaseClient')
})()
