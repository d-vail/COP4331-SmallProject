import { signin, signup, logout } from './modules/auth.js';
import { loadAppState, searchContacts } from './modules/getters.js';

const page = document.querySelector('body').id;

if (page == 'signin') initSignin();
if (page == 'signup') initSignup();
if (page == 'app') initApp();

/**
 * Setup event handlers for the sign up/index page.
 */
function initSignin() {
  const signinForm = document.querySelector('.signup-signin-form form');
  signinForm.addEventListener('submit', signin);
}

/**
 * Setup event handlers for the sign up page.
 */
function initSignup() {
  const signupForm = document.querySelector('.signup-signin-form form');
  signupForm.addEventListener('submit', signup);
}

/**
 * Setup event handlers for the app home page.
 */
function initApp() {
  const logoutBtn = document.querySelector('#logout');
  const search = document.querySelector('#search');

  logoutBtn.addEventListener('click', logout);
  search.addEventListener('submit', searchContacts);

  loadAppState();
}