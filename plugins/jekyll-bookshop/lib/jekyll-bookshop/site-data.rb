module JekyllBookshop
  class SiteData
    def self.extract(site)
      @site = site

      payload_collections = {}
      @site.collections.each_pair do |collection, items|
        payload_collections[collection] = items.docs.map do |doc|
          doc.data.merge(hydrate_document_fields(doc))
        end
      end

      payload_collections["data"] = @site.data

      @site.data["bookshop_site_data"] = {"site" => payload_collections}
    end

    def hydrate_document_fields(document)
      keys = ["content", "url", "date", "relative_path", "permalink"]
      hydrated_doc = {}
      keys.each {|key| hydrated_doc[key] = document.send(key)}
      hydrate_document_excerpt(document, hydrated_doc)
    end

    def hydrate_document_excerpt(document, hydrated_doc)
      hydrated_doc.merge!({
        "excerpt" => document.data["excerpt"].output
      })
    end
  end
end