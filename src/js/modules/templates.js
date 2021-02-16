/**
 * @file The template functions are responsible for generating reusable HTML snippets. These are called
 * by view renders and event listeners.
 */
import { MAX_PAGE_LINKS } from './config.js'

/**
 * Creates an alert node with the given message.
 * @param {string} message - The message to include in the alert.
 * @returns {Node} A DOM node.
 */
export function alertNode(message) {
  const wrapper = document.createElement('div');

  wrapper.className = 'alert alert-danger mt-3';
  wrapper.innerHTML = message;

  return wrapper;
}

/**
 * Creates an empty state node.
 * @returns {Node} A DOM node.
 */
export function emptyStateNode(message) {
  const wrapper = document.createElement('div');
  const template = `<img class="mt-5" src="images/undraw_empty_street_sfxm.svg" alt="Empty Contact Manager">
                    <p class="text-center my-4">${message}</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createEditContactModal" >Add Contact</button>`;

  wrapper.className = 'empty-state d-flex flex-column align-items-center';
  wrapper.innerHTML = template;

  return wrapper;
}

/**
 * Creates a not found node.
 * @returns {Node} A DOM node.
 */
export function notFoundNode(message) {
  const wrapper = document.createElement('div');
  const template = `<img class="mt-5" src="images/undraw_not_found_60pq.svg" alt="404 Not Found">
                    <p class="text-center my-4">${message}</p>`;

  wrapper.className = 'empty-state d-flex flex-column align-items-center';
  wrapper.innerHTML = template;

  return wrapper;
}

/**
 * Creates a contact list node. Will hold contact list and pagination elements.
 * @returns {Node} A DOM node.
 */
export function contactListWrapperNode() {
  const wrapper = document.createElement('div');
  const template = `<!-- Contact List Header -->
                    <div class="contact-list-header d-flex flex-row justify-content-between align-items-baseline">
                      <h1 class="primary-header">Contacts</h1>
                      <a class="add-contact-btn" href="#" role="button" title="Add Contact" data-bs-toggle="modal" data-bs-target="#createEditContactModal" data-action="add">
                        <i class="fas fa-plus-square"></i>
                      </a>
                    </div>

                    <!-- Contact List -->
                    <div class="list-group mt-4 mb-5"></div>

                    <!-- Pagination Controls -->
                    <nav>
                      <ul class="pagination justify-content-between">
                        <li class="page-item prev">
                          <a class="page-link" href="#">
                            Previous
                          </a>
                        </li>
                        <li class="numbered-page-links"></li>
                        <li class="page-item next">
                          <a class="page-link" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>`;

  wrapper.className = 'contact-list d-flex flex-column mx-5 my-4';
  wrapper.innerHTML = template;

  return wrapper;
}

/**
 * Creates page links for get all contacts pagination controls.
 * @param {string} username - The current logged in user.
 * @param {integer} current - The current page the GET request is on.
 * @param {integer} pages - The total number of pages in the GET request.
 * @param {string|null} prev - The previous GET request link.
 * @param {string|null} next - The next GET request link.
 * @returns {Node} A DOM node.
 */
export function paginationLinksNode(username, current, pages, prev, next) {
  const start = getStartPageLinkRange(current, pages);
  const end = getEndPageLinkRange(start, current, pages);
  const isSearch = isSearchRequest(prev, next);
  const query = isSearch ? getSearchQuery(prev, next) : '';
  let pageItems = '';

  for (let i = start; i <= end; i++)
    pageItems += isSearch
      ? searchPageLinkTemplate(username, current, i, query)
      : pageLinkTemplate(username, current, i);

  const template = `<ul class="page-links m-0 p-0 d-flex">
                    ${pageItems}
                    </ul>`;

  return template;  
}

/**
 * Creates a contact preview link node. 
 * @param {Object} contact - Contact details.
 * @param {string} contact.ID - The contact id.
 * @param {string} contact.FirstName - The contact's first name.
 * @param {string} contact.LastName - The contact's last name.
 * @param {string} contact.ImageURL - The url of the contact's image.
 * @returns {Node} A DOM node.
 */
export function contactListItemNode(contact) {
  const name = `${contact.FirstName} ${contact.LastName}`;
  const image = `${contact.ImageURL ? contact.ImageURL : 'images/blank-profile-image.png'}`;
  const wrapper = document.createElement('a');
  const template = `<div class="d-flex flex-row align-items-center">
                        <img src="${image}" class="rounded-circle" alt="${name} Preview">
                        <h4 class="ms-3">${name}</h4>
                    </div>`;
  
  wrapper.className = `list-group-item list-group-item-action contact my-1`;
  wrapper.href = '#';
  wrapper.dataset.id = contact.ID;
  wrapper.innerHTML = template;

  return wrapper;
}

