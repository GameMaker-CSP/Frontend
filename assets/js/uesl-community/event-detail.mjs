import { isEventId, node, request, timestamp } from './event-api.mjs';
import { mountPhotoViewer, photoFigure } from './photo-gallery.mjs';
import { mountDiscussion } from './event-discussion.mjs';

const $ = id => document.getElementById(id);
const eventId = new URLSearchParams(location.search).get('event');
const root = $('event-photos');
mountPhotoViewer(root, $('photo-viewer'));

async function loadAlbum() {
  $('album-status').textContent = 'Loading photos…';
  $('album-retry').hidden = true;
  try {
    const { cover_id, photos } = await request(`/${eventId}/photos`);
    $('event-album').replaceChildren();
    $('event-cover').replaceChildren();
    $('event-cover').hidden = true;
    for (const photo of photos) {
      const figure = photoFigure(photo);
      if (photo.id === cover_id) {
        const featured = node('div', '', 'ocs__stack ocs__grid-cell');
        featured.append(node('h3', 'Featured photo'), figure);
        $('event-cover').append(featured);
        $('event-cover').hidden = false;
      } else {
        $('event-album').append(figure);
      }
    }
    $('album-status').textContent = photos.length ? `${photos.length} ${photos.length === 1 ? 'photo' : 'photos'} from this event.` : 'No approved photos have been published for this event yet.';
  } catch {
    $('album-status').textContent = 'Could not load photos for this event.';
    $('album-retry').hidden = false;
  }
}

async function loadEvent() {
  $('event-retry').hidden = true;
  $('event-load').textContent = 'Loading event…';
  if (!isEventId(eventId)) {
    $('event-load').textContent = 'Choose an event from the events list.';
    return;
  }
  try {
    const event = await request(`/${eventId}`);
    $('event-title').textContent = event.title;
    document.title = `${event.title} — Unified Esports League`;
    $('event-time').replaceChildren(...['starts_at_utc', 'ends_at_utc'].flatMap((key, index) => {
      const time = node('time', timestamp(event[key], event.timezone));
      time.dateTime = event[key];
      return [index ? ' – ' : '', time];
    }));
    $('event-place').textContent = event.location;
    $('event-description').textContent = event.description;
    $('event-cancelled').hidden = event.state !== 'cancelled';
    $('event-inquire').hidden = event.state === 'cancelled';
    $('event-load').textContent = '';
    $('event-info').hidden = false;
    $('event-content').hidden = false;
    if (location.hash === '#event-photos' || location.hash === '#discussion') {
      document.getElementById(location.hash.slice(1)).scrollIntoView();
    }
    loadAlbum();
    mountDiscussion(eventId);
  } catch (error) {
    $('event-load').textContent = error.status === 404 ? 'This event was not found or is not public.' : 'Could not load this event.';
    $('event-retry').hidden = error.status === 404;
  }
}

$('event-retry').addEventListener('click', loadEvent);
$('album-retry').addEventListener('click', loadAlbum);
loadEvent();
