require "jekyll"
require 'pathname'

module JekyllBookshop
  class Tag < Jekyll::Tags::IncludeTag

    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      context['site']['bookshop_component_locations'].freeze
    end

    # Support the bind syntax, spreading an object into params
    def parse_params(context)
      params = super

      params.each do |key, value|
        if key == 'bind'
          valueHash = {}.merge(value)
          params = valueHash.merge(params)
          next
        end
      end

      params.delete('bind')

      params
    end

    # Map component names to the .jekyll.html files found in bookshop
    def render(context)
      site = context.registers[:site]

      file = render_variable(context) || @file
      cname = file.strip.split("/").last
      file = "#{file}/#{cname}.jekyll.html"
      validate_file_name(file)

      path = locate_include_file(context, file, site.safe)
      return unless path

      add_include_to_dependency(site, path, context)

      partial = load_cached_partial(path, context)

      context.stack do
        context["include"] = parse_params(context) if @params
        begin
          partial.render!(context)
        rescue Liquid::Error => e
          e.template_name = path
          e.markup_context = "included " if e.markup_context.nil?
          raise e
        end
      end
    end
  end

  class StyleTag < Liquid::Tag
    def render(context)
      site = context.registers[:site]
      
      bookshop_scss_files = []
      site.config['bookshop_locations']&.each do |location|
        components_loc = Pathname.new(location + "/").cleanpath.to_s
        scss_files = Dir.glob(components_loc + "/**/*.scss")&.collect do |scss_file|
          scss_file.sub!(components_loc+"/", '').sub!(".scss", '')
        end
        bookshop_scss_files.push(*scss_files)
      end

      bookshop_scss_files = bookshop_scss_files&.collect do |file|
        "@import '#{file}';"
      end

      output_css = if Jekyll.env == "production"
        bookshop_scss_files.join("\n")
      else
"html:not([data-bookshop-hmr]) {
#{bookshop_scss_files.join("\n")}
}"
      end

      output_css
    end
  end

  class Styles

    # Add the paths to find bookshop's styles
    def self.open_bookshop(site)
      base_bookshop_locations = site.config['bookshop_locations']&.collect do |location|
        Pathname.new("#{site.source}/#{location}/").cleanpath.to_s
      end
      base_bookshop_locations = base_bookshop_locations.select do |location|
        Dir.exist?(location)
      end
      bookshop_component_locations = base_bookshop_locations&.collect do |location|
        Pathname.new("#{location}/components/").cleanpath.to_s
      end

      site.config['watch_dirs'] ||= [] # Paired with CloudCannon/jekyll-watch
      site.config['watch_dirs'].push(*base_bookshop_locations);

      site.config['sass'] ||= {}
      site.config['sass']['load_paths'] ||= []
      site.config['sass']['load_paths'].push(*base_bookshop_locations)

      site.config['bookshop_locations'] = []
      site.config['bookshop_locations'].push(*base_bookshop_locations)

      site.config['bookshop_component_locations'] ||= []
      site.config['bookshop_component_locations'].push(*bookshop_component_locations)
    end
  end

  module Filters
    def addmods(classname, mods = {})
      base = classname.partition(" ").first
      mods.each do |mod|
        if mod[1]
          classname = "#{classname} #{base}--#{mod[0]}"
        end
      end
      return classname
    end

    def addstates(classname, states = {})
      states.each do |state|
        if state[1]
          classname = "#{classname} is-#{state[0]}"
        end
      end
      return classname
    end
  end
end

Liquid::Template.register_tag("bookshop", JekyllBookshop::Tag)
Liquid::Template.register_tag("bookshop_scss", JekyllBookshop::StyleTag)

Liquid::Template.register_filter(JekyllBookshop::Filters)

Jekyll::Hooks.register :site, :after_init do |site|
  JekyllBookshop::Styles.open_bookshop(site)
end