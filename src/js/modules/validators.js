
/**
 * Preliminary validation on user credentials. Checks that at least something was entered before
 * on form submission. 
 * @param {Object} data - Credential data.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's password.
 * @returns {boolean} If data passed client side validation.
 * 
 * @todo Display validation error message.
 */
export function isValidCredentials(data) {
  return data.email != '' && data.password != '';
}