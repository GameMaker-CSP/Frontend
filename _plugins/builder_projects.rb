# frozen_string_literal: true

# Keep authored files together, like OpenCS projects, without generated copies
# in the source tree. Both the local script and CI use this Jekyll generator.
module BuilderProjects
  ROOT = "_projects/systems"
  IMAGE_PATHS = {
    "gamebuilder" => "images/projects/gamebuilder",
    "open-world" => "images/gamebuilder",
    "racing" => "images/projects/racing",
  }.freeze

  class Asset < Jekyll::StaticFile
    def initialize(site, source, target)
      super(site, site.source, File.dirname(source), File.basename(source))
      @url = "/#{target}"
    end
  end

  class Publisher < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      IMAGE_PATHS.each do |name, images|
        project = "#{ROOT}/#{name}"
        publish_page(site, "#{project}/index.md")
        %w[docs navigation].each do |folder|
          files(site, "#{project}/#{folder}").each do |source|
            publish_page(site, source) if Jekyll::Utils.has_yaml_header?(site.in_source_dir(source))
          end
        end
        files(site, "#{project}/js").each do |source|
          target = source.sub(/^_projects\//, "projects/")
          if Jekyll::Utils.has_yaml_header?(site.in_source_dir(source))
            publish_page(site, source, "/#{target}")
          else
            site.static_files << Asset.new(site, source, target)
          end
        end
        files(site, "#{project}/images").each do |source|
          next unless source.match?(/\.(png|jpe?g|gif|webp|svg|json|avif|ico)$/i)

          # Saved/exported game code still refers to these original URLs.
          target = source.sub("#{project}/images", images)
          site.static_files << Asset.new(site, source, target)
        end
      end
      # Older pages also use the inherited template catalog.
      site.static_files << Asset.new(site, "#{ROOT}/open-world/js/templates.js",
                                    "assets/js/GameEnginev1.2/builder/templates.js")
    end

    private

    def files(site, directory)
      Dir.glob(site.in_source_dir(directory, "**", "*")).select { |path| File.file?(path) }
         .sort.map { |path| path.delete_prefix("#{site.source}/") }
    end

    def publish_page(site, source, permalink = nil)
      page = Jekyll::Page.new(site, site.source, File.dirname(source), File.basename(source))
      page.data["permalink"] = permalink if permalink
      raise "Builder page #{source} needs a permalink" unless page.data["permalink"]

      site.pages << page
    end
  end
end
