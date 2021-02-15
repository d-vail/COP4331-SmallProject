/**
 * @file Event handlers responsible for modifying app data. Includes creating contacts, editing
 * contacts, deleting contacts.
 */

import { API_BASE, APP_BASE } from './config.js';
import { postAuth, putAuth, delAuth } from './httprequests.js';
import { getCookie, deleteCookie } from './cookies.js';
import { loadAppState, getContacts } from './getters.js';
import { renderAuthorizationError, renderContactDetails } from './views.js'

/**
 * Setup add modal elements, inputs and event listeners and then display.
 */
export function setupAddModal() {
  const modalHeader = document.querySelector('#createEditContactModalLabel');
  const modalPrimaryBtn = document.querySelector('.modal-footer .btn-primary');
  const modalImageBtn = document.querySelector('#contact-photo');

  // Update modal elements to indicate this action will create a new contact.
  modalHeader.innerHTML = 'Create Contact';
  modalPrimaryBtn.innerHTML = 'Create';

  // Ensure all inputs are clear.
  clearModalInputs();

  // Reset event listeners for create action.
  modalPrimaryBtn.removeEventListener('click', editContact);
  modalPrimaryBtn.removeEventListener('click', createContact);
  modalPrimaryBtn.addEventListener('click', createContact);
  modalImageBtn.addEventListener('change', uploadImage);
}

/**
 * Setup edit modal elements, inputs and event listeners and then display.
 */
export function setupEditModal() {
  const modalHeader = document.querySelector('#createEditContactModalLabel');
  const modalPrimaryBtn = document.querySelector('.modal-footer .btn-primary');
  const modalImageBtn = document.querySelector('#contact-photo');

  // Update modal elements to indicate this action will edit an existing contact.
  modalHeader.innerHTML = 'Edit Contact';
  modalPrimaryBtn.innerHTML = 'Save';

  // Populate modal.
  populateModalInputs();

  // Reset event listeners for create action.
  modalPrimaryBtn.removeEventListener('click', editContact);
  modalPrimaryBtn.removeEventListener('click', createContact);
  modalPrimaryBtn.addEventListener('click', editContact);
  modalImageBtn.addEventListener('change', uploadImage);
}

/**
 * Make a DELETE request on a single contact.
 */
export function deleteContact() {
  const token = getCookie('jwt');
  const username = getCookie('username');
  const contactId = this.dataset.id;

  delAuth(`${API_BASE}/contact/deleteContact.php?Username=${username}&ContactID=${contactId}`, token)
     .then(async (resp) => {
       handleDeleteContactResponse({
         ok: resp.ok,
         status: resp.status,
       });
     })
     .catch((err) => {
       console.log(err);
       console.log('TODO: Display 500 error contact details state -- base off empty state');
     });
}

// =================
// Internal Helpers
// =================

/**
 * Make a POST request to create a new contact.
 */