/**
 * Creates a contact details node. 
 * @param {Object} contact - Contact details.
 * @param {string} contact.ID - The contact id.
 * @param {string} contact.Username - The user this contact is attached to.
 * @param {string} contact.FirstName - The contact's first name.
 * @param {string} contact.LastName - The contact's last name.
 * @param {string} contact.Email - The contact's email address.
 * @param {string} contact.Phone - The contact's phone number.
 * @param {string} contact.Address - The contact's street address.
 * @param {string} contact.City - The contact's city.
 * @param {string} contact.State - The contact's state.
 * @param {string} contact.ZipCode - The contact's zip code.
 * @param {string} contact.Notes - The contact's notes.
 * @param {string} contact.ImageURL - The url of the contact's image.
 * @returns {Node} A DOM node.
 */
export function contactDetailsNode(contact) {
  const name = `${contact.FirstName} ${contact.LastName}`;
  const image = `${contact.ImageURL ? contact.ImageURL : 'images/blank-profile-image.png'}`;
  const address = hasAddress(contact) ? contactAddressSnippet(contact) : ``;
  const notes  = hasNotes(contact.Notes) ? contactNotesSnippet(contact.Notes) : ``;
  const wrapper = document.createElement('div');
  const template = `<div class="contact-details-header mb-5">
                      <div class="mobile-close w-100 justify-content-end">
                        <button type="button" class="btn-close" aria-label="Close"></button>
                      </div>
                      <div class="name">
                        <img src="${image}" class="rounded-circle" alt="${name} Preview">
                        <h2 id="contact-details-name" class="primary-header mx-4 my-3" data-firstname=${contact.FirstName} data-lastname=${contact.LastName}>${name}</h2>
                      </div>
                      <div class="contact-actions my-3">
                        <a class="btn btn-primary call d-md-none me-3" href="tel:${contact.Phone}">
                          Call
                        </a>
                        <a class="btn btn-primary email" href="mailto:${contact.Email}">
                          Email
                        </a>
                      </div>
                    </div>
                    <div class="card contact">
                      <h3 class="card-header">Contact Information</h3>
                      <address>
                        <a id="contact-details-email" class="d-block" href="mailto:${contact.Email}">
                          <span class="icon me-2"><i class="fas fa-envelope"></i></span>
                          ${contact.Email}
                        </a>
                        <a id="contact-details-phone" class="d-block" href="tel:${contact.Phone}">
                          <span class="icon me-2"><i class="fas fa-phone"></i></span>
                          ${contact.Phone}
                        </a>
                      </address>
                    </div>
                    ${address}
                    ${notes}
                    <div class="edit-actions d-flex flex-row justify-content-end">
                      <a class="btn delete me-3" href="#">Delete</a>
                      <!-- Button triggers modal -->
                      <a id="editContact" class="btn btn-secondary-outline-400 edit" href="#" 
                        data-action="edit" data-bs-toggle="modal" data-bs-target="#createEditContactModal">
                        Edit
                      </a>
                    </div>`;

  wrapper.className = `contact-details px-5 py-4 p-lg-0 me-lg-5 my-lg-4`;
  wrapper.dataset.id = contact.ID;
  wrapper.innerHTML = template;
  return wrapper;
}

// =================
// Internal Helpers
// =================

/**
 * Create HTML snippet for the contact's address.
 * @param {Object} contact - Contact details.
 * @param {string} contact.ID - The contact id.
 * @param {string} contact.Username - The user this contact is attached to.
 * @param {string} contact.FirstName - The contact's first name.
 * @param {string} contact.LastName - The contact's last name.
 * @param {string} contact.Email - The contact's email address.
 * @param {string} contact.Phone - The contact's phone number.
 * @param {string} contact.Address - The contact's street address.
 * @param {string} contact.City - The contact's city.
 * @param {string} contact.State - The contact's state.
 * @param {string} contact.ZipCode - The contact's zip code.
 * @param {string} contact.Notes - The contact's notes.
 * @param {string} contact.ImageURL - The url of the contact's image.
 * @returns {string} An HTML string.
 */
function contactAddressSnippet(contact) {
  const template = `<div class="card address">
                      <h3 class="card-header">Address</h3>
                      <address>
                        <span id="contact-details-street-address">${contact.Address}</span><br>
                        <span id="contact-details-city">${contact.City}</span>, <span id="contact-details-state">${contact.State}</span> <span id="contact-details-zip">${contact.ZipCode}</span>
                      </address>
                    </div>`;

  return template;
}

