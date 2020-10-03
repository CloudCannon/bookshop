require "jekyll"
require 'pathname'

module JekyllBookshop
  class Tag < Jekyll::Tags::IncludeTag
    def initialize(tag_name, markup, tokens)
      cpath = markup.strip.partition(" ").first
      cname = cpath.strip.split("/").last
      tag = markup.strip.partition(" ").last
      markup = "#{cpath}/#{cname}.jekyll.html #{tag}"
      super
    end

    def tag_includes_dirs(context)
      Array(Pathname.new(context['site']['bookshop_path'] + '/components').cleanpath.to_s).freeze
    end

    def parse_params(context)
      params = super

      params.each do |key, value|
        if key == 'bind'
          valueHash = {}.merge(value)
          params = valueHash.merge(params)
          next
        end
      end

      params
    end
  end

  class Styles
    def self.open_bookshop(site)
      bookshop_path = site.theme.root + '/_bookshop'
      site.config['bookshop_path'] = Pathname.new(bookshop_path).cleanpath.to_s
      site.config['sass'] ||= {}
      site.config['sass']['load_paths'] ||= []
      site.config['sass']['load_paths'].push(Pathname.new(bookshop_path + '/sass').cleanpath.to_s)
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