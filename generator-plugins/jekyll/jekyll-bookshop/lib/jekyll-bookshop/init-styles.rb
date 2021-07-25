# frozen_string_literal: true

module JekyllBookshop
  class Styles
    # Add the paths to find bookshop's styles
    def self.open_bookshop(site)
      return unless site.config["bookshop_locations"]

      bookshop_base_locations = filter_bookshops(site.config["bookshop_locations"])
      bookshop_component_locations = bookshop_base_locations&.collect do |location|
        Pathname.new("#{location}/components/").cleanpath.to_s
      end

      site.config["sass"] ||= {}

      apply_array(site.config["sass"], "load_paths", bookshop_base_locations)
      # Paired with CloudCannon/jekyll-watch
      apply_array(site.config, "watch_dirs", bookshop_base_locations)
      apply_array(site.config, "bookshop_base_locations", bookshop_base_locations)
      apply_array(site.config, "bookshop_component_locations", bookshop_component_locations)
    end

    def self.filter_bookshops(locations)
      mapped_locations = locations&.collect do |location|
        Pathname.new("#{site.source}/#{location}/").cleanpath.to_s
      end
      mapped_locations.select do |location|
        Dir.exist?(location)
      end
    end

    def self.apply_array(hash, key, arr)
      hash[key] ||= []
      hash[key].push(*arr)
    end
  end
end
