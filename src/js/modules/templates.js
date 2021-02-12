/**
 * Creates an alert DOM node with the given message.
 * @param {string} message - The message to include in the alert.
 * @returns {Node} A DOM node.
 */
export function alertTemplate(message) {
  const alert = document.createElement('div');

  alert.className = 'alert alert-danger mt-3';
  alert.innerHTML= message;

  return alert;
}