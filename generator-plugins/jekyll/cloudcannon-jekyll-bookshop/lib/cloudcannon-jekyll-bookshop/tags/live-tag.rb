# frozen_string_literal: true

module CloudCannonJekyllBookshop
  class LiveTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @script = markup.strip      
    end

    def render(context)
      site = context.registers[:site]

      "<script>
window.addEventListener('load', function() {
  if (window.inEditorMode) {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = `/#{@script}`;
    script.onload = function() {
      window.bookshopLive = new window.BookshopLive({
        remoteGlobals: ['/_cloudcannon/bookshop-site-data.json']
      });
      window.CloudCannon = {
        trigger: function (eventName, frontMatter) {
            if (typeof frontMatter === 'string') frontMatter = JSON.parse(frontMatter);
            window.bookshopLive.update({page: frontMatter});
        }
      }
    }
    head.appendChild(script);
  }
});
</script>"
    end
  end
end
