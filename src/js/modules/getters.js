/**
 * @file Event handlers responsible for retrieving app data. Includes loading the initial view of 
 * the app, getting contacts, searching contacts.
 */

import { API_BASE, APP_BASE } from './config.js';
import { getAuth } from './httprequests.js';
import { getCookie, deleteCookie } from './cookies.js';
import { renderEmptyState, renderApp, renderContactDetails } from './views.js';

 /**
  * Load the state for the application.
  */
 export function loadAppState(getURL = false) {
   const token = getCookie('jwt');
   const username = getCookie('username');
   const url = getURL
     ? getURL
     : `${API_BASE}/contact/loadContacts.php?Username=${username}`;

   getAuth(url, token)
     .then(async (resp) => {
       handleLoadResponse({
         ok: resp.ok,
         status: resp.status,
         body: await resp.json(),
       }, true,);
     })
     .catch((err) => {
       console.log(err);
       console.log(
         'TODO: Display 500 error whole page -- base off empty state'
       );
     });
 }

/**
 * Make a GET request for a single contact.
 */
 export function getContact() {
   event.preventDefault();
   const token = getCookie('jwt');
   const username = getCookie('username');
   const contactId = this.dataset.id;

   getAuth(`${API_BASE}/contact/loadContact.php?Username=${username}&ContactID=${contactId}`, token)
     .then(async (resp) => {
       handleGetContactResponse({
         ok: resp.ok,
         status: resp.status,
         body: await resp.json(),
       });
     })
     .catch((err) => {
       console.log(err);
       console.log('TODO: Display 500 error contact details state -- base off empty state');
     });
 }

/**
 * Make a GET request for all contacts at a given page.
 */
export function getContacts() {
  event.preventDefault();
  const url = this.href;
  const token = getCookie('jwt');
  const username = getCookie('username');

  getAuth(url, token)
    .then(async (resp) => {
      handleLoadResponse({
        ok: resp.ok,
        status: resp.status,
        body: await resp.json(),
      });
    })
    .catch((err) => {
      console.log(err);
      console.log('TODO: Display 500 error whole page -- base off empty state');
    });
}

 /**
  * Search names of contacts using search query.
  * @todo Show something besides blank page if no results.
  */
export function searchContacts() {
  event.preventDefault();
  const username = getCookie('username');
  const query = encodeURI(document.querySelector('#search-contacts').value);
  const searchURL = `${API_BASE}/contact/searchContact.php?Username=${username}&Name=${query}`;

  if (query === '') {
    loadAppState();
  } else {
    loadAppState(searchURL);
  }
}

// =================
// Internal Helpers
// =================

/**
 * Maps actions to response from load request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 */
function handleLoadResponse(response, handleMobileView = false) {
  // If action is not authorized, redirect to sign in page.
  if (response.status == 401) {
    deleteCookie('jwt');
    window.location.replace(APP_BASE);
  }

  // If user is authenticated but has no contacts, load empty state view. Otherwise, load the list
  // of contacts and display the details of the first contact in the list.
  if (response.body.count == 0)
    renderEmptyState();
  else
    renderApp(response.body, handleMobileView);
}

/**
 * Maps actions to response from get contact request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 */
function handleGetContactResponse(response) {
  // If action is not authorized, redirect to sign in page.
  if (response.status == 401) {
    deleteCookie('jwt');
    window.location.replace(APP_BASE);
  }

  // If response returned with a match, display the contact details.
  if (response.ok) {
    renderContactDetails(response.body);
  }

  // If somehow a match could not be found, display 404 in contact details.
  // All other errors display 500 server error in contact details.
}