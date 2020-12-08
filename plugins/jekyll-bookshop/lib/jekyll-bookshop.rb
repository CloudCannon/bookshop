require "jekyll"
require 'pathname'

module JekyllBookshop
  class Tag < Jekyll::Tags::IncludeTag

    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      Array([
        Pathname.new(context['site']['bookshop_theme_path'] + '/components').cleanpath.to_s, 
        Pathname.new(context['site']['bookshop_site_path'] + '/components').cleanpath.to_s
      ]).freeze
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

  class Styles

    # Add the paths to find bookshop's styles
    def self.open_bookshop(site)
      bookshop_theme_path = site.theme.root + '/_bookshop'
      bookshop_site_path = site.source + '/_bookshop'
      site.config['bookshop_theme_path'] = Pathname.new(bookshop_theme_path).cleanpath.to_s
      site.config['bookshop_site_path'] = Pathname.new(bookshop_site_path).cleanpath.to_s

      site.config['sass'] ||= {}
      site.config['sass']['load_paths'] ||= []
      site.config['sass']['load_paths'].push(Pathname.new(bookshop_theme_path + '/sass').cleanpath.to_s)
      site.config['sass']['load_paths'].push(Pathname.new(bookshop_site_path + '/sass').cleanpath.to_s)
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

Liquid::Template.register_tag("component", JekyllBookshop::Tag)

Liquid::Template.register_filter(JekyllBookshop::Filters)

Jekyll::Hooks.register :site, :after_init do |site|
  JekyllBookshop::Styles.open_bookshop(site)
end