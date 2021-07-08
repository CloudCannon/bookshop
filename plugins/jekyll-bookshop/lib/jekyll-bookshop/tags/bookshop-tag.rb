module JekyllBookshop
  class Tag < Jekyll::Tags::IncludeTag

    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      context['site']['bookshop_component_locations'].freeze
    end

    def expand_param_templates(params, context, parent_param)
      param_hash = {}
      new_params = {}
      
      is_template = params.key?("__template") || params.key?("__template_code")
      template = params["__template"] || params["__template_code"] || ""
      return Liquid::Template.parse(template).render(context) if is_template

      array_template = params["__array_template"] || ""
      if params.key? "__array_template"
          # We're adding a new root scope here and then removing it.
          # Who knows why, but assign and capture always add to the root scope.
          # Which is why this is hacked in, instead of using context.stack 🤷‍♂️
          context.scopes.push({})
          Liquid::Template.parse(array_template).render(context)
          template_scope = context.scopes.pop()
          template_array = template_scope[parent_param] || "";
          unless template_array.is_a? Array
            Jekyll.logger.warn "Bookshop:",
                                  "#{array_template} did not evaluate to an array
                                   as required for key #{parent_param}.__array_template"
            template_array = []
          end

          params.delete("__array_template")
          output_array = []
          template_array.each do |item|
            inflector = Dry::Inflector.new
            singular_parent = inflector.singularize(parent_param)
            next_scope = {}
            next_scope[singular_parent] = item

            context.push(next_scope)
            output_array.push(expand_param_templates(params, context, ""))
            context.pop()
          end
          return output_array
      end

      params.each_pair do |param, value|
        is_template = param.end_with?("_template") || param.end_with?("_template_code")
        if is_template
          param_root, param_remainder = param.split('.', 2)
          param_hash[param_root] ||= {}
          param_hash[param_root][param_remainder] = value
        else
          new_params[param] = value
        end
      end
      param_hash.each_pair do |param, values|
        new_params[param] = expand_param_templates(values, context, param)
      end
      new_params
    end

    # Support the bind syntax, spreading an object into params
    def parse_params(context)
      params = super

      params.each do |key, value|
        if key == 'bind' && value.is_a?(Hash)
          valueHash = {}.merge(value)
          params = valueHash.merge(params)
          next
        end
      end

      params.delete('bind')
      context.scopes.push({}) # Do all expansion in an ephemeral root scope
      params = expand_param_templates(params, context, "")
      context.scopes.pop()

      params
    end

    # Map component names to the .jekyll.html files found in bookshop
    def render(context)
      site = context.registers[:site]

      file = render_variable(context) || @file
      is_template = file.end_with? "__template"

      file = file.gsub(".__template", "")
      cname = file.strip.split("/").last
      file = "#{file}/#{cname}.jekyll.html"
      validate_file_name(file)

      path = locate_include_file(context, file, site.safe)
      return unless path

      add_include_to_dependency(site, path, context)

      partial = load_cached_partial(path, context)

      context.stack do
        context["include"] = parse_params(context) if @params
        begin
          partial.render!(context)
        rescue Liquid::Error => e
          e.template_name = path
          e.markup_context = "included " if e.markup_context.nil?
          raise e
        end
      end

    end
  end
end