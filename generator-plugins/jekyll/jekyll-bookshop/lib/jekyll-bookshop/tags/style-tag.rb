# frozen_string_literal: true

module JekyllBookshop
  class StyleTag < Liquid::Tag
    def render(context)
      site = context.registers[:site]

      bookshop_scss_files = []
      site.config["bookshop_base_locations"]&.each do |location|
        components_loc = Pathname.new(location + "/").cleanpath.to_s
        scss_files = Dir.glob(components_loc + "/**/*.scss")&.sort&.collect do |scss_file|
          scss_file.sub!(components_loc + "/", "").sub!(".scss", "")
        end
        bookshop_scss_files.push(*scss_files)
      end

      bookshop_scss_files = bookshop_scss_files&.collect do |file|
        "@import \"#{file}\";"
      end

      "@media all, bookshop {#{bookshop_scss_files.join("\n")}}"
    end
  end
end
