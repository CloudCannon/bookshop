require "jekyll"
require "pathname"
require "toml-rb"
require "dry/inflector"

module Bookshop
  class ArrayStructures
    def self.get_story_name(path)
      basename = get_component_type(path)
      return basename.split(/-|\//).map(&:capitalize).join(" ")
    end

    def self.get_component_type(path)
      result = path.split(".").first;
      pathParts = path.split(".").first.split("/")
      if pathParts.length >= 2 && pathParts[pathParts.length-1] === pathParts[pathParts.length-2]
        pathParts.pop
        result = pathParts.join("/")
      end
      return result
    end

    def self.handle_props_object(props, result)
    end

    def self.handle_bookprops(value_obj, structure, value_context = nil)
      structure["_select_data"] ||= {}
      structure["_array_structures"] ||= {}
      structure["_comments"] ||= {}
      structure["value"] ||= {}
      value_context = structure["value"] if value_context.nil?
      inflector = Dry::Inflector.new
      value_obj.each_pair {|key, value|
          if value_context.has_key?(key)
            next
          end

          if value.is_a? Hash
            comment =   value["--bookshop_comment"]         || 
                        value["default--bookshop_comment"]  || 
                        value["select--bookshop_comment"]   || 
                        value["preview--bookshop_comment"]
            if comment
              structure["_comments"][key] = comment
            end
            unless value["default"].nil?
              value_context[key] = value["default"]
              next
            end
            if value["select"]
              value_context[key] = nil
              plural_key = inflector.pluralize(key)
              structure["_select_data"][plural_key] = value["select"]
              next
            end
            if value["preview"]
              value_context[key] = nil
              next
            end
            value_context[key] ||= {}
            handle_bookprops(value, structure, value_context[key])
            next
          end

          if value.is_a? Array
            if value[0]&.is_a? Hash
              if value[0]["--bookshop_comment"]
                structure["_comments"][key] = value[0]["--bookshop_comment"]
              end

              singular_title = inflector.classify(key).gsub(/(.)([A-Z])/, '\1 \2')
              structure["_array_structures"][key] ||= {
                "values" => [{
                  "label" => singular_title,
                  "icon" => "add_box",
                  "value" => {}
                }]
              }
              handle_bookprops( value[0], 
                                structure["_array_structures"][key]["values"][0],
                                structure["_array_structures"][key]["values"][0]["value"])
              value_context[key] = []
              next
            end
            value_context[key] = value
          end

          if [true, false].include? value
            value_context[key] = value
            next
          end

          if key.include? "--bookshop_comment"
            actual_key = key.split("--").first
            next if actual_key == ""
            structure["_comments"][actual_key] = value
            next
          end
          
          value_context[key] = nil
        }
    end


    def self.handle_legacy_story(story, site)
      result = {};
      story.each_pair {|key, value|
          next unless result.has_key?(key) && storyname != "defaults"

          if key.include? "--repeat"
            new_key = key.split("--").first
            result[new_key] = []
            site.config["_array_structures"][new_key] ||= {
              "values" => []
            }

            label = new_key.split("_").map(&:capitalize).join(" ")
            if site.config["_array_structures"][new_key]["values"].select{|value| value["label"] == label}.length > 0
              next
            end
            site.config["_array_structures"][new_key]["values"].push({
              "label" => label,
              "value" => value
            })
          elsif key.include? "--select" or key.include? "--radio" or key.include? "--inline-radio"
            new_key = key.split("--").first
            result[new_key] = nil
            site.config["_select_data"][new_key+"s"] = []
            value.each_value{|option|
              if site.config["_select_data"][new_key+"s"].select{|value| value == option}.length > 0
                next
              end
              site.config["_select_data"][new_key+"s"].push(option)
            }
          elsif key.include? "--multi-select" or key.include? "--check" or key.include? "--inline-check"
            new_key = key.split("--").first
            result[new_key] = []
            site.config["_select_data"][new_key] = []
            value.each_value{|option|
              if site.config["_select_data"][new_key].select{|value| value == option}.length > 0
                next
              end
              site.config["_select_data"][new_key].push(option)
            } 
          elsif key.include? "--"
            new_key = key.split("--").first
            result[new_key] = nil
          else
            result[key] = value
          end
        }
        return result
    end

    def self.transform_component(path, component, site)
      unless component["defaults"].nil?
        return transform_legacy_component(path, component, site)
      end
      result = { "value" => {} }
      result["label"] = get_story_name(path)
      result["value"]["_bookshop_name"] = get_component_type(path)
      unless component["component"].nil?
        result.merge!(component["component"])
      end
      unless component["props"].nil?
        handle_bookprops(component["props"] || {}, result)
      end
      result["array_structures"] ||= [];
      already_in_global_array = result["array_structures"].select{|value| value == 'bookshop_components'}.length > 0
      if !already_in_global_array && !result["_hidden"]
        result["array_structures"].push("bookshop_components")
      end
      result.delete("_hidden") unless result["_hidden"].nil?
      return result
    end

    def self.transform_legacy_component(path, component, site)
      puts "📚 Parsing legacy stories.toml config file"
      result = { "value" => {} }
      result["label"] = get_story_name(path)
      result["value"]["_component_type"] = get_component_type(path)
      component.each_pair { |storyname, story|
        if storyname == "meta"
          result.merge!(story)
        else
          result["value"].merge!(handle_legacy_story(story, site))
        end
      }
      result["array_structures"] ||= [];
      contains_component = result["array_structures"].select{|value| value == 'components'}.length > 0
      if !contains_component && !result["_hidden"]
        result["array_structures"].push("components")
      end
      result.delete("_hidden") unless result["_hidden"].nil?
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
        transformed_component = transform_component(f, component, site)
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
      end
    end

    def self.build_array_structures(site)
      bookshop_locations = site.config['bookshop_locations']&.collect do |location|
        Pathname.new(location + "/components").cleanpath.to_s
      end
      bookshop_locations = bookshop_locations.select do |location|
        Dir.exist?(location)
      end
      bookshop_locations.each do |base_path|
        build_from_location(base_path, site)
      end
      puts "✅ Finshed Parsing Stories"
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  Bookshop::ArrayStructures.build_array_structures(site)
end
