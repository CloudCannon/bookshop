require "pathname"
require "toml-rb"
require "dry/inflector"
require "node-runner"

module CloudCannonBookshop
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
      return TomlRB.parse(rewritten_content)
    end
    
    def self.transform_component(path, component)
      @node_bookshop.TransformComponent(path, component)
    end
    
    def self.build_from_location(base_path, site)
      site.config["_select_data"] ||= {}
      site.config["_array_structures"] ||= {}
      puts "📚 Parsing Stories from #{base_path}"
      threads = []
      Dir.glob("**/*.{bookshop,stories}.{toml,tml,tom,tm}", base: base_path).each do |f|
        threads << Thread.new {
          begin
            if f =~ /bookshop/
              raw_file = File.read(base_path + "/" + f)
              component = parse_bookshop_toml(raw_file)
            else
              component = TomlRB.load_file(base_path + f)
            end
          rescue => exception
            puts "❌ Error Parsing Story: " + f
            puts exception
            next
          end
          transformed_components = transform_component(f, component);
          @structure_count += transformed_components.size
          transformed_components.each{|transformed_component|
            array_structures = transformed_component.delete("array_structures")
            array_structures.each{|key|
              begin
                site.config["_array_structures"][key] ||= {}
                site.config["_array_structures"][key]["values"] ||= []
                site.config["_array_structures"][key]["values"].push(transformed_component)
              rescue => exception
                puts "❌ Error Adding Story to Array Structures: " + f
                puts "🤔 Maybe your current _config.yml has conflicting array structures?"
              end
            }
          }
        }
      end
      threads.each(&:join)
    end
    
    def self.build_structures(site)
      structure_start = Time.now
      
      @structure_count = 0
      @inflector = Dry::Inflector.new
      @node_bookshop = NodeRunner.new(
        <<~JAVASCRIPT
        const {RewriteTOML} = require('@bookshop/toml-narrator');
        const {TransformComponent, GetComponentKey, NiceLabel} = require('@bookshop/cloudcannon-structures');
        JAVASCRIPT
      )
      
      bookshop_locations = site.config['bookshop_locations']&.collect do |location|
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