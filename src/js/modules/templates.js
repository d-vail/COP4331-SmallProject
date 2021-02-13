/**
 * @file The template functions are responsible for generating reusable HTML snippets. These are called
 * by view renders and event listeners.
 */

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
                    <button class="btn btn-primary">Add Contact</button>`;

  wrapper.className = 'empty-state d-flex flex-column align-items-center';
  wrapper.innerHTML = template;

  return wrapper;
}

/**
 * Creates a contact preview link node. 
 * @param {Object} contact - Contact details.
 * @param {string} contact.ID - The contact id.
 * @param {string} contact.FirstName - The contact's first name.
 * @param {string} contact.LastName - The contact's last name.
 * @param {string} contact.ImageURL - The url of the contact's image.
 * @param {string} active - The id of the selected/highlighted contact.
 * @returns {Node} A DOM node.
 */
export function contactListItemNode(contact, active) {
  const name = `${contact.FirstName} ${contact.LastName}`;
  const image = `${contact.ImageURL ? contact.ImageURL : 'images/blank-profile-image.png'}`;
  const active = contact.ID === active ? 'active' : '';
  const wrapper = document.createElement('a');
  const template = `<div class="d-flex flex-row align-items-center">
                        <img src="${image}" class="rounded-circle" alt="${name} Preview">
                        <h4 class="ms-3">${name}</h4>
                    </div>`;
  
  wrapper.className = `list-group-item list-group-item-action contact my-1 ${active}`;
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
                      <div class="name">
                        <img src="${image}" class="rounded-circle" alt="${name} Preview">
                        <h2 class="primary-header mx-4 my-3">${name}</h2>
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
                        <a class="d-block" href="mailto:${contact.Email}">
                          <span class="icon me-2"><i class="fas fa-envelope"></i></span>
                          ${contact.Email}
                        </a>
                        <a class="d-block" href="tel:${contact.Phone}">
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
                        ${contact.Address}<br>
                        ${contact.City}, ${contact.State} ${contact.ZipCode}
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
                      <h3 class="card-header">${notes}</h3>
                      <p></p>
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
    !isEmptyString(contact.Address) ||
    !isEmptyString(contact.City) ||
    !isEmptyString(contact.State) ||
    !isEmptyString(contact.ZipCode)
  );
}

/**
 * Checks if the contact has a note.
 * @param {string} notes - The contact's notes.
 * @returns {string} A boolean indicating whether notes exist for the contact.
 */
function hasNotes(notes) {
  return !isEmptyString(notes);
}

/**
 * Checks if the string is an empty string.
 * @param {string} str - A string.
 * @returns {string} A boolean indicating whether the string is empty.
 */
function isEmptyString(str) {
  return str == '';
}