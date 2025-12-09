// common.js — shared helpers for auth + navigation + storage
// load this from every page (put <script src="common.js"></script> before page-specific scripts)

(function(global){
  const APP_KEY = 'rb_app_v1';

  function setLoggedIn(email) {
    localStorage.setItem('rb_logged_in', JSON.stringify({ email }));
  }
  function logout() {
    localStorage.removeItem('rb_logged_in');
  }
  function isLoggedIn() {
    return !!localStorage.getItem('rb_logged_in');
  }
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('rb_logged_in') || 'null');
  }

  // resume storage helpers
  function saveUserProfile(email, profile) {
    // store per-email
    const all = JSON.parse(localStorage.getItem('rb_profiles') || '{}');
    all[email] = profile;
    localStorage.setItem('rb_profiles', JSON.stringify(all));
  }
  function loadUserProfile(email) {
    const all = JSON.parse(localStorage.getItem('rb_profiles') || '{}');
    return all[email] || null;
  }
  function saveResume(email, resume) {
    const key = `rb_resume_${email}`;
    localStorage.setItem(key, JSON.stringify(resume));
  }
  function loadResume(email) {
    const key = `rb_resume_${email}`;
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  // simple nav guard
  function requireLogin(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
      location.href = redirectTo;
      return false;
    }
    return true;
  }

  global.RB = {
    setLoggedIn, logout, isLoggedIn, getLoggedInUser,
    saveUserProfile, loadUserProfile,
    saveResume, loadResume,
    requireLogin
  };
})(window);