function createContact() {
  const token = getCookie('jwt');
  const newContact = getFormData();

  newContact.Username = getCookie('username');
  postAuth(`${API_BASE}/contact/createContact.php`, token, newContact)
    .then(async (resp) => {
      handleCreateRequest({
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
 * Make a PUT request to edit an existing contact.
 */
function editContact() {
  const token = getCookie('jwt');
  const updatedContact = getFormData();

  updatedContact.Username = getCookie('username');
  updatedContact.ID = document.querySelector('.contact-details').dataset.id;
  putAuth(`${API_BASE}/contact/updateContact.php`, token, updatedContact)
    .then(async (resp) => {
      handleEditRequest({
        ok: resp.ok,
        status: resp.status,
        body: await resp.json(),
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        'TODO: Display 500 error contact details state -- base off empty state'
      );
    });
}

/**
 * Make a POST request to upload an image of the contact.
 */
function uploadImage() {
  const reader = new FileReader();
  let fileName;

  reader.onload = (img) => {
    const token = getCookie('jwt');
    const image = {
      Username: getCookie('username'),
      Filename: fileName,
      URL: img.target.result,
    };

    postAuth(`${API_BASE}/image/uploadImage.php`, token, image)
      .then(async (resp) => {
        handleImageUpload({
          ok: resp.ok,
          status: resp.status,
          body: await resp.json(),
        });
      })
      .catch((err) => {
        renderAuthorizationError(
          '#createEditContactModal form',
          'Could not upload image. Please try again.'
        );
      });
  };

  // Don't do anything if a file was not selected.
  if (this.files.length > 0) {
    fileName = this.files[0].name;
    reader.readAsDataURL(this.files[0]);
  };
}

/**
 * Maps actions to response from create request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 */
function handleCreateRequest(response) {
  // If action is not authorized, redirect to sign in page.
  if (response.status == 401) {
    deleteCookie('jwt');
    window.location.replace(APP_BASE);
  }

  // If user has contacts, preserve page they are viewing after creating the contact.
  const currentPage = document.querySelector('.page-item.active .page-link')
    ? document.querySelector('.page-item.active .page-link').innerHTML
    : 1;

  if (response.ok) {
    clearModalInputs();
    loadAppState(
      `${API_BASE}/contact/loadContacts.php?Username=${response.body.Username}&Page=${currentPage}`
    );
    closeModal();
  } else {
    renderAuthorizationError(
      '#createEditContactModal form',
      response.body.Error
    );
  }
}

/**
 * Maps actions to response from create request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 * 
 * @todo fix - update selected contact name in contact list after edit.
 */
function handleEditRequest(response) {
  // If action is not authorized, redirect to sign in page.
  if (response.status == 401) {
    deleteCookie('jwt');
    window.location.replace(APP_BASE);
  }

  if (response.ok) {
    clearModalInputs();
    renderContactDetails(response.body);
    closeModal();
  } else {
    renderAuthorizationError(
      '#createEditContactModal form',
      response.body.Error
    );
  }
}

/**
 * Maps actions to response from image upload request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @param {string} response.body - The body text of the response as JSON.
 * @todo handle errors
 */
function handleImageUpload(response) {
  const contactPhoto = document.querySelector('#contact-photo');
  const contactPhotoPreview = document.querySelector('#createEditContactModal .upload .preview');

  // Save Space URL for later retrieval.
  contactPhoto.dataset.url = response.body.SpacesURL;

  // Display image in modal form.
  contactPhotoPreview.style = `background-image: url(${response.body.SpacesURL})`;
}

/**
 * Maps actions to response from delete request.
 * @param {Object} response - Response object.
 * @param {boolean} response.ok - A boolean indicating whether the response was successful.
 * @param {unsigned short} response.status - The status code of the response.
 * @todo Handle additional errors returned: 404, 500
 */
function handleDeleteContactResponse(response) {
  // If action is not authorized, redirect to sign in page.
  if (response.status == 401) {
    deleteCookie('jwt');
    window.location.replace(APP_BASE);
  }

  // If contact was successfully deleted, reload app state.
  if (response.status ==  204) {
    loadAppState();
  }
}

/**
 * Clear all form inputs and alerts in the edit/add modal.
 */
function clearModalInputs() {
  const contactPhotoPreview = document.querySelector('#createEditContactModal .upload .preview');
  const modalInputs = document.querySelectorAll('#createEditContactModal input');
  const modalSelects = document.querySelectorAll('#createEditContactModal select option');
  const modalTextAreas = document.querySelectorAll('#createEditContactModal textarea');
  const alerts = document.querySelectorAll('#createEditContactModal .alert');

  for (let i = 0; i < modalInputs.length; i++) modalInputs[i].value = '';
  for (let i = 0; i < modalSelects.length; i++) modalSelects[i].selected = false;
  for (let i = 0; i < modalTextAreas.length; i++) modalTextAreas[i].value = '';
  for (let i = 0; i < alerts.length; i++) alerts[i].parentNode.removeChild(alerts[i]);

  contactPhotoPreview.style = 'background-image: url(images/blank-profile-image.png)';
}

/**
 * Populate edit/add modal with contact details.
 */
function populateModalInputs() {
  const contactPhotoPreview = document.querySelector('#createEditContactModal .upload .preview');
  const contactPhoto = document.querySelector('#contact-photo');
  const contactPhotURL = document.querySelector('.contact-details-header img').src;
  const state = getInnerText('#contact-details-state');

  contactPhotoPreview.style = `background-image: url(${contactPhotURL});`;
  contactPhoto.dataset.url = contactPhotURL;

  document.querySelector('#contact-first-name').value = getData(
    '#contact-details-name',
    'firstname'
  );

  document.querySelector('#contact-last-name').value = getData(
    '#contact-details-name',
    'lastname'
  );

  document.querySelector('#contact-email').value = getInnerText(
    '#contact-details-email'
  );

  document.querySelector('#contact-phone').value = getInnerText(
    '#contact-details-phone'
  );

  document.querySelector('#contact-street-address').value = getInnerText(
    '#contact-details-street-address'
  );

  document.querySelector('#contact-city').value = getInnerText(
    '#contact-details-city'
  );

  document.querySelector('#contact-zip').value = getInnerText(
    '#contact-details-zip'
  );

  document.querySelector('#contact-notes').value = getInnerText(
    '#contact-details-notes'
  );

  document.querySelector('#contact-state').value = state === null ? 'State' : state;
}

/**
 * Close edit/add modal.
 */
function closeModal() {
  bootstrap.Modal.getInstance(
    document.querySelector('#createEditContactModal')
  ).hide();
}

/**
 * Pull contact data from create form.
 * @returns {Object} A contact object.
 */
function getFormData() {
  const state = document.querySelector('#contact-state').value;
  const contactPhotoURL = document.querySelector('#contact-photo').dataset.url;
  const contact = {
    FirstName: getValue('#contact-first-name'),
    LastName: getValue('#contact-last-name'),
    Email: getValue('#contact-email'),
    Phone: getValue('#contact-phone'),
    Address: getValue('#contact-street-address'),
    City: getValue('#contact-city'),
    State: state === 'State' ? null : state,
    ZipCode: getValue('#contact-zip'),
    Notes: getValue('#contact-notes'),
    ImageURL: contactPhotoURL,
  };

  return contact;
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

function getInnerText(selector) {
  const element = document.querySelector(selector);
  return element ? element.innerText : null;

}

function getData(selector, data) {
  const element = document.querySelector(selector);
  const dataValue = element.dataset[data];
  return dataValue === undefined ? null : dataValue;
}
