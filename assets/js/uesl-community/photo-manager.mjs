import { button, eventLink, isEventId, node, request, timestamp, upload } from './event-api.mjs';
import { mountPhotoViewer, photoFigure } from './photo-gallery.mjs';

const $ = id => document.getElementById(id);
const select = $('managed-event');
const status = $('manager-status');
const access = $('manager-access');
const albumStatus = $('managed-album-status');
const gallery = $('managed-album');
const uploadForm = $('upload-photo');
const createForm = $('create-event');
const progress = $('upload-progress');
const uploadStatus = $('upload-status');
let events = [];
let album = null;
let busy = false;
let generation = 0;
mountPhotoViewer(gallery, $('photo-viewer'));

function setBusy(value) {
  busy = value;
  $('manager').querySelectorAll('button, input, select, textarea').forEach(control => {
    control.disabled = value || control.dataset.unavailable === 'true';
  });
}

async function initialise(preferred) {
  $('manager-retry').hidden = true;
  $('manager-login').hidden = true;
  access.textContent = 'Checking staff access…';
  try {
    const all = [];
    let page;
    do {
      page = await request(`/manage?limit=100&offset=${all.length}`);
      all.push(...page);
    } while (page.length === 100);
    events = all;
    select.replaceChildren(new Option('Choose an event', ''));
    for (const event of events) {
      select.add(new Option(`${event.title} — ${timestamp(event.starts_at_utc, event.timezone)} (${event.state})`, event.id));
    }
    select.value = events.some(event => String(event.id) === String(preferred)) ? String(preferred) : '';
    $('manager').hidden = false;
    access.textContent = events.length ? '' : 'No events yet. Create a draft to begin.';
    await loadAlbum();
  } catch (error) {
    $('manager').hidden = true;
    $('manager-login').hidden = error.status !== 401;
    $('manager-retry').hidden = [401, 403].includes(error.status);
    access.textContent = error.status === 401 ? 'Sign in to manage event photos.' :
      error.status === 403 ? 'Only UESL staff can manage event photos.' : 'Could not verify staff access. Try again.';
  }
}

async function loadAlbum() {
  const current = ++generation;
  const id = select.value;
  const event = events.find(item => String(item.id) === id);
  album = null;
  $('manage-album').hidden = !event;
  $('view-managed-event').hidden = !event || event.state === 'draft';
  $('publish-managed-event').hidden = event?.state !== 'draft';
  gallery.replaceChildren();
  if (!event) return;
  $('view-managed-event').href = `${eventLink(id)}#event-photos`;
  albumStatus.textContent = 'Loading photos…';
  try {
    const result = await request(`/${id}/photos/manage`);
    if (generation !== current) return;
    album = result;
    renderAlbum();
  } catch (error) {
    if (generation !== current) return;
    albumStatus.textContent = error.message || 'Could not load the gallery.';
    gallery.append(button('Retry photos', loadAlbum));
  }
}

function renderAlbum() {
  gallery.replaceChildren();
  albumStatus.textContent = album.photos.length ? `${album.photos.length} photos.` : 'No photos for this event yet.';
  album.photos.forEach((photo, index) => {
    const cover = album.cover_id === photo.id;
    const container = node('div', '', 'ocs__stack');
    const actions = node('div', '', 'ocs__links');
    const coverButton = button(cover ? 'Clear cover' : 'Set as cover', () => arrange(photo.id, 'cover'), 'ocs__btn accent');
    const earlier = button('Move earlier', () => arrange(photo.id, -1));
    const later = button('Move later', () => arrange(photo.id, 1));
    earlier.dataset.unavailable = String(index === 0);
    later.dataset.unavailable = String(index === album.photos.length - 1);
    const remove = button('Remove photo', () => deletePhoto(photo), 'ocs__btn alert-red');
    for (const [action, control] of Object.entries({ cover: coverButton, earlier, later, remove })) {
      control.dataset.action = action;
      control.setAttribute('aria-label', `${control.textContent}: ${photo.caption}`);
    }
    actions.append(coverButton, earlier, later, remove);
    container.dataset.photoId = photo.id;
    container.append(node('p', `${index + 1}. ${cover ? 'Cover photo' : 'Gallery photo'}`, 'ocs__badge'),
      photoFigure(photo), node('p', `Permission: ${photo.permission}`, 'ocs__caption'), actions);
    gallery.append(container);
  });
  setBusy(busy);
}

