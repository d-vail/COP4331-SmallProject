import { API_BASE } from './modules/config.js';
import { get } from './modules/httprequests.js';
import { handleSignin, handleSignup, handleLogout } from './modules/auth.js';

// Sanity Check
get(API_BASE)
  .then(resp => console.log(resp))
  .catch(err => console.log(err));

const page = document.querySelector('body').id;

if (page == 'signin') initSignin();
if (page == 'signup') initSignup();
if (page == 'app') initApp();

/**
 * Setup event handlers for the sign up/index page.
 * @todo If already signed in, redirect to app home.
 */
function initSignin() {
  const signinForm = document.querySelector('.signup-signin-form form');
  signinForm.addEventListener('submit', handleSignin);
}

/**
 * Setup event handlers for the sign up page.
 * @todo If already signed in, redirect to app home.
 */
function initSignup() {
  const signupForm = document.querySelector('.signup-signin-form form');
  signupForm.addEventListener('submit', handleSignup);
}

/**
 * Setup event handlers for the app home page.
 * @todo If not signed in, redirect to sign in.
 */
function initApp() {
  const logoutBtn = document.querySelector('#logout');
  logoutBtn.addEventListener('click', handleLogout);
}