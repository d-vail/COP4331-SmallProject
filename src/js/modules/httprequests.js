/**
 * Make an HTTP GET request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function get(url) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Make an authorized HTTP GET request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function getAuth(url, token) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

/**
 * Make an HTTP POST request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @param {Object} data - The data to be sent.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function post(url, data) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make an authorized HTTP POST request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @param {Object} data - The data to be sent.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function postAuth(url, token, data) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make an HTTP PUT request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @param {Object} data - The data to be sent.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function put(url, data) {
  return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make an authorized HTTP PUT request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @param {Object} data - The data to be sent.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function putAuth(url, token, data) {
  return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make an HTTP DELETE request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function del(url) {
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Make an authorized HTTP DELETE request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @returns {Promise} A Promise that resolves to a Response object.
 */
export async function delAuth(url, token) {
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}