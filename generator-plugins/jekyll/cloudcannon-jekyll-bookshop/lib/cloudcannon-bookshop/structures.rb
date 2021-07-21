require "pathname"
require "toml-rb"
require "dry/inflector"
require_relative "structures/bookprops"

module CloudCannonBookshop
  # Parses a bookshop and creates CloudCannon CMS structures
  class Structures
    
    # Used as a fallback when no label is supplied inside [component]
    # Turns "lorem/ipsum-dolor" into "Lorem Ipsum Dolor"
    def self.get_default_component_name(path)
      basename = get_component_key(path)
      return basename.split(/-|\//).map(&:capitalize).join(" ")
    end
    
    # Generates the bookshop key used to reference this component
    # Turns "a/b/b.bookshop.toml" into "a/b"
    def self.get_component_key(path)
      result = path.split(".").first;
      pathParts = path.split(".").first.split("/")
      if pathParts.length >= 2 && pathParts[pathParts.length-1] === pathParts[pathParts.length-2]
        pathParts.pop
        result = pathParts.join("/")
      end
      return result
    end
        
        def self.rewrite_bookshop_toml(content)
          rewritten_lines = content.split("\n")&.collect { |line|
            if line =~ /^[a-z0-9\-_\.\s]+=.*?#.+?$/i
              /#:(?<comment>[^#]+)$/i =~ line
              /^\s*?(?<variable_name>[a-z0-9\-_\.]+)\s?=/i =~ line
              next line unless comment && variable_name
              
              next "#{variable_name}--bookshop_comment = \"#{comment.strip}\"\n#{line}"
            elsif line =~ /^\s*?\[.*?#.+?$/i
              /#:(?<comment>[^#]+)$/i =~ line
              next line unless comment
              next "#{line}\n--bookshop_comment = \"#{comment.strip}\""
            end
            line
          }
          rewritten_lines.join("\n")
        end
        
        def self.parse_bookshop_toml(content)
          rewritten_content = rewrite_bookshop_toml(content)
          return TomlRB.parse(rewritten_content)
        end
        
        def self.build_from_location(base_path, site)
          site.config["_select_data"] ||= {}
          site.config["_array_structures"] ||= {}
          puts "📚 Parsing Stories from #{base_path}"
          Dir.glob("**/*.{bookshop,stories}.{toml,tml,tom,tm}", base: base_path).each do |f|
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
            transformed_components = transform_component(f, component, site)
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
          end
        end
        
        def self.build_structures(site)
          @inflector = Dry::Inflector.new
          bookshop_locations = site.config['bookshop_locations']&.collect do |location|
            Pathname.new("#{site.source}/#{location}/components").cleanpath.to_s
          end
          bookshop_locations = bookshop_locations&.select do |location|
            Dir.exist?(location)
          end
          bookshop_locations&.each do |base_path|
            build_from_location(base_path, site)
          end
          puts "✅ Finshed Parsing Stories"
        end
      end
    end