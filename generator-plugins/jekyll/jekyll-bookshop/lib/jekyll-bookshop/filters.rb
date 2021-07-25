# frozen_string_literal: true

module JekyllBookshop
  module Filters
    def addmods(classname, mods = {})
      base = classname.partition(" ").first
      mods.each do |mod|
        classname = "#{classname} #{base}--#{mod[0]}" if mod[1]
      end
      classname
    end

    def addstates(classname, states = {})
      states.each do |state|
        classname = "#{classname} is-#{state[0]}" if state[1]
      end
      classname
    end
  end
end
