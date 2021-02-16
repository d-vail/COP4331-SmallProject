/**
 * @file The view functions are responsible for assembling larger components out of templates and
 * action/event handlers. They clean up old state and display the new state.
 */

import {
  alertNode,
  emptyStateNode,
  contactListWrapperNode,
  contactListItemNode,
  contactDetailsNode,
  paginationLinksNode,
} from './templates.js';
import { getContact, getContacts } from './getters.js';
import { setupAddModal, setupEditModal, deleteContact } from './setters.js';
import { get } from './httprequests.js';

/**
 * Displays an error alert in the signup/signin form with the given message.
 * @param {string} message - The message to include in the alert.
 */
export function renderAuthorizationError(formSelector, message) {
  const form = document.querySelector(formSelector); 
  const alerts = form.querySelectorAll('.alert');

  // Remove any stale alerts.
  for (let i = 0; i < alerts.length; i++)
    form.removeChild(alerts[i]);

  // Display the new alert.
  form.appendChild(alertNode(message));
}

/**
 * Displays an empty state and attaches event listeners.
 */
export function renderEmptyState() {
  const main = document.querySelector('main');
  const emptyState = emptyStateNode('It looks like you don’t have any contacts yet.');
  const createContactBtn = emptyState.querySelector('.btn-primary');

  // Remove any stale list and detail containers.
  main.innerHTML = null;

  // Attach event listener to add contact button.
  createContactBtn.addEventListener('click', setupAddModal);

  // Display the empty state view.
  main.className = 'flex-grow-1 flex-shrink-1';
  main.appendChild(emptyState);
}

/**
 * Display the complete app state.
 * @param {Object} data - The response data.
 * @param {integer} data.count - The total number of contacts for this user.
 * @param {integer} data.pages - The total number of pages.
 * @param {integer} data.current - The current page number.
 * @param {string|null} data.next - A link to the next page or null if one does not exist.
 * @param {string|null} data.prev - A link to the prev page or null if one does not exist.
 * @param {array} data.results - An array of contacts.
 */
export function renderApp(data, handleMobileView = false) {
  const main = document.querySelector('main');
  const contacts = data.results;

  // Remove any stale list and detail containers.
  main.innerHTML = null;

  // Display app state view.
  main.className = 'flex-grow-1 flex-shrink-1 d-flex flex-row';
  renderContactList(contacts);
  renderPagination(data);
  renderContactDetails(contacts[0], handleMobileView);
  scrollToTop();
}

/**
 * Displays the contact list and pagination controls and attaches event listener to add contact
 * button.
 * @param {array} contacts - An array of contacts.
 */
export function renderContactList(contacts) {
  const main = document.querySelector('main');
  const contactListWrapper = contactListWrapperNode();
  const contactList = contactListWrapper.querySelector('.list-group');
  const createContactBtn = contactListWrapper.querySelector('.add-contact-btn');

  // For each contact, add a contact list item node to the contact list.
  for (let i = 0; i < contacts.length; i++) {
    const contactListItem = contactListItemNode(contacts[i]);
    contactList.appendChild(contactListItem);
    contactListItem.addEventListener('click', getContact);
  }

  // Attach event listeners.
  createContactBtn.addEventListener('click', setupAddModal);

  // Display view.
  main.appendChild(contactListWrapper);
}

export function renderPagination(data) {
  const paginationControls = document.querySelector('.pagination');
  const prevPageItem = paginationControls.querySelector('.prev');
  const nextPageItem = paginationControls.querySelector('.next');
  const numberedPageLinks = paginationControls.querySelector('.numbered-page-links');
  const username = data.results[0].Username;

  // Enable/Disable prev and next links.
  if (data.prev) {
    prevPageItem.classList.remove('disabled');
    prevPageItem.querySelector('a').href = data.prev;
  } else {
    prevPageItem.classList.add('disabled');
    prevPageItem.querySelector('a').href = '#';
  }

  if (data.next) {
    nextPageItem.classList.remove('disabled');
    nextPageItem.querySelector('a').href = data.next;
  } else {
    nextPageItem.classList.add('disabled');
    nextPageItem.querySelector('a').href = '#';
  }

  // Get page links.
  numberedPageLinks.innerHTML = paginationLinksNode(
    username,
    parseInt(data.current),
    parseInt(data.pages),
    data.prev,
    data.next);

  // Attach event listeners to page links.
  const pageLinks = paginationControls.querySelectorAll('.page-link');

  for (let i = 0; i < pageLinks.length; i++)
    pageLinks[i].addEventListener('click', getContacts);
}

// Need finer controls to target just the list  items or just the pagination links

/**
 * Display the contact details for the given contact and attach event listeners to edit and delete
 * buttons.
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
 */
export function renderContactDetails(contact, handleMobileView = false) {
  const main = document.querySelector('main');
  const staleContactDetails = document.querySelector('.contact-details');
  const contactDetails = contactDetailsNode(contact);
  const deleteButton = contactDetails.querySelector('.edit-actions .delete');
  const editButton = contactDetails.querySelector('.edit-actions #editContact');
  const mobileClose = contactDetails.querySelector('.contact-details .mobile-close');

  // Remove any stale contact detail containers.
  if (staleContactDetails != null)
    staleContactDetails.parentNode.removeChild(staleContactDetails);
  
  // Attach event listeners: edit and delete
  deleteButton.dataset.id = contact.ID;
  deleteButton.addEventListener('click', deleteContact);

  editButton.dataset.id = contact.ID;
  editButton.addEventListener('click', setupEditModal);

  // If on mobile, display as an overlay.
  if (!handleMobileView && window.innerWidth < 992)
    contactDetails.classList.add('d-block');
  
  mobileClose.addEventListener('click', () => {
    const contactDetails = document.querySelector('.contact-details');
    contactDetails.classList.remove('d-block');
  });

  // Display contact details and mark contact as active in contact list.
  main.appendChild(contactDetails);
  selectContact(contact.ID)
}

// =================
// Internal Helpers
// =================

/**
 * Mark the matching contact id as active in contact list.
 * @param {string} contactId The contact id.
 */
function selectContact(contactId) {
  const contacts = document.querySelectorAll('.contact-list .list-group-item');

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].dataset.id == contactId)
      contacts[i].classList.add('active');
    else
      contacts[i].classList.remove('active');
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}