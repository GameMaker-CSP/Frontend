# frozen_string_literal: true

require "set"
require_relative "../_projects/systems/topics/plugins/topics"

# Publish a deliberately limited set of upstream pages, without running their
# Makefiles or copying project distributions over UESL's source tree.
module PortfolioSystems
  ROOT = "_projects/systems"
  PREVIEW = "#{ROOT}/_preview"
  PAGES = {
    "calendar/index.md" => "calendar",
    "messages/navigation/dm.md" => "messages",
    "topics/pages/topics.md" => "topics",
    "blogs/preview.md" => "blogs",
    "scraper/docs/index.md" => "scraper",
    "scraper/docs/getting-started.md" => "scraper",
    "scraper/docs/lesson-music.md" => "scraper",
    "scraper/docs/lesson-1-music.md" => "scraper",
    "scraper/docs/lesson-vacation.md" => "scraper",
    "scraper/docs/my-scrapes.md" => "scraper"
  }.freeze
  STYLES = {
    "calendar" => "calendar/sass/main",
    "messages" => "messages/sass/main",
    "topics" => "topics/sass/main",
    "blogs" => "blogs/sass/blogs"
  }.freeze

  class Asset < Jekyll::StaticFile
    def initialize(site, source, url)
      super(site, site.source, File.dirname(source), File.basename(source))
      @url = url
    end
  end

  class Publisher < Jekyll::Generator
    safe true
    priority :low # After the existing builder publisher, before the Topics index.

    def generate(site)
      return unless site.config["portfolio_systems_preview"] == true

      %w[blogs topics].each do |project|
        include_path = site.in_source_dir(ROOT, project, "_includes")
        site.includes_load_paths << include_path unless site.includes_load_paths.include?(include_path)
      end

      occupied = (site.pages + site.documents + site.static_files).flat_map { |entry| keys(site, entry) }.to_set
      add_page(site, occupied, "#{PREVIEW}/index.md", nil)
      PAGES.each { |source, project| add_page(site, occupied, "#{ROOT}/#{source}", project) }
      %w[calendar messages scraper topics].each do |project|
        directory = "#{ROOT}/#{project}/js"
        Dir.glob(site.in_source_dir(directory, "**/*.js")).sort.each do |file|
          relative = file.delete_prefix("#{site.in_source_dir(directory)}/")
          asset = Asset.new(site, "#{directory}/#{relative}", "/assets/js/projects/#{project}/#{relative}")
          register(site, occupied, site.static_files, asset)
        end
      end
      register(site, occupied, site.static_files, Asset.new(site,
        "#{ROOT}/blogs/js/post-search.js", "/assets/js/blogs/post-search.js"))
      add_page(site, occupied, "#{PREVIEW}/config.js", nil)
      STYLES.each do |project, source|
        style = Jekyll::PageWithoutAFile.new(site, site.source, "assets/css/portfolio-preview", "#{project}.scss")
        style.content = %(@import "../#{ROOT}/#{source}";)
        register(site, occupied, site.pages, style)
      end

      site.data["projects"] ||= {}
      site.data["projects"]["topics"] = %w[topics_primary topics_units].to_h do |name|
        [name, SafeYAML.load_file(site.in_source_dir(ROOT, "topics/data", "#{name}.yml"))]
      end
    end

    private

    def add_page(site, occupied, source, project)
      page = Jekyll::Page.new(site, site.source, File.dirname(source), File.basename(source))
      if project || source.end_with?("/index.md")
        page.data["layout"] = "portfolio-system-preview"
        page.data["portfolio_style"] = project if STYLES.key?(project)
        page.data["portfolio_backend"] = %w[calendar messages scraper].include?(project)
        page.data["search_exclude"] = true
      end
      register(site, occupied, site.pages, page)
    end

    def keys(site, entry)
      url = "/#{entry.url.to_s.sub(%r{\A/+}, "")}".sub(%r{/index\.html\z}, "/").sub(%r{(?:\.html|/)\z}, "")
      ["url:#{url}", "output:#{entry.destination(site.dest)}"]
    end

    def register(site, occupied, collection, entry)
      paths = keys(site, entry)
      if paths.any? { |path| occupied.include?(path) }
        raise Jekyll::Errors::FatalException, "Portfolio preview conflicts with an existing output: #{entry.url}"
      end

      occupied.merge(paths)
      collection << entry
    end
  end
end
