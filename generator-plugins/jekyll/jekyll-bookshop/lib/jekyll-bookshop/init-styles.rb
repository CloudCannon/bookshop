module JekyllBookshop
  class Styles

    # Add the paths to find bookshop's styles
    def self.open_bookshop(site)
      return unless site.config['bookshop_locations']
      bookshop_base_locations = site.config['bookshop_locations']&.collect do |location|
        Pathname.new("#{site.source}/#{location}/").cleanpath.to_s
      end
      bookshop_base_locations = bookshop_base_locations.select do |location|
        Dir.exist?(location)
      end
      bookshop_component_locations = bookshop_base_locations&.collect do |location|
        Pathname.new("#{location}/components/").cleanpath.to_s
      end

      site.config['watch_dirs'] ||= [] # Paired with CloudCannon/jekyll-watch
      site.config['watch_dirs'].push(*bookshop_base_locations);

      site.config['sass'] ||= {}
      site.config['sass']['load_paths'] ||= []
      site.config['sass']['load_paths'].push(*bookshop_base_locations)

      site.config['bookshop_base_locations'] ||= []
      site.config['bookshop_base_locations'].push(*bookshop_base_locations)

      site.config['bookshop_component_locations'] ||= []
      site.config['bookshop_component_locations'].push(*bookshop_component_locations)
    end
  end
end