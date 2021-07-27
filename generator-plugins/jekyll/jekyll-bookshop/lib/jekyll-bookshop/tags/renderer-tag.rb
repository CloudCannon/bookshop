# frozen_string_literal: true

module JekyllBookshop
  class RendererTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      # check if markup contains a number
      if %r!\d+!.match?(markup)
        @port = markup.gsub(%r![^\d]!, "").to_i
      else
        Jekyll.logger.warning "Bookshop:",
                              "bookshop_renderer tag malformed.
                               Use {% bookshop_renderer :6061 %}
                               with the port @bookshop/renderer is running on."
      end
    end

    def render(context)
      return unless @port
      return if Jekyll.env == "production"

      site = context.registers[:site]
      page = context.registers[:page]

      site.data["_bookshop_data_pages"] ||= []
      unless site.data["_bookshop_data_pages"].include?(page["url"])
        site.data["_bookshop_data_pages"].push(page["url"])
      end

      "<div data-bookshop-renderer></div>
<script>window.bookshop_renderer_site_data = null;</script>
<script src=\"http://localhost:#{@port}/bookshop.js\"></script>
<link href=\"http://localhost:#{@port}/renderer.css\" rel=\"stylesheet\">"
    end
  end
end
