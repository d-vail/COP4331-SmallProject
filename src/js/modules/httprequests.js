/**
 * Make an HTTP GET request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @returns {Object} Response as JSON
 */
export async function get(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

/**
 * Make an authorized HTTP GET request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @returns {Object} Response as JSON
 */
export async function getAuth(url, token) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}

/**
 * Make an HTTP POST request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @param {Object} data - The data to be sent.
 * @returns {Object} Response as JSON
 */
export async function post(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

/**
 * Make an authorized HTTP POST request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @param {Object} data - The data to be sent.
 * @returns {Object} Response as JSON
 */
export async function postAuth(url, token, data) {
  const response = await fetch(url, {
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

  return response.json();
}

/**
 * Make an HTTP PUT request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @param {Object} data - The data to be sent.
 * @returns {Object} Response as JSON
 */
export async function put(url, data) {
  const response = await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

/**
 * Make an authorized HTTP PUT request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @param {Object} data - The data to be sent.
 * @returns {Object} Response as JSON
 */
export async function putAuth(url, token, data) {
  const response = await fetch(url, {
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

  return response.json();
}

/**
 * Make an HTTP DELETE request to the given url.
 * @async
 * @param {string} url - The url to send request to.
 * @returns {Object} Response as JSON
 */
export async function del(url) {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

/**
 * Make an authorized HTTP DELETE request to the given url. Requires authorization token.
 * @async
 * @param {string} url - The url to send request to.
 * @param {string} token - Bearer token.
 * @returns {Object} Response as JSON
 */
export async function delAuth(url, token) {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}