async function arrange(photoId, action) {
  if (busy || !album) return;
  const order = album.photos.map(photo => photo.id);
  const i = order.indexOf(photoId);
  const cover = action === 'cover' ? (album.cover_id === photoId ? null : photoId) : album.cover_id;
  if (action !== 'cover') [order[i], order[i + action]] = [order[i + action], order[i]];
  setBusy(true);
  status.textContent = 'Saving gallery…';
  const focusAction = action === 'cover' ? 'cover' : action === -1 ? 'earlier' : 'later';
  try {
    await request(`/${select.value}/photos`, 'PUT', { order, cover_id: cover });
    status.textContent = action === 'cover' ? 'Cover updated.' : 'Photo order saved.';
    await loadAlbum();
  } catch (error) {
    status.textContent = error.message;
    if (error.status === 409) await loadAlbum();
  } finally {
    setBusy(false);
    const photo = gallery.querySelector(`[data-photo-id="${photoId}"]`);
    const target = photo?.querySelector(`[data-action="${focusAction}"]`);
    (target && !target.disabled ? target : photo?.querySelector('[data-action="cover"]') || select).focus();
  }
}

async function deletePhoto(photo) {
  if (busy || !window.confirm(`Remove this photo from the event? “${photo.caption}”`)) return;
  setBusy(true);
  status.textContent = 'Removing photo…';
  try {
    await request(`/${select.value}/photos/${photo.id}`, 'DELETE');
    status.textContent = 'Photo removed.';
    await loadAlbum();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    setBusy(false);
    select.focus();
  }
}

select.addEventListener('change', () => {
  uploadForm.reset();
  uploadStatus.textContent = '';
  status.textContent = '';
  loadAlbum();
});
$('manager-retry').addEventListener('click', () => initialise(select.value));
$('publish-managed-event').addEventListener('click', async () => {
  if (busy || !window.confirm('Publish this confirmed event and its approved photos?')) return;
  const id = select.value;
  setBusy(true);
  try {
    await request(`/${id}/state`, 'PUT', { state: 'published' });
    status.textContent = 'Event published.';
    await initialise(id);
  } catch (error) {
    status.textContent = error.message;
  } finally {
    setBusy(false);
    select.focus();
  }
});

createForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const data = Object.fromEntries(new FormData(createForm));
  setBusy(true);
  status.textContent = 'Saving draft…';
  try {
    for (const key of ['starts_at', 'ends_at']) data[key] = new Date(data[key]).toISOString();
    const result = await request('', 'POST', data);
    createForm.reset();
    createForm.closest('details').open = false;
    status.textContent = 'Draft saved. Add approved photos before publishing.';
    await initialise(result.id);
  } catch (error) {
    status.textContent = error.message;
  } finally {
    setBusy(false);
    if (!createForm.closest('details').open) select.focus();
  }
});

uploadForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = select.value;
  if (busy || !isEventId(id)) return;
  const data = new FormData(uploadForm);
  if (data.get('image').size > 4 * 1024 * 1024) {
    uploadStatus.textContent = 'Choose an image no larger than 4 MB.';
    return;
  }
  setBusy(true);
  progress.removeAttribute('value');
  progress.hidden = false;
  uploadStatus.textContent = 'Uploading…';
  try {
    await upload(id, data, fraction => {
      if (fraction !== null) progress.value = fraction;
      uploadStatus.textContent = fraction === 1 ? 'Upload sent. Waiting for the server to confirm…' :
        fraction === null ? 'Uploading…' : `Uploading… ${Math.floor(fraction * 100)}%`;
    });
    uploadForm.reset();
    uploadStatus.textContent = 'Photo saved.';
    await loadAlbum();
  } catch (error) {
    uploadStatus.textContent = error.message;
  } finally {
    progress.hidden = true;
    setBusy(false);
  }
});

initialise(new URLSearchParams(location.search).get('event'));
