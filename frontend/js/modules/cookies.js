/**
 * Create a cookie.
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 * @param {number} exp - Cookie expiration date in number of days.
 */
export function setCookie(name, value, exp) {
  const date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  const expiration = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expiration}; path=/`;
}

/**
 * Get a cookie.
 * @param {string} name - Cookie name.
 * @returns {(string|null)} The cookie value or null.
 */
export function getCookie(name) {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split('; ');
  const match = cookies.filter(cookie => cookie.indexOf(cookieName) === 0);
  return match.length ? match[0].substring(cookieName.length, match[0].length) : null;
}

/**
 * Delete a cookie.
 * @param {string} name - Cookie name.
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}