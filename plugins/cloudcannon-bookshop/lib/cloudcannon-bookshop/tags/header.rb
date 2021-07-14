require 'json/ext'
require_relative '../page-without-a-file'

module CloudCannonBookshop
  class HeaderTag < Liquid::Tag
    def render(context)
      @site = context.registers[:site]

      payload_collections = {}
      @site.collections.each_pair do |collection, items|
        payload_collections[collection] = items.docs.map do |doc|
          doc.data.merge(hydrate_document_fields(doc))
        end
      end

      payload_collections["data"] = @site.data
      output_payload = {"site" => payload_collections}.to_json

      filename = "site-data"
      generate_file(filename, output_payload)
      "<script>window.bookshopSiteData = #{output_payload};</script>"
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

    def generate_file(filename, content)
      dest = destination_json_path(filename)
      FileUtils.mkdir_p(File.dirname(dest))
      File.open(dest, "w") { |file| file.write(content) }
      @site.keep_files ||= []
      @site.keep_files << json_path(filename)
    end

    def destination_json_path(filename)
      Jekyll.sanitized_path(@site.dest, json_path(filename))
    end

    def json_path(filename)
      "_cloudcannon/#{filename}.json"
    end
  end
end