/**
 * Create note snippet for the contact's address.
 * @param {string} notes - The contact's notes.
 * @returns {string} An HTML string.
 */
function contactNotesSnippet(notes) {
  const template = `<div class="card notes">
                      <h3 class="card-header">Notes</h3>
                      <p id="contact-details-notes">${notes}</p>
                    </div>`;
  
  return template;
}

/**
 * Checks if the contact has any portion of their address filled out.
 * @param {Object} contact - Contact details.
 * @param {string} contact.ID - The contact id.
 * @param {string} contact.Username - The user this contact is attached to.
 * @param {string} contact.FirstName - The contact's first name.
 * @param {string} contact.LastName - The contact's last name.
 * @param {string} contact.Email - The contact's email address.
 * @param {string} contact.Phone - The contact's phone number.
 * @param {string} contact.Address - The contact's street address.
 * @param {string} contact.City - The contact's city.
 * @param {string} contact.State - The contact's state.
 * @param {string} contact.ZipCode - The contact's zip code.
 * @param {string} contact.Notes - The contact's notes.
 * @param {string} contact.ImageURL - The url of the contact's image.
 * @returns {string} A boolean indicating whether address details exist for the contact.
 */
function hasAddress(contact) {
  return (
    !isEmpty(contact.Address) ||
    !isEmpty(contact.City) ||
    !isEmpty(contact.State) ||
    !isEmpty(contact.ZipCode)
  );
}

/**
 * Checks if the contact has a note.
 * @param {string} notes - The contact's notes.
 * @returns {string} A boolean indicating whether notes exist for the contact.
 */
function hasNotes(notes) {
  return !isEmpty(notes);
}

/**
 * Checks if the string is an empty string or null.
 * @param {string} str - A string.
 * @returns {string} A boolean indicating whether the string is empty or null.
 */
function isEmpty(str) {
  return str == '' || str === null;
}

/**
 * Pagination Links Helper. Calculate the number to start the pagination links at.
 * @param {integer} current - The current page the GET request is on.
 * @param {integer} pages - The total number of pages in the GET request.
 * @returns {integer} The number to start pagination links on.
 */
function getStartPageLinkRange(current, pages) {
  let start = Math.max(1, current - 2);

  if (pages <= MAX_PAGE_LINKS)
    start  = 1;
  else if (current + 2 > pages)
    start = current - (MAX_PAGE_LINKS - 1 - (pages - current));
  
  return start;
}

/**
 * Pagination Links Helper. Calculate the number to start the pagination links at.
 * @param {integer} start - Where the pagination links will start.
 * @param {integer} current - The current page the GET request is on.
 * @param {integer} pages - The total number of pages in the GET request.
 * @returns {integer} The number to end the pagination links on.
 */
function getEndPageLinkRange(start, current, pages) {
  let end = start + MAX_PAGE_LINKS - 1;

  if (pages <= MAX_PAGE_LINKS || current + 2 > pages)
    end = pages;

  return end;
}

/** 
 * Check if GET request is a get all or search request.
 * @param {string|null} prev - The previous GET request link.
 * @param {string|null} next - The next GET request link.
 * @returns {boolean} A boolean indicating whether or not the request is a search request.
 */
function isSearchRequest(prev, next) {
  return (
    (prev || '').search('/api/contact/searchContact.php') != -1 ||
    (next || '').search('/api/contact/searchContact.php') != -1
  );
}

/** 
 * Parse the search query from the prev or next link.
 * @param {string|null} prev - The previous GET request link.
 * @param {string|null} next - The next GET request link.
 * @returns {string} The search query.
 */
function getSearchQuery(prev, next) {
  const regex = /.+&Name=([^&]*)/;
  let query = '';

  if (prev) query = prev.match(regex)[1];
  if (next) query = next.match(regex)[1];

  return query;
}

function pageLinkTemplate(username, current, page) {
  return `<li class="page-item ${current == page ? 'active' : ''}">
            <a class="page-link" href="/api/contact/loadContacts.php?Username=${username}&Page=${page}">${page}</a>
          </li>`;
}

function searchPageLinkTemplate(username, current, page, query) {
  return `<li class="page-item ${current == page ? 'active' : ''}">
            <a class="page-link" href="/api/contact/searchContact.php?Username=${username}&Name=${query}&Page=${page}">${page}</a>
          </li>`;
}