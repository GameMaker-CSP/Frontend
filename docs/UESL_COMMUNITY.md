# UESL community pages

The homepage leads with in-person gatherings and visits. Events, announcements,
community photos, locations, and contact options come before the optional
between-events Game Maker. The existing three builders remain at `/play/`.
All additions reuse the UESL shell and OCS components; no CSS or Sass was added.

## Routes and content

| Route | Purpose | Content source |
| --- | --- | --- |
| `/` | Community homepage and between-events activity | `pages/uesl-home.html` and the includes below |
| `/events/` | Gatherings, parties, venue inquiries, and tours | `_data/uesl_events.json`, `_includes/uesl-events.html` |
| `/announcements/` | Dated operating notices | `_data/uesl_announcements.json`, `_includes/uesl-announcements.html` |
| `/gallery/` | Existing UESL community photographs | `_data/uesl_gallery.json`, `_includes/uesl-gallery.html` |
| `/locations/` | Verified addresses and map links | `_data/uesl_locations.json` |
| `/contact/` | Official contact form, contacts, and email drafts | `pages/uesl-contact.html`, `assets/js/uesl-community/inquiry.mjs` |

Main site and app navigation share `_data/uesl_navigation.json` and
`_includes/uesl-community-links.html`. About, locations, announcements, and the
existing organization/donation links remain in the footer. The old newsletter
button that falsely claimed a successful subscription has been removed.

## Updating information

Sources checked November 12, 2026:

- [UESL homepage](https://www.unifiedesl.com/): gallery photographs, official
  contact form anchor, contact addresses, guides, tours, and operating notices.
- [UESL locations](https://www.unifiedesl.com/locations): seven listed addresses;
  link to the original directory for live hours and enrollment availability.

Photos remain hosted by UESL’s Squarespace CDN, with visible attribution and
descriptive alt text. No participant names or unverified event dates are added.
Remote photos and PDF guides require an internet connection.

There are no confirmed public event dates in the supplied material. The event
list intentionally starts empty and offers a real inquiry path. When the team
confirms an event, add a JSON object with these fields:

| Field | Value to supply |
| --- | --- |
| `title` | Organizer-approved title |
| `starts_at` | ISO timestamp with the Pacific UTC offset for that date |
| `ends_on` | Final local calendar date, `YYYY-MM-DD` |
| `when` | Readable date and time, explicitly including the timezone |
| `location` | Confirmed venue |
| `description` | Short practical attendance information |
| `url` | Verified HTTPS event-details or registration link |

Events are ordered by start time. Past entries are hidden using the Pacific
calendar date, including when a tab is revisited. All records survive rendering
so a build server in another timezone cannot permanently omit an ongoing event.
Announcements show their explicit year, dates, source, and verification date;
they are not presented as a live feed. Update or archive them as dates change.

## Contact behavior

`?topic=event`, `party`, `tour`, or `enrollment` preselects the reason for contact.
The form validates required fields and produces a preview plus an encoded
`mailto:` link. Party inquiries go to the published programs contact; other
inquiries go to client services. Editing a field invalidates the previous draft.
Visitors review/send through their own email app or use UESL’s official form.
No message is sent, no reservation is made, and no personal data is stored by
this frontend. The preview also supports selecting/copying text without an email
app. No backend API or email delivery service was added.

## Validation

Run from the Frontend folder with Homebrew Ruby on the path:

```sh
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
BUNDLE_GEMFILE=Gemfile.local bundle exec jekyll build --config _config.yml,_config.local.yml
bash scripts/test_frontend.sh
BUNDLE_GEMFILE=Gemfile.local bundle exec ruby tests/community_render_test.rb
```

The full frontend suite passes 109 tests. The additional real Liquid/Jekyll
render check covers the UTC/Pacific boundary, escaped event text, and populated
and empty schedules. Browser checks covered 1366px desktop, 920px navigation,
390px mobile pages/menu, required form fields, query preselection, encoded email
preview, and stale-draft invalidation. No messages were sent. Existing legacy
duplicate-output warnings remain in the build, outside these routes.

All requested community features and verification are complete locally. Public
event publication awaits real dates from UESL; production deployment remains
paused. Earlier builder, account, and deployment changes in the working tree
are separate from these focused community commits.
