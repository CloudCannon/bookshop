# frozen_string_literal: true

module JekyllBookshop
  class Tag < Jekyll::Tags::IncludeTag
    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      context["site"]["bookshop_component_locations"].freeze
    end

    # Support the bind syntax, spreading an object into params
    def parse_params(context)
      params = super

      params.each do |key, value|
        next unless key == "bind" && value.is_a?(Hash)

        value_hash = {}.merge(value)
        params = value_hash.merge(params)
        next
      end

      params.delete("bind")

      params
    end

    # Map component names to the .jekyll.html files found in bookshop
    def render(context)
      site = context.registers[:site]

      file = render_variable(context) || @file

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
