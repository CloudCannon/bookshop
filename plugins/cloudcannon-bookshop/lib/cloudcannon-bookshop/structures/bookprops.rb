# This file handles converting the TOML values to the CloudCannon structure format
module CloudCannonBookshop
  class Structures
    # TOML comments are rewritten to a variety of keys...
    # This function knows them all.
    def self.get_comment(value) 
      value["--bookshop_comment"]         ||
      value["select--bookshop_comment"]   ||
      value["preview--bookshop_comment"]  ||
      value["default--bookshop_comment"]
    end

    def self.initialize_structure(structure)
      structure["_select_data"] ||= {}
      structure["_array_structures"] ||= {}
      structure["_comments"] ||= {}
      structure["value"] ||= {}
    end

    # Check a hash for special bookshop keys and react accordingly.
    # If no special keys lie within, recurse into it as a normal object
    def self.handle_bookprops_hash(key, hash, structure, value_context)
      comment = get_comment(hash)
      structure["_comments"][key] = comment if comment

      if hash["select"]
        value_context[key] = hash["default"]
        structure["_select_data"][@inflector.pluralize(key)] = hash["select"]
        return
      end
      if hash["preview"]
        value_context[key] = hash["default"]
        return
      end
      unless hash["default"].nil?
        value_context[key] = hash["default"]
        return
      end
      value_context[key] ||= {}
      handle_bookprops(hash, structure, value_context[key])
    end

    # Recursively convert a hash (value_obj) into a CloudCannon structure
    def self.handle_bookprops(value_obj, structure, value_context = nil)
      initialize_structure(structure)

      # value_context at the top level is the entire value for the structure
      # Recursive calls will be given a hash that represents a nested key inside the larger value_context
      value_context = structure["value"] if value_context.nil? 

      value_obj.each_pair {|key, value|
        next if value_context.has_key?(key)

        if value.is_a? Hash
          handle_bookprops_hash(key, value, structure, value_context)
          next
        end
        
        if value.is_a? Array
          if value[0]&.is_a? Hash
            if value[0]["--bookshop_comment"]
              structure["_comments"][key] = value[0]["--bookshop_comment"]
            end
            
            if structure["raw_fields"]&.include?(key)
              value_context[key] = nil
              next
            end
            
            singular_title = @inflector.classify(key).gsub(/(.)([A-Z])/, '\1 \2')
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
          value_context[key] = []
          next
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
        
        def self.transform_component(path, component, site)
          result = { "value" => {} }
          result["label"] = get_default_component_name(path)
          result["value"]["_bookshop_name"] = get_component_key(path)
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
          results = [result]
          if result["_template"]
            results.push(transform_template_component(result))
          end
          result.delete("_template")
          result.delete("raw_fields")
          return results
        end
        
        def self.transform_template_component(result)
          base_template_hash = {"pre.__template_code" => ""}
          base_comment_hash = {"pre.__template_code" => "Helper liquid to run before the feilds below. Assigns and captures will be available"}
          schema_result = Marshal.load(Marshal.dump(result))
          unwrap_structure_template(schema_result, "site")
          schema_result["value"] = base_template_hash.merge! templatize_values(schema_result["value"])
          schema_result["_comments"] = base_comment_hash.merge! templatize_comments(schema_result["_comments"])
          schema_result["value"]["_bookshop_name"] = "#{schema_result["value"]["_bookshop_name"]}.__template"
          schema_result["label"] = "Templated #{schema_result["label"]}"
          schema_result["_array_structures"] = {}
          schema_result["_select_data"] = {}
          schema_result.delete("_template")
          schema_result
        end
        
        # Breadth-first search through the structure, looking for keys
        # that will match array structure or comments and flattening them
        # into the root structure
        def self.unwrap_structure_template(structure, parent_scope)
          singular_parent_scope = @inflector.singularize(parent_scope)
          flattened_keys = {}
          structure["value"].each_pair do |base_key, base_value|
            flattened_keys[base_key] = base_value if base_key.start_with? "_"
          end
          flatten_hash(structure["value"]).each do |flat_key|
            cascade_key = flat_key.split(".").last
            matched_comment = structure.dig("_comments", cascade_key)
            matched_substructure = structure.dig("_array_structures", cascade_key, "values", 0)
            
            if matched_substructure
              # Mark this key as an array so the include plugin knows to return
              # a value and not a string
              flattened_keys["#{flat_key}.__array_template"] = "{% assign #{cascade_key} = #{singular_parent_scope}.#{cascade_key} %}"
              if matched_comment
                structure["_comments"].delete(cascade_key)
                structure["_comments"]["#{flat_key}.__array_template"] = matched_comment
              end
              
              unwrap_structure_template(matched_substructure, cascade_key)
              matched_substructure["value"].each_pair do |subkey, subvalue|
                # Pull substructure's flat keys into this structure
                flattened_keys["#{flat_key}.#{subkey}"] = subvalue
              end
              matched_substructure["_comments"].each_pair do |subkey, subcomment|
                # Pull substructure's comments into this structure
                structure["_comments"]["#{flat_key}.#{subkey}"] = subcomment
              end
            else
              key_parent_scope = ""
              unless singular_parent_scope == "site"
                key_parent_scope = "#{singular_parent_scope}."
              end
              flattened_keys[flat_key] = "{{ #{key_parent_scope}#{flat_key.split('.').last} }}"
              if matched_comment
                structure["_comments"].delete(cascade_key)
                structure["_comments"][flat_key] = matched_comment
              end
            end
          end
          structure["value"] = flattened_keys
        end
        
        # Recursively convert a hash into flat dot-notation keys
        def self.flatten_hash(hash)
          keys = [];
          hash.each_pair do |k, v|
            next if k.start_with? "_"
            if v.is_a? Hash
              flatten_hash(v).each do |ik|
                keys.push("#{k}.#{ik}")
              end
            else
              keys.push(k)
            end
          end
          keys
        end
        
        def self.templatize_values(hash)
          templated_hash = hash.dup
          hash.each_pair do |k, v|
            next if k.start_with? "_"
            if k.end_with? "__array_template"
              # Remove and re-add the array so position is preserved
              templated_hash.delete(k)
              templated_hash[k] = v
            else
              templated_hash.delete(k)
              templated_hash["#{k}.__template"] = v
            end
          end
          templated_hash
        end
        
        def self.templatize_comments(hash)
          templated_hash = hash.dup
          hash.each_pair do |k, comment|
            next if k.end_with? "__array_template"
            templated_hash.delete(k)
            templated_hash["#{k}.__template"] = comment
          end
          templated_hash
        end
      end
    end