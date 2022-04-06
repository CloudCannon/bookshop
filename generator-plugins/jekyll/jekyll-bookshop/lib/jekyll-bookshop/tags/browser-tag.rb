# frozen_string_literal: true

module JekyllBookshop
  class BrowserTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @host = markup.strip
    end

    def render(context)
      STDERR.puts "The {% bookshop_browser #{@host} %} tag has been replaced in Bookshop 3.0"
      STDERR.puts "Replace this tag with {% bookshop_component_browser %}"
      STDERR.puts "Note: The port argument is no longer needed, nor are any environment checks"
      exit 1
    end
  end
end
