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
(function(){
  const bookshopLiveSetup = (CloudCannon) => {
    CloudCannon.enableEvents();

    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = `/#{@script}`;
    script.onload = function() {
      window.bookshopLive = new window.BookshopLive({
        remoteGlobals: ['/_cloudcannon/bookshop-site-data.json']
      });
      const updateBookshopLive = async () => {
        const frontMatter = await CloudCannon.value();
        const options = window.bookshopLiveOptions || {};
        window.bookshopLive.update({page: frontMatter}, options);
      }
      document.addEventListener('cloudcannon:update', updateBookshopLive);
      updateBookshopLive();
    }
    head.appendChild(script);
  }

  document.addEventListener('cloudcannon:load', function (e) {
    bookshopLiveSetup(e.detail.CloudCannon);
  });
})();
</script>"
    end
  end
end
