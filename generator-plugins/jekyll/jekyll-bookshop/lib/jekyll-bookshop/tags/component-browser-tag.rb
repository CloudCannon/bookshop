# frozen_string_literal: true

module JekyllBookshop
  class ComponentBrowserTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @port = markup.strip
    end

    def render(context)
      local_port = 30775;

      if @port.length > 0
        is_int = Integer(@port) rescue false
        unless is_int
          STDERR.puts "bookshop_component_browser expected either no argument, or an integer for the local port number used when running @bookshop/browser."
          exit 1
        end
        local_port = @port
      end

      "<div data-bookshop-browser=\"\"></div>
<script src=\"http://localhost:#{ local_port }/bookshop.js\"></script>
<script>
  window.bookshopBrowser = new window.BookshopBrowser({globals: []});
  window.bookshopBrowser.render();
</script>"
    end
  end
end
