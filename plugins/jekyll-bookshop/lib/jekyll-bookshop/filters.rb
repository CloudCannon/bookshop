module JekyllBookshop
  module Filters
    def addmods(classname, mods = {})
      base = classname.partition(" ").first
      mods.each do |mod|
        if mod[1]
          classname = "#{classname} #{base}--#{mod[0]}"
        end
      end
      return classname
    end

    def addstates(classname, states = {})
      states.each do |state|
        if state[1]
          classname = "#{classname} is-#{state[0]}"
        end
      end
      return classname
    end
  end
end