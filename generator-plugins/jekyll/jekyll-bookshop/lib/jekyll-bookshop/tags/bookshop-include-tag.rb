# frozen_string_literal: true

module JekyllBookshop
  class IncludeTag < JekyllBookshop::CommonTag
    # Look for includes in the built bookshop directory
    def tag_includes_dirs(context)
      context["site"]["bookshop_shared_locations"].freeze
    end

    # Map include names to the .jekyll.html files found in bookshop
    def render(context)
      file = render_variable(context) || @file

      file = "#{file}.jekyll.html"
      render_once_found(context, file)
    end
  end
end
