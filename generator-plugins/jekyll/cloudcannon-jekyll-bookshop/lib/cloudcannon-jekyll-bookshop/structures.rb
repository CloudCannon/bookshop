# frozen_string_literal: true

require "pathname"
require "toml-rb"
require "dry/inflector"
require "node-runner"

module CloudCannonJekyllBookshop
  # Parses a bookshop and creates CloudCannon CMS structures
  class Structures
    def self.get_default_component_name(path)
      @node_bookshop.NiceLabel(get_component_key(path))
    end

    def self.get_component_key(path)
      @node_bookshop.GetComponentKey(path)
    end

    def self.rewrite_bookshop_toml(content)
      @node_bookshop.RewriteTOML(content)
    end

    def self.parse_bookshop_toml(content)
      rewritten_content = rewrite_bookshop_toml(content)
      TomlRB.parse(rewritten_content)
    end

    def self.load_component(path)
      begin
        component = parse_bookshop_toml(path)
      rescue StandardError => e
        Jekyll.logger.error "Bookshop:",
                            "❌ Error Parsing Story: #{e}"
        Jekyll.logger.error "",
                            e.message
      end
      component
    end

    def self.transform_component(path, component)
      transformed_components = @node_bookshop.TransformComponent(path, component)
      @structure_count += transformed_components.size
      transformed_components
    end

    def self.add_structure(hash, component)
      array_structures = component.delete("array_structures")
      array_structures.each do |key|
        hash[key] ||= {}
        hash[key]["values"] ||= []
        hash[key]["values"].push(component)
      end
    end

    def self.build_from_location(base_path, site)
      site.config["_select_data"] ||= {}
      site.config["_array_structures"] ||= {}
      Jekyll.logger.info "Bookshop:",
                         "Parsing Stories from #{base_path}"

      threads = []
      Dir.glob("**/*.{bookshop}.{toml,tml,tom,tm}", :base => base_path).each do |f|
        threads << Thread.new do
          raw_file = File.read(base_path + "/" + f)
          component = load_component(raw_file)

          transform_component(f, component).each do |transformed_component|
            add_structure(site.config["_array_structures"], transformed_component)
          end
        end
      end
      threads.each(&:join)
    end

    def self.setup_helpers
      @inflector = Dry::Inflector.new
      @node_bookshop = NodeRunner.new(
        <<~JAVASCRIPT
          const {Version: TNVersion, RewriteTOML} = require('@bookshop/toml-narrator');
          const {Version: CSVersion, TransformComponent, GetComponentKey, NiceLabel} = require('@bookshop/cloudcannon-structures');
        JAVASCRIPT
      )
    end

    def self.tn_version
      @node_bookshop.TNVersion
    end

    def self.cs_version
      @node_bookshop.CSVersion
    end

    def self.build_structures(site)
      structure_start = Time.now
      @structure_count = 0

      setup_helpers

      bookshop_locations = site.config["bookshop_locations"]&.collect do |location|
        Pathname.new("#{site.source}/#{location}/components").cleanpath.to_s
      end
      bookshop_locations = bookshop_locations&.select do |location|
        Dir.exist?(location)
      end
      bookshop_locations&.each do |base_path|
        build_from_location(base_path, site)
      end

      elapsed_time = Time.now - structure_start
      Jekyll.logger.info "Bookshop:",
                         "#{@structure_count} structure#{@structure_count == 1 ? "" : "s"}
      built in #{elapsed_time.round(2)}s ✅"
    end
  end
end
