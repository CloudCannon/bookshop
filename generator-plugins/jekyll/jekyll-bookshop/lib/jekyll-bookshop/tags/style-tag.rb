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

      bookshop_scss_files.sort! do |a, b| 
        a_shared = a.match(%r!"shared\/!)
        b_shared = b.match(%r!"shared\/!)
        case
        when a_shared && !b_shared
          -1
        when !a_shared && b_shared
          1
        else
          a <=> b
        end
      end

      "@media all, bookshop {#{bookshop_scss_files.join("")}}"
    end
  end
end
