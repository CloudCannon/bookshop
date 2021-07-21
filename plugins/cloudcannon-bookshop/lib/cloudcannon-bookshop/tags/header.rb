require 'json/ext'
require_relative '../page-without-a-file'

module CloudCannonBookshop
  class HeaderTag < Liquid::Tag
    def render(context)
      @site = context.registers[:site]

      output_payload = @site.data["bookshop_site_data"].to_json

      filename = "site-data"
      generate_file(filename, output_payload)
      "<script>window.bookshopSiteDataAvailable = true;</script>"
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