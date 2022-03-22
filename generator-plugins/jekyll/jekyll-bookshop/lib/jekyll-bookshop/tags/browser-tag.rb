# frozen_string_literal: true

module JekyllBookshop
  class BrowserTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @host = markup.strip
    end

    def self.transformHostString(host)
      case
        when host =~ %r!^:\d+$!
          "http://localhost#{host}/bookshop.js"
        when host =~ %r!^\d+$!
          "http://localhost:#{host}/bookshop.js"
        when host =~ %r!^localhost:\d+$!
          "http://#{host}/bookshop.js"
        when host =~ %r!^/|https?://!
          host
        else
          "//#{host}"
      end
    end

    def render(context)
      return unless @host

      host = BrowserTag.transformHostString(@host)

      site = context.registers[:site]
      page = context.registers[:page]

      "<div data-bookshop-browser></div>
<script src=\"#{host}\"></script>
<script>
  window.bookshopBrowser = new window.BookshopBrowser({
    globals: []
  }); 
  window.bookshopBrowser.render();
</script>"
    end
  end
end
