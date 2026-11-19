import { node, photoURL } from './event-api.mjs';

export function photoFigure(photo) {
  return photoPreview(photo, true);
}

export function photoPreview(photo, enlarge = false) {
  const figure = node('figure', '', enlarge ? 'ocs__card ocs__stack ocs__grid-cell' : 'ocs__stack ocs__grid-cell');
  const image = node('img', '', 'ocs__image-frame ocs__module-image');
  image.alt = photo.alt;
  image.width = photo.width;
  image.height = photo.height;
  image.loading = 'lazy';
  image.decoding = 'async';
  const thumbnail = photoURL(photo.thumbnail);
  const full = photoURL(photo.image);
  let media = image;
  if (enlarge && full) {
    const link = node('a', '', 'ocs__grid-cell');
    link.href = full;
    link.dataset.photoOpen = '';
    link.setAttribute('aria-label', `Enlarge photo: ${photo.alt}`);
    link.append(image);
    media = link;
  }
  const caption = node('figcaption', '', 'ocs__stack');
  caption.append(node('strong', photo.caption), node('span', `Photo: ${photo.credit}`, 'ocs__caption'));
  const failure = node('p', 'Photo unavailable.', 'ocs__callout');
  failure.dataset.photoFailed = '';
  failure.hidden = Boolean(thumbnail);
  media.hidden = !thumbnail;
  image.addEventListener('error', () => {
    media.hidden = true;
    failure.hidden = false;
  });
  if (thumbnail) image.src = thumbnail;
  figure.append(media, failure, caption);
  return figure;
}

export function mountPhotoViewer(root, dialog) {
  const enlarged = dialog.querySelector('img');
  const caption = dialog.querySelector('[data-photo-caption]');
  const message = dialog.querySelector('[data-photo-failed]');
  let opener;
  function thumbnailError(image) {
    const figure = image.closest('figure');
    const failure = figure?.querySelector('[data-photo-failed]');
    if (!failure) return;
    image.closest('[data-photo-open]').hidden = true;
    failure.hidden = false;
  }
  root.addEventListener('error', event => {
    if (event.target.matches?.('[data-photo-open] img')) thumbnailError(event.target);
  }, true);
  for (const image of root.querySelectorAll('[data-photo-open] img')) {
    if (image.complete && !image.naturalWidth) thumbnailError(image);
  }
  root.addEventListener('click', event => {
    const link = event.target.closest('[data-photo-open]');
    if (!link || !dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    const thumb = link.querySelector('img');
    enlarged.hidden = false;
    message.hidden = true;
    enlarged.alt = thumb.alt;
    enlarged.src = link.href;
    caption.textContent = link.closest('figure').querySelector('figcaption strong').textContent;
    dialog.showModal();
  });
  enlarged.addEventListener('error', () => { enlarged.hidden = true; message.hidden = false; });
  dialog.addEventListener('close', () => {
    enlarged.removeAttribute('src');
    opener?.focus();
  });
}
