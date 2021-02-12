import { signin, signup, logout } from './modules/auth.js';

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
  signinForm.addEventListener('submit', signin);
}

/**
 * Setup event handlers for the sign up page.
 * @todo If already signed in, redirect to app home.
 */
function initSignup() {
  const signupForm = document.querySelector('.signup-signin-form form');
  signupForm.addEventListener('submit', signup);
}

/**
 * Setup event handlers for the app home page.
 * @todo If not signed in, redirect to sign in.
 */
function initApp() {
  const logoutBtn = document.querySelector('#logout');
  logoutBtn.addEventListener('click', logout);
}