# Run with BUNDLE_GEMFILE=Gemfile.local bundle exec ruby tests/community_render_test.rb
require 'jekyll'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration(
  'config' => [File.join(root, '_config.yml'), File.join(root, '_config.local.yml')],
  'source' => root, 'baseurl' => '', 'quiet' => true
))
template = Liquid::Template.parse(File.read(File.join(root, '_includes/uesl-events.html')))
event = {
  'title' => 'Games & friends', 'starts_at' => '2026-11-12T17:00:00-08:00',
  'ends_on' => '2026-11-12', 'when' => 'November 12, 5 p.m. Pacific',
  'location' => 'Test venue', 'description' => '<Test description>', 'url' => 'https://example.com/event'
}

render = lambda do |events, time|
  template.render!({ 'site' => { 'time' => time, 'data' => { 'uesl_events' => events } } }, registers: { site: site })
end

# A UTC build has crossed midnight while the Pacific event is still happening.
html = render.call([event], Time.utc(2026, 11, 13, 1))
abort 'Build omitted the event before Pacific-time browser filtering could restore it' unless html.include?('data-event-end="2026-11-12"')
abort 'Event title must be escaped' unless html.include?('Games &amp; friends')
abort 'Event description must be escaped' unless html.include?('&lt;Test description&gt;')

upcoming = render.call([event], Time.utc(2026, 11, 11))
abort 'Upcoming event missing' unless upcoming.include?('Event details &amp; registration')
abort 'Empty state should be hidden when dates are present' unless upcoming.include?('class="ocs__callout ocs__hidden" data-events-empty')
empty = render.call([], Time.utc(2026, 11, 11))
abort 'Missing visible inquiry fallback' unless empty.include?('class="ocs__callout" data-events-empty')
puts 'Community template checks passed: timezone boundary, escaping, upcoming and empty states.'
