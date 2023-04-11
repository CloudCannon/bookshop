# frozen_string_literal: true

module JekyllBookshop
  class Tag < JekyllBookshop::CommonTag
    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      context["site"]["bookshop_component_locations"].freeze
    end

    # Map component names to the .jekyll.html files found in bookshop
    def render(context)
      file = render_variable(context) || @file
      cname = file.strip.split("/").last
      
      standard_file = "#{file}/#{cname}.jekyll.html";
      flat_file = "#{file}.jekyll.html";

      file = standard_file
      out = render_once_found(context, file)
      unless out
        file = flat_file
        out = render_once_found(context, file)
        unless out
          raise IOError, "Component #{cname} does not exist. Create this component by placing a file in your bookshop at #{standard_file} or #{flat_file} in your components directory"
        end
      end
      out
    end
  end
end
