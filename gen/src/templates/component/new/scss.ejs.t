---
to: <%= directory %>/<%= name %>/<%= name %>.scss
unless_exists: true
---
.c-<%= name %> { $c: &;
<% for(var i=0; i<mods.length; i++) {%>
    &--<%= mods[i] %> {
        
    }
<% } %>
<% for(var i=0; i<elements.length; i++) {%>
    &__<%= elements[i] %> {

    }
<% } %>
}