import { baseurl, pythonURI, fetchOptions } from '../api/config.js';

export const eventLink = id => `${baseurl}/events/detail/?event=${encodeURIComponent(id)}`;
export const isEventId = value => /^[1-9]\d{0,9}$/.test(String(value));
export const timestamp = (date, timeZone = 'America/Los_Angeles') => new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  timeZoneName: 'short', timeZone
}).format(new Date(date));

export async function request(path, method = 'GET', body) {
  const response = await fetch(`${pythonURI}/api/events${path}`, {
    ...fetchOptions, method, body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store', signal: AbortSignal.timeout(12000)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw Object.assign(new Error(data?.message || `Request failed (${response.status}).`), { status: response.status });
  if (response.status !== 204 && data === null) throw new Error('The server returned an unreadable response.');
  return data;
}

export function photoURL(path) {
  if (!/^\/api\/events\/[1-9]\d*\/photos\/[1-9]\d*\/(?:manage\/)?(?:thumb|view)$/.test(path)) return null;
  return `${pythonURI}${path}`;
}

export function upload(eventId, data, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${pythonURI}/api/events/${eventId}/photos`);
    xhr.withCredentials = true;
    xhr.timeout = 90_000;
    xhr.responseType = 'json';
    xhr.upload.onprogress = event => onProgress(event.lengthComputable ? event.loaded / event.total : null);
    xhr.upload.onload = () => onProgress(1);
    xhr.onload = () => {
      if (xhr.status === 201 && xhr.response?.id) resolve(xhr.response);
      else reject(new Error(xhr.response?.message || `Upload not confirmed (${xhr.status}). Refresh the album before retrying.`));
    };
    xhr.onerror = xhr.ontimeout = () => reject(new Error('Upload not confirmed. Check the connection and refresh the album before retrying.'));
    xhr.send(data);
  });
}

export function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

export function button(text, action, className = 'ocs__btn') {
  const element = node('button', text, className);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}
