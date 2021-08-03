# frozen_string_literal: true

module JekyllBookshop
  class Opener
    # Add the paths to find bookshop(s)
    def self.open_bookshop(site)
      return unless site.config["bookshop_locations"]

      bookshop_base_locations = filter_bookshops(site.source, site.config["bookshop_locations"])
      bookshop_component_locations = bookshop_component_locations(bookshop_base_locations)
      bookshop_shared_locations = bookshop_shared_locations(bookshop_base_locations)

      site.config["sass"] ||= {}

      apply_array(site.config["sass"], "load_paths", bookshop_base_locations)
      # Paired with CloudCannon/jekyll-watch
      apply_array(site.config, "watch_dirs", bookshop_base_locations)
      apply_array(site.config, "bookshop_base_locations", bookshop_base_locations)
      apply_array(site.config, "bookshop_component_locations", bookshop_component_locations)
      apply_array(site.config, "bookshop_shared_locations", bookshop_shared_locations)
    end

    def self.filter_bookshops(src, locations)
      mapped_locations = locations&.collect do |location|
        Pathname.new("#{src}/#{location}/").cleanpath.to_s
      end
      mapped_locations.select do |location|
        Dir.exist?(location)
      end
    end

    def self.bookshop_component_locations(locations)
      locations&.collect do |location|
        Pathname.new("#{location}/components/").cleanpath.to_s
      end
    end

    def self.bookshop_shared_locations(locations)
      locations&.collect do |location|
        Pathname.new("#{location}/shared/jekyll/").cleanpath.to_s
      end
    end

    def self.apply_array(hash, key, arr)
      hash[key] ||= []
      hash[key].push(*arr)
    end
  end
end
