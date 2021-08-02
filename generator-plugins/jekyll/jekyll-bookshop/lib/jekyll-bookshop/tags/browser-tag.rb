# frozen_string_literal: true

module JekyllBookshop
  class BrowserTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @host = markup.strip
    end

    def render(context)
      return unless @host
      return if Jekyll.env == "production"

      site = context.registers[:site]
      page = context.registers[:page]

      site.data["_bookshop_data_pages"] ||= []
      unless site.data["_bookshop_data_pages"].include?(page["url"])
        site.data["_bookshop_data_pages"].push(page["url"])
      end

      "<div data-bookshop-browser></div>
<script>window.bookshop_browser_site_data = null;</script>
<script src=\"//#{@host}\"></script>
<script>window.BookshopBrowser = new window.BookshopBrowserClass(); window.BookshopBrowser.render();</script>"
    end
  end
end
