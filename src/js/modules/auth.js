import { API_BASE, APP_BASE, APP_HOME } from './config.js'
import { post, postAuth } from './httprequests.js'
import { setCookie, getCookie, deleteCookie } from './cookies.js';
import { isValidCredentials } from './validators.js';

/**
 * Handle sign in action.
 * @todo Display error messages. (account does not exist, general)
 */
export function handleSignin() {
  event.preventDefault();
  const data = {
    email: document.querySelector("#signin-email").value,
    password: document.querySelector("#signin-password").value,
  };

  if (isValidCredentials(data)) {
    post(`${API_BASE}/users/login`, data)
    .then(resp => {
      console.log(resp);
      // setCookie('jwt', resp.token, 1);
      // window.location.replace(`${APP_BASE}${APP_HOME}`);
    })
    .catch(err => {
      console.log(err);
    });
  }
}

/**
 * Handle registration action.
 * @todo Display error messages. (invalid password, invalid email, email not unique, general)
 */
export function handleSignup() {
  event.preventDefault();
  const data = {
    email: document.querySelector("#signup-email").value,
    password: document.querySelector("#signup-password").value,
  };

  if (isValidCredentials(data)) {
    post(`${API_BASE}/users`, data)
    .then(resp => {
      setCookie('jwt', resp.token, 1);
      window.location.replace(`${APP_BASE}${APP_HOME}`);
    })
    .catch(err => {
      console.log(err);
    });
  }
}

/**
 * Handle logout action.
 * @todo Handles errors
 */
export function handleLogout() {
  event.preventDefault();
  const token = getCookie('jwt');
  
  postAuth(`${API_BASE}/users/logout`, token, {})
    .then(resp => {
      deleteCookie('jwt');
      window.location.replace(APP_BASE);
    })
    .catch(err => {
      console.log(err)
    });
}