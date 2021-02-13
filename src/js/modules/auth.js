/**
 * Action handlers responsible for authenticating a user: signing up, signing in, logging out
 */

import { API_BASE, APP_BASE, APP_HOME } from './config.js'
import { post } from './httprequests.js'
import { setCookie, deleteCookie } from './cookies.js';
import { renderAuthorizationError } from './views.js';

/**
 * Handle sign in action.
 */
export function signin() {
  event.preventDefault();
  const data = {
    Username: getValue('#signin-username'),
    Password: getValue("#signin-password"),
  };

  post(`${API_BASE}/user/login.php`, data)
    .then(async resp => {
      handleResponse({
        ok: resp.ok,
        status: resp.status,
        body: await resp.json(),
      });
    })
    .catch(err => {
      renderAuthorizationError('.signup-signin-form form', 'Could not verify username and password. Please try again.');
    });
}

/**
 * Handle registration action.
 */
export function signup() {
  event.preventDefault();
  const data = {
    Username: getValue('#signup-username'),
    Email: getValue("#signup-email"),
    Password: getValue("#signup-password"),
  };

  post(`${API_BASE}/user/createUser.php`, data)
    .then(async resp => {
      handleResponse({
        ok: resp.ok,
        status: resp.status,
        body: await resp.json(),
      });
    })
    .catch(err => {
      renderAuthorizationError('.signup-signin-form form', 'Account could not be created. Please try again.');
    });
}

/**
 * Handle logout action.
 */
export function logout() {
  event.preventDefault();
  deleteCookie('jwt');
  window.location.replace(APP_BASE);
}

// =================
// Internal Helpers
// =================

/**
 * Maps actions to response from signin or signup request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 */
function handleResponse(response) {
  if (response.ok) {
    setCookie('jwt', response.body.JWT, 1);
    setCookie('username', response.body.Username, 1);
    window.location.replace(`${APP_BASE}${APP_HOME}`);
  } else {
    renderAuthorizationError('.signup-signin-form form', response.body.Error);
  }
}

/**
 * Get the value of the element represented by the given CSS type selector.
 * @param {string} selector - A CSS type selector matching target element.
 * @returns {string|null} The value of the element or null if a value cannot be found.
 */
function getValue(selector) {
  const element = document.querySelector(selector);
  return valueExists(element) ? element.value : null;
}

/**
 * Check is a value exists for the given Node.
 * @param {Node} element A DOM Node
 * @returns {boolean} A boolean indicating whether a value exists on the given Node.
 */
function valueExists(element) {
  return !(element === null || element.value === undefined ||  element.value == '');
}