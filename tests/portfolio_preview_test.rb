# Run with BUNDLE_GEMFILE=Gemfile.local bundle exec ruby tests/portfolio_preview_test.rb
require "jekyll"
require "tmpdir"

ROOT = File.expand_path("..", __dir__)

def site(destination, preview: false)
  configs = %w[_config.yml _config.local.yml]
  configs << "_config.portfolio-preview.yml" if preview
  Jekyll::Site.new(Jekyll.configuration(
    "source" => ROOT, "destination" => destination, "baseurl" => "/preview",
    "config" => configs.map { |name| File.join(ROOT, name) }, "quiet" => true
  ))
end

def outputs(site)
  (site.pages + site.documents + site.static_files).to_h do |entry|
    [entry.destination(site.dest).delete_prefix("#{site.dest}/"), entry.path]
  end
end

Dir.mktmpdir("uesl-portfolio") do |tmp|
  normal = site(File.join(tmp, "normal"))
  normal.read
  normal.generate
  normal_outputs = outputs(normal)
  abort "Preview leaked into the normal build" if normal_outputs.key?("portfolio-systems/index.html")

  preview = site(File.join(tmp, "preview"), preview: true)
  preview.process
  abort "Existing output changed owners" unless outputs(preview).slice(*normal_outputs.keys) == normal_outputs
  {
    "portfolio-systems/index.html" => "/preview/student/calendar",
    "student/calendar.html" => "/preview/assets/js/portfolio-preview/config.js",
    "dm.html" => "/preview/assets/js/projects/messages/shared/rich-text.js",
    "topics/index.html" => "/preview/assets/js/projects/topics/data.json",
    "portfolio-systems/blogs/index.html" => "data-blog-reader",
    "scraper/index.html" => '/preview/assets/js/projects/scraper/scraper.js',
    "assets/js/portfolio-preview/config.js" => "http://127.0.0.1:8585",
    "assets/js/projects/topics/data.json" => '"viewUrl"',
    "assets/css/portfolio-preview/calendar.css" => ".calendar-dashboard-tabs"
  }.each do |file, marker|
    abort "Preview output #{file} is missing #{marker}" unless File.read(File.join(preview.dest, file)).include?(marker)
  end

  collision = site(File.join(tmp, "collision"), preview: true)
  collision.read
  old_page = Jekyll::PageWithoutAFile.new(collision, ROOT, "dm", "index.html")
  collision.pages << old_page
  begin
    collision.generate
    abort "Publisher accepted an existing /dm/ route"
  rescue Jekyll::Errors::FatalException => error
    raise unless error.message.include?("existing output: /dm")
  end
end

puts "Portfolio preview stays opt-in, preserves existing outputs, and rejects route collisions."
