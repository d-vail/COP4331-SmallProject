import { API_BASE, APP_BASE, APP_HOME } from './config.js'
import { post, postAuth } from './httprequests.js'
import { setCookie, getCookie, deleteCookie } from './cookies.js';
import { alertTemplate } from './templates.js';

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
      displayAuthError('Could not verify username and password. Please try again.');
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
      displayAuthError('Account could not be created. Please try again.');
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

// ---------
// Helpers
// ---------

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
    window.location.replace(`${APP_BASE}${APP_HOME}`);
  } else {
    displayAuthError(response.body.Error);
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

/**
 * Attaches an error alert to the signup/signin form with the given message.
 * @param {string} message - The message to include in the alert.
 */
function displayAuthError(message) {
  const form = document.querySelector('.signup-signin-form form'); 
  const alerts = document.querySelectorAll('.signup-signin-form form .alert');

  for (let i = 0; i < alerts.length; i++)
    form.removeChild(alerts[i]);

  form.appendChild(alertTemplate(message));